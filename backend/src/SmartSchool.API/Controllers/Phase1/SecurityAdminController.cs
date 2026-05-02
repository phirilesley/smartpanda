using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/security-admin")]
[Authorize(Policy = PolicyNames.SecurityManage)]
public class SecurityAdminController(SmartSchoolDbContext dbContext, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager) : ControllerBase
{
    [HttpGet("permissions")]
    public async Task<ActionResult<IReadOnlyList<Permission>>> GetPermissions(CancellationToken cancellationToken)
    {
        var items = await dbContext.Permissions.AsNoTracking().OrderBy(x => x.Code).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("roles")]
    public async Task<ActionResult<IReadOnlyList<AppRole>>> GetRoles([FromQuery] Guid? tenantId, CancellationToken cancellationToken)
    {
        var query = roleManager.Roles.AsNoTracking().AsQueryable();
        if (tenantId.HasValue && tenantId.Value != Guid.Empty)
        {
            query = query.Where(x => x.TenantId == tenantId.Value);
        }

        var roles = await query.OrderBy(x => x.Name).ToListAsync(cancellationToken);
        return Ok(roles);
    }

    [HttpPost("users/{userId:guid}/school-access")]
    public async Task<ActionResult<UserSchoolAccess>> UpsertSchoolAccess(Guid userId, [FromBody] UpsertUserSchoolAccessRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var user = await userManager.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId && x.TenantId == request.TenantId, cancellationToken);
        if (user is null) return BadRequest("User not found for tenant.");

        var school = await dbContext.Schools.AsNoTracking().FirstOrDefaultAsync(x => x.Id == request.SchoolId && x.TenantId == request.TenantId, cancellationToken);
        if (school is null) return BadRequest("School not found for tenant.");

        var existing = await dbContext.UserSchoolAccesses.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.UserId == userId,
            cancellationToken);

        if (existing is null)
        {
            existing = new UserSchoolAccess
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                UserId = userId,
                CanRead = request.CanRead,
                CanWrite = request.CanWrite,
                CanApprove = request.CanApprove
            };

            dbContext.UserSchoolAccesses.Add(existing);
        }
        else
        {
            existing.CanRead = request.CanRead;
            existing.CanWrite = request.CanWrite;
            existing.CanApprove = request.CanApprove;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(existing);
    }

    [HttpPost("users/{userId:guid}/permissions")]
    public async Task<ActionResult<UserPermission>> UpsertUserPermission(Guid userId, [FromBody] UpsertUserPermissionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var user = await userManager.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == userId && x.TenantId == request.TenantId, cancellationToken);
        if (user is null) return BadRequest("User not found for tenant.");

        var permission = await dbContext.Permissions.AsNoTracking().FirstOrDefaultAsync(x => x.Code == request.PermissionCode.Trim(), cancellationToken);
        if (permission is null) return BadRequest("Permission not found.");

        var existing = await dbContext.UserPermissions.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId && x.UserId == userId && x.PermissionId == permission.Id,
            cancellationToken);

        if (existing is null)
        {
            existing = new UserPermission
            {
                TenantId = request.TenantId,
                UserId = userId,
                PermissionId = permission.Id,
                IsAllowed = request.IsAllowed
            };
            dbContext.UserPermissions.Add(existing);
        }
        else
        {
            existing.IsAllowed = request.IsAllowed;
            existing.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(existing);
    }

    [HttpPost("roles/{roleId:guid}/permissions")]
    public async Task<ActionResult<RolePermission>> AssignRolePermission(Guid roleId, [FromBody] AssignRolePermissionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var role = await roleManager.Roles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == roleId && x.TenantId == request.TenantId, cancellationToken);
        if (role is null) return BadRequest("Role not found for tenant.");

        var permission = await dbContext.Permissions.AsNoTracking().FirstOrDefaultAsync(x => x.Code == request.PermissionCode.Trim(), cancellationToken);
        if (permission is null) return BadRequest("Permission not found.");

        var exists = await dbContext.RolePermissions.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.RoleId == roleId && x.PermissionId == permission.Id,
            cancellationToken);

        if (exists) return Conflict("Role permission already exists.");

        var entity = new RolePermission
        {
            TenantId = request.TenantId,
            RoleId = roleId,
            PermissionId = permission.Id
        };

        dbContext.RolePermissions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }
}

public sealed record UpsertUserSchoolAccessRequest(Guid TenantId, Guid SchoolId, bool CanRead, bool CanWrite, bool CanApprove);
public sealed record UpsertUserPermissionRequest(Guid TenantId, string PermissionCode, bool IsAllowed);
public sealed record AssignRolePermissionRequest(Guid TenantId, string PermissionCode);
