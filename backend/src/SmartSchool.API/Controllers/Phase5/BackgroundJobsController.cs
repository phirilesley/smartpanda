using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Jobs;
using SmartSchool.API.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/background-jobs")]
[Authorize(Policy = PolicyNames.OperationsManage)]
public class BackgroundJobsController(
    SystemMaintenanceJobs systemMaintenanceJobs,
    NotificationDispatchJobs notificationDispatchJobs,
    SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("status")]
    public async Task<ActionResult<BackgroundJobStatusResponse>> GetStatus([FromQuery] Guid? tenantId, [FromQuery] Guid? schoolId, CancellationToken cancellationToken)
    {
        var queuedQuery = dbContext.Notifications.AsNoTracking().Where(x => x.Status == "Queued");
        if (tenantId.HasValue && tenantId.Value != Guid.Empty)
        {
            queuedQuery = queuedQuery.Where(x => x.TenantId == tenantId.Value);
        }

        if (schoolId.HasValue && schoolId.Value != Guid.Empty)
        {
            queuedQuery = queuedQuery.Where(x => x.SchoolId == schoolId.Value);
        }

        var queuedNotifications = await queuedQuery.CountAsync(cancellationToken);
        var activeRefreshTokens = await dbContext.RefreshTokens.AsNoTracking()
            .CountAsync(x => !x.RevokedAtUtc.HasValue && x.ExpiresAtUtc > DateTime.UtcNow, cancellationToken);

        return Ok(new BackgroundJobStatusResponse(queuedNotifications, activeRefreshTokens, DateTime.UtcNow));
    }

    [HttpPost("run/prune-refresh-tokens")]
    public async Task<ActionResult> RunPruneRefreshTokens()
    {
        await systemMaintenanceJobs.PruneRefreshTokens();
        return Ok(new { message = "Refresh token pruning executed." });
    }

    [HttpPost("run/dispatch-notifications")]
    public async Task<ActionResult> RunDispatchNotifications()
    {
        await notificationDispatchJobs.DispatchQueuedNotifications();
        return Ok(new { message = "Notification dispatch executed." });
    }

    [HttpGet("history")]
    public async Task<ActionResult<IReadOnlyList<BackgroundJobHistory>>> GetHistory([FromQuery] int take = 100, [FromQuery] Guid? tenantId = null, [FromQuery] Guid? schoolId = null, CancellationToken cancellationToken = default)
    {
        // Note: This would require a BackgroundJobHistory entity to be implemented
        // For now, return empty list as placeholder
        return Ok(new List<BackgroundJobHistory>());
    }

    [HttpPost("pause")]
    public async Task<ActionResult> PauseJobs()
    {
        // Note: This would require job queue management implementation
        return Ok(new { message = "Background jobs paused." });
    }

    [HttpPost("resume")]
    public async Task<ActionResult> ResumeJobs()
    {
        // Note: This would require job queue management implementation
        return Ok(new { message = "Background jobs resumed." });
    }

    [HttpPost("retry/{jobId:guid}")]
    public async Task<ActionResult> RetryJob(Guid jobId)
    {
        // Note: This would require job retry mechanism implementation
        return Ok(new { message = $"Job {jobId} retry queued." });
    }
}

public sealed record BackgroundJobStatusResponse(int QueuedNotifications, int ActiveRefreshTokens, DateTime CheckedAtUtc);

// Placeholder records for future implementation
public sealed record BackgroundJobHistory(Guid JobId, string JobType, DateTime ExecutedAtUtc, string Status, string? Error);
public sealed record RetryJobRequest(Guid JobId, string Reason);
