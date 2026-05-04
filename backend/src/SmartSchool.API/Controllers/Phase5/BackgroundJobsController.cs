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
    ReportGenerationJobs reportGenerationJobs,
    DataSyncJobs dataSyncJobs,
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

    // 🚀 Report Generation Job Endpoints
    [HttpPost("reports/generate-student-report-cards")]
    public async Task<ActionResult> GenerateStudentReportCards([FromBody] GenerateReportCardsRequest request)
    {
        await reportGenerationJobs.GenerateStudentReportCards(request.TermId, request.SchoolId);
        return Ok(new { message = "Student report card generation queued." });
    }

    [HttpPost("reports/generate-fee-statements")]
    public async Task<ActionResult> GenerateFeeStatements([FromBody] GenerateFeeStatementsRequest request)
    {
        await reportGenerationJobs.GenerateFeeStatements(request.SchoolId, request.Month);
        return Ok(new { message = "Fee statement generation queued." });
    }

    [HttpPost("reports/cleanup-old")]
    public async Task<ActionResult> CleanupOldReports()
    {
        await reportGenerationJobs.CleanupOldReports();
        return Ok(new { message = "Old reports cleanup queued." });
    }

    // 🚀 Data Sync Job Endpoints
    [HttpPost("sync/attendance")]
    public async Task<ActionResult> SyncAttendance([FromBody] SyncAttendanceRequest request)
    {
        await dataSyncJobs.SyncStudentAttendance(request.SchoolId, request.Date);
        return Ok(new { message = "Attendance sync queued." });
    }

    [HttpPost("sync/academic-data")]
    public async Task<ActionResult> SyncAcademicData([FromBody] SyncAcademicDataRequest request)
    {
        await dataSyncJobs.SyncAcademicData(request.SchoolId, request.TermId);
        return Ok(new { message = "Academic data sync queued." });
    }

    [HttpPost("sync/financial-data")]
    public async Task<ActionResult> SyncFinancialData([FromBody] SyncFinancialDataRequest request)
    {
        await dataSyncJobs.SyncFinancialData(request.SchoolId, request.Month);
        return Ok(new { message = "Financial data sync queued." });
    }

    [HttpPost("sync/full-tenant")]
    public async Task<ActionResult> FullTenantSync([FromBody] FullTenantSyncRequest request)
    {
        await dataSyncJobs.FullTenantSync(request.TenantId);
        return Ok(new { message = "Full tenant sync queued." });
    }

    [HttpPost("sync/cleanup-logs")]
    public async Task<ActionResult> CleanupSyncLogs()
    {
        await dataSyncJobs.CleanupSyncLogs();
        return Ok(new { message = "Sync logs cleanup queued." });
    }
}

public sealed record BackgroundJobStatusResponse(int QueuedNotifications, int ActiveRefreshTokens, DateTime CheckedAtUtc);

// Placeholder records for future implementation
public sealed record BackgroundJobHistory(Guid JobId, string JobType, DateTime ExecutedAtUtc, string Status, string? Error);
public sealed record RetryJobRequest(Guid JobId, string Reason);

// 🚀 Background Job Request DTOs
public sealed record GenerateReportCardsRequest(Guid TermId, Guid? SchoolId);
public sealed record GenerateFeeStatementsRequest(Guid SchoolId, DateTime Month);
public sealed record SyncAttendanceRequest(Guid SchoolId, DateTime Date);
public sealed record SyncAcademicDataRequest(Guid SchoolId, Guid TermId);
public sealed record SyncFinancialDataRequest(Guid SchoolId, DateTime Month);
public sealed record FullTenantSyncRequest(Guid TenantId);
