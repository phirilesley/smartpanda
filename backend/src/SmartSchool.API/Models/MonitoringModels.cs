using System.ComponentModel.DataAnnotations;

namespace SmartSchool.API.Models
{
    public class MonitoringDashboardResponse
    {
        public SystemHealthMetrics SystemHealth { get; set; }
        public StudentMetrics StudentMetrics { get; set; }
        public AcademicMetrics AcademicMetrics { get; set; }
        public FinancialMetrics FinancialMetrics { get; set; }
        public StaffMetrics StaffMetrics { get; set; }
        public SecurityMetrics SecurityMetrics { get; set; }
        public List<AlertResponse> ActiveAlerts { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class SystemHealthMetrics
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalSchools { get; set; }
        public int ActiveSchools { get; set; }
        public TimeSpan SystemUptime { get; set; }
        public double DatabaseConnectionTime { get; set; }
        public double CacheHitRate { get; set; }
    }

    public class StudentMetrics
    {
        public int TotalStudents { get; set; }
        public int ActiveStudents { get; set; }
        public int NewStudentsThisMonth { get; set; }
        public double EnrollmentRate { get; set; }
    }

    public class AcademicMetrics
    {
        public int TotalClasses { get; set; }
        public int TotalSubjects { get; set; }
        public int TotalEnrollments { get; set; }
        public double AverageClassSize { get; set; }
    }

    public class FinancialMetrics
    {
        public int TotalInvoices { get; set; }
        public int PaidInvoices { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal OutstandingAmount { get; set; }
        public double PaymentRate { get; set; }
    }

    public class StaffMetrics
    {
        public int TotalStaff { get; set; }
        public int ActiveStaff { get; set; }
        public double StaffStudentRatio { get; set; }
    }

    public class SecurityMetrics
    {
        public int RecentLogins { get; set; }
        public int FailedLogins { get; set; }
        public double LoginSuccessRate { get; set; }
    }

    public class AlertResponse
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Severity { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsAcknowledged { get; set; }
    }

    public class PerformanceMetricsResponse
    {
        public double DatabaseConnectionTime { get; set; }
        public double CacheHitRate { get; set; }
        public double MemoryUsage { get; set; }
        public double CpuUsage { get; set; }
        public int ActiveConnections { get; set; }
        public int RequestQueueLength { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class CreateAlertRuleRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string MetricName { get; set; }

        [Required]
        public string Operator { get; set; }

        [Required]
        public double ThresholdValue { get; set; }

        [Required]
        public string Severity { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class UpdateAlertRuleRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string MetricName { get; set; }

        [Required]
        public string Operator { get; set; }

        [Required]
        public double ThresholdValue { get; set; }

        [Required]
        public string Severity { get; set; }

        public bool IsActive { get; set; }
    }

    public class AlertRuleResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string MetricName { get; set; }
        public string Operator { get; set; }
        public double ThresholdValue { get; set; }
        public string Severity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class SystemLogEntry
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Level { get; set; }
        public string Category { get; set; }
        public string Message { get; set; }
        public string Exception { get; set; }
        public DateTime Timestamp { get; set; }
        public string UserId { get; set; }
        public string RequestId { get; set; }
        public string IPAddress { get; set; }
        public string UserAgent { get; set; }
        public Dictionary<string, object> Properties { get; set; }
    }

    public class SystemHealthCheck
    {
        public string Component { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime Timestamp { get; set; }
        public Dictionary<string, object> Data { get; set; }
    }

    public class HealthCheckResponse
    {
        public string Status { get; set; }
        public TimeSpan TotalDuration { get; set; }
        public List<SystemHealthCheck> Checks { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
