using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartSchool.API.Data;
using SmartSchool.API.Models;
using System.Text.Json;

namespace SmartSchool.API.Services
{
    public interface IAlertService
    {
        Task<List<Alert>> GetActiveAlertsAsync(Guid tenantId, CancellationToken cancellationToken = default);
        Task<Alert> CreateAlertAsync(Guid tenantId, string type, string title, string message, string severity, CancellationToken cancellationToken = default);
        Task AcknowledgeAlertAsync(Guid alertId, Guid tenantId, CancellationToken cancellationToken = default);
        Task CheckAndGenerateAlertsAsync(Guid tenantId, CancellationToken cancellationToken = default);
        Task<List<AlertRule>> GetAlertRulesAsync(Guid tenantId, CancellationToken cancellationToken = default);
        Task<AlertRule> CreateAlertRuleAsync(Guid tenantId, AlertRule rule, CancellationToken cancellationToken = default);
        Task UpdateAlertRuleAsync(Guid ruleId, Guid tenantId, AlertRule rule, CancellationToken cancellationToken = default);
        Task DeleteAlertRuleAsync(Guid ruleId, Guid tenantId, CancellationToken cancellationToken = default);
    }

    public class AlertService : IAlertService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AlertService> _logger;
        private readonly IEmailService _emailService;

        public AlertService(AppDbContext context, ILogger<AlertService> logger, IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<List<Alert>> GetActiveAlertsAsync(Guid tenantId, CancellationToken cancellationToken = default)
        {
            return await _context.Alerts
                .Where(a => a.TenantId == tenantId && a.IsActive && !a.IsAcknowledged)
                .OrderByDescending(a => a.CreatedAtUtc)
                .ToListAsync(cancellationToken);
        }

        public async Task<Alert> CreateAlertAsync(Guid tenantId, string type, string title, string message, string severity, CancellationToken cancellationToken = default)
        {
            var alert = new Alert
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Type = type,
                Title = title,
                Message = message,
                Severity = severity,
                IsActive = true,
                IsAcknowledged = false,
                CreatedAtUtc = DateTime.UtcNow,
                CreatedBy = "System"
            };

            _context.Alerts.Add(alert);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogWarning("Alert created: {AlertType} - {AlertTitle} for tenant {TenantId}", type, title, tenantId);

            // Send email notification for critical alerts
            if (severity.Equals("Critical", StringComparison.OrdinalIgnoreCase) || severity.Equals("High", StringComparison.OrdinalIgnoreCase))
            {
                await SendAlertNotificationAsync(alert, cancellationToken);
            }

            return alert;
        }

        public async Task AcknowledgeAlertAsync(Guid alertId, Guid tenantId, CancellationToken cancellationToken = default)
        {
            var alert = await _context.Alerts
                .FirstOrDefaultAsync(a => a.Id == alertId && a.TenantId == tenantId, cancellationToken);

            if (alert != null)
            {
                alert.IsAcknowledged = true;
                alert.AcknowledgedAtUtc = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("Alert {AlertId} acknowledged for tenant {TenantId}", alertId, tenantId);
            }
        }

        public async Task CheckAndGenerateAlertsAsync(Guid tenantId, CancellationToken cancellationToken = default)
        {
            var rules = await GetAlertRulesAsync(tenantId, cancellationToken);
            
            foreach (var rule in rules)
            {
                await EvaluateAlertRuleAsync(rule, cancellationToken);
            }

            // Built-in system checks
            await CheckSystemHealthAlertsAsync(tenantId, cancellationToken);
            await CheckFinancialAlertsAsync(tenantId, cancellationToken);
            await CheckSecurityAlertsAsync(tenantId, cancellationToken);
            await CheckPerformanceAlertsAsync(tenantId, cancellationToken);
        }

        private async Task EvaluateAlertRuleAsync(AlertRule rule, CancellationToken cancellationToken)
        {
            try
            {
                var currentValue = await GetMetricValueAsync(rule.MetricName, rule.TenantId, cancellationToken);
                
                if (ShouldTriggerAlert(currentValue, rule))
                {
                    var existingAlert = await _context.Alerts
                        .FirstOrDefaultAsync(a => a.TenantId == rule.TenantId && 
                                               a.Type == rule.MetricName && 
                                               !a.IsAcknowledged, 
                                               cancellationToken);

                    if (existingAlert == null)
                    {
                        await CreateAlertAsync(
                            rule.TenantId,
                            rule.MetricName,
                            $"{rule.MetricName} Threshold Exceeded",
                            $"{rule.MetricName} is {currentValue} which exceeds the threshold of {rule.ThresholdValue}",
                            rule.Severity,
                            cancellationToken
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error evaluating alert rule {RuleId}", rule.Id);
            }
        }

        private async Task CheckSystemHealthAlertsAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            // Check user activity
            var totalUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId, cancellationToken);
            var activeUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId && u.IsActive, cancellationToken);

            if (totalUsers > 0 && (double)activeUsers / totalUsers < 0.8)
            {
                await CreateAlertAsync(
                    tenantId,
                    "System Health",
                    "Low User Activity",
                    $"Only {activeUsers} of {totalUsers} users are active ({(double)activeUsers / totalUsers * 100:F1}%)",
                    "Medium",
                    cancellationToken
                );
            }

            // Check database connection time
            var connectionTime = await MeasureDatabaseConnectionTime(cancellationToken);
            if (connectionTime > 1000) // 1 second
            {
                await CreateAlertAsync(
                    tenantId,
                    "Performance",
                    "Slow Database Connection",
                    $"Database connection time is {connectionTime}ms",
                    "High",
                    cancellationToken
                );
            }
        }

        private async Task CheckFinancialAlertsAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            // Check outstanding payments
            var outstandingAmount = await _context.StudentInvoices
                .Where(i => i.TenantId == tenantId && !i.IsPaid)
                .SumAsync(i => (decimal?)i.TotalAmount, cancellationToken) ?? 0m;

            if (outstandingAmount > 100000) // $100,000 threshold
            {
                await CreateAlertAsync(
                    tenantId,
                    "Financial",
                    "High Outstanding Amount",
                    $"Outstanding amount of ${outstandingAmount:N2} exceeds threshold",
                    "High",
                    cancellationToken
                );
            }

            // Check payment rate
            var totalInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId, cancellationToken);
            var paidInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId && i.IsPaid, cancellationToken);

            if (totalInvoices > 0 && (double)paidInvoices / totalInvoices < 0.85) // 85% threshold
            {
                await CreateAlertAsync(
                    tenantId,
                    "Financial",
                    "Low Payment Rate",
                    $"Payment rate is {(double)paidInvoices / totalInvoices * 100:F1}% which is below threshold",
                    "Medium",
                    cancellationToken
                );
            }
        }

        private async Task CheckSecurityAlertsAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            // Check failed login attempts
            var recentFailedLogins = await _context.UserSessions
                .CountAsync(s => s.TenantId == tenantId && 
                                s.CreatedAtUtc >= DateTime.UtcNow.AddHours(-24) && 
                                s.IsActive == false, cancellationToken);

            if (recentFailedLogins > 50) // 50 failed attempts in 24 hours
            {
                await CreateAlertAsync(
                    tenantId,
                    "Security",
                    "High Failed Login Attempts",
                    $"{recentFailedLogins} failed login attempts in the last 24 hours",
                    "High",
                    cancellationToken
                );
            }

            // Check for unusual activity patterns
            var unusualLogins = await DetectUnusualLoginPatternsAsync(tenantId, cancellationToken);
            if (unusualLogins > 0)
            {
                await CreateAlertAsync(
                    tenantId,
                    "Security",
                    "Unusual Login Activity",
                    $"Detected {unusualLogins} unusual login patterns",
                    "Medium",
                    cancellationToken
                );
            }
        }

        private async Task CheckPerformanceAlertsAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            // Check memory usage
            var memoryUsage = GetMemoryUsage();
            if (memoryUsage > 85) // 85% threshold
            {
                await CreateAlertAsync(
                    tenantId,
                    "Performance",
                    "High Memory Usage",
                    $"Memory usage is {memoryUsage:F1}% which exceeds threshold",
                    "High",
                    cancellationToken
                );
            }

            // Check CPU usage
            var cpuUsage = GetCpuUsage();
            if (cpuUsage > 90) // 90% threshold
            {
                await CreateAlertAsync(
                    tenantId,
                    "Performance",
                    "High CPU Usage",
                    $"CPU usage is {cpuUsage:F1}% which exceeds threshold",
                    "Critical",
                    cancellationToken
                );
            }
        }

        private async Task<double> GetMetricValueAsync(string metricName, Guid tenantId, CancellationToken cancellationToken)
        {
            return metricName.ToLower() switch
            {
                "useractivity" => await GetUserActivityMetric(tenantId, cancellationToken),
                "outstandingpayments" => await GetOutstandingPaymentsMetric(tenantId, cancellationToken),
                "paymentrate" => await GetPaymentRateMetric(tenantId, cancellationToken),
                "failedlogins" => await GetFailedLoginsMetric(tenantId, cancellationToken),
                "memoryusage" => GetMemoryUsage(),
                "cpuusage" => GetCpuUsage(),
                "databasetime" => await MeasureDatabaseConnectionTime(cancellationToken),
                _ => 0
            };
        }

        private async Task<double> GetUserActivityMetric(Guid tenantId, CancellationToken cancellationToken)
        {
            var totalUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId, cancellationToken);
            var activeUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId && u.IsActive, cancellationToken);
            return totalUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0;
        }

        private async Task<double> GetOutstandingPaymentsMetric(Guid tenantId, CancellationToken cancellationToken)
        {
            var outstanding = await _context.StudentInvoices
                .Where(i => i.TenantId == tenantId && !i.IsPaid)
                .SumAsync(i => (decimal?)i.TotalAmount, cancellationToken) ?? 0m;
            return (double)outstanding;
        }

        private async Task<double> GetPaymentRateMetric(Guid tenantId, CancellationToken cancellationToken)
        {
            var totalInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId, cancellationToken);
            var paidInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId && i.IsPaid, cancellationToken);
            return totalInvoices > 0 ? (double)paidInvoices / totalInvoices * 100 : 0;
        }

        private async Task<double> GetFailedLoginsMetric(Guid tenantId, CancellationToken cancellationToken)
        {
            return await _context.UserSessions
                .CountAsync(s => s.TenantId == tenantId && 
                                s.CreatedAtUtc >= DateTime.UtcNow.AddHours(-24) && 
                                s.IsActive == false, cancellationToken);
        }

        private bool ShouldTriggerAlert(double currentValue, AlertRule rule)
        {
            return rule.Operator.ToLower() switch
            {
                "greaterthan" => currentValue > rule.ThresholdValue,
                "lessthan" => currentValue < rule.ThresholdValue,
                "equals" => Math.Abs(currentValue - rule.ThresholdValue) < 0.001,
                "greaterthanorequal" => currentValue >= rule.ThresholdValue,
                "lessthanorequal" => currentValue <= rule.ThresholdValue,
                _ => false
            };
        }

        private async Task<double> MeasureDatabaseConnectionTime(CancellationToken cancellationToken)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();
            await _context.Database.CanConnectAsync(cancellationToken);
            stopwatch.Stop();
            return stopwatch.ElapsedMilliseconds;
        }

        private double GetMemoryUsage()
        {
            var workingSet = System.Diagnostics.Process.GetCurrentProcess().WorkingSet64;
            var totalMemory = GC.GetTotalMemory(false);
            return (double)totalMemory / 1024 / 1024; // MB
        }

        private double GetCpuUsage()
        {
            // In a real implementation, this would measure actual CPU usage
            // For now, return a mock value
            return 45.2; // 45.2% CPU usage
        }

        private async Task<int> DetectUnusualLoginPatternsAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            // In a real implementation, this would analyze login patterns
            // For now, return a mock value
            await Task.Delay(1, cancellationToken);
            return 0;
        }

        private async Task SendAlertNotificationAsync(Alert alert, CancellationToken cancellationToken)
        {
            try
            {
                var subject = $"Smart School Alert: {alert.Title}";
                var body = $@"
                    <h2>{alert.Title}</h2>
                    <p><strong>Type:</strong> {alert.Type}</p>
                    <p><strong>Severity:</strong> {alert.Severity}</p>
                    <p><strong>Message:</strong> {alert.Message}</p>
                    <p><strong>Time:</strong> {alert.CreatedAtUtc:yyyy-MM-dd HH:mm:ss} UTC</p>
                    <p>Please check the monitoring dashboard for more details.</p>
                ";

                // Get admin users for the tenant
                var adminUsers = await _context.Users
                    .Where(u => u.TenantId == alert.TenantId && u.Role == "Admin")
                    .ToListAsync(cancellationToken);

                foreach (var admin in adminUsers)
                {
                    await _emailService.SendEmailAsync(admin.Email, subject, body, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending alert notification for alert {AlertId}", alert.Id);
            }
        }

        public async Task<List<AlertRule>> GetAlertRulesAsync(Guid tenantId, CancellationToken cancellationToken = default)
        {
            return await _context.AlertRules
                .Where(r => r.TenantId == tenantId && r.IsActive)
                .ToListAsync(cancellationToken);
        }

        public async Task<AlertRule> CreateAlertRuleAsync(Guid tenantId, AlertRule rule, CancellationToken cancellationToken = default)
        {
            rule.Id = Guid.NewGuid();
            rule.TenantId = tenantId;
            rule.IsActive = true;
            rule.CreatedAtUtc = DateTime.UtcNow;

            _context.AlertRules.Add(rule);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Alert rule created: {RuleName} for tenant {TenantId}", rule.Name, tenantId);
            return rule;
        }

        public async Task UpdateAlertRuleAsync(Guid ruleId, Guid tenantId, AlertRule rule, CancellationToken cancellationToken = default)
        {
            var existingRule = await _context.AlertRules
                .FirstOrDefaultAsync(r => r.Id == ruleId && r.TenantId == tenantId, cancellationToken);

            if (existingRule != null)
            {
                existingRule.Name = rule.Name;
                existingRule.MetricName = rule.MetricName;
                existingRule.Operator = rule.Operator;
                existingRule.ThresholdValue = rule.ThresholdValue;
                existingRule.Severity = rule.Severity;
                existingRule.IsActive = rule.IsActive;
                existingRule.UpdatedAtUtc = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("Alert rule updated: {RuleId} for tenant {TenantId}", ruleId, tenantId);
            }
        }

        public async Task DeleteAlertRuleAsync(Guid ruleId, Guid tenantId, CancellationToken cancellationToken = default)
        {
            var rule = await _context.AlertRules
                .FirstOrDefaultAsync(r => r.Id == ruleId && r.TenantId == tenantId, cancellationToken);

            if (rule != null)
            {
                rule.IsActive = false;
                rule.UpdatedAtUtc = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("Alert rule deleted: {RuleId} for tenant {TenantId}", ruleId, tenantId);
            }
        }
    }

    public class Alert
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Severity { get; set; }
        public bool IsActive { get; set; }
        public bool IsAcknowledged { get; set; }
        public DateTime? AcknowledgedAtUtc { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public string CreatedBy { get; set; }
    }

    public class AlertRule
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string Name { get; set; }
        public string MetricName { get; set; }
        public string Operator { get; set; }
        public double ThresholdValue { get; set; }
        public string Severity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime? UpdatedAtUtc { get; set; }
    }
}
