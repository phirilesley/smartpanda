using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Exams;

public class ExamType : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public decimal WeightPercent { get; set; }
    public bool IsContinuousAssessment { get; set; }
}

public class ExamSession : TenantSchoolEntityBase
{
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class MarkSheet : TenantSchoolEntityBase
{
    public Guid ExamSessionId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid GradeId { get; set; }
    public Guid StreamId { get; set; }
    public Guid TeacherStaffId { get; set; }
    public bool IsSubmitted { get; set; }
}

public class StudentMark : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid EnrollmentId { get; set; }
    public Guid ExamSessionId { get; set; }
    public Guid SubjectId { get; set; }
    public decimal Mark { get; set; }
    public string Grade { get; set; } = string.Empty;
    public Guid EnteredByStaffId { get; set; }
    public DateTime? ApprovedAtUtc { get; set; }
}

public class GradeScale : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public decimal MinMark { get; set; }
    public decimal MaxMark { get; set; }
    public string LetterGrade { get; set; } = string.Empty;
    public decimal Points { get; set; }
}

public class ResultApproval : TenantSchoolEntityBase
{
    public Guid ExamSessionId { get; set; }
    public Guid ApprovedByUserId { get; set; }
    public DateTime ApprovedAtUtc { get; set; }
    public string Comments { get; set; } = string.Empty;
}

public class ReportCard : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public decimal TotalMarks { get; set; }
    public decimal AverageMark { get; set; }
    public int PositionInClass { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAtUtc { get; set; }
}
