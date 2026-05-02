using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSchool.API.Features;
using SmartSchool.API.Security;
using SmartSchool.Application.Portals;

namespace SmartSchool.API.Controllers.Portals;

[ApiController]
[Route("api/portal/parent")]
[Authorize(Policy = PolicyNames.PortalParentAccess)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
[RequireFeatureFlag("portal.parent")]
public class ParentPortalController(IPortalDashboardService portalDashboardService) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<ParentPortalDashboard>> GetDashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid studentId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || studentId == Guid.Empty)
        {
            return BadRequest("tenantId, schoolId and studentId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var userId = User.GetUserId();
        if (!userId.HasValue)
        {
            return Forbid();
        }

        var dashboard = await portalDashboardService.GetParentDashboardAsync(tenantId, schoolId, userId.Value, studentId, cancellationToken);
        if (dashboard is null) return NotFound();
        return Ok(dashboard);
    }
}
