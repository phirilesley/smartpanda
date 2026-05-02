using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Visitors;

public class Visitor : TenantSchoolEntityBase
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string IdNumber { get; set; } = string.Empty;
}

public class VisitorLog : TenantSchoolEntityBase
{
    public Guid VisitorId { get; set; }
    public Guid HostStaffId { get; set; }
    public DateTime CheckInAtUtc { get; set; }
    public DateTime? CheckOutAtUtc { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public string BadgeNumber { get; set; } = string.Empty;
}
