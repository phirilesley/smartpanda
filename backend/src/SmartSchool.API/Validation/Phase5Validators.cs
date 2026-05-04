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
using FluentValidation;
using SmartSchool.API.Controllers.Phase5;

namespace SmartSchool.API.Validation;

public class CreateHelpDeskTicketRequestValidator : AbstractValidator<CreateHelpDeskTicketRequest>
{
    public CreateHelpDeskTicketRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.Priority).NotEmpty().MaximumLength(30);
        RuleFor(x => x.RequestedByUserId).NotEmpty();
    }
}

public class AddHelpDeskCommentRequestValidator : AbstractValidator<AddHelpDeskCommentRequest>
{
    public AddHelpDeskCommentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Comment).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.NewStatus).MaximumLength(30).When(x => x.NewStatus is not null);
    }
}
