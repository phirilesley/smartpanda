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
using SmartSchool.API.Controllers.Phase7;

namespace SmartSchool.API.Validation;

public class UpsertTenantFeatureFlagRequestValidator : AbstractValidator<UpsertTenantFeatureFlagRequest>
{
    public UpsertTenantFeatureFlagRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.FeatureCode).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Description).MaximumLength(400);
    }
}
