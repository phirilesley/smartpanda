using Microsoft.Extensions.DependencyInjection;
using SmartSchool.Application.Portals;
using SmartSchool.Infrastructure.Portals;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Infrastructure.Modules.Platform;

namespace SmartSchool.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IPortalDashboardService, PortalDashboardService>();
        services.AddScoped<IApiGatewayService, ApiGatewayService>();
        return services;
    }
}
