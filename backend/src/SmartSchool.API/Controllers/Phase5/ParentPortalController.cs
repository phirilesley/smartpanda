using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Communication;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/parent/portal")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ParentPortalController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<ParentDashboardResponse>> GetDashboard(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid parentUserId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        // Current domain stores StudentGuardian by GuardianId; parentUserId maps to guardian id in this API.
        var studentGuardians = await dbContext.StudentGuardians.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.GuardianId == parentUserId)
            .ToListAsync(cancellationToken);

        var studentIds = studentGuardians.Select(x => x.StudentId).Distinct().ToList();
        if (studentIds.Count == 0)
        {
            return Ok(new ParentDashboardResponse([], [], [], 0, 0m));
        }

        var students = await dbContext.Students.AsNoTracking()
            .Where(x => studentIds.Contains(x.Id))
            .Join(
                dbContext.StudentEnrollments.AsNoTracking().Where(x => x.IsCurrent),
                s => s.Id,
                e => e.StudentId,
                (s, e) => new StudentSummary(s.Id, s.StudentNumber, s.FirstName, s.LastName, e.GradeId))
            .ToListAsync(cancellationToken);

        var recentAnnouncements = await dbContext.Announcements.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId
                && (x.Audience == "All" || x.Audience == "Parents")
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
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && studentIds.Contains(x.StudentId) && x.Status != "Paid")
            .SumAsync(x => x.TotalAmount, cancellationToken);

        return Ok(new ParentDashboardResponse(
            students,
            recentAnnouncements,
            upcomingEvents,
            0,
            pendingFees));
    }

    [HttpGet("students/{studentId:guid}/attendance")]
    public async Task<ActionResult<IReadOnlyList<StudentAttendanceRecord>>> GetStudentAttendance(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid parentUserId,
        Guid studentId,
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var hasAccess = await dbContext.StudentGuardians.AsNoTracking()
            .AnyAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.GuardianId == parentUserId && x.StudentId == studentId, cancellationToken);
        if (!hasAccess) return Forbid();

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

    [HttpGet("students/{studentId:guid}/fees")]
    public async Task<ActionResult<IReadOnlyList<StudentFeeRecord>>> GetStudentFees(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid parentUserId,
        Guid studentId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var hasAccess = await dbContext.StudentGuardians.AsNoTracking()
            .AnyAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.GuardianId == parentUserId && x.StudentId == studentId, cancellationToken);
        if (!hasAccess) return Forbid();

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

    [HttpGet("students/{studentId:guid}/results")]
    public async Task<ActionResult<IReadOnlyList<StudentResultRecord>>> GetStudentResults(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid parentUserId,
        Guid studentId,
        [FromQuery] Guid? academicYearId,
        [FromQuery] Guid? termId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var hasAccess = await dbContext.StudentGuardians.AsNoTracking()
            .AnyAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.GuardianId == parentUserId && x.StudentId == studentId, cancellationToken);
        if (!hasAccess) return Forbid();

        var query = dbContext.ReportCards.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId);
        if (academicYearId.HasValue) query = query.Where(x => x.AcademicYearId == academicYearId.Value);
        if (termId.HasValue) query = query.Where(x => x.TermId == termId.Value);

        var items = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new StudentResultRecord(x.AcademicYearId, x.TermId, x.GradeId, x.TotalMarks, x.AverageMark, x.PositionInClass, x.IsPublished))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("communication/send")]
    public async Task<ActionResult> SendMessage([FromBody] ParentMessageRequest request, CancellationToken cancellationToken)
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
                UserId = request.ParentUserId
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
            SenderUserId = request.ParentUserId,
            Content = request.Message.Trim(),
            SentAtUtc = DateTime.UtcNow
        };
        dbContext.Messages.Add(message);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { threadId = thread.Id, messageId = message.Id });
    }
}

public sealed record ParentDashboardResponse(
    IReadOnlyList<StudentSummary> Students,
    IReadOnlyList<AnnouncementSummary> RecentAnnouncements,
    IReadOnlyList<EventSummary> UpcomingEvents,
    int UnreadMessages,
    decimal PendingFees);

public sealed record StudentSummary(Guid Id, string StudentNumber, string FirstName, string LastName, Guid GradeId);
public sealed record AnnouncementSummary(Guid Id, string Title, DateTime PublishAtUtc);
public sealed record EventSummary(Guid Id, string Title, DateTime StartDateTime, string Location);
public sealed record StudentAttendanceRecord(DateTime Date, bool IsPresent, string Remarks);
public sealed record StudentFeeRecord(Guid InvoiceId, string InvoiceNumber, decimal TotalAmount, decimal PaidAmount, decimal Balance, string Status, DateTime CreatedAtUtc);
public sealed record StudentResultRecord(Guid AcademicYearId, Guid TermId, Guid GradeId, decimal TotalMarks, decimal AverageMark, int PositionInClass, bool IsPublished);

public sealed record ParentMessageRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid ParentUserId,
    Guid RecipientUserId,
    string Subject,
    string Message,
    Guid? StudentId);
