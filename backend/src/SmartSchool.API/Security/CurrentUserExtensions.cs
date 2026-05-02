using System.Security.Claims;

namespace SmartSchool.API.Security;

public static class CurrentUserExtensions
{
    public static bool IsPlatformOwner(this ClaimsPrincipal user) => user.IsInRole(RoleCodes.PlatformOwner);

    public static Guid? GetTenantId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue(ClaimTypesExt.TenantId);
        return Guid.TryParse(raw, out var tenantId) ? tenantId : null;
    }

    public static Guid? GetUserId(this ClaimsPrincipal user)
    {
        var raw = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(raw, out var userId) ? userId : null;
    }

    public static bool CanAccessTenant(this ClaimsPrincipal user, Guid tenantId)
    {
        if (user.IsPlatformOwner())
        {
            return true;
        }

        var currentTenantId = user.GetTenantId();
        return currentTenantId.HasValue && currentTenantId.Value == tenantId;
    }
}
