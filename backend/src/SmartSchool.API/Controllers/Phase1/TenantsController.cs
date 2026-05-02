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
        var tenant = await dbContext.Tenants.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return tenant is null ? NotFound() : Ok(tenant);
    }
}

public sealed record CreateTenantRequest(string Name, string Code, string ContactEmail, string ContactPhone);
