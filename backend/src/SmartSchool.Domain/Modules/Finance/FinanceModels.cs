using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Finance;

public class FeeCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsMandatory { get; set; }
}

public class FeeStructure : TenantSchoolEntityBase
{
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid FeeCategoryId { get; set; }
    public decimal Amount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
}

public class StudentInvoice : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public string Status { get; set; } = string.Empty;
}

public class StudentInvoiceLine : TenantSchoolEntityBase
{
    public Guid StudentInvoiceId { get; set; }
    public Guid FeeCategoryId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class Payment : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid InvoiceId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public decimal Amount { get; set; }
    public CurrencyCode Currency { get; set; } = CurrencyCode.USD;
    public string Method { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public Guid ReceivedByUserId { get; set; }
}

public class Receipt : TenantSchoolEntityBase
{
    public Guid PaymentId { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime IssuedAtUtc { get; set; }
    public decimal Amount { get; set; }
}

public class Discount : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class Scholarship : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public decimal Amount { get; set; }
    public string Sponsor { get; set; } = string.Empty;
}

public class PaymentPlan : TenantSchoolEntityBase
{
    public Guid StudentId { get; set; }
    public Guid InvoiceId { get; set; }
    public int Installments { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
}
