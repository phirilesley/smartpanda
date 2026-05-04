using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Students;

namespace SmartSchool.Domain.Modules.Sports;

public class SportCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class Sport : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Code { get; set; }
    public Guid? SportCategoryId { get; set; }
    public int TeamSize { get; set; }
    public bool IsTeamSport { get; set; }
    public string? EquipmentRequired { get; set; }
    public string? Season { get; set; }
    public bool IsActive { get; set; } = true;

    public SportCategory? SportCategory { get; set; }
}

public class House : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string ColorCode { get; set; } = string.Empty;
}

public class SportTeam : TenantSchoolEntityBase
{
    public Guid SportId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? HouseId { get; set; }
    public string? Description { get; set; }
    public string TeamType { get; set; } = string.Empty;
    public Guid? GradeId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public Guid? CoachStaffId { get; set; }
    public Guid? AssistantCoachStaffId { get; set; }
    public int MaxMembers { get; set; }
    public int CurrentMembers { get; set; }
    public string? PracticeSchedule { get; set; }
    public string? HomeVenue { get; set; }
    public bool IsActive { get; set; } = true;

    public Sport? Sport { get; set; }
    public Grade? Grade { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public StaffMember? CoachStaff { get; set; }
    public StaffMember? AssistantCoachStaff { get; set; }
}

public class SportPlayer : TenantSchoolEntityBase
{
    public Guid SportTeamId { get; set; }
    public Guid StudentId { get; set; }
    public string Position { get; set; } = string.Empty;
}

public class Fixture : TenantSchoolEntityBase
{
    public Guid SportTeamId { get; set; }
    public DateTime FixtureDateUtc { get; set; }
    public string Opponent { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
}

public class SportResult : TenantSchoolEntityBase
{
    public Guid FixtureId { get; set; }
    public int TeamScore { get; set; }
    public int OpponentScore { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class SportTeamMember : TenantSchoolEntityBase
{
    public Guid SportTeamId { get; set; }
    public Guid StudentId { get; set; }
    public string? Position { get; set; }
    public int? JerseyNumber { get; set; }
    public DateOnly JoinDate { get; set; }
    public string Status { get; set; } = "Active";
    public bool Captain { get; set; }
    public bool ViceCaptain { get; set; }
    public decimal? PerformanceRating { get; set; }
    public string? Notes { get; set; }

    public SportTeam? SportTeam { get; set; }
    public Student? Student { get; set; }
}

public class SportEvent : TenantSchoolEntityBase
{
    public Guid? SportId { get; set; }
    public Guid? SportTeamId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public DateOnly EventDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public string Venue { get; set; } = string.Empty;
    public string? Opponent { get; set; }
    public string Status { get; set; } = "Scheduled";
}

public class SportAchievement : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid? SportTeamId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateOnly AchievementDate { get; set; }
    public string Level { get; set; } = string.Empty;

    public Student? Student { get; set; }
    public SportTeam? SportTeam { get; set; }
}
