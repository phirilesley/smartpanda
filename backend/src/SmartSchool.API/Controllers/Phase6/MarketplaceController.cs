using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Persistence.Data;
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/marketplace")]
[Route("api/ecosystem")]
[Route("api/integrations")]
public class MarketplaceController : ControllerBase
{
    private readonly SmartSchoolDbContext dbContext;

    public MarketplaceController(SmartSchoolDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    [HttpGet("apps")]
    public async Task<ActionResult<PagedResponse<MarketplaceApp>>> GetMarketplaceApps([FromQuery] MarketplaceAppsRequest request, CancellationToken cancellationToken)
    {
        var query = dbContext.MarketplaceApps.AsNoTracking();

        if (request.Category != null) query = query.Where(a => a.Category == request.Category);
        if (request.IsFree.HasValue) query = query.Where(a => a.IsFree == request.IsFree.Value);
        if (request.IsInstalled.HasValue) query = query.Where(a => a.IsInstalled == request.IsInstalled.Value);
        if (request.MinRating.HasValue) query = query.Where(a => a.AverageRating >= request.MinRating.Value);
        if (request.Search != null) query = query.Where(a => a.Name.Contains(request.Search) || a.Description.Contains(request.Search));

        var apps = await query
            .OrderByDescending(a => a.AverageRating)
            .ThenBy(a => a.Name)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var totalCount = await query.CountAsync(cancellationToken);

        return Ok(new PagedResponse<MarketplaceApp>
        {
            Data = apps.ToArray(),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        });
    }

    [HttpGet("apps/{appId}")]
    public async Task<ActionResult<MarketplaceAppDetails>> GetMarketplaceAppDetails(Guid appId, CancellationToken cancellationToken)
    {
        var app = await dbContext.MarketplaceApps
            .Include(a => a.AppVersions)
            .Include(a => a.Reviews)
            .Include(a => a.Installations)
            .FirstOrDefaultAsync(a => a.Id == appId, cancellationToken);

        if (app == null) return NotFound();

        var appDetails = new MarketplaceAppDetails
        {
            App = app,
            Versions = app.AppVersions.OrderByDescending(v => v.Version).ToArray(),
            Reviews = app.Reviews.OrderByDescending(r => r.CreatedAtUtc).Take(10).ToArray(),
            TotalInstallations = app.Installations.Count(i => i.IsActive),
            RecentInstallations = app.Installations.Count(i => i.IsActive && i.InstalledAtUtc >= DateTime.UtcNow.AddDays(-30))
        };

        return Ok(appDetails);
    }

    [HttpPost("apps/{appId}/install")]
    [Authorize(Policy = PolicyNames.SchoolAccess)]
    public async Task<ActionResult<AppInstallationResponse>> InstallApp(Guid appId, [FromBody] InstallAppRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var app = await dbContext.MarketplaceApps
            .FirstOrDefaultAsync(a => a.Id == appId && a.IsActive, cancellationToken);

        if (app == null) return NotFound("App not found or inactive");

        // Check if already installed
        var existingInstallation = await dbContext.AppInstallations
            .FirstOrDefaultAsync(i => i.TenantId == request.TenantId && i.SchoolId == request.SchoolId && i.AppId == appId && i.IsActive, cancellationToken);

        if (existingInstallation != null) return BadRequest("App is already installed");

        // Create installation
        var installation = new AppInstallation
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AppId = appId,
            VersionId = request.VersionId ?? app.AppVersions.OrderByDescending(v => v.Version).First().Id,
            Configuration = request.Configuration ?? "{}",
            Status = "Installing",
            InstalledByUserId = request.InstalledByUserId,
            InstalledAtUtc = DateTime.UtcNow,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.AppInstallations.Add(installation);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Generate API keys for the app
        var apiKeys = await GenerateAppApiKeys(installation.Id, cancellationToken);

        // Simulate installation process
        installation.Status = "Installed";
        installation.ApiKeyId = apiKeys.Id;
        installation.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AppInstallationResponse
        {
            Success = true,
            InstallationId = installation.Id,
            ApiKey = apiKeys.ApiKey,
            ApiSecret = apiKeys.ApiSecret,
            WebhookUrl = $"/api/webhooks/apps/{appId}",
            Status = "Installed"
        });
    }

    [HttpPost("apps/{appId}/uninstall")]
    [Authorize(Policy = PolicyNames.SchoolAccess)]
    public async Task<ActionResult> UninstallApp(Guid appId, [FromBody] UninstallAppRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var installation = await dbContext.AppInstallations
            .FirstOrDefaultAsync(i => i.TenantId == request.TenantId && i.SchoolId == request.SchoolId && i.AppId == appId && i.IsActive, cancellationToken);

        if (installation == null) return NotFound("App installation not found");

        installation.IsActive = false;
        installation.Status = "Uninstalled";
        installation.UninstalledAtUtc = DateTime.UtcNow;
        installation.UninstalledByUserId = request.UninstalledByUserId;
        installation.UpdatedAtUtc = DateTime.UtcNow;

        // Deactivate API keys
        var apiKey = await dbContext.AppApiKeys.FirstOrDefaultAsync(k => k.Id == installation.ApiKeyId, cancellationToken);
        if (apiKey != null)
        {
            apiKey.IsActive = false;
            apiKey.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { Success = true, Message = "App uninstalled successfully" });
    }

    [HttpGet("my-apps")]
    [Authorize(Policy = PolicyNames.SchoolAccess)]
    public async Task<ActionResult<IReadOnlyList<InstalledApp>>> GetMyApps([FromQuery] Guid tenantId, [FromQuery] Guid? schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty) return BadRequest("tenantId is required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var installations = await dbContext.AppInstallations
            .Include(i => i.App)
            .Include(i => i.Version)
            .Where(i => i.TenantId == tenantId && (!schoolId.HasValue || i.SchoolId == schoolId.Value) && i.IsActive)
            .Select(i => new InstalledApp
            {
                InstallationId = i.Id,
                App = i.App,
                Version = i.Version,
                InstalledAt = i.InstalledAtUtc,
                Status = i.Status,
                Configuration = i.Configuration,
                LastUsedAt = i.LastUsedAtUtc,
                UsageCount = i.UsageCount
            })
            .ToListAsync(cancellationToken);

        return Ok(installations);
    }

    [HttpPost("apps/{appId}/configure")]
    [Authorize(Policy = PolicyNames.SchoolAccess)]
    public async Task<ActionResult> ConfigureApp(Guid appId, [FromBody] ConfigureAppRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var installation = await dbContext.AppInstallations
            .FirstOrDefaultAsync(i => i.TenantId == request.TenantId && i.SchoolId == request.SchoolId && i.AppId == appId && i.IsActive, cancellationToken);

        if (installation == null) return NotFound("App installation not found");

        installation.Configuration = request.Configuration;
        installation.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { Success = true, Message = "App configuration updated successfully" });
    }

    [HttpPost("apps/{appId}/review")]
    [Authorize(Policy = PolicyNames.SchoolAccess)]
    public async Task<ActionResult<AppReview>> SubmitAppReview(Guid appId, [FromBody] SubmitAppReviewRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var review = new AppReview
        {
            Id = Guid.NewGuid(),
            AppId = appId,
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            UserId = request.UserId,
            Rating = request.Rating,
            Title = request.Title,
            Comment = request.Comment,
            IsVerified = true, // Auto-verify for school installations
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.AppReviews.Add(review);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Update app average rating
        await UpdateAppAverageRating(appId, cancellationToken);

        return Ok(review);
    }

    [HttpPost("developer/register")]
    public async Task<ActionResult<DeveloperRegistrationResponse>> RegisterDeveloper([FromBody] DeveloperRegistrationRequest request, CancellationToken cancellationToken)
    {
        var developer = new Developer
        {
            Id = Guid.NewGuid(),
            CompanyName = request.CompanyName,
            ContactName = request.ContactName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Website = request.Website,
            Description = request.Description,
            Status = "Pending",
            SubmittedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.Developers.Add(developer);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DeveloperRegistrationResponse
        {
            Success = true,
            DeveloperId = developer.Id,
            Status = "Pending",
            Message = "Developer registration submitted successfully. You will be contacted within 2 business days."
        });
    }

    [HttpPost("developer/apps")]
    [Authorize(Policy = PolicyNames.Developer)]
    public async Task<ActionResult<MarketplaceApp>> SubmitApp([FromBody] SubmitAppRequest request, CancellationToken cancellationToken)
    {
        var app = new MarketplaceApp
        {
            Id = Guid.NewGuid(),
            DeveloperId = request.DeveloperId,
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            IconUrl = request.IconUrl,
            Screenshots = request.Screenshots ?? Array.Empty<string>(),
            PricingModel = request.PricingModel,
            Price = request.Price,
            TrialPeriodDays = request.TrialPeriodDays,
            Features = request.Features ?? Array.Empty<string>(),
            Requirements = request.Requirements ?? Array.Empty<string>(),
            DocumentationUrl = request.DocumentationUrl,
            SupportUrl = request.SupportUrl,
            PrivacyPolicyUrl = request.PrivacyPolicyUrl,
            TermsOfServiceUrl = request.TermsOfServiceUrl,
            Status = "Pending",
            SubmittedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.MarketplaceApps.Add(app);

        // Add initial version
        var version = new AppVersion
        {
            Id = Guid.NewGuid(),
            AppId = app.Id,
            Version = request.InitialVersion,
            ReleaseNotes = request.ReleaseNotes,
            DownloadUrl = request.DownloadUrl,
            MinimumSystemVersion = request.MinimumSystemVersion,
            Status = "Pending",
            SubmittedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.AppVersions.Add(version);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(app);
    }

    [HttpPost("webhooks/apps/{appId}")]
    public async Task<ActionResult> HandleAppWebhook(Guid appId, [FromBody] JsonElement webhookData, CancellationToken cancellationToken)
    {
        // Verify API key from headers
        var apiKey = Request.Headers["X-API-Key"].FirstOrDefault();
        var apiSecret = Request.Headers["X-API-Secret"].FirstOrDefault();

        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            return Unauthorized("API credentials required");

        var keyRecord = await dbContext.AppApiKeys
            .Include(k => k.Installation)
            .FirstOrDefaultAsync(k => k.ApiKey == apiKey && k.ApiSecret == apiSecret && k.IsActive, cancellationToken);

        if (keyRecord == null || keyRecord.Installation.AppId != appId)
            return Unauthorized("Invalid API credentials");

        // Log webhook
        var webhookLog = new AppWebhookLog
        {
            Id = Guid.NewGuid(),
            AppId = appId,
            InstallationId = keyRecord.InstallationId,
            EventType = Request.Headers["X-Event-Type"].FirstOrDefault() ?? "Unknown",
            Payload = webhookData.GetRawText(),
            Processed = false,
            ReceivedAtUtc = DateTime.UtcNow
        };

        dbContext.AppWebhookLogs.Add(webhookLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Process webhook based on event type
        await ProcessAppWebhook(webhookLog, cancellationToken);

        return Ok(new { Success = true, Message = "Webhook processed successfully" });
    }

    [HttpGet("analytics/developer/{developerId}")]
    [Authorize(Policy = PolicyNames.Developer)]
    public async Task<ActionResult<DeveloperAnalytics>> GetDeveloperAnalytics(Guid developerId, CancellationToken cancellationToken)
    {
        var analytics = new DeveloperAnalytics
        {
            DeveloperId = developerId,
            TotalApps = await dbContext.MarketplaceApps.CountAsync(a => a.DeveloperId == developerId, cancellationToken),
            ActiveApps = await dbContext.MarketplaceApps.CountAsync(a => a.DeveloperId == developerId && a.Status == "Active", cancellationToken),
            TotalInstallations = await dbContext.AppInstallations
                .Join(dbContext.MarketplaceApps, i => i.AppId, a => a.Id, (i, a) => new { i, a })
                .CountAsync(x => x.a.DeveloperId == developerId && x.i.IsActive, cancellationToken),
            ActiveInstallations = await dbContext.AppInstallations
                .Join(dbContext.MarketplaceApps, i => i.AppId, a => a.Id, (i, a) => new { i, a })
                .CountAsync(x => x.a.DeveloperId == developerId && x.i.IsActive && x.i.Status == "Installed", cancellationToken),
            TotalRevenue = await CalculateDeveloperRevenue(developerId, cancellationToken),
            AverageRating = await dbContext.MarketplaceApps
                .Where(a => a.DeveloperId == developerId && a.AverageRating > 0)
                .DefaultIfEmpty()
                .Select(a => a.AverageRating)
                .AverageAsync(cancellationToken),
            RecentDownloads = await dbContext.AppInstallations
                .Join(dbContext.MarketplaceApps, i => i.AppId, a => a.Id, (i, a) => new { i, a })
                .CountAsync(x => x.a.DeveloperId == developerId && x.i.InstalledAtUtc >= DateTime.UtcNow.AddDays(-30), cancellationToken)
        };

        return Ok(analytics);
    }

    // Helper Methods
    private async Task<AppApiKey> GenerateAppApiKeys(Guid installationId, CancellationToken cancellationToken)
    {
        var apiKey = GenerateSecureKey("API");
        var apiSecret = GenerateSecureKey("SECRET");

        var keyRecord = new AppApiKey
        {
            Id = Guid.NewGuid(),
            InstallationId = installationId,
            ApiKey = apiKey,
            ApiSecret = apiSecret,
            Permissions = new[] { "read", "write", "webhook" },
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = DateTime.UtcNow.AddYears(1)
        };

        dbContext.AppApiKeys.Add(keyRecord);
        await dbContext.SaveChangesAsync(cancellationToken);

        return keyRecord;
    }

    private string GenerateSecureKey(string prefix)
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        var key = Convert.ToBase64String(bytes).Replace("+", "").Replace("/", "").Replace("=", "");
        return $"{prefix}_{key.Substring(0, 24)}";
    }

    private async Task UpdateAppAverageRating(Guid appId, CancellationToken cancellationToken)
    {
        var reviews = await dbContext.AppReviews
            .Where(r => r.AppId == appId && r.IsVerified)
            .ToListAsync(cancellationToken);

        if (reviews.Any())
        {
            var averageRating = reviews.Average(r => r.Rating);
            var app = await dbContext.MarketplaceApps.FirstOrDefaultAsync(a => a.Id == appId, cancellationToken);
            if (app != null)
            {
                app.AverageRating = averageRating;
                app.TotalReviews = reviews.Count;
                app.UpdatedAtUtc = DateTime.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }

    private async Task ProcessAppWebhook(AppWebhookLog webhookLog, CancellationToken cancellationToken)
    {
        // Process webhook based on event type
        switch (webhookLog.EventType.ToLower())
        {
            case "user.created":
                await ProcessUserCreatedWebhook(webhookLog, cancellationToken);
                break;
            case "grade.updated":
                await ProcessGradeUpdatedWebhook(webhookLog, cancellationToken);
                break;
            case "attendance.marked":
                await ProcessAttendanceMarkedWebhook(webhookLog, cancellationToken);
                break;
            default:
                // Log unknown event type
                break;
        }

        webhookLog.Processed = true;
        webhookLog.ProcessedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task ProcessUserCreatedWebhook(AppWebhookLog webhookLog, CancellationToken cancellationToken)
    {
        // Process user creation webhook
        var payload = JsonSerializer.Deserialize<UserCreatedWebhookPayload>(webhookLog.Payload);
        if (payload != null)
        {
            // Update installation usage
            var installation = await dbContext.AppInstallations
                .FirstOrDefaultAsync(i => i.Id == webhookLog.InstallationId, cancellationToken);
            
            if (installation != null)
            {
                installation.UsageCount++;
                installation.LastUsedAtUtc = DateTime.UtcNow;
                installation.UpdatedAtUtc = DateTime.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }

    private async Task ProcessGradeUpdatedWebhook(AppWebhookLog webhookLog, CancellationToken cancellationToken)
    {
        // Process grade update webhook
        var payload = JsonSerializer.Deserialize<GradeUpdatedWebhookPayload>(webhookLog.Payload);
        if (payload != null)
        {
            // Update installation usage
            var installation = await dbContext.AppInstallations
                .FirstOrDefaultAsync(i => i.Id == webhookLog.InstallationId, cancellationToken);
            
            if (installation != null)
            {
                installation.UsageCount++;
                installation.LastUsedAtUtc = DateTime.UtcNow;
                installation.UpdatedAtUtc = DateTime.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }

    private async Task ProcessAttendanceMarkedWebhook(AppWebhookLog webhookLog, CancellationToken cancellationToken)
    {
        // Process attendance webhook
        var payload = JsonSerializer.Deserialize<AttendanceMarkedWebhookPayload>(webhookLog.Payload);
        if (payload != null)
        {
            // Update installation usage
            var installation = await dbContext.AppInstallations
                .FirstOrDefaultAsync(i => i.Id == webhookLog.InstallationId, cancellationToken);
            
            if (installation != null)
            {
                installation.UsageCount++;
                installation.LastUsedAtUtc = DateTime.UtcNow;
                installation.UpdatedAtUtc = DateTime.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }

    private async Task<decimal> CalculateDeveloperRevenue(Guid developerId, CancellationToken cancellationToken)
    {
        // Calculate revenue from paid apps
        var paidInstallations = await dbContext.AppInstallations
            .Join(dbContext.MarketplaceApps, i => i.AppId, a => a.Id, (i, a) => new { i, a })
            .Where(x => x.a.DeveloperId == developerId && x.i.IsActive && x.a.Price > 0)
            .ToListAsync(cancellationToken);

        return paidInstallations.Sum(x => x.a.Price);
    }
}

// DTOs
public sealed record MarketplaceAppsRequest(string? Category = null, bool? IsFree = null, bool? IsInstalled = null, double? MinRating = null, string? Search = null, int Page = 1, int PageSize = 20);
// PagedResponse moved to common models
public sealed record InstallAppRequest(Guid TenantId, Guid SchoolId, Guid? VersionId, string? Configuration, Guid InstalledByUserId);
public sealed record AppInstallationResponse(bool Success, Guid InstallationId, string ApiKey, string ApiSecret, string WebhookUrl, string Status);
public sealed record UninstallAppRequest(Guid TenantId, Guid SchoolId, Guid UninstalledByUserId);
public sealed record ConfigureAppRequest(Guid TenantId, Guid SchoolId, string Configuration);
public sealed record SubmitAppReviewRequest(Guid TenantId, Guid SchoolId, Guid UserId, int Rating, string Title, string Comment);
public sealed record DeveloperRegistrationRequest(string CompanyName, string ContactName, string Email, string PhoneNumber, string Website, string Description);
public sealed record DeveloperRegistrationResponse(bool Success, Guid DeveloperId, string Status, string Message);
public sealed record SubmitAppRequest(Guid DeveloperId, string Name, string Description, string Category, string IconUrl, string[] Screenshots, string PricingModel, decimal Price, int TrialPeriodDays, string[] Features, string[] Requirements, string DocumentationUrl, string SupportUrl, string PrivacyPolicyUrl, string TermsOfServiceUrl, string InitialVersion, string ReleaseNotes, string DownloadUrl, string MinimumSystemVersion);
public sealed record DeveloperAnalytics(Guid DeveloperId, int TotalApps, int ActiveApps, int TotalInstallations, int ActiveInstallations, decimal TotalRevenue, double AverageRating, int RecentDownloads);

// Data DTOs
public sealed record MarketplaceAppDetails(MarketplaceApp App, AppVersion[] Versions, AppReview[] Reviews, int TotalInstallations, int RecentInstallations);
public sealed record InstalledApp(Guid InstallationId, MarketplaceApp App, AppVersion Version, DateTime InstalledAt, string Status, string Configuration, DateTime? LastUsedAt, int UsageCount);

// Webhook Payload DTOs
public sealed record UserCreatedWebhookPayload(Guid UserId, string Email, string Role, DateTime CreatedAt);
public sealed record GradeUpdatedWebhookPayload(Guid StudentId, Guid SubjectId, decimal Marks, string Grade, DateTime UpdatedAt);
public sealed record AttendanceMarkedWebhookPayload(Guid StudentId, Guid ClassId, DateOnly Date, bool IsPresent, DateTime MarkedAt);

// Entities moved to Domain project
