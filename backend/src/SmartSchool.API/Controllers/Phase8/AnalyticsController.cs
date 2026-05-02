using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Analytics;

namespace SmartSchool.API.Controllers.Phase8;

[ApiController]
[Route("api/analytics")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger) : ControllerBase
{
    [HttpGet("dashboard/executive")]
    public async Task<ActionResult<ExecutiveDashboard>> GetExecutiveDashboard(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId, 
        [FromQuery] DateTime? from = null, 
        [FromQuery] DateTime? to = null,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting executive dashboard for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            logger.LogWarning("Invalid parameters: tenantId={TenantId}, schoolId={SchoolId}", tenantId, schoolId);
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            logger.LogWarning("User {UserId} denied access to tenant {TenantId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, tenantId);
            return Forbid();
        }

        try
        {
            var dashboard = await analyticsService.GetExecutiveDashboardAsync(tenantId, schoolId, from, to, cancellationToken);
            logger.LogInformation("Successfully retrieved executive dashboard for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving executive dashboard for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("performance/school")]
    public async Task<ActionResult<SchoolPerformanceMetrics>> GetSchoolPerformanceMetrics(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting school performance metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var metrics = await analyticsService.GetSchoolPerformanceMetricsAsync(tenantId, schoolId, cancellationToken);
            logger.LogInformation("Successfully retrieved school performance metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving school performance metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("engagement/student/{studentId}")]
    public async Task<ActionResult<StudentEngagementReport>> GetStudentEngagementReport(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting student engagement report for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var report = await analyticsService.GetStudentEngagementReportAsync(tenantId, schoolId, studentId, from, to, cancellationToken);
            logger.LogInformation("Successfully retrieved student engagement report for student {StudentId}", studentId);
            return Ok(report);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving student engagement report for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("engagement/alerts")]
    public async Task<ActionResult<List<StudentEngagementAlert>>> GetEngagementAlerts(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting engagement alerts for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var alerts = await analyticsService.GetEngagementAlertsAsync(tenantId, schoolId, cancellationToken);
            logger.LogInformation("Retrieved {Count} engagement alerts for tenant {TenantId}, school {SchoolId}", alerts.Count, tenantId, schoolId);
            return Ok(alerts);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving engagement alerts for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("behavioral-patterns/{studentId}")]
    public async Task<ActionResult<StudentBehavioralPattern>> AnalyzeBehavioralPatterns(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Analyzing behavioral patterns for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var patterns = await analyticsService.AnalyzeBehavioralPatternsAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully analyzed behavioral patterns for student {StudentId}", studentId);
            return Ok(patterns);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error analyzing behavioral patterns for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("financial/forecast")]
    public async Task<ActionResult<FinancialForecast>> GetFinancialForecast(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromQuery] int monthsAhead = 12,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting financial forecast for tenant {TenantId}, school {SchoolId}, {MonthsAhead} months ahead", tenantId, schoolId, monthsAhead);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var forecast = await analyticsService.GetFinancialForecastAsync(tenantId, schoolId, monthsAhead, cancellationToken);
            logger.LogInformation("Successfully retrieved financial forecast for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(forecast);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving financial forecast for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("financial/cashflow")]
    public async Task<ActionResult<CashFlowProjection>> GetCashFlowProjection(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting cash flow projection for tenant {TenantId}, school {SchoolId}, from {From} to {To}", tenantId, schoolId, from, to);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var projection = await analyticsService.GetCashFlowProjectionAsync(tenantId, schoolId, from, to, cancellationToken);
            logger.LogInformation("Successfully retrieved cash flow projection for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(projection);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving cash flow projection for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("operational/efficiency")]
    public async Task<ActionResult<OperationalEfficiencyReport>> GetOperationalEfficiencyReport(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting operational efficiency report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var report = await analyticsService.GetOperationalEfficiencyReportAsync(tenantId, schoolId, cancellationToken);
            logger.LogInformation("Successfully retrieved operational efficiency report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(report);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving operational efficiency report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("ai/performance-prediction/{studentId}")]
    public async Task<ActionResult<StudentPerformancePrediction>> PredictStudentPerformance(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Predicting performance for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var prediction = await analyticsService.PredictStudentPerformanceAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully predicted performance for student {StudentId}", studentId);
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error predicting performance for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("ai/at-risk-students")]
    public async Task<ActionResult<List<AtRiskStudent>>> GetAtRiskStudents(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting at-risk students for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var atRiskStudents = await analyticsService.GetAtRiskStudentsAsync(tenantId, schoolId, cancellationToken);
            logger.LogInformation("Retrieved {Count} at-risk students for tenant {TenantId}, school {SchoolId}", atRiskStudents.Count, tenantId, schoolId);
            return Ok(atRiskStudents);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving at-risk students for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }
}
