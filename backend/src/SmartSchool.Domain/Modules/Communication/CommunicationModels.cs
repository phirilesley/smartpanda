using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Communication;

public class Announcement : TenantSchoolEntityBase
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public DateTime PublishAtUtc { get; set; }
    public DateTime? ExpireAtUtc { get; set; }
}

public class MessageThread : TenantSchoolEntityBase
{
    public string Subject { get; set; } = string.Empty;
    public bool IsClosed { get; set; }
}

public class MessageParticipant : TenantSchoolEntityBase
{
    public Guid MessageThreadId { get; set; }
    public Guid UserId { get; set; }
}

public class Message : TenantSchoolEntityBase
{
    public Guid MessageThreadId { get; set; }
    public Guid SenderUserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAtUtc { get; set; }
}
