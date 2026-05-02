using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Settings;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Features;

public interface ITenantFeatureFlagService
{
    Task<bool> IsEnabledAsync(Guid tenantId, string featureCode, CancellationToken cancellationToken);
    Task<IReadOnlyList<TenantFeatureFlag>> GetFlagsAsync(Guid tenantId, CancellationToken cancellationToken);
    Task<TenantFeatureFlag> UpsertAsync(Guid tenantId, string featureCode, bool isEnabled, string description, CancellationToken cancellationToken);
}

public class TenantFeatureFlagService(SmartSchoolDbContext dbContext) : ITenantFeatureFlagService
{
    public async Task<bool> IsEnabledAsync(Guid tenantId, string featureCode, CancellationToken cancellationToken)
    {
        var code = featureCode.Trim().ToLowerInvariant();
        var flag = await dbContext.TenantFeatureFlags.AsNoTracking()
            .FirstOrDefaultAsync(x => x.TenantId == tenantId && x.FeatureCode == code, cancellationToken);

        return flag?.IsEnabled ?? false;
    }

    public async Task<IReadOnlyList<TenantFeatureFlag>> GetFlagsAsync(Guid tenantId, CancellationToken cancellationToken)
    {
        return await dbContext.TenantFeatureFlags.AsNoTracking()
            .Where(x => x.TenantId == tenantId)
            .OrderBy(x => x.FeatureCode)
            .ToListAsync(cancellationToken);
    }

    public async Task<TenantFeatureFlag> UpsertAsync(Guid tenantId, string featureCode, bool isEnabled, string description, CancellationToken cancellationToken)
    {
        var code = featureCode.Trim().ToLowerInvariant();
        var entity = await dbContext.TenantFeatureFlags.FirstOrDefaultAsync(x =>
            x.TenantId == tenantId && x.FeatureCode == code,
            cancellationToken);

        if (entity is null)
        {
            entity = new TenantFeatureFlag
            {
                TenantId = tenantId,
                FeatureCode = code,
                IsEnabled = isEnabled,
                Description = description.Trim()
            };
            dbContext.TenantFeatureFlags.Add(entity);
        }
        else
        {
            entity.IsEnabled = isEnabled;
            entity.Description = description.Trim();
            entity.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RequireFeatureFlagAttribute(string featureCode) : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var user = context.HttpContext.User;
        if (user.IsPlatformOwner())
        {
            await next();
            return;
        }

        var tenantId = user.GetTenantId();
        if (!tenantId.HasValue)
        {
            context.Result = new ForbidResult();
            return;
        }

        var service = context.HttpContext.RequestServices.GetRequiredService<ITenantFeatureFlagService>();
        var enabled = await service.IsEnabledAsync(tenantId.Value, featureCode, context.HttpContext.RequestAborted);
        if (!enabled)
        {
            context.Result = new ObjectResult(new { message = $"Feature '{featureCode}' is disabled for this tenant." })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
            return;
        }

        await next();
    }
}
