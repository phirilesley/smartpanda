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
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Models;
using SmartSchool.Persistence.Data;
using System.Security.Claims;

namespace SmartSchool.API.Controllers.Phase1
{
    [ApiController]
    [Route("api/v1/monitoring")]
    [Authorize]
    public class MonitoringController : ControllerBase
    {
        private readonly SmartSchoolDbContext _context;
        private readonly ILogger<MonitoringController> _logger;

        public MonitoringController(SmartSchoolDbContext context, ILogger<MonitoringController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private Guid GetCurrentTenantId()
        {
            var tenantId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(tenantId, out var id) ? id : Guid.Empty;
        }

        private Guid GetCurrentSchoolId()
        {
            var schoolId = User.FindFirst("SchoolId")?.Value;
            return Guid.TryParse(schoolId, out var id) ? id : Guid.Empty;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<MonitoringDashboardResponse>> GetMonitoringDashboard(CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            var schoolId = GetCurrentSchoolId();

            // System Health Metrics
            var totalUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId, cancellationToken);
            var activeUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId && u.IsActive, cancellationToken);
            var totalSchools = await _context.Schools.CountAsync(s => s.TenantId == tenantId, cancellationToken);
            var activeSchools = await _context.Schools.CountAsync(s => s.TenantId == tenantId && s.IsActive, cancellationToken);

            // Student Metrics
            var totalStudents = await _context.Students.CountAsync(s => s.TenantId == tenantId, cancellationToken);
            var activeStudents = await _context.Students.CountAsync(s => s.TenantId == tenantId && s.Status == "Active", cancellationToken);
            var newStudentsThisMonth = await _context.Students.CountAsync(s => 
                s.TenantId == tenantId && s.CreatedAtUtc >= DateTime.UtcNow.AddDays(-30), cancellationToken);

            // Academic Metrics
            var totalClasses = await _context.Grades.CountAsync(c => c.TenantId == tenantId, cancellationToken);
            var totalSubjects = await _context.Subjects.CountAsync(s => s.TenantId == tenantId, cancellationToken);
            var totalEnrollments = await _context.StudentEnrollments.CountAsync(e => e.TenantId == tenantId, cancellationToken);

            // Financial Metrics
            var totalInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId, cancellationToken);
            var paidInvoices = await _context.StudentInvoices.CountAsync(i =>
                i.TenantId == tenantId && string.Equals(i.Status, "Paid", StringComparison.OrdinalIgnoreCase), cancellationToken);
            var totalRevenue = await _context.Payments.Where(p => p.TenantId == tenantId)
                .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0m;
            var outstandingAmount = await _context.StudentInvoices
                .Where(i => i.TenantId == tenantId && !string.Equals(i.Status, "Paid", StringComparison.OrdinalIgnoreCase))
                .SumAsync(i => (decimal?)i.TotalAmount, cancellationToken) ?? 0m;

            // Staff Metrics
            var totalStaff = await _context.StaffMembers.CountAsync(s => s.TenantId == tenantId, cancellationToken);
            var activeStaff = await _context.StaffMembers.CountAsync(s => s.TenantId == tenantId && s.IsActive, cancellationToken);

            // System Performance Metrics
            var recentLogins = await _context.AuditLogs.CountAsync(s => 
                s.TenantId == tenantId && s.CreatedAtUtc >= DateTime.UtcNow.AddDays(-7) && s.Action == "Auth.LoginSucceeded", cancellationToken);
            var failedLogins = await _context.AuditLogs.CountAsync(s => 
                s.TenantId == tenantId && s.CreatedAtUtc >= DateTime.UtcNow.AddDays(-7) && s.Action == "Auth.LoginFailed", cancellationToken);

            // Database Performance
            var dbConnectionTime = await MeasureDatabaseConnectionTime(cancellationToken);
            var cacheHitRate = await GetCacheHitRate(cancellationToken);

            // Alerts
            var alerts = await GetActiveAlerts(tenantId, cancellationToken);

            return Ok(new MonitoringDashboardResponse
            {
                SystemHealth = new SystemHealthMetrics
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    TotalSchools = totalSchools,
                    ActiveSchools = activeSchools,
                    SystemUptime = GetSystemUptime(),
                    DatabaseConnectionTime = dbConnectionTime,
                    CacheHitRate = cacheHitRate
                },
                StudentMetrics = new StudentMetrics
                {
                    TotalStudents = totalStudents,
                    ActiveStudents = activeStudents,
                    NewStudentsThisMonth = newStudentsThisMonth,
                    EnrollmentRate = totalStudents > 0 ? (double)newStudentsThisMonth / totalStudents * 100 : 0
                },
                AcademicMetrics = new AcademicMetrics
                {
                    TotalClasses = totalClasses,
                    TotalSubjects = totalSubjects,
                    TotalEnrollments = totalEnrollments,
                    AverageClassSize = totalClasses > 0 ? (double)totalEnrollments / totalClasses : 0
                },
                FinancialMetrics = new FinancialMetrics
                {
                    TotalInvoices = totalInvoices,
                    PaidInvoices = paidInvoices,
                    TotalRevenue = totalRevenue,
                    OutstandingAmount = outstandingAmount,
                    PaymentRate = totalInvoices > 0 ? (double)paidInvoices / totalInvoices * 100 : 0
                },
                StaffMetrics = new StaffMetrics
                {
                    TotalStaff = totalStaff,
                    ActiveStaff = activeStaff,
                    StaffStudentRatio = activeStudents > 0 ? (double)activeStaff / activeStudents : 0
                },
                SecurityMetrics = new SecurityMetrics
                {
                    RecentLogins = recentLogins,
                    FailedLogins = failedLogins,
                    LoginSuccessRate = recentLogins + failedLogins > 0 ? (double)recentLogins / (recentLogins + failedLogins) * 100 : 100
                },
                ActiveAlerts = alerts,
                LastUpdated = DateTime.UtcNow
            });
        }

        [HttpGet("alerts")]
        public async Task<ActionResult<List<AlertResponse>>> GetAlerts(CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            var alerts = await GetActiveAlerts(tenantId, cancellationToken);
            return Ok(alerts);
        }

        [HttpGet("performance")]
        public async Task<ActionResult<PerformanceMetricsResponse>> GetPerformanceMetrics(CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            var dbConnectionTime = await MeasureDatabaseConnectionTime(cancellationToken);
            var cacheHitRate = await GetCacheHitRate(cancellationToken);
            var memoryUsage = GetMemoryUsage();
            var cpuUsage = GetCpuUsage();

            return Ok(new PerformanceMetricsResponse
            {
                DatabaseConnectionTime = dbConnectionTime,
                CacheHitRate = cacheHitRate,
                MemoryUsage = memoryUsage,
                CpuUsage = cpuUsage,
                ActiveConnections = GetActiveConnections(),
                RequestQueueLength = GetRequestQueueLength(),
                Timestamp = DateTime.UtcNow
            });
        }

        [HttpPost("alerts/{alertId}/acknowledge")]
        public async Task<ActionResult> AcknowledgeAlert(Guid alertId, CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            // In a real implementation, this would update the alert status in the database
            _logger.LogInformation("Alert {AlertId} acknowledged for tenant {TenantId}", alertId, tenantId);

            return Ok();
        }

        private async Task<List<AlertResponse>> GetActiveAlerts(Guid tenantId, CancellationToken cancellationToken)
        {
            var alerts = new List<AlertResponse>();

            // Check for system alerts
            var totalUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId, cancellationToken);
            var activeUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId && u.IsActive, cancellationToken);

            if (totalUsers > 0 && (double)activeUsers / totalUsers < 0.8)
            {
                alerts.Add(new AlertResponse
                {
                    Id = Guid.NewGuid(),
                    Type = "Warning",
                    Title = "Low User Activity",
                    Message = "Less than 80% of users are active",
                    Severity = "Medium",
                    CreatedAt = DateTime.UtcNow.AddHours(-1),
                    IsAcknowledged = false
                });
            }

            // Check for financial alerts
            var outstandingAmount = await _context.StudentInvoices
                .Where(i => i.TenantId == tenantId && !string.Equals(i.Status, "Paid", StringComparison.OrdinalIgnoreCase))
                .SumAsync(i => (decimal?)i.TotalAmount, cancellationToken) ?? 0m;

            if (outstandingAmount > 100000)
            {
                alerts.Add(new AlertResponse
                {
                    Id = Guid.NewGuid(),
                    Type = "Financial",
                    Title = "High Outstanding Amount",
                    Message = $"Outstanding amount of ${outstandingAmount:N2} exceeds threshold",
                    Severity = "High",
                    CreatedAt = DateTime.UtcNow.AddHours(-2),
                    IsAcknowledged = false
                });
            }

            // Check for database performance alerts
            var dbConnectionTime = await MeasureDatabaseConnectionTime(cancellationToken);
            if (dbConnectionTime > 1000) // ms
            {
                alerts.Add(new AlertResponse
                {
                    Id = Guid.NewGuid(),
                    Type = "Performance",
                    Title = "Slow Database Connection",
                    Message = $"Database connection time is {dbConnectionTime}ms",
                    Severity = "High",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                    IsAcknowledged = false
                });
            }

            return alerts;
        }

        private async Task<double> MeasureDatabaseConnectionTime(CancellationToken cancellationToken)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();
            await _context.Database.CanConnectAsync(cancellationToken);
            stopwatch.Stop();
            return stopwatch.ElapsedMilliseconds;
        }

        private async Task<double> GetCacheHitRate(CancellationToken cancellationToken)
        {
            // In a real implementation, this would measure actual cache hit rate
            // For now, return a mock value
            await Task.Delay(1, cancellationToken);
            return 85.5; // 85.5% hit rate
        }

        private TimeSpan GetSystemUptime()
        {
            return TimeSpan.FromMilliseconds(Environment.TickCount64);
        }

        private double GetMemoryUsage()
        {
            var workingSet = System.Diagnostics.Process.GetCurrentProcess().WorkingSet64;
            return workingSet / 1024.0 / 1024.0; // MB
        }

        private double GetCpuUsage()
        {
            // In a real implementation, this would measure actual CPU usage
            // For now, return a mock value
            return 45.2; // 45.2% CPU usage
        }

        private int GetActiveConnections()
        {
            // In a real implementation, this would count active database connections
            return 25;
        }

        private int GetRequestQueueLength()
        {
            // In a real implementation, this would measure request queue length
            return 3;
        }
    }

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
}
