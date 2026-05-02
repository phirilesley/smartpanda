using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Visitors;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/visitors")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class VisitorsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Visitor>>> GetVisitors([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.Visitors.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.FullName)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Visitor>> CreateVisitor([FromBody] CreateVisitorRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new Visitor
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            IdNumber = request.IdNumber.Trim().ToUpperInvariant()
        };

        dbContext.Visitors.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("check-ins")]
    public async Task<ActionResult<VisitorLog>> CheckIn([FromBody] VisitorCheckInRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var visitorExists = await dbContext.Visitors.AsNoTracking().AnyAsync(x =>
            x.Id == request.VisitorId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.HostStaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!visitorExists || !staffExists) return BadRequest("Invalid visitor or host staff.");

        var entity = new VisitorLog
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            VisitorId = request.VisitorId,
            HostStaffId = request.HostStaffId,
            CheckInAtUtc = request.CheckInAtUtc == default ? DateTime.UtcNow : request.CheckInAtUtc,
            Purpose = request.Purpose.Trim(),
            BadgeNumber = request.BadgeNumber.Trim().ToUpperInvariant()
        };

        dbContext.VisitorLogs.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("check-outs/{visitorLogId:guid}")]
    public async Task<ActionResult<VisitorLog>> CheckOut(Guid visitorLogId, [FromBody] VisitorCheckOutRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var log = await dbContext.VisitorLogs.FirstOrDefaultAsync(x =>
            x.Id == visitorLogId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (log is null) return NotFound();
        if (log.CheckOutAtUtc.HasValue) return BadRequest("Visitor already checked out.");

        log.CheckOutAtUtc = request.CheckOutAtUtc == default ? DateTime.UtcNow : request.CheckOutAtUtc;
        log.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(log);
    }
}

public sealed record CreateVisitorRequest(Guid TenantId, Guid SchoolId, string FullName, string PhoneNumber, string IdNumber);
public sealed record VisitorCheckInRequest(Guid TenantId, Guid SchoolId, Guid VisitorId, Guid HostStaffId, DateTime CheckInAtUtc, string Purpose, string BadgeNumber);
public sealed record VisitorCheckOutRequest(Guid TenantId, Guid SchoolId, DateTime CheckOutAtUtc);
