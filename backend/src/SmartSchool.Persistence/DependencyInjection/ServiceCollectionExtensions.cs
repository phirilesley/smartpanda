using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartSchool.Persistence.Data;

namespace SmartSchool.Persistence.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=.;Database=SmartSchoolDb;Trusted_Connection=True;TrustServerCertificate=True";

        services.AddDbContext<SmartSchoolDbContext>(options => options.UseSqlServer(connectionString));

        return services;
    }
}
