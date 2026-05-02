using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/streams")]
[Authorize(Policy = PolicyNames.AcademicsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StreamsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AcademicStream>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid gradeId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var query = dbContext.Streams.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (gradeId != Guid.Empty)
        {
            query = query.Where(x => x.GradeId == gradeId);
        }

        var items = await query.OrderBy(x => x.Name).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<AcademicStream>> Create([FromBody] CreateAcademicStreamRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var gradeExists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!gradeExists)
        {
            return BadRequest("Grade does not exist for tenant/school.");
        }

        var exists = await dbContext.Streams.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.GradeId == request.GradeId &&
            x.Name == request.Name.Trim(),
            cancellationToken);

        if (exists)
        {
            return Conflict("Stream already exists for grade.");
        }

        var entity = new AcademicStream
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            GradeId = request.GradeId,
            Name = request.Name.Trim(),
            Capacity = request.Capacity,
            ClassTeacherStaffId = request.ClassTeacherStaffId
        };

        dbContext.Streams.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AcademicStream>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Streams.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
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

public sealed record CreateAcademicStreamRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid GradeId,
    string Name,
    int Capacity,
    Guid? ClassTeacherStaffId);
