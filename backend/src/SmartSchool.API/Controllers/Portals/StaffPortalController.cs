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
using SmartSchool.API.Features;
using SmartSchool.API.Security;
using SmartSchool.Application.Portals;

namespace SmartSchool.API.Controllers.Portals;

[ApiController]
[Route("api/portal/staff")]
[Authorize(Policy = PolicyNames.PortalStaffAccess)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
[RequireFeatureFlag("portal.staff")]
public class StaffPortalController(IPortalDashboardService portalDashboardService) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<StaffPortalDashboard>> GetDashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid staffId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || staffId == Guid.Empty)
        {
            return BadRequest("tenantId, schoolId and staffId are required.");
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

        var dashboard = await portalDashboardService.GetStaffDashboardAsync(tenantId, schoolId, userId.Value, staffId, cancellationToken);
        if (dashboard is null) return NotFound();
        return Ok(dashboard);
    }
}
