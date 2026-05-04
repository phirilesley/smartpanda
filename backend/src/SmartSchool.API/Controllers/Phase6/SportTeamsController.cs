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
using SmartSchool.Domain.Modules.Sports;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/sports/teams")]
[Route("api/sport-teams")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class SportTeamsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SportTeam>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? sportId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.SportTeams.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);

        if (sportId.HasValue) query = query.Where(x => x.SportId == sportId.Value);

        var items = await query.OrderBy(x => x.Name).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<SportTeam>> Create([FromBody] CreateManagedSportTeamDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var sportExists = await dbContext.Sports.AsNoTracking().AnyAsync(x =>
            x.Id == request.SportId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!sportExists) return BadRequest("Sport not found.");

        var entity = new SportTeam
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            SportId = request.SportId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            TeamType = request.TeamType?.Trim() ?? "General",
            GradeId = request.GradeId,
            AcademicYearId = request.AcademicYearId,
            CoachStaffId = request.CoachStaffId,
            AssistantCoachStaffId = request.AssistantCoachStaffId,
            MaxMembers = request.MaxMembers,
            CurrentMembers = 0,
            PracticeSchedule = request.PracticeSchedule?.Trim(),
            HomeVenue = request.HomeVenue?.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.SportTeams.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SportTeam>> Update(Guid id, [FromBody] UpdateManagedSportTeamDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.SportTeams.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.SportId = request.SportId;
        entity.Name = request.Name.Trim();
        entity.Description = request.Description?.Trim();
        entity.TeamType = request.TeamType.Trim();
        entity.GradeId = request.GradeId;
        entity.AcademicYearId = request.AcademicYearId;
        entity.CoachStaffId = request.CoachStaffId;
        entity.AssistantCoachStaffId = request.AssistantCoachStaffId;
        entity.MaxMembers = request.MaxMembers;
        entity.PracticeSchedule = request.PracticeSchedule?.Trim();
        entity.HomeVenue = request.HomeVenue?.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.SportTeams.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("{teamId:guid}/members")]
    public async Task<ActionResult<IReadOnlyList<SportTeamMember>>> Members(Guid teamId, CancellationToken cancellationToken)
    {
        var team = await dbContext.SportTeams.AsNoTracking().FirstOrDefaultAsync(x => x.Id == teamId && !x.IsDeleted, cancellationToken);
        if (team is null) return NotFound();
        if (!User.CanAccessTenant(team.TenantId)) return Forbid();

        var members = await dbContext.SportTeamMembers.AsNoTracking()
            .Where(x => x.SportTeamId == teamId && !x.IsDeleted)
            .OrderBy(x => x.JoinDate)
            .ToListAsync(cancellationToken);
        return Ok(members);
    }

    [HttpPost("{teamId:guid}/members")]
    public async Task<ActionResult<SportTeamMember>> AddMember(Guid teamId, [FromBody] AddManagedSportTeamMemberDto request, CancellationToken cancellationToken)
    {
        var team = await dbContext.SportTeams.FirstOrDefaultAsync(x => x.Id == teamId && !x.IsDeleted, cancellationToken);
        if (team is null) return NotFound();
        if (!User.CanAccessTenant(team.TenantId)) return Forbid();

        var exists = await dbContext.SportTeamMembers.AsNoTracking().AnyAsync(x =>
            x.SportTeamId == teamId && x.StudentId == request.StudentId && !x.IsDeleted, cancellationToken);
        if (exists) return Conflict("Student already in team.");

        var member = new SportTeamMember
        {
            Id = Guid.NewGuid(),
            TenantId = team.TenantId,
            SchoolId = team.SchoolId,
            SportTeamId = teamId,
            StudentId = request.StudentId,
            Position = request.Position?.Trim(),
            JerseyNumber = request.JerseyNumber,
            JoinDate = request.JoinDate,
            Status = request.Status?.Trim() ?? "Active",
            Captain = request.Captain,
            ViceCaptain = request.ViceCaptain,
            PerformanceRating = request.PerformanceRating,
            Notes = request.Notes?.Trim(),
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.SportTeamMembers.Add(member);
        team.CurrentMembers = await dbContext.SportTeamMembers.CountAsync(x => x.SportTeamId == teamId && !x.IsDeleted, cancellationToken) + 1;
        team.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(member);
    }
}

public sealed record CreateManagedSportTeamDto(Guid TenantId, Guid SchoolId, Guid SportId, string Name, string? Description, string? TeamType, Guid? GradeId, Guid? AcademicYearId, Guid? CoachStaffId, Guid? AssistantCoachStaffId, int MaxMembers, string? PracticeSchedule, string? HomeVenue);
public sealed record UpdateManagedSportTeamDto(Guid SportId, string Name, string? Description, string TeamType, Guid? GradeId, Guid? AcademicYearId, Guid? CoachStaffId, Guid? AssistantCoachStaffId, int MaxMembers, string? PracticeSchedule, string? HomeVenue, bool IsActive);
public sealed record AddManagedSportTeamMemberDto(Guid StudentId, string? Position, int? JerseyNumber, DateOnly JoinDate, string? Status, bool Captain, bool ViceCaptain, decimal? PerformanceRating, string? Notes);
