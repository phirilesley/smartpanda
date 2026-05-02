using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SmartSchool.API.Features;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Platform;

namespace SmartSchool.API.Controllers.Phase7;

[ApiController]
[Route("api/gateway")]
[Authorize(Policy = PolicyNames.PlatformManage)]
[EnableRateLimiting("sensitive-write")]
public class ApiGatewayController(IApiGatewayService gatewayService) : ControllerBase
{
    [HttpGet("health")]
    public ActionResult<GatewayHealthStatus> GetHealth()
    {
        var status = gatewayService.GetHealthStatus();
        return Ok(status);
    }

    [HttpGet("routes")]
    public async Task<ActionResult<IReadOnlyList<GatewayRoute>>> GetRoutes(CancellationToken cancellationToken)
    {
        var routes = await gatewayService.GetRoutesAsync(cancellationToken);
        return Ok(routes);
    }

    [HttpPost("routes")]
    public async Task<ActionResult<GatewayRoute>> CreateRoute([FromBody] CreateGatewayRouteRequest request, CancellationToken cancellationToken)
    {
        var route = await gatewayService.CreateRouteAsync(
            request.Path,
            request.TargetService,
            request.Methods,
            request.RateLimitPolicy,
            request.IsEnabled,
            cancellationToken);

        return CreatedAtAction(nameof(GetRoute), new { id = route.Id }, route);
    }

    [HttpGet("routes/{id:guid}")]
    public async Task<ActionResult<GatewayRoute>> GetRoute(Guid id, CancellationToken cancellationToken)
    {
        var route = await gatewayService.GetRouteAsync(id, cancellationToken);
        if (route == null) return NotFound();
        return Ok(route);
    }

    [HttpPut("routes/{id:guid}")]
    public async Task<ActionResult<GatewayRoute>> UpdateRoute(Guid id, [FromBody] UpdateGatewayRouteRequest request, CancellationToken cancellationToken)
    {
        var route = await gatewayService.UpdateRouteAsync(
            id,
            request.Path,
            request.TargetService,
            request.Methods,
            request.RateLimitPolicy,
            request.IsEnabled,
            cancellationToken);

        if (route == null) return NotFound();
        return Ok(route);
    }

    [HttpDelete("routes/{id:guid}")]
    public async Task<ActionResult> DeleteRoute(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await gatewayService.DeleteRouteAsync(id, cancellationToken);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpGet("metrics")]
    public async Task<ActionResult<GatewayMetrics>> GetMetrics([FromQuery] DateTime? from, [FromQuery] DateTime? to, CancellationToken cancellationToken)
    {
        var metrics = await gatewayService.GetMetricsAsync(from, to, cancellationToken);
        return Ok(metrics);
    }
}

public sealed record CreateGatewayRouteRequest(
    string Path,
    string TargetService,
    string[] Methods,
    string? RateLimitPolicy,
    bool IsEnabled = true
);

public sealed record UpdateGatewayRouteRequest(
    string Path,
    string TargetService,
    string[] Methods,
    string? RateLimitPolicy,
    bool IsEnabled
);
