using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Library;

public class BookCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
}

public class Book : TenantSchoolEntityBase
{
    public Guid BookCategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Isbn { get; set; } = string.Empty;
}

public class BookCopy : TenantSchoolEntityBase
{
    public Guid BookId { get; set; }
    public string CopyNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class BookIssue : TenantSchoolEntityBase
{
    public Guid BookCopyId { get; set; }
    public Guid BorrowerStudentId { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnedDate { get; set; }
}

public class LibraryFine : TenantSchoolEntityBase
{
    public Guid BookIssueId { get; set; }
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
}
