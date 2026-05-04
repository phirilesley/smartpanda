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
