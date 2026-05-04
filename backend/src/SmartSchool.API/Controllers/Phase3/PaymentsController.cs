using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase3;

[ApiController]
[Route("api/finance/payments")]
[Authorize(Policy = PolicyNames.FinanceManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class PaymentsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Payment>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid studentId, [FromQuery] Guid invoiceId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.Payments.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId != Guid.Empty) query = query.Where(x => x.StudentId == studentId);
        if (invoiceId != Guid.Empty) query = query.Where(x => x.InvoiceId == invoiceId);

        var items = await query.OrderByDescending(x => x.PaymentDate).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Payment>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Payments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<object>> Create([FromBody] CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var invoice = await dbContext.StudentInvoices.FirstOrDefaultAsync(x =>
            x.Id == request.InvoiceId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (invoice is null) return BadRequest("Invoice does not exist for tenant/school.");
        if (invoice.StudentId != request.StudentId) return BadRequest("Invoice does not belong to the provided student.");

        var totalPaid = await dbContext.Payments.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.InvoiceId == request.InvoiceId)
            .SumAsync(x => (decimal?)x.Amount, cancellationToken) ?? 0m;

        var outstanding = invoice.TotalAmount - totalPaid;
        if (request.Amount > outstanding) return BadRequest("Payment amount cannot exceed outstanding balance.");

        var userIdRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var receivedByUserId = Guid.TryParse(userIdRaw, out var uid) ? uid : Guid.Empty;

        var payment = new Payment
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            InvoiceId = request.InvoiceId,
            AcademicYearId = invoice.AcademicYearId,
            TermId = invoice.TermId,
            Amount = request.Amount,
            Currency = request.Currency,
            Method = request.Method.Trim(),
            Reference = request.Reference.Trim(),
            PaymentDate = request.PaymentDate,
            ReceivedByUserId = receivedByUserId
        };

        dbContext.Payments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);

        var receipt = new Receipt
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            PaymentId = payment.Id,
            ReceiptNumber = GenerateReceiptNumber(),
            IssuedAtUtc = DateTime.UtcNow,
            Amount = payment.Amount
        };

        dbContext.Receipts.Add(receipt);

        var newOutstanding = outstanding - request.Amount;
        invoice.Status = newOutstanding <= 0m ? "Paid" : "PartiallyPaid";
        invoice.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            id = payment.Id,
            payment,
            receipt,
            outstandingBalance = newOutstanding
        });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Payment>> Update(Guid id, [FromBody] UpdatePaymentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var payment = await dbContext.Payments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (payment is null) return NotFound();

        if (!User.CanAccessTenant(payment.TenantId)) return Forbid();

        payment.Amount = request.Amount;
        payment.Currency = request.Currency;
        payment.Method = request.Method.Trim();
        payment.Reference = request.Reference.Trim();
        payment.PaymentDate = request.PaymentDate;
        payment.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(payment);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var payment = await dbContext.Payments.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (payment is null) return NotFound();

        if (!User.CanAccessTenant(payment.TenantId)) return Forbid();

        // Remove associated receipt
        var receipt = await dbContext.Receipts.FirstOrDefaultAsync(x => x.PaymentId == id, cancellationToken);
        if (receipt is not null)
        {
            dbContext.Receipts.Remove(receipt);
        }

        // Update invoice status
        var invoice = await dbContext.StudentInvoices.FirstOrDefaultAsync(x => x.Id == payment.InvoiceId, cancellationToken);
        if (invoice is not null)
        {
            var totalPaid = await dbContext.Payments.AsNoTracking()
                .Where(x => x.TenantId == payment.TenantId && x.SchoolId == payment.SchoolId && x.InvoiceId == payment.InvoiceId && x.Id != id)
                .SumAsync(x => (decimal?)x.Amount, cancellationToken) ?? 0m;

            invoice.Status = totalPaid >= invoice.TotalAmount ? "Paid" : totalPaid > 0 ? "PartiallyPaid" : "Issued";
            invoice.UpdatedAtUtc = DateTime.UtcNow;
        }

        dbContext.Payments.Remove(payment);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static string GenerateReceiptNumber()
    {
        return $"RCPT-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}";
    }
}

public sealed record CreatePaymentRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid StudentId,
    Guid InvoiceId,
    decimal Amount,
    CurrencyCode Currency,
    string Method,
    string Reference,
    DateTime PaymentDate);

public sealed record UpdatePaymentRequest(Guid TenantId, decimal Amount, CurrencyCode Currency, string Method, string Reference, DateTime PaymentDate);

public sealed record PaymentWithReceiptResponse(Payment Payment, Receipt Receipt, decimal OutstandingBalance);
