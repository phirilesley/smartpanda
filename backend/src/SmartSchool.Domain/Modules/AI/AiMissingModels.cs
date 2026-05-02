namespace SmartSchool.Domain.Modules.AI;

public sealed class BatchPerformancePrediction { public IReadOnlyList<StudentPerformancePrediction> Predictions { get; set; } = []; }
public sealed class RiskTrendAnalysis { public Guid StudentId { get; set; } public string Trend { get; set; } = string.Empty; public decimal RiskScore { get; set; } }
public sealed class SubjectRecommendation { public Guid SubjectId { get; set; } public string SubjectName { get; set; } = string.Empty; public decimal ConfidenceScore { get; set; } }
public sealed class RetentionForecast { public int CurrentStudents { get; set; } public int ForecastRetainedStudents { get; set; } public decimal RetentionRate { get; set; } }
public sealed class ClassroomUtilizationForecast { public Guid RoomId { get; set; } public decimal UtilizationPercent { get; set; } public string ForecastWindow { get; set; } = string.Empty; }
public sealed class BudgetOptimizationForecast { public decimal CurrentSpend { get; set; } public decimal OptimizedSpend { get; set; } public decimal Savings { get; set; } }
public sealed class ClassBehavioralProfile { public Guid ClassId { get; set; } public decimal BehaviorScore { get; set; } public IReadOnlyList<BehavioralAlert> Alerts { get; set; } = []; }
public sealed class BehavioralInterventionRecommendation { public Guid StudentId { get; set; } public string Recommendation { get; set; } = string.Empty; public string Priority { get; set; } = string.Empty; }
public sealed class EarlyWarningEffectivenessReport { public decimal AccuracyPercent { get; set; } public int AlertsRaised { get; set; } public int InterventionsSuccessful { get; set; } }
public sealed class AIModelPerformanceReport { public string ModelName { get; set; } = string.Empty; public decimal AccuracyPercent { get; set; } public DateTime EvaluatedAtUtc { get; set; } = DateTime.UtcNow; }
public sealed class EnrollmentScenario { public string Name { get; set; } = string.Empty; public int ProjectedEnrollment { get; set; } public decimal Confidence { get; set; } }
public sealed class WorkloadFactor { public string Name { get; set; } = string.Empty; public decimal Weight { get; set; } public string Notes { get; set; } = string.Empty; }
public sealed class WorkloadOptimizationRecommendations { public IReadOnlyList<WorkloadRecommendation> Recommendations { get; set; } = []; }
public sealed class BehavioralRecommendation { public string Category { get; set; } = string.Empty; public string Action { get; set; } = string.Empty; public decimal PriorityScore { get; set; } }
public sealed class MonthlyTeacherWorkload { public Guid StaffId { get; set; } public int Month { get; set; } public int Year { get; set; } public decimal WorkloadUnits { get; set; } }
public sealed class BehavioralAlert { public Guid StudentId { get; set; } public string AlertType { get; set; } = string.Empty; public string Message { get; set; } = string.Empty; public DateTime RaisedAtUtc { get; set; } = DateTime.UtcNow; }
public sealed class WorkloadRiskFactor { public Guid StaffId { get; set; } public string Factor { get; set; } = string.Empty; public decimal SeverityScore { get; set; } }
public sealed class WorkloadRecommendation { public Guid StaffId { get; set; } public string Recommendation { get; set; } = string.Empty; public decimal ExpectedImprovement { get; set; } }
public sealed class NotificationSetting { public string Channel { get; set; } = string.Empty; public bool IsEnabled { get; set; } }
public sealed class ThresholdConfiguration { public IReadOnlyList<Threshold> Thresholds { get; set; } = []; }
public sealed class Threshold { public string Name { get; set; } = string.Empty; public decimal Value { get; set; } public string Unit { get; set; } = string.Empty; }
