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
[Route("api/sports")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class SportsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Sport>>> GetSports([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.Sports.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<Sport>> CreateSport([FromBody] CreateSportRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.Sports.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("Sport already exists.");

        var entity = new Sport
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim()
        };

        dbContext.Sports.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("houses")]
    public async Task<ActionResult<House>> CreateHouse([FromBody] CreateHouseRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.Houses.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("House already exists.");

        var entity = new House
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            ColorCode = request.ColorCode.Trim()
        };

        dbContext.Houses.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("teams/legacy")]
    public async Task<ActionResult<SportTeam>> CreateTeam([FromBody] CreateSportTeamRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var sportExists = await dbContext.Sports.AsNoTracking().AnyAsync(x =>
            x.Id == request.SportId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!sportExists) return BadRequest("Sport not found.");

        if (request.HouseId.HasValue)
        {
            var houseExists = await dbContext.Houses.AsNoTracking().AnyAsync(x =>
                x.Id == request.HouseId.Value && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                cancellationToken);
            if (!houseExists) return BadRequest("House not found.");
        }

        var entity = new SportTeam
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            SportId = request.SportId,
            Name = request.Name.Trim(),
            HouseId = request.HouseId
        };

        dbContext.SportTeams.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("players")]
    public async Task<ActionResult<SportPlayer>> AddPlayer([FromBody] AddSportPlayerRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var teamExists = await dbContext.SportTeams.AsNoTracking().AnyAsync(x =>
            x.Id == request.SportTeamId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!teamExists || !studentExists) return BadRequest("Invalid team or student.");

        var entity = new SportPlayer
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            SportTeamId = request.SportTeamId,
            StudentId = request.StudentId,
            Position = request.Position.Trim()
        };

        dbContext.SportPlayers.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("fixtures")]
    public async Task<ActionResult<Fixture>> CreateFixture([FromBody] CreateFixtureRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var teamExists = await dbContext.SportTeams.AsNoTracking().AnyAsync(x =>
            x.Id == request.SportTeamId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!teamExists) return BadRequest("Sport team not found.");

        var entity = new Fixture
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            SportTeamId = request.SportTeamId,
            FixtureDateUtc = request.FixtureDateUtc,
            Opponent = request.Opponent.Trim(),
            Venue = request.Venue.Trim()
        };

        dbContext.Fixtures.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("results")]
    public async Task<ActionResult<SportResult>> CreateResult([FromBody] CreateSportResultRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var fixtureExists = await dbContext.Fixtures.AsNoTracking().AnyAsync(x =>
            x.Id == request.FixtureId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!fixtureExists) return BadRequest("Fixture not found.");

        var entity = new SportResult
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            FixtureId = request.FixtureId,
            TeamScore = request.TeamScore,
            OpponentScore = request.OpponentScore,
            Notes = request.Notes.Trim()
        };

        dbContext.SportResults.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }
}

public sealed record CreateSportRequest(Guid TenantId, Guid SchoolId, string Name);
public sealed record CreateHouseRequest(Guid TenantId, Guid SchoolId, string Name, string ColorCode);
public sealed record CreateSportTeamRequest(Guid TenantId, Guid SchoolId, Guid SportId, string Name, Guid? HouseId);
public sealed record AddSportPlayerRequest(Guid TenantId, Guid SchoolId, Guid SportTeamId, Guid StudentId, string Position);
public sealed record CreateFixtureRequest(Guid TenantId, Guid SchoolId, Guid SportTeamId, DateTime FixtureDateUtc, string Opponent, string Venue);
public sealed record CreateSportResultRequest(Guid TenantId, Guid SchoolId, Guid FixtureId, int TeamScore, int OpponentScore, string Notes);
