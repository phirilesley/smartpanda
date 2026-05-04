using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Security;

public class SecurityEvent : TenantSchoolEntityBase
{
    public string EventType { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public string AdditionalData { get; set; } = string.Empty;
    public bool Resolved { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
    public Guid? ResolvedByUserId { get; set; }
    public string ResolutionNotes { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class DataEncryptionLog : TenantSchoolEntityBase
{
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public string DataFields { get; set; } = string.Empty;
    public Guid EncryptedByUserId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class DataDecryptionLog : TenantSchoolEntityBase
{
    public Guid EncryptionLogId { get; set; }
    public Guid DecryptedByUserId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class RbacAssignment : TenantSchoolEntityBase
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public string Permissions { get; set; } = string.Empty;
    public Guid AssignedByUserId { get; set; }
    public bool IsActive { get; set; }
}

public class VulnerabilityScanResult : TenantSchoolEntityBase
{
    public string ScanType { get; set; } = string.Empty;
    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public string Status { get; set; } = string.Empty;
    public string VulnerabilitiesJson { get; set; } = "[]";
    public int TotalVulnerabilities { get; set; }
    public int CriticalVulnerabilities { get; set; }
    public int HighVulnerabilities { get; set; }
    public int MediumVulnerabilities { get; set; }
    public int LowVulnerabilities { get; set; }
}

public class SecurityAlert : TenantEntityBase
{
    public Guid SecurityEventId { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime TriggeredAtUtc { get; set; }
    public bool IsResolved { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
}
