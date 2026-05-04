using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase3;

[ApiController]
[Route("api/finance/fee-categories")]
[Authorize(Policy = PolicyNames.FinanceManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class FeeCategoriesController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FeeCategory>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.FeeCategories.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<FeeCategory>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.FeeCategories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<FeeCategory>> Create([FromBody] CreateFeeCategoryRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.FeeCategories.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.Name == request.Name.Trim(), cancellationToken);

        if (exists) return Conflict("Fee category already exists.");

        var entity = new FeeCategory
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            IsMandatory = request.IsMandatory
        };

        dbContext.FeeCategories.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FeeCategory>> Update(Guid id, [FromBody] UpdateFeeCategoryRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.FeeCategories.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == request.TenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if name conflicts with another category
        var nameConflict = await dbContext.FeeCategories.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == entity.SchoolId &&
            x.Name == request.Name.Trim() &&
            x.Id != id, cancellationToken);

        if (nameConflict) return Conflict("Another fee category with this name already exists.");

        entity.Name = request.Name.Trim();
        entity.Description = request.Description.Trim();
        entity.IsMandatory = request.IsMandatory;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.FeeCategories.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if category is in use by fee structures
        var isInUse = await dbContext.FeeStructures.AsNoTracking().AnyAsync(x => x.FeeCategoryId == id, cancellationToken);
        if (isInUse) return BadRequest("Cannot delete fee category that is in use by fee structures.");

        dbContext.FeeCategories.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateFeeCategoryRequest(Guid TenantId, Guid SchoolId, string Name, string Description, bool IsMandatory);
public sealed record UpdateFeeCategoryRequest(Guid TenantId, string Name, string Description, bool IsMandatory);
