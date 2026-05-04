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
using SmartSchool.Domain.Modules.Notifications;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/notifications")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class NotificationsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("templates")]
    public async Task<ActionResult<IReadOnlyList<NotificationTemplate>>> GetTemplates([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.NotificationTemplates.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("templates")]
    public async Task<ActionResult<NotificationTemplate>> UpsertTemplate([FromBody] UpsertNotificationTemplateRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var keyName = request.Name.Trim();
        var keyChannel = request.Channel.Trim();

        var existing = await dbContext.NotificationTemplates.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == keyName && x.Channel == keyChannel,
            cancellationToken);

        if (existing is null)
        {
            existing = new NotificationTemplate
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                Name = keyName,
                Channel = keyChannel,
                SubjectTemplate = request.SubjectTemplate.Trim(),
                BodyTemplate = request.BodyTemplate.Trim(),
                IsActive = request.IsActive
            };

            dbContext.NotificationTemplates.Add(existing);
        }
        else
        {
            existing.SubjectTemplate = request.SubjectTemplate.Trim();
            existing.BodyTemplate = request.BodyTemplate.Trim();
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(existing);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Notification>>> GetQueue([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] string? status, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.Notifications.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(x => x.Status == status.Trim());

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Notification>> Enqueue([FromBody] EnqueueNotificationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new Notification
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            UserId = request.UserId,
            StudentId = request.StudentId,
            Channel = request.Channel.Trim(),
            Subject = request.Subject.Trim(),
            Body = request.Body.Trim(),
            Status = "Queued"
        };

        dbContext.Notifications.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity);
    }

    [HttpDelete("templates/{id}")]
    public async Task<ActionResult> DeleteTemplate(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.NotificationTemplates.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.NotificationTemplates.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteNotification(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.Notifications.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Allow deletion of queued notifications only
        if (entity.Status != "Queued") return BadRequest("Can only delete notifications with 'Queued' status.");

        dbContext.Notifications.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record UpsertNotificationTemplateRequest(Guid TenantId, Guid SchoolId, string Name, string Channel, string SubjectTemplate, string BodyTemplate, bool IsActive);
public sealed record EnqueueNotificationRequest(Guid TenantId, Guid SchoolId, Guid? UserId, Guid? StudentId, string Channel, string Subject, string Body);
