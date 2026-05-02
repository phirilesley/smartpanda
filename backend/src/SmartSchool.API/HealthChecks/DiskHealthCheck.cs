using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace SmartSchool.API.HealthChecks
{
    public class DiskHealthCheck : IHealthCheck
    {
        private readonly ILogger<DiskHealthCheck> _logger;

        public DiskHealthCheck(ILogger<DiskHealthCheck> logger)
        {
            _logger = logger;
        }

        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                var currentDirectory = Directory.GetCurrentDirectory();
                var driveInfo = new DriveInfo(Path.GetPathRoot(currentDirectory));
                
                var totalSpace = driveInfo.TotalSize / 1024 / 1024 / 1024; // GB
                var freeSpace = driveInfo.AvailableFreeSpace / 1024 / 1024 / 1024; // GB
                var usedSpace = totalSpace - freeSpace;
                var usagePercent = totalSpace > 0 ? (double)usedSpace / totalSpace * 100 : 0;

                var data = new Dictionary<string, object>
                {
                    ["driveName"] = driveInfo.Name,
                    ["driveType"] = driveInfo.DriveType.ToString(),
                    ["totalSpaceGB"] = totalSpace,
                    ["freeSpaceGB"] = freeSpace,
                    ["usedSpaceGB"] = usedSpace,
                    ["usagePercent"] = usagePercent,
                    ["isReady"] = driveInfo.IsReady
                };

                if (!driveInfo.IsReady)
                {
                    return Task.FromResult(HealthCheckResult.Unhealthy("Drive is not ready", data));
                }

                if (usagePercent > 95)
                {
                    return Task.FromResult(HealthCheckResult.Unhealthy($"Disk usage is critically high: {usagePercent:F2}%", data));
                }

                if (usagePercent > 85)
                {
                    return Task.FromResult(HealthCheckResult.Degraded($"Disk usage is high: {usagePercent:F2}%", data));
                }

                if (freeSpace < 1) // Less than 1 GB free
                {
                    return Task.FromResult(HealthCheckResult.Degraded($"Low disk space: {freeSpace:F2} GB free", data));
                }

                return Task.FromResult(HealthCheckResult.Healthy($"Disk usage is normal: {usagePercent:F2}%", data));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Disk health check failed");
                return Task.FromResult(HealthCheckResult.Unhealthy("Disk health check failed", ex));
            }
        }
    }
}
