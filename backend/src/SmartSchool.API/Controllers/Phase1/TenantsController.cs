using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/platform/tenants")]
[Authorize(Policy = PolicyNames.PlatformManage)]
public class TenantsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Tenant>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await dbContext.Tenants
            .AsNoTracking()
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<Tenant>> Create([FromBody] CreateTenantRequest request, CancellationToken cancellationToken)
    {
        var exists = await dbContext.Tenants.AnyAsync(x => x.Code == request.Code.Trim().ToUpperInvariant(), cancellationToken);
        if (exists)
        {
            return Conflict("Tenant code already exists.");
        }

        var tenant = new Tenant
        {
            Name = request.Name.Trim(),
            Code = request.Code.Trim().ToUpperInvariant(),
            ContactEmail = request.ContactEmail.Trim(),
            ContactPhone = request.ContactPhone.Trim(),
            IsActive = true
        };

        dbContext.Tenants.Add(tenant);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, tenant);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Tenant>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var tenant = await dbContext.Tenants.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        return tenant is null ? NotFound() : Ok(tenant);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Tenant>> Update(Guid id, [FromBody] UpdateTenantRequest request, CancellationToken cancellationToken)
    {
        var tenant = await dbContext.Tenants.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (tenant is null)
        {
            return NotFound();
        }

        var code = request.Code.Trim().ToUpperInvariant();
        var duplicate = await dbContext.Tenants.AnyAsync(
            x => x.Id != id && !x.IsDeleted && x.Code == code,
            cancellationToken);
        if (duplicate)
        {
            return Conflict("Tenant code already exists.");
        }

        tenant.Name = request.Name.Trim();
        tenant.Code = code;
        tenant.ContactEmail = request.ContactEmail.Trim();
        tenant.ContactPhone = request.ContactPhone.Trim();
        tenant.IsActive = request.IsActive;
        tenant.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(tenant);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var tenant = await dbContext.Tenants.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (tenant is null)
        {
            return NotFound();
        }

        tenant.IsDeleted = true;
        tenant.DeletedAtUtc = DateTime.UtcNow;
        tenant.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateTenantRequest(string Name, string Code, string ContactEmail, string ContactPhone);
public sealed record UpdateTenantRequest(string Name, string Code, string ContactEmail, string ContactPhone, bool IsActive);
