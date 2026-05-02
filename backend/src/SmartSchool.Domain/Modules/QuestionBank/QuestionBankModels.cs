using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.QuestionBank;

public class QuestionPaperCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public Guid SubjectId { get; set; }
    public Guid GradeId { get; set; }
}

public class QuestionPaper : TenantSchoolEntityBase
{
    public Guid QuestionPaperCategoryId { get; set; }
    public Guid UploadedFileId { get; set; }
    public int ExamYear { get; set; }
    public string ExamType { get; set; } = string.Empty;
}

public class QuestionPaperDownload : TenantSchoolEntityBase
{
    public Guid QuestionPaperId { get; set; }
    public Guid DownloadedByUserId { get; set; }
    public DateTime DownloadedAtUtc { get; set; }
}
