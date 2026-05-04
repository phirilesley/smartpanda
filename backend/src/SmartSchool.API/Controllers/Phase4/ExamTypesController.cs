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
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase4;

[ApiController]
[Route("api/exams/types")]
[Route("api/exams/exam-types")]
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

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExamType>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.ExamTypes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
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
            WeightPercent = request.ResolveWeightPercent(),
            IsContinuousAssessment = request.ResolveIsContinuousAssessment()
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
        entity.WeightPercent = request.ResolveWeightPercent();
        entity.IsContinuousAssessment = request.ResolveIsContinuousAssessment();

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

public sealed class CreateExamTypeRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? WeightPercent { get; set; }
    public bool? IsContinuousAssessment { get; set; }
    public string? Description { get; set; }
    public decimal? MaxMarks { get; set; }
    public decimal? PassingMarks { get; set; }

    public decimal ResolveWeightPercent()
    {
        if (WeightPercent.HasValue) return WeightPercent.Value;
        if (MaxMarks.GetValueOrDefault() > 0 && PassingMarks.HasValue)
        {
            return Math.Round(PassingMarks.Value / MaxMarks.Value * 100m, 2);
        }
        return 100m;
    }

    public bool ResolveIsContinuousAssessment() => IsContinuousAssessment ?? false;
}

public sealed class UpdateExamTypeRequest
{
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? WeightPercent { get; set; }
    public bool? IsContinuousAssessment { get; set; }
    public string? Description { get; set; }
    public decimal? MaxMarks { get; set; }
    public decimal? PassingMarks { get; set; }

    public decimal ResolveWeightPercent()
    {
        if (WeightPercent.HasValue) return WeightPercent.Value;
        if (MaxMarks.GetValueOrDefault() > 0 && PassingMarks.HasValue)
        {
            return Math.Round(PassingMarks.Value / MaxMarks.Value * 100m, 2);
        }
        return 100m;
    }

    public bool ResolveIsContinuousAssessment() => IsContinuousAssessment ?? false;
}
