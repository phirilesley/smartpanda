using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Memos;

public class MemoRequest : TenantSchoolEntityBase
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public Guid RequestedByUserId { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class MemoApprover : TenantSchoolEntityBase
{
    public Guid MemoRequestId { get; set; }
    public Guid ApproverUserId { get; set; }
    public int ApprovalOrder { get; set; }
}

public class MemoApprovalAction : TenantSchoolEntityBase
{
    public Guid MemoRequestId { get; set; }
    public Guid ApproverUserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime ActionAtUtc { get; set; }
}

public class MemoAttachment : TenantSchoolEntityBase
{
    public Guid MemoRequestId { get; set; }
    public Guid UploadedFileId { get; set; }
}
