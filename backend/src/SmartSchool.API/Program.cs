using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddPersistence(builder.Configuration);

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

    options.AddPolicy(PolicyNames.SecurityManage, policy =>
        policy.Requirements.Add(new PermissionRequirement(PermissionCodes.SecurityManage)));

    options.AddPolicy(PolicyNames.SchoolAccess, policy =>
        policy.Requirements.Add(new SchoolAccessRequirement()));
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<SecurityBootstrapService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
