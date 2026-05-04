using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Integrations;

public class GovernmentExportLog : TenantSchoolEntityBase
{
    public string ExportType { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public int RecordCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class GovernmentBulkSubmission : TenantSchoolEntityBase
{
    public string SubmissionType { get; set; } = string.Empty;
    public string DataFormat { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ProcessedRecords { get; set; }
    public DateTime SubmittedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public string? Error { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}
