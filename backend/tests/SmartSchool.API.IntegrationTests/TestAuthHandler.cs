using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using SmartSchool.API.Security;

namespace SmartSchool.API.IntegrationTests;

internal sealed class TestAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Test-Auth", out var authHeader) || authHeader != "1")
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var userId = Request.Headers["X-Test-UserId"].FirstOrDefault() ?? TestIds.User1.ToString();
        var tenantId = Request.Headers["X-Test-TenantId"].FirstOrDefault() ?? TestIds.Tenant1.ToString();
        var roles = (Request.Headers["X-Test-Roles"].FirstOrDefault() ?? RoleCodes.TenantOwner)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var permissions = (Request.Headers["X-Test-Permissions"].FirstOrDefault() ?? string.Join(',',
                PermissionCodes.PlatformManage,
                PermissionCodes.SchoolsManage,
                PermissionCodes.AcademicsManage,
                PermissionCodes.StudentsManage,
                PermissionCodes.FinanceManage,
                PermissionCodes.ExamsManage,
                PermissionCodes.OperationsManage,
                PermissionCodes.SecurityManage,
                PermissionCodes.FeatureFlagsManage,
                PermissionCodes.PortalParentAccess,
                PermissionCodes.PortalStudentAccess,
                PermissionCodes.PortalStaffAccess,
                PermissionCodes.EventsManage,
                PermissionCodes.EventsView,
                PermissionCodes.EventsCoordinate,
                PermissionCodes.TransportManage,
                PermissionCodes.TransportView,
                PermissionCodes.TransportDrive,
                PermissionCodes.TransportAssign,
                PermissionCodes.HostelsManage,
                PermissionCodes.HostelsView,
                PermissionCodes.HostelsMatron,
                PermissionCodes.HostelsStudent,
                PermissionCodes.HealthManage,
                PermissionCodes.HealthView,
                PermissionCodes.HealthNurse,
                PermissionCodes.HealthStudent,
                PermissionCodes.ClinicManage,
                PermissionCodes.ClinicView,
                PermissionCodes.ClinicDoctor,
                PermissionCodes.ClinicPatient))
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Name, "integration-test-user"),
            new(ClaimTypesExt.TenantId, tenantId)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        claims.AddRange(permissions.Select(permission => new Claim(ClaimTypesExt.Permission, permission)));

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
