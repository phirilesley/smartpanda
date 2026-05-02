using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Reports;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase5;

[ApiController]
[Route("api/reports")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ReportsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardSummaryResponse>> Dashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var students = await dbContext.Students.AsNoTracking().CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        var staff = await dbContext.StaffMembers.AsNoTracking().CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId, cancellationToken);
        var openTickets = await dbContext.HelpDeskTickets.AsNoTracking().CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status != "Closed", cancellationToken);

        var invoices = await dbContext.StudentInvoices.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId).ToListAsync(cancellationToken);
        var payments = await dbContext.Payments.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId).ToListAsync(cancellationToken);

        var billed = invoices.Sum(x => x.TotalAmount);
        var paid = payments.Sum(x => x.Amount);
        var outstanding = billed - paid;

        var attendanceRows = await dbContext.StudentAttendances.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId).ToListAsync(cancellationToken);
        var attendancePct = attendanceRows.Count == 0 ? 0 : Math.Round((decimal)attendanceRows.Count(x => x.IsPresent) / attendanceRows.Count * 100m, 2);

        return Ok(new DashboardSummaryResponse(students, staff, openTickets, billed, paid, outstanding, attendancePct));
    }

    [HttpGet("definitions")]
    public async Task<ActionResult<IReadOnlyList<ReportDefinition>>> GetDefinitions([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.ReportDefinitions.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Module).ThenBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("definitions")]
    public async Task<ActionResult<ReportDefinition>> UpsertDefinition([FromBody] UpsertReportDefinitionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var key = request.QueryKey.Trim();
        var existing = await dbContext.ReportDefinitions.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.QueryKey == key,
            cancellationToken);

        if (existing is null)
        {
            existing = new ReportDefinition
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                Name = request.Name.Trim(),
                Module = request.Module.Trim(),
                QueryKey = key,
                IsActive = request.IsActive
            };
            dbContext.ReportDefinitions.Add(existing);
        }
        else
        {
            existing.Name = request.Name.Trim();
            existing.Module = request.Module.Trim();
            existing.IsActive = request.IsActive;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(existing);
    }

    [HttpPost("runs")]
    public async Task<ActionResult<ReportRun>> Run([FromBody] CreateReportRunRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var defExists = await dbContext.ReportDefinitions.AsNoTracking().AnyAsync(x =>
            x.Id == request.ReportDefinitionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.IsActive,
            cancellationToken);

        if (!defExists) return BadRequest("Active report definition not found.");

        var run = new ReportRun
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ReportDefinitionId = request.ReportDefinitionId,
            RequestedByUserId = request.RequestedByUserId,
            RequestedAtUtc = DateTime.UtcNow,
            CompletedAtUtc = DateTime.UtcNow,
            Status = "Completed",
            OutputFileId = null
        };

        dbContext.ReportRuns.Add(run);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(run);
    }

    [HttpGet("definitions/{id:guid}")]
    public async Task<ActionResult<ReportDefinition>> GetDefinition(Guid id, CancellationToken cancellationToken)
    {
        var definition = await dbContext.ReportDefinitions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (definition is null) return NotFound();

        if (!User.CanAccessTenant(definition.TenantId)) return Forbid();

        return Ok(definition);
    }

    [HttpDelete("definitions/{id:guid}")]
    public async Task<IActionResult> DeleteDefinition(Guid id, CancellationToken cancellationToken)
    {
        var definition = await dbContext.ReportDefinitions.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (definition is null) return NotFound();

        if (!User.CanAccessTenant(definition.TenantId)) return Forbid();

        // Check if definition is used in any report runs
        var hasRuns = await dbContext.ReportRuns.AnyAsync(x => x.ReportDefinitionId == id, cancellationToken);
        if (hasRuns)
        {
            return BadRequest("Cannot delete report definition with existing runs.");
        }

        dbContext.ReportDefinitions.Remove(definition);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("runs/{id:guid}")]
    public async Task<ActionResult<ReportRun>> GetRun(Guid id, CancellationToken cancellationToken)
    {
        var run = await dbContext.ReportRuns.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (run is null) return NotFound();

        if (!User.CanAccessTenant(run.TenantId)) return Forbid();

        return Ok(run);
    }

    [HttpGet("runs/{id:guid}/download")]
    public async Task<ActionResult> DownloadRun(Guid id, CancellationToken cancellationToken)
    {
        var run = await dbContext.ReportRuns.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (run is null) return NotFound();

        if (!User.CanAccessTenant(run.TenantId)) return Forbid();

        // Note: In a real implementation, this would generate and return the actual report file
        // For now, return a placeholder response
        return Ok(new { reportId = id, status = run.Status, downloadUrl = $"/api/reports/runs/{id}/file" });
    }

    [HttpPost("export")]
    public async Task<ActionResult> ExportReports([FromBody] ExportReportsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var query = dbContext.ReportRuns.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId);

        if (request.StartDateUtc.HasValue)
        {
            query = query.Where(x => x.RequestedAtUtc >= request.StartDateUtc.Value);
        }

        if (request.EndDateUtc.HasValue)
        {
            query = query.Where(x => x.RequestedAtUtc <= request.EndDateUtc.Value);
        }

        var runs = await query
            .OrderByDescending(x => x.RequestedAtUtc)
            .Take(1000) // Limit export size
            .ToListAsync(cancellationToken);

        // Note: In a real implementation, this would generate CSV/Excel file
        // For now, return count as placeholder
        return Ok(new { exported = runs.Count, format = "csv" });
    }

    [HttpPost("cache/clear")]
    public async Task<ActionResult> ClearCache([FromBody] ClearCacheRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        // Note: In a real implementation, this would clear report cache
        // For now, return placeholder response
        return Ok(new { cleared = true, cacheType = request.CacheType });
    }
}

public sealed record DashboardSummaryResponse(int Students, int Staff, int OpenTickets, decimal TotalBilled, decimal TotalPaid, decimal TotalOutstanding, decimal StudentAttendancePercentage);
public sealed record UpsertReportDefinitionRequest(Guid TenantId, Guid SchoolId, string Name, string Module, string QueryKey, bool IsActive);
public sealed record CreateReportRunRequest(Guid TenantId, Guid SchoolId, Guid ReportDefinitionId, Guid RequestedByUserId);
public sealed record ExportReportsRequest(Guid TenantId, Guid SchoolId, DateTime? StartDateUtc, DateTime? EndDateUtc);
public sealed record ClearCacheRequest(Guid TenantId, Guid SchoolId, string CacheType);
