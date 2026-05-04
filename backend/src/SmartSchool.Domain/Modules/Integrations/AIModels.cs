using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Integrations;

public class AIInsight : TenantSchoolEntityBase
{
    public string InsightType { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string ActionableSteps { get; set; } = string.Empty;
    public DateTime GeneratedAtUtc { get; set; }
}

public class AIPrediction : TenantSchoolEntityBase
{
    public string PredictionType { get; set; } = string.Empty;
    public string TargetEntity { get; set; } = string.Empty;
    public Guid TargetId { get; set; }
    public string PredictedValue { get; set; } = string.Empty;
    public double Probability { get; set; }
    public DateTime PredictedForDate { get; set; }
}

public class AIChatMessage : TenantEntityBase
{
    public Guid SessionId { get; set; }
    public Guid? UserId { get; set; }
    public string Role { get; set; } = string.Empty; // User, AI, System
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
