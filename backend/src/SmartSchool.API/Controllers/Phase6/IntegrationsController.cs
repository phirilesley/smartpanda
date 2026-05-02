using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Integrations;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/integrations")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
[EnableRateLimiting("sensitive-write")]
public class IntegrationsController(SmartSchoolDbContext dbContext, IIntegrationSecretProtector secretProtector) : ControllerBase
{
    [HttpGet("settings")]
    public async Task<ActionResult<IReadOnlyList<IntegrationSettingView>>> GetSettings([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.IntegrationSettings
            .AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.IntegrationType)
            .ThenBy(x => x.ProviderName)
            .ToListAsync(cancellationToken);

        var result = items.Select(x => new IntegrationSettingView(
            x.Id,
            x.TenantId,
            x.SchoolId,
            x.IntegrationType,
            x.ProviderName,
            x.IsEnabled,
            MaskProtectedSettings(x.EncryptedSettingsJson),
            x.CreatedAtUtc,
            x.UpdatedAtUtc)).ToList();

        return Ok(result);
    }

    [HttpPost("settings")]
    public async Task<ActionResult<IntegrationSettingView>> UpsertSetting([FromBody] UpsertIntegrationSettingRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var integrationType = request.IntegrationType.Trim();
        var providerName = request.ProviderName.Trim();

        var existing = await dbContext.IntegrationSettings.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.IntegrationType == integrationType &&
            x.ProviderName == providerName,
            cancellationToken);

        if (existing is null)
        {
            var encrypted = ResolveEncryptedPayload(request);
            existing = new IntegrationSetting
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                IntegrationType = integrationType,
                ProviderName = providerName,
                EncryptedSettingsJson = encrypted,
                IsEnabled = request.IsEnabled
            };
            dbContext.IntegrationSettings.Add(existing);
        }
        else
        {
            existing.EncryptedSettingsJson = ResolveEncryptedPayload(request);
            existing.IsEnabled = request.IsEnabled;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new IntegrationSettingView(
            existing.Id,
            existing.TenantId,
            existing.SchoolId,
            existing.IntegrationType,
            existing.ProviderName,
            existing.IsEnabled,
            MaskProtectedSettings(existing.EncryptedSettingsJson),
            existing.CreatedAtUtc,
            existing.UpdatedAtUtc));
    }

    [HttpPost("webhooks")]
    [AllowAnonymous]
    public async Task<ActionResult<PaymentGatewayWebhook>> RegisterWebhook([FromBody] RegisterPaymentGatewayWebhookRequest request, CancellationToken cancellationToken)
    {
        var entity = new PaymentGatewayWebhook
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ProviderName = request.ProviderName.Trim(),
            EventType = request.EventType.Trim(),
            PayloadJson = request.PayloadJson,
            ReceivedAtUtc = DateTime.UtcNow,
            IsProcessed = false
        };

        dbContext.PaymentGatewayWebhooks.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("webhooks/{webhookId:guid}/mark-processed")]
    public async Task<ActionResult<PaymentGatewayWebhook>> MarkWebhookProcessed(Guid webhookId, [FromBody] MarkWebhookProcessedRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var webhook = await dbContext.PaymentGatewayWebhooks.FirstOrDefaultAsync(x =>
            x.Id == webhookId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (webhook is null) return NotFound();

        webhook.IsProcessed = true;
        webhook.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(webhook);
    }

    [HttpPost("settings/rotate-secrets")]
    public async Task<ActionResult<RotateIntegrationSecretsResponse>> RotateSecrets([FromBody] RotateIntegrationSecretsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var rotatedCount = await secretProtector.RotateSecretsAsync(
            request.TenantId,
            request.SchoolId,
            request.ProviderName,
            cancellationToken);

        return Ok(new RotateIntegrationSecretsResponse(rotatedCount));
    }

    private string ResolveEncryptedPayload(UpsertIntegrationSettingRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.PlainSettingsJson))
        {
            return secretProtector.Protect(request.PlainSettingsJson.Trim());
        }

        return request.EncryptedSettingsJson?.Trim()
            ?? throw new InvalidOperationException("Either plainSettingsJson or encryptedSettingsJson is required.");
    }

    private static string MaskProtectedSettings(string encryptedSettingsJson)
    {
        if (string.IsNullOrWhiteSpace(encryptedSettingsJson))
        {
            return "empty";
        }

        var length = encryptedSettingsJson.Length;
        if (length <= 12)
        {
            return "********";
        }

        return $"{encryptedSettingsJson[..6]}...{encryptedSettingsJson[^6..]}";
    }
}

public sealed record UpsertIntegrationSettingRequest(Guid TenantId, Guid SchoolId, string IntegrationType, string ProviderName, string? EncryptedSettingsJson, string? PlainSettingsJson, bool IsEnabled);
public sealed record RegisterPaymentGatewayWebhookRequest(Guid TenantId, Guid SchoolId, string ProviderName, string EventType, string PayloadJson);
public sealed record MarkWebhookProcessedRequest(Guid TenantId, Guid SchoolId);
public sealed record RotateIntegrationSecretsRequest(Guid TenantId, Guid SchoolId, string? ProviderName);
public sealed record RotateIntegrationSecretsResponse(int RotatedCount);
public sealed record IntegrationSettingView(Guid Id, Guid TenantId, Guid SchoolId, string IntegrationType, string ProviderName, bool IsEnabled, string MaskedSecret, DateTime CreatedAtUtc, DateTime? UpdatedAtUtc);
