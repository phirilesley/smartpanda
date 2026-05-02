using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Reports;

public class ReportDefinition : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string QueryKey { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class ReportRun : TenantSchoolEntityBase
{
    public Guid ReportDefinitionId { get; set; }
    public Guid RequestedByUserId { get; set; }
    public DateTime RequestedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid? OutputFileId { get; set; }
}
