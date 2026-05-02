using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Events;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/events")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class EventsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = PolicyNames.EventsView)]
    public async Task<ActionResult<IReadOnlyList<SchoolEvent>>> GetEvents(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] Guid academicYearId,
        [FromQuery] Guid termId,
        CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.SchoolEvents.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);

        if (academicYearId != Guid.Empty) query = query.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) query = query.Where(x => x.TermId == termId);

        var items = await query.OrderBy(x => x.StartAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    [Authorize(Policy = PolicyNames.EventsManage)]
    public async Task<ActionResult<SchoolEvent>> CreateEvent([FromBody] CreateSchoolEventRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        // Enhanced venue conflict check
        var hasVenueConflict = await dbContext.SchoolEvents.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            !x.IsDeleted &&
            x.Venue == request.Venue.Trim() &&
            x.StartAtUtc < request.EndAtUtc &&
            request.StartAtUtc < x.EndAtUtc,
            cancellationToken);
        if (hasVenueConflict) return Conflict("Venue conflict detected for the selected time range.");

        // Check organizer availability (prevent double-booking)
        if (request.OrganizerStaffId.HasValue)
        {
            var organizerConflict = await dbContext.SchoolEvents.AsNoTracking().AnyAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                !x.IsDeleted &&
                x.OrganizerStaffId == request.OrganizerStaffId.Value &&
                x.StartAtUtc < request.EndAtUtc &&
                request.StartAtUtc < x.EndAtUtc,
                cancellationToken);
            if (organizerConflict) return Conflict("Organizer is already booked for another event during this time.");
        }

        var entity = new SchoolEvent
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            StartAtUtc = request.StartAtUtc,
            EndAtUtc = request.EndAtUtc,
            Venue = request.Venue.Trim(),
            MaxParticipants = request.MaxParticipants,
            OrganizerStaffId = request.OrganizerStaffId,
            Status = request.Status.Trim()
        };

        dbContext.SchoolEvents.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{eventId:guid}")]
    public async Task<ActionResult<SchoolEvent>> UpdateEvent(Guid eventId, [FromBody] UpdateSchoolEventRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.SchoolEvents.FirstOrDefaultAsync(x => x.Id == eventId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        var hasVenueConflict = await dbContext.SchoolEvents.AsNoTracking().AnyAsync(x =>
            x.Id != eventId &&
            x.TenantId == entity.TenantId &&
            x.SchoolId == entity.SchoolId &&
            !x.IsDeleted &&
            x.Venue == request.Venue.Trim() &&
            x.StartAtUtc < request.EndAtUtc &&
            request.StartAtUtc < x.EndAtUtc,
            cancellationToken);
        if (hasVenueConflict) return Conflict("Venue conflict detected for the selected time range.");

        entity.Title = request.Title.Trim();
        entity.Description = request.Description.Trim();
        entity.StartAtUtc = request.StartAtUtc;
        entity.EndAtUtc = request.EndAtUtc;
        entity.Venue = request.Venue.Trim();
        entity.MaxParticipants = request.MaxParticipants;
        entity.OrganizerStaffId = request.OrganizerStaffId;
        entity.Status = request.Status.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{eventId:guid}")]
    [Authorize(Policy = PolicyNames.EventsManage)]
    public async Task<IActionResult> DeleteEvent(Guid eventId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.SchoolEvents.FirstOrDefaultAsync(x => x.Id == eventId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("{eventId:guid}/participants")]
    [Authorize(Policy = PolicyNames.EventsView)]
    public async Task<ActionResult<IReadOnlyList<EventParticipant>>> GetParticipants(Guid eventId, [FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.EventParticipants.AsNoTracking()
            .Where(x => x.SchoolEventId == eventId && x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderBy(x => x.ParticipantType)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("{eventId:guid}/participants")]
    [Authorize(Policy = PolicyNames.EventsCoordinate)]
    public async Task<ActionResult<EventRegistrationResult>> RegisterParticipants(Guid eventId, [FromBody] RegisterEventParticipantsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var @event = await dbContext.SchoolEvents.FirstOrDefaultAsync(x => x.Id == eventId && !x.IsDeleted, cancellationToken);
        if (@event is null) return NotFound();
        if (!User.CanAccessTenant(@event.TenantId)) return Forbid();

        var currentCount = await dbContext.EventParticipants.AsNoTracking()
            .CountAsync(x => x.SchoolEventId == eventId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted, cancellationToken);

        var capacityCheck = currentCount + request.Participants.Count;
        if (@event.MaxParticipants.HasValue && capacityCheck > @event.MaxParticipants.Value)
            return BadRequest($"Event capacity exceeded. Current: {currentCount}, Requested: {request.Participants.Count}, Max: {@event.MaxParticipants}");

        var registeredCount = 0;
        var skippedCount = 0;

        foreach (var participant in request.Participants)
        {
            var exists = await dbContext.EventParticipants.AsNoTracking()
                .AnyAsync(x => x.SchoolEventId == eventId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
                              ((participant.StudentId.HasValue && x.StudentId == participant.StudentId.Value) ||
                               (participant.GuardianId.HasValue && x.GuardianId == participant.GuardianId.Value) ||
                               (participant.StaffId.HasValue && x.StaffId == participant.StaffId.Value)) && !x.IsDeleted, cancellationToken);

            if (exists)
            {
                skippedCount++;
                continue;
            }

            var entity = new EventParticipant
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                SchoolEventId = eventId,
                StudentId = participant.StudentId,
                GuardianId = participant.GuardianId,
                StaffId = participant.StaffId,
                ParticipantType = participant.ParticipantType.Trim(),
                AttendanceStatus = "Registered"
            };

            dbContext.EventParticipants.Add(entity);
            registeredCount++;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new EventRegistrationResult(registeredCount, skippedCount));
    }

    [HttpPost("{eventId:guid}/participants/register")]
    [Authorize(Policy = PolicyNames.EventsCoordinate)]
    public async Task<ActionResult<EventRegistrationResult>> RegisterEventParticipants(Guid eventId, [FromBody] RegisterEventParticipantsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var @event = await dbContext.SchoolEvents.FirstOrDefaultAsync(x => x.Id == eventId && !x.IsDeleted, cancellationToken);
        if (@event is null) return NotFound();
        if (!User.CanAccessTenant(@event.TenantId)) return Forbid();

        var registered = 0;
        var skipped = 0;
        foreach (var participant in request.Participants)
        {
            var exists = await dbContext.EventParticipants.AsNoTracking().AnyAsync(x =>
                x.SchoolEventId == eventId &&
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                !x.IsDeleted &&
                x.StudentId == participant.StudentId &&
                x.GuardianId == participant.GuardianId &&
                x.StaffId == participant.StaffId,
                cancellationToken);
            if (exists)
            {
                skipped++;
                continue;
            }

            if (@event.MaxParticipants.HasValue)
            {
                var activeParticipants = await dbContext.EventParticipants.AsNoTracking()
                    .CountAsync(x => x.SchoolEventId == eventId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted, cancellationToken);
                if (activeParticipants >= @event.MaxParticipants.Value)
                {
                    skipped++;
                    continue;
                }
            }

            dbContext.EventParticipants.Add(new EventParticipant
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                SchoolEventId = eventId,
                StudentId = participant.StudentId,
                GuardianId = participant.GuardianId,
                StaffId = participant.StaffId,
                ParticipantType = participant.ParticipantType.Trim(),
                AttendanceStatus = "Registered"
            });
            registered++;
        }

        if (registered > 0) await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(new EventRegistrationResult(registered, skipped));
    }

    [HttpPut("participants/{participantId:guid}/attendance")]
    public async Task<ActionResult<EventParticipant>> UpdateParticipantAttendance(
        Guid participantId,
        [FromBody] UpdateEventParticipantAttendanceRequest request,
        CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.EventParticipants.FirstOrDefaultAsync(x => x.Id == participantId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.AttendanceStatus = request.AttendanceStatus.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("participants/{participantId:guid}")]
    public async Task<IActionResult> RemoveParticipant(Guid participantId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.EventParticipants.FirstOrDefaultAsync(x => x.Id == participantId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("analytics")]
    [Authorize(Policy = PolicyNames.EventsView)]
    public async Task<ActionResult<EventAnalyticsResponse>> GetEventAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? academicYearId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.SchoolEvents.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (academicYearId.HasValue) query = query.Where(x => x.AcademicYearId == academicYearId.Value);

        var totalEvents = await query.CountAsync(cancellationToken);
        var upcomingEvents = await query.CountAsync(x => x.StartAtUtc > DateTime.UtcNow, cancellationToken);
        var pastEvents = await query.CountAsync(x => x.EndAtUtc < DateTime.UtcNow, cancellationToken);

        // Participation statistics
        var participationData = await dbContext.EventParticipants.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .Join(dbContext.SchoolEvents.AsNoTracking().Where(e => e.TenantId == tenantId && e.SchoolId == schoolId && !e.IsDeleted),
                participant => participant.SchoolEventId,
                @event => @event.Id,
                (participant, @event) => new { participant, @event })
            .Where(x => !academicYearId.HasValue || x.@event.AcademicYearId == academicYearId.Value)
            .GroupBy(x => x.@event.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var attendanceStats = await dbContext.EventParticipants.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .GroupBy(x => x.AttendanceStatus)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        return Ok(new EventAnalyticsResponse(
            TotalEvents: totalEvents,
            UpcomingEvents: upcomingEvents,
            PastEvents: pastEvents,
            ParticipationByStatus: participationData.ToDictionary(x => x.Status, x => x.Count),
            AttendanceByStatus: attendanceStats.ToDictionary(x => x.Status, x => x.Count)
        ));
    }
}

public sealed record CreateSchoolEventRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid? AcademicYearId,
    Guid? TermId,
    string Title,
    string Description,
    DateTime StartAtUtc,
    DateTime EndAtUtc,
    string Venue,
    int? MaxParticipants,
    Guid? OrganizerStaffId,
    string Status);

public sealed record UpdateSchoolEventRequest(
    Guid TenantId,
    string Title,
    string Description,
    DateTime StartAtUtc,
    DateTime EndAtUtc,
    string Venue,
    int? MaxParticipants,
    Guid? OrganizerStaffId,
    string Status);

public sealed record AddEventParticipantRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid? StudentId,
    Guid? GuardianId,
    Guid? StaffId,
    string ParticipantType,
    string AttendanceStatus);

public sealed record UpdateEventParticipantAttendanceRequest(Guid TenantId, string AttendanceStatus);
public sealed record EventParticipantRegistration(Guid? StudentId, Guid? GuardianId, Guid? StaffId, string ParticipantType);
public sealed record RegisterEventParticipantsRequest(Guid TenantId, Guid SchoolId, List<EventParticipantRegistration> Participants);
public sealed record EventRegistrationResult(int RegisteredCount, int SkippedCount);
public sealed record EventAnalyticsResponse(int TotalEvents, int UpcomingEvents, int PastEvents, Dictionary<string, int> ParticipationByStatus, Dictionary<string, int> AttendanceByStatus);
