using Microsoft.AspNetCore.Identity;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Domain.Modules.Security;

namespace SmartSchool.Domain.Modules.Integrations;

public class MarketplaceApp : TenantSchoolEntityBase
{
    public Guid DeveloperId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public string[] Screenshots { get; set; } = Array.Empty<string>();
    public string PricingModel { get; set; } = string.Empty; // Free, Paid, Freemium
    public decimal Price { get; set; }
    public int TrialPeriodDays { get; set; }
    public string[] Features { get; set; } = Array.Empty<string>();
    public string[] Compatibility { get; set; } = Array.Empty<string>();
    public string[] Requirements { get; set; } = Array.Empty<string>();
    public string PrivacyPolicy { get; set; } = string.Empty;
    public string TermsOfService { get; set; } = string.Empty;
    public string SupportEmail { get; set; } = string.Empty;
    public string SupportPhone { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string DocumentationUrl { get; set; } = string.Empty;
    public string[] ApiEndpoints { get; set; } = Array.Empty<string>();
    public string WebhookUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Active, Rejected, Suspended
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public int TotalDownloads { get; set; }
    public string Version { get; set; } = string.Empty;
    public DateTime SubmissionDate { get; set; }
    public DateTime? ApprovedAtUtc { get; set; }
    public DateTime LastUpdated { get; set; }

    // Navigation properties
    public MarketplaceDeveloper Developer { get; set; } = null!;
    public MarketplaceCategory Category { get; set; } = null!;
    public ICollection<AppVersion> AppVersions { get; set; } = new List<AppVersion>();
    public ICollection<AppReview> Reviews { get; set; } = new List<AppReview>();
    public ICollection<AppInstallation> Installations { get; set; } = new List<AppInstallation>();
}

public class AppVersion : TenantEntityBase
{
    public Guid AppId { get; set; }
    public string Version { get; set; } = string.Empty;
    public string ReleaseNotes { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
    public string MinimumSystemVersion { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAtUtc { get; set; }
    public DateTime? ApprovedAtUtc { get; set; }

    // Navigation properties
    public MarketplaceApp App { get; set; } = null!;
}

public class AppInstallation : TenantSchoolEntityBase
{
    public Guid AppId { get; set; }
    public Guid VersionId { get; set; }
    public Guid UserId { get; set; }
    public DateTime InstallationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Configuration { get; set; } = string.Empty;
    public Guid? PaymentId { get; set; }
    public Guid? ApiKeyId { get; set; }
    public Guid? InstalledByUserId { get; set; }
    public DateTime? UninstalledAtUtc { get; set; }
    public Guid? UninstalledByUserId { get; set; }
    public DateTime? LastUsedAtUtc { get; set; }
    public int UsageCount { get; set; }
    public bool IsActive { get; set; }

    // Navigation properties
    public MarketplaceApp App { get; set; } = null!;
    public AppVersion AppVersion { get; set; } = null!;
}

public class AppApiKey : TenantEntityBase
{
    public Guid InstallationId { get; set; }
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
    public string[] Permissions { get; set; } = Array.Empty<string>();
    public bool IsActive { get; set; }
    public DateTime? ExpiresAtUtc { get; set; }
    public DateTime? LastUsedAtUtc { get; set; }

    // Navigation properties
    public AppInstallation Installation { get; set; } = null!;
}

public class AppReview : TenantSchoolEntityBase
{
    public Guid AppId { get; set; }
    public Guid UserId { get; set; }
    public Guid InstallationId { get; set; }
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Pros { get; set; } = string.Empty;
    public string Cons { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public MarketplaceApp App { get; set; } = null!;
}

public class MarketplaceDeveloper : TenantEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string CompanyWebsite { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected, Suspended
    public DateTime RegistrationDate { get; set; }
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
    public DateTime? ApprovedAtUtc { get; set; }

    // Navigation properties
    public ICollection<MarketplaceApp> Apps { get; set; } = new List<MarketplaceApp>();
}

public class MarketplaceCategory : TenantEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
}

public class AppWebhookLog : TenantEntityBase
{
    public Guid AppId { get; set; }
    public Guid InstallationId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public bool Processed { get; set; }
    public DateTime ReceivedAtUtc { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
    public string? ProcessingError { get; set; }

    // Navigation properties
    public MarketplaceApp App { get; set; } = null!;
    public AppInstallation Installation { get; set; } = null!;
}
