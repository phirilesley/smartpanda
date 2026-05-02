using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Notifications;

public class NotificationTemplate : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string SubjectTemplate { get; set; } = string.Empty;
    public string BodyTemplate { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class Notification : TenantSchoolEntityBase
{
    public Guid? UserId { get; set; }
    public Guid? StudentId { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime? SentAtUtc { get; set; }
    public string Status { get; set; } = string.Empty;
}
