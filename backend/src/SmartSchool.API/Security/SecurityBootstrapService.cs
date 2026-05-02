using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Security;

public class SecurityBootstrapService(RoleManager<AppRole> roleManager, SmartSchoolDbContext dbContext)
{
    public async Task EnsureTenantSecuritySeedAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        var permissions = new[]
        {
            PermissionCodes.PlatformManage,
            PermissionCodes.SchoolsManage,
            PermissionCodes.AcademicsManage,
            PermissionCodes.StudentsManage,
            PermissionCodes.SecurityManage
        };

        foreach (var code in permissions)
        {
            if (!await dbContext.Permissions.AnyAsync(x => x.Code == code, cancellationToken))
            {
                dbContext.Permissions.Add(new Permission { Code = code, Description = code });
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        var roleMap = new Dictionary<string, string[]>
        {
            [RoleCodes.PlatformOwner] = new[] { PermissionCodes.PlatformManage, PermissionCodes.SchoolsManage, PermissionCodes.AcademicsManage, PermissionCodes.StudentsManage, PermissionCodes.SecurityManage },
            [RoleCodes.TenantOwner] = new[] { PermissionCodes.SchoolsManage, PermissionCodes.AcademicsManage, PermissionCodes.StudentsManage },
            [RoleCodes.SchoolAdmin] = new[] { PermissionCodes.AcademicsManage, PermissionCodes.StudentsManage }
        };

        foreach (var (roleName, permissionCodes) in roleMap)
        {
            var role = await roleManager.Roles.FirstOrDefaultAsync(x => x.Name == roleName && x.TenantId == tenantId, cancellationToken);
            if (role is null)
            {
                role = new AppRole
                {
                    Name = roleName,
                    NormalizedName = roleName.ToUpperInvariant(),
                    TenantId = tenantId,
                    Description = roleName
                };

                var createResult = await roleManager.CreateAsync(role);
                if (!createResult.Succeeded)
                {
                    throw new InvalidOperationException($"Failed to create role {roleName}: {string.Join(",", createResult.Errors.Select(x => x.Description))}");
                }
            }

            var permissionIds = await dbContext.Permissions
                .Where(x => permissionCodes.Contains(x.Code))
                .Select(x => x.Id)
                .ToListAsync(cancellationToken);

            foreach (var permissionId in permissionIds)
            {
                var exists = await dbContext.RolePermissions.AnyAsync(x =>
                    x.TenantId == tenantId &&
                    x.RoleId == role.Id &&
                    x.PermissionId == permissionId,
                    cancellationToken);

                if (!exists)
                {
                    dbContext.RolePermissions.Add(new RolePermission
                    {
                        TenantId = tenantId,
                        RoleId = role.Id,
                        PermissionId = permissionId
                    });
                }
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
