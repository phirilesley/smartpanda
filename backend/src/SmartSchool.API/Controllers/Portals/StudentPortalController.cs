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
[Route("api/portal/student")]
[Authorize(Policy = PolicyNames.PortalStudentAccess)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
[RequireFeatureFlag("portal.student")]
public class StudentPortalController(IPortalDashboardService portalDashboardService) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<StudentPortalDashboard>> GetDashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid studentId, CancellationToken cancellationToken)
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

        var dashboard = await portalDashboardService.GetStudentDashboardAsync(tenantId, schoolId, userId.Value, studentId, cancellationToken);
        if (dashboard is null) return NotFound();
        return Ok(dashboard);
    }
}
