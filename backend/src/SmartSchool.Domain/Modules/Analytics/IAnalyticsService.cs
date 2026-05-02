namespace SmartSchool.Domain.Modules.Analytics;

public interface IAnalyticsService
{
    // Executive Dashboards
    Task<ExecutiveDashboard> GetExecutiveDashboardAsync(Guid tenantId, Guid schoolId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default);
    Task<SchoolPerformanceMetrics> GetSchoolPerformanceMetricsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    
    // Student Engagement Tracking
    Task<StudentEngagementReport> GetStudentEngagementReportAsync(Guid tenantId, Guid schoolId, Guid studentId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<List<StudentEngagementAlert>> GetEngagementAlertsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    Task<StudentBehavioralPattern> AnalyzeBehavioralPatternsAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    
    // Financial Forecasting
    Task<FinancialForecast> GetFinancialForecastAsync(Guid tenantId, Guid schoolId, int monthsAhead = 12, CancellationToken cancellationToken = default);
    Task<CashFlowProjection> GetCashFlowProjectionAsync(Guid tenantId, Guid schoolId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    Task<BudgetOptimizationReport> GetBudgetOptimizationReportAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    
    // Operational Efficiency
    Task<OperationalEfficiencyReport> GetOperationalEfficiencyReportAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    Task<ResourceUtilizationMetrics> GetResourceUtilizationMetricsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    Task<CostAnalysisReport> GetCostAnalysisReportAsync(Guid tenantId, Guid schoolId, DateTime from, DateTime to, CancellationToken cancellationToken = default);
    
    // Predictive Analytics
    Task<StudentPerformancePrediction> PredictStudentPerformanceAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default);
    Task<List<AtRiskStudent>> GetAtRiskStudentsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default);
    Task<EnrollmentProjection> GetEnrollmentProjectionAsync(Guid tenantId, Guid schoolId, int yearsAhead = 3, CancellationToken cancellationToken = default);
}

// Data Models
public class ExecutiveDashboard
{
    public Guid TenantId { get; init; }
    public Guid SchoolId { get; init; }
    public DateTime GeneratedAt { get; init; }
    public SchoolPerformanceMetrics Performance { get; init; } = new();
    public FinancialOverview Financials { get; init; } = new();
    public OperationalMetrics Operations { get; init; } = new();
    public StudentEngagementOverview Engagement { get; init; } = new();
    public List<Alert> CriticalAlerts { get; init; } = new();
}

public class SchoolPerformanceMetrics
{
    public double OverallScore { get; init; }
    public double AcademicPerformance { get; init; }
    public double StudentSatisfaction { get; init; }
    public double TeacherPerformance { get; init; }
    public double ParentSatisfaction { get; init; }
    public double OperationalEfficiency { get; init; }
    public double FinancialHealth { get; init; }
    public List<PerformanceTrend> Trends { get; init; } = new();
}

public class StudentEngagementReport
{
    public Guid StudentId { get; init; }
    public DateTime From { get; init; }
    public DateTime To { get; init; }
    public double EngagementScore { get; init; }
    public AttendanceMetrics Attendance { get; init; } = new();
    public ParticipationMetrics Participation { get; init; } = new();
    public AssignmentMetrics Assignments { get; init; } = new();
    public CommunicationMetrics Communication { get; init; } = new();
    public List<EngagementEvent> KeyEvents { get; init; } = new();
}

public class StudentBehavioralPattern
{
    public Guid StudentId { get; init; }
    public List<BehaviorPattern> Patterns { get; init; } = new();
    public List<RecommendedIntervention> Interventions { get; init; } = new();
    public DateTime AnalyzedAt { get; init; }
}

public class FinancialForecast
{
    public Guid SchoolId { get; init; }
    public DateTime ForecastDate { get; init; }
    public List<MonthlyForecast> MonthlyForecasts { get; init; } = new();
    public ForecastAccuracy Accuracy { get; init; } = new();
    public List<FinancialRecommendation> Recommendations { get; init; } = new();
}

public class OperationalEfficiencyReport
{
    public Guid SchoolId { get; init; }
    public DateTime ReportDate { get; init; }
    public double OverallEfficiencyScore { get; init; }
    public ResourceUtilization ResourceUtilization { get; init; } = new();
    public ProcessEfficiency ProcessEfficiency { get; init; } = new();
    public CostEfficiency CostEfficiency { get; init; } = new();
    public List<EfficiencyRecommendation> Recommendations { get; init; } = new();
}

public class StudentPerformancePrediction
{
    public Guid StudentId { get; init; }
    public List<SubjectPrediction> SubjectPredictions { get; init; } = new();
    public double OverallSuccessProbability { get; init; }
    public List<RiskFactor> RiskFactors { get; init; } = new();
    public List<Recommendation> Recommendations { get; init; } = new();
    public DateTime PredictedAt { get; init; }
}

public class AtRiskStudent
{
    public Guid StudentId { get; init; }
    public string StudentName { get; init; } = string.Empty;
    public double RiskScore { get; init; }
    public List<RiskFactor> RiskFactors { get; init; } = new();
    public List<RecommendedIntervention> RecommendedInterventions { get; init; } = new();
    public DateTime IdentifiedAt { get; init; }
}

// Supporting Models
public class PerformanceTrend
{
    public string Metric { get; init; } = string.Empty;
    public double CurrentValue { get; init; }
    public double PreviousValue { get; init; }
    public double ChangePercentage { get; init; }
    public string Trend { get; init; } = string.Empty; // "Up", "Down", "Stable"
}

public class Alert
{
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Severity { get; init; } = string.Empty; // "Low", "Medium", "High", "Critical"
    public DateTime CreatedAt { get; init; }
    public string ActionRequired { get; init; } = string.Empty;
}

public class AttendanceMetrics
{
    public double AttendanceRate { get; init; }
    public int TotalDays { get; init; }
    public int PresentDays { get; init; }
    public int AbsentDays { get; init; }
    public int LateDays { get; init; }
    public List<AttendancePattern> Patterns { get; init; } = new();
}

public class ParticipationMetrics
{
    public double ClassParticipationScore { get; init; }
    public int QuestionsAsked { get; init; }
    public int AssignmentsSubmitted { get; init; }
    public int ExtracurricularActivities { get; init; }
    public double EngagementTrend { get; init; }
}

public class MonthlyForecast
{
    public int Year { get; init; }
    public int Month { get; init; }
    public decimal ProjectedRevenue { get; init; }
    public decimal ProjectedExpenses { get; init; }
    public decimal ProjectedNetIncome { get; init; }
    public decimal ConfidenceLevel { get; init; }
    public List<ForecastFactor> Factors { get; init; } = new();
}

public class BehaviorPattern
{
    public string PatternType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public double Frequency { get; init; }
    public double ImpactScore { get; init; }
    public List<DateTime> Occurrences { get; init; } = new();
}

public class RecommendedIntervention
{
    public string InterventionType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Priority { get; init; } = string.Empty;
    public DateTime RecommendedDate { get; init; }
    public string ExpectedOutcome { get; init; } = string.Empty;
}

public class RiskFactor
{
    public string Factor { get; init; } = string.Empty;
    public double Weight { get; init; }
    public double Impact { get; init; }
    public string Description { get; init; } = string.Empty;
}

// Additional supporting models would be implemented similarly...
