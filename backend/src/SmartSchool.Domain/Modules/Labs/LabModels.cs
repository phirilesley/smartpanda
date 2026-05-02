using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Labs;

public class ComputerLab : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
}

public class LabComputer : TenantSchoolEntityBase
{
    public Guid ComputerLabId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class LabBooking : TenantSchoolEntityBase
{
    public Guid ComputerLabId { get; set; }
    public Guid TeacherStaffId { get; set; }
    public DateTime StartTimeUtc { get; set; }
    public DateTime EndTimeUtc { get; set; }
    public Guid GradeId { get; set; }
    public Guid StreamId { get; set; }
}

public class LabFault : TenantSchoolEntityBase
{
    public Guid LabComputerId { get; set; }
    public DateTime ReportedAtUtc { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
