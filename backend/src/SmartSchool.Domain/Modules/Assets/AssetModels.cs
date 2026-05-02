using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Assets;

public class AssetCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
}

public class AssetItem : TenantSchoolEntityBase
{
    public Guid AssetCategoryId { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public decimal Cost { get; set; }
}

public class AssetAssignment : TenantSchoolEntityBase
{
    public Guid AssetItemId { get; set; }
    public Guid AssignedToStaffId { get; set; }
    public DateTime AssignedDate { get; set; }
}

public class AssetMaintenance : TenantSchoolEntityBase
{
    public Guid AssetItemId { get; set; }
    public DateTime MaintenanceDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Cost { get; set; }
}
