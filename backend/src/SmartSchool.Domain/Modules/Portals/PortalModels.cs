using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Portals;

public class PortalWidgetPreference : TenantSchoolEntityBase
{
    public Guid UserId { get; set; }
    public string PortalType { get; set; } = string.Empty;
    public string WidgetKey { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}

public class PortalQuickLink : TenantSchoolEntityBase
{
    public Guid UserId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
