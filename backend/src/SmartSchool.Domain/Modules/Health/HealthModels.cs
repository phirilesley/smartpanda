using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Health;

public class HealthProfile : TenantSchoolEntityBase
{
    public Guid? StudentId { get; set; }
    public Guid? StaffId { get; set; }
    public string BloodGroup { get; set; } = string.Empty;
    public string Allergies { get; set; } = string.Empty;
    public string ChronicConditions { get; set; } = string.Empty;
    public string EmergencyContactName { get; set; } = string.Empty;
    public string EmergencyContactPhone { get; set; } = string.Empty;
}

public class HealthScreening : TenantSchoolEntityBase
{
    public Guid HealthProfileId { get; set; }
    public DateTime ScreeningDateUtc { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string BloodPressure { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public Guid ScreenedByStaffId { get; set; }
}

public class ImmunizationRecord : TenantSchoolEntityBase
{
    public Guid HealthProfileId { get; set; }
    public string VaccineName { get; set; } = string.Empty;
    public int DoseNumber { get; set; }
    public DateTime DateGivenUtc { get; set; }
    public DateTime? NextDueDateUtc { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class ClinicVisit : TenantSchoolEntityBase
{
    public string PatientType { get; set; } = "Student";
    public Guid? StudentId { get; set; }
    public Guid? StaffId { get; set; }
    public DateTime VisitDateUtc { get; set; }
    public string Complaint { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public Guid AttendedByStaffId { get; set; }
    public DateTime? FollowUpDateUtc { get; set; }
    public bool IsReferred { get; set; }
    public string ReferralFacility { get; set; } = string.Empty;
    public string ReferralReason { get; set; } = string.Empty;
    public DateTime? ReferredAtUtc { get; set; }
    public DateTime? ClosedAtUtc { get; set; }
    public string Status { get; set; } = "Open";
}

public class ClinicMedication : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal QuantityInStock { get; set; }
    public decimal ReorderLevel { get; set; }
    public bool IsActive { get; set; } = true;
}

public class MedicationDispense : TenantSchoolEntityBase
{
    public Guid ClinicVisitId { get; set; }
    public Guid ClinicMedicationId { get; set; }
    public decimal Quantity { get; set; }
    public string Instructions { get; set; } = string.Empty;
    public Guid DispensedByStaffId { get; set; }
}

public class ClinicPrescription : TenantSchoolEntityBase
{
    public Guid ClinicVisitId { get; set; }
    public DateTime PrescriptionDateUtc { get; set; }
    public Guid PrescribedByStaffId { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime? FulfilledAtUtc { get; set; }
    public string Status { get; set; } = "Active";
}

public class ClinicPrescriptionItem : TenantSchoolEntityBase
{
    public Guid ClinicPrescriptionId { get; set; }
    public Guid ClinicMedicationId { get; set; }
    public string Dosage { get; set; } = string.Empty;
    public string Frequency { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Instructions { get; set; } = string.Empty;
}

public class HealthActionPlan : TenantSchoolEntityBase
{
    public Guid HealthProfileId { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string PlanDescription { get; set; } = string.Empty;
    public string TriggerConditions { get; set; } = string.Empty;
    public string RequiredActions { get; set; } = string.Empty;
    public string EmergencyContacts { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
