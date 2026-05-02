using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Security;

public class SecurityBootstrapService(RoleManager<AppRole> roleManager, SmartSchoolDbContext dbContext, ILogger<SecurityBootstrapService> logger)
{
    public async Task EnsureTenantSecuritySeedAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        logger.LogInformation("Ensuring security seed for tenant {TenantId}", tenantId);

        try
        {
            var permissions = new[]
        {
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
            PermissionCodes.PortalStaffAccess
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
            [RoleCodes.PlatformOwner] =
            [
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
                PermissionCodes.PortalStaffAccess
            ],
            [RoleCodes.TenantOwner] =
            [
                PermissionCodes.SchoolsManage,
                PermissionCodes.AcademicsManage,
                PermissionCodes.StudentsManage,
                PermissionCodes.FinanceManage,
                PermissionCodes.ExamsManage,
                PermissionCodes.OperationsManage,
                PermissionCodes.FeatureFlagsManage,
                PermissionCodes.PortalParentAccess,
                PermissionCodes.PortalStudentAccess,
                PermissionCodes.PortalStaffAccess
            ],
            [RoleCodes.SchoolAdmin] =
            [
                PermissionCodes.AcademicsManage,
                PermissionCodes.StudentsManage,
                PermissionCodes.FinanceManage,
                PermissionCodes.ExamsManage,
                PermissionCodes.OperationsManage,
                PermissionCodes.PortalParentAccess,
                PermissionCodes.PortalStudentAccess,
                PermissionCodes.PortalStaffAccess
            ]
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
        logger.LogInformation("Successfully completed security seed for tenant {TenantId}", tenantId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during security seed for tenant {TenantId}", tenantId);
            throw;
        }
    }
}
