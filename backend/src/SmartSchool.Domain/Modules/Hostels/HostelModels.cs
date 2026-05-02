using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Hostels;

public class Hostel : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string GenderPolicy { get; set; } = "Any";
    public int Capacity { get; set; }
    public Guid? MatronStaffId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class HostelRoom : TenantSchoolEntityBase
{
    public Guid HostelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string FloorName { get; set; } = string.Empty;
}

public class HostelBed : TenantSchoolEntityBase
{
    public Guid HostelRoomId { get; set; }
    public string BedCode { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
}

public class HostelAllocation : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid HostelBedId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; } = true;
    public string Status { get; set; } = "Active";
}

public class HostelIncident : TenantSchoolEntityBase
{
    public Guid HostelId { get; set; }
    public Guid StudentId { get; set; }
    public Guid ReportedByStaffId { get; set; }
    public DateTime OccurredAtUtc { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string Status { get; set; } = "Open";
    public DateTime? ResolvedAtUtc { get; set; }
}
