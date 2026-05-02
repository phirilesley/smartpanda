namespace SmartSchool.Domain.Modules.Platform;

public interface IApiGatewayService
{
    GatewayHealthStatus GetHealthStatus();
    Task<IReadOnlyList<GatewayRoute>> GetRoutesAsync(CancellationToken cancellationToken);
    Task<GatewayRoute?> GetRouteAsync(Guid id, CancellationToken cancellationToken);
    Task<GatewayRoute> CreateRouteAsync(string path, string targetService, string[] methods, string? rateLimitPolicy, bool isEnabled, CancellationToken cancellationToken);
    Task<GatewayRoute?> UpdateRouteAsync(Guid id, string path, string targetService, string[] methods, string? rateLimitPolicy, bool isEnabled, CancellationToken cancellationToken);
    Task<bool> DeleteRouteAsync(Guid id, CancellationToken cancellationToken);
    Task<GatewayMetrics> GetMetricsAsync(DateTime? from, DateTime? to, CancellationToken cancellationToken);
}

public class GatewayHealthStatus
{
    public bool IsHealthy { get; init; }
    public string Version { get; init; } = string.Empty;
    public DateTime LastChecked { get; init; }
    public Dictionary<string, bool> ServiceHealth { get; init; } = new();
}

public class GatewayRoute
{
    public Guid Id { get; init; }
    public string Path { get; init; } = string.Empty;
    public string TargetService { get; init; } = string.Empty;
    public string[] Methods { get; init; } = Array.Empty<string>();
    public string? RateLimitPolicy { get; init; }
    public bool IsEnabled { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public class GatewayMetrics
{
    public DateTime From { get; init; }
    public DateTime To { get; init; }
    public long TotalRequests { get; init; }
    public long SuccessfulRequests { get; init; }
    public long FailedRequests { get; init; }
    public double AverageResponseTimeMs { get; init; }
    public Dictionary<string, long> RequestsByPath { get; init; } = new();
    public Dictionary<string, long> RequestsByService { get; init; } = new();
}
