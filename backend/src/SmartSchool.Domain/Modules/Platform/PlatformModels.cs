using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Platform;

public class Tenant : EntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SubscriptionPlan : EntityBase
{
    public string Name { get; set; } = string.Empty;
    public decimal MonthlyPriceUsd { get; set; }
    public int MaxSchools { get; set; }
    public int MaxUsers { get; set; }
    public bool IsActive { get; set; } = true;
}

public class TenantSubscription : EntityBase
{
    public Guid TenantId { get; set; }
    public Guid SubscriptionPlanId { get; set; }
    public DateTime StartDateUtc { get; set; }
    public DateTime EndDateUtc { get; set; }
    public bool AutoRenew { get; set; }
    public RecordStatus Status { get; set; } = RecordStatus.Active;
}

public class School : TenantEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class SchoolBranch : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string BranchCode { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
