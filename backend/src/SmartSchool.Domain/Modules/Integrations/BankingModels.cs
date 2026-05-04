using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Integrations;

public class BankingIntegration : TenantSchoolEntityBase
{
    public string BankName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string BranchCode { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class BankTransaction : TenantSchoolEntityBase
{
    public string Reference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Matched, Disputed
    public Guid? StudentId { get; set; }
    public Guid? InvoiceId { get; set; }
}

public class EcocashTransaction : TenantSchoolEntityBase
{
    public string MerchantReference { get; set; } = string.Empty;
    public string PollUrl { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime InitiatedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
}
