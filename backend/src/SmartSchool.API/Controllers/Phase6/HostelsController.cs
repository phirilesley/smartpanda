using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
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
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/hostels")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class HostelsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    [Authorize(Policy = PolicyNames.HostelsView)]
    public async Task<ActionResult<IReadOnlyList<Hostel>>> GetHostels([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.Hostels.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    [Authorize(Policy = PolicyNames.HostelsManage)]
    public async Task<ActionResult<Hostel>> CreateHostel([FromBody] CreateHostelRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new Hostel
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            GenderPolicy = request.GenderPolicy.Trim(),
            Capacity = request.Capacity,
            MatronStaffId = request.MatronStaffId,
            IsActive = request.IsActive
        };

        dbContext.Hostels.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{hostelId:guid}")]
    [Authorize(Policy = PolicyNames.HostelsManage)]
    public async Task<ActionResult<Hostel>> UpdateHostel(Guid hostelId, [FromBody] UpdateHostelRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.Hostels.FirstOrDefaultAsync(x => x.Id == hostelId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Name = request.Name.Trim();
        entity.GenderPolicy = request.GenderPolicy.Trim();
        entity.Capacity = request.Capacity;
        entity.MatronStaffId = request.MatronStaffId;
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{hostelId:guid}")]
    [Authorize(Policy = PolicyNames.HostelsManage)]
    public async Task<IActionResult> DeleteHostel(Guid hostelId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Hostels.FirstOrDefaultAsync(x => x.Id == hostelId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{hostelId:guid}/rooms")]
    [Authorize(Policy = PolicyNames.HostelsManage)]
    public async Task<ActionResult<HostelRoom>> AddRoom(Guid hostelId, [FromBody] CreateHostelRoomRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var hostelExists = await dbContext.Hostels.AsNoTracking().AnyAsync(x =>
            x.Id == hostelId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!hostelExists) return NotFound("Hostel not found for tenant/school.");

        var entity = new HostelRoom
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HostelId = hostelId,
            Name = request.Name.Trim(),
            Capacity = request.Capacity,
            FloorName = request.FloorName.Trim()
        };

        dbContext.HostelRooms.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("rooms/{roomId:guid}/beds")]
    [Authorize(Policy = PolicyNames.HostelsManage)]
    public async Task<ActionResult<HostelBed>> AddBed(Guid roomId, [FromBody] CreateHostelBedRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var roomExists = await dbContext.HostelRooms.AsNoTracking().AnyAsync(x =>
            x.Id == roomId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!roomExists) return NotFound("Room not found for tenant/school.");

        var entity = new HostelBed
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HostelRoomId = roomId,
            BedCode = request.BedCode.Trim().ToUpperInvariant(),
            Status = request.Status.Trim()
        };

        dbContext.HostelBeds.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("allocations")]
    [Authorize(Policy = PolicyNames.HostelsView)]
    public async Task<ActionResult<IReadOnlyList<HostelAllocation>>> GetAllocations([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] bool currentOnly, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.HostelAllocations.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (currentOnly) query = query.Where(x => x.IsCurrent);

        var items = await query.OrderByDescending(x => x.StartDate).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("allocations")]
    [Authorize(Policy = PolicyNames.HostelsMatron)]
    public async Task<ActionResult<HostelAllocation>> CreateAllocation([FromBody] CreateHostelAllocationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var bedExists = await dbContext.HostelBeds.AsNoTracking().AnyAsync(x =>
            x.Id == request.HostelBedId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!studentExists || !bedExists) return BadRequest("Invalid student or bed.");

        // Check for overlapping bed allocations (no student can have multiple current allocations)
        if (request.IsCurrent)
        {
            var existingAllocation = await dbContext.HostelAllocations.AsNoTracking()
                .AnyAsync(x => x.TenantId == request.TenantId && 
                              x.SchoolId == request.SchoolId && 
                              x.StudentId == request.StudentId && 
                              x.IsCurrent && 
                              !x.IsDeleted &&
                              (request.EndDate == null || x.StartDate < request.EndDate) &&
                              (x.EndDate == null || request.StartDate < x.EndDate),
                    cancellationToken);
            if (existingAllocation) return Conflict("Student already has a current bed allocation for the specified period.");

            // Check if bed is already occupied for the requested period
            var bedOccupied = await dbContext.HostelAllocations.AsNoTracking()
                .AnyAsync(x => x.TenantId == request.TenantId && 
                              x.SchoolId == request.SchoolId && 
                              x.HostelBedId == request.HostelBedId && 
                              x.IsCurrent && 
                              !x.IsDeleted &&
                              (request.EndDate == null || x.StartDate < request.EndDate) &&
                              (x.EndDate == null || request.StartDate < x.EndDate),
                    cancellationToken);
            if (bedOccupied) return Conflict("Bed is already occupied for the specified period.");
        }

        if (request.IsCurrent)
        {
            var previousCurrent = await dbContext.HostelAllocations
                .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == request.StudentId && x.IsCurrent && !x.IsDeleted)
                .ToListAsync(cancellationToken);
            foreach (var item in previousCurrent)
            {
                item.IsCurrent = false;
                item.EndDate = request.StartDate;
                item.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        var entity = new HostelAllocation
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            HostelBedId = request.HostelBedId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsCurrent = request.IsCurrent,
            Status = request.Status.Trim()
        };

        dbContext.HostelAllocations.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("allocations/{allocationId:guid}")]
    [Authorize(Policy = PolicyNames.HostelsMatron)]
    public async Task<ActionResult<HostelAllocation>> UpdateAllocation(Guid allocationId, [FromBody] UpdateHostelAllocationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.HostelAllocations.FirstOrDefaultAsync(x => x.Id == allocationId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.EndDate = request.EndDate;
        entity.IsCurrent = request.IsCurrent;
        entity.Status = request.Status.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("allocations/{allocationId:guid}/transfer")]
    [Authorize(Policy = PolicyNames.HostelsMatron)]
    public async Task<ActionResult<HostelAllocation>> TransferAllocation(Guid allocationId, [FromBody] TransferHostelAllocationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var current = await dbContext.HostelAllocations.FirstOrDefaultAsync(x => x.Id == allocationId && !x.IsDeleted, cancellationToken);
        if (current is null) return NotFound();
        if (!User.CanAccessTenant(current.TenantId)) return Forbid();

        var bedExists = await dbContext.HostelBeds.AsNoTracking().AnyAsync(x =>
            x.Id == request.NewHostelBedId && x.TenantId == current.TenantId && x.SchoolId == current.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!bedExists) return BadRequest("Invalid target bed.");

        current.IsCurrent = false;
        current.Status = "Transferred";
        current.EndDate = request.TransferDate;
        current.UpdatedAtUtc = DateTime.UtcNow;

        var next = new HostelAllocation
        {
            TenantId = current.TenantId,
            SchoolId = current.SchoolId,
            StudentId = current.StudentId,
            HostelBedId = request.NewHostelBedId,
            AcademicYearId = current.AcademicYearId,
            TermId = current.TermId,
            StartDate = request.TransferDate,
            EndDate = null,
            IsCurrent = true,
            Status = "Active"
        };

        dbContext.HostelAllocations.Add(next);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(next);
    }

    [HttpPost("allocations/{allocationId:guid}/checkout")]
    [Authorize(Policy = PolicyNames.HostelsMatron)]
    public async Task<ActionResult<HostelAllocation>> CheckOut(Guid allocationId, [FromBody] CheckoutHostelAllocationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.HostelAllocations.FirstOrDefaultAsync(x => x.Id == allocationId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsCurrent = false;
        entity.Status = "CheckedOut";
        entity.EndDate = request.CheckoutDate;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("incidents")]
    [Authorize(Policy = PolicyNames.HostelsMatron)]
    public async Task<ActionResult<HostelIncident>> CreateIncident([FromBody] CreateHostelIncidentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var hostelExists = await dbContext.Hostels.AsNoTracking().AnyAsync(x =>
            x.Id == request.HostelId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!hostelExists || !studentExists) return BadRequest("Invalid hostel or student.");

        var entity = new HostelIncident
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HostelId = request.HostelId,
            StudentId = request.StudentId,
            ReportedByStaffId = request.ReportedByStaffId,
            OccurredAtUtc = request.OccurredAtUtc,
            Category = request.Category.Trim(),
            Notes = request.Notes.Trim(),
            Status = "Open"
        };

        dbContext.HostelIncidents.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("incidents")]
    [Authorize(Policy = PolicyNames.HostelsView)]
    public async Task<ActionResult<IReadOnlyList<HostelIncident>>> GetIncidents([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.HostelIncidents.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderByDescending(x => x.OccurredAtUtc)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPut("incidents/{incidentId:guid}/status")]
    [Authorize(Policy = PolicyNames.HostelsMatron)]
    public async Task<ActionResult<HostelIncident>> UpdateIncidentStatus(Guid incidentId, [FromBody] UpdateHostelIncidentStatusRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.HostelIncidents.FirstOrDefaultAsync(x => x.Id == incidentId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Status = request.Status.Trim();
        if (string.Equals(entity.Status, "Resolved", StringComparison.OrdinalIgnoreCase))
        {
            entity.ResolvedAtUtc = request.ResolvedAtUtc ?? DateTime.UtcNow;
        }
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("analytics")]
    [Authorize(Policy = PolicyNames.HostelsView)]
    public async Task<ActionResult<HostelAnalyticsResponse>> GetHostelAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var totalHostels = await dbContext.Hostels.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var totalRooms = await dbContext.HostelRooms.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var totalBeds = await dbContext.HostelBeds.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var occupiedBeds = await dbContext.HostelAllocations.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.IsCurrent && !x.IsDeleted, cancellationToken);

        var availableBeds = totalBeds - occupiedBeds;
        var occupancyRate = totalBeds > 0 ? (decimal)occupiedBeds / totalBeds * 100 : 0;

        var openIncidents = await dbContext.HostelIncidents.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.Status == "Open" && !x.IsDeleted, cancellationToken);

        var recentIncidents = await dbContext.HostelIncidents.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && 
                           x.OccurredAtUtc >= DateTime.UtcNow.AddDays(-7) && !x.IsDeleted, cancellationToken);

        return Ok(new HostelAnalyticsResponse(
            TotalHostels: totalHostels,
            TotalRooms: totalRooms,
            TotalBeds: totalBeds,
            OccupiedBeds: occupiedBeds,
            AvailableBeds: availableBeds,
            OccupancyRate: occupancyRate,
            OpenIncidents: openIncidents,
            RecentIncidents: recentIncidents
        ));
    }
}

public sealed record CreateHostelRequest(Guid TenantId, Guid SchoolId, string Name, string GenderPolicy, int Capacity, Guid? MatronStaffId, bool IsActive);
public sealed record UpdateHostelRequest(Guid TenantId, string Name, string GenderPolicy, int Capacity, Guid? MatronStaffId, bool IsActive);
public sealed record CreateHostelRoomRequest(Guid TenantId, Guid SchoolId, string Name, int Capacity, string FloorName);
public sealed record CreateHostelBedRequest(Guid TenantId, Guid SchoolId, string BedCode, string Status);
public sealed record CreateHostelAllocationRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid HostelBedId, Guid AcademicYearId, Guid TermId, DateTime StartDate, DateTime? EndDate, bool IsCurrent, string Status);
public sealed record UpdateHostelAllocationRequest(Guid TenantId, DateTime? EndDate, bool IsCurrent, string Status);
public sealed record TransferHostelAllocationRequest(Guid TenantId, Guid NewHostelBedId, DateTime TransferDate);
public sealed record CheckoutHostelAllocationRequest(Guid TenantId, DateTime CheckoutDate);
public sealed record CreateHostelIncidentRequest(Guid TenantId, Guid SchoolId, Guid HostelId, Guid StudentId, Guid ReportedByStaffId, DateTime OccurredAtUtc, string Category, string Notes);
public sealed record UpdateHostelIncidentStatusRequest(Guid TenantId, string Status, DateTime? ResolvedAtUtc);
public sealed record HostelAnalyticsResponse(int TotalHostels, int TotalRooms, int TotalBeds, int OccupiedBeds, int AvailableBeds, decimal OccupancyRate, int OpenIncidents, int RecentIncidents);
