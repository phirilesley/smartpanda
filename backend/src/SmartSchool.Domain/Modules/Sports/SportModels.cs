using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Sports;

public class Sport : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
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
