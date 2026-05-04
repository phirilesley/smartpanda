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
using SmartSchool.Domain.Modules.Attendance;
using SmartSchool.Persistence.Data;
using SmartSchool.API.Services;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/attendance")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AttendanceController(SmartSchoolDbContext dbContext, CacheService cacheService) : ControllerBase
{
    [HttpPost("sessions")]
    public async Task<ActionResult<AttendanceSession>> CreateSession([FromBody] CreateAttendanceSessionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var refsValid = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x => x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken)
            && await dbContext.Terms.AsNoTracking().AnyAsync(x => x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AcademicYearId == request.AcademicYearId, cancellationToken);

        if (!refsValid) return BadRequest("Invalid academic references.");

        var exists = await dbContext.AttendanceSessions.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId &&
            x.AttendanceDate.Date == request.ResolveAttendanceDate().Date && x.SessionType == request.ResolveSessionType().Trim(),
            cancellationToken);

        if (exists) return Conflict("Attendance session already exists for this date/session type.");

        var entity = new AttendanceSession
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            AttendanceDate = request.ResolveAttendanceDate().Date,
            SessionType = request.ResolveSessionType().Trim()
        };

        dbContext.AttendanceSessions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("students/mark")]
    public async Task<ActionResult<IReadOnlyList<StudentAttendance>>> MarkStudents([FromBody] MarkStudentAttendanceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var session = await dbContext.AttendanceSessions.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.AttendanceSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (session is null) return BadRequest("Attendance session not found.");
        if (request.Items.Count == 0) return BadRequest("No attendance items supplied.");

        var changed = new List<StudentAttendance>();

        foreach (var item in request.Items)
        {
            var enrollment = await dbContext.StudentEnrollments.AsNoTracking().FirstOrDefaultAsync(x =>
                x.Id == item.EnrollmentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == item.StudentId,
                cancellationToken);

            if (enrollment is null) return BadRequest($"Invalid enrollment for student {item.StudentId}.");

            var existing = await dbContext.StudentAttendances.FirstOrDefaultAsync(x =>
                x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
                x.AttendanceSessionId == request.AttendanceSessionId && x.StudentId == item.StudentId,
                cancellationToken);

            if (existing is null)
            {
                existing = new StudentAttendance
                {
                    TenantId = request.TenantId,
                    SchoolId = request.SchoolId,
                    AttendanceSessionId = request.AttendanceSessionId,
                    StudentId = item.StudentId,
                    EnrollmentId = item.EnrollmentId,
                    IsPresent = item.IsPresent,
                    Remarks = item.Remarks?.Trim() ?? string.Empty
                };

                dbContext.StudentAttendances.Add(existing);
            }
            else
            {
                existing.IsPresent = item.IsPresent;
                existing.Remarks = item.Remarks?.Trim() ?? existing.Remarks;
                existing.UpdatedAtUtc = DateTime.UtcNow;
            }

            changed.Add(existing);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(changed);
    }

    [HttpPost("staff/mark")]
    public async Task<ActionResult<IReadOnlyList<StaffAttendance>>> MarkStaff([FromBody] MarkStaffAttendanceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var session = await dbContext.AttendanceSessions.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.AttendanceSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (session is null) return BadRequest("Attendance session not found.");
        if (request.Items.Count == 0) return BadRequest("No attendance items supplied.");

        var changed = new List<StaffAttendance>();

        foreach (var item in request.Items)
        {
            var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
                x.Id == item.StaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                cancellationToken);

            if (!staffExists) return BadRequest($"Invalid staff member {item.StaffId}.");

            var existing = await dbContext.StaffAttendances.FirstOrDefaultAsync(x =>
                x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
                x.AttendanceSessionId == request.AttendanceSessionId && x.StaffId == item.StaffId,
                cancellationToken);

            if (existing is null)
            {
                existing = new StaffAttendance
                {
                    TenantId = request.TenantId,
                    SchoolId = request.SchoolId,
                    AttendanceSessionId = request.AttendanceSessionId,
                    StaffId = item.StaffId,
                    IsPresent = item.IsPresent,
                    Remarks = item.Remarks?.Trim() ?? string.Empty
                };

                dbContext.StaffAttendances.Add(existing);
            }
            else
            {
                existing.IsPresent = item.IsPresent;
                existing.Remarks = item.Remarks?.Trim() ?? existing.Remarks;
                existing.UpdatedAtUtc = DateTime.UtcNow;
            }

            changed.Add(existing);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(changed);
    }

    [HttpGet("students/report")]
    public async Task<ActionResult<IReadOnlyList<StudentAttendanceSummaryResponse>>> StudentReport([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, [FromQuery] Guid gradeId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || academicYearId == Guid.Empty || termId == Guid.Empty || gradeId == Guid.Empty)
            return BadRequest("tenantId, schoolId, academicYearId, termId and gradeId are required.");

        if (!User.CanAccessTenant(tenantId)) return Forbid();

        // 🚀 Cache attendance summary reports for 15 minutes (longer for reports)
        var cacheKey = CacheService.CacheKeys.AttendanceSummary(tenantId, schoolId, DateTime.MinValue) + $":report:{academicYearId}:{termId}:{gradeId}";
        var cached = await cacheService.GetAsync<IReadOnlyList<StudentAttendanceSummaryResponse>>(cacheKey, cancellationToken);
        if (cached is not null)
        {
            return Ok(cached);
        }

        var enrollments = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AcademicYearId == academicYearId && x.TermId == termId && x.GradeId == gradeId)
            .ToListAsync(cancellationToken);

        if (enrollments.Count == 0) return Ok(Array.Empty<StudentAttendanceSummaryResponse>());

        var studentIds = enrollments.Select(x => x.StudentId).Distinct().ToList();
        var sessionIds = await dbContext.AttendanceSessions.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AcademicYearId == academicYearId && x.TermId == termId)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var attendances = await dbContext.StudentAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && sessionIds.Contains(x.AttendanceSessionId) && studentIds.Contains(x.StudentId))
            .ToListAsync(cancellationToken);

        var students = await dbContext.Students.AsNoTracking().Where(x => studentIds.Contains(x.Id)).ToDictionaryAsync(x => x.Id, cancellationToken);

        var result = studentIds.Select(studentId =>
        {
            var studentRows = attendances.Where(x => x.StudentId == studentId).ToList();
            var present = studentRows.Count(x => x.IsPresent);
            var total = studentRows.Count;
            var pct = total == 0 ? 0 : Math.Round((decimal)present / total * 100m, 2);
            students.TryGetValue(studentId, out var student);

            return new StudentAttendanceSummaryResponse(
                studentId,
                student?.StudentNumber ?? string.Empty,
                student is null ? string.Empty : $"{student.FirstName} {student.LastName}",
                present,
                total,
                pct);
        }).OrderBy(x => x.StudentName).ToList();

        await cacheService.SetAsync(cacheKey, result, cacheService._options.LongTtl, cancellationToken);
        return Ok(result);
    }

    [HttpGet("sessions")]
    public async Task<ActionResult<IReadOnlyList<AttendanceSession>>> GetSessions([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.AttendanceSessions.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (academicYearId != Guid.Empty) query = query.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) query = query.Where(x => x.TermId == termId);

        var items = await query.OrderByDescending(x => x.AttendanceDate).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("sessions/{id:guid}")]
    public async Task<ActionResult<AttendanceSession>> GetSession(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.AttendanceSessions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpGet("student")]
    public async Task<ActionResult<IReadOnlyList<StudentAttendance>>> GetStudentAttendance([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateTime? date, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.StudentAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (date.HasValue)
        {
            var d = date.Value.Date;
            query = query.Where(x => dbContext.AttendanceSessions.Any(s => s.Id == x.AttendanceSessionId && s.AttendanceDate == d));
        }

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("staff")]
    public async Task<ActionResult<IReadOnlyList<StaffAttendance>>> GetStaffAttendance([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateTime? date, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.StaffAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (date.HasValue)
        {
            var d = date.Value.Date;
            query = query.Where(x => dbContext.AttendanceSessions.Any(s => s.Id == x.AttendanceSessionId && s.AttendanceDate == d));
        }

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpDelete("sessions/{id}")]
    public async Task<ActionResult> DeleteSession(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.AttendanceSessions.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if session has attendance records
        var hasStudentAttendance = await dbContext.StudentAttendances.AsNoTracking().AnyAsync(x => x.AttendanceSessionId == id, cancellationToken);
        var hasStaffAttendance = await dbContext.StaffAttendances.AsNoTracking().AnyAsync(x => x.AttendanceSessionId == id, cancellationToken);
        
        if (hasStudentAttendance || hasStaffAttendance) 
            return BadRequest("Cannot delete attendance session that has attendance records.");

        dbContext.AttendanceSessions.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("students/{id}")]
    public async Task<ActionResult> DeleteStudentAttendance(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.StudentAttendances.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.StudentAttendances.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("staff/{id}")]
    public async Task<ActionResult> DeleteStaffAttendance(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.StaffAttendances.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.StaffAttendances.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed class CreateAttendanceSessionRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public DateTime AttendanceDate { get; set; }
    public DateTime? SessionDate { get; set; }
    public string? SessionType { get; set; }
    public Guid? GradeId { get; set; }
    public Guid? StreamId { get; set; }
    public Guid? SubjectId { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }

    public DateTime ResolveAttendanceDate() => AttendanceDate == default ? (SessionDate ?? DateTime.UtcNow.Date) : AttendanceDate;
    public string ResolveSessionType() => string.IsNullOrWhiteSpace(SessionType) ? "Daily" : SessionType;
}
public sealed record MarkStudentAttendanceRequest(Guid TenantId, Guid SchoolId, Guid AttendanceSessionId, List<MarkStudentAttendanceItem> Items);
public sealed record MarkStudentAttendanceItem(Guid StudentId, Guid EnrollmentId, bool IsPresent, string? Remarks);
public sealed record MarkStaffAttendanceRequest(Guid TenantId, Guid SchoolId, Guid AttendanceSessionId, List<MarkStaffAttendanceItem> Items);
public sealed record MarkStaffAttendanceItem(Guid StaffId, bool IsPresent, string? Remarks);
public sealed record StudentAttendanceSummaryResponse(Guid StudentId, string StudentNumber, string StudentName, int PresentCount, int TotalCount, decimal Percentage);
