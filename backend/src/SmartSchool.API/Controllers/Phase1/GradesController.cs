using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/grades")]
[Authorize(Policy = PolicyNames.AcademicsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class GradesController(SmartSchoolDbContext dbContext, ILogger<GradesController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Grade>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting grades for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            logger.LogWarning("Invalid parameters: tenantId={TenantId}, schoolId={SchoolId}", tenantId, schoolId);
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            logger.LogWarning("User {UserId} denied access to tenant {TenantId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, tenantId);
            return Forbid();
        }

        try
        {
            var items = await dbContext.Grades.AsNoTracking()
                .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
                .OrderBy(x => x.GradeOrder)
                .ToListAsync(cancellationToken);

            logger.LogInformation("Retrieved {Count} grades for tenant {TenantId}, school {SchoolId}", items.Count, tenantId, schoolId);
            return Ok(items);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving grades for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<Grade>> Create([FromBody] CreateGradeRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var exists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.GradeOrder == request.GradeOrder,
            cancellationToken);

        if (exists)
        {
            return Conflict("Grade order already exists for this school.");
        }

        var entity = new Grade
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            GradeOrder = request.GradeOrder,
            IsTerminalGrade = request.IsTerminalGrade,
            IsActive = true
        };

        dbContext.Grades.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Grade>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Grades.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
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

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Grade>> Update(Guid id, [FromBody] UpdateGradeRequest request, CancellationToken cancellationToken)
    {
        var grade = await dbContext.Grades.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (grade is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(grade.TenantId))
        {
            return Forbid();
        }

        var duplicate = await dbContext.Grades.AnyAsync(
            x => x.Id != id && x.TenantId == grade.TenantId && x.SchoolId == grade.SchoolId && x.GradeOrder == request.GradeOrder,
            cancellationToken);
        if (duplicate)
        {
            return Conflict("Grade order already exists for this school.");
        }

        grade.Name = request.Name.Trim();
        grade.GradeOrder = request.GradeOrder;
        grade.IsTerminalGrade = request.IsTerminalGrade;
        grade.IsActive = request.IsActive;
        grade.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(grade);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var grade = await dbContext.Grades.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (grade is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(grade.TenantId))
        {
            return Forbid();
        }

        // Check if grade has streams
        var hasStreams = await dbContext.Streams.AnyAsync(x => x.GradeId == id, cancellationToken);
        if (hasStreams)
        {
            return BadRequest("Cannot delete grade with existing streams.");
        }

        // Check if grade has enrollments
        var hasEnrollments = await dbContext.StudentEnrollments.AnyAsync(x => x.GradeId == id, cancellationToken);
        if (hasEnrollments)
        {
            return BadRequest("Cannot delete grade with existing enrollments.");
        }

        dbContext.Grades.Remove(grade);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateGradeRequest(Guid TenantId, Guid SchoolId, string Name, int GradeOrder, bool IsTerminalGrade);

public sealed record UpdateGradeRequest(string Name, int GradeOrder, bool IsTerminalGrade, bool IsActive);
