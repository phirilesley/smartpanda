using SmartSchool.Domain.Modules.AI;

namespace SmartSchool.Domain.Modules.Analytics;

public sealed class StudentEngagementAlert { public Guid StudentId { get; set; } public string AlertType { get; set; } = string.Empty; public string Message { get; set; } = string.Empty; public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow; }
public sealed class CashFlowProjection { public decimal OpeningBalance { get; set; } public decimal ClosingBalance { get; set; } public IReadOnlyList<ForecastFactor> Drivers { get; set; } = []; }
public sealed class BudgetOptimizationReport { public decimal CurrentBudget { get; set; } public decimal OptimizedBudget { get; set; } public IReadOnlyList<FinancialRecommendation> Recommendations { get; set; } = []; }
public sealed class ResourceUtilizationMetrics { public decimal UtilizationRate { get; set; } public string Summary { get; set; } = string.Empty; }
public sealed class CostAnalysisReport { public decimal TotalCost { get; set; } public decimal CostPerStudent { get; set; } public IReadOnlyList<CostEfficiency> CostEfficiencies { get; set; } = []; }
public sealed class EnrollmentProjection { public int CurrentEnrollment { get; set; } public int ProjectedEnrollment { get; set; } public IReadOnlyList<EnrollmentScenario> Scenarios { get; set; } = []; }
public sealed class FinancialOverview { public decimal Revenue { get; set; } public decimal Expenses { get; set; } public decimal NetPosition { get; set; } }
public sealed class OperationalMetrics { public decimal AttendanceRate { get; set; } public decimal PassRate { get; set; } public decimal StaffUtilization { get; set; } }
public sealed class StudentEngagementOverview { public decimal EngagementScore { get; set; } public int ActiveStudents { get; set; } public int AtRiskStudents { get; set; } }
public sealed class AssignmentMetrics { public int TotalAssignments { get; set; } public int SubmittedAssignments { get; set; } public decimal SubmissionRate { get; set; } }
public sealed class CommunicationMetrics { public int MessagesSent { get; set; } public int AnnouncementsSent { get; set; } public decimal ResponseRate { get; set; } }
public sealed class EngagementEvent { public Guid StudentId { get; set; } public string EventType { get; set; } = string.Empty; public DateTime EventAtUtc { get; set; } = DateTime.UtcNow; }
public sealed class ResourceUtilization { public string ResourceName { get; set; } = string.Empty; public decimal UtilizationPercent { get; set; } }
public sealed class ForecastAccuracy { public string MetricName { get; set; } = string.Empty; public decimal AccuracyPercent { get; set; } }
public sealed class FinancialRecommendation { public string Area { get; set; } = string.Empty; public string Recommendation { get; set; } = string.Empty; public decimal EstimatedImpact { get; set; } }
public sealed class ProcessEfficiency { public string ProcessName { get; set; } = string.Empty; public decimal EfficiencyPercent { get; set; } }
public sealed class CostEfficiency { public string Category { get; set; } = string.Empty; public decimal Amount { get; set; } public decimal EfficiencyScore { get; set; } }
public sealed class EfficiencyRecommendation { public string ProcessName { get; set; } = string.Empty; public string Recommendation { get; set; } = string.Empty; public decimal ImprovementPercent { get; set; } }
public sealed class SubjectPrediction { public Guid SubjectId { get; set; } public decimal PredictedAverageMark { get; set; } }
public sealed class Recommendation { public string Category { get; set; } = string.Empty; public string Message { get; set; } = string.Empty; public decimal PriorityScore { get; set; } }
public sealed class AttendancePattern { public Guid StudentId { get; set; } public decimal AttendanceRate { get; set; } public string Trend { get; set; } = string.Empty; }
public sealed class ForecastFactor { public string Name { get; set; } = string.Empty; public decimal Weight { get; set; } public string Notes { get; set; } = string.Empty; }
