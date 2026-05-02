using FluentValidation;
using SmartSchool.API.Controllers.Auth;
using SmartSchool.API.Controllers.Phase1;

namespace SmartSchool.API.Validation;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.UserName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8).MaximumLength(100);
        RuleFor(x => x.Role).Must(x => string.IsNullOrWhiteSpace(x) || x == "PlatformOwner" || x == "TenantOwner" || x == "SchoolAdmin")
            .WithMessage("Role must be PlatformOwner, TenantOwner, or SchoolAdmin.");
    }
}

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public class RefreshRequestValidator : AbstractValidator<RefreshRequest>
{
    public RefreshRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.RefreshToken).NotEmpty().MaximumLength(500);
    }
}

public class CreateTenantRequestValidator : AbstractValidator<CreateTenantRequest>
{
    public CreateTenantRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.ContactEmail).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.ContactPhone).NotEmpty().MaximumLength(30);
    }
}

public class CreateSchoolRequestValidator : AbstractValidator<CreateSchoolRequest>
{
    public CreateSchoolRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Phone).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Address).NotEmpty().MaximumLength(500);
    }
}

public class CreateAcademicYearRequestValidator : AbstractValidator<CreateAcademicYearRequest>
{
    public CreateAcademicYearRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
        RuleFor(x => x.StartDate).LessThan(x => x.EndDate);
    }
}

public class CreateTermRequestValidator : AbstractValidator<CreateTermRequest>
{
    public CreateTermRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
        RuleFor(x => x.TermNumber).InclusiveBetween(1, 3);
        RuleFor(x => x.StartDate).LessThan(x => x.EndDate);
    }
}

public class CreateGradeRequestValidator : AbstractValidator<CreateGradeRequest>
{
    public CreateGradeRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.GradeOrder).GreaterThan(0);
    }
}

public class CreateAcademicStreamRequestValidator : AbstractValidator<CreateAcademicStreamRequest>
{
    public CreateAcademicStreamRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Capacity).InclusiveBetween(1, 2000);
    }
}

public class CreateSubjectRequestValidator : AbstractValidator<CreateSubjectRequest>
{
    public CreateSubjectRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Code).NotEmpty().MaximumLength(30);
    }
}

public class UpsertSchoolSettingRequestValidator : AbstractValidator<UpsertSchoolSettingRequest>
{
    public UpsertSchoolSettingRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100);
        RuleFor(x => x.SettingKey).NotEmpty().MaximumLength(120);
        RuleFor(x => x.SettingValue).NotEmpty().MaximumLength(4000);
    }
}

public class UpsertMasterDataItemRequestValidator : AbstractValidator<UpsertMasterDataItemRequest>
{
    public UpsertMasterDataItemRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.DataType).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}
