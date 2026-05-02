using FluentValidation;
using SmartSchool.API.Controllers.Phase3;
using SmartSchool.Domain.Common;

namespace SmartSchool.API.Validation;

public class CreateFeeCategoryRequestValidator : AbstractValidator<CreateFeeCategoryRequest>
{
    public CreateFeeCategoryRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(500);
    }
}

public class CreateFeeStructureRequestValidator : AbstractValidator<CreateFeeStructureRequest>
{
    public CreateFeeStructureRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.FeeCategoryId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.Currency).IsInEnum();
    }
}

public class CreateStudentInvoiceRequestValidator : AbstractValidator<CreateStudentInvoiceRequest>
{
    public CreateStudentInvoiceRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.InvoiceNumber).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Currency).IsInEnum();
        RuleFor(x => x.Lines).NotNull().Must(x => x.Count > 0);
    }
}

public class UpdateFeeCategoryRequestValidator : AbstractValidator<UpdateFeeCategoryRequest>
{
    public UpdateFeeCategoryRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(500);
    }
}

public class UpdateFeeStructureRequestValidator : AbstractValidator<UpdateFeeStructureRequest>
{
    public UpdateFeeStructureRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.FeeCategoryId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.Currency).IsInEnum();
    }
}

public class UpdatePaymentPlanRequestValidator : AbstractValidator<UpdatePaymentPlanRequest>
{
    public UpdatePaymentPlanRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.InvoiceId).NotEmpty();
        RuleFor(x => x.Installments).GreaterThan(0);
        RuleFor(x => x.StartDate).LessThan(x => x.EndDate);
    }
}

public class CreateStudentInvoiceLineRequestValidator : AbstractValidator<CreateStudentInvoiceLineRequest>
{
    public CreateStudentInvoiceLineRequestValidator()
    {
        RuleFor(x => x.FeeCategoryId).NotEmpty();
        RuleFor(x => x.Description).NotEmpty().MaximumLength(250);
        RuleFor(x => x.Amount).GreaterThan(0);
    }
}

public class CreatePaymentRequestValidator : AbstractValidator<CreatePaymentRequest>
{
    public CreatePaymentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.InvoiceId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.Currency).IsInEnum();
        RuleFor(x => x.Method).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Reference).NotEmpty().MaximumLength(120);
        RuleFor(x => x.PaymentDate).NotEmpty();
    }
}

public class CreatePaymentPlanRequestValidator : AbstractValidator<CreatePaymentPlanRequest>
{
    public CreatePaymentPlanRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.InvoiceId).NotEmpty();
        RuleFor(x => x.Installments).InclusiveBetween(1, 36);
        RuleFor(x => x.StartDate).LessThanOrEqualTo(x => x.EndDate);
        RuleFor(x => x.Status).MaximumLength(30).When(x => x.Status is not null);
    }
}
