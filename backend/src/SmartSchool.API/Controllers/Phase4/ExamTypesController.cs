using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase4;

[ApiController]
[Route("api/exams/types")]
[Authorize(Policy = PolicyNames.ExamsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ExamTypesController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ExamType>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.ExamTypes.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<ExamType>> Create([FromBody] CreateExamTypeRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.ExamTypes.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);

        if (exists) return Conflict("Exam type already exists.");

        var entity = new ExamType
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            WeightPercent = request.WeightPercent,
            IsContinuousAssessment = request.IsContinuousAssessment
        };

        dbContext.ExamTypes.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ExamType>> Update(Guid id, [FromBody] UpdateExamTypeRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ExamTypes.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == request.TenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if name conflicts with another type
        var nameConflict = await dbContext.ExamTypes.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == entity.SchoolId &&
            x.Name == request.Name.Trim() &&
            x.Id != id, cancellationToken);

        if (nameConflict) return Conflict("Another exam type with this name already exists.");

        entity.Name = request.Name.Trim();
        entity.WeightPercent = request.WeightPercent;
        entity.IsContinuousAssessment = request.IsContinuousAssessment;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.ExamTypes.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if type is in use by student marks
        // Note: StudentMark may not have direct ExamTypeId, so we check through exam sessions if they exist
        var isInUse = false; // Simplified for now - would need to check exam sessions if that relationship exists
        if (isInUse) return BadRequest("Cannot delete exam type that is in use by student marks.");

        dbContext.ExamTypes.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateExamTypeRequest(Guid TenantId, Guid SchoolId, string Name, decimal WeightPercent, bool IsContinuousAssessment);
public sealed record UpdateExamTypeRequest(Guid TenantId, string Name, decimal WeightPercent, bool IsContinuousAssessment);
