using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Transport;

public class TransportVehicle : TenantSchoolEntityBase
{
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public Guid DriverStaffId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class TransportRoute : TenantSchoolEntityBase
{
    public string RouteCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string StartLocation { get; set; } = string.Empty;
    public string EndLocation { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class TransportRouteStop : TenantSchoolEntityBase
{
    public Guid TransportRouteId { get; set; }
    public string StopName { get; set; } = string.Empty;
    public int StopOrder { get; set; }
    public TimeOnly PlannedTime { get; set; }
}

public class TransportStudentAssignment : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid TransportRouteId { get; set; }
    public Guid? PickupStopId { get; set; }
    public Guid? DropoffStopId { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public string Status { get; set; } = "Active";
}

public class TransportTrip : TenantSchoolEntityBase
{
    public Guid TransportVehicleId { get; set; }
    public Guid TransportRouteId { get; set; }
    public Guid DriverStaffId { get; set; }
    public DateOnly TripDate { get; set; }
    public string Direction { get; set; } = "Pickup";
    public DateTime? DepartureAtUtc { get; set; }
    public DateTime? ArrivalAtUtc { get; set; }
    public string Status { get; set; } = "Planned";
}

