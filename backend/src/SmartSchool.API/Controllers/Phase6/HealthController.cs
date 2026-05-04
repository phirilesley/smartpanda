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
[Route("api/health")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class HealthController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("profiles")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<IReadOnlyList<HealthProfile>>> GetProfiles([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.HealthProfiles.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("profiles")]
    [Authorize(Policy = PolicyNames.HealthManage)]
    public async Task<ActionResult<HealthProfile>> CreateProfile([FromBody] CreateHealthProfileRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        if (request.StudentId is null && request.StaffId is null) return BadRequest("studentId or staffId is required.");

        var entity = new HealthProfile
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            StaffId = request.StaffId,
            BloodGroup = request.BloodGroup.Trim(),
            Allergies = request.Allergies.Trim(),
            ChronicConditions = request.ChronicConditions.Trim(),
            EmergencyContactName = request.EmergencyContactName.Trim(),
            EmergencyContactPhone = request.EmergencyContactPhone.Trim()
        };

        dbContext.HealthProfiles.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("profiles/{profileId:guid}")]
    [Authorize(Policy = PolicyNames.HealthManage)]
    public async Task<ActionResult<HealthProfile>> UpdateProfile(Guid profileId, [FromBody] UpdateHealthProfileRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.HealthProfiles.FirstOrDefaultAsync(x => x.Id == profileId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.BloodGroup = request.BloodGroup.Trim();
        entity.Allergies = request.Allergies.Trim();
        entity.ChronicConditions = request.ChronicConditions.Trim();
        entity.EmergencyContactName = request.EmergencyContactName.Trim();
        entity.EmergencyContactPhone = request.EmergencyContactPhone.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("profiles/{profileId:guid}")]
    [Authorize(Policy = PolicyNames.HealthManage)]
    public async Task<IActionResult> DeleteProfile(Guid profileId, CancellationToken cancellationToken)
    {
        var entity = await dbContext.HealthProfiles.FirstOrDefaultAsync(x => x.Id == profileId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.IsDeleted = true;
        entity.DeletedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("screenings")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<IReadOnlyList<HealthScreening>>> GetScreenings([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid healthProfileId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.HealthScreenings.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (healthProfileId != Guid.Empty) query = query.Where(x => x.HealthProfileId == healthProfileId);

        var items = await query.OrderByDescending(x => x.ScreeningDateUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("screenings")]
    [Authorize(Policy = PolicyNames.HealthNurse)]
    public async Task<ActionResult<HealthScreening>> CreateScreening([FromBody] CreateHealthScreeningRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var profileExists = await dbContext.HealthProfiles.AsNoTracking().AnyAsync(x =>
            x.Id == request.HealthProfileId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!profileExists) return BadRequest("Invalid health profile.");

        var entity = new HealthScreening
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HealthProfileId = request.HealthProfileId,
            ScreeningDateUtc = request.ScreeningDateUtc,
            HeightCm = request.HeightCm,
            WeightKg = request.WeightKg,
            BloodPressure = request.BloodPressure.Trim(),
            Notes = request.Notes.Trim(),
            ScreenedByStaffId = request.ScreenedByStaffId
        };

        dbContext.HealthScreenings.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("immunizations")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<IReadOnlyList<ImmunizationRecord>>> GetImmunizations([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid healthProfileId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.ImmunizationRecords.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (healthProfileId != Guid.Empty) query = query.Where(x => x.HealthProfileId == healthProfileId);

        var items = await query.OrderByDescending(x => x.DateGivenUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("immunizations")]
    [Authorize(Policy = PolicyNames.HealthNurse)]
    public async Task<ActionResult<ImmunizationRecord>> CreateImmunization([FromBody] CreateImmunizationRecordRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var profileExists = await dbContext.HealthProfiles.AsNoTracking().AnyAsync(x =>
            x.Id == request.HealthProfileId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (!profileExists) return BadRequest("Invalid health profile.");

        var entity = new ImmunizationRecord
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HealthProfileId = request.HealthProfileId,
            VaccineName = request.VaccineName.Trim(),
            DoseNumber = request.DoseNumber,
            DateGivenUtc = request.DateGivenUtc,
            NextDueDateUtc = request.NextDueDateUtc,
            Notes = request.Notes.Trim()
        };

        dbContext.ImmunizationRecords.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("immunizations/{recordId:guid}")]
    [Authorize(Policy = PolicyNames.HealthNurse)]
    public async Task<ActionResult<ImmunizationRecord>> UpdateImmunization(Guid recordId, [FromBody] UpdateImmunizationRecordRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.ImmunizationRecords.FirstOrDefaultAsync(x => x.Id == recordId && !x.IsDeleted, cancellationToken);
        if (entity is null) return NotFound();
        if (!User.CanAccessTenant(entity.TenantId)) return Forbid();

        entity.NextDueDateUtc = request.NextDueDateUtc;
        entity.Notes = request.Notes.Trim();
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("immunizations/due")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<IReadOnlyList<DueImmunizationItem>>> GetDueImmunizations(
        [FromQuery] Guid tenantId,
        [FromQuery] Guid schoolId,
        [FromQuery] int withinDays = 30,
        CancellationToken cancellationToken = default)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var dueDateCutoff = DateTime.UtcNow.Date.AddDays(Math.Clamp(withinDays, 1, 365));

        var items = await dbContext.ImmunizationRecords.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted && x.NextDueDateUtc.HasValue)
            .Where(x => x.NextDueDateUtc!.Value.Date <= dueDateCutoff)
            .Join(
                dbContext.HealthProfiles.AsNoTracking(),
                record => record.HealthProfileId,
                profile => profile.Id,
                (record, profile) => new DueImmunizationItem(
                    profile.Id,
                    profile.StudentId,
                    profile.StaffId,
                    record.VaccineName,
                    record.DoseNumber,
                    record.NextDueDateUtc!.Value))
            .OrderBy(x => x.NextDueDateUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("alerts")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<IReadOnlyList<HealthAlert>>> GetHealthAlerts([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? healthProfileId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.HealthProfiles.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);
        if (healthProfileId.HasValue) query = query.Where(x => x.Id == healthProfileId.Value);

        var alerts = new List<HealthAlert>();

        // Check for immunizations due within 30 days
        var dueImmunizations = await query
            .Join(dbContext.ImmunizationRecords.AsNoTracking().Where(r => !r.IsDeleted && r.NextDueDateUtc.HasValue),
                profile => profile.Id,
                record => record.HealthProfileId,
                (profile, record) => new { profile, record })
            .Where(x => x.record.NextDueDateUtc!.Value.Date <= DateTime.UtcNow.Date.AddDays(30))
            .Select(x => new HealthAlert(
                Guid.NewGuid(),
                x.profile.Id,
                "ImmunizationDue",
                $"Immunization due: {x.record.VaccineName} (Dose {x.record.DoseNumber})",
                x.record.NextDueDateUtc!.Value.Date <= DateTime.UtcNow.Date.AddDays(7) ? "High" : "Medium",
                x.record.NextDueDateUtc!.Value
            ))
            .ToListAsync(cancellationToken);

        alerts.AddRange(dueImmunizations);

        // Check for chronic conditions requiring follow-up
        var chronicConditionsAlerts = await query
            .Where(x => !string.IsNullOrWhiteSpace(x.ChronicConditions))
            .Select(x => new HealthAlert(
                Guid.NewGuid(),
                x.Id,
                "ChronicConditionFollowUp",
                $"Chronic condition monitoring required: {x.ChronicConditions}",
                "Medium",
                DateTime.UtcNow.Date.AddDays(30)
            ))
            .ToListAsync(cancellationToken);

        alerts.AddRange(chronicConditionsAlerts);

        // Check for severe allergies
        var allergyAlerts = await query
            .Where(x => !string.IsNullOrWhiteSpace(x.Allergies) && x.Allergies.Contains("severe", StringComparison.OrdinalIgnoreCase))
            .Select(x => new HealthAlert(
                Guid.NewGuid(),
                x.Id,
                "SevereAllergy",
                $"Severe allergy documented: {x.Allergies}",
                "High",
                DateTime.UtcNow.Date
            ))
            .ToListAsync(cancellationToken);

        alerts.AddRange(allergyAlerts);

        return Ok(alerts.OrderByDescending(x => x.DueDate).ThenBy(x => x.Priority));
    }

    [HttpPost("profiles/{profileId:guid}/action-plans")]
    [Authorize(Policy = PolicyNames.HealthNurse)]
    public async Task<ActionResult<HealthActionPlan>> CreateActionPlan(Guid profileId, [FromBody] CreateHealthActionPlanRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var profile = await dbContext.HealthProfiles.FirstOrDefaultAsync(x => 
            x.Id == profileId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && !x.IsDeleted,
            cancellationToken);
        if (profile is null) return NotFound("Health profile not found for tenant/school.");

        var entity = new HealthActionPlan
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            HealthProfileId = profileId,
            Condition = request.Condition.Trim(),
            PlanDescription = request.PlanDescription.Trim(),
            TriggerConditions = request.TriggerConditions.Trim(),
            RequiredActions = request.RequiredActions.Trim(),
            EmergencyContacts = request.EmergencyContacts.Trim(),
            IsActive = true
        };

        dbContext.HealthActionPlans.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("profiles/{profileId:guid}/action-plans")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<IReadOnlyList<HealthActionPlan>>> GetActionPlans(Guid profileId, [FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var profile = await dbContext.HealthProfiles.AsNoTracking().FirstOrDefaultAsync(x => 
            x.Id == profileId && x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted,
            cancellationToken);
        if (profile is null) return NotFound("Health profile not found for tenant/school.");

        var items = await dbContext.HealthActionPlans.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.HealthProfileId == profileId && x.IsActive && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("analytics")]
    [Authorize(Policy = PolicyNames.HealthView)]
    public async Task<ActionResult<HealthAnalyticsResponse>> GetHealthAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var totalProfiles = await dbContext.HealthProfiles.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var profilesWithAllergies = await dbContext.HealthProfiles.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !string.IsNullOrWhiteSpace(x.Allergies) && !x.IsDeleted, cancellationToken);

        var profilesWithChronicConditions = await dbContext.HealthProfiles.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !string.IsNullOrWhiteSpace(x.ChronicConditions) && !x.IsDeleted, cancellationToken);

        var totalScreenings = await dbContext.HealthScreenings.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var totalImmunizations = await dbContext.ImmunizationRecords.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted, cancellationToken);

        var upcomingImmunizations = await dbContext.ImmunizationRecords.AsNoTracking()
            .CountAsync(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted && 
                           x.NextDueDateUtc.HasValue && x.NextDueDateUtc.Value.Date <= DateTime.UtcNow.Date.AddDays(30), cancellationToken);

        return Ok(new HealthAnalyticsResponse(
            TotalProfiles: totalProfiles,
            ProfilesWithAllergies: profilesWithAllergies,
            ProfilesWithChronicConditions: profilesWithChronicConditions,
            TotalScreenings: totalScreenings,
            TotalImmunizations: totalImmunizations,
            UpcomingImmunizations: upcomingImmunizations
        ));
    }
}

public sealed record CreateHealthProfileRequest(Guid TenantId, Guid SchoolId, Guid? StudentId, Guid? StaffId, string BloodGroup, string Allergies, string ChronicConditions, string EmergencyContactName, string EmergencyContactPhone);
public sealed record UpdateHealthProfileRequest(Guid TenantId, string BloodGroup, string Allergies, string ChronicConditions, string EmergencyContactName, string EmergencyContactPhone);
public sealed record CreateHealthScreeningRequest(Guid TenantId, Guid SchoolId, Guid HealthProfileId, DateTime ScreeningDateUtc, decimal? HeightCm, decimal? WeightKg, string BloodPressure, string Notes, Guid ScreenedByStaffId);
public sealed record CreateImmunizationRecordRequest(Guid TenantId, Guid SchoolId, Guid HealthProfileId, string VaccineName, int DoseNumber, DateTime DateGivenUtc, DateTime? NextDueDateUtc, string Notes);
public sealed record UpdateImmunizationRecordRequest(Guid TenantId, DateTime? NextDueDateUtc, string Notes);
public sealed record DueImmunizationItem(Guid HealthProfileId, Guid? StudentId, Guid? StaffId, string VaccineName, int DoseNumber, DateTime NextDueDateUtc);
public sealed record HealthAlert(Guid Id, Guid HealthProfileId, string AlertType, string Message, string Priority, DateTime DueDate);
public sealed record CreateHealthActionPlanRequest(Guid TenantId, Guid SchoolId, string Condition, string PlanDescription, string TriggerConditions, string RequiredActions, string EmergencyContacts);
public sealed record HealthAnalyticsResponse(int TotalProfiles, int ProfilesWithAllergies, int ProfilesWithChronicConditions, int TotalScreenings, int TotalImmunizations, int UpcomingImmunizations);
