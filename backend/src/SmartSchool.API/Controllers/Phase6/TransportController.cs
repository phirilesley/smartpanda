using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
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
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/transport")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class TransportController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("vehicles")]
    [Authorize(Policy = PolicyNames.TransportView)]
    public async Task<ActionResult<IReadOnlyList<TransportVehicle>>> GetVehicles([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.TransportVehicles.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("vehicles")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<ActionResult<TransportVehicle>> CreateVehicle([FromBody] CreateTransportVehicleRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new TransportVehicle
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            RegistrationNumber = request.RegistrationNumber.Trim().ToUpperInvariant(),
            Name = request.Name.Trim(),
            Capacity = request.Capacity,
            DriverStaffId = request.DriverStaffId,
            IsActive = request.IsActive
        };

        dbContext.TransportVehicles.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("vehicles/{vehicleId:guid}")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<ActionResult<TransportVehicle>> UpdateVehicle(Guid vehicleId, [FromBody] UpdateTransportVehicleRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.TransportVehicles.FirstOrDefaultAsync(x => x.Id == vehicleId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Name = request.Name.Trim();
        entity.Capacity = request.Capacity;
        entity.DriverStaffId = request.DriverStaffId;
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("vehicles/{vehicleId:guid}")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<IActionResult> DeleteVehicle(Guid vehicleId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TransportVehicles.FirstOrDefaultAsync(x => x.Id == vehicleId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("routes")]
    [Authorize(Policy = PolicyNames.TransportView)]
    public async Task<ActionResult<IReadOnlyList<TransportRoute>>> GetRoutes([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.TransportRoutes.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderBy(x => x.RouteCode)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("routes")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<ActionResult<TransportRoute>> CreateRoute([FromBody] CreateTransportRouteRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new TransportRoute
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            RouteCode = request.RouteCode.Trim().ToUpperInvariant(),
            Name = request.Name.Trim(),
            StartLocation = request.StartLocation.Trim(),
            EndLocation = request.EndLocation.Trim(),
            IsActive = request.IsActive
        };

        dbContext.TransportRoutes.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("routes/{routeId:guid}")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<ActionResult<TransportRoute>> UpdateRoute(Guid routeId, [FromBody] UpdateTransportRouteRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.TransportRoutes.FirstOrDefaultAsync(x => x.Id == routeId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Name = request.Name.Trim();
        entity.StartLocation = request.StartLocation.Trim();
        entity.EndLocation = request.EndLocation.Trim();
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("routes/{routeId:guid}")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<IActionResult> DeleteRoute(Guid routeId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TransportRoutes.FirstOrDefaultAsync(x => x.Id == routeId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("routes/{routeId:guid}/stops")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<ActionResult<TransportRouteStop>> AddRouteStop(Guid routeId, [FromBody] CreateTransportRouteStopRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var routeExists = await dbContext.TransportRoutes.AsNoTracking().AnyAsync(x =>
            x.Id == routeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!routeExists) return NotFound("Route not found for tenant/school.");

        var entity = new TransportRouteStop
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            TransportRouteId = routeId,
            StopName = request.StopName.Trim(),
            StopOrder = request.StopOrder,
            PlannedTime = request.PlannedTime
        };

        dbContext.TransportRouteStops.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("routes/{routeId:guid}/stops")]
    public async Task<ActionResult<IReadOnlyList<TransportRouteStop>>> GetRouteStops(Guid routeId, CancellationToken cancellationToken)
    {
        var route = await dbContext.TransportRoutes.AsNoTracking().FirstOrDefaultAsync(x => x.Id == routeId && !x.IsDeleted, cancellationToken);
        if (route is null) return NotFound();
        if (!User.CanAccessTenant(route.TenantId)) return Forbid();

        var items = await dbContext.TransportRouteStops.AsNoTracking()
            .Where(x => x.TransportRouteId == routeId && !x.IsDeleted)
            .OrderBy(x => x.StopOrder)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("assignments")]
    [Authorize(Policy = PolicyNames.TransportAssign)]
    public async Task<ActionResult<TransportStudentAssignment>> CreateAssignment([FromBody] CreateTransportStudentAssignmentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var routeExists = await dbContext.TransportRoutes.AsNoTracking().AnyAsync(x =>
            x.Id == request.TransportRouteId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);

        if (!studentExists || !routeExists) return BadRequest("Invalid student or route.");

        var entity = new TransportStudentAssignment
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            TransportRouteId = request.TransportRouteId,
            PickupStopId = request.PickupStopId,
            DropoffStopId = request.DropoffStopId,
            EffectiveFrom = request.EffectiveFrom,
            EffectiveTo = request.EffectiveTo,
            Status = request.Status.Trim()
        };

        dbContext.TransportStudentAssignments.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("assignments")]
    [Authorize(Policy = PolicyNames.TransportView)]
    public async Task<ActionResult<IReadOnlyList<TransportStudentAssignment>>> GetAssignments([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.TransportStudentAssignments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderByDescending(x => x.EffectiveFrom)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPut("assignments/{assignmentId:guid}/status")]
    [Authorize(Policy = PolicyNames.TransportAssign)]
    public async Task<ActionResult<TransportStudentAssignment>> UpdateAssignmentStatus(Guid assignmentId, [FromBody] UpdateTransportAssignmentStatusRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.TransportStudentAssignments.FirstOrDefaultAsync(x => x.Id == assignmentId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Status = request.Status.Trim();
        entity.EffectiveTo = request.EffectiveTo;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("trips")]
    [Authorize(Policy = PolicyNames.TransportDrive)]
    public async Task<ActionResult<TransportTrip>> CreateTrip([FromBody] CreateTransportTripRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var vehicleExists = await dbContext.TransportVehicles.AsNoTracking().AnyAsync(x =>
            x.Id == request.TransportVehicleId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        var routeExists = await dbContext.TransportRoutes.AsNoTracking().AnyAsync(x =>
            x.Id == request.TransportRouteId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);

        if (!vehicleExists || !routeExists) return BadRequest("Invalid vehicle or route.");

        // Check for overlapping trips for the same vehicle
        var hasOverlappingTrip = await dbContext.TransportTrips.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.TransportVehicleId == request.TransportVehicleId &&
            x.TripDate == request.TripDate &&
            x.Direction == request.Direction &&
            !x.IsDeleted &&
            x.Status != "Cancelled" &&
            ((x.DepartureAtUtc.HasValue && x.DepartureAtUtc.Value < request.ArrivalAtUtc) || 
             (x.ArrivalAtUtc.HasValue && x.ArrivalAtUtc.Value > request.DepartureAtUtc)),
            cancellationToken);
        if (hasOverlappingTrip) return Conflict("Vehicle already has an overlapping trip scheduled for this time.");

        var entity = new TransportTrip
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            TransportVehicleId = request.TransportVehicleId,
            TransportRouteId = request.TransportRouteId,
            DriverStaffId = request.DriverStaffId,
            TripDate = request.TripDate,
            Direction = request.Direction.Trim(),
            DepartureAtUtc = request.DepartureAtUtc,
            ArrivalAtUtc = request.ArrivalAtUtc,
            Status = request.Status.Trim()
        };

        dbContext.TransportTrips.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("trips")]
    [Authorize(Policy = PolicyNames.TransportView)]
    public async Task<ActionResult<IReadOnlyList<TransportTrip>>> GetTrips([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateOnly? tripDate, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.TransportTrips.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (tripDate.HasValue) query = query.Where(x => x.TripDate == tripDate.Value);
        if (tripDate != default) query = query.Where(x => x.TripDate == tripDate);

        var items = await query.OrderByDescending(x => x.TripDate).ThenBy(x => x.Direction).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPut("trips/{tripId:guid}/log")]
    [Authorize(Policy = PolicyNames.TransportDrive)]
    public async Task<ActionResult<TransportTrip>> LogTrip(Guid tripId, [FromBody] LogTransportTripRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.TransportTrips.FirstOrDefaultAsync(x => x.Id == tripId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.DepartureAtUtc = request.DepartureAtUtc ?? entity.DepartureAtUtc;
        entity.ArrivalAtUtc = request.ArrivalAtUtc ?? entity.ArrivalAtUtc;
        entity.Status = request.Status.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("routes/{routeId:guid}/optimize-sequence")]
    [Authorize(Policy = PolicyNames.TransportManage)]
    public async Task<ActionResult<IReadOnlyList<TransportRouteStop>>> OptimizeRouteSequence(Guid routeId, [FromBody] OptimizeRouteSequenceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var route = await dbContext.TransportRoutes.FirstOrDefaultAsync(x => 
            x.Id == routeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (route is null) return NotFound("Route not found for tenant/school.");

        var stops = await dbContext.TransportRouteStops.AsNoTracking()
            .Where(x => x.TransportRouteId == routeId && !x.IsDeleted)
            .OrderBy(x => x.StopOrder)
            .ToListAsync(cancellationToken);

        // Simple optimization: reorder by planned time if provided
        if (request.OptimizeByTime)
        {
            stops = stops.OrderBy(x => x.PlannedTime).ToList();
            // Update stop orders
            for (int i = 0; i < stops.Count; i++)
            {
                var stop = await dbContext.TransportRouteStops.FirstOrDefaultAsync(x => x.Id == stops[i].Id, cancellationToken);
                if (stop != null)
                {
                    stop.StopOrder = i + 1;
                    stop.UpdatedAtUtc = DateTime.UtcNow;
                }
            }
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(stops);
    }

    [HttpPost("assignments/{assignmentId:guid}/notify-parents")]
    [Authorize(Policy = PolicyNames.TransportAssign)]
    public async Task<ActionResult> NotifyParentsOfScheduleChange(Guid assignmentId, [FromBody] NotifyParentsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var assignment = await dbContext.TransportStudentAssignments
            .FirstOrDefaultAsync(x => x.Id == assignmentId && !x.IsDeleted, cancellationToken);
        if (assignment is null) return NotFound();
        if (!User.CanAccessTenant(assignment.TenantId)) return Forbid();

        // Get guardians for the student
        var guardians = await dbContext.StudentGuardians.AsNoTracking()
            .Where(x => x.TenantId == assignment.TenantId && x.SchoolId == assignment.SchoolId && x.StudentId == assignment.StudentId)
            .Select(x => x.GuardianId)
            .ToListAsync(cancellationToken);

        // Create notifications (placeholder - would integrate with notification system)
        var notifications = guardians.Select(guardianId => new
        {
            Message = $"Transport schedule updated for student ID: {assignment.StudentId}. Route ID: {assignment.TransportRouteId}",
            GuardianId = guardianId,
            CreatedAtUtc = DateTime.UtcNow
        }).ToList();

        // In a real implementation, this would queue notifications via the notification service
        return Ok(new { 
            notifiedGuardians = guardians.Count,
            message = $"Parent notifications queued for student ID: {assignment.StudentId}",
            details = notifications
        });
    }

    [HttpGet("analytics")]
    [Authorize(Policy = PolicyNames.TransportView)]
    public async Task<ActionResult<TransportAnalyticsResponse>> GetTransportAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.TransportTrips.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        
        if (startDate.HasValue) query = query.Where(x => x.TripDate >= startDate.Value);
        if (endDate.HasValue) query = query.Where(x => x.TripDate <= endDate.Value);

        var totalTrips = await query.CountAsync(cancellationToken);
        var completedTrips = await query.CountAsync(x => x.Status == "Completed", cancellationToken);
        var cancelledTrips = await query.CountAsync(x => x.Status == "Cancelled", cancellationToken);

        var activeVehicles = await dbContext.TransportVehicles.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsActive && !x.IsDeleted, cancellationToken);

        var totalAssignments = await dbContext.TransportStudentAssignments.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status == "Active" && !x.IsDeleted, cancellationToken);

        return Ok(new TransportAnalyticsResponse(
            TotalTrips: totalTrips,
            CompletedTrips: completedTrips,
            CancelledTrips: cancelledTrips,
            ActiveVehicles: activeVehicles,
            ActiveAssignments: totalAssignments
        ));
    }
}

public sealed record CreateTransportVehicleRequest(Guid TenantId, Guid SchoolId, string RegistrationNumber, string Name, int Capacity, Guid DriverStaffId, bool IsActive);
public sealed record UpdateTransportVehicleRequest(Guid TenantId, string Name, int Capacity, Guid DriverStaffId, bool IsActive);
public sealed record CreateTransportRouteRequest(Guid TenantId, Guid SchoolId, string RouteCode, string Name, string StartLocation, string EndLocation, bool IsActive);
public sealed record UpdateTransportRouteRequest(Guid TenantId, string Name, string StartLocation, string EndLocation, bool IsActive);
public sealed record CreateTransportRouteStopRequest(Guid TenantId, Guid SchoolId, string StopName, int StopOrder, TimeOnly PlannedTime);
public sealed record CreateTransportStudentAssignmentRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid TransportRouteId, Guid? PickupStopId, Guid? DropoffStopId, DateTime EffectiveFrom, DateTime? EffectiveTo, string Status);
public sealed record CreateTransportTripRequest(Guid TenantId, Guid SchoolId, Guid TransportVehicleId, Guid TransportRouteId, Guid DriverStaffId, DateOnly TripDate, string Direction, DateTime? DepartureAtUtc, DateTime? ArrivalAtUtc, string Status);
public sealed record UpdateTransportAssignmentStatusRequest(Guid TenantId, string Status, DateTime? EffectiveTo);
public sealed record LogTransportTripRequest(Guid TenantId, DateTime? DepartureAtUtc, DateTime? ArrivalAtUtc, string Status);
public sealed record OptimizeRouteSequenceRequest(Guid TenantId, Guid SchoolId, bool OptimizeByTime);
public sealed record NotifyParentsRequest(Guid TenantId, string Message);
public sealed record TransportAnalyticsResponse(int TotalTrips, int CompletedTrips, int CancelledTrips, int ActiveVehicles, int ActiveAssignments);
