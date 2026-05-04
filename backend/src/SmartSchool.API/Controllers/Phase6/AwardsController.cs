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
using SmartSchool.Domain.Modules.Awards;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/awards")]
[Route("api/rewards")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AwardsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("categories/{id:guid}")]
    public async Task<ActionResult<AwardCategory>> CategoryById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.AwardCategories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<AwardCategory>>> Categories([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();
        var items = await dbContext.AwardCategories.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsActive && !x.IsDeleted)
            .OrderBy(x => x.CategoryType).ThenBy(x => x.Name).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("categories")]
    public async Task<ActionResult<AwardCategory>> CreateCategory([FromBody] CreateAwardCategoryDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        var entity = new AwardCategory
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            CategoryType = request.CategoryType.Trim(),
            AwardType = request.AwardType.Trim(),
            SelectionCriteria = request.SelectionCriteria?.Trim(),
            AwardFrequency = request.AwardFrequency.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        dbContext.AwardCategories.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("categories/{id:guid}")]
    public async Task<ActionResult<AwardCategory>> UpdateCategory(Guid id, [FromBody] UpdateAwardCategoryDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.AwardCategories.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Name = request.Name.Trim();
        entity.Description = request.Description?.Trim();
        entity.CategoryType = request.CategoryType.Trim();
        entity.AwardType = request.AwardType.Trim();
        entity.SelectionCriteria = request.SelectionCriteria?.Trim();
        entity.AwardFrequency = request.AwardFrequency.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("categories/{id:guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.AwardCategories.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Award>> GetAwardById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Awards.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Award>>> GetAwards([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();
        var items = await dbContext.Awards.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsActive && !x.IsDeleted)
            .OrderBy(x => x.Name).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Award>> CreateAward([FromBody] CreateAwardDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        var entity = new Award
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AwardCategoryId = request.AwardCategoryId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            AwardLevel = request.AwardLevel.Trim(),
            Value = request.Value,
            PointsValue = request.PointsValue,
            CertificateTemplate = request.CertificateTemplate?.Trim(),
            PhysicalAward = request.PhysicalAward?.Trim(),
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        dbContext.Awards.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Award>> UpdateAward(Guid id, [FromBody] UpdateAwardDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Awards.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.AwardCategoryId = request.AwardCategoryId;
        entity.Name = request.Name.Trim();
        entity.Description = request.Description?.Trim();
        entity.AwardLevel = request.AwardLevel.Trim();
        entity.Value = request.Value;
        entity.PointsValue = request.PointsValue;
        entity.CertificateTemplate = request.CertificateTemplate?.Trim();
        entity.PhysicalAward = request.PhysicalAward?.Trim();
        entity.AcademicYearId = request.AcademicYearId;
        entity.TermId = request.TermId;
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAward(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Awards.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("student-awards/{id:guid}")]
    public async Task<ActionResult<StudentAward>> StudentAwardById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.StudentAwards.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }


    [HttpGet("student-awards")]
    public async Task<ActionResult<IReadOnlyList<StudentAward>>> StudentAwards([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();
        var items = await dbContext.StudentAwards.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderByDescending(x => x.AwardDate).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("student-awards")]
    public async Task<ActionResult<StudentAward>> CreateStudentAward([FromBody] CreateStudentAwardDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        var entity = new StudentAward
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AwardId = request.AwardId,
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            AwardDate = request.AwardDate,
            CeremonyDate = request.CeremonyDate,
            CeremonyName = request.CeremonyName?.Trim(),
            Reason = request.Reason?.Trim(),
            AchievementDetails = request.AchievementDetails?.Trim(),
            Ranking = request.Ranking?.Trim(),
            CertificateNumber = request.CertificateNumber?.Trim(),
            IssuedByStaffId = request.IssuedByStaffId,
            PresentedByStaffId = request.PresentedByStaffId,
            CertificateIssued = request.CertificateIssued,
            PhysicalAwardIssued = request.PhysicalAwardIssued,
            PointsAwarded = request.PointsAwarded,
            Status = "Awarded",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        dbContext.StudentAwards.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("student-awards/{id:guid}")]
    public async Task<ActionResult<StudentAward>> UpdateStudentAward(Guid id, [FromBody] UpdateStudentAwardDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.StudentAwards.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.AwardDate = request.AwardDate;
        entity.CeremonyDate = request.CeremonyDate;
        entity.CeremonyName = request.CeremonyName?.Trim();
        entity.Reason = request.Reason?.Trim();
        entity.AchievementDetails = request.AchievementDetails?.Trim();
        entity.Ranking = request.Ranking?.Trim();
        entity.CertificateNumber = request.CertificateNumber?.Trim();
        entity.IssuedByStaffId = request.IssuedByStaffId;
        entity.PresentedByStaffId = request.PresentedByStaffId;
        entity.CertificateIssued = request.CertificateIssued;
        entity.PhysicalAwardIssued = request.PhysicalAwardIssued;
        entity.PointsAwarded = request.PointsAwarded;
        entity.Status = request.Status.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("student-awards/{id:guid}")]
    public async Task<IActionResult> DeleteStudentAward(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.StudentAwards.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateAwardCategoryDto(Guid TenantId, Guid SchoolId, string Name, string? Description, string CategoryType, string AwardType, string? SelectionCriteria, string AwardFrequency);
public sealed record UpdateAwardCategoryDto(string Name, string? Description, string CategoryType, string AwardType, string? SelectionCriteria, string AwardFrequency, bool IsActive);
public sealed record CreateAwardDto(Guid TenantId, Guid SchoolId, Guid AwardCategoryId, string Name, string? Description, string AwardLevel, decimal Value, int PointsValue, string? CertificateTemplate, string? PhysicalAward, Guid AcademicYearId, Guid? TermId);
public sealed record UpdateAwardDto(Guid AwardCategoryId, string Name, string? Description, string AwardLevel, decimal Value, int PointsValue, string? CertificateTemplate, string? PhysicalAward, Guid AcademicYearId, Guid? TermId, bool IsActive);
public sealed record CreateStudentAwardDto(Guid TenantId, Guid SchoolId, Guid AwardId, Guid StudentId, Guid AcademicYearId, Guid? TermId, DateOnly AwardDate, DateOnly? CeremonyDate, string? CeremonyName, string? Reason, string? AchievementDetails, string? Ranking, string? CertificateNumber, Guid? IssuedByStaffId, Guid? PresentedByStaffId, bool CertificateIssued, bool PhysicalAwardIssued, int PointsAwarded);
public sealed record UpdateStudentAwardDto(DateOnly AwardDate, DateOnly? CeremonyDate, string? CeremonyName, string? Reason, string? AchievementDetails, string? Ranking, string? CertificateNumber, Guid? IssuedByStaffId, Guid? PresentedByStaffId, bool CertificateIssued, bool PhysicalAwardIssued, int PointsAwarded, string Status);
