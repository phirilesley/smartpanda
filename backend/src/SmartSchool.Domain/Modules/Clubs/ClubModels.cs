using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Students;

namespace SmartSchool.Domain.Modules.Clubs;

public class ClubCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class Club : TenantSchoolEntityBase
{
    public Guid ClubCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? MissionStatement { get; set; }
    public string? Objectives { get; set; }
    public string? MeetingSchedule { get; set; }
    public string? MeetingLocation { get; set; }
    public int MaxMembers { get; set; }
    public int CurrentMembers { get; set; }
    public decimal MembershipFee { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid? AdvisorStaffId { get; set; }
    public Guid? CoAdvisorStaffId { get; set; }
    public bool IsActive { get; set; } = true;

    public ClubCategory? ClubCategory { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public StaffMember? AdvisorStaff { get; set; }
    public StaffMember? CoAdvisorStaff { get; set; }
}

public class ClubMember : TenantSchoolEntityBase
{
    public Guid ClubId { get; set; }
    public Guid StudentId { get; set; }
    public string MemberType { get; set; } = string.Empty;
    public string? Position { get; set; }
    public DateOnly JoinDate { get; set; }
    public string Status { get; set; } = "Active";
    public bool MembershipFeePaid { get; set; }
    public decimal MembershipFeeAmount { get; set; }
    public string? Contribution { get; set; }

    public Student? Student { get; set; }
    public Club? Club { get; set; }
}

public class ClubMeeting : TenantSchoolEntityBase
{
    public Guid ClubId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly MeetingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public string? Location { get; set; }
    public string MeetingType { get; set; } = string.Empty;
    public string? Agenda { get; set; }
    public string Status { get; set; } = "Scheduled";

    public Club? Club { get; set; }
}

public class ClubActivity : TenantSchoolEntityBase
{
    public Guid ClubId { get; set; }
    public string ActivityName { get; set; } = string.Empty;
    public DateOnly ActivityDate { get; set; }
    public string? Notes { get; set; }
}
