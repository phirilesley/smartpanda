using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/terms")]
[Authorize(Policy = PolicyNames.AcademicsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class TermsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Term>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || academicYearId == Guid.Empty)
        {
            return BadRequest("tenantId, schoolId and academicYearId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var items = await dbContext.Terms.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.AcademicYearId == academicYearId)
            .OrderBy(x => x.TermNumber)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Term>> Create([FromBody] CreateTermRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var yearExists = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x =>
            x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!yearExists)
        {
            return BadRequest("Academic year does not exist for tenant/school.");
        }

        var exists = await dbContext.Terms.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId &&
            x.TermNumber == request.TermNumber,
            cancellationToken);

        if (exists)
        {
            return Conflict("Term number already exists for this academic year.");
        }

        var term = new Term
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AcademicYearId = request.AcademicYearId,
            Name = request.Name.Trim(),
            TermNumber = request.TermNumber,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = true,
            IsClosed = false
        };

        dbContext.Terms.Add(term);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = term.Id }, term);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Term>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Terms.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
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

public sealed record CreateTermRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid AcademicYearId,
    string Name,
    int TermNumber,
    DateTime StartDate,
    DateTime EndDate);
