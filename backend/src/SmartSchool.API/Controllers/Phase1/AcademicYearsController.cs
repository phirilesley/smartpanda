using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/academic-years")]
[Authorize(Policy = PolicyNames.AcademicsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AcademicYearsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AcademicYear>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var items = await dbContext.AcademicYears.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.StartDate)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<AcademicYear>> Create([FromBody] CreateAcademicYearRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var schoolExists = await dbContext.Schools.AsNoTracking().AnyAsync(x =>
            x.Id == request.SchoolId && x.TenantId == request.TenantId,
            cancellationToken);

        if (!schoolExists)
        {
            return BadRequest("School does not exist for tenant.");
        }

        var entity = new AcademicYear
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsActive = request.IsActive,
            IsClosed = false
        };

        dbContext.AcademicYears.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AcademicYear>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.AcademicYears.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
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

public sealed record CreateAcademicYearRequest(
    Guid TenantId,
    Guid SchoolId,
    string Name,
    DateTime StartDate,
    DateTime EndDate,
    bool IsActive);
