using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    SmartSchoolDbContext dbContext,
    ITokenService tokenService,
    SecurityBootstrapService securityBootstrapService) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthUserResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var tenantExists = await dbContext.Tenants.AsNoTracking().AnyAsync(x => x.Id == request.TenantId, cancellationToken);
        if (!tenantExists)
        {
            return BadRequest("Tenant does not exist.");
        }

        var emailExists = await userManager.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (emailExists)
        {
            return Conflict("A user with this email already exists.");
        }

        await securityBootstrapService.EnsureTenantSecuritySeedAsync(request.TenantId, cancellationToken);

        var roleName = string.IsNullOrWhiteSpace(request.Role) ? RoleCodes.SchoolAdmin : request.Role.Trim();

        var user = new AppUser
        {
            TenantId = request.TenantId,
            UserName = request.UserName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            IsActive = true,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(createResult.Errors.Select(x => x.Description));
        }

        var roleAssignResult = await userManager.AddToRoleAsync(user, roleName);
        if (!roleAssignResult.Succeeded)
        {
            return BadRequest(roleAssignResult.Errors.Select(x => x.Description));
        }

        if (request.SchoolId.HasValue)
        {
            var schoolExists = await dbContext.Schools.AsNoTracking().AnyAsync(x =>
                x.Id == request.SchoolId.Value && x.TenantId == request.TenantId, cancellationToken);

            if (!schoolExists)
            {
                return BadRequest("School does not exist for this tenant.");
            }

            dbContext.UserSchoolAccesses.Add(new UserSchoolAccess
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId.Value,
                UserId = user.Id,
                CanRead = true,
                CanWrite = true,
                CanApprove = true
            });

            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(new AuthUserResponse(user.Id, user.TenantId, user.Email ?? string.Empty, roleName));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthLoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
        if (user is null || !user.IsActive)
        {
            return Unauthorized("Invalid credentials.");
        }

        var passwordResult = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!passwordResult.Succeeded)
        {
            return Unauthorized("Invalid credentials.");
        }

        var roles = await userManager.GetRolesAsync(user);
        var roleIds = await dbContext.Roles
            .Where(x => roles.Contains(x.Name!))
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var rolePermissions = await dbContext.RolePermissions
            .Where(x => x.TenantId == user.TenantId && roleIds.Contains(x.RoleId))
            .Join(dbContext.Permissions, rp => rp.PermissionId, p => p.Id, (rp, p) => p.Code)
            .ToListAsync(cancellationToken);

        var userOverrides = await dbContext.UserPermissions
            .Where(x => x.TenantId == user.TenantId && x.UserId == user.Id)
            .Join(dbContext.Permissions, up => up.PermissionId, p => p.Id, (up, p) => new { p.Code, up.IsAllowed })
            .ToListAsync(cancellationToken);

        var denied = userOverrides.Where(x => !x.IsAllowed).Select(x => x.Code).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var allowedOverrides = userOverrides.Where(x => x.IsAllowed).Select(x => x.Code);

        var effectivePermissions = rolePermissions
            .Concat(allowedOverrides)
            .Where(x => !denied.Contains(x))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var tokens = await tokenService.CreateTokensAsync(user, roles, effectivePermissions);

        var tokenHash = ComputeTokenHash(tokens.RefreshToken);
        dbContext.RefreshTokens.Add(new RefreshToken
        {
            TenantId = user.TenantId,
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc
        });
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AuthLoginResponse(
            user.Id,
            user.TenantId,
            user.Email ?? string.Empty,
            roles.ToArray(),
            effectivePermissions.ToArray(),
            tokens.AccessToken,
            tokens.AccessTokenExpiresAtUtc,
            tokens.RefreshToken,
            tokens.RefreshTokenExpiresAtUtc));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<RefreshResponse>> Refresh([FromBody] RefreshRequest request, CancellationToken cancellationToken)
    {
        var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);
        if (user is null || !user.IsActive)
        {
            return Unauthorized("Invalid refresh request.");
        }

        var tokenHash = ComputeTokenHash(request.RefreshToken);
        var existing = await dbContext.RefreshTokens
            .Where(x => x.TenantId == user.TenantId && x.UserId == user.Id && x.TokenHash == tokenHash)
            .FirstOrDefaultAsync(cancellationToken);

        if (existing is null || existing.RevokedAtUtc.HasValue || existing.ExpiresAtUtc <= DateTime.UtcNow)
        {
            return Unauthorized("Invalid refresh request.");
        }

        existing.RevokedAtUtc = DateTime.UtcNow;

        var roles = await userManager.GetRolesAsync(user);
        var roleIds = await dbContext.Roles
            .Where(x => roles.Contains(x.Name!))
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        var permissions = await dbContext.RolePermissions
            .Where(x => x.TenantId == user.TenantId && roleIds.Contains(x.RoleId))
            .Join(dbContext.Permissions, rp => rp.PermissionId, p => p.Id, (rp, p) => p.Code)
            .Distinct()
            .ToListAsync(cancellationToken);

        var tokens = await tokenService.CreateTokensAsync(user, roles, permissions);
        dbContext.RefreshTokens.Add(new RefreshToken
        {
            TenantId = user.TenantId,
            UserId = user.Id,
            TokenHash = ComputeTokenHash(tokens.RefreshToken),
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc
        });

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new RefreshResponse(
            tokens.AccessToken,
            tokens.AccessTokenExpiresAtUtc,
            tokens.RefreshToken,
            tokens.RefreshTokenExpiresAtUtc));
    }

    private static string ComputeTokenHash(string rawToken)
    {
        var bytes = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes);
    }
}

public sealed record RegisterRequest(
    Guid TenantId,
    Guid? SchoolId,
    string UserName,
    string Email,
    string Password,
    string? PhoneNumber,
    string? Role);

public sealed record LoginRequest(string Email, string Password);
public sealed record RefreshRequest(Guid UserId, string RefreshToken);

public sealed record AuthUserResponse(Guid UserId, Guid TenantId, string Email, string Role);

public sealed record AuthLoginResponse(
    Guid UserId,
    Guid TenantId,
    string Email,
    string[] Roles,
    string[] Permissions,
    string AccessToken,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc);

public sealed record RefreshResponse(
    string AccessToken,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc);
