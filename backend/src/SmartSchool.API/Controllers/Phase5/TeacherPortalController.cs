using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Attendance;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/teacher/portal")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class TeacherPortalController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<TeacherDashboardResponse>> GetDashboard(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid teacherUserId,
        [FromQuery] Guid? teacherStaffId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var staffQuery = dbContext.StaffMembers.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsActive);
        if (teacherStaffId.HasValue && teacherStaffId.Value != Guid.Empty)
        {
            staffQuery = staffQuery.Where(x => x.Id == teacherStaffId.Value);
        }

        var teacher = await staffQuery
            .OrderBy(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);
        if (teacher is null) return NotFound("Teacher not found.");

        var assignedGrades = await dbContext.GradeSubjects.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AssignedTeacherStaffId == teacher.Id)
            .Select(x => x.GradeId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var studentCount = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsCurrent && assignedGrades.Contains(x.GradeId))
            .Select(x => x.StudentId)
            .Distinct()
            .CountAsync(cancellationToken);

        var todayClasses = await dbContext.TimetableEntries.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StaffId == teacher.Id)
            .Join(dbContext.TimetablePeriods.AsNoTracking(), e => e.TimetablePeriodId, p => p.Id, (e, p) => new { e, p })
            .Join(dbContext.Subjects.AsNoTracking(), ep => ep.e.SubjectId, s => s.Id, (ep, s) => new TeacherClassEntry(ep.e.GradeId, s.Name, ep.p.StartTime, ep.p.EndTime, ep.e.RoomId))
            .OrderBy(x => x.StartTime)
            .Take(10)
            .ToListAsync(cancellationToken);

        var today = DateTime.UtcNow.Date;
        var sessionIdsToday = await dbContext.AttendanceSessions.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AttendanceDate == today)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var expectedStudents = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsCurrent && assignedGrades.Contains(x.GradeId))
            .Select(x => x.StudentId)
            .Distinct()
            .CountAsync(cancellationToken);

        var markedToday = await dbContext.StudentAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && sessionIdsToday.Contains(x.AttendanceSessionId))
            .Select(x => x.StudentId)
            .Distinct()
            .CountAsync(cancellationToken);

        var pendingAttendance = Math.Max(0, expectedStudents - markedToday);

        var recentAnnouncements = await dbContext.Announcements.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId
                && (x.Audience == "All" || x.Audience == "Teachers")
                && x.PublishAtUtc <= DateTime.UtcNow
                && (x.ExpireAtUtc == null || x.ExpireAtUtc > DateTime.UtcNow))
            .OrderByDescending(x => x.PublishAtUtc)
            .Take(5)
            .Select(x => new AnnouncementSummary(x.Id, x.Title, x.PublishAtUtc))
            .ToListAsync(cancellationToken);

        var threadIds = await dbContext.MessageParticipants.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.UserId == teacherUserId)
            .Select(x => x.MessageThreadId)
            .ToListAsync(cancellationToken);

        var unreadMessages = await dbContext.Messages.AsNoTracking()
            .CountAsync(x => threadIds.Contains(x.MessageThreadId) && x.SenderUserId != teacherUserId, cancellationToken);

        return Ok(new TeacherDashboardResponse(
            new TeacherSummary(teacher.Id, teacher.FirstName, teacher.LastName, teacher.EmployeeNumber),
            assignedGrades,
            studentCount,
            todayClasses,
            pendingAttendance,
            recentAnnouncements,
            unreadMessages));
    }

    [HttpGet("students")]
    public async Task<ActionResult<IReadOnlyList<TeacherStudentSummary>>> GetStudents(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid teacherStaffId,
        [FromQuery] Guid? gradeId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || teacherStaffId == Guid.Empty) return BadRequest("tenantId, schoolId and teacherStaffId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var assignedGrades = await dbContext.GradeSubjects.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AssignedTeacherStaffId == teacherStaffId)
            .Select(x => x.GradeId)
            .Distinct()
            .ToListAsync(cancellationToken);

        if (gradeId.HasValue && !assignedGrades.Contains(gradeId.Value)) return Forbid();

        var query = dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsCurrent && assignedGrades.Contains(x.GradeId));
        if (gradeId.HasValue) query = query.Where(x => x.GradeId == gradeId.Value);

        var students = await query
            .Join(dbContext.Students.AsNoTracking(), e => e.StudentId, s => s.Id,
                (e, s) => new TeacherStudentSummary(s.Id, s.StudentNumber, s.FirstName, s.LastName, e.GradeId, e.CreatedAtUtc))
            .OrderBy(x => x.LastName)
            .ThenBy(x => x.FirstName)
            .ToListAsync(cancellationToken);

        return Ok(students);
    }

    [HttpPost("attendance/mark")]
    public async Task<ActionResult> MarkAttendance([FromBody] MarkAttendanceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var session = await dbContext.AttendanceSessions.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId &&
            x.TermId == request.TermId &&
            x.AttendanceDate == request.AttendanceDate.Date &&
            x.SessionType == request.SessionType,
            cancellationToken);

        if (session is null)
        {
            session = new AttendanceSession
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                AcademicYearId = request.AcademicYearId,
                TermId = request.TermId,
                AttendanceDate = request.AttendanceDate.Date,
                SessionType = request.SessionType.Trim()
            };
            dbContext.AttendanceSessions.Add(session);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        var enrollments = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.IsCurrent && request.StudentIds.Contains(x.StudentId))
            .ToDictionaryAsync(x => x.StudentId, x => x.Id, cancellationToken);

        var existing = await dbContext.StudentAttendances
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AttendanceSessionId == session.Id && request.StudentIds.Contains(x.StudentId))
            .ToListAsync(cancellationToken);

        foreach (var attendance in existing)
        {
            attendance.IsPresent = request.IsPresent;
            attendance.Remarks = request.Remarks?.Trim() ?? string.Empty;
            attendance.UpdatedAtUtc = DateTime.UtcNow;
        }

        var existingStudentIds = existing.Select(x => x.StudentId).ToHashSet();
        var toInsert = request.StudentIds
            .Where(id => !existingStudentIds.Contains(id) && enrollments.ContainsKey(id))
            .Select(id => new StudentAttendance
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                AttendanceSessionId = session.Id,
                StudentId = id,
                EnrollmentId = enrollments[id],
                IsPresent = request.IsPresent,
                Remarks = request.Remarks?.Trim() ?? string.Empty
            }).ToList();

        if (toInsert.Count > 0) dbContext.StudentAttendances.AddRange(toInsert);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { marked = toInsert.Count + existing.Count, date = request.AttendanceDate.Date });
    }

    [HttpGet("exams")]
    public async Task<ActionResult<IReadOnlyList<TeacherExamSummary>>> GetExams(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid teacherStaffId,
        [FromQuery] Guid? gradeId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || teacherStaffId == Guid.Empty) return BadRequest("tenantId, schoolId and teacherStaffId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var assignedGrades = await dbContext.GradeSubjects.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AssignedTeacherStaffId == teacherStaffId)
            .Select(x => x.GradeId)
            .Distinct()
            .ToListAsync(cancellationToken);

        var query = dbContext.ExamSessions.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && assignedGrades.Contains(x.GradeId));
        if (gradeId.HasValue) query = query.Where(x => x.GradeId == gradeId.Value);

        var exams = await query
            .OrderByDescending(x => x.StartDate)
            .Select(x => new TeacherExamSummary(x.Id, x.Name, x.GradeId, x.StartDate, x.Status))
            .ToListAsync(cancellationToken);

        return Ok(exams);
    }

    [HttpPost("marks/submit")]
    public async Task<ActionResult> SubmitMarks([FromBody] SubmitMarksRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var examSession = await dbContext.ExamSessions.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.ExamSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken);
        if (examSession is null) return NotFound("Exam session not found.");

        var assignedGrades = await dbContext.GradeSubjects.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AssignedTeacherStaffId == request.TeacherStaffId && x.SubjectId == request.SubjectId)
            .Select(x => x.GradeId)
            .Distinct()
            .ToListAsync(cancellationToken);
        if (!assignedGrades.Contains(examSession.GradeId)) return Forbid();

        var studentIds = request.Marks.Select(x => x.StudentId).Distinct().ToList();
        var enrollments = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.IsCurrent && x.GradeId == examSession.GradeId && studentIds.Contains(x.StudentId))
            .ToDictionaryAsync(x => x.StudentId, x => x.Id, cancellationToken);

        var created = 0;
        foreach (var mark in request.Marks)
        {
            if (!enrollments.TryGetValue(mark.StudentId, out var enrollmentId)) continue;

            var existing = await dbContext.StudentMarks.FirstOrDefaultAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.EnrollmentId == enrollmentId &&
                x.ExamSessionId == request.ExamSessionId &&
                x.SubjectId == request.SubjectId, cancellationToken);

            if (existing is null)
            {
                dbContext.StudentMarks.Add(new StudentMark
                {
                    TenantId = request.TenantId,
                    SchoolId = request.SchoolId,
                    StudentId = mark.StudentId,
                    EnrollmentId = enrollmentId,
                    ExamSessionId = request.ExamSessionId,
                    SubjectId = request.SubjectId,
                    Mark = mark.Mark,
                    Grade = mark.Grade.Trim(),
                    EnteredByStaffId = request.TeacherStaffId
                });
                created++;
            }
            else
            {
                existing.Mark = mark.Mark;
                existing.Grade = mark.Grade.Trim();
                existing.EnteredByStaffId = request.TeacherStaffId;
                existing.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new { submitted = created, examSessionId = request.ExamSessionId });
    }

    [HttpGet("messages")]
    public async Task<ActionResult<IReadOnlyList<TeacherMessageSummary>>> GetMessages(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid teacherUserId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || teacherUserId == Guid.Empty) return BadRequest("tenantId, schoolId and teacherUserId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var threadIds = await dbContext.MessageParticipants.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.UserId == teacherUserId)
            .Select(x => x.MessageThreadId)
            .ToListAsync(cancellationToken);

        var threads = await dbContext.MessageThreads.AsNoTracking()
            .Where(x => threadIds.Contains(x.Id))
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(20)
            .Select(x => new TeacherMessageSummary(x.Id, x.Subject, x.IsClosed, x.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        return Ok(threads);
    }
}

public sealed record TeacherDashboardResponse(
    TeacherSummary Teacher,
    IReadOnlyList<Guid> AssignedGrades,
    int StudentCount,
    IReadOnlyList<TeacherClassEntry> TodayClasses,
    int PendingAttendance,
    IReadOnlyList<AnnouncementSummary> RecentAnnouncements,
    int UnreadMessages);

public sealed record TeacherSummary(Guid Id, string FirstName, string LastName, string EmployeeNumber);
public sealed record TeacherClassEntry(Guid GradeId, string Subject, TimeOnly StartTime, TimeOnly EndTime, Guid RoomId);
public sealed record TeacherStudentSummary(Guid StudentId, string StudentNumber, string FirstName, string LastName, Guid GradeId, DateTime EnrollmentDate);
public sealed record TeacherExamSummary(Guid Id, string Name, Guid GradeId, DateTime StartDate, string Status);
public sealed record TeacherMessageSummary(Guid ThreadId, string Subject, bool IsClosed, DateTime CreatedAtUtc);

public sealed record MarkAttendanceRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid TeacherStaffId,
    Guid AcademicYearId,
    Guid TermId,
    DateTime AttendanceDate,
    string SessionType,
    bool IsPresent,
    string? Remarks,
    List<Guid> StudentIds);

public sealed record SubmitMarksRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid TeacherStaffId,
    Guid ExamSessionId,
    Guid SubjectId,
    List<MarkItem> Marks);

public sealed record MarkItem(Guid StudentId, decimal Mark, string Grade);
