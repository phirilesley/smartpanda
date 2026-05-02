using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/students")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Student>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] string? search, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var query = dbContext.Students.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(x => x.StudentNumber.Contains(s) || x.FirstName.Contains(s) || x.LastName.Contains(s));
        }

        var items = await query.OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Student>> Create([FromBody] CreateStudentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var studentNumber = request.StudentNumber.Trim().ToUpperInvariant();
        var exists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentNumber == studentNumber,
            cancellationToken);

        if (exists)
        {
            return Conflict("Student number already exists in this school.");
        }

        var student = new Student
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentNumber = studentNumber,
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Gender = request.Gender.Trim(),
            DateOfBirth = request.DateOfBirth,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Active" : request.Status.Trim()
        };

        dbContext.Students.Add(student);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Student>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Students.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
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
    public async Task<ActionResult<Student>> Update(Guid id, [FromBody] UpdateStudentRequest request, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (student is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(student.TenantId))
        {
            return Forbid();
        }

        var studentNumber = request.StudentNumber.Trim().ToUpperInvariant();
        var duplicate = await dbContext.Students.AnyAsync(
            x => x.Id != id && x.TenantId == student.TenantId && x.SchoolId == student.SchoolId && x.StudentNumber == studentNumber,
            cancellationToken);
        if (duplicate)
        {
            return Conflict("Student number already exists in this school.");
        }

        student.StudentNumber = studentNumber;
        student.FirstName = request.FirstName.Trim();
        student.LastName = request.LastName.Trim();
        student.Gender = request.Gender.Trim();
        student.DateOfBirth = request.DateOfBirth;
        student.Status = string.IsNullOrWhiteSpace(request.Status) ? "Active" : request.Status.Trim();
        student.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(student);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (student is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(student.TenantId))
        {
            return Forbid();
        }

        // Check if student has enrollments
        var hasEnrollments = await dbContext.StudentEnrollments.AnyAsync(x => x.StudentId == id, cancellationToken);
        if (hasEnrollments)
        {
            return BadRequest("Cannot delete student with existing enrollments.");
        }

        dbContext.Students.Remove(student);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateStudentRequest(
    Guid TenantId,
    Guid SchoolId,
    string StudentNumber,
    string FirstName,
    string LastName,
    string Gender,
    DateTime DateOfBirth,
    string? Status);

public sealed record UpdateStudentRequest(
    string StudentNumber,
    string FirstName,
    string LastName,
    string Gender,
    DateTime DateOfBirth,
    string? Status);
