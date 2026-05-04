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
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/students/links")]
[Route("api/student-guardians")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentGuardiansController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<StudentGuardian>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? studentId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var query = dbContext.StudentGuardians.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId.HasValue && studentId.Value != Guid.Empty)
        {
            query = query.Where(x => x.StudentId == studentId.Value);
        }

        var items = await query.OrderByDescending(x => x.IsPrimaryContact).ToListAsync(cancellationToken);
        return Ok(items);
    }

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

        if (request.ResolveIsPrimary())
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
            IsPrimaryContact = request.ResolveIsPrimary()
        };

        dbContext.StudentGuardians.Add(link);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(link);
    }
}

public sealed class LinkStudentGuardianRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid StudentId { get; set; }
    public Guid GuardianId { get; set; }
    public bool? IsPrimaryContact { get; set; }
    public bool? IsPrimary { get; set; }

    public bool ResolveIsPrimary() => IsPrimaryContact ?? IsPrimary ?? false;
}

