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
[Route("api/platform/schools")]
[Route("api/schools")]
[Authorize(Policy = PolicyNames.SchoolsManage)]
public class SchoolsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<School>>> GetAll([FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty)
        {
            return BadRequest("tenantId is required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var items = await dbContext.Schools
            .AsNoTracking()
            .Where(x => x.TenantId == tenantId && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<School>> Create([FromBody] CreateSchoolRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var tenantExists = await dbContext.Tenants.AsNoTracking().AnyAsync(x => x.Id == request.TenantId, cancellationToken);
        if (!tenantExists)
        {
            return BadRequest("Tenant does not exist.");
        }

        var codeExists = await dbContext.Schools.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.Code == request.Code.Trim().ToUpperInvariant(),
            cancellationToken);

        if (codeExists)
        {
            return Conflict("School code already exists for tenant.");
        }

        var school = new School
        {
            TenantId = request.TenantId,
            Name = request.Name.Trim(),
            Code = request.Code.Trim().ToUpperInvariant(),
            Email = request.ResolveEmail().Trim(),
            Phone = request.ResolvePhone().Trim(),
            Address = request.Address.Trim(),
            IsActive = true
        };

        dbContext.Schools.Add(school);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(school);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<School>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var school = await dbContext.Schools.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (school is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(school.TenantId))
        {
            return Forbid();
        }

        return Ok(school);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<School>> Update(Guid id, [FromBody] UpdateSchoolRequest request, CancellationToken cancellationToken)
    {
        var school = await dbContext.Schools.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (school is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(school.TenantId))
        {
            return Forbid();
        }

        var code = request.Code.Trim().ToUpperInvariant();
        var duplicate = await dbContext.Schools.AnyAsync(
            x => x.Id != id && !x.IsDeleted && x.TenantId == school.TenantId && x.Code == code,
            cancellationToken);
        if (duplicate)
        {
            return Conflict("School code already exists for tenant.");
        }

        school.Name = request.Name.Trim();
        school.Code = code;
        school.Email = request.ResolveEmail().Trim();
        school.Phone = request.ResolvePhone().Trim();
        school.Address = request.Address.Trim();
        school.IsActive = request.IsActive;
        school.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(school);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var school = await dbContext.Schools.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (school is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(school.TenantId))
        {
            return Forbid();
        }

        school.IsDeleted = true;
        school.DeletedAtUtc = DateTime.UtcNow;
        school.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed class CreateSchoolRequest
{
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string Address { get; set; } = string.Empty;

    public string ResolveEmail() => string.IsNullOrWhiteSpace(Email) ? (ContactEmail ?? string.Empty) : Email;
    public string ResolvePhone() => Phone ?? string.Empty;
}

public sealed class UpdateSchoolRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public string ResolveEmail() => string.IsNullOrWhiteSpace(Email) ? (ContactEmail ?? string.Empty) : Email;
    public string ResolvePhone() => Phone ?? string.Empty;
}
