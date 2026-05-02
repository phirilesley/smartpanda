using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase3;

[ApiController]
[Route("api/finance/payment-plans")]
[Authorize(Policy = PolicyNames.FinanceManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class PaymentPlansController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PaymentPlan>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid studentId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.PaymentPlans.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId != Guid.Empty) query = query.Where(x => x.StudentId == studentId);

        var items = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<PaymentPlan>> Create([FromBody] CreatePaymentPlanRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var invoice = await dbContext.StudentInvoices.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.InvoiceId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (invoice is null) return BadRequest("Invoice does not exist for tenant/school.");
        if (invoice.StudentId != request.StudentId) return BadRequest("Invoice does not belong to student.");

        var entity = new PaymentPlan
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            InvoiceId = request.InvoiceId,
            Installments = request.Installments,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = string.IsNullOrWhiteSpace(request.Status) ? "Active" : request.Status.Trim()
        };

        dbContext.PaymentPlans.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PaymentPlan>> Update(Guid id, [FromBody] UpdatePaymentPlanRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = await dbContext.PaymentPlans.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == request.TenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Validate invoice if it's being changed
        if (request.InvoiceId != entity.InvoiceId)
        {
            var invoice = await dbContext.StudentInvoices.AsNoTracking().FirstOrDefaultAsync(x =>
                x.Id == request.InvoiceId && x.TenantId == request.TenantId && x.SchoolId == entity.SchoolId,
                cancellationToken);

            if (invoice is null) return BadRequest("Invoice does not exist for tenant/school.");
            if (invoice.StudentId != entity.StudentId) return BadRequest("Invoice does not belong to current payment plan student.");
        }

        entity.Installments = request.Installments;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.Status = string.IsNullOrWhiteSpace(request.Status) ? "Active" : request.Status.Trim();

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var entity = await dbContext.PaymentPlans.FirstOrDefaultAsync(x => x.Id == id && x.TenantId == tenantId, cancellationToken);
        if (entity is null) return NotFound();

        // Check if plan has payments
        var hasPayments = await dbContext.Payments.AsNoTracking().AnyAsync(x => x.InvoiceId == entity.InvoiceId, cancellationToken);
        if (hasPayments) return BadRequest("Cannot delete payment plan that has associated payments.");

        dbContext.PaymentPlans.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreatePaymentPlanRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid InvoiceId, int Installments, DateTime StartDate, DateTime EndDate, string? Status);
public sealed record UpdatePaymentPlanRequest(Guid TenantId, Guid InvoiceId, int Installments, DateTime StartDate, DateTime EndDate, string? Status);
