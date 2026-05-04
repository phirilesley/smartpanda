using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Communication;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/communication")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class CommunicationController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("announcements")]
    public async Task<ActionResult<IReadOnlyList<Announcement>>> GetAnnouncements([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var now = DateTime.UtcNow;
        var items = await dbContext.Announcements.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.PublishAtUtc <= now && (x.ExpireAtUtc == null || x.ExpireAtUtc > now))
            .OrderByDescending(x => x.PublishAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("announcements")]
    public async Task<ActionResult<Announcement>> CreateAnnouncement([FromBody] CreateAnnouncementRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new Announcement
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            Audience = request.Audience.Trim(),
            PublishAtUtc = request.PublishAtUtc,
            ExpireAtUtc = request.ExpireAtUtc
        };

        dbContext.Announcements.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity);
    }

    [HttpPost("threads")]
    public async Task<ActionResult<MessageThread>> CreateThread([FromBody] CreateMessageThreadRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        if (request.ParticipantUserIds.Count == 0) return BadRequest("At least one participant is required.");

        var thread = new MessageThread
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Subject = request.Subject.Trim(),
            IsClosed = false
        };

        dbContext.MessageThreads.Add(thread);
        await dbContext.SaveChangesAsync(cancellationToken);

        var participants = request.ParticipantUserIds.Distinct().Select(userId => new MessageParticipant
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            MessageThreadId = thread.Id,
            UserId = userId
        }).ToList();

        dbContext.MessageParticipants.AddRange(participants);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(thread);
    }

    [HttpGet("threads")]
    public async Task<ActionResult<IReadOnlyList<MessageThread>>> GetThreads([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.MessageThreads.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("threads/{threadId:guid}/messages")]
    public async Task<ActionResult<IReadOnlyList<Message>>> GetMessages(Guid threadId, CancellationToken cancellationToken)
    {
        var thread = await dbContext.MessageThreads.AsNoTracking().FirstOrDefaultAsync(x => x.Id == threadId, cancellationToken);
        if (thread is null) return NotFound();
        if (!User.CanAccessTenant(thread.TenantId)) return Forbid();

        var items = await dbContext.Messages.AsNoTracking()
            .Where(x => x.MessageThreadId == threadId)
            .OrderBy(x => x.SentAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("threads/{threadId:guid}/messages")]
    public async Task<ActionResult<Message>> PostMessage(Guid threadId, [FromBody] PostMessageRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var thread = await dbContext.MessageThreads.FirstOrDefaultAsync(x =>
            x.Id == threadId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (thread is null) return NotFound();
        if (thread.IsClosed) return BadRequest("Thread is closed.");

        var isParticipant = await dbContext.MessageParticipants.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.MessageThreadId == threadId && x.UserId == request.SenderUserId,
            cancellationToken);

        if (!isParticipant) return Forbid();

        var message = new Message
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            MessageThreadId = threadId,
            SenderUserId = request.SenderUserId,
            Content = request.Content.Trim(),
            SentAtUtc = DateTime.UtcNow
        };

        dbContext.Messages.Add(message);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(message);
    }

    [HttpGet("announcements/{id:guid}")]
    public async Task<ActionResult<Announcement>> GetAnnouncement(Guid id, CancellationToken cancellationToken)
    {
        var announcement = await dbContext.Announcements.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (announcement is null) return NotFound();

        if (!User.CanAccessTenant(announcement.TenantId)) return Forbid();

        return Ok(announcement);
    }

    [HttpPut("announcements/{id:guid}")]
    public async Task<ActionResult<Announcement>> UpdateAnnouncement(Guid id, [FromBody] UpdateAnnouncementRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var announcement = await dbContext.Announcements.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (announcement is null) return NotFound();

        if (!User.CanAccessTenant(announcement.TenantId)) return Forbid();

        announcement.Title = request.Title.Trim();
        announcement.Content = request.Content.Trim();
        announcement.Audience = request.Audience.Trim();
        announcement.PublishAtUtc = request.PublishAtUtc;
        announcement.ExpireAtUtc = request.ExpireAtUtc;
        announcement.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(announcement);
    }

    [HttpDelete("announcements/{id:guid}")]
    public async Task<IActionResult> DeleteAnnouncement(Guid id, CancellationToken cancellationToken)
    {
        var announcement = await dbContext.Announcements.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (announcement is null) return NotFound();

        if (!User.CanAccessTenant(announcement.TenantId)) return Forbid();

        dbContext.Announcements.Remove(announcement);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("threads/{threadId:guid}")]
    public async Task<ActionResult<MessageThread>> GetThread(Guid threadId, CancellationToken cancellationToken)
    {
        var thread = await dbContext.MessageThreads.AsNoTracking().FirstOrDefaultAsync(x => x.Id == threadId, cancellationToken);
        if (thread is null) return NotFound();

        if (!User.CanAccessTenant(thread.TenantId)) return Forbid();

        return Ok(thread);
    }

    [HttpPut("threads/{threadId:guid}/close")]
    public async Task<ActionResult<MessageThread>> CloseThread(Guid threadId, [FromBody] CloseThreadRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var thread = await dbContext.MessageThreads.FirstOrDefaultAsync(x => x.Id == threadId, cancellationToken);
        if (thread is null) return NotFound();

        if (!User.CanAccessTenant(thread.TenantId)) return Forbid();

        thread.IsClosed = true;
        thread.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(thread);
    }

    [HttpDelete("threads/{threadId:guid}")]
    public async Task<IActionResult> DeleteThread(Guid threadId, CancellationToken cancellationToken)
    {
        var thread = await dbContext.MessageThreads.FirstOrDefaultAsync(x => x.Id == threadId, cancellationToken);
        if (thread is null) return NotFound();

        if (!User.CanAccessTenant(thread.TenantId)) return Forbid();

        // Remove related messages and participants first
        var messages = await dbContext.Messages.Where(x => x.MessageThreadId == threadId).ToListAsync(cancellationToken);
        var participants = await dbContext.MessageParticipants.Where(x => x.MessageThreadId == threadId).ToListAsync(cancellationToken);

        dbContext.Messages.RemoveRange(messages);
        dbContext.MessageParticipants.RemoveRange(participants);
        dbContext.MessageThreads.Remove(thread);

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateAnnouncementRequest(Guid TenantId, Guid SchoolId, string Title, string Content, string Audience, DateTime PublishAtUtc, DateTime? ExpireAtUtc);
public sealed record UpdateAnnouncementRequest(Guid TenantId, string Title, string Content, string Audience, DateTime PublishAtUtc, DateTime? ExpireAtUtc);
public sealed record CreateMessageThreadRequest(Guid TenantId, Guid SchoolId, string Subject, List<Guid> ParticipantUserIds);
public sealed record PostMessageRequest(Guid TenantId, Guid SchoolId, Guid SenderUserId, string Content);
public sealed record CloseThreadRequest(Guid TenantId);
