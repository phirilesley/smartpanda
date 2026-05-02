using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SmartSchool.API.Features;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Settings;

namespace SmartSchool.API.Controllers.Phase7;

[ApiController]
[Route("api/feature-flags")]
[Authorize(Policy = PolicyNames.FeatureFlagsManage)]
[EnableRateLimiting("sensitive-write")]
public class TenantFeatureFlagsController(ITenantFeatureFlagService featureFlagService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TenantFeatureFlag>>> GetFlags([FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty) return BadRequest("tenantId is required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var flags = await featureFlagService.GetFlagsAsync(tenantId, cancellationToken);
        return Ok(flags);
    }

    [HttpPost]
    public async Task<ActionResult<TenantFeatureFlag>> UpsertFlag([FromBody] UpsertTenantFeatureFlagRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await featureFlagService.UpsertAsync(
            request.TenantId,
            request.FeatureCode,
            request.IsEnabled,
            request.Description,
            cancellationToken);

        return Ok(entity);
    }
}

public sealed record UpsertTenantFeatureFlagRequest(Guid TenantId, string FeatureCode, bool IsEnabled, string Description);
