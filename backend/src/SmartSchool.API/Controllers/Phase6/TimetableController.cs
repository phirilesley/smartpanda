using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
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
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/timetable")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class TimetableController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("entries")]
    public async Task<ActionResult<IReadOnlyList<TimetableEntry>>> GetEntries([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || academicYearId == Guid.Empty || termId == Guid.Empty)
        {
            return BadRequest("tenantId, schoolId, academicYearId, and termId are required.");
        }
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.TimetableEntries.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AcademicYearId == academicYearId && x.TermId == termId)
            .OrderBy(x => x.GradeId)
            .ThenBy(x => x.StreamId)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("rooms")]
    public async Task<ActionResult<Room>> CreateRoom([FromBody] CreateRoomRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.Rooms.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("Room already exists.");

        var entity = new Room
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            Capacity = request.Capacity
        };

        dbContext.Rooms.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("periods")]
    public async Task<ActionResult<TimetablePeriod>> CreatePeriod([FromBody] CreateTimetablePeriodRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new TimetablePeriod
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            DayOfWeek = request.DayOfWeek
        };

        dbContext.TimetablePeriods.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("entries")]
    public async Task<ActionResult<TimetableEntry>> CreateEntry([FromBody] CreateTimetableEntryRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var refsOk = await ValidateReferences(request, cancellationToken);
        if (!refsOk) return BadRequest("Invalid timetable references.");

        var classConflict = await dbContext.TimetableEntries.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId &&
            x.TermId == request.TermId &&
            x.GradeId == request.GradeId &&
            x.StreamId == request.StreamId &&
            x.TimetablePeriodId == request.TimetablePeriodId,
            cancellationToken);
        if (classConflict) return Conflict("Class already has a lesson in this period.");

        var roomConflict = await dbContext.TimetableEntries.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId &&
            x.TermId == request.TermId &&
            x.RoomId == request.RoomId &&
            x.TimetablePeriodId == request.TimetablePeriodId,
            cancellationToken);
        if (roomConflict) return Conflict("Room is already occupied in this period.");

        var staffConflict = await dbContext.TimetableEntries.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId &&
            x.TermId == request.TermId &&
            x.StaffId == request.StaffId &&
            x.TimetablePeriodId == request.TimetablePeriodId,
            cancellationToken);
        if (staffConflict) return Conflict("Teacher is already assigned in this period.");

        var entity = new TimetableEntry
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            GradeId = request.GradeId,
            StreamId = request.StreamId,
            SubjectId = request.SubjectId,
            StaffId = request.StaffId,
            RoomId = request.RoomId,
            TimetablePeriodId = request.TimetablePeriodId
        };

        dbContext.TimetableEntries.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    private async Task<bool> ValidateReferences(CreateTimetableEntryRequest request, CancellationToken cancellationToken)
    {
        var yearExists = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x =>
            x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var termExists = await dbContext.Terms.AsNoTracking().AnyAsync(x =>
            x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AcademicYearId == request.AcademicYearId,
            cancellationToken);
        var gradeExists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var streamExists = await dbContext.Streams.AsNoTracking().AnyAsync(x =>
            x.Id == request.StreamId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.GradeId == request.GradeId,
            cancellationToken);
        var subjectExists = await dbContext.Subjects.AsNoTracking().AnyAsync(x =>
            x.Id == request.SubjectId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.StaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var roomExists = await dbContext.Rooms.AsNoTracking().AnyAsync(x =>
            x.Id == request.RoomId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var periodExists = await dbContext.TimetablePeriods.AsNoTracking().AnyAsync(x =>
            x.Id == request.TimetablePeriodId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        return yearExists && termExists && gradeExists && streamExists && subjectExists && staffExists && roomExists && periodExists;
    }
}

public sealed record CreateRoomRequest(Guid TenantId, Guid SchoolId, string Name, int Capacity);
public sealed record CreateTimetablePeriodRequest(Guid TenantId, Guid SchoolId, string Name, TimeOnly StartTime, TimeOnly EndTime, int DayOfWeek);
public sealed record CreateTimetableEntryRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, Guid TermId, Guid GradeId, Guid StreamId, Guid SubjectId, Guid StaffId, Guid RoomId, Guid TimetablePeriodId);
