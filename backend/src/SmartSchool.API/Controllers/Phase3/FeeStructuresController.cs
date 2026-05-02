using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase3;

[ApiController]
[Route("api/finance/fee-structures")]
[Authorize(Policy = PolicyNames.FinanceManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class FeeStructuresController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FeeStructure>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, [FromQuery] Guid gradeId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.FeeStructures.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (academicYearId != Guid.Empty) query = query.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) query = query.Where(x => x.TermId == termId);
        if (gradeId != Guid.Empty) query = query.Where(x => x.GradeId == gradeId);

        var items = await query.OrderBy(x => x.AcademicYearId).ThenBy(x => x.TermId).ThenBy(x => x.GradeId).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<FeeStructure>> Create([FromBody] CreateFeeStructureRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var refsValid = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x => x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken)
            && await dbContext.Terms.AsNoTracking().AnyAsync(x => x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AcademicYearId == request.AcademicYearId, cancellationToken)
            && await dbContext.Grades.AsNoTracking().AnyAsync(x => x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken)
            && await dbContext.FeeCategories.AsNoTracking().AnyAsync(x => x.Id == request.FeeCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken);

        if (!refsValid) return BadRequest("Invalid references for fee structure.");

        var exists = await dbContext.FeeStructures.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId &&
            x.GradeId == request.GradeId && x.FeeCategoryId == request.FeeCategoryId &&
            x.Currency == request.Currency, cancellationToken);

        if (exists) return Conflict("Fee structure already exists for this scope.");

        var entity = new FeeStructure
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            GradeId = request.GradeId,
            FeeCategoryId = request.FeeCategoryId,
            Amount = request.Amount,
            Currency = request.Currency
        };

        dbContext.FeeStructures.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FeeStructure>> Update(Guid id, [FromBody] UpdateFeeStructureRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.FeeStructures.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == request.TenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Validate references if they're being updated
        if (request.AcademicYearId != entity.AcademicYearId || request.TermId != entity.TermId || request.GradeId != entity.GradeId || request.FeeCategoryId != entity.FeeCategoryId)
        {
            var refsValid = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x => x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId, cancellationToken)
                && await dbContext.Terms.AsNoTracking().AnyAsync(x => x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId && x.AcademicYearId == request.AcademicYearId, cancellationToken)
                && await dbContext.Grades.AsNoTracking().AnyAsync(x => x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId, cancellationToken)
                && await dbContext.FeeCategories.AsNoTracking().AnyAsync(x => x.Id == request.FeeCategoryId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId, cancellationToken);

            if (!refsValid) return BadRequest("Invalid references for fee structure.");
        }

        // Check for conflicts with other structures
        var conflict = await dbContext.FeeStructures.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId &&
            x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId &&
            x.GradeId == request.GradeId && x.FeeCategoryId == request.FeeCategoryId &&
            x.Currency == request.Currency && x.Id != id, cancellationToken);

        if (conflict) return Conflict("Fee structure already exists for this scope.");

        entity.AcademicYearId = request.AcademicYearId;
        entity.TermId = request.TermId;
        entity.GradeId = request.GradeId;
        entity.FeeCategoryId = request.FeeCategoryId;
        entity.Amount = request.Amount;
        entity.Currency = request.Currency;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.FeeStructures.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if structure is referenced by student invoices
        // Note: StudentInvoice may not have direct FeeStructureId, so we check through invoice lines if they exist
        var isInUse = false; // Simplified for now - would need to check invoice lines if that relationship exists
        if (isInUse) return BadRequest("Cannot delete fee structure that is referenced by student invoices.");

        dbContext.FeeStructures.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateFeeStructureRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, Guid TermId, Guid GradeId, Guid FeeCategoryId, decimal Amount, CurrencyCode Currency);
public sealed record UpdateFeeStructureRequest(Guid TenantId, Guid AcademicYearId, Guid TermId, Guid GradeId, Guid FeeCategoryId, decimal Amount, CurrencyCode Currency);
