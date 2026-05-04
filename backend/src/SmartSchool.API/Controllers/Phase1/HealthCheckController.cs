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
using Microsoft.Extensions.Diagnostics.HealthChecks;
using SmartSchool.API.Models;
using System.Diagnostics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1
{
    [ApiController]
    [Route("api/v1/health")]
    public class HealthCheckController : ControllerBase
    {
        private readonly SmartSchoolDbContext _context;
        private readonly ILogger<HealthCheckController> _logger;
        private readonly HealthCheckService _healthCheckService;

        public HealthCheckController(SmartSchoolDbContext context, ILogger<HealthCheckController> logger, HealthCheckService healthCheckService)
        {
            _context = context;
            _logger = logger;
            _healthCheckService = healthCheckService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<HealthCheckResponse>> GetHealthStatus(CancellationToken cancellationToken)
        {
            var healthReport = await _healthCheckService.CheckHealthAsync(cancellationToken);
            
            var response = new HealthCheckResponse
            {
                Status = healthReport.Status.ToString(),
                TotalDuration = healthReport.TotalDuration,
                Timestamp = DateTime.UtcNow,
                Checks = healthReport.Entries.Select(entry => new SystemHealthCheck
                {
                    Component = entry.Key,
                    Status = entry.Value.Status.ToString(),
                    Description = entry.Value.Description,
                    Duration = entry.Value.Duration,
                    Data = entry.Value.Data.ToDictionary(d => d.Key, d => d.Value),
                    Timestamp = DateTime.UtcNow
                }).ToList()
            };

            return Ok(response);
        }

        [HttpGet("database")]
        [AllowAnonymous]
        public async Task<ActionResult<SystemHealthCheck>> GetDatabaseHealth(CancellationToken cancellationToken)
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                var canConnect = await _context.Database.CanConnectAsync(cancellationToken);
                var connectionTime = stopwatch.ElapsedMilliseconds;
                
                var healthCheck = new SystemHealthCheck
                {
                    Component = "Database",
                    Status = canConnect ? "Healthy" : "Unhealthy",
                    Description = canConnect ? "Database connection successful" : "Database connection failed",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["ConnectionTime"] = connectionTime,
                        ["CanConnect"] = canConnect
                    }
                };

                return Ok(healthCheck);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                
                var healthCheck = new SystemHealthCheck
                {
                    Component = "Database",
                    Status = "Unhealthy",
                    Description = "Database connection failed with exception",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["Exception"] = ex.Message,
                        ["ConnectionTime"] = stopwatch.ElapsedMilliseconds
                    }
                };

                return StatusCode(503, healthCheck);
            }
        }

        [HttpGet("memory")]
        [AllowAnonymous]
        public ActionResult<SystemHealthCheck> GetMemoryHealth()
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                var process = Process.GetCurrentProcess();
                var memoryUsage = process.WorkingSet64 / 1024 / 1024; // MB
                var memoryUsagePercent = (double)memoryUsage / (Environment.WorkingSet / 1024 / 1024) * 100;
                
                var status = memoryUsagePercent switch
                {
                    < 80 => "Healthy",
                    < 90 => "Degraded",
                    _ => "Unhealthy"
                };

                var healthCheck = new SystemHealthCheck
                {
                    Component = "Memory",
                    Status = status,
                    Description = $"Memory usage is {memoryUsagePercent:F2}%",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["MemoryUsageMB"] = memoryUsage,
                        ["MemoryUsagePercent"] = memoryUsagePercent,
                        ["WorkingSetMB"] = Environment.WorkingSet / 1024 / 1024
                    }
                };

                return Ok(healthCheck);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                
                var healthCheck = new SystemHealthCheck
                {
                    Component = "Memory",
                    Status = "Unhealthy",
                    Description = "Failed to get memory information",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["Exception"] = ex.Message
                    }
                };

                return StatusCode(503, healthCheck);
            }
        }

        [HttpGet("cpu")]
        [AllowAnonymous]
        public ActionResult<SystemHealthCheck> GetCpuHealth()
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                var cpuUsage = GetCpuUsage();
                
                var status = cpuUsage switch
                {
                    < 70 => "Healthy",
                    < 85 => "Degraded",
                    _ => "Unhealthy"
                };

                var healthCheck = new SystemHealthCheck
                {
                    Component = "CPU",
                    Status = status,
                    Description = $"CPU usage is {cpuUsage:F2}%",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["CpuUsagePercent"] = cpuUsage
                    }
                };

                return Ok(healthCheck);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                
                var healthCheck = new SystemHealthCheck
                {
                    Component = "CPU",
                    Status = "Unhealthy",
                    Description = "Failed to get CPU information",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["Exception"] = ex.Message
                    }
                };

                return StatusCode(503, healthCheck);
            }
        }

        [HttpGet("disk")]
        [AllowAnonymous]
        public ActionResult<SystemHealthCheck> GetDiskHealth()
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                var drive = new DriveInfo(Path.GetPathRoot(Directory.GetCurrentDirectory()));
                var totalSpace = drive.TotalSize / 1024 / 1024 / 1024; // GB
                var freeSpace = drive.AvailableFreeSpace / 1024 / 1024 / 1024; // GB
                var usedSpace = totalSpace - freeSpace;
                var usagePercent = (double)usedSpace / totalSpace * 100;
                
                var status = usagePercent switch
                {
                    < 80 => "Healthy",
                    < 90 => "Degraded",
                    _ => "Unhealthy"
                };

                var healthCheck = new SystemHealthCheck
                {
                    Component = "Disk",
                    Status = status,
                    Description = $"Disk usage is {usagePercent:F2}%",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["TotalSpaceGB"] = totalSpace,
                        ["FreeSpaceGB"] = freeSpace,
                        ["UsedSpaceGB"] = usedSpace,
                        ["UsagePercent"] = usagePercent,
                        ["DriveName"] = drive.Name
                    }
                };

                return Ok(healthCheck);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                
                var healthCheck = new SystemHealthCheck
                {
                    Component = "Disk",
                    Status = "Unhealthy",
                    Description = "Failed to get disk information",
                    Duration = stopwatch.Elapsed,
                    Timestamp = DateTime.UtcNow,
                    Data = new Dictionary<string, object>
                    {
                        ["Exception"] = ex.Message
                    }
                };

                return StatusCode(503, healthCheck);
            }
        }

        [HttpGet("ready")]
        [AllowAnonymous]
        public async Task<ActionResult> GetReadiness(CancellationToken cancellationToken)
        {
            try
            {
                // Check database connectivity
                var canConnect = await _context.Database.CanConnectAsync(cancellationToken);
                
                if (!canConnect)
                {
                    return StatusCode(503, new { Status = "Not Ready", Reason = "Database not available" });
                }

                // Check other critical services here
                // For example: Redis, external APIs, etc.

                return Ok(new { Status = "Ready", Timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Readiness check failed");
                return StatusCode(503, new { Status = "Not Ready", Reason = ex.Message });
            }
        }

        [HttpGet("live")]
        [AllowAnonymous]
        public ActionResult GetLiveness()
        {
            try
            {
                // Basic liveness check - if the application is running, it's alive
                return Ok(new { Status = "Alive", Timestamp = DateTime.UtcNow });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Liveness check failed");
                return StatusCode(503, new { Status = "Not Alive", Reason = ex.Message });
            }
        }

        private double GetCpuUsage()
        {
            // In a real implementation, this would measure actual CPU usage
            // For now, return a mock value
            return 45.2; // 45.2% CPU usage
        }
    }
}
