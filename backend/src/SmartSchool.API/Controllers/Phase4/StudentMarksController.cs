using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase4;

[ApiController]
[Route("api/exams/marks")]
[Authorize(Policy = PolicyNames.ExamsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentMarksController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<StudentMark>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid examSessionId, [FromQuery] Guid studentId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.StudentMarks.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (examSessionId != Guid.Empty) query = query.Where(x => x.ExamSessionId == examSessionId);
        if (studentId != Guid.Empty) query = query.Where(x => x.StudentId == studentId);

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("bulk")]
    public async Task<ActionResult<IReadOnlyList<StudentMark>>> UpsertBulk([FromBody] UpsertStudentMarksRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        if (request.Items.Count == 0) return BadRequest("At least one mark is required.");

        var session = await dbContext.ExamSessions.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.ExamSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (session is null) return BadRequest("Exam session not found for tenant/school.");

        var enteredByRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var enteredBy = Guid.TryParse(enteredByRaw, out var uid) ? uid : Guid.Empty;

        var results = new List<StudentMark>();

        foreach (var item in request.Items)
        {
            var enrollment = await dbContext.StudentEnrollments.AsNoTracking().FirstOrDefaultAsync(x =>
                x.Id == item.EnrollmentId &&
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.StudentId == item.StudentId,
                cancellationToken);

            if (enrollment is null) return BadRequest($"Invalid enrollment for student {item.StudentId}.");
            if (enrollment.AcademicYearId != session.AcademicYearId || enrollment.TermId != session.TermId || enrollment.GradeId != session.GradeId)
            {
                return BadRequest($"Enrollment does not match exam session scope for student {item.StudentId}.");
            }

            var subjectExists = await dbContext.Subjects.AsNoTracking().AnyAsync(x =>
                x.Id == item.SubjectId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                cancellationToken);
            if (!subjectExists) return BadRequest($"Invalid subject {item.SubjectId}.");

            var existing = await dbContext.StudentMarks.FirstOrDefaultAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.EnrollmentId == item.EnrollmentId &&
                x.ExamSessionId == request.ExamSessionId &&
                x.SubjectId == item.SubjectId,
                cancellationToken);

            if (existing is null)
            {
                existing = new StudentMark
                {
                    TenantId = request.TenantId,
                    SchoolId = request.SchoolId,
                    StudentId = item.StudentId,
                    EnrollmentId = item.EnrollmentId,
                    ExamSessionId = request.ExamSessionId,
                    SubjectId = item.SubjectId,
                    Mark = item.Mark,
                    Grade = string.IsNullOrWhiteSpace(item.Grade) ? string.Empty : item.Grade.Trim(),
                    EnteredByStaffId = enteredBy
                };
                dbContext.StudentMarks.Add(existing);
            }
            else
            {
                existing.Mark = item.Mark;
                existing.Grade = string.IsNullOrWhiteSpace(item.Grade) ? existing.Grade : item.Grade.Trim();
                existing.EnteredByStaffId = enteredBy;
                existing.UpdatedAtUtc = DateTime.UtcNow;
            }

            results.Add(existing);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(results);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StudentMark>> Update(Guid id, [FromBody] UpdateStudentMarkRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var mark = await dbContext.StudentMarks.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (mark is null) return NotFound();

        if (!User.CanAccessTenant(mark.TenantId)) return Forbid();

        // Verify subject exists
        var subjectExists = await dbContext.Subjects.AsNoTracking().AnyAsync(x =>
            x.Id == request.SubjectId && x.TenantId == request.TenantId && x.SchoolId == mark.SchoolId,
            cancellationToken);
        if (!subjectExists) return BadRequest("Invalid subject.");

        mark.SubjectId = request.SubjectId;
        mark.Mark = request.Mark;
        mark.Grade = string.IsNullOrWhiteSpace(request.Grade) ? string.Empty : request.Grade.Trim();
        mark.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(mark);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var mark = await dbContext.StudentMarks.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (mark is null) return NotFound();

        if (!User.CanAccessTenant(mark.TenantId)) return Forbid();

        // Check if mark is approved
        if (mark.ApprovedAtUtc.HasValue)
        {
            return BadRequest("Cannot delete approved marks.");
        }

        dbContext.StudentMarks.Remove(mark);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record UpsertStudentMarksRequest(Guid TenantId, Guid SchoolId, Guid ExamSessionId, List<UpsertStudentMarkItem> Items);
public sealed record UpsertStudentMarkItem(Guid StudentId, Guid EnrollmentId, Guid SubjectId, decimal Mark, string? Grade);

public sealed record UpdateStudentMarkRequest(Guid TenantId, Guid SubjectId, decimal Mark, string? Grade);
