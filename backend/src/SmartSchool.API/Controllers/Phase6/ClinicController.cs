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
using SmartSchool.Domain.Modules.Health;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/clinic")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ClinicController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("visits")]
    [Authorize(Policy = PolicyNames.ClinicView)]
    public async Task<ActionResult<IReadOnlyList<ClinicVisit>>> GetVisits([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] string? status, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.ClinicVisits.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalized = status.Trim();
            query = query.Where(x => x.Status == normalized);
        }

        var items = await query.OrderByDescending(x => x.VisitDateUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("visits")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<ClinicVisit>> CreateVisit([FromBody] CreateClinicVisitRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        if (request.StudentId is null && request.StaffId is null) return BadRequest("studentId or staffId is required.");

        var entity = new ClinicVisit
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            PatientType = request.PatientType.Trim(),
            StudentId = request.StudentId,
            StaffId = request.StaffId,
            VisitDateUtc = request.VisitDateUtc,
            Complaint = request.Complaint.Trim(),
            Diagnosis = request.Diagnosis.Trim(),
            Treatment = request.Treatment.Trim(),
            AttendedByStaffId = request.AttendedByStaffId,
            FollowUpDateUtc = request.FollowUpDateUtc,
            Status = request.Status.Trim()
        };

        dbContext.ClinicVisits.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("visits/{visitId:guid}")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<ClinicVisit>> UpdateVisit(Guid visitId, [FromBody] UpdateClinicVisitRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ClinicVisits.FirstOrDefaultAsync(x => x.Id == visitId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Diagnosis = request.Diagnosis.Trim();
        entity.Treatment = request.Treatment.Trim();
        entity.FollowUpDateUtc = request.FollowUpDateUtc;
        entity.Status = request.Status.Trim();
        if (string.Equals(entity.Status, "Closed", StringComparison.OrdinalIgnoreCase))
        {
            entity.ClosedAtUtc = DateTime.UtcNow;
        }
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("visits/{visitId:guid}/refer")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<ClinicVisit>> ReferVisit(Guid visitId, [FromBody] ReferClinicVisitRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ClinicVisits.FirstOrDefaultAsync(x => x.Id == visitId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsReferred = true;
        entity.ReferralFacility = request.ReferralFacility.Trim();
        entity.ReferralReason = request.ReferralReason.Trim();
        entity.ReferredAtUtc = request.ReferredAtUtc ?? DateTime.UtcNow;
        entity.Status = "Referred";
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("visits/{visitId:guid}/follow-up")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<ClinicVisit>> SetFollowUp(Guid visitId, [FromBody] ClinicFollowUpRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ClinicVisits.FirstOrDefaultAsync(x => x.Id == visitId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.FollowUpDateUtc = request.FollowUpDateUtc;
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            entity.Status = request.Status.Trim();
        }
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("visits/{visitId:guid}")]
    [Authorize(Policy = PolicyNames.ClinicManage)]
    public async Task<IActionResult> DeleteVisit(Guid visitId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.ClinicVisits.FirstOrDefaultAsync(x => x.Id == visitId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("medications")]
    [Authorize(Policy = PolicyNames.ClinicView)]
    public async Task<ActionResult<IReadOnlyList<ClinicMedication>>> GetMedications([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.ClinicMedications.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("medications/low-stock")]
    [Authorize(Policy = PolicyNames.ClinicView)]
    public async Task<ActionResult<IReadOnlyList<ClinicMedication>>> GetLowStock([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.ClinicMedications.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted && x.IsActive && x.QuantityInStock <= x.ReorderLevel)
            .OrderBy(x => x.QuantityInStock)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("medications")]
    [Authorize(Policy = PolicyNames.ClinicManage)]
    public async Task<ActionResult<ClinicMedication>> CreateMedication([FromBody] CreateClinicMedicationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new ClinicMedication
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            Unit = request.Unit.Trim(),
            QuantityInStock = request.QuantityInStock,
            ReorderLevel = request.ReorderLevel,
            IsActive = request.IsActive
        };

        dbContext.ClinicMedications.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("medications/{medicationId:guid}")]
    [Authorize(Policy = PolicyNames.ClinicManage)]
    public async Task<ActionResult<ClinicMedication>> UpdateMedication(Guid medicationId, [FromBody] UpdateClinicMedicationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ClinicMedications.FirstOrDefaultAsync(x => x.Id == medicationId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.Unit = request.Unit.Trim();
        entity.QuantityInStock = request.QuantityInStock;
        entity.ReorderLevel = request.ReorderLevel;
        entity.IsActive = request.IsActive;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("medications/{medicationId:guid}/stock-adjustment")]
    [Authorize(Policy = PolicyNames.ClinicManage)]
    public async Task<ActionResult<ClinicMedication>> AdjustMedicationStock(Guid medicationId, [FromBody] AdjustClinicMedicationStockRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ClinicMedications.FirstOrDefaultAsync(x => x.Id == medicationId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        var next = entity.QuantityInStock + request.QuantityDelta;
        if (next < 0) return BadRequest("Stock adjustment cannot make quantity negative.");

        entity.QuantityInStock = next;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("dispense")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<MedicationDispense>> DispenseMedication([FromBody] DispenseMedicationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var visit = await dbContext.ClinicVisits.FirstOrDefaultAsync(x =>
            x.Id == request.ClinicVisitId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (visit is null) return BadRequest("Clinic visit does not exist for tenant/school.");

        var medication = await dbContext.ClinicMedications.FirstOrDefaultAsync(x =>
            x.Id == request.ClinicMedicationId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (medication is null) return BadRequest("Medication does not exist for tenant/school.");
        if (medication.QuantityInStock < request.Quantity) return BadRequest("Insufficient medication stock.");

        medication.QuantityInStock -= request.Quantity;
        medication.UpdatedAtUtc = DateTime.UtcNow;

        var entity = new MedicationDispense
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ClinicVisitId = request.ClinicVisitId,
            ClinicMedicationId = request.ClinicMedicationId,
            Quantity = request.Quantity,
            Instructions = request.Instructions.Trim(),
            DispensedByStaffId = request.DispensedByStaffId
        };

        dbContext.MedicationDispenses.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("dispense")]
    [Authorize(Policy = PolicyNames.ClinicView)]
    public async Task<ActionResult<IReadOnlyList<MedicationDispense>>> GetDispenseRecords([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid clinicVisitId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.MedicationDispenses.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (clinicVisitId != Guid.Empty) query = query.Where(x => x.ClinicVisitId == clinicVisitId);

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("prescriptions")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<ClinicPrescription>> CreatePrescription([FromBody] CreateClinicPrescriptionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var visit = await dbContext.ClinicVisits.FirstOrDefaultAsync(x =>
            x.Id == request.ClinicVisitId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (visit is null) return BadRequest("Clinic visit does not exist for tenant/school.");

        var entity = new ClinicPrescription
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ClinicVisitId = request.ClinicVisitId,
            PrescriptionDateUtc = DateTime.UtcNow,
            PrescribedByStaffId = request.PrescribedByStaffId,
            Notes = request.Notes.Trim(),
            Status = "Active"
        };

        dbContext.ClinicPrescriptions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Add prescription items
        foreach (var item in request.Items)
        {
            var prescriptionItem = new ClinicPrescriptionItem
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                ClinicPrescriptionId = entity.Id,
                ClinicMedicationId = item.ClinicMedicationId,
                Dosage = item.Dosage.Trim(),
                Frequency = item.Frequency.Trim(),
                Duration = item.Duration.Trim(),
                Quantity = item.Quantity,
                Instructions = item.Instructions.Trim()
            };
            dbContext.ClinicPrescriptionItems.Add(prescriptionItem);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("prescriptions/{prescriptionId:guid}/items")]
    [Authorize(Policy = PolicyNames.ClinicView)]
    public async Task<ActionResult<IReadOnlyList<ClinicPrescriptionItem>>> GetPrescriptionItems(Guid prescriptionId, [FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var prescription = await dbContext.ClinicPrescriptions.AsNoTracking().FirstOrDefaultAsync(x => 
            x.Id == prescriptionId && x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted,
            cancellationToken);
        if (prescription is null) return NotFound("Prescription not found for tenant/school.");

        var items = await dbContext.ClinicPrescriptionItems.AsNoTracking()
            .Where(x => x.ClinicPrescriptionId == prescriptionId && !x.IsDeleted)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("prescriptions/{prescriptionId:guid}/fulfill")]
    [Authorize(Policy = PolicyNames.ClinicDoctor)]
    public async Task<ActionResult<ClinicPrescription>> FulfillPrescription(Guid prescriptionId, [FromBody] FulfillPrescriptionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var prescription = await dbContext.ClinicPrescriptions.FirstOrDefaultAsync(x => 
            x.Id == prescriptionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (prescription is null) return NotFound("Prescription not found for tenant/school.");

        // Get prescription items
        var items = await dbContext.ClinicPrescriptionItems
            .Where(x => x.ClinicPrescriptionId == prescriptionId && !x.IsDeleted)
            .ToListAsync(cancellationToken);

        var fulfilledItems = 0;
        var insufficientStock = new List<string>();

        foreach (var item in items)
        {
            var medication = await dbContext.ClinicMedications.FirstOrDefaultAsync(x =>
                x.Id == item.ClinicMedicationId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
                cancellationToken);
            
            if (medication is null)
            {
                insufficientStock.Add($"Medication {item.ClinicMedicationId} not found");
                continue;
            }

            if (medication.QuantityInStock < item.Quantity)
            {
                insufficientStock.Add($"Insufficient stock for medication: {medication.Name}");
                continue;
            }

            // Dispense medication
            medication.QuantityInStock -= item.Quantity;
            medication.UpdatedAtUtc = DateTime.UtcNow;

            var dispense = new MedicationDispense
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                ClinicVisitId = prescription.ClinicVisitId,
                ClinicMedicationId = item.ClinicMedicationId,
                Quantity = item.Quantity,
                Instructions = $"{item.Dosage} - {item.Frequency} - {item.Duration}",
                DispensedByStaffId = request.DispensedByStaffId
            };
            dbContext.MedicationDispenses.Add(dispense);
            fulfilledItems++;
        }

        if (fulfilledItems > 0)
        {
            prescription.Status = "Fulfilled";
            prescription.FulfilledAtUtc = DateTime.UtcNow;
            prescription.UpdatedAtUtc = DateTime.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(new { 
            prescriptionId = prescriptionId,
            fulfilledItems = fulfilledItems,
            insufficientStock = insufficientStock,
            status = prescription.Status
        });
    }

    [HttpGet("analytics")]
    [Authorize(Policy = PolicyNames.ClinicView)]
    public async Task<ActionResult<ClinicAnalyticsResponse>> GetClinicAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateOnly? startDate, [FromQuery] DateOnly? endDate, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var visitQuery = dbContext.ClinicVisits.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        
        if (startDate.HasValue) visitQuery = visitQuery.Where(x => DateOnly.FromDateTime(x.VisitDateUtc) >= startDate.Value);
        if (endDate.HasValue) visitQuery = visitQuery.Where(x => DateOnly.FromDateTime(x.VisitDateUtc) <= endDate.Value);

        var totalVisits = await visitQuery.CountAsync(cancellationToken);
        var openVisits = await visitQuery.CountAsync(x => x.Status == "Open", cancellationToken);
        var referredVisits = await visitQuery.CountAsync(x => x.IsReferred, cancellationToken);

        var totalMedications = await dbContext.ClinicMedications.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var lowStockMedications = await dbContext.ClinicMedications.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted && 
                           x.IsActive && x.QuantityInStock <= x.ReorderLevel, cancellationToken);

        var totalDispenses = await dbContext.MedicationDispenses.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .CountAsync(cancellationToken);

        var totalPrescriptions = await dbContext.ClinicPrescriptions.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        return Ok(new ClinicAnalyticsResponse(
            TotalVisits: totalVisits,
            OpenVisits: openVisits,
            ReferredVisits: referredVisits,
            TotalMedications: totalMedications,
            LowStockMedications: lowStockMedications,
            TotalDispenses: totalDispenses,
            TotalPrescriptions: totalPrescriptions
        ));
    }
}

public sealed record CreateClinicVisitRequest(Guid TenantId, Guid SchoolId, string PatientType, Guid? StudentId, Guid? StaffId, DateTime VisitDateUtc, string Complaint, string Diagnosis, string Treatment, Guid AttendedByStaffId, DateTime? FollowUpDateUtc, string Status);
public sealed record UpdateClinicVisitRequest(Guid TenantId, string Diagnosis, string Treatment, DateTime? FollowUpDateUtc, string Status);
public sealed record ReferClinicVisitRequest(Guid TenantId, string ReferralFacility, string ReferralReason, DateTime? ReferredAtUtc);
public sealed record ClinicFollowUpRequest(Guid TenantId, DateTime? FollowUpDateUtc, string? Status);
public sealed record CreateClinicMedicationRequest(Guid TenantId, Guid SchoolId, string Name, string Unit, decimal QuantityInStock, decimal ReorderLevel, bool IsActive);
public sealed record UpdateClinicMedicationRequest(Guid TenantId, string Unit, decimal QuantityInStock, decimal ReorderLevel, bool IsActive);
public sealed record AdjustClinicMedicationStockRequest(Guid TenantId, decimal QuantityDelta);
public sealed record DispenseMedicationRequest(Guid TenantId, Guid SchoolId, Guid ClinicVisitId, Guid ClinicMedicationId, decimal Quantity, string Instructions, Guid DispensedByStaffId);
public sealed record CreateClinicPrescriptionRequest(Guid TenantId, Guid SchoolId, Guid ClinicVisitId, Guid PrescribedByStaffId, string Notes, List<PrescriptionItemRequest> Items);
public sealed record PrescriptionItemRequest(Guid ClinicMedicationId, string Dosage, string Frequency, string Duration, decimal Quantity, string Instructions);
public sealed record FulfillPrescriptionRequest(Guid TenantId, Guid SchoolId, Guid DispensedByStaffId);
public sealed record ClinicAnalyticsResponse(int TotalVisits, int OpenVisits, int ReferredVisits, int TotalMedications, int LowStockMedications, int TotalDispenses, int TotalPrescriptions);
