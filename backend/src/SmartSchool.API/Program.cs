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
using System.Text;
using System.Text.Json.Serialization;
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
using SmartSchool.API.HealthChecks;
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

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
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

// 🚀 Add Advanced Caching with Redis/Memory Fallback
var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "SmartSchool:";
});

builder.Services.Configure<CacheOptions>(builder.Configuration.GetSection("Cache"));
builder.Services.AddScoped<CacheService>();

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

    options.AddPolicy(PolicyNames.EventsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.EventsManage)));
    options.AddPolicy(PolicyNames.EventsView, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.EventsView)));
    options.AddPolicy(PolicyNames.EventsCoordinate, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.EventsCoordinate)));

    options.AddPolicy(PolicyNames.TransportManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.TransportManage)));
    options.AddPolicy(PolicyNames.TransportView, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.TransportView)));
    options.AddPolicy(PolicyNames.TransportDrive, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.TransportDrive)));
    options.AddPolicy(PolicyNames.TransportAssign, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.TransportAssign)));

    options.AddPolicy(PolicyNames.HostelsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HostelsManage)));
    options.AddPolicy(PolicyNames.HostelsView, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HostelsView)));
    options.AddPolicy(PolicyNames.HostelsMatron, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HostelsMatron)));
    options.AddPolicy(PolicyNames.HostelsStudent, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HostelsStudent)));

    options.AddPolicy(PolicyNames.HealthManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HealthManage)));
    options.AddPolicy(PolicyNames.HealthView, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HealthView)));
    options.AddPolicy(PolicyNames.HealthNurse, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HealthNurse)));
    options.AddPolicy(PolicyNames.HealthStudent, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.HealthStudent)));

    options.AddPolicy(PolicyNames.ClinicManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.ClinicManage)));
    options.AddPolicy(PolicyNames.ClinicView, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.ClinicView)));
    options.AddPolicy(PolicyNames.ClinicDoctor, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.ClinicDoctor)));
    options.AddPolicy(PolicyNames.ClinicPatient, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.ClinicPatient)));

    options.AddPolicy(PolicyNames.SportsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.SportsManage)));
    options.AddPolicy(PolicyNames.AwardsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.AwardsManage)));
    options.AddPolicy(PolicyNames.ClubsManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.ClubsManage)));
    options.AddPolicy(PolicyNames.LeadershipManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.LeadershipManage)));

    options.AddPolicy(PolicyNames.SchoolAccess, policy =>
        policy.Requirements.Add(new SchoolAccessRequirement()));
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ITenantFeatureFlagService, TenantFeatureFlagService>();
builder.Services.AddScoped<IIntegrationSecretProtector, IntegrationSecretProtector>();
builder.Services.AddScoped<SecurityBootstrapService>();
builder.Services.AddScoped<SystemMaintenanceJobs>();
builder.Services.AddScoped<NotificationDispatchJobs>();
builder.Services.AddScoped<SmartSchool.API.Services.MonitoringJobs>();

// Add cross-entity validation
builder.Services.AddScoped<SmartSchool.API.Validation.CrossEntityValidationService>();
builder.Services.AddScoped<SmartSchool.API.Validation.CrossEntityValidationFilter>();

// Add monitoring and alert services
builder.Services.AddScoped<SmartSchool.API.Services.IAlertService, SmartSchool.API.Services.AlertService>();
builder.Services.AddScoped<SmartSchool.API.Services.IEmailService, SmartSchool.API.Services.EmailService>();

// 🚀 Add Background Job Services
builder.Services.AddScoped<SmartSchool.API.Jobs.ReportGenerationJobs>();
builder.Services.AddScoped<SmartSchool.API.Jobs.DataSyncJobs>();

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

    RecurringJob.AddOrUpdate<SmartSchool.API.Services.MonitoringJobs>(
        "monitoring-check-alerts",
        job => job.CheckAllTenantsAlertsAsync(CancellationToken.None),
        Cron.MinuteInterval(5));

    RecurringJob.AddOrUpdate<SmartSchool.API.Services.MonitoringJobs>(
        "monitoring-cleanup-alerts",
        job => job.CleanupOldAlertsAsync(CancellationToken.None),
        Cron.Daily(2, 0)); // 2 AM daily

    // 🚀 Add Report Generation Jobs
    RecurringJob.AddOrUpdate<SmartSchool.API.Jobs.ReportGenerationJobs>(
        "reports-cleanup-old",
        job => job.CleanupOldReports(),
        Cron.Weekly(DayOfWeek.Sunday, 3, 0)); // 3 AM Sunday

    // 🚀 Add Data Sync Jobs
    RecurringJob.AddOrUpdate<SmartSchool.API.Jobs.DataSyncJobs>(
        "sync-cleanup-logs",
        job => job.CleanupSyncLogs(),
        Cron.Daily(1, 0)); // 1 AM daily

    RecurringJob.AddOrUpdate<SmartSchool.API.Services.MonitoringJobs>(
        "monitoring-health-report",
        job => job.GenerateSystemHealthReportAsync(CancellationToken.None),
        Cron.Daily(6, 0)); // 6 AM daily
}

app.MapControllers();
app.MapHub<NotificationsHub>("/hubs/notifications");

app.Run();

public partial class Program;
