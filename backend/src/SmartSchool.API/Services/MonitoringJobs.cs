using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using SmartSchool.API.Models;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Services
{
    public class MonitoringJobs
    {
        private readonly SmartSchoolDbContext _context;
        private readonly IAlertService _alertService;
        private readonly ILogger<MonitoringJobs> _logger;

        public MonitoringJobs(SmartSchoolDbContext context, IAlertService alertService, ILogger<MonitoringJobs> logger)
        {
            _context = context;
            _alertService = alertService;
            _logger = logger;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task CheckAllTenantsAlertsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var tenants = await _context.Tenants
                    .Where(t => t.IsActive)
                    .Select(t => t.Id)
                    .ToListAsync(cancellationToken);

                foreach (var tenantId in tenants)
                {
                    try
                    {
                        await _alertService.CheckAndGenerateAlertsAsync(tenantId, cancellationToken);
                        _logger.LogDebug("Alert check completed for tenant {TenantId}", tenantId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to check alerts for tenant {TenantId}", tenantId);
                    }
                }

                _logger.LogInformation("Alert check completed for {TenantCount} tenants", tenants.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to run monitoring job for all tenants");
                throw;
            }
        }

        [AutomaticRetry(Attempts = 2)]
        public async Task CleanupOldAlertsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                await Task.CompletedTask;
                _logger.LogInformation("Alert cleanup completed (in-memory alert store; no persisted rows to purge).");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to cleanup old alerts");
                throw;
            }
        }

        [AutomaticRetry(Attempts = 2)]
        public async Task GenerateSystemHealthReportAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var tenants = await _context.Tenants
                    .Where(t => t.IsActive)
                    .ToListAsync(cancellationToken);

                foreach (var tenant in tenants)
                {
                    try
                    {
                        var report = await GenerateTenantHealthReportAsync(tenant.Id, cancellationToken);
                        _logger.LogDebug("Health report generated for tenant {TenantId}", tenant.Id);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to generate health report for tenant {TenantId}", tenant.Id);
                    }
                }

                _logger.LogInformation("Health report generation completed for {TenantCount} tenants", tenants.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate system health report");
                throw;
            }
        }

        private async Task<object> GenerateTenantHealthReportAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var totalUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId, cancellationToken);
            var activeUsers = await _context.Users.CountAsync(u => u.TenantId == tenantId && u.IsActive, cancellationToken);
            var totalStudents = await _context.Students.CountAsync(s => s.TenantId == tenantId, cancellationToken);
            var activeStudents = await _context.Students.CountAsync(s => s.TenantId == tenantId && s.Status == "Active", cancellationToken);
            var totalStaff = await _context.StaffMembers.CountAsync(s => s.TenantId == tenantId, cancellationToken);
            var activeStaff = await _context.StaffMembers.CountAsync(s => s.TenantId == tenantId && s.IsActive, cancellationToken);

            var totalInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId, cancellationToken);
            var paidInvoices = await _context.StudentInvoices.CountAsync(i => i.TenantId == tenantId && string.Equals(i.Status, "Paid", StringComparison.OrdinalIgnoreCase), cancellationToken);
            var totalRevenue = await _context.Payments.Where(p => p.TenantId == tenantId)
                .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0m;

            var activeAlerts = (await _alertService.GetActiveAlertsAsync(tenantId, cancellationToken)).Count;

            return new
            {
                TenantId = tenantId,
                GeneratedAt = DateTime.UtcNow,
                UserMetrics = new
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    UserActivityRate = totalUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0
                },
                StudentMetrics = new
                {
                    TotalStudents = totalStudents,
                    ActiveStudents = activeStudents,
                    StudentActivityRate = totalStudents > 0 ? (double)activeStudents / totalStudents * 100 : 0
                },
                StaffMetrics = new
                {
                    TotalStaff = totalStaff,
                    ActiveStaff = activeStaff,
                    StaffActivityRate = totalStaff > 0 ? (double)activeStaff / totalStaff * 100 : 0
                },
                FinancialMetrics = new
                {
                    TotalInvoices = totalInvoices,
                    PaidInvoices = paidInvoices,
                    PaymentRate = totalInvoices > 0 ? (double)paidInvoices / totalInvoices * 100 : 0,
                    TotalRevenue = totalRevenue
                },
                AlertMetrics = new
                {
                    ActiveAlerts = activeAlerts,
                    AlertLevel = activeAlerts switch
                    {
                        0 => "Clear",
                        <= 3 => "Low",
                        <= 10 => "Medium",
                        _ => "High"
                    }
                }
            };
        }
    }
}
