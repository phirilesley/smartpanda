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
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.AI;

namespace SmartSchool.API.Controllers.Phase8;

[ApiController]
[Route("api/ai")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AIController(IAIPredictionService aiService, ILogger<AIController> logger) : ControllerBase
{
    [HttpPost("predictions/student-performance/{studentId}")]
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
            var prediction = await aiService.PredictStudentPerformanceAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully predicted performance for student {StudentId}", studentId);
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error predicting performance for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("predictions/class-performance/{classId}")]
    public async Task<ActionResult<List<StudentPerformancePrediction>>> PredictClassPerformance(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid classId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Predicting class performance for class {ClassId}, tenant {TenantId}, school {SchoolId}", classId, tenantId, schoolId);

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
            var predictions = await aiService.PredictClassPerformanceAsync(tenantId, schoolId, classId, cancellationToken);
            logger.LogInformation("Successfully predicted class performance for class {ClassId}", classId);
            return Ok(predictions);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error predicting class performance for class {ClassId}, tenant {TenantId}, school {SchoolId}", classId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("predictions/batch-performance")]
    public async Task<ActionResult<BatchPerformancePrediction>> PredictBatchPerformance(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromBody] BatchPredictionRequest request,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Predicting batch performance for {Count} students, tenant {TenantId}, school {SchoolId}", request.StudentIds.Count, tenantId, schoolId);

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
            var prediction = await aiService.PredictBatchPerformanceAsync(tenantId, schoolId, request.StudentIds, cancellationToken);
            logger.LogInformation("Successfully predicted batch performance for {Count} students", request.StudentIds.Count);
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error predicting batch performance for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("risk-assessment/student/{studentId}")]
    public async Task<ActionResult<StudentRiskAssessment>> AssessStudentRisk(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Assessing risk for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

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
            var assessment = await aiService.AssessStudentRiskAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully assessed risk for student {StudentId}", studentId);
            return Ok(assessment);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error assessing risk for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("risk-assessment/class/{classId}")]
    public async Task<ActionResult<List<StudentRiskAssessment>>> AssessClassRisk(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid classId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Assessing class risk for class {ClassId}, tenant {TenantId}, school {SchoolId}", classId, tenantId, schoolId);

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
            var assessments = await aiService.AssessClassRiskAsync(tenantId, schoolId, classId, cancellationToken);
            logger.LogInformation("Successfully assessed class risk for class {ClassId}", classId);
            return Ok(assessments);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error assessing class risk for class {ClassId}, tenant {TenantId}, school {SchoolId}", classId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("recommendations/academic/{studentId}")]
    public async Task<ActionResult<List<AcademicRecommendation>>> GetAcademicRecommendations(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting academic recommendations for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

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
            var recommendations = await aiService.GetAcademicRecommendationsAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully retrieved academic recommendations for student {StudentId}", studentId);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting academic recommendations for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("recommendations/learning-path/{studentId}")]
    public async Task<ActionResult<LearningPathRecommendation>> GetLearningPathRecommendation(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting learning path recommendation for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

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
            var recommendation = await aiService.GetLearningPathRecommendationAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully retrieved learning path recommendation for student {StudentId}", studentId);
            return Ok(recommendation);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting learning path recommendation for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("forecasts/enrollment")]
    public async Task<ActionResult<EnrollmentForecast>> ForecastEnrollment(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromQuery] int yearsAhead = 3,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Forecasting enrollment for tenant {TenantId}, school {SchoolId}, {YearsAhead} years ahead", tenantId, schoolId, yearsAhead);

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
            var forecast = await aiService.ForecastEnrollmentAsync(tenantId, schoolId, yearsAhead, cancellationToken);
            logger.LogInformation("Successfully forecasted enrollment for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(forecast);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error forecasting enrollment for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("forecasts/teacher-workload")]
    public async Task<ActionResult<TeacherWorkloadForecast>> ForecastTeacherWorkload(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromQuery] int monthsAhead = 12,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Forecasting teacher workload for tenant {TenantId}, school {SchoolId}, {MonthsAhead} months ahead", tenantId, schoolId, monthsAhead);

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
            var forecast = await aiService.ForecastTeacherWorkloadAsync(tenantId, schoolId, monthsAhead, cancellationToken);
            logger.LogInformation("Successfully forecasted teacher workload for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(forecast);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error forecasting teacher workload for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("behavioral-analysis/student/{studentId}")]
    public async Task<ActionResult<StudentBehavioralProfile>> AnalyzeStudentBehavior(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] Guid studentId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Analyzing student behavior for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

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
            var profile = await aiService.AnalyzeStudentBehaviorAsync(tenantId, schoolId, studentId, cancellationToken);
            logger.LogInformation("Successfully analyzed student behavior for student {StudentId}", studentId);
            return Ok(profile);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error analyzing student behavior for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("early-warning-alerts")]
    public async Task<ActionResult<List<EarlyWarningAlert>>> GetEarlyWarningAlerts(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting early warning alerts for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

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
            var alerts = await aiService.GetEarlyWarningAlertsAsync(tenantId, schoolId, cancellationToken);
            logger.LogInformation("Retrieved {Count} early warning alerts for tenant {TenantId}, school {SchoolId}", alerts.Count, tenantId, schoolId);
            return Ok(alerts);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting early warning alerts for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("early-warning/configure")]
    public async Task<ActionResult<EarlyWarningSystemConfig>> ConfigureEarlyWarningSystem(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromBody] EarlyWarningSystemConfig config,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Configuring early warning system for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

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
            var configured = await aiService.ConfigureEarlyWarningSystemAsync(tenantId, schoolId, config, cancellationToken);
            logger.LogInformation("Successfully configured early warning system for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            return Ok(configured);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error configuring early warning system for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("models")]
    public async Task<ActionResult<List<AIModelInfo>>> GetAvailableModels(
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting available AI models");

        try
        {
            var models = await aiService.GetAvailableModelsAsync(cancellationToken);
            logger.LogInformation("Retrieved {Count} available AI models", models.Count);
            return Ok(models);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting available AI models");
            throw;
        }
    }

    [HttpPost("models/train")]
    public async Task<ActionResult<AIModelTrainingResult>> TrainCustomModel(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromBody] AIModelTrainingRequest request,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Training custom AI model '{ModelName}' for tenant {TenantId}, school {SchoolId}", request.ModelName, tenantId, schoolId);

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
            var result = await aiService.TrainCustomModelAsync(tenantId, schoolId, request, cancellationToken);
            logger.LogInformation("Successfully trained AI model '{ModelName}' with ID {ModelId}", request.ModelName, result.ModelId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error training AI model '{ModelName}' for tenant {TenantId}, school {SchoolId}", request.ModelName, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("models/{modelId}/performance")]
    public async Task<ActionResult<AIModelPerformanceReport>> GetModelPerformanceReport(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromRoute] string modelId,
        CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting performance report for AI model {ModelId}, tenant {TenantId}, school {SchoolId}", modelId, tenantId, schoolId);

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
            var report = await aiService.GetModelPerformanceReportAsync(tenantId, schoolId, modelId, cancellationToken);
            logger.LogInformation("Successfully retrieved performance report for AI model {ModelId}", modelId);
            return Ok(report);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting performance report for AI model {ModelId}, tenant {TenantId}, school {SchoolId}", modelId, tenantId, schoolId);
            throw;
        }
    }
}

// Request Models
public class BatchPredictionRequest
{
    public List<Guid> StudentIds { get; init; } = new();
}

public class BatchPerformancePrediction
{
    public List<StudentPerformancePrediction> Predictions { get; init; } = new();
    public DateTime PredictionDate { get; init; }
    public string ModelVersion { get; init; } = string.Empty;
    public double AverageConfidenceLevel { get; init; }
    public Dictionary<string, double> SummaryStatistics { get; init; } = new();
}
