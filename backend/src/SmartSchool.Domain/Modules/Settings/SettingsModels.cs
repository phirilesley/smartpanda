using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Settings;

public class SchoolSetting : TenantSchoolEntityBase
{
    public string SettingKey { get; set; } = string.Empty;
    public string SettingValue { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsSensitive { get; set; }
}

public class MasterDataItem : TenantSchoolEntityBase
{
    public string DataType { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
