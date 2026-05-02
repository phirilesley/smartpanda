using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/students/links")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentGuardiansController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("{studentId:guid}")]
    public async Task<ActionResult<IReadOnlyList<StudentGuardian>>> GetByStudent(Guid studentId, CancellationToken cancellationToken)
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

        var items = await dbContext.StudentGuardians.AsNoTracking()
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.IsPrimaryContact)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<StudentGuardian>> Link([FromBody] LinkStudentGuardianRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!studentExists)
        {
            return BadRequest("Student does not exist for tenant/school.");
        }

        var guardianExists = await dbContext.Guardians.AsNoTracking().AnyAsync(x =>
            x.Id == request.GuardianId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (!guardianExists)
        {
            return BadRequest("Guardian does not exist for tenant/school.");
        }

        var exists = await dbContext.StudentGuardians.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == request.StudentId && x.GuardianId == request.GuardianId,
            cancellationToken);

        if (exists)
        {
            return Conflict("Student-guardian link already exists.");
        }

        if (request.IsPrimaryContact)
        {
            var existingPrimary = await dbContext.StudentGuardians
                .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == request.StudentId && x.IsPrimaryContact)
                .ToListAsync(cancellationToken);
            foreach (var item in existingPrimary)
            {
                item.IsPrimaryContact = false;
                item.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        var link = new StudentGuardian
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            IsPrimaryContact = request.IsPrimaryContact
        };

        dbContext.StudentGuardians.Add(link);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(link);
    }
}

public sealed record LinkStudentGuardianRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid GuardianId, bool IsPrimaryContact);

