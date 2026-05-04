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
using SmartSchool.Domain.Modules.Clubs;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/clubs/management")]
[Route("api/club-management")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ClubManagementController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Club>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Clubs.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Club>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.Clubs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsActive && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Club>> Create([FromBody] CreateClubDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        var code = request.Code.Trim().ToUpperInvariant();

        var exists = await dbContext.Clubs.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Code == code && !x.IsDeleted,
            cancellationToken);
        if (exists) return Conflict("Club code already exists.");

        var entity = new Club
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ClubCategoryId = request.ClubCategoryId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            Code = code,
            MissionStatement = request.MissionStatement?.Trim(),
            Objectives = request.Objectives?.Trim(),
            MeetingSchedule = request.MeetingSchedule?.Trim(),
            MeetingLocation = request.MeetingLocation?.Trim(),
            MaxMembers = request.MaxMembers,
            CurrentMembers = 0,
            MembershipFee = request.MembershipFee,
            AcademicYearId = request.AcademicYearId,
            AdvisorStaffId = request.AdvisorStaffId,
            CoAdvisorStaffId = request.CoAdvisorStaffId,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.Clubs.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Club>> Update(Guid id, [FromBody] UpdateClubDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Clubs.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        var code = request.Code.Trim().ToUpperInvariant();
        var duplicate = await dbContext.Clubs.AsNoTracking().AnyAsync(x =>
            x.Id != id && x.TenantId == entity.TenantId && x.SchoolId == entity.SchoolId && x.Code == code && !x.IsDeleted,
            cancellationToken);
        if (duplicate) return Conflict("Club code already exists.");

        entity.ClubCategoryId = request.ClubCategoryId;
        entity.Name = request.Name.Trim();
        entity.Description = request.Description?.Trim();
        entity.Code = code;
        entity.MissionStatement = request.MissionStatement?.Trim();
        entity.Objectives = request.Objectives?.Trim();
        entity.MeetingSchedule = request.MeetingSchedule?.Trim();
        entity.MeetingLocation = request.MeetingLocation?.Trim();
        entity.MaxMembers = request.MaxMembers;
        entity.MembershipFee = request.MembershipFee;
        entity.AcademicYearId = request.AcademicYearId;
        entity.AdvisorStaffId = request.AdvisorStaffId;
        entity.CoAdvisorStaffId = request.CoAdvisorStaffId;
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Clubs.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("{clubId:guid}/members")]
    public async Task<ActionResult<IReadOnlyList<ClubMember>>> Members(Guid clubId, CancellationToken cancellationToken)
    {
        var club = await dbContext.Clubs.AsNoTracking().FirstOrDefaultAsync(x => x.Id == clubId && !x.IsDeleted, cancellationToken);
        if (club is null) return NotFound();
        if (!User.CanAccessTenant(club.TenantId)) return Forbid();

        var items = await dbContext.ClubMembers.AsNoTracking()
            .Where(x => x.ClubId == clubId && !x.IsDeleted)
            .OrderBy(x => x.MemberType)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("{clubId:guid}/members")]
    public async Task<ActionResult<ClubMember>> AddMember(Guid clubId, [FromBody] AddClubMemberDto request, CancellationToken cancellationToken)
    {
        var club = await dbContext.Clubs.FirstOrDefaultAsync(x => x.Id == clubId && !x.IsDeleted, cancellationToken);
        if (club is null) return NotFound();
        if (!User.CanAccessTenant(club.TenantId)) return Forbid();

        var exists = await dbContext.ClubMembers.AsNoTracking().AnyAsync(x => x.ClubId == clubId && x.StudentId == request.StudentId && !x.IsDeleted, cancellationToken);
        if (exists) return Conflict("Student already a club member.");

        var member = new ClubMember
        {
            Id = Guid.NewGuid(),
            TenantId = club.TenantId,
            SchoolId = club.SchoolId,
            ClubId = clubId,
            StudentId = request.StudentId,
            MemberType = request.MemberType.Trim(),
            Position = request.Position?.Trim(),
            JoinDate = request.JoinDate,
            Status = request.Status?.Trim() ?? "Active",
            MembershipFeePaid = request.MembershipFeePaid,
            MembershipFeeAmount = request.MembershipFeeAmount,
            Contribution = request.Contribution?.Trim(),
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.ClubMembers.Add(member);
        club.CurrentMembers = await dbContext.ClubMembers.CountAsync(x => x.ClubId == clubId && !x.IsDeleted, cancellationToken) + 1;
        club.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(member);
    }

    [HttpPut("{clubId:guid}/members/{memberId:guid}")]
    public async Task<ActionResult<ClubMember>> UpdateMember(Guid clubId, Guid memberId, [FromBody] UpdateClubMemberDto request, CancellationToken cancellationToken)
    {
        var member = await dbContext.ClubMembers.FirstOrDefaultAsync(x => x.Id == memberId && x.ClubId == clubId && !x.IsDeleted, cancellationToken);
        if (member is null) return NotFound();
        if (!User.CanAccessTenant(member.TenantId)) return Forbid();

        member.MemberType = request.MemberType.Trim();
        member.Position = request.Position?.Trim();
        member.JoinDate = request.JoinDate;
        member.Status = request.Status.Trim();
        member.MembershipFeePaid = request.MembershipFeePaid;
        member.MembershipFeeAmount = request.MembershipFeeAmount;
        member.Contribution = request.Contribution?.Trim();
        member.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(member);
    }

    [HttpDelete("{clubId:guid}/members/{memberId:guid}")]
    public async Task<IActionResult> DeleteMember(Guid clubId, Guid memberId, CancellationToken cancellationToken)
    {
        var member = await dbContext.ClubMembers.FirstOrDefaultAsync(x => x.Id == memberId && x.ClubId == clubId && !x.IsDeleted, cancellationToken);
        if (member is null) return NotFound();
        if (!User.CanAccessTenant(member.TenantId)) return Forbid();

        member.IsDeleted = true;
        member.DeletedAtUtc = DateTime.UtcNow;
        member.UpdatedAtUtc = DateTime.UtcNow;

        var club = await dbContext.Clubs.FirstOrDefaultAsync(x => x.Id == clubId && !x.IsDeleted, cancellationToken);
        if (club is not null)
        {
            club.CurrentMembers = Math.Max(0, await dbContext.ClubMembers.CountAsync(x => x.ClubId == clubId && !x.IsDeleted, cancellationToken) - 1);
            club.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateClubDto(Guid TenantId, Guid SchoolId, Guid ClubCategoryId, string Name, string? Description, string Code, string? MissionStatement, string? Objectives, string? MeetingSchedule, string? MeetingLocation, int MaxMembers, decimal MembershipFee, Guid AcademicYearId, Guid? AdvisorStaffId, Guid? CoAdvisorStaffId);
public sealed record UpdateClubDto(Guid ClubCategoryId, string Name, string? Description, string Code, string? MissionStatement, string? Objectives, string? MeetingSchedule, string? MeetingLocation, int MaxMembers, decimal MembershipFee, Guid AcademicYearId, Guid? AdvisorStaffId, Guid? CoAdvisorStaffId, bool IsActive);
public sealed record AddClubMemberDto(Guid StudentId, string MemberType, string? Position, DateOnly JoinDate, string? Status, bool MembershipFeePaid, decimal MembershipFeeAmount, string? Contribution);
public sealed record UpdateClubMemberDto(string MemberType, string? Position, DateOnly JoinDate, string Status, bool MembershipFeePaid, decimal MembershipFeeAmount, string? Contribution);
