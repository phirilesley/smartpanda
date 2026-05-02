namespace SmartSchool.Domain.Modules.AI;

public interface IAIPredictionService
{
    // Student Performance Predictions
    Task<StudentPerformancePrediction> PredictStudentPerformanceAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    Task<List<StudentPerformancePrediction>> PredictClassPerformanceAsync(Guid tenantId, Guid schoolId, Guid classId, CancellationToken cancellationToken = default);
    Task<BatchPerformancePrediction> PredictBatchPerformanceAsync(Guid tenantId, Guid schoolId, List<Guid> studentIds, CancellationToken cancellationToken = default);
    
    // Risk Analysis
    Task<StudentRiskAssessment> AssessStudentRiskAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    Task<List<StudentRiskAssessment>> AssessClassRiskAsync(Guid tenantId, Guid schoolId, Guid classId, CancellationToken cancellationToken = default);
    Task<RiskTrendAnalysis> AnalyzeRiskTrendsAsync(Guid tenantId, Guid schoolId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    
    // Academic Recommendations
    Task<List<AcademicRecommendation>> GetAcademicRecommendationsAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    Task<LearningPathRecommendation> GetLearningPathRecommendationAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    Task<SubjectRecommendation> GetSubjectRecommendationAsync(Guid tenantId, Guid schoolId, Guid studentId, string subjectArea, CancellationToken cancellationToken = default);
    
    // Enrollment Forecasting
    Task<EnrollmentForecast> ForecastEnrollmentAsync(Guid tenantId, Guid schoolId, int yearsAhead = 3, CancellationToken cancellationToken = default);
    Task<GradeEnrollmentForecast> ForecastGradeEnrollmentAsync(Guid tenantId, Guid schoolId, int yearsAhead = 3, CancellationToken cancellationToken = default);
    Task<RetentionForecast> ForecastStudentRetentionAsync(Guid tenantId, Guid schoolId, int yearsAhead = 3, CancellationToken cancellationToken = default);
    
    // Resource Optimization
    Task<TeacherWorkloadForecast> ForecastTeacherWorkloadAsync(Guid tenantId, Guid schoolId, int monthsAhead = 12, CancellationToken cancellationToken = default);
    Task<ClassroomUtilizationForecast> ForecastClassroomUtilizationAsync(Guid tenantId, Guid schoolId, int monthsAhead = 12, CancellationToken cancellationToken = default);
    Task<BudgetOptimizationForecast> ForecastBudgetOptimizationAsync(Guid tenantId, Guid schoolId, int monthsAhead = 12, CancellationToken cancellationToken = default);
    
    // Behavioral Analysis
    Task<StudentBehavioralProfile> AnalyzeStudentBehaviorAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    Task<ClassBehavioralProfile> AnalyzeClassBehaviorAsync(Guid tenantId, Guid schoolId, Guid classId, CancellationToken cancellationToken = default);
    Task<BehavioralInterventionRecommendation> GetBehavioralInterventionRecommendationAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    
    // Early Warning System
    Task<List<EarlyWarningAlert>> GetEarlyWarningAlertsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    Task<EarlyWarningSystemConfig> ConfigureEarlyWarningSystemAsync(Guid tenantId, Guid schoolId, EarlyWarningSystemConfig config, CancellationToken cancellationToken = default);
    Task<EarlyWarningEffectivenessReport> AnalyzeEarlyWarningEffectivenessAsync(Guid tenantId, Guid schoolId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    
    // AI Model Management
    Task<List<AIModelInfo>> GetAvailableModelsAsync(CancellationToken cancellationToken = default);
    Task<AIModelTrainingResult> TrainCustomModelAsync(Guid tenantId, Guid schoolId, AIModelTrainingRequest request, CancellationToken cancellationToken = default);
    Task<AIModelPerformanceReport> GetModelPerformanceReportAsync(Guid tenantId, Guid schoolId, string modelId, CancellationToken cancellationToken = default);
}

// Data Models
public class StudentPerformancePrediction
{
    public Guid StudentId { get; init; }
    public Guid TenantId { get; init; }
    public Guid SchoolId { get; init; }
    public DateTime PredictionDate { get; init; }
    public DateTime AcademicPeriod { get; init; }
    
    // Overall Performance
    public double OverallPerformanceScore { get; init; }
    public double ConfidenceLevel { get; init; }
    public string PerformanceCategory { get; init; } = string.Empty; // "Excellent", "Good", "Average", "Below Average", "Poor"
    
    // Subject-Specific Predictions
    public List<SubjectPerformancePrediction> SubjectPredictions { get; init; } = new();
    
    // Risk Factors
    public List<RiskFactor> IdentifiedRiskFactors { get; init; } = new();
    
    // Recommendations
    public List<PerformanceRecommendation> Recommendations { get; init; } = new();
    
    // Model Information
    public string ModelVersion { get; init; } = string.Empty;
    public DateTime ModelTrainedAt { get; init; }
    public List<string> DataSources { get; init; } = new();
}

public class SubjectPerformancePrediction
{
    public string Subject { get; init; } = string.Empty;
    public double PredictedScore { get; init; }
    public double ConfidenceLevel { get; init; }
    public string GradePrediction { get; init; } = string.Empty;
    public List<string> StrengthFactors { get; init; } = new();
    public List<string> WeaknessFactors { get; init; } = new();
    public List<string> ImprovementSuggestions { get; init; } = new();
}

public class StudentRiskAssessment
{
    public Guid StudentId { get; init; }
    public DateTime AssessmentDate { get; init; }
    public double OverallRiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty; // "Low", "Medium", "High", "Critical"
    
    // Risk Categories
    public AcademicRisk AcademicRisk { get; init; } = new();
    public BehavioralRisk BehavioralRisk { get; init; } = new();
    public AttendanceRisk AttendanceRisk { get; init; } = new();
    public SocialEmotionalRisk SocialEmotionalRisk { get; init; } = new();
    
    // Risk Factors
    public List<RiskFactor> RiskFactors { get; init; } = new();
    
    // Intervention Recommendations
    public List<InterventionRecommendation> RecommendedInterventions { get; init; } = new();
    
    // Monitoring Plan
    public MonitoringPlan MonitoringPlan { get; init; } = new();
    
    // Historical Trends
    public List<RiskTrend> RiskTrends { get; init; } = new();
}

public class AcademicRisk
{
    public double RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public List<string> Indicators { get; init; } = new();
    public List<string> ContributingFactors { get; init; } = new();
}

public class BehavioralRisk
{
    public double RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public List<string> BehavioralPatterns { get; init; } = new();
    public List<string> IncidentTypes { get; init; } = new();
}

public class AttendanceRisk
{
    public double RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public double AttendanceRate { get; init; }
    public List<string> AbsencePatterns { get; init; } = new();
    public List<string> AttendanceFactors { get; init; } = new();
}

public class SocialEmotionalRisk
{
    public double RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public List<string> SocialIndicators { get; init; } = new();
    public List<string> EmotionalIndicators { get; init; } = new();
    public List<string> EngagementIndicators { get; init; } = new();
}

public class AcademicRecommendation
{
    public string RecommendationType { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Priority { get; init; } = string.Empty;
    public List<string> ActionSteps { get; init; } = new();
    public List<string> Resources { get; init; } = new();
    public DateTime RecommendedStartDate { get; init; }
    public DateTime ExpectedCompletionDate { get; init; }
    public double ExpectedImpact { get; init; }
}

public class LearningPathRecommendation
{
    public Guid StudentId { get; init; }
    public DateTime RecommendationDate { get; init; }
    public string LearningStyle { get; init; } = string.Empty;
    public List<LearningPathPhase> Phases { get; init; } = new();
    public List<string> RecommendedSubjects { get; init; } = new();
    public List<string> RecommendedActivities { get; init; } = new();
    public List<string> SupportResources { get; init; } = new();
    public string ExpectedOutcome { get; init; } = string.Empty;
}

public class LearningPathPhase
{
    public string PhaseName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public List<string> LearningObjectives { get; init; } = new();
    public List<string> RecommendedActivities { get; init; } = new();
    public List<string> AssessmentMethods { get; init; } = new();
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public List<string> Prerequisites { get; init; } = new();
}

public class EnrollmentForecast
{
    public Guid SchoolId { get; init; }
    public DateTime ForecastDate { get; init; }
    public int ForecastYears { get; init; }
    public List<YearlyEnrollmentForecast> YearlyForecasts { get; init; } = new();
    public ForecastAccuracy Accuracy { get; init; } = new();
    public List<EnrollmentFactor> KeyFactors { get; init; } = new();
    public List<EnrollmentScenario> Scenarios { get; init; } = new();
}

public class YearlyEnrollmentForecast
{
    public int AcademicYear { get; init; }
    public int ProjectedEnrollment { get; init; }
    public int NewStudents { get; init; }
    public int ReturningStudents { get; init; }
    public int TransfersOut { get; init; }
    public double GrowthRate { get; init; }
    public double ConfidenceLevel { get; init; }
    public List<GradeEnrollmentForecast> GradeForecasts { get; init; } = new();
}

public class GradeEnrollmentForecast
{
    public string Grade { get; init; } = string.Empty;
    public int ProjectedStudents { get; init; }
    public int CurrentStudents { get; init; }
    public double GrowthRate { get; init; }
    public List<EnrollmentFactor> Factors { get; init; } = new();
}

public class EnrollmentFactor
{
    public string FactorName { get; init; } = string.Empty;
    public double Weight { get; init; }
    public double Impact { get; init; }
    public string Description { get; init; } = string.Empty;
    public List<string> DataSources { get; init; } = new();
}

public class ForecastAccuracy
{
    public double HistoricalAccuracy { get; init; }
    public double ModelConfidence { get; init; }
    public double DataQuality { get; init; }
    public List<AccuracyMetric> Metrics { get; init; } = new();
}

public class AccuracyMetric
{
    public string MetricName { get; init; } = string.Empty;
    public double Value { get; init; }
    public string Description { get; init; } = string.Empty;
}

public class TeacherWorkloadForecast
{
    public Guid SchoolId { get; init; }
    public DateTime ForecastDate { get; init; }
    public int ForecastMonths { get; init; }
    public List<MonthlyWorkloadForecast> MonthlyForecasts { get; init; } = new();
    public List<TeacherWorkloadPrediction> TeacherPredictions { get; init; } = new();
    public WorkloadOptimizationRecommendations OptimizationRecommendations { get; init; } = new();
}

public class MonthlyWorkloadForecast
{
    public int Year { get; init; }
    public int Month { get; init; }
    public double AverageWorkloadScore { get; init; }
    public int OverloadedTeachers { get; init; }
    public int UnderutilizedTeachers { get; init; }
    public List<WorkloadFactor> Factors { get; init; } = new();
}

public class TeacherWorkloadPrediction
{
    public Guid TeacherId { get; init; }
    public string TeacherName { get; init; } = string.Empty;
    public List<MonthlyTeacherWorkload> MonthlyWorkloads { get; init; } = new();
    public List<WorkloadRiskFactor> RiskFactors { get; init; } = new();
    public List<WorkloadRecommendation> Recommendations { get; init; } = new();
}

public class StudentBehavioralProfile
{
    public Guid StudentId { get; init; }
    public DateTime ProfileDate { get; init; }
    public List<BehavioralTrait> Traits { get; init; } = new();
    public List<BehavioralPattern> Patterns { get; init; } = new();
    public BehavioralSummary Summary { get; init; } = new();
    public List<BehavioralRecommendation> Recommendations { get; init; } = new();
    public List<BehavioralAlert> Alerts { get; init; } = new();
}

public class BehavioralTrait
{
    public string TraitName { get; init; } = string.Empty;
    public double Score { get; init; }
    public string Description { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public List<string> Indicators { get; init; } = new();
    public double Confidence { get; init; }
}

public class BehavioralPattern
{
    public string PatternName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public double Frequency { get; init; }
    public double Impact { get; init; }
    public List<string> Contexts { get; init; } = new();
    public List<DateTime> Occurrences { get; init; } = new();
}

public class BehavioralSummary
{
    public string OverallBehavior { get; init; } = string.Empty;
    public double PositiveBehaviorScore { get; init; }
    public double NegativeBehaviorScore { get; init; }
    public List<string> Strengths { get; init; } = new();
    public List<string> AreasForImprovement { get; init; } = new();
    public string BehavioralCategory { get; init; } = string.Empty;
}

public class EarlyWarningAlert
{
    public Guid AlertId { get; init; }
    public Guid StudentId { get; init; }
    public string AlertType { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Severity { get; init; } = string.Empty;
    public DateTime AlertDate { get; init; }
    public List<string> Indicators { get; init; } = new();
    public List<string> RecommendedActions { get; init; } = new();
    public string AssignedTo { get; init; } = string.Empty;
    public bool IsResolved { get; init; }
    public DateTime? ResolvedDate { get; init; }
}

public class EarlyWarningSystemConfig
{
    public Guid SchoolId { get; init; }
    public List<WarningRule> Rules { get; init; } = new();
    public List<NotificationSetting> NotificationSettings { get; init; } = new();
    public List<ThresholdConfiguration> Thresholds { get; init; } = new();
    public string ModelVersion { get; init; } = string.Empty;
    public DateTime LastUpdated { get; init; }
}

public class WarningRule
{
    public string RuleId { get; init; } = string.Empty;
    public string RuleName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public List<string> Indicators { get; init; } = new();
    public List<Threshold> Thresholds { get; init; } = new();
    public string Severity { get; init; } = string.Empty;
    public bool IsEnabled { get; init; }
    public List<string> NotificationChannels { get; init; } = new();
}

public class AIModelInfo
{
    public string ModelId { get; init; } = string.Empty;
    public string ModelName { get; init; } = string.Empty;
    public string ModelType { get; init; } = string.Empty;
    public string Version { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime TrainedAt { get; init; }
    public DateTime LastUpdated { get; init; }
    public double Accuracy { get; init; }
    public List<string> SupportedPredictions { get; init; } = new();
    public List<string> RequiredDataFields { get; init; } = new();
    public bool IsActive { get; init; }
}

public class AIModelTrainingRequest
{
    public string ModelName { get; init; } = string.Empty;
    public string ModelType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public List<string> TargetVariables { get; init; } = new();
    public List<string> FeatureVariables { get; init; } = new();
    public DateTime TrainingPeriodStart { get; init; }
    public DateTime TrainingPeriodEnd { get; init; }
    public Dictionary<string, object> TrainingParameters { get; init; } = new();
    public List<string> ValidationDataSources { get; init; } = new();
}

public class AIModelTrainingResult
{
    public string ModelId { get; init; } = string.Empty;
    public string ModelName { get; init; } = string.Empty;
    public DateTime TrainingStartedAt { get; init; }
    public DateTime TrainingCompletedAt { get; init; }
    public bool IsSuccessful { get; init; }
    public double Accuracy { get; init; }
    public double Precision { get; init; }
    public double Recall { get; init; }
    public double F1Score { get; init; }
    public List<string> TrainingErrors { get; init; } = new();
    public List<string> ValidationMetrics { get; init; } = new();
    public string ModelFilePath { get; init; } = string.Empty;
}

// Supporting Models
public class RiskFactor
{
    public string FactorName { get; init; } = string.Empty;
    public double Weight { get; init; }
    public double Impact { get; init; }
    public string Description { get; init; } = string.Empty;
    public List<string> Indicators { get; init; } = new();
    public string Category { get; init; } = string.Empty;
}

public class PerformanceRecommendation
{
    public string RecommendationType { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Priority { get; init; } = string.Empty;
    public List<string> ActionSteps { get; init; } = new();
    public List<string> Resources { get; init; } = new();
    public DateTime RecommendedDate { get; init; }
    public double ExpectedImpact { get; init; }
}

public class InterventionRecommendation
{
    public string InterventionType { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Priority { get; init; } = string.Empty;
    public DateTime RecommendedStartDate { get; init; }
    public DateTime ExpectedCompletionDate { get; init; }
    public List<string> ActionSteps { get; init; } = new();
    public List<string> RequiredResources { get; init; } = new();
    public string ExpectedOutcome { get; init; } = string.Empty;
    public double SuccessProbability { get; init; }
}

public class MonitoringPlan
{
    public List<MonitoringItem> MonitoringItems { get; init; } = new();
    public string Frequency { get; init; } = string.Empty;
    public List<string> ResponsibleParties { get; init; } = new();
    public List<string> SuccessIndicators { get; init; } = new();
    public DateTime ReviewDate { get; init; }
}

public class MonitoringItem
{
    public string ItemName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string MeasurementMethod { get; init; } = string.Empty;
    public string TargetValue { get; init; } = string.Empty;
    public string CurrentValue { get; init; } = string.Empty;
    public DateTime LastMeasured { get; init; }
}

public class RiskTrend
{
    public DateTime Date { get; init; }
    public double RiskScore { get; init; }
    public string RiskLevel { get; init; } = string.Empty;
    public List<string> SignificantEvents { get; init; } = new();
}

// Additional supporting models would be implemented similarly...
