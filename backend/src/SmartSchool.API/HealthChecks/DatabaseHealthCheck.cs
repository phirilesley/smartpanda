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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.HealthChecks
{
    public class DatabaseHealthCheck : IHealthCheck
    {
        private readonly SmartSchoolDbContext _context;
        private readonly ILogger<DatabaseHealthCheck> _logger;

        public DatabaseHealthCheck(SmartSchoolDbContext context, ILogger<DatabaseHealthCheck> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var stopwatch = System.Diagnostics.Stopwatch.StartNew();
                
                // Test database connectivity
                var canConnect = await _context.Database.CanConnectAsync(cancellationToken);
                
                if (!canConnect)
                {
                    return HealthCheckResult.Unhealthy("Database connection failed");
                }

                // Test basic query performance
                var queryTime = await MeasureQueryPerformance(cancellationToken);
                
                stopwatch.Stop();
                
                var data = new Dictionary<string, object>
                {
                    ["connectionTime"] = stopwatch.ElapsedMilliseconds,
                    ["queryTime"] = queryTime,
                    ["canConnect"] = true
                };

                if (queryTime > 5000) // 5 seconds
                {
                    return HealthCheckResult.Degraded("Database query performance is slow", data: data);
                }

                return HealthCheckResult.Healthy("Database is healthy", data: data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database health check failed");
                return HealthCheckResult.Unhealthy("Database health check failed", ex);
            }
        }

        private async Task<long> MeasureQueryPerformance(CancellationToken cancellationToken)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();
            
            // Execute a simple query to test performance
            await _context.Users.CountAsync(cancellationToken);
            
            stopwatch.Stop();
            return stopwatch.ElapsedMilliseconds;
        }
    }
}
