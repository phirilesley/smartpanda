using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.API.Validation;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase3;

[ApiController]
[Route("api/finance/invoices")]
[Authorize(Policy = PolicyNames.FinanceManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
[ServiceFilter(typeof(SmartSchool.API.Validation.CrossEntityValidationFilter))]
public class StudentInvoicesController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<StudentInvoice>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid studentId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.StudentInvoices.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId != Guid.Empty) query = query.Where(x => x.StudentId == studentId);
        if (academicYearId != Guid.Empty) query = query.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) query = query.Where(x => x.TermId == termId);

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{invoiceId:guid}/lines")]
    public async Task<ActionResult<IReadOnlyList<StudentInvoiceLine>>> GetLines(Guid invoiceId, CancellationToken cancellationToken)
    {
        var invoice = await dbContext.StudentInvoices.AsNoTracking().FirstOrDefaultAsync(x => x.Id == invoiceId, cancellationToken);
        if (invoice is null) return NotFound();
        if (!User.CanAccessTenant(invoice.TenantId)) return Forbid();

        var lines = await dbContext.StudentInvoiceLines.AsNoTracking().Where(x => x.StudentInvoiceId == invoiceId).OrderBy(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(lines);
    }

    [HttpPost]
    public async Task<ActionResult<StudentInvoice>> Create([FromBody] CreateStudentInvoiceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();
        if (request.Lines.Count == 0) return BadRequest("At least one invoice line is required.");

        var student = await dbContext.Students.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.StudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (student is null) return BadRequest("Student does not exist for tenant/school.");

        foreach (var line in request.Lines)
        {
            var feeCatExists = await dbContext.FeeCategories.AsNoTracking().AnyAsync(x =>
                x.Id == line.FeeCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                cancellationToken);
            if (!feeCatExists) return BadRequest("Invalid fee category in invoice lines.");
        }

        var invoiceNumber = request.InvoiceNumber.Trim().ToUpperInvariant();
        var exists = await dbContext.StudentInvoices.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.InvoiceNumber == invoiceNumber,
            cancellationToken);

        if (exists) return Conflict("Invoice number already exists.");

        var total = request.Lines.Sum(x => x.Amount);

        var invoice = new StudentInvoice
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            GradeId = request.GradeId,
            InvoiceNumber = invoiceNumber,
            TotalAmount = total,
            Currency = request.Currency,
            Status = "Issued"
        };

        dbContext.StudentInvoices.Add(invoice);
        await dbContext.SaveChangesAsync(cancellationToken);

        var lines = request.Lines.Select(line => new StudentInvoiceLine
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentInvoiceId = invoice.Id,
            FeeCategoryId = line.FeeCategoryId,
            Description = line.Description.Trim(),
            Amount = line.Amount
        }).ToList();

        dbContext.StudentInvoiceLines.AddRange(lines);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(invoice);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StudentInvoice>> Update(Guid id, [FromBody] UpdateStudentInvoiceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var invoice = await dbContext.StudentInvoices.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (invoice is null) return NotFound();

        if (!User.CanAccessTenant(invoice.TenantId)) return Forbid();

        // Check if invoice has payments
        var hasPayments = await dbContext.Payments
            .AnyAsync(x => x.InvoiceId == id, cancellationToken);
        if (hasPayments)
        {
            return BadRequest("Cannot update invoice with existing payments.");
        }

        invoice.TotalAmount = request.TotalAmount;
        invoice.Currency = request.Currency;
        invoice.Status = request.Status;
        invoice.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(invoice);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var invoice = await dbContext.StudentInvoices.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (invoice is null) return NotFound();

        if (!User.CanAccessTenant(invoice.TenantId)) return Forbid();

        // Check if invoice has payments
        var hasPayments = await dbContext.Payments
            .AnyAsync(x => x.InvoiceId == id, cancellationToken);
        if (hasPayments)
        {
            return BadRequest("Cannot delete invoice with existing payments.");
        }

        // Remove invoice lines first
        var lines = await dbContext.StudentInvoiceLines.Where(x => x.StudentInvoiceId == id).ToListAsync(cancellationToken);
        dbContext.StudentInvoiceLines.RemoveRange(lines);

        // Remove invoice
        dbContext.StudentInvoices.Remove(invoice);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateStudentInvoiceRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid StudentId,
    Guid AcademicYearId,
    Guid TermId,
    Guid GradeId,
    string InvoiceNumber,
    CurrencyCode Currency,
    List<CreateStudentInvoiceLineRequest> Lines);

public sealed record CreateStudentInvoiceLineRequest(Guid FeeCategoryId, string Description, decimal Amount);

public sealed record UpdateStudentInvoiceRequest(Guid TenantId, decimal TotalAmount, CurrencyCode Currency, string Status);
