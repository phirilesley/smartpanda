using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/audit-logs")]
[Authorize(Policy = PolicyNames.SecurityManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AuditLogsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AuditLog>>> GetAuditLogs(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] string? action,
        [FromQuery] Guid? userId,
        [FromQuery] int take = 200,
        CancellationToken cancellationToken = default)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.AuditLogs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);

        if (!string.IsNullOrWhiteSpace(action))
        {
            query = query.Where(x => x.Action == action.Trim());
        }

        if (userId.HasValue && userId.Value != Guid.Empty)
        {
            query = query.Where(x => x.UserId == userId.Value);
        }

        var limit = Math.Clamp(take, 1, 2000);
        var items = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(limit)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("export")]
    public async Task<ActionResult> ExportAuditLogs([FromBody] ExportAuditLogsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var query = dbContext.AuditLogs.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId);

        if (!string.IsNullOrWhiteSpace(request.Action))
        {
            query = query.Where(x => x.Action == request.Action.Trim());
        }

        if (request.UserId.HasValue && request.UserId.Value != Guid.Empty)
        {
            query = query.Where(x => x.UserId == request.UserId.Value);
        }

        if (request.StartDateUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc >= request.StartDateUtc.Value);
        }

        if (request.EndDateUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc <= request.EndDateUtc.Value);
        }

        var logs = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(10000) // Limit export size
            .ToListAsync(cancellationToken);

        // Note: In a real implementation, this would generate CSV/Excel file
        // For now, return count as placeholder
        return Ok(new { exported = logs.Count, format = "csv" });
    }

    [HttpPost("purge")]
    public async Task<ActionResult> PurgeAuditLogs([FromBody] PurgeAuditLogsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var cutoffDate = DateTime.UtcNow.AddDays(-request.RetentionDays);
        var logsToDelete = dbContext.AuditLogs
            .Where(x => x.TenantId == request.TenantId && 
                       x.SchoolId == request.SchoolId && 
                       x.CreatedAtUtc < cutoffDate);

        var deletedCount = await logsToDelete.CountAsync(cancellationToken);
        await logsToDelete.ExecuteDeleteAsync(cancellationToken);

        return Ok(new { deleted = deletedCount, cutoffDate });
    }
}

// Add request records for audit log operations
public sealed record ExportAuditLogsRequest(Guid TenantId, Guid SchoolId, string? Action, Guid? UserId, DateTime? StartDateUtc, DateTime? EndDateUtc);
public sealed record PurgeAuditLogsRequest(Guid TenantId, Guid SchoolId, int RetentionDays);
