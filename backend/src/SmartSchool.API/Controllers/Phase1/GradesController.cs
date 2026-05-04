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
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/grades")]
[Route("api/grades")]
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

        var resolvedOrder = request.ResolveGradeOrder();
        var existingExact = await dbContext.Grades.AsNoTracking().FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.GradeOrder == resolvedOrder &&
            x.Name == request.Name.Trim(),
            cancellationToken);
        if (existingExact is not null)
        {
            return Ok(existingExact);
        }

        var exists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            (x.GradeOrder == resolvedOrder || x.Name == request.Name.Trim()),
            cancellationToken);

        if (exists)
        {
            return Conflict("Grade already exists for this school.");
        }

        var entity = new Grade
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            GradeOrder = resolvedOrder,
            IsTerminalGrade = request.IsTerminalGrade ?? false,
            IsActive = true
        };

        dbContext.Grades.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity);
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
            x => x.Id != id &&
                 x.TenantId == grade.TenantId &&
                 x.SchoolId == grade.SchoolId &&
                 (x.GradeOrder == request.ResolveGradeOrder() || x.Name == request.Name.Trim()),
            cancellationToken);
        if (duplicate)
        {
            return Conflict("Grade already exists for this school.");
        }

        grade.Name = request.Name.Trim();
        grade.GradeOrder = request.ResolveGradeOrder();
        grade.IsTerminalGrade = request.IsTerminalGrade ?? false;
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

public sealed class CreateGradeRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? GradeOrder { get; set; }
    public int? Level { get; set; }
    public bool? IsTerminalGrade { get; set; }

    public int ResolveGradeOrder() => GradeOrder ?? Level ?? 0;
}

public sealed class UpdateGradeRequest
{
    public string Name { get; set; } = string.Empty;
    public int? GradeOrder { get; set; }
    public int? Level { get; set; }
    public bool? IsTerminalGrade { get; set; }
    public bool IsActive { get; set; } = true;

    public int ResolveGradeOrder() => GradeOrder ?? Level ?? 0;
}
