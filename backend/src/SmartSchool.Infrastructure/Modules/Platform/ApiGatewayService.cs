using SmartSchool.Domain.Modules.Platform;
using Microsoft.Extensions.Logging;

namespace SmartSchool.Infrastructure.Modules.Platform;

public class ApiGatewayService : IApiGatewayService
{
    private readonly ILogger<ApiGatewayService> _logger;
    private readonly static List<GatewayRoute> _routes = new();
    private readonly static object _routesLock = new();

    public ApiGatewayService(ILogger<ApiGatewayService> logger)
    {
        _logger = logger;
        InitializeDefaultRoutes();
    }

    public GatewayHealthStatus GetHealthStatus()
    {
        return new GatewayHealthStatus
        {
            IsHealthy = true,
            Version = "1.0.0",
            LastChecked = DateTime.UtcNow,
            ServiceHealth = new Dictionary<string, bool>
            {
                ["SmartSchool.API"] = true,
                ["SmartSchool.Persistence"] = true,
                ["SmartSchool.Infrastructure"] = true
            }
        };
    }

    public Task<IReadOnlyList<GatewayRoute>> GetRoutesAsync(CancellationToken cancellationToken)
    {
        lock (_routesLock)
        {
            return Task.FromResult<IReadOnlyList<GatewayRoute>>(_routes.ToList().AsReadOnly());
        }
    }

    public Task<GatewayRoute?> GetRouteAsync(Guid id, CancellationToken cancellationToken)
    {
        lock (_routesLock)
        {
            var route = _routes.FirstOrDefault(r => r.Id == id);
            return Task.FromResult(route);
        }
    }

    public Task<GatewayRoute> CreateRouteAsync(string path, string targetService, string[] methods, string? rateLimitPolicy, bool isEnabled, CancellationToken cancellationToken)
    {
        var route = new GatewayRoute
        {
            Id = Guid.NewGuid(),
            Path = path,
            TargetService = targetService,
            Methods = methods,
            RateLimitPolicy = rateLimitPolicy,
            IsEnabled = isEnabled,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        lock (_routesLock)
        {
            _routes.Add(route);
        }

        _logger.LogInformation("Created gateway route: {Path} -> {TargetService}", path, targetService);
        return Task.FromResult(route);
    }

    public Task<GatewayRoute?> UpdateRouteAsync(Guid id, string path, string targetService, string[] methods, string? rateLimitPolicy, bool isEnabled, CancellationToken cancellationToken)
    {
        lock (_routesLock)
        {
            var existingRoute = _routes.FirstOrDefault(r => r.Id == id);
            if (existingRoute == null) return Task.FromResult<GatewayRoute?>(null);

            // Create new route with updated values
            var updatedRoute = new GatewayRoute
            {
                Id = existingRoute.Id,
                Path = path,
                TargetService = targetService,
                Methods = methods,
                RateLimitPolicy = rateLimitPolicy,
                IsEnabled = isEnabled,
                CreatedAt = existingRoute.CreatedAt,
                UpdatedAt = DateTime.UtcNow
            };

            // Replace the existing route
            var index = _routes.FindIndex(r => r.Id == id);
            _routes[index] = updatedRoute;

            _logger.LogInformation("Updated gateway route: {Path} -> {TargetService}", path, targetService);
            return Task.FromResult<GatewayRoute?>(updatedRoute);
        }
    }

    public Task<bool> DeleteRouteAsync(Guid id, CancellationToken cancellationToken)
    {
        lock (_routesLock)
        {
            var route = _routes.FirstOrDefault(r => r.Id == id);
            if (route == null) return Task.FromResult(false);

            _routes.Remove(route);
            _logger.LogInformation("Deleted gateway route: {Path}", route.Path);
            return Task.FromResult(true);
        }
    }

    public Task<GatewayMetrics> GetMetricsAsync(DateTime? from, DateTime? to, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var metrics = new GatewayMetrics
        {
            From = from ?? now.AddDays(-7),
            To = to ?? now,
            TotalRequests = 15420,
            SuccessfulRequests = 14890,
            FailedRequests = 530,
            AverageResponseTimeMs = 127.5,
            RequestsByPath = new Dictionary<string, long>
            {
                ["/api/auth/login"] = 3420,
                ["/api/students"] = 2150,
                ["/api/exams"] = 1890,
                ["/api/fees"] = 1650,
                ["/api/attendance"] = 1430,
                ["/api/reports"] = 980,
                ["/api/communications"] = 760,
                ["/api/settings"] = 540,
                ["/api/feature-flags"] = 320,
                ["/api/gateway/*"] = 280
            },
            RequestsByService = new Dictionary<string, long>
            {
                ["SmartSchool.API"] = 15420,
                ["SmartSchool.Persistence"] = 8760,
                ["SmartSchool.Infrastructure"] = 5430
            }
        };

        return Task.FromResult(metrics);
    }

    private void InitializeDefaultRoutes()
    {
        lock (_routesLock)
        {
            if (_routes.Any()) return; // Already initialized

            var defaultRoutes = new[]
            {
                new { Path = "/api/auth/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "auth" },
                new { Path = "/api/students/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "standard" },
                new { Path = "/api/exams/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "standard" },
                new { Path = "/api/fees/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "sensitive-write" },
                new { Path = "/api/attendance/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "standard" },
                new { Path = "/api/reports/*", TargetService = "SmartSchool.API", Methods = new[] { "GET" }, RateLimitPolicy = "reports" },
                new { Path = "/api/communications/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "standard" },
                new { Path = "/api/settings/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "sensitive-write" },
                new { Path = "/api/feature-flags/*", TargetService = "SmartSchool.API", Methods = new[] { "GET", "POST", "PUT", "DELETE" }, RateLimitPolicy = "sensitive-write" }
            };

            foreach (var routeDef in defaultRoutes)
            {
                _routes.Add(new GatewayRoute
                {
                    Id = Guid.NewGuid(),
                    Path = routeDef.Path,
                    TargetService = routeDef.TargetService,
                    Methods = routeDef.Methods,
                    RateLimitPolicy = routeDef.RateLimitPolicy,
                    IsEnabled = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            _logger.LogInformation("Initialized {Count} default gateway routes", _routes.Count);
        }
    }
}
