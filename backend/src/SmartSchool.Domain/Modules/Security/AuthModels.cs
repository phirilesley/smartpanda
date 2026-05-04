using Microsoft.AspNetCore.Identity;
using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Security;

// ─── Identity Extension Classes ─────────────────────────────────────────────

/// <summary>Extended Identity user with multi-tenant school support.</summary>
public class AppUser : IdentityUser<Guid>
{
    public Guid TenantId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string? ProfilePictureUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAtUtc { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    public bool IsDeleted { get; set; }
}

/// <summary>Extended Identity role with tenant scoping.</summary>
public class AppRole : IdentityRole<Guid>
{
    public Guid TenantId { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsSystemRole { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

// ─── Fine-Grained Permission System ─────────────────────────────────────────

/// <summary>System-wide permission definition (e.g. "students.view", "fees.edit").</summary>
public class Permission : EntityBase
{
    public string Code { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

/// <summary>Assigns a permission to a role within a tenant.</summary>
public class RolePermission : TenantEntityBase
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    public Guid GrantedByUserId { get; set; }
}

/// <summary>Grants or denies a specific permission directly to a user (overrides role).</summary>
public class UserPermission : TenantEntityBase
{
    public Guid UserId { get; set; }
    public Guid PermissionId { get; set; }
    public bool IsDenied { get; set; }   // true = explicit deny, false = explicit grant
    public bool IsAllowed { get; set; } = true;
    public Guid GrantedByUserId { get; set; }
}

/// <summary>Controls which schools within a tenant a user can access.</summary>
public class UserSchoolAccess : TenantEntityBase
{
    public Guid SchoolId { get; set; }
    public Guid UserId { get; set; }
    public bool IsActive { get; set; } = true;
    public bool CanRead { get; set; } = true;
    public bool CanWrite { get; set; } = true;
    public bool CanApprove { get; set; } = true;
    public Guid GrantedByUserId { get; set; }
}

// ─── Audit Logging ───────────────────────────────────────────────────────────

/// <summary>Immutable audit trail for all write operations across the system.</summary>
public class AuditLog : TenantEntityBase
{
    public Guid? SchoolId { get; set; }
    public Guid? UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;         // CREATE | UPDATE | DELETE | LOGIN etc.
    public string EntityType { get; set; } = string.Empty;     // e.g. "Student"
    public string EntityName { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string? OldValuesJson { get; set; }
    public string? NewValuesJson { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    public bool IsSuccess { get; set; } = true;
    public string? ErrorMessage { get; set; }
    public DateTime OccurredAtUtc { get; set; } = DateTime.UtcNow;
}

// ─── JWT Token Management ────────────────────────────────────────────────────

/// <summary>Stored hashed refresh tokens for JWT rotation strategy.</summary>
public class RefreshToken : TenantEntityBase
{
    public Guid UserId { get; set; }
    public string TokenHash { get; set; } = string.Empty;       // SHA-256 hash of the raw token
    public string DeviceInfo { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime? RevokedAtUtc { get; set; }
    public string? ReplacedByTokenHash { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
