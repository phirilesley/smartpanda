using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Students;

namespace SmartSchool.Domain.Modules.Awards;

public class AwardCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string CategoryType { get; set; } = string.Empty;
    public string AwardType { get; set; } = string.Empty;
    public string? SelectionCriteria { get; set; }
    public string AwardFrequency { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class Award : TenantSchoolEntityBase
{
    public Guid AwardCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string AwardLevel { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public int PointsValue { get; set; }
    public string? CertificateTemplate { get; set; }
    public string? PhysicalAward { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid? TermId { get; set; }
    public bool IsActive { get; set; } = true;

    public AwardCategory? AwardCategory { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public Term? Term { get; set; }
}

public class StudentAward : TenantSchoolEntityBase
{
    public Guid AwardId { get; set; }
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid? TermId { get; set; }
    public DateOnly AwardDate { get; set; }
    public DateOnly? CeremonyDate { get; set; }
    public string? CeremonyName { get; set; }
    public string? Reason { get; set; }
    public string? AchievementDetails { get; set; }
    public string? Ranking { get; set; }
    public string? CertificateNumber { get; set; }
    public Guid? IssuedByStaffId { get; set; }
    public Guid? PresentedByStaffId { get; set; }
    public bool CertificateIssued { get; set; }
    public bool PhysicalAwardIssued { get; set; }
    public int PointsAwarded { get; set; }
    public string Status { get; set; } = "Awarded";

    public Award? Award { get; set; }
    public Student? Student { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public Term? Term { get; set; }
    public StaffMember? IssuedByStaff { get; set; }
    public StaffMember? PresentedByStaff { get; set; }
}

public class PrizeGivingCeremony : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string CeremonyType { get; set; } = string.Empty;
    public DateOnly CeremonyDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public string? Venue { get; set; }
    public Guid? OrganizerStaffId { get; set; }
    public string? MasterOfCeremonies { get; set; }
    public string? GuestOfHonor { get; set; }
    public int ExpectedAttendees { get; set; }
    public string Status { get; set; } = "Planned";
    public string? Program { get; set; }
    public string? Notes { get; set; }

    public StaffMember? OrganizerStaff { get; set; }
}

public class CeremonyAward : TenantSchoolEntityBase
{
    public Guid PrizeGivingCeremonyId { get; set; }
    public Guid StudentAwardId { get; set; }
    public int PresentationOrder { get; set; }
    public Guid? PresenterStaffId { get; set; }
    public string? SpecialNotes { get; set; }
}
