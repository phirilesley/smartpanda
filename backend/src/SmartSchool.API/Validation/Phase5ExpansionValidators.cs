using FluentValidation;
using SmartSchool.API.Controllers.Phase5;

namespace SmartSchool.API.Validation;

public class CreateAttendanceSessionRequestValidator : AbstractValidator<CreateAttendanceSessionRequest>
{
    public CreateAttendanceSessionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.SessionType).NotEmpty().MaximumLength(50);
        RuleFor(x => x.AttendanceDate).NotEmpty();
    }
}

public class MarkStudentAttendanceRequestValidator : AbstractValidator<MarkStudentAttendanceRequest>
{
    public MarkStudentAttendanceRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AttendanceSessionId).NotEmpty();
        RuleFor(x => x.Items).NotNull().Must(x => x.Count > 0);
    }
}

public class MarkStudentAttendanceItemValidator : AbstractValidator<MarkStudentAttendanceItem>
{
    public MarkStudentAttendanceItemValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.EnrollmentId).NotEmpty();
        RuleFor(x => x.Remarks).MaximumLength(300).When(x => x.Remarks is not null);
    }
}

public class MarkStaffAttendanceRequestValidator : AbstractValidator<MarkStaffAttendanceRequest>
{
    public MarkStaffAttendanceRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AttendanceSessionId).NotEmpty();
        RuleFor(x => x.Items).NotNull().Must(x => x.Count > 0);
    }
}

public class MarkStaffAttendanceItemValidator : AbstractValidator<MarkStaffAttendanceItem>
{
    public MarkStaffAttendanceItemValidator()
    {
        RuleFor(x => x.StaffId).NotEmpty();
        RuleFor(x => x.Remarks).MaximumLength(300).When(x => x.Remarks is not null);
    }
}

public class CreateAnnouncementRequestValidator : AbstractValidator<CreateAnnouncementRequest>
{
    public CreateAnnouncementRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Content).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.Audience).NotEmpty().MaximumLength(80);
    }
}

public class CreateMessageThreadRequestValidator : AbstractValidator<CreateMessageThreadRequest>
{
    public CreateMessageThreadRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ParticipantUserIds).NotNull().Must(x => x.Count > 0);
    }
}

public class PostMessageRequestValidator : AbstractValidator<PostMessageRequest>
{
    public PostMessageRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.SenderUserId).NotEmpty();
        RuleFor(x => x.Content).NotEmpty().MaximumLength(4000);
    }
}

public class UpsertNotificationTemplateRequestValidator : AbstractValidator<UpsertNotificationTemplateRequest>
{
    public UpsertNotificationTemplateRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Channel).NotEmpty().MaximumLength(50);
        RuleFor(x => x.SubjectTemplate).NotEmpty().MaximumLength(300);
        RuleFor(x => x.BodyTemplate).NotEmpty().MaximumLength(4000);
    }
}

public class EnqueueNotificationRequestValidator : AbstractValidator<EnqueueNotificationRequest>
{
    public EnqueueNotificationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Channel).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Body).NotEmpty().MaximumLength(4000);
    }
}

public class UpsertReportDefinitionRequestValidator : AbstractValidator<UpsertReportDefinitionRequest>
{
    public UpsertReportDefinitionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Module).NotEmpty().MaximumLength(80);
        RuleFor(x => x.QueryKey).NotEmpty().MaximumLength(120);
    }
}

public class CreateReportRunRequestValidator : AbstractValidator<CreateReportRunRequest>
{
    public CreateReportRunRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ReportDefinitionId).NotEmpty();
        RuleFor(x => x.RequestedByUserId).NotEmpty();
    }
}
