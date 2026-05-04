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
using SmartSchool.API.Services;
using SmartSchool.Persistence.Data;
using System.Security.Claims;

namespace SmartSchool.API.Controllers.Phase1
{
    [ApiController]
    [Route("api/v1/alertrules")]
    [Authorize]
    public class AlertRulesController : ControllerBase
    {
        private readonly SmartSchoolDbContext _context;
        private readonly IAlertService _alertService;
        private readonly ILogger<AlertRulesController> _logger;

        public AlertRulesController(SmartSchoolDbContext context, IAlertService alertService, ILogger<AlertRulesController> logger)
        {
            _context = context;
            _alertService = alertService;
            _logger = logger;
        }

        private Guid GetCurrentTenantId()
        {
            var tenantId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(tenantId, out var id) ? id : Guid.Empty;
        }

        [HttpGet]
        public async Task<ActionResult<List<AlertRuleResponse>>> GetAlertRules(CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            var rules = await _alertService.GetAlertRulesAsync(tenantId, cancellationToken);
            var responses = rules.Select(r => new AlertRuleResponse
            {
                Id = r.Id,
                Name = r.Name,
                MetricName = r.MetricName,
                Operator = r.Operator,
                ThresholdValue = r.ThresholdValue,
                Severity = r.Severity,
                IsActive = r.IsActive,
                CreatedAt = r.CreatedAtUtc,
                UpdatedAt = r.UpdatedAtUtc
            }).ToList();

            return Ok(responses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AlertRuleResponse>> GetAlertRule(Guid id, CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            var rules = await _alertService.GetAlertRulesAsync(tenantId, cancellationToken);
            var rule = rules.FirstOrDefault(r => r.Id == id);

            if (rule == null) return NotFound();

            var response = new AlertRuleResponse
            {
                Id = rule.Id,
                Name = rule.Name,
                MetricName = rule.MetricName,
                Operator = rule.Operator,
                ThresholdValue = rule.ThresholdValue,
                Severity = rule.Severity,
                IsActive = rule.IsActive,
                CreatedAt = rule.CreatedAtUtc,
                UpdatedAt = rule.UpdatedAtUtc
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<AlertRuleResponse>> CreateAlertRule([FromBody] CreateAlertRuleRequest request, CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var rule = new AlertRule
            {
                Name = request.Name,
                MetricName = request.MetricName,
                Operator = request.Operator,
                ThresholdValue = request.ThresholdValue,
                Severity = request.Severity,
                IsActive = request.IsActive
            };

            var createdRule = await _alertService.CreateAlertRuleAsync(tenantId, rule, cancellationToken);

            var response = new AlertRuleResponse
            {
                Id = createdRule.Id,
                Name = createdRule.Name,
                MetricName = createdRule.MetricName,
                Operator = createdRule.Operator,
                ThresholdValue = createdRule.ThresholdValue,
                Severity = createdRule.Severity,
                IsActive = createdRule.IsActive,
                CreatedAt = createdRule.CreatedAtUtc,
                UpdatedAt = createdRule.UpdatedAtUtc
            };

            return CreatedAtAction(nameof(GetAlertRule), new { id = response.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AlertRuleResponse>> UpdateAlertRule(Guid id, [FromBody] UpdateAlertRuleRequest request, CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var rule = new AlertRule
            {
                Name = request.Name,
                MetricName = request.MetricName,
                Operator = request.Operator,
                ThresholdValue = request.ThresholdValue,
                Severity = request.Severity,
                IsActive = request.IsActive
            };

            await _alertService.UpdateAlertRuleAsync(id, tenantId, rule, cancellationToken);

            var updatedRule = await _alertService.GetAlertRulesAsync(tenantId, cancellationToken);
            var response = updatedRule.FirstOrDefault(r => r.Id == id);

            if (response == null) return NotFound();

            return Ok(new AlertRuleResponse
            {
                Id = response.Id,
                Name = response.Name,
                MetricName = response.MetricName,
                Operator = response.Operator,
                ThresholdValue = response.ThresholdValue,
                Severity = response.Severity,
                IsActive = response.IsActive,
                CreatedAt = response.CreatedAtUtc,
                UpdatedAt = response.UpdatedAtUtc
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAlertRule(Guid id, CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            await _alertService.DeleteAlertRuleAsync(id, tenantId, cancellationToken);

            return NoContent();
        }

        [HttpPost("{id}/test")]
        public async Task<ActionResult<AlertRuleTestResult>> TestAlertRule(Guid id, CancellationToken cancellationToken)
        {
            var tenantId = GetCurrentTenantId();
            if (tenantId == Guid.Empty) return BadRequest("Invalid tenant");

            var rules = await _alertService.GetAlertRulesAsync(tenantId, cancellationToken);
            var rule = rules.FirstOrDefault(r => r.Id == id);

            if (rule == null) return NotFound();

            // Test the rule by evaluating current metrics
            var currentValue = await GetMetricValueAsync(rule.MetricName, tenantId, cancellationToken);
            var wouldTrigger = ShouldTriggerAlert(currentValue, rule);

            var result = new AlertRuleTestResult
            {
                RuleId = rule.Id,
                RuleName = rule.Name,
                CurrentValue = currentValue,
                Threshold = rule.ThresholdValue,
                Operator = rule.Operator,
                WouldTrigger = wouldTrigger,
                TestedAt = DateTime.UtcNow
            };

            return Ok(result);
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
                .Where(i => i.TenantId == tenantId && !string.Equals(i.Status, "Paid", StringComparison.OrdinalIgnoreCase))
                .SumAsync(i => (decimal?)i.TotalAmount, cancellationToken) ?? 0m;
            return (double)outstanding;
        }

        private async Task<double> GetPaymentRateMetric(Guid tenantId, CancellationToken cancellationToken)
        {
            var totalInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId, cancellationToken);
            var paidInvoices = await _context.StudentInvoices.CountAsync(i =>
                i.TenantId == tenantId && string.Equals(i.Status, "Paid", StringComparison.OrdinalIgnoreCase), cancellationToken);
            return totalInvoices > 0 ? (double)paidInvoices / totalInvoices * 100 : 0;
        }

        private async Task<double> GetFailedLoginsMetric(Guid tenantId, CancellationToken cancellationToken)
        {
            return await _context.AuditLogs
                .CountAsync(s => s.TenantId == tenantId &&
                                s.CreatedAtUtc >= DateTime.UtcNow.AddHours(-24) &&
                                s.Action == "Auth.LoginFailed", cancellationToken);
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
    }

    public class AlertRuleTestResult
    {
        public Guid RuleId { get; set; }
        public string RuleName { get; set; }
        public double CurrentValue { get; set; }
        public double Threshold { get; set; }
        public string Operator { get; set; }
        public bool WouldTrigger { get; set; }
        public DateTime TestedAt { get; set; }
    }
}
