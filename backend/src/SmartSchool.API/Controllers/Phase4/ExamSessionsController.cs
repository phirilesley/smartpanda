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
[Route("api/exams/sessions")]
[Route("api/exams/exam-sessions")]
[Authorize(Policy = PolicyNames.ExamsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ExamSessionsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ExamSession>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, [FromQuery] Guid gradeId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.ExamSessions.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (academicYearId != Guid.Empty) query = query.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) query = query.Where(x => x.TermId == termId);
        if (gradeId != Guid.Empty) query = query.Where(x => x.GradeId == gradeId);

        var items = await query.OrderBy(x => x.StartDate).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExamSession>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.ExamSessions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<ExamSession>> Create([FromBody] CreateExamSessionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var refsValid = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x => x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken)
            && await dbContext.Terms.AsNoTracking().AnyAsync(x => x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AcademicYearId == request.AcademicYearId, cancellationToken)
            && await dbContext.Grades.AsNoTracking().AnyAsync(x => x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId, cancellationToken);

        if (!refsValid) return BadRequest("Invalid academic references for exam session.");

        var exists = await dbContext.ExamSessions.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
            x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId && x.GradeId == request.GradeId &&
            x.Name == request.Name.Trim(), cancellationToken);

        if (exists) return Conflict("Exam session already exists.");

        var entity = new ExamSession
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            GradeId = request.GradeId,
            Name = request.Name.Trim(),
            StartDate = request.ResolveStartDate(),
            EndDate = request.ResolveEndDate(),
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Draft" : request.Status.Trim()
        };

        dbContext.ExamSessions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ExamSession>> Update(Guid id, [FromBody] UpdateExamSessionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ExamSessions.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == request.TenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Validate references if they're being updated
        if (request.AcademicYearId != entity.AcademicYearId || request.TermId != entity.TermId || request.GradeId != entity.GradeId)
        {
            var refsValid = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x => x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId, cancellationToken)
                && await dbContext.Terms.AsNoTracking().AnyAsync(x => x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId && x.AcademicYearId == request.AcademicYearId, cancellationToken)
                && await dbContext.Grades.AsNoTracking().AnyAsync(x => x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId, cancellationToken);

            if (!refsValid) return BadRequest("Invalid academic references for exam session.");
        }

        // Check for conflicts with other sessions
        var conflict = await dbContext.ExamSessions.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId &&
            x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId && x.GradeId == request.GradeId &&
            x.Name == request.Name.Trim() && x.Id != id, cancellationToken);

        if (conflict) return Conflict("Exam session already exists.");

        entity.AcademicYearId = request.AcademicYearId;
        entity.TermId = request.TermId;
        entity.GradeId = request.GradeId;
        entity.Name = request.Name.Trim();
        entity.StartDate = request.ResolveStartDate();
        entity.EndDate = request.ResolveEndDate();
        entity.Status = string.IsNullOrWhiteSpace(request.Status) ? "Draft" : request.Status.Trim();

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.ExamSessions.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if session has associated exams or marks
        var hasExams = await dbContext.StudentMarks.AsNoTracking().AnyAsync(x => x.ExamSessionId == id, cancellationToken);
        if (hasExams) return BadRequest("Cannot delete exam session that has associated student marks.");

        dbContext.ExamSessions.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed class CreateExamSessionRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid? ExamTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ExamDate { get; set; }
    public decimal? TotalMarks { get; set; }
    public string? Status { get; set; }

    public DateTime ResolveStartDate() => StartDate == default ? (ExamDate ?? DateTime.UtcNow) : StartDate;
    public DateTime ResolveEndDate() => EndDate == default ? ResolveStartDate() : EndDate;
}

public sealed class UpdateExamSessionRequest
{
    public Guid TenantId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid? ExamTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ExamDate { get; set; }
    public decimal? TotalMarks { get; set; }
    public string? Status { get; set; }

    public DateTime ResolveStartDate() => StartDate == default ? (ExamDate ?? DateTime.UtcNow) : StartDate;
    public DateTime ResolveEndDate() => EndDate == default ? ResolveStartDate() : EndDate;
}
