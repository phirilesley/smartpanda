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
using SmartSchool.API.Controllers.Phase2;
using SmartSchool.Domain.Common;

namespace SmartSchool.API.Validation;

public class CreateStudentRequestValidator : AbstractValidator<CreateStudentRequest>
{
    public CreateStudentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentNumber).NotEmpty().MaximumLength(40);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Gender).NotEmpty().MaximumLength(20);
        RuleFor(x => x.DateOfBirth).LessThan(DateTime.UtcNow.Date);
        RuleFor(x => x.Status).MaximumLength(30).When(x => x.Status is not null);
    }
}

public class CreateGuardianRequestValidator : AbstractValidator<CreateGuardianRequest>
{
    public CreateGuardianRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Relationship).NotEmpty().MaximumLength(50);
    }
}

public class LinkStudentGuardianRequestValidator : AbstractValidator<LinkStudentGuardianRequest>
{
    public LinkStudentGuardianRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.GuardianId).NotEmpty();
    }
}

public class CreateStudentEnrollmentRequestValidator : AbstractValidator<CreateStudentEnrollmentRequest>
{
    public CreateStudentEnrollmentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.StreamId).NotEmpty();
        RuleFor(x => x.Status).MaximumLength(30).When(x => x.Status is not null);
    }
}

public class CreateStudentPromotionRequestValidator : AbstractValidator<CreateStudentPromotionRequest>
{
    public CreateStudentPromotionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.FromAcademicYearId).NotEmpty();
        RuleFor(x => x.ToAcademicYearId).NotEmpty();
        RuleFor(x => x.FromGradeId).NotEmpty();
        RuleFor(x => x.ToGradeId).NotEmpty();
        RuleFor(x => x.PromotionDate).NotEmpty();
        RuleFor(x => x.Remarks).MaximumLength(500).When(x => x.Remarks is not null);
        RuleFor(x => x.Decision).IsInEnum();

        When(x => x.Decision is EnrollmentDecision.Promoted or EnrollmentDecision.Repeated, () =>
        {
            RuleFor(x => x.ToTermId).NotEmpty();
            RuleFor(x => x.ToStreamId).NotEmpty();
        });
    }
}

public class CreateUploadedFileMetadataRequestValidator : AbstractValidator<CreateUploadedFileMetadataRequest>
{
    public CreateUploadedFileMetadataRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.OriginalFileName).NotEmpty().MaximumLength(260);
        RuleFor(x => x.StoredFileName).NotEmpty().MaximumLength(260);
        RuleFor(x => x.ContentType).NotEmpty().MaximumLength(120);
        RuleFor(x => x.SizeBytes).GreaterThanOrEqualTo(0);
        RuleFor(x => x.StoragePath).NotEmpty().MaximumLength(500);
        RuleFor(x => x.UploadedByUserId).NotEmpty();
    }
}
