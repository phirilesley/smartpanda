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
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Validation;

public class CrossEntityValidationService(SmartSchoolDbContext dbContext)
{
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = [];
        public List<string> Warnings { get; set; } = [];
    }

    public async Task<ValidationResult> ValidateStudentEnrollment(Guid studentId, Guid gradeId, Guid academicYearId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        var studentExists = await dbContext.Students.AnyAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);
        if (!studentExists)
        {
            result.IsValid = false;
            result.Errors.Add("Student not found.");
            return result;
        }

        var gradeExists = await dbContext.Grades.AnyAsync(g => g.Id == gradeId && !g.IsDeleted, cancellationToken);
        if (!gradeExists)
        {
            result.IsValid = false;
            result.Errors.Add("Grade not found.");
            return result;
        }

        var yearExists = await dbContext.AcademicYears.AnyAsync(y => y.Id == academicYearId && !y.IsDeleted, cancellationToken);
        if (!yearExists)
        {
            result.IsValid = false;
            result.Errors.Add("Academic year not found.");
        }

        return result;
    }

    public async Task<ValidationResult> ValidateStudentInvoiceGeneration(Guid studentId, Guid academicYearId, Guid termId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        var studentExists = await dbContext.Students.AnyAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);
        var yearExists = await dbContext.AcademicYears.AnyAsync(y => y.Id == academicYearId && !y.IsDeleted, cancellationToken);
        var termExists = await dbContext.Terms.AnyAsync(t => t.Id == termId && t.AcademicYearId == academicYearId && !t.IsDeleted, cancellationToken);

        if (!studentExists) result.Errors.Add("Student not found.");
        if (!yearExists) result.Errors.Add("Academic year not found.");
        if (!termExists) result.Errors.Add("Term not found for academic year.");

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    public async Task<ValidationResult> ValidatePaymentProcessing(Guid invoiceId, decimal paymentAmount, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult { IsValid = true };

        if (paymentAmount <= 0)
        {
            result.Errors.Add("Payment amount must be greater than zero.");
        }

        var invoice = await dbContext.StudentInvoices.FirstOrDefaultAsync(i => i.Id == invoiceId && !i.IsDeleted, cancellationToken);
        if (invoice is null)
        {
            result.Errors.Add("Invoice not found.");
        }
        else
        {
            var paid = await dbContext.Payments
                .Where(p => p.InvoiceId == invoiceId && !p.IsDeleted)
                .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0m;

            var balance = invoice.TotalAmount - paid;
            if (paymentAmount > balance)
            {
                result.Errors.Add($"Payment amount exceeds outstanding balance ({balance:0.00}).");
            }
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }
}
