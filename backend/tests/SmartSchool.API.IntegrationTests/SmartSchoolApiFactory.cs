using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.IntegrationTests;

public sealed class SmartSchoolApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<SmartSchoolDbContext>));
            services.RemoveAll(typeof(SmartSchoolDbContext));

            services.AddDbContext<SmartSchoolDbContext>(options =>
                options.UseInMemoryDatabase("SmartSchool.Api.IntegrationTests"));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "Test";
                options.DefaultChallengeScheme = "Test";
            }).AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", _ => { });

        });
    }

    public async Task ResetAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SmartSchoolDbContext>();
        await TestDataSeeder.SeedAsync(db);
    }
}
