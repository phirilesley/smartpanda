using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace SmartSchool.API.HealthChecks
{
    public class MemoryHealthCheck : IHealthCheck
    {
        private readonly ILogger<MemoryHealthCheck> _logger;

        public MemoryHealthCheck(ILogger<MemoryHealthCheck> logger)
        {
            _logger = logger;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var process = System.Diagnostics.Process.GetCurrentProcess();
                var memoryUsage = process.WorkingSet64 / 1024 / 1024; // MB
                var totalMemory = GC.GetTotalMemory(false) / 1024 / 1024; // MB
                var availableMemory = GC.GetTotalMemory(true) / 1024 / 1024; // MB
                
                // Get system memory (approximation)
                var systemMemory = Environment.WorkingSet / 1024 / 1024; // MB
                var memoryUsagePercent = systemMemory > 0 ? (double)memoryUsage / systemMemory * 100 : 0;

                var data = new Dictionary<string, object>
                {
                    ["processMemoryMB"] = memoryUsage,
                    ["totalMemoryMB"] = totalMemory,
                    ["availableMemoryMB"] = availableMemory,
                    ["systemMemoryMB"] = systemMemory,
                    ["memoryUsagePercent"] = memoryUsagePercent
                };

                if (memoryUsagePercent > 90)
                {
                    return Task.FromResult(HealthCheckResult.Unhealthy($"Memory usage is critically high: {memoryUsagePercent:F2}%", data));
                }

                if (memoryUsagePercent > 80)
                {
                    return Task.FromResult(HealthCheckResult.Degraded($"Memory usage is high: {memoryUsagePercent:F2}%", data));
                }

                return Task.FromResult(HealthCheckResult.Healthy($"Memory usage is normal: {memoryUsagePercent:F2}%", data));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Memory health check failed");
                return Task.FromResult(HealthCheckResult.Unhealthy("Memory health check failed", ex));
            }
        }
    }
}
