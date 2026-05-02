using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Labs;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/labs")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class LabsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ComputerLab>>> GetLabs([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.ComputerLabs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ComputerLab>> CreateLab([FromBody] CreateComputerLabRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.ComputerLabs.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("Lab name already exists.");

        var entity = new ComputerLab
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            Capacity = request.Capacity
        };

        dbContext.ComputerLabs.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("computers")]
    public async Task<ActionResult<LabComputer>> CreateComputer([FromBody] CreateLabComputerRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var labExists = await dbContext.ComputerLabs.AsNoTracking().AnyAsync(x =>
            x.Id == request.ComputerLabId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!labExists) return BadRequest("Computer lab not found.");

        var entity = new LabComputer
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ComputerLabId = request.ComputerLabId,
            AssetTag = request.AssetTag.Trim().ToUpperInvariant(),
            Name = request.Name.Trim(),
            Status = "Active"
        };

        dbContext.LabComputers.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("bookings")]
    public async Task<ActionResult<LabBooking>> CreateBooking([FromBody] CreateLabBookingRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var labExists = await dbContext.ComputerLabs.AsNoTracking().AnyAsync(x =>
            x.Id == request.ComputerLabId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.TeacherStaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var gradeExists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var streamExists = await dbContext.Streams.AsNoTracking().AnyAsync(x =>
            x.Id == request.StreamId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!labExists || !staffExists || !gradeExists || !streamExists) return BadRequest("Invalid booking references.");

        var hasConflict = await dbContext.LabBookings.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.ComputerLabId == request.ComputerLabId &&
            x.StartTimeUtc < request.EndTimeUtc &&
            request.StartTimeUtc < x.EndTimeUtc,
            cancellationToken);
        if (hasConflict) return Conflict("The selected lab is already booked for this time range.");

        var entity = new LabBooking
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ComputerLabId = request.ComputerLabId,
            TeacherStaffId = request.TeacherStaffId,
            StartTimeUtc = request.StartTimeUtc,
            EndTimeUtc = request.EndTimeUtc,
            GradeId = request.GradeId,
            StreamId = request.StreamId
        };

        dbContext.LabBookings.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("faults")]
    public async Task<ActionResult<LabFault>> CreateFault([FromBody] CreateLabFaultRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var computerExists = await dbContext.LabComputers.AsNoTracking().AnyAsync(x =>
            x.Id == request.LabComputerId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!computerExists) return BadRequest("Lab computer not found.");

        var entity = new LabFault
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            LabComputerId = request.LabComputerId,
            ReportedAtUtc = request.ReportedAtUtc == default ? DateTime.UtcNow : request.ReportedAtUtc,
            Description = request.Description.Trim(),
            Status = "Open"
        };

        dbContext.LabFaults.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("faults/{faultId:guid}/resolve")]
    public async Task<ActionResult<LabFault>> ResolveFault(Guid faultId, [FromBody] ResolveLabFaultRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var fault = await dbContext.LabFaults.FirstOrDefaultAsync(x =>
            x.Id == faultId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (fault is null) return NotFound();

        fault.Status = request.Status.Trim();
        fault.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(fault);
    }
}

public sealed record CreateComputerLabRequest(Guid TenantId, Guid SchoolId, string Name, int Capacity);
public sealed record CreateLabComputerRequest(Guid TenantId, Guid SchoolId, Guid ComputerLabId, string AssetTag, string Name);
public sealed record CreateLabBookingRequest(Guid TenantId, Guid SchoolId, Guid ComputerLabId, Guid TeacherStaffId, DateTime StartTimeUtc, DateTime EndTimeUtc, Guid GradeId, Guid StreamId);
public sealed record CreateLabFaultRequest(Guid TenantId, Guid SchoolId, Guid LabComputerId, DateTime ReportedAtUtc, string Description);
public sealed record ResolveLabFaultRequest(Guid TenantId, Guid SchoolId, string Status);
