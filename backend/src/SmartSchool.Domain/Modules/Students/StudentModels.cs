using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Students;

public class Student : TenantSchoolEntityBase
{
    public string StudentNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class Guardian : TenantSchoolEntityBase
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
}

public class StudentGuardian : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid GuardianId { get; set; }
    public bool IsPrimaryContact { get; set; }
}

public class StudentMedicalRecord : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public string Conditions { get; set; } = string.Empty;
    public string Allergies { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class StudentDocument : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid UploadedFileId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
}

public class StudentEnrollment : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid StreamId { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}

public class StudentPromotion : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid FromAcademicYearId { get; set; }
    public Guid ToAcademicYearId { get; set; }
    public Guid FromGradeId { get; set; }
    public Guid ToGradeId { get; set; }
    public EnrollmentDecision Decision { get; set; }
    public DateTime PromotionDate { get; set; }
    public string Remarks { get; set; } = string.Empty;
}

public class StudentTransfer : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public DateTime TransferDate { get; set; }
    public string FromSchoolName { get; set; } = string.Empty;
    public string ToSchoolName { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}
