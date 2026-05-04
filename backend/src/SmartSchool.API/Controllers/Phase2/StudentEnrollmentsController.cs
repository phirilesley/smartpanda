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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.API.Validation;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/students/enrollments")]
[Route("api/student-enrollments")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
[ServiceFilter(typeof(SmartSchool.API.Validation.CrossEntityValidationFilter))]
public class StudentEnrollmentsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<StudentEnrollment>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? studentId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var query = dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId.HasValue && studentId.Value != Guid.Empty)
        {
            query = query.Where(x => x.StudentId == studentId.Value);
        }

        var items = await query.OrderByDescending(x => x.IsCurrent).ThenByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentEnrollment>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.StudentEnrollments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpGet("student/{studentId:guid}")]
    public async Task<ActionResult<IReadOnlyList<StudentEnrollment>>> GetByStudent(Guid studentId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students.AsNoTracking().FirstOrDefaultAsync(x => x.Id == studentId, cancellationToken);
        if (student is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(student.TenantId))
        {
            return Forbid();
        }

        var items = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.IsCurrent)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<StudentEnrollment>> Create([FromBody] CreateStudentEnrollmentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var student = await dbContext.Students.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (student is null)
        {
            return BadRequest("Student does not exist for tenant/school.");
        }

        var yearExists = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x =>
            x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        var termExists = await dbContext.Terms.AsNoTracking().AnyAsync(x =>
            x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AcademicYearId == request.AcademicYearId,
            cancellationToken);

        var gradeExists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        var streamExists = await dbContext.Streams.AsNoTracking().AnyAsync(x =>
            x.Id == request.StreamId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!yearExists || !termExists || !gradeExists || !streamExists)
        {
            return BadRequest("Invalid academic references for tenant/school.");
        }

        if (request.ResolveIsCurrent())
        {
            var currentItems = await dbContext.StudentEnrollments
                .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == request.StudentId && x.IsCurrent)
                .ToListAsync(cancellationToken);

            foreach (var current in currentItems)
            {
                current.IsCurrent = false;
                current.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        var enrollment = new StudentEnrollment
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            GradeId = request.GradeId,
            StreamId = request.StreamId,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Active" : request.Status.Trim(),
            IsCurrent = request.ResolveIsCurrent()
        };

        dbContext.StudentEnrollments.Add(enrollment);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(enrollment);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StudentEnrollment>> Update(Guid id, [FromBody] UpdateStudentEnrollmentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var enrollment = await dbContext.StudentEnrollments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (enrollment is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(enrollment.TenantId))
        {
            return Forbid();
        }

        var yearExists = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x =>
            x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        var termExists = await dbContext.Terms.AsNoTracking().AnyAsync(x =>
            x.Id == request.TermId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AcademicYearId == request.AcademicYearId,
            cancellationToken);

        var gradeExists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        var streamExists = await dbContext.Streams.AsNoTracking().AnyAsync(x =>
            x.Id == request.StreamId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!yearExists || !termExists || !gradeExists || !streamExists)
        {
            return BadRequest("Invalid academic references for tenant/school.");
        }

        if (request.ResolveIsCurrent() && !enrollment.IsCurrent)
        {
            var currentItems = await dbContext.StudentEnrollments
                .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == enrollment.StudentId && x.IsCurrent)
                .ToListAsync(cancellationToken);

            foreach (var current in currentItems)
            {
                current.IsCurrent = false;
                current.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        enrollment.AcademicYearId = request.AcademicYearId;
        enrollment.TermId = request.TermId;
        enrollment.GradeId = request.GradeId;
        enrollment.StreamId = request.StreamId;
        enrollment.Status = string.IsNullOrWhiteSpace(request.Status) ? "Active" : request.Status.Trim();
        enrollment.IsCurrent = request.ResolveIsCurrent();
        enrollment.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(enrollment);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var enrollment = await dbContext.StudentEnrollments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (enrollment is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(enrollment.TenantId))
        {
            return Forbid();
        }

        dbContext.StudentEnrollments.Remove(enrollment);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed class CreateStudentEnrollmentRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid StreamId { get; set; }
    public bool? IsCurrent { get; set; }
    public DateTime? EnrollmentDate { get; set; }
    public string? Status { get; set; }

    public bool ResolveIsCurrent() => IsCurrent ?? true;
}

public sealed class UpdateStudentEnrollmentRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid StreamId { get; set; }
    public bool? IsCurrent { get; set; }
    public DateTime? EnrollmentDate { get; set; }
    public string? Status { get; set; }

    public bool ResolveIsCurrent() => IsCurrent ?? true;
}
