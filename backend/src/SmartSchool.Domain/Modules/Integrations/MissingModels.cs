using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.Academics;

namespace SmartSchool.Domain.Modules.Integrations;

// Note: SecurityEvent, DataEncryptionLog, DataDecryptionLog, RbacAssignment, 
// VulnerabilityScanResult, SecurityAlert are defined in SmartSchool.Domain.Modules.Security.

// Additional missing models referenced in DbContext
public class Parent : TenantSchoolEntityBase { public string FirstName { get; set; } = string.Empty; public string LastName { get; set; } = string.Empty; public string Email { get; set; } = string.Empty; public string PasswordHash { get; set; } = string.Empty; public string PhoneNumber { get; set; } = string.Empty; public ICollection<Student> Students { get; set; } = new List<Student>(); }
public class Notice : TenantSchoolEntityBase { public string Title { get; set; } = string.Empty; public string Content { get; set; } = string.Empty; public string NoticeType { get; set; } = string.Empty; public string TargetAudience { get; set; } = string.Empty; public bool IsPublished { get; set; } public DateTime StartDate { get; set; } public DateTime EndDate { get; set; } }
public class StudentExamResult : TenantSchoolEntityBase { public Guid StudentId { get; set; } public Guid SubjectId { get; set; } public Guid ExamId { get; set; } public Guid ClassId { get; set; } public Guid AcademicYearId { get; set; } public Guid TermId { get; set; } public decimal Marks { get; set; } public string Grade { get; set; } = string.Empty; public string Remarks { get; set; } = string.Empty; public Guid SubmittedByUserId { get; set; } }
public class ClassTeacherAssignment : TenantSchoolEntityBase { public Guid StaffId { get; set; } public Guid ClassId { get; set; } }
public class ClassSubjectAssignment : TenantSchoolEntityBase { public Guid ClassId { get; set; } public Guid SubjectId { get; set; } }
public class Class : TenantSchoolEntityBase { public string Name { get; set; } = string.Empty; public Guid GradeId { get; set; } public bool IsActive { get; set; } = true; public Grade Grade { get; set; } = null!; }
public class Invoice : TenantSchoolEntityBase { public Guid StudentId { get; set; } public string Description { get; set; } = string.Empty; public decimal TotalAmount { get; set; } public DateTime DueDate { get; set; } public string Status { get; set; } = string.Empty; public Guid AcademicYearId { get; set; } }
public class MobileMoneyTransaction : TenantSchoolEntityBase { public Guid StudentId { get; set; } public decimal Amount { get; set; } }
public class ZIPITTransaction : TenantSchoolEntityBase { public Guid StudentId { get; set; } public decimal Amount { get; set; } }
public class AccessLog : TenantSchoolEntityBase { public Guid UserId { get; set; } public string Resource { get; set; } = string.Empty; public string Action { get; set; } = string.Empty; public string AccessResult { get; set; } = string.Empty; }
public class SecurityAuditTrail : TenantSchoolEntityBase { public Guid UserId { get; set; } public string Action { get; set; } = string.Empty; }
public class OfflineSyncSession : TenantSchoolEntityBase { public Guid UserId { get; set; } public DateTime SyncTime { get; set; } }
public class SyncSession : TenantSchoolEntityBase { public Guid UserId { get; set; } }
public class DocumentRecord : TenantSchoolEntityBase { public Guid StudentId { get; set; } public string DocumentType { get; set; } = string.Empty; }
public class GeneratedDocument : TenantSchoolEntityBase { public Guid StudentId { get; set; } }
public class DocumentTemplate : TenantSchoolEntityBase { public string Name { get; set; } = string.Empty; }
public class DocumentGenerationSchedule : TenantSchoolEntityBase { public string Name { get; set; } = string.Empty; }
public class ScheduledDocumentGeneration : TenantSchoolEntityBase { public Guid ScheduleId { get; set; } }
public class BulkDocumentGeneration : TenantSchoolEntityBase { public string Name { get; set; } = string.Empty; }
public class WebhookLog : TenantEntityBase { public string Payload { get; set; } = string.Empty; }
public class SuspiciousAccessBlock : TenantSchoolEntityBase { public string IpAddress { get; set; } = string.Empty; }
public class Resource : TenantSchoolEntityBase { public string Name { get; set; } = string.Empty; }
public class ZIMSECResult : TenantSchoolEntityBase { public Guid StudentId { get; set; } }
public class OfflinePendingUpload : TenantSchoolEntityBase { public Guid UserId { get; set; } }
public class OfflinePendingDownload : TenantSchoolEntityBase { public Guid UserId { get; set; } }
public class OfflineSyncLog : TenantSchoolEntityBase { public Guid UserId { get; set; } }
public class Exam : TenantSchoolEntityBase { public string Name { get; set; } = string.Empty; }
public class Developer : TenantEntityBase { public string Name { get; set; } = string.Empty; }
