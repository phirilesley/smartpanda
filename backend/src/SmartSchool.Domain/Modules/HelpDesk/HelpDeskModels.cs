using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.HelpDesk;

public class HelpDeskTicket : TenantSchoolEntityBase
{
    public string TicketNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid RequestedByUserId { get; set; }
    public Guid? AssignedToUserId { get; set; }
}

public class HelpDeskComment : TenantSchoolEntityBase
{
    public Guid HelpDeskTicketId { get; set; }
    public Guid UserId { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CommentedAtUtc { get; set; }
}

public class HelpDeskSlaRule : TenantSchoolEntityBase
{
    public string Priority { get; set; } = string.Empty;
    public int FirstResponseMinutes { get; set; }
    public int ResolutionMinutes { get; set; }
    public bool IsActive { get; set; } = true;
}
