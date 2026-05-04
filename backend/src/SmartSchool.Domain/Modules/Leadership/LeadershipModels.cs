using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Students;

namespace SmartSchool.Domain.Modules.Leadership;

public class LeadershipPosition : TenantSchoolEntityBase
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string PositionType { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public int HierarchyOrder { get; set; }
    public string? Responsibilities { get; set; }
    public string? Qualifications { get; set; }
    public string? SelectionProcess { get; set; }
    public string? TermDuration { get; set; }
    public bool IsActive { get; set; } = true;
}

public class StudentLeadershipAssignment : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid LeadershipPositionId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid? GradeId { get; set; }
    public Guid? ClassId { get; set; }
    public Guid? HouseId { get; set; }
    public Guid? ClubId { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = "Active";
    public string AppointmentType { get; set; } = string.Empty;
    public Guid? AppointedByStaffId { get; set; }
    public string? ReasonForAppointment { get; set; }
    public string? ReasonForTermination { get; set; }
    public decimal? PerformanceRating { get; set; }
    public string? DutiesFulfilled { get; set; }

    public Student? Student { get; set; }
    public LeadershipPosition? LeadershipPosition { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public Grade? Grade { get; set; }
    public StaffMember? AppointedByStaff { get; set; }
}

public class LeadershipDuty : TenantSchoolEntityBase
{
    public Guid LeadershipPositionId { get; set; }
    public string DutyTitle { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Priority { get; set; }
    public bool IsActive { get; set; } = true;
}

public class LeadershipDutyLog : TenantSchoolEntityBase
{
    public Guid StudentLeadershipAssignmentId { get; set; }
    public Guid LeadershipDutyId { get; set; }
    public DateOnly DutyDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public int? DurationMinutes { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? PerformanceNotes { get; set; }
    public Guid? SupervisorStaffId { get; set; }
    public decimal? SupervisorRating { get; set; }
    public string? SupervisorComments { get; set; }
}
