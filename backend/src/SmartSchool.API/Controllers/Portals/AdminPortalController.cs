using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Portals;

[ApiController]
[Route("api/portal/admin")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AdminPortalController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("school-dashboard")]
    [Authorize(Policy = PolicyNames.SchoolsManage)]
    public async Task<ActionResult<SchoolAdminDashboardResponse>> GetSchoolDashboard(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var students = await dbContext.Students.CountAsync(
            x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted,
            cancellationToken);

        var staff = await dbContext.StaffMembers.CountAsync(
            x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted,
            cancellationToken);

        var openInvoices = await dbContext.StudentInvoices.CountAsync(
            x => x.TenantId == tenantId
                 && x.SchoolId == schoolId
                 && !x.IsDeleted
                 && x.Status != "Paid",
            cancellationToken);

        var openTickets = await dbContext.HelpDeskTickets.CountAsync(
            x => x.TenantId == tenantId
                 && x.SchoolId == schoolId
                 && !x.IsDeleted
                 && x.Status != "Closed",
            cancellationToken);

        var response = new SchoolAdminDashboardResponse(
            tenantId,
            schoolId,
            students,
            staff,
            openInvoices,
            openTickets,
            DateTime.UtcNow);

        return Ok(response);
    }

    [HttpGet("tenant-dashboard")]
    [Authorize(Policy = PolicyNames.PlatformManage)]
    public async Task<ActionResult<TenantAdminDashboardResponse>> GetTenantDashboard(
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty)
        {
            return BadRequest("tenantId is required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var schools = await dbContext.Schools.CountAsync(x => x.TenantId == tenantId && !x.IsDeleted, cancellationToken);
        var students = await dbContext.Students.CountAsync(x => x.TenantId == tenantId && !x.IsDeleted, cancellationToken);
        var staff = await dbContext.StaffMembers.CountAsync(x => x.TenantId == tenantId && !x.IsDeleted, cancellationToken);

        var response = new TenantAdminDashboardResponse(
            tenantId,
            schools,
            students,
            staff,
            DateTime.UtcNow);

        return Ok(response);
    }

    [HttpGet("platform-dashboard")]
    [Authorize(Policy = PolicyNames.PlatformManage)]
    public async Task<ActionResult<PlatformAdminDashboardResponse>> GetPlatformDashboard(CancellationToken cancellationToken)
    {
        var tenants = await dbContext.Tenants.CountAsync(x => !x.IsDeleted, cancellationToken);
        var schools = await dbContext.Schools.CountAsync(x => !x.IsDeleted, cancellationToken);
        var students = await dbContext.Students.CountAsync(x => !x.IsDeleted, cancellationToken);

        var response = new PlatformAdminDashboardResponse(
            tenants,
            schools,
            students,
            DateTime.UtcNow);

        return Ok(response);
    }
}

public sealed record SchoolAdminDashboardResponse(
    Guid TenantId,
    Guid SchoolId,
    int StudentCount,
    int StaffCount,
    int OpenInvoiceCount,
    int OpenTicketCount,
    DateTime GeneratedAtUtc);

public sealed record TenantAdminDashboardResponse(
    Guid TenantId,
    int SchoolCount,
    int StudentCount,
    int StaffCount,
    DateTime GeneratedAtUtc);

public sealed record PlatformAdminDashboardResponse(
    int TenantCount,
    int SchoolCount,
    int StudentCount,
    DateTime GeneratedAtUtc);
