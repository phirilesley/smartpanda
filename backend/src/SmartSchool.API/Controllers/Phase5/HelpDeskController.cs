using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Realtime;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.HelpDesk;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/helpdesk")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class HelpDeskController(SmartSchoolDbContext dbContext, IHubContext<NotificationsHub> hubContext) : ControllerBase
{
    [HttpGet("tickets")]
    public async Task<ActionResult<IReadOnlyList<HelpDeskTicket>>> GetTickets([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] string? status, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.HelpDeskTickets.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(x => x.Status == status.Trim());

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("tickets")]
    public async Task<ActionResult<HelpDeskTicket>> CreateTicket([FromBody] CreateHelpDeskTicketRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var ticket = new HelpDeskTicket
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            TicketNumber = $"TKT-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(100,999)}",
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = request.Priority.Trim(),
            Status = "Open",
            RequestedByUserId = request.RequestedByUserId,
            AssignedToUserId = request.AssignedToUserId
        };

        dbContext.HelpDeskTickets.Add(ticket);
        await dbContext.SaveChangesAsync(cancellationToken);

        await BroadcastUpdate(request.TenantId, request.SchoolId, "ticket.created", new { ticket.Id, ticket.TicketNumber, ticket.Title, ticket.Status });

        return Ok(ticket);
    }

    [HttpPost("tickets/{ticketId:guid}/comments")]
    public async Task<ActionResult<HelpDeskComment>> AddComment(Guid ticketId, [FromBody] AddHelpDeskCommentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var ticket = await dbContext.HelpDeskTickets.FirstOrDefaultAsync(x =>
            x.Id == ticketId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (ticket is null) return NotFound();

        var comment = new HelpDeskComment
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HelpDeskTicketId = ticketId,
            UserId = request.UserId,
            Comment = request.Comment.Trim(),
            CommentedAtUtc = DateTime.UtcNow
        };

        dbContext.HelpDeskComments.Add(comment);

        if (!string.IsNullOrWhiteSpace(request.NewStatus))
        {
            ticket.Status = request.NewStatus.Trim();
            ticket.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        await BroadcastUpdate(request.TenantId, request.SchoolId, "ticket.comment", new { ticketId, comment.Id, comment.Comment, ticket.Status });

        return Ok(comment);
    }

    [HttpGet("tickets/{ticketId:guid}")]
    public async Task<ActionResult<HelpDeskTicket>> GetTicket(Guid ticketId, CancellationToken cancellationToken)
    {
        var ticket = await dbContext.HelpDeskTickets.AsNoTracking().FirstOrDefaultAsync(x => x.Id == ticketId, cancellationToken);
        if (ticket is null) return NotFound();

        if (!User.CanAccessTenant(ticket.TenantId)) return Forbid();

        return Ok(ticket);
    }

    [HttpPut("tickets/{ticketId:guid}")]
    public async Task<ActionResult<HelpDeskTicket>> UpdateTicket(Guid ticketId, [FromBody] UpdateHelpDeskTicketRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var ticket = await dbContext.HelpDeskTickets.FirstOrDefaultAsync(x => x.Id == ticketId, cancellationToken);
        if (ticket is null) return NotFound();

        if (!User.CanAccessTenant(ticket.TenantId)) return Forbid();

        ticket.Title = request.Title.Trim();
        ticket.Description = request.Description.Trim();
        ticket.Priority = request.Priority.Trim();
        ticket.Status = request.Status.Trim();
        ticket.AssignedToUserId = request.AssignedToUserId;
        ticket.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        await BroadcastUpdate(request.TenantId, ticket.SchoolId, "ticket.updated", new { ticket.Id, ticket.Title, ticket.Status });

        return Ok(ticket);
    }

    [HttpDelete("tickets/{ticketId:guid}")]
    public async Task<IActionResult> DeleteTicket(Guid ticketId, CancellationToken cancellationToken)
    {
        var ticket = await dbContext.HelpDeskTickets.FirstOrDefaultAsync(x => x.Id == ticketId, cancellationToken);
        if (ticket is null) return NotFound();

        if (!User.CanAccessTenant(ticket.TenantId)) return Forbid();

        // Remove comments first
        var comments = await dbContext.HelpDeskComments.Where(x => x.HelpDeskTicketId == ticketId).ToListAsync(cancellationToken);
        dbContext.HelpDeskComments.RemoveRange(comments);

        // Remove ticket
        dbContext.HelpDeskTickets.Remove(ticket);
        await dbContext.SaveChangesAsync(cancellationToken);

        await BroadcastUpdate(ticket.TenantId, ticket.SchoolId, "ticket.deleted", new { ticket.Id, ticket.TicketNumber });

        return NoContent();
    }

    [HttpGet("tickets/{ticketId:guid}/comments")]
    public async Task<ActionResult<IReadOnlyList<HelpDeskComment>>> GetComments(Guid ticketId, CancellationToken cancellationToken)
    {
        var ticket = await dbContext.HelpDeskTickets.AsNoTracking().FirstOrDefaultAsync(x => x.Id == ticketId, cancellationToken);
        if (ticket is null) return NotFound();

        if (!User.CanAccessTenant(ticket.TenantId)) return Forbid();

        var comments = await dbContext.HelpDeskComments.AsNoTracking()
            .Where(x => x.HelpDeskTicketId == ticketId)
            .OrderBy(x => x.CommentedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(comments);
    }

    private Task BroadcastUpdate(Guid tenantId, Guid schoolId, string eventType, object payload)
    {
        var group = $"tenant:{tenantId}:school:{schoolId}";
        return hubContext.Clients.Group(group).SendAsync("helpdeskEvent", new { eventType, payload });
    }
}

public sealed record CreateHelpDeskTicketRequest(Guid TenantId, Guid SchoolId, string Title, string Description, string Priority, Guid RequestedByUserId, Guid? AssignedToUserId);
public sealed record UpdateHelpDeskTicketRequest(Guid TenantId, string Title, string Description, string Priority, string Status, Guid? AssignedToUserId);
public sealed record AddHelpDeskCommentRequest(Guid TenantId, Guid SchoolId, Guid UserId, string Comment, string? NewStatus);
