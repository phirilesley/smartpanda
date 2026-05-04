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
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SmartSchool.API.Validation;

public class CrossEntityValidationFilter(CrossEntityValidationService validationService) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var controllerName = context.Controller.GetType().Name;
        var actionName = context.ActionDescriptor.RouteValues["action"]?.ToString();
        var request = context.ActionArguments.TryGetValue("request", out var value) ? value : null;

        CrossEntityValidationService.ValidationResult result = new() { IsValid = true };

        if (request is not null)
        {
            result = (controllerName, actionName) switch
            {
                ("StudentEnrollmentsController", "Create") => await ValidateStudentEnrollment(request),
                ("StudentInvoicesController", "Create") => await ValidateInvoice(request),
                ("PaymentsController", "Create") => await ValidatePayment(request),
                _ => result
            };
        }

        if (!result.IsValid)
        {
            context.Result = new BadRequestObjectResult(new
            {
                success = false,
                errors = result.Errors,
                warnings = result.Warnings,
                message = "Cross-entity validation failed"
            });
            return;
        }

        if (result.Warnings.Count > 0)
        {
            context.HttpContext.Items["ValidationWarnings"] = result.Warnings;
        }

        await next();
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateStudentEnrollment(object request)
    {
        var studentId = GetGuid(request, "StudentId");
        var gradeId = GetGuid(request, "GradeId");
        var yearId = GetGuid(request, "AcademicYearId");
        return studentId.HasValue && gradeId.HasValue && yearId.HasValue
            ? await validationService.ValidateStudentEnrollment(studentId.Value, gradeId.Value, yearId.Value)
            : new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateInvoice(object request)
    {
        var studentId = GetGuid(request, "StudentId");
        var yearId = GetGuid(request, "AcademicYearId");
        var termId = GetGuid(request, "TermId");
        return studentId.HasValue && yearId.HasValue && termId.HasValue
            ? await validationService.ValidateStudentInvoiceGeneration(studentId.Value, yearId.Value, termId.Value)
            : new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidatePayment(object request)
    {
        var invoiceId = GetGuid(request, "InvoiceId");
        var amount = GetDecimal(request, "Amount");
        return invoiceId.HasValue && amount.HasValue
            ? await validationService.ValidatePaymentProcessing(invoiceId.Value, amount.Value)
            : new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private static Guid? GetGuid(object obj, string property)
    {
        var prop = obj.GetType().GetProperty(property);
        if (prop?.GetValue(obj) is Guid guid && guid != Guid.Empty) return guid;
        return null;
    }

    private static decimal? GetDecimal(object obj, string property)
    {
        var prop = obj.GetType().GetProperty(property);
        if (prop?.GetValue(obj) is decimal d) return d;
        return null;
    }
}
