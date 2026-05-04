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
[Route("api/sports/management")]
[Route("api/sports-management")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class SportsManagementController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Sport>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.Sports.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Sport>> Create([FromBody] CreateManagedSportDto request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var code = request.Code?.Trim().ToUpperInvariant();
        if (!string.IsNullOrWhiteSpace(code))
        {
            var codeExists = await dbContext.Sports.AsNoTracking().AnyAsync(x =>
                x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Code == code && !x.IsDeleted,
                cancellationToken);
            if (codeExists) return Conflict("Sport code already exists.");
        }

        var entity = new Sport
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            SportCategoryId = request.SportCategoryId,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            Code = code,
            TeamSize = request.TeamSize,
            IsTeamSport = request.IsTeamSport,
            EquipmentRequired = request.EquipmentRequired?.Trim(),
            Season = request.Season?.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.Sports.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Sport>> Update(Guid id, [FromBody] UpdateManagedSportDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Sports.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        var code = request.Code?.Trim().ToUpperInvariant();
        if (!string.IsNullOrWhiteSpace(code))
        {
            var duplicate = await dbContext.Sports.AsNoTracking().AnyAsync(x =>
                x.Id != id && x.TenantId == entity.TenantId && x.SchoolId == entity.SchoolId && x.Code == code && !x.IsDeleted,
                cancellationToken);
            if (duplicate) return Conflict("Sport code already exists.");
        }

        entity.SportCategoryId = request.SportCategoryId;
        entity.Name = request.Name.Trim();
        entity.Description = request.Description?.Trim();
        entity.Code = code;
        entity.TeamSize = request.TeamSize;
        entity.IsTeamSport = request.IsTeamSport;
        entity.EquipmentRequired = request.EquipmentRequired?.Trim();
        entity.Season = request.Season?.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Sports.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.IsActive = false;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<SportsDashboardDto>> Dashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var totalSports = await dbContext.Sports.CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);
        var totalTeams = await dbContext.SportTeams.CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);
        var totalPlayers = await dbContext.SportTeamMembers.CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);
        var upcomingEvents = await dbContext.SportEvents.CountAsync(x =>
            x.TenantId == tenantId && x.SchoolId == schoolId && x.EventDate >= DateOnly.FromDateTime(DateTime.UtcNow.Date) && !x.IsDeleted,
            cancellationToken);

        return Ok(new SportsDashboardDto(totalSports, totalTeams, totalPlayers, upcomingEvents));
    }
}

public sealed record CreateManagedSportDto(Guid TenantId, Guid SchoolId, Guid? SportCategoryId, string Name, string? Description, string? Code, int TeamSize, bool IsTeamSport, string? EquipmentRequired, string? Season);
public sealed record UpdateManagedSportDto(Guid? SportCategoryId, string Name, string? Description, string? Code, int TeamSize, bool IsTeamSport, string? EquipmentRequired, string? Season, bool IsActive);
public sealed record SportsDashboardDto(int TotalSports, int TotalTeams, int TotalPlayers, int UpcomingEvents);
