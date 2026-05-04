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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/subscription-plans")]
[Authorize(Policy = PolicyNames.PlatformManage)]
public class SubscriptionPlansController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SubscriptionPlan>>> GetPlans(CancellationToken cancellationToken)
    {
        var plans = await dbContext.SubscriptionPlans.AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.MonthlyPriceUsd)
            .ToListAsync(cancellationToken);

        return Ok(plans);
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionPlan>> CreatePlan([FromBody] CreateSubscriptionPlanRequest request, CancellationToken cancellationToken)
    {
        var exists = await dbContext.SubscriptionPlans.AsNoTracking().AnyAsync(x =>
            !x.IsDeleted &&
            x.Name == request.Name.Trim(),
            cancellationToken);

        if (exists) return Conflict("Subscription plan name already exists.");

        var plan = new SubscriptionPlan
        {
            Name = request.Name.Trim(),
            MonthlyPriceUsd = request.MonthlyPriceUsd,
            MaxSchools = request.MaxSchools,
            MaxUsers = request.MaxUsers,
            IsActive = request.IsActive
        };

        dbContext.SubscriptionPlans.Add(plan);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(plan);
    }

    [HttpPut("{planId:guid}")]
    public async Task<ActionResult<SubscriptionPlan>> UpdatePlan(Guid planId, [FromBody] UpdateSubscriptionPlanRequest request, CancellationToken cancellationToken)
    {
        var plan = await dbContext.SubscriptionPlans.FirstOrDefaultAsync(x => x.Id == planId && !x.IsDeleted, cancellationToken);
        if (plan is null) return NotFound();

        plan.Name = request.Name.Trim();
        plan.MonthlyPriceUsd = request.MonthlyPriceUsd;
        plan.MaxSchools = request.MaxSchools;
        plan.MaxUsers = request.MaxUsers;
        plan.IsActive = request.IsActive;
        plan.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(plan);
    }

    [HttpDelete("{planId:guid}")]
    public async Task<IActionResult> DeletePlan(Guid planId, CancellationToken cancellationToken)
    {
        var plan = await dbContext.SubscriptionPlans.FirstOrDefaultAsync(x => x.Id == planId && !x.IsDeleted, cancellationToken);
        if (plan is null) return NotFound();

        plan.IsDeleted = true;
        plan.DeletedAtUtc = DateTime.UtcNow;
        plan.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateSubscriptionPlanRequest(string Name, decimal MonthlyPriceUsd, int MaxSchools, int MaxUsers, bool IsActive);
public sealed record UpdateSubscriptionPlanRequest(string Name, decimal MonthlyPriceUsd, int MaxSchools, int MaxUsers, bool IsActive);
