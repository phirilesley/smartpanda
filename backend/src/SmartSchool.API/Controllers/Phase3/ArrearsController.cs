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

namespace SmartSchool.API.Controllers.Phase3;

[ApiController]
[Route("api/finance/reports/arrears")]
[Authorize(Policy = PolicyNames.FinanceManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ArrearsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ArrearsItemResponse>>> Get([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var invoicesQuery = dbContext.StudentInvoices.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);

        if (academicYearId != Guid.Empty) invoicesQuery = invoicesQuery.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) invoicesQuery = invoicesQuery.Where(x => x.TermId == termId);

        var invoices = await invoicesQuery.ToListAsync(cancellationToken);
        var invoiceIds = invoices.Select(x => x.Id).ToList();

        var paidMap = await dbContext.Payments.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && invoiceIds.Contains(x.InvoiceId))
            .GroupBy(x => x.InvoiceId)
            .Select(g => new { InvoiceId = g.Key, Paid = g.Sum(x => x.Amount) })
            .ToListAsync(cancellationToken);

        var students = await dbContext.Students.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .ToDictionaryAsync(x => x.Id, cancellationToken);

        var paidDict = paidMap.ToDictionary(x => x.InvoiceId, x => x.Paid);

        var result = invoices
            .Select(inv =>
            {
                paidDict.TryGetValue(inv.Id, out var paid);
                var balance = inv.TotalAmount - paid;
                students.TryGetValue(inv.StudentId, out var student);
                return new ArrearsItemResponse(
                    inv.Id,
                    inv.InvoiceNumber,
                    inv.StudentId,
                    student?.StudentNumber ?? string.Empty,
                    student is null ? string.Empty : $"{student.FirstName} {student.LastName}",
                    inv.TotalAmount,
                    paid,
                    balance,
                    inv.Currency.ToString(),
                    inv.Status);
            })
            .Where(x => x.Balance > 0)
            .OrderByDescending(x => x.Balance)
            .ToList();

        return Ok(result);
    }
}

public sealed record ArrearsItemResponse(
    Guid InvoiceId,
    string InvoiceNumber,
    Guid StudentId,
    string StudentNumber,
    string StudentName,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal Balance,
    string Currency,
    string Status);
