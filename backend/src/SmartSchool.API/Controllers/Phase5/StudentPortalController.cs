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
using SmartSchool.Domain.Modules.Communication;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/student/portal")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentPortalController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<StudentDashboardResponse>> GetDashboard(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid studentUserId,
        [FromQuery] Guid? studentId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        // studentUserId remains for compatibility; studentId is used as explicit identity mapping.
        var studentQuery = dbContext.Students.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId.HasValue && studentId.Value != Guid.Empty)
        {
            studentQuery = studentQuery.Where(x => x.Id == studentId.Value);
        }
        var student = await studentQuery
            .OrderBy(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);
        if (student is null) return NotFound("Student not found.");

        var currentEnrollment = await dbContext.StudentEnrollments.AsNoTracking()
            .FirstOrDefaultAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == student.Id && x.IsCurrent, cancellationToken);

        var recentAttendance = await dbContext.StudentAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == student.Id)
            .Join(
                dbContext.AttendanceSessions.AsNoTracking(),
                attendance => attendance.AttendanceSessionId,
                session => session.Id,
                (attendance, session) => new { attendance, session })
            .OrderByDescending(x => x.session.AttendanceDate)
            .Take(10)
            .Select(x => new StudentAttendanceRecord(x.session.AttendanceDate, x.attendance.IsPresent, x.attendance.Remarks))
            .ToListAsync(cancellationToken);

        var recentAnnouncements = await dbContext.Announcements.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId
                && (x.Audience == "All" || x.Audience == "Students")
                && x.PublishAtUtc <= DateTime.UtcNow
                && (x.ExpireAtUtc == null || x.ExpireAtUtc > DateTime.UtcNow))
            .OrderByDescending(x => x.PublishAtUtc)
            .Take(5)
            .Select(x => new AnnouncementSummary(x.Id, x.Title, x.PublishAtUtc))
            .ToListAsync(cancellationToken);

        var upcomingEvents = await dbContext.SchoolEvents.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted && x.StartAtUtc >= DateTime.UtcNow)
            .OrderBy(x => x.StartAtUtc)
            .Take(5)
            .Select(x => new EventSummary(x.Id, x.Title, x.StartAtUtc, x.Venue))
            .ToListAsync(cancellationToken);

        var pendingFees = await dbContext.StudentInvoices.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == student.Id && x.Status != "Paid")
            .SumAsync(x => x.TotalAmount, cancellationToken);

        var recentResults = await dbContext.ReportCards.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == student.Id && x.IsPublished)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(3)
            .Select(x => new StudentResultRecord(x.AcademicYearId, x.TermId, x.GradeId, x.TotalMarks, x.AverageMark, x.PositionInClass, x.IsPublished))
            .ToListAsync(cancellationToken);

        return Ok(new StudentDashboardResponse(
            new StudentSummary(student.Id, student.StudentNumber, student.FirstName, student.LastName, currentEnrollment?.GradeId ?? Guid.Empty),
            currentEnrollment,
            recentAttendance,
            recentAnnouncements,
            upcomingEvents,
            pendingFees,
            recentResults));
    }

    [HttpGet("attendance")]
    public async Task<ActionResult<IReadOnlyList<StudentAttendanceRecord>>> GetAttendance(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid studentId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || studentId == Guid.Empty) return BadRequest("tenantId, schoolId and studentId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.StudentAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId)
            .Join(
                dbContext.AttendanceSessions.AsNoTracking(),
                attendance => attendance.AttendanceSessionId,
                session => session.Id,
                (attendance, session) => new { attendance, session })
            .Where(x => x.session.AttendanceDate >= startDate.Date && x.session.AttendanceDate <= endDate.Date)
            .OrderBy(x => x.session.AttendanceDate)
            .Select(x => new StudentAttendanceRecord(x.session.AttendanceDate, x.attendance.IsPresent, x.attendance.Remarks))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("fees")]
    public async Task<ActionResult<IReadOnlyList<StudentFeeRecord>>> GetFees(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid studentId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || studentId == Guid.Empty) return BadRequest("tenantId, schoolId and studentId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var invoices = await dbContext.StudentInvoices.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        var invoiceIds = invoices.Select(x => x.Id).ToList();
        var payments = await dbContext.Payments.AsNoTracking()
            .Where(x => invoiceIds.Contains(x.InvoiceId))
            .GroupBy(x => x.InvoiceId)
            .Select(g => new { InvoiceId = g.Key, PaidAmount = g.Sum(x => x.Amount) })
            .ToDictionaryAsync(x => x.InvoiceId, x => x.PaidAmount, cancellationToken);

        var records = invoices.Select(i =>
        {
            var paid = payments.TryGetValue(i.Id, out var amount) ? amount : 0m;
            return new StudentFeeRecord(i.Id, i.InvoiceNumber, i.TotalAmount, paid, i.TotalAmount - paid, i.Status, i.CreatedAtUtc);
        }).ToList();

        return Ok(records);
    }

    [HttpGet("results")]
    public async Task<ActionResult<IReadOnlyList<StudentResultRecord>>> GetResults(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid studentId,
        [FromQuery] Guid? academicYearId,
        [FromQuery] Guid? termId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || studentId == Guid.Empty) return BadRequest("tenantId, schoolId and studentId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.ReportCards.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId && x.IsPublished);
        if (academicYearId.HasValue) query = query.Where(x => x.AcademicYearId == academicYearId.Value);
        if (termId.HasValue) query = query.Where(x => x.TermId == termId.Value);

        var items = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new StudentResultRecord(x.AcademicYearId, x.TermId, x.GradeId, x.TotalMarks, x.AverageMark, x.PositionInClass, x.IsPublished))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("timetable")]
    public async Task<ActionResult<IReadOnlyList<StudentTimetableEntry>>> GetTimetable(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid studentId,
        [FromQuery] int? dayOfWeek,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || studentId == Guid.Empty) return BadRequest("tenantId, schoolId and studentId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var enrollment = await dbContext.StudentEnrollments.AsNoTracking()
            .FirstOrDefaultAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId && x.IsCurrent, cancellationToken);
        if (enrollment is null) return NotFound("Current enrollment not found.");

        var query = dbContext.TimetableEntries.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.GradeId == enrollment.GradeId && x.StreamId == enrollment.StreamId);

        if (dayOfWeek.HasValue)
        {
            query = query.Join(
                dbContext.TimetablePeriods.AsNoTracking().Where(x => x.DayOfWeek == dayOfWeek.Value),
                entry => entry.TimetablePeriodId,
                period => period.Id,
                (entry, _) => entry);
        }

        var items = await query
            .Join(dbContext.TimetablePeriods.AsNoTracking(), e => e.TimetablePeriodId, p => p.Id, (e, p) => new { e, p })
            .Join(dbContext.Subjects.AsNoTracking(), ep => ep.e.SubjectId, s => s.Id, (ep, s) => new { ep.e, ep.p, subject = s })
            .Join(dbContext.StaffMembers.AsNoTracking(), eps => eps.e.StaffId, st => st.Id, (eps, st) => new { eps.e, eps.p, eps.subject, staff = st })
            .Join(dbContext.Rooms.AsNoTracking(), epss => epss.e.RoomId, r => r.Id, (epss, r) => new StudentTimetableEntry(
                epss.p.DayOfWeek,
                epss.p.StartTime,
                epss.p.EndTime,
                epss.subject.Name,
                $"{epss.staff.FirstName} {epss.staff.LastName}",
                r.Name))
            .OrderBy(x => x.DayOfWeek)
            .ThenBy(x => x.StartTime)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("communication/send")]
    public async Task<ActionResult> SendMessage([FromBody] StudentMessageRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        if (request.RecipientUserId == Guid.Empty) return BadRequest("recipientUserId is required.");

        var thread = new MessageThread
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Subject = request.Subject.Trim(),
            IsClosed = false
        };
        dbContext.MessageThreads.Add(thread);
        await dbContext.SaveChangesAsync(cancellationToken);

        dbContext.MessageParticipants.AddRange(
            new MessageParticipant
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                MessageThreadId = thread.Id,
                UserId = request.StudentUserId
            },
            new MessageParticipant
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                MessageThreadId = thread.Id,
                UserId = request.RecipientUserId
            });

        var message = new Message
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            MessageThreadId = thread.Id,
            SenderUserId = request.StudentUserId,
            Content = request.Message.Trim(),
            SentAtUtc = DateTime.UtcNow
        };
        dbContext.Messages.Add(message);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { threadId = thread.Id, messageId = message.Id });
    }
}

public sealed record StudentDashboardResponse(
    StudentSummary Student,
    SmartSchool.Domain.Modules.Students.StudentEnrollment? CurrentEnrollment,
    IReadOnlyList<StudentAttendanceRecord> RecentAttendance,
    IReadOnlyList<AnnouncementSummary> RecentAnnouncements,
    IReadOnlyList<EventSummary> UpcomingEvents,
    decimal PendingFees,
    IReadOnlyList<StudentResultRecord> RecentResults);

public sealed record StudentTimetableEntry(
    int DayOfWeek,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string Subject,
    string Teacher,
    string Room);

public sealed record StudentMessageRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid StudentUserId,
    Guid RecipientUserId,
    string Subject,
    string Message);
