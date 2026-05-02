using System.Text;
using System.Threading.RateLimiting;
using Asp.Versioning;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SmartSchool.API.Features;
using SmartSchool.API.Integrations;
using SmartSchool.API.Jobs;
using SmartSchool.API.Middleware;
using SmartSchool.API.Realtime;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Infrastructure.DependencyInjection;
using SmartSchool.Persistence.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
var isTesting = builder.Environment.IsEnvironment("Testing");

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddDataProtection();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new QueryStringApiVersionReader("api-version"),
        new HeaderApiVersionReader("X-API-Version"));
}).AddMvc();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var tenant = httpContext.User.FindFirst(ClaimTypesExt.TenantId)?.Value ?? "anon-tenant";
        var userKey = httpContext.User.Identity?.IsAuthenticated == true
            ? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                ?? httpContext.User.Identity?.Name
                ?? "auth-user"
            : httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon-ip";

        return RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: $"{tenant}:{userKey}",
            factory: _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit = 240,
                Window = TimeSpan.FromMinutes(1),
                SegmentsPerWindow = 6,
                QueueLimit = 0,
                AutoReplenishment = true
            });
    });

    options.AddPolicy("sensitive-write", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 60,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 5,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                AutoReplenishment = true
            }));
});

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddInfrastructure();

// Add Redis Caching
var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "SmartSchool:";
});

if (!isTesting)
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Server=.;Database=SmartSchoolDb;Trusted_Connection=True;TrustServerCertificate=True";

    builder.Services.AddHangfire(config => config
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
        {
            CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
            SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
            QueuePollInterval = TimeSpan.FromSeconds(15),
            UseRecommendedIsolationLevel = true,
            DisableGlobalLocks = true
        }));

    builder.Services.AddHangfireServer(options =>
    {
        options.WorkerCount = Math.Max(1, Environment.ProcessorCount / 2);
    });
}

builder.Services
    .AddIdentityCore<AppUser>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequiredLength = 8;
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<AppRole>()
    .AddSignInManager<SignInManager<AppUser>>()
    .AddEntityFrameworkStores<SmartSchool.Persistence.Data.SmartSchoolDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtOptions.Issuer,
        ValidAudience = jwtOptions.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
        ClockSkew = TimeSpan.FromMinutes(1)
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, SchoolAccessAuthorizationHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(PolicyNames.PlatformManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.PlatformManage)));

    options.AddPolicy(PolicyNames.SchoolsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.SchoolsManage)));

    options.AddPolicy(PolicyNames.AcademicsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.AcademicsManage)));

    options.AddPolicy(PolicyNames.StudentsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.StudentsManage)));

    options.AddPolicy(PolicyNames.FinanceManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.FinanceManage)));

    options.AddPolicy(PolicyNames.ExamsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.ExamsManage)));

    options.AddPolicy(PolicyNames.OperationsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.OperationsManage)));

    options.AddPolicy(PolicyNames.SecurityManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.SecurityManage)));

    options.AddPolicy(PolicyNames.FeatureFlagsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.FeatureFlagsManage)));

    options.AddPolicy(PolicyNames.PortalParentAccess, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.PortalParentAccess)));

    options.AddPolicy(PolicyNames.PortalStudentAccess, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.PortalStudentAccess)));

    options.AddPolicy(PolicyNames.PortalStaffAccess, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.PortalStaffAccess)));

    options.AddPolicy(PolicyNames.SchoolAccess, policy =>
        policy.Requirements.Add(new SchoolAccessRequirement()));
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ITenantFeatureFlagService, TenantFeatureFlagService>();
builder.Services.AddScoped<IIntegrationSecretProtector, IntegrationSecretProtector>();
builder.Services.AddScoped<SecurityBootstrapService>();
builder.Services.AddScoped<SystemMaintenanceJobs>();
builder.Services.AddScoped<NotificationDispatchJobs>();

// Add cross-entity validation
builder.Services.AddScoped<SmartSchool.API.Validation.CrossEntityValidationService>();
builder.Services.AddScoped<SmartSchool.API.Validation.CrossEntityValidationFilter>();

// Add monitoring and alert services
builder.Services.AddScoped<SmartSchool.API.Services.IAlertService, SmartSchool.API.Services.AlertService>();
builder.Services.AddScoped<SmartSchool.API.Services.IEmailService, SmartSchool.API.Services.EmailService>();
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database")
    .AddCheck<MemoryHealthCheck>("memory")
    .AddCheck<CpuHealthCheck>("cpu")
    .AddCheck<DiskHealthCheck>("disk");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.UseMiddleware<AuditLoggingMiddleware>();

// Add health check endpoints
app.MapHealthChecks("/health");

if (!isTesting)
{
    app.UseHangfireDashboard("/hangfire");

    RecurringJob.AddOrUpdate<SystemMaintenanceJobs>(
        "system-prune-refresh-tokens",
        job => job.PruneRefreshTokens(),
        Cron.Daily(1, 0));

    RecurringJob.AddOrUpdate<NotificationDispatchJobs>(
        "notifications-dispatch-queued",
        job => job.DispatchQueuedNotifications(),
        Cron.Minutely);

    // Add monitoring jobs
    builder.Services.AddScoped<SmartSchool.API.Services.MonitoringJobs>();
    
    RecurringJob.AddOrUpdate<SmartSchool.API.Services.MonitoringJobs>(
        "monitoring-check-alerts",
        job => job.CheckAllTenantsAlertsAsync(),
        Cron.MinuteInterval(5));

    RecurringJob.AddOrUpdate<SmartSchool.API.Services.MonitoringJobs>(
        "monitoring-cleanup-alerts",
        job => job.CleanupOldAlertsAsync(),
        Cron.Daily(2, 0)); // 2 AM daily

    RecurringJob.AddOrUpdate<SmartSchool.API.Services.MonitoringJobs>(
        "monitoring-health-report",
        job => job.GenerateSystemHealthReportAsync(),
        Cron.Daily(6, 0)); // 6 AM daily
}

app.MapControllers();
app.MapHub<NotificationsHub>("/hubs/notifications");

app.Run();

public partial class Program;
