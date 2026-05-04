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
[Route("api/platform/tenants")]
[Route("api/tenants")]
[Authorize(Policy = PolicyNames.PlatformManage)]
public class TenantsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Tenant>>> GetAll([FromQuery] Guid? tenantId, CancellationToken cancellationToken)
    {
        var query = dbContext.Tenants
            .AsNoTracking()
            .Where(x => !x.IsDeleted);
        if (tenantId.HasValue && tenantId.Value != Guid.Empty)
        {
            query = query.Where(x => x.Id == tenantId.Value);
        }

        var items = await query.OrderBy(x => x.Name).ToListAsync(cancellationToken);

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
            ContactPhone = request.ResolvePhone().Trim(),
            IsActive = true
        };

        dbContext.Tenants.Add(tenant);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(tenant);
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
        tenant.ContactPhone = request.ResolvePhone().Trim();
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

public sealed class CreateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? Phone { get; set; }

    public string ResolvePhone() => string.IsNullOrWhiteSpace(ContactPhone) ? (Phone ?? string.Empty) : ContactPhone;
}

public sealed class UpdateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string? ContactPhone { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; }

    public string ResolvePhone() => string.IsNullOrWhiteSpace(ContactPhone) ? (Phone ?? string.Empty) : ContactPhone;
}
