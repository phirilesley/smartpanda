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
using SmartSchool.API.Controllers.Phase4;

namespace SmartSchool.API.Validation;

public class CreateExamTypeRequestValidator : AbstractValidator<CreateExamTypeRequest>
{
    public CreateExamTypeRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ResolveWeightPercent()).InclusiveBetween(0, 100);
    }
}

public class CreateExamSessionRequestValidator : AbstractValidator<CreateExamSessionRequest>
{
    public CreateExamSessionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.ResolveStartDate()).LessThanOrEqualTo(x => x.ResolveEndDate());
        RuleFor(x => x.Status).MaximumLength(30).When(x => x.Status is not null);
    }
}

public class UpsertStudentMarksRequestValidator : AbstractValidator<UpsertStudentMarksRequest>
{
    public UpsertStudentMarksRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ExamSessionId).NotEmpty();
        RuleFor(x => x.Items).NotNull().Must(x => x.Count > 0);
    }
}

public class UpsertStudentMarkItemValidator : AbstractValidator<UpsertStudentMarkItem>
{
    public UpsertStudentMarkItemValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.EnrollmentId).NotEmpty();
        RuleFor(x => x.SubjectId).NotEmpty();
        RuleFor(x => x.Mark).InclusiveBetween(0, 100);
        RuleFor(x => x.Grade).MaximumLength(10).When(x => x.Grade is not null);
    }
}

public class ApproveExamResultsRequestValidator : AbstractValidator<ApproveExamResultsRequest>
{
    public ApproveExamResultsRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ExamSessionId).NotEmpty();
        RuleFor(x => x.ApprovedByUserId).NotEmpty();
        RuleFor(x => x.Comments).MaximumLength(500).When(x => x.Comments is not null);
    }
}

public class GenerateReportCardsForTermRequestValidator : AbstractValidator<GenerateReportCardsForTermRequest>
{
    public GenerateReportCardsForTermRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
    }
}

public class UpdateExamTypeRequestValidator : AbstractValidator<UpdateExamTypeRequest>
{
    public UpdateExamTypeRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.ResolveWeightPercent()).InclusiveBetween(0, 100);
    }
}

public class UpdateExamSessionRequestValidator : AbstractValidator<UpdateExamSessionRequest>
{
    public UpdateExamSessionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.ResolveStartDate()).LessThanOrEqualTo(x => x.ResolveEndDate());
        RuleFor(x => x.Status).MaximumLength(30).When(x => x.Status is not null);
    }
}

public class PublishReportCardRequestValidator : AbstractValidator<PublishReportCardRequest>
{
    public PublishReportCardRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
    }
}
