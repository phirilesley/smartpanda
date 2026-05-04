using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Integrations;

public class ZimbabwePayment : TenantSchoolEntityBase
{
    public Guid InvoiceId { get; set; }
    public Guid StudentId { get; set; }
    public Guid? GuardianId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? BankName { get; set; }
    public string Reference { get; set; } = string.Empty;
    public string ExternalReference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Pending, Paid, Failed, Refunded
    public string? FailureReason { get; set; }
    public DateTime? PaidAtUtc { get; set; }
}
