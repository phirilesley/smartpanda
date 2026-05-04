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
using SmartSchool.Persistence.Data;
using System.Text.Json;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/zimbabwe-payments")]
[Route("api/payments-zw")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ZimbabwePaymentsController(SmartSchoolDbContext dbContext, IHttpClientFactory httpClientFactory) : ControllerBase
{
    private readonly HttpClient _httpClient = httpClientFactory.CreateClient();

    [HttpPost("paynow/initiate")]
    public async Task<ActionResult<PaynowResponse>> InitiatePaynowPayment([FromBody] PaynowPaymentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        // Create payment record
        var payment = new ZimbabwePayment
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            InvoiceId = request.InvoiceId,
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            PaymentMethod = "Paynow",
            Amount = request.Amount,
            Currency = "USD",
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            Reference = GeneratePaymentReference(),
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.ZimbabwePayments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Initiate Paynow payment
        var paynowResponse = await InitiatePaynowTransaction(payment, request.ReturnUrl, request.ResultUrl, cancellationToken);

        // Update payment with Paynow details
        payment.ExternalReference = paynowResponse.PollUrl;
        payment.PaymentUrl = paynowResponse.RedirectUrl;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(paynowResponse);
    }

    [HttpPost("ecocash/initiate")]
    public async Task<ActionResult<EcoCashResponse>> InitiateEcoCashPayment([FromBody] EcoCashPaymentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var payment = new ZimbabwePayment
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            InvoiceId = request.InvoiceId,
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            PaymentMethod = "EcoCash",
            Amount = request.Amount,
            Currency = "USD",
            PhoneNumber = request.PhoneNumber,
            Reference = GeneratePaymentReference(),
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.ZimbabwePayments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Initiate EcoCash payment
        var ecocashResponse = await InitiateEcoCashTransaction(payment, cancellationToken);

        payment.ExternalReference = ecocashResponse.TransactionId;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ecocashResponse);
    }

    [HttpPost("bank-transfer/cbz")]
    public async Task<ActionResult<BankTransferResponse>> InitiateCBZTransfer([FromBody] BankTransferRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var payment = new ZimbabwePayment
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            InvoiceId = request.InvoiceId,
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            PaymentMethod = "CBZ Bank",
            Amount = request.Amount,
            Currency = "USD",
            BankAccountNumber = request.AccountNumber,
            BankName = "CBZ Bank",
            Reference = GeneratePaymentReference(),
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.ZimbabwePayments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new BankTransferResponse
        {
            PaymentId = payment.Id,
            Reference = payment.Reference,
            BankName = "CBZ Bank",
            AccountNumber = MaskAccountNumber(request.AccountNumber),
            Amount = request.Amount,
            Status = "Awaiting Transfer",
            Instructions = "Please transfer the amount to the CBZ Bank account using the provided reference."
        };

        return Ok(response);
    }

    [HttpPost("bank-transfer/steward")]
    public async Task<ActionResult<BankTransferResponse>> InitiateStewardTransfer([FromBody] BankTransferRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var payment = new ZimbabwePayment
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            InvoiceId = request.InvoiceId,
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            PaymentMethod = "Steward Bank",
            Amount = request.Amount,
            Currency = "USD",
            BankAccountNumber = request.AccountNumber,
            BankName = "Steward Bank",
            Reference = GeneratePaymentReference(),
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.ZimbabwePayments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new BankTransferResponse
        {
            PaymentId = payment.Id,
            Reference = payment.Reference,
            BankName = "Steward Bank",
            AccountNumber = MaskAccountNumber(request.AccountNumber),
            Amount = request.Amount,
            Status = "Awaiting Transfer",
            Instructions = "Please transfer the amount to the Steward Bank account using the provided reference."
        };

        return Ok(response);
    }

    [HttpPost("bank-transfer/stanbic")]
    public async Task<ActionResult<BankTransferResponse>> InitiateStanbicTransfer([FromBody] BankTransferRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var payment = new ZimbabwePayment
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            InvoiceId = request.InvoiceId,
            StudentId = request.StudentId,
            GuardianId = request.GuardianId,
            PaymentMethod = "Stanbic Bank",
            Amount = request.Amount,
            Currency = "USD",
            BankAccountNumber = request.AccountNumber,
            BankName = "Stanbic Bank",
            Reference = GeneratePaymentReference(),
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.ZimbabwePayments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new BankTransferResponse
        {
            PaymentId = payment.Id,
            Reference = payment.Reference,
            BankName = "Stanbic Bank",
            AccountNumber = MaskAccountNumber(request.AccountNumber),
            Amount = request.Amount,
            Status = "Awaiting Transfer",
            Instructions = "Please transfer the amount to the Stanbic Bank account using the provided reference."
        };

        return Ok(response);
    }

    [HttpPost("verify/{paymentId:guid}")]
    public async Task<ActionResult<PaymentVerificationResponse>> VerifyPayment(Guid paymentId, CancellationToken cancellationToken)
    {
        var payment = await dbContext.ZimbabwePayments.FirstOrDefaultAsync(p => p.Id == paymentId && !p.IsDeleted, cancellationToken);
        if (payment is null) return NotFound();
        if (!User.CanAccessTenant(payment.TenantId)) return Forbid();

        var verification = await VerifyExternalPayment(payment, cancellationToken);
        
        // Update payment status
        payment.Status = verification.Status;
        payment.ExternalTransactionId = verification.TransactionId;
        payment.CompletedAtUtc = verification.CompletedAt;
        payment.UpdatedAtUtc = DateTime.UtcNow;

        if (verification.Status == "Completed")
        {
            // Create payment record in main payments table
            var mainPayment = new Payment
            {
                Id = Guid.NewGuid(),
                TenantId = payment.TenantId,
                SchoolId = payment.SchoolId,
                InvoiceId = payment.InvoiceId,
                StudentId = payment.StudentId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = verification.CompletedAt ?? DateTime.UtcNow,
                Reference = payment.Reference,
                Status = "Completed",
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            };

            dbContext.Payments.Add(mainPayment);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(verification);
    }

    [HttpGet("methods")]
    public async Task<ActionResult<PaymentMethod[]>> GetAvailablePaymentMethods([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var methods = new[]
        {
            new PaymentMethod
            {
                Code = "paynow",
                Name = "Paynow",
                Description = "Pay using mobile money (EcoCash, OneMoney, etc.)",
                Icon = "mobile",
                Enabled = true,
                SupportedCurrencies = new[] { "USD", "ZWL" }
            },
            new PaymentMethod
            {
                Code = "ecocash",
                Name = "EcoCash Direct",
                Description = "Direct EcoCash payment",
                Icon = "phone",
                Enabled = true,
                SupportedCurrencies = new[] { "USD", "ZWL" }
            },
            new PaymentMethod
            {
                Code = "cbz",
                Name = "CBZ Bank Transfer",
                Description = "Transfer to CBZ Bank account",
                Icon = "bank",
                Enabled = true,
                SupportedCurrencies = new[] { "USD", "ZWL" }
            },
            new PaymentMethod
            {
                Code = "steward",
                Name = "Steward Bank Transfer",
                Description = "Transfer to Steward Bank account",
                Icon = "bank",
                Enabled = true,
                SupportedCurrencies = new[] { "USD", "ZWL" }
            },
            new PaymentMethod
            {
                Code = "stanbic",
                Name = "Stanbic Bank Transfer",
                Description = "Transfer to Stanbic Bank account",
                Icon = "bank",
                Enabled = true,
                SupportedCurrencies = new[] { "USD", "ZWL" }
            }
        };

        return Ok(methods);
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<IReadOnlyList<ZimbabwePayment>>> GetTransactions([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.ZimbabwePayments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && !x.IsDeleted);

        if (fromDate.HasValue) query = query.Where(x => x.CreatedAtUtc >= fromDate.Value);
        if (toDate.HasValue) query = query.Where(x => x.CreatedAtUtc <= toDate.Value);

        var transactions = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(transactions);
    }

    private async Task<PaynowResponse> InitiatePaynowTransaction(ZimbabwePayment payment, string returnUrl, string resultUrl, CancellationToken cancellationToken)
    {
        // Simulate Paynow API call
        // In production, this would make actual API calls to Paynow
        await Task.Delay(100, cancellationToken); // Simulate network latency

        return new PaynowResponse
        {
            Success = true,
            RedirectUrl = $"https://www.paynow.co.zw/Interface/Payment?link={Guid.NewGuid()}",
            PollUrl = $"https://www.paynow.co.zw/Interface/Payment?poll={Guid.NewGuid()}",
            Reference = payment.Reference
        };
    }

    private async Task<EcoCashResponse> InitiateEcoCashTransaction(ZimbabwePayment payment, CancellationToken cancellationToken)
    {
        // Simulate EcoCash API call
        await Task.Delay(100, cancellationToken);

        return new EcoCashResponse
        {
            Success = true,
            TransactionId = Guid.NewGuid().ToString(),
            Reference = payment.Reference,
            Instructions = $"Please dial *151# and approve the payment for {payment.Amount} USD"
        };
    }

    private async Task<PaymentVerificationResponse> VerifyExternalPayment(ZimbabwePayment payment, CancellationToken cancellationToken)
    {
        // Simulate payment verification
        await Task.Delay(100, cancellationToken);

        // Randomly complete some payments for demo
        var isCompleted = DateTime.UtcNow.Subtract(payment.CreatedAtUtc).TotalMinutes > 5;

        return new PaymentVerificationResponse
        {
            Status = isCompleted ? "Completed" : "Pending",
            TransactionId = Guid.NewGuid().ToString(),
            CompletedAt = isCompleted ? DateTime.UtcNow : null,
            Amount = payment.Amount,
            Currency = payment.Currency
        };
    }

    private string GeneratePaymentReference()
    {
        return $"SPS-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";
    }

    private string MaskAccountNumber(string accountNumber)
    {
        if (string.IsNullOrEmpty(accountNumber) || accountNumber.Length < 4)
            return "****";
        
        return "****" + accountNumber.Substring(accountNumber.Length - 4);
    }
}

// â”€â”€â”€ Domain Entity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

public class ZimbabwePayment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
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
    public string? ExternalReference { get; set; }
    public string? ExternalTransactionId { get; set; }
    public string? PaymentUrl { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAtUtc { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
}

// â”€â”€â”€ DTOs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

public sealed record PaynowPaymentRequest(Guid TenantId, Guid SchoolId, Guid InvoiceId, Guid StudentId, Guid? GuardianId, decimal Amount, string PhoneNumber, string? Email, string ReturnUrl, string ResultUrl);
public sealed record PaynowResponse(bool Success, string RedirectUrl, string PollUrl, string Reference);
public sealed record EcoCashPaymentRequest(Guid TenantId, Guid SchoolId, Guid InvoiceId, Guid StudentId, Guid? GuardianId, decimal Amount, string PhoneNumber);
public sealed record EcoCashResponse(bool Success, string TransactionId, string Reference, string Instructions);
public sealed record BankTransferRequest(Guid TenantId, Guid SchoolId, Guid InvoiceId, Guid StudentId, Guid? GuardianId, decimal Amount, string AccountNumber);
public sealed record BankTransferResponse(Guid PaymentId, string Reference, string BankName, string AccountNumber, decimal Amount, string Status, string Instructions);
public sealed record PaymentVerificationResponse(string Status, string TransactionId, DateTime? CompletedAt, decimal Amount, string Currency);
public sealed record PaymentMethod(string Code, string Name, string Description, string Icon, bool Enabled, string[] SupportedCurrencies);
