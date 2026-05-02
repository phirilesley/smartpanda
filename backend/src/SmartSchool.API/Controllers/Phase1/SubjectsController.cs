using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/subjects")]
[Authorize(Policy = PolicyNames.AcademicsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class SubjectsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Subject>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var items = await dbContext.Subjects.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Subject>> Create([FromBody] CreateSubjectRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var exists = await dbContext.Subjects.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Code == request.Code.Trim().ToUpperInvariant(),
            cancellationToken);

        if (exists)
        {
            return Conflict("Subject code already exists for school.");
        }

        var entity = new Subject
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            Code = request.Code.Trim().ToUpperInvariant(),
            IsOptional = request.IsOptional,
            IsActive = true
        };

        dbContext.Subjects.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Subject>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Subjects.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
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

public sealed record CreateSubjectRequest(Guid TenantId, Guid SchoolId, string Name, string Code, bool IsOptional);
