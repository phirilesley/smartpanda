using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase4;

[ApiController]
[Route("api/exams/marks")]
[Route("api/exams/student-marks")]
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

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentMark>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.StudentMarks.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<IReadOnlyList<StudentMark>>> UpsertLegacy([FromBody] LegacyStudentMarksRequest request, CancellationToken cancellationToken)
    {
        var subjectId = request.SubjectId;
        if (subjectId == Guid.Empty)
        {
            subjectId = await dbContext.Subjects.AsNoTracking()
                .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId)
                .Select(x => x.Id)
                .FirstOrDefaultAsync(cancellationToken);
            if (subjectId == Guid.Empty) return BadRequest("At least one subject must exist for school.");
        }

        var session = await dbContext.ExamSessions.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.ExamSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (session is null) return BadRequest("Exam session not found for tenant/school.");

        var items = new List<UpsertStudentMarkItem>();
        foreach (var mark in request.Marks)
        {
            var yearScope = request.AcademicYearIdOrDefault == Guid.Empty ? session.AcademicYearId : request.AcademicYearIdOrDefault;
            var termScope = request.TermIdOrDefault == Guid.Empty ? session.TermId : request.TermIdOrDefault;

            var enrollmentId = await dbContext.StudentEnrollments.AsNoTracking()
                .Where(x => x.TenantId == request.TenantId &&
                            x.SchoolId == request.SchoolId &&
                            x.StudentId == mark.StudentId &&
                            x.AcademicYearId == yearScope &&
                            x.TermId == termScope)
                .OrderByDescending(x => x.IsCurrent)
                .Select(x => x.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (enrollmentId == Guid.Empty)
            {
                enrollmentId = await dbContext.StudentEnrollments.AsNoTracking()
                    .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == mark.StudentId)
                    .OrderByDescending(x => x.IsCurrent)
                    .Select(x => x.Id)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            if (enrollmentId == Guid.Empty)
            {
                var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
                    x.Id == mark.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                    cancellationToken);
                if (!studentExists) return BadRequest($"Student not found for mark entry: {mark.StudentId}.");

                var streamId = await dbContext.Streams.AsNoTracking()
                    .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.GradeId == session.GradeId)
                    .OrderBy(x => x.Name)
                    .Select(x => x.Id)
                    .FirstOrDefaultAsync(cancellationToken);
                if (streamId == Guid.Empty)
                {
                    streamId = await dbContext.Streams.AsNoTracking()
                        .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId)
                        .OrderBy(x => x.Name)
                        .Select(x => x.Id)
                        .FirstOrDefaultAsync(cancellationToken);
                }
                if (streamId == Guid.Empty) return BadRequest("No stream configured for mark entry.");

                var currentEnrollments = await dbContext.StudentEnrollments
                    .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == mark.StudentId && x.IsCurrent)
                    .ToListAsync(cancellationToken);
                foreach (var current in currentEnrollments)
                {
                    current.IsCurrent = false;
                    current.UpdatedAtUtc = DateTime.UtcNow;
                }

                var generatedEnrollment = new StudentEnrollment
                {
                    TenantId = request.TenantId,
                    SchoolId = request.SchoolId,
                    StudentId = mark.StudentId,
                    AcademicYearId = session.AcademicYearId,
                    TermId = session.TermId,
                    GradeId = session.GradeId,
                    StreamId = streamId,
                    Status = "Active",
                    IsCurrent = true
                };
                dbContext.StudentEnrollments.Add(generatedEnrollment);
                await dbContext.SaveChangesAsync(cancellationToken);
                enrollmentId = generatedEnrollment.Id;
            }

            items.Add(new UpsertStudentMarkItem(mark.StudentId, enrollmentId, subjectId, mark.Mark, mark.Remarks));
        }

        var bulk = new UpsertStudentMarksRequest(request.TenantId, request.SchoolId, request.ExamSessionId, items);
        return await UpsertBulk(bulk, cancellationToken);
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

    [HttpPut("{examSessionId:guid}/{studentId:guid}")]
    public async Task<ActionResult<StudentMark>> UpdateBySessionStudent(Guid examSessionId, Guid studentId, [FromBody] LegacyUpdateStudentMarkRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.StudentMarks.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId &&
            x.ExamSessionId == examSessionId &&
            x.StudentId == studentId,
            cancellationToken);
        if (entity is null) return NotFound();

        entity.Mark = request.Mark;
        if (!string.IsNullOrWhiteSpace(request.Remarks))
        {
            entity.Grade = request.Remarks.Trim();
        }
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{examSessionId:guid}/{studentId:guid}")]
    public async Task<IActionResult> DeleteBySessionStudent(Guid examSessionId, Guid studentId, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var item = await dbContext.StudentMarks.FirstOrDefaultAsync(x =>
            x.TenantId == tenantId &&
            x.ExamSessionId == examSessionId &&
            x.StudentId == studentId,
            cancellationToken);
        if (item is null) return NotFound();

        dbContext.StudentMarks.Remove(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record UpsertStudentMarksRequest(Guid TenantId, Guid SchoolId, Guid ExamSessionId, List<UpsertStudentMarkItem> Items);
public sealed record UpsertStudentMarkItem(Guid StudentId, Guid EnrollmentId, Guid SubjectId, decimal Mark, string? Grade);

public sealed record UpdateStudentMarkRequest(Guid TenantId, Guid SubjectId, decimal Mark, string? Grade);
public sealed class LegacyStudentMarksRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid ExamSessionId { get; set; }
    public List<LegacyStudentMarkItem> Marks { get; set; } = [];
    public Guid SubjectId { get; set; }
    public Guid AcademicYearIdOrDefault { get; set; }
    public Guid TermIdOrDefault { get; set; }
}

public sealed record LegacyStudentMarkItem(Guid StudentId, decimal Mark, string? Remarks);
public sealed record LegacyUpdateStudentMarkRequest(Guid TenantId, Guid SchoolId, decimal Mark, string? Remarks);
