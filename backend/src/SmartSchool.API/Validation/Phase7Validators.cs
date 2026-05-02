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
