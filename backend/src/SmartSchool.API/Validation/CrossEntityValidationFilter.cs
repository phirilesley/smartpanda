using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SmartSchool.API.Validation;

namespace SmartSchool.API.Validation;

public class CrossEntityValidationFilter : IAsyncActionFilter
{
    private readonly CrossEntityValidationService _validationService;

    public CrossEntityValidationFilter(CrossEntityValidationService validationService)
    {
        _validationService = validationService;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var controllerName = context.Controller.GetType().Name;
        var actionName = context.ActionDescriptor.RouteValues["action"]?.ToString();
        var arguments = context.ActionArguments;

        try
        {
            var validationResult = await ValidateRequest(controllerName, actionName, arguments);
            
            if (!validationResult.IsValid)
            {
                context.Result = new BadRequestObjectResult(new
                {
                    success = false,
                    errors = validationResult.Errors,
                    warnings = validationResult.Warnings,
                    message = "Cross-entity validation failed"
                });
                return;
            }

            if (validationResult.Warnings.Any())
            {
                // Add warnings to HttpContext for controllers to access if needed
                context.HttpContext.Items["ValidationWarnings"] = validationResult.Warnings;
            }
        }
        catch (Exception ex)
        {
            // Log the exception but don't fail the request
            // Validation should not break the flow, only provide warnings/errors
            context.HttpContext.Items["ValidationError"] = ex.Message;
        }

        await next();
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateRequest(string controllerName, string? actionName, IDictionary<string, object> arguments)
    {
        return (controllerName, actionName) switch
        {
            ("StudentEnrollmentsController", "Create") => await ValidateStudentEnrollment(arguments),
            ("StudentInvoicesController", "Create") => await ValidateInvoiceGeneration(arguments),
            ("PaymentsController", "Create") => await ValidatePaymentProcessing(arguments),
            ("EventsController", "RegisterParticipants") => await ValidateEventRegistration(arguments),
            ("TransportController", "CreateAssignment") => await ValidateTransportAssignment(arguments),
            ("HostelsController", "CreateAllocation") => await ValidateHostelAllocation(arguments),
            ("HealthController", "CreateProfile") => await ValidateHealthRecordCreation(arguments),
            ("StudentMarksController", "Create") => await ValidateGradeAssignment(arguments),
            _ => new CrossEntityValidationService.ValidationResult { IsValid = true }
        };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateStudentEnrollment(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreateStudentEnrollmentRequest request)
        {
            return await _validationService.ValidateStudentEnrollment(
                request.StudentId, 
                request.ClassId, 
                request.AcademicYearId);
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateInvoiceGeneration(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreateStudentInvoiceRequest request)
        {
            return await _validationService.ValidateStudentInvoiceGeneration(
                request.StudentId, 
                request.AcademicYearId, 
                request.TermId);
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidatePaymentProcessing(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreatePaymentRequest request)
        {
            return await _validationService.ValidatePaymentProcessing(
                request.InvoiceId, 
                request.Amount);
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateEventRegistration(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is RegisterEventParticipantsRequest request)
        {
            var participantIds = request.Participants
                .Where(p => p.StudentId.HasValue)
                .Select(p => p.StudentId!.Value)
                .ToList();

            if (participantIds.Any() && arguments.TryGetValue("eventId", out var eventIdObj) && eventIdObj is Guid eventId)
            {
                return await _validationService.ValidateEventRegistration(eventId, participantIds);
            }
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateTransportAssignment(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreateTransportStudentAssignmentRequest request)
        {
            return await _validationService.ValidateTransportAssignment(
                request.StudentId,
                request.TransportRouteId,
                request.PickupStopId,
                request.DropoffStopId);
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateHostelAllocation(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreateHostelAllocationRequest request)
        {
            return await _validationService.ValidateHostelAllocation(
                request.StudentId,
                request.HostelBedId,
                request.StartDate,
                request.EndDate);
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateHealthRecordCreation(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreateHealthProfileRequest request)
        {
            if (request.StudentId.HasValue)
            {
                return await _validationService.ValidateHealthRecordCreation(request.StudentId.Value);
            }
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }

    private async Task<CrossEntityValidationService.ValidationResult> ValidateGradeAssignment(IDictionary<string, object> arguments)
    {
        if (arguments.TryGetValue("request", out var requestObj) && 
            requestObj is CreateStudentMarkRequest request)
        {
            return await _validationService.ValidateGradeAssignment(
                request.StudentId,
                request.SubjectId,
                request.Score,
                request.ExamSessionId);
        }

        return new CrossEntityValidationService.ValidationResult { IsValid = true };
    }
}
