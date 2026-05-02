using Microsoft.EntityFrameworkCore;
using SmartSchool.Application.Portals;
using SmartSchool.Persistence.Data;

namespace SmartSchool.Infrastructure.Portals;

public class PortalDashboardService(SmartSchoolDbContext dbContext) : IPortalDashboardService
{
    public async Task<ParentPortalDashboard?> GetParentDashboardAsync(Guid tenantId, Guid schoolId, Guid parentUserId, Guid studentId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == studentId && x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        if (student is null) return null;

        var outstandingFees = await GetOutstandingFeesAsync(tenantId, schoolId, studentId, cancellationToken);
        var attendance = await GetAttendanceStatsAsync(tenantId, schoolId, studentId, cancellationToken);
        var announcements = await GetRecentAnnouncementsAsync(tenantId, schoolId, cancellationToken);
        var results = await GetRecentResultsAsync(tenantId, schoolId, studentId, cancellationToken);

        return new ParentPortalDashboard(
            StudentId: student.Id,
            StudentName: $"{student.FirstName} {student.LastName}".Trim(),
            OutstandingFees: outstandingFees,
            AttendancePresentCount: attendance.present,
            AttendanceAbsentCount: attendance.absent,
            RecentAnnouncements: announcements,
            RecentResults: results);
    }

    public async Task<StudentPortalDashboard?> GetStudentDashboardAsync(Guid tenantId, Guid schoolId, Guid studentUserId, Guid studentId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == studentId && x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        if (student is null) return null;

        var currentEnrollment = await dbContext.StudentEnrollments.AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.TenantId == tenantId &&
                x.SchoolId == schoolId &&
                x.StudentId == studentId &&
                x.IsCurrent,
                cancellationToken);

        var outstandingFees = await GetOutstandingFeesAsync(tenantId, schoolId, studentId, cancellationToken);
        var announcements = await GetRecentAnnouncementsAsync(tenantId, schoolId, cancellationToken);
        var borrowed = await dbContext.BookIssues.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.BorrowerStudentId == studentId && x.ReturnedDate == null)
            .OrderByDescending(x => x.IssuedDate)
            .Take(10)
            .Select(x => new PortalBookIssueItem(x.Id, x.BookCopyId, x.IssuedDate, x.DueDate, x.ReturnedDate))
            .ToListAsync(cancellationToken);

        var timetable = new List<PortalTimetableItem>();
        if (currentEnrollment is not null)
        {
            timetable = await dbContext.TimetableEntries.AsNoTracking()
                .Where(x =>
                    x.TenantId == tenantId &&
                    x.SchoolId == schoolId &&
                    x.GradeId == currentEnrollment.GradeId &&
                    x.StreamId == currentEnrollment.StreamId &&
                    x.AcademicYearId == currentEnrollment.AcademicYearId &&
                    x.TermId == currentEnrollment.TermId)
                .Take(30)
                .Select(x => new PortalTimetableItem(x.Id, x.SubjectId, x.RoomId, x.TimetablePeriodId))
                .ToListAsync(cancellationToken);
        }

        return new StudentPortalDashboard(
            StudentId: student.Id,
            StudentName: $"{student.FirstName} {student.LastName}".Trim(),
            OutstandingFees: outstandingFees,
            Timetable: timetable,
            RecentAnnouncements: announcements,
            BorrowedBooks: borrowed);
    }

    public async Task<StaffPortalDashboard?> GetStaffDashboardAsync(Guid tenantId, Guid schoolId, Guid staffUserId, Guid staffId, CancellationToken cancellationToken)
    {
        var staff = await dbContext.StaffMembers.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == staffId && x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        if (staff is null) return null;

        var timetable = await dbContext.TimetableEntries.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StaffId == staffId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(30)
            .Select(x => new PortalTimetableItem(x.Id, x.SubjectId, x.RoomId, x.TimetablePeriodId))
            .ToListAsync(cancellationToken);

        var openLabFaults = await dbContext.LabFaults.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status == "Open", cancellationToken);

        var openTickets = await dbContext.HelpDeskTickets.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status != "Closed", cancellationToken);

        var announcements = await GetRecentAnnouncementsAsync(tenantId, schoolId, cancellationToken);

        return new StaffPortalDashboard(
            StaffId: staff.Id,
            StaffName: $"{staff.FirstName} {staff.LastName}".Trim(),
            Timetable: timetable,
            OpenLabFaults: openLabFaults,
            OpenHelpDeskTickets: openTickets,
            RecentAnnouncements: announcements);
    }

    private async Task<decimal> GetOutstandingFeesAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken)
    {
        var totalInvoices = await dbContext.StudentInvoices.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId)
            .SumAsync(x => x.TotalAmount, cancellationToken);

        var totalPayments = await dbContext.Payments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId)
            .SumAsync(x => x.Amount, cancellationToken);

        return totalInvoices - totalPayments;
    }

    private async Task<(int present, int absent)> GetAttendanceStatsAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken)
    {
        var items = await dbContext.StudentAttendances.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId)
            .Select(x => x.IsPresent)
            .ToListAsync(cancellationToken);

        var present = items.Count(x => x);
        var absent = items.Count - present;
        return (present, absent);
    }

    private async Task<IReadOnlyList<PortalAnnouncementItem>> GetRecentAnnouncementsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        return await dbContext.Announcements.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.PublishAtUtc)
            .Take(10)
            .Select(x => new PortalAnnouncementItem(x.Id, x.Title, x.PublishAtUtc, x.Audience))
            .ToListAsync(cancellationToken);
    }

    private async Task<IReadOnlyList<PortalReportCardItem>> GetRecentResultsAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken)
    {
        return await dbContext.ReportCards.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.StudentId == studentId && x.IsPublished)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(6)
            .Select(x => new PortalReportCardItem(x.Id, x.AcademicYearId, x.TermId, x.AverageMark, x.PositionInClass, x.IsPublished))
            .ToListAsync(cancellationToken);
    }
}
