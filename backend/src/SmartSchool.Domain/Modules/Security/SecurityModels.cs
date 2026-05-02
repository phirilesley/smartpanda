using Microsoft.AspNetCore.Identity;
using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Security;

public class AppUser : IdentityUser<Guid>
{
    public Guid TenantId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}

public class AppRole : IdentityRole<Guid>
{
    public Guid? TenantId { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class Permission : EntityBase
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class RolePermission : TenantEntityBase
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
}

public class UserPermission : TenantEntityBase
{
    public Guid UserId { get; set; }
    public Guid PermissionId { get; set; }
    public bool IsAllowed { get; set; }
}

public class UserSchoolAccess : TenantSchoolEntityBase
{
    public Guid UserId { get; set; }
    public bool CanRead { get; set; } = true;
    public bool CanWrite { get; set; }
    public bool CanApprove { get; set; }
}

public class AuditLog : TenantSchoolEntityBase
{
    public Guid? UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string OldValuesJson { get; set; } = string.Empty;
    public string NewValuesJson { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
}

public class RefreshToken : TenantEntityBase
{
    public Guid UserId { get; set; }
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public DateTime? RevokedAtUtc { get; set; }
}
