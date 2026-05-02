using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/students/guardians")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class GuardiansController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Guardian>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var items = await dbContext.Guardians.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.LastName)
            .ThenBy(x => x.FirstName)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Guardian>> Create([FromBody] CreateGuardianRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var guardian = new Guardian
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Email = request.Email.Trim(),
            Relationship = request.Relationship.Trim()
        };

        dbContext.Guardians.Add(guardian);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = guardian.Id }, guardian);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Guardian>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Guardians.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(item.TenantId))
        {
            return Forbid();
        }

        return Ok(item);
    }
}

public sealed record CreateGuardianRequest(
    Guid TenantId,
    Guid SchoolId,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Email,
    string Relationship);


