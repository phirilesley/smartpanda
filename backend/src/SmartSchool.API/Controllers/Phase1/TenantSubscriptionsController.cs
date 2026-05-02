using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/tenant-subscriptions")]
[Authorize(Policy = PolicyNames.PlatformManage)]
public class TenantSubscriptionsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TenantSubscription>>> GetSubscriptions([FromQuery] Guid? tenantId, CancellationToken cancellationToken)
    {
        var query = dbContext.TenantSubscriptions.AsNoTracking().Where(x => !x.IsDeleted).AsQueryable();
        if (tenantId.HasValue && tenantId.Value != Guid.Empty)
        {
            query = query.Where(x => x.TenantId == tenantId.Value);
        }

        var items = await query.OrderByDescending(x => x.StartDateUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<TenantSubscription>> CreateSubscription([FromBody] CreateTenantSubscriptionRequest request, CancellationToken cancellationToken)
    {
        var tenantExists = await dbContext.Tenants.AsNoTracking().AnyAsync(x => x.Id == request.TenantId, cancellationToken);
        var planExists = await dbContext.SubscriptionPlans.AsNoTracking().AnyAsync(x => x.Id == request.SubscriptionPlanId, cancellationToken);
        if (!tenantExists || !planExists) return BadRequest("Tenant or subscription plan not found.");

        var entity = new TenantSubscription
        {
            TenantId = request.TenantId,
            SubscriptionPlanId = request.SubscriptionPlanId,
            StartDateUtc = request.StartDateUtc,
            EndDateUtc = request.EndDateUtc,
            AutoRenew = request.AutoRenew,
            Status = request.Status
        };

        dbContext.TenantSubscriptions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{subscriptionId:guid}")]
    public async Task<ActionResult<TenantSubscription>> UpdateSubscription(Guid subscriptionId, [FromBody] UpdateTenantSubscriptionRequest request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TenantSubscriptions.FirstOrDefaultAsync(x => x.Id == subscriptionId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();

        var planExists = await dbContext.SubscriptionPlans.AsNoTracking().AnyAsync(x => x.Id == request.SubscriptionPlanId && !x.IsDeleted, cancellationToken);
        if (!planExists) return BadRequest("Subscription plan not found.");

        entity.SubscriptionPlanId = request.SubscriptionPlanId;
        entity.StartDateUtc = request.StartDateUtc;
        entity.EndDateUtc = request.EndDateUtc;
        entity.AutoRenew = request.AutoRenew;
        entity.Status = request.Status;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{subscriptionId:guid}")]
    public async Task<IActionResult> DeleteSubscription(Guid subscriptionId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TenantSubscriptions.FirstOrDefaultAsync(x => x.Id == subscriptionId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateTenantSubscriptionRequest(Guid TenantId, Guid SubscriptionPlanId, DateTime StartDateUtc, DateTime EndDateUtc, bool AutoRenew, RecordStatus Status);
public sealed record UpdateTenantSubscriptionRequest(Guid SubscriptionPlanId, DateTime StartDateUtc, DateTime EndDateUtc, bool AutoRenew, RecordStatus Status);
