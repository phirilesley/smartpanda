using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Events;

public class SchoolEvent : TenantSchoolEntityBase
{
    public Guid? AcademicYearId { get; set; }
    public Guid? TermId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartAtUtc { get; set; }
    public DateTime EndAtUtc { get; set; }
    public string Venue { get; set; } = string.Empty;
    public int? MaxParticipants { get; set; }
    public Guid? OrganizerStaffId { get; set; }
    public string Status { get; set; } = "Scheduled";
}

public class EventParticipant : TenantSchoolEntityBase
{
    public Guid SchoolEventId { get; set; }
    public Guid? StudentId { get; set; }
    public Guid? GuardianId { get; set; }
    public Guid? StaffId { get; set; }
    public string ParticipantType { get; set; } = "Student";
    public string AttendanceStatus { get; set; } = "Registered";
}
