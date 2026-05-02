using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Academics;

public class AcademicYear : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsClosed { get; set; }
}

public class Term : TenantSchoolEntityBase
{
    public Guid AcademicYearId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TermNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsClosed { get; set; }
}

public class Grade : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public int GradeOrder { get; set; }
    public bool IsTerminalGrade { get; set; }
    public bool IsActive { get; set; } = true;
}

public class AcademicStream : TenantSchoolEntityBase
{
    public Guid GradeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public Guid? ClassTeacherStaffId { get; set; }
}

public class Department : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class Subject : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsOptional { get; set; }
    public bool IsActive { get; set; } = true;
}

public class GradeSubject : TenantSchoolEntityBase
{
    public Guid GradeId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid? AssignedTeacherStaffId { get; set; }
}
