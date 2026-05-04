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
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Security;

public class SchoolAccessAuthorizationHandler(SmartSchoolDbContext dbContext, IHttpContextAccessor httpContextAccessor)
    : AuthorizationHandler<SchoolAccessRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, SchoolAccessRequirement requirement)
    {
        if (context.User.IsInRole(RoleCodes.PlatformOwner))
        {
            context.Succeed(requirement);
            return;
        }

        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            return;
        }

        if (!httpContext.Request.Headers.TryGetValue("X-School-Id", out var schoolHeader) ||
            !Guid.TryParse(schoolHeader.FirstOrDefault(), out var schoolId))
        {
            return;
        }

        var userIdClaim = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var tenantIdClaim = context.User.FindFirstValue(ClaimTypesExt.TenantId);

        if (!Guid.TryParse(userIdClaim, out var userId) || !Guid.TryParse(tenantIdClaim, out var tenantId))
        {
            return;
        }

        var allowed = await dbContext.UserSchoolAccesses.AsNoTracking().AnyAsync(x =>
            x.TenantId == tenantId &&
            x.SchoolId == schoolId &&
            x.UserId == userId &&
            x.CanRead);

        if (allowed)
        {
            context.Succeed(requirement);
        }
    }
}
