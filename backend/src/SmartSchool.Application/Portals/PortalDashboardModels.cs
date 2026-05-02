namespace SmartSchool.Application.Portals;

public sealed record ParentPortalDashboard(
    Guid StudentId,
    string StudentName,
    decimal OutstandingFees,
    int AttendancePresentCount,
    int AttendanceAbsentCount,
    IReadOnlyList<PortalAnnouncementItem> RecentAnnouncements,
    IReadOnlyList<PortalReportCardItem> RecentResults);

public sealed record StudentPortalDashboard(
    Guid StudentId,
    string StudentName,
    decimal OutstandingFees,
    IReadOnlyList<PortalTimetableItem> Timetable,
    IReadOnlyList<PortalAnnouncementItem> RecentAnnouncements,
    IReadOnlyList<PortalBookIssueItem> BorrowedBooks);

public sealed record StaffPortalDashboard(
    Guid StaffId,
    string StaffName,
    IReadOnlyList<PortalTimetableItem> Timetable,
    int OpenLabFaults,
    int OpenHelpDeskTickets,
    IReadOnlyList<PortalAnnouncementItem> RecentAnnouncements);

public sealed record PortalAnnouncementItem(Guid Id, string Title, DateTime PublishedAtUtc, string Audience);
public sealed record PortalReportCardItem(Guid Id, Guid AcademicYearId, Guid TermId, decimal Average, int PositionInClass, bool IsPublished);
public sealed record PortalTimetableItem(Guid TimetableEntryId, Guid SubjectId, Guid RoomId, Guid TimetablePeriodId);
public sealed record PortalBookIssueItem(Guid IssueId, Guid BookCopyId, DateTime IssuedDate, DateTime DueDate, DateTime? ReturnedDate);
