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
using SmartSchool.Domain.Modules.Leadership;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/student-leadership")]
[Route("api/leadership")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentLeadershipController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("positions/{id:guid}")]
    public async Task<ActionResult<LeadershipPosition>> PositionById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.LeadershipPositions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpGet("positions")]
    public async Task<ActionResult<IReadOnlyList<LeadershipPosition>>> Positions([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.LeadershipPositions.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsActive && !x.IsDeleted)
            .OrderBy(x => x.HierarchyOrder)
            .ThenBy(x => x.Title)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("positions")]
    public async Task<ActionResult<LeadershipPosition>> CreatePosition([FromBody] CreateLeadershipPositionDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        var entity = new LeadershipPosition
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            PositionType = request.PositionType.Trim(),
            Level = request.Level.Trim(),
            HierarchyOrder = request.HierarchyOrder,
            Responsibilities = request.Responsibilities?.Trim(),
            Qualifications = request.Qualifications?.Trim(),
            SelectionProcess = request.SelectionProcess?.Trim(),
            TermDuration = request.TermDuration?.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.LeadershipPositions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("positions/{id:guid}")]
    public async Task<ActionResult<LeadershipPosition>> UpdatePosition(Guid id, [FromBody] UpdateLeadershipPositionDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.LeadershipPositions.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Title = request.Title.Trim();
        entity.Description = request.Description?.Trim();
        entity.PositionType = request.PositionType.Trim();
        entity.Level = request.Level.Trim();
        entity.HierarchyOrder = request.HierarchyOrder;
        entity.Responsibilities = request.Responsibilities?.Trim();
        entity.Qualifications = request.Qualifications?.Trim();
        entity.SelectionProcess = request.SelectionProcess?.Trim();
        entity.TermDuration = request.TermDuration?.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("positions/{id:guid}")]
    public async Task<IActionResult> DeletePosition(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.LeadershipPositions.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("assignments")]
    public async Task<ActionResult<IReadOnlyList<StudentLeadershipAssignment>>> Assignments([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.StudentLeadershipAssignments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderByDescending(x => x.AppointmentDate)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("assignments/{id:guid}")]
    public async Task<ActionResult<StudentLeadershipAssignment>> AssignmentById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.StudentLeadershipAssignments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpPost("assignments")]
    public async Task<ActionResult<StudentLeadershipAssignment>> CreateAssignment([FromBody] CreateLeadershipAssignmentDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        var entity = new StudentLeadershipAssignment
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            LeadershipPositionId = request.LeadershipPositionId,
            AcademicYearId = request.AcademicYearId,
            GradeId = request.GradeId,
            ClassId = request.ClassId,
            HouseId = request.HouseId,
            ClubId = request.ClubId,
            AppointmentDate = request.AppointmentDate,
            EndDate = request.EndDate,
            Status = request.Status?.Trim() ?? "Active",
            AppointmentType = request.AppointmentType.Trim(),
            AppointedByStaffId = request.AppointedByStaffId,
            ReasonForAppointment = request.ReasonForAppointment?.Trim(),
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        dbContext.StudentLeadershipAssignments.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("assignments/{id:guid}")]
    public async Task<ActionResult<StudentLeadershipAssignment>> UpdateAssignment(Guid id, [FromBody] UpdateLeadershipAssignmentDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.StudentLeadershipAssignments.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.GradeId = request.GradeId;
        entity.ClassId = request.ClassId;
        entity.HouseId = request.HouseId;
        entity.ClubId = request.ClubId;
        entity.AppointmentDate = request.AppointmentDate;
        entity.EndDate = request.EndDate;
        entity.Status = request.Status.Trim();
        entity.AppointmentType = request.AppointmentType.Trim();
        entity.AppointedByStaffId = request.AppointedByStaffId;
        entity.ReasonForAppointment = request.ReasonForAppointment?.Trim();
        entity.ReasonForTermination = request.ReasonForTermination?.Trim();
        entity.PerformanceRating = request.PerformanceRating;
        entity.DutiesFulfilled = request.DutiesFulfilled?.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("assignments/{id:guid}")]
    public async Task<IActionResult> DeleteAssignment(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.StudentLeadershipAssignments.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateLeadershipPositionDto(Guid TenantId, Guid SchoolId, string Title, string? Description, string PositionType, string Level, int HierarchyOrder, string? Responsibilities, string? Qualifications, string? SelectionProcess, string? TermDuration);
public sealed record UpdateLeadershipPositionDto(string Title, string? Description, string PositionType, string Level, int HierarchyOrder, string? Responsibilities, string? Qualifications, string? SelectionProcess, string? TermDuration, bool IsActive);
public sealed record CreateLeadershipAssignmentDto(Guid TenantId, Guid SchoolId, Guid StudentId, Guid LeadershipPositionId, Guid AcademicYearId, Guid? GradeId, Guid? ClassId, Guid? HouseId, Guid? ClubId, DateOnly AppointmentDate, DateOnly? EndDate, string? Status, string AppointmentType, Guid? AppointedByStaffId, string? ReasonForAppointment);
public sealed record UpdateLeadershipAssignmentDto(Guid? GradeId, Guid? ClassId, Guid? HouseId, Guid? ClubId, DateOnly AppointmentDate, DateOnly? EndDate, string Status, string AppointmentType, Guid? AppointedByStaffId, string? ReasonForAppointment, string? ReasonForTermination, decimal? PerformanceRating, string? DutiesFulfilled);
