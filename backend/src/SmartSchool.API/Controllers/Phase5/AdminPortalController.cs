using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/admin/portal")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AdminPortalController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardResponse>> GetDashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var totalStudents = await dbContext.Students.AsNoTracking().CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        var totalStaff = await dbContext.StaffMembers.AsNoTracking().CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        var totalGrades = await dbContext.Grades.AsNoTracking().CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);

        var recentLogins = await dbContext.AuditLogs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Action == "UserLogin")
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(10)
            .Select(x => new AdminLoginActivity(x.UserId ?? Guid.Empty, x.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        var recentEnrollments = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(10)
            .Select(x => new AdminEnrollmentActivity(x.StudentId, x.GradeId, x.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        var activeNotifications = await dbContext.Notifications.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status == "Queued", cancellationToken);

        var openTickets = await dbContext.HelpDeskTickets.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status != "Closed", cancellationToken);

        return Ok(new AdminDashboardResponse(
            totalStudents,
            totalStaff,
            totalGrades,
            activeNotifications,
            openTickets,
            recentLogins,
            recentEnrollments,
            DateTime.UtcNow));
    }

    [HttpGet("system/health")]
    public async Task<ActionResult<SystemHealthResponse>> GetSystemHealth([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var dbConnected = await dbContext.Database.CanConnectAsync(cancellationToken);
        var queuedJobs = await dbContext.Notifications.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status == "Queued", cancellationToken);

        return Ok(new SystemHealthResponse(dbConnected, 0, queuedJobs, "NotMeasured", DateTime.UtcNow));
    }

    [HttpPost("maintenance/mode")]
    public ActionResult SetMaintenanceMode([FromBody] MaintenanceModeRequest request)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        return Ok(new
        {
            maintenanceMode = request.Enabled,
            message = request.Message,
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("users/active")]
    public async Task<ActionResult<IReadOnlyList<ActiveUserResponse>>> GetActiveUsers(
        [FromQuery] int hours = 24,
        [FromQuery] Guid tenantId = default,
        [FromQuery] Guid schoolId = default,
        CancellationToken cancellationToken = default)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var cutoff = DateTime.UtcNow.AddHours(-hours);
        var activeUsers = await dbContext.AuditLogs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.CreatedAtUtc >= cutoff && x.UserId != null)
            .GroupBy(x => x.UserId)
            .Select(g => new ActiveUserResponse(g.Key!.Value, g.Max(x => x.CreatedAtUtc), g.Count()))
            .OrderByDescending(x => x.LastActivityUtc)
            .Take(50)
            .ToListAsync(cancellationToken);

        return Ok(activeUsers);
    }

    [HttpGet("logs/recent")]
    public async Task<ActionResult<IReadOnlyList<RecentLogEntry>>> GetRecentLogs(
        [FromQuery] int take = 100,
        [FromQuery] Guid tenantId = default,
        [FromQuery] Guid schoolId = default,
        CancellationToken cancellationToken = default)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var logs = await dbContext.AuditLogs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(Math.Clamp(take, 1, 500))
            .Select(x => new RecentLogEntry(
                x.Id,
                x.Action,
                x.UserId ?? Guid.Empty,
                x.CreatedAtUtc,
                x.EntityName,
                x.EntityId,
                x.NewValuesJson))
            .ToListAsync(cancellationToken);

        return Ok(logs);
    }
}

public sealed record AdminDashboardResponse(
    int TotalStudents,
    int TotalStaff,
    int TotalGrades,
    int ActiveNotifications,
    int OpenTickets,
    IReadOnlyList<AdminLoginActivity> RecentLogins,
    IReadOnlyList<AdminEnrollmentActivity> RecentEnrollments,
    DateTime ServerTimeUtc);

public sealed record AdminLoginActivity(Guid UserId, DateTime CreatedAtUtc);
public sealed record AdminEnrollmentActivity(Guid StudentId, Guid GradeId, DateTime CreatedAtUtc);

public sealed record SystemHealthResponse(
    bool DatabaseConnected,
    int ActiveSessions,
    int QueuedJobs,
    string StorageUsed,
    DateTime ServerTimeUtc);

public sealed record ActiveUserResponse(
    Guid UserId,
    DateTime LastActivityUtc,
    int ActivityCount);

public sealed record RecentLogEntry(
    Guid Id,
    string Action,
    Guid UserId,
    DateTime CreatedAtUtc,
    string EntityName,
    string EntityId,
    string Details);

public sealed record MaintenanceModeRequest(Guid TenantId, bool Enabled, string Message);

