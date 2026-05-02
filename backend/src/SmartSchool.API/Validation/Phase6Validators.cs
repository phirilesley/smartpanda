using FluentValidation;
using SmartSchool.API.Controllers.Phase6;

namespace SmartSchool.API.Validation;

public class CreateStaffMemberRequestValidator : AbstractValidator<CreateStaffMemberRequest>
{
    public CreateStaffMemberRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.EmployeeNumber).NotEmpty().MaximumLength(40);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.DepartmentId).NotEmpty();
        RuleFor(x => x.HireDate).NotEmpty();
    }
}

public class CreateStaffContractRequestValidator : AbstractValidator<CreateStaffContractRequest>
{
    public CreateStaffContractRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StaffId).NotEmpty();
        RuleFor(x => x.ContractType).NotEmpty().MaximumLength(80);
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).GreaterThan(x => x.StartDate);
        RuleFor(x => x.BasicSalary).GreaterThanOrEqualTo(0);
    }
}

public class CreateLeaveTypeRequestValidator : AbstractValidator<CreateLeaveTypeRequest>
{
    public CreateLeaveTypeRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        RuleFor(x => x.AnnualDays).GreaterThan(0).LessThanOrEqualTo(365);
    }
}

public class CreateLeaveApplicationRequestValidator : AbstractValidator<CreateLeaveApplicationRequest>
{
    public CreateLeaveApplicationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StaffId).NotEmpty();
        RuleFor(x => x.LeaveTypeId).NotEmpty();
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).GreaterThanOrEqualTo(x => x.StartDate);
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(1000);
    }
}

public class CreatePayrollPeriodRequestValidator : AbstractValidator<CreatePayrollPeriodRequest>
{
    public CreatePayrollPeriodRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).GreaterThan(x => x.StartDate);
    }
}

public class CreatePayrollItemRequestValidator : AbstractValidator<CreatePayrollItemRequest>
{
    public CreatePayrollItemRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.PayrollPeriodId).NotEmpty();
        RuleFor(x => x.StaffId).NotEmpty();
        RuleFor(x => x.ItemType).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Amount).NotEqual(0);
    }
}

public class CreateBookRequestValidator : AbstractValidator<CreateBookRequest>
{
    public CreateBookRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.BookCategoryId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Author).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Isbn).NotEmpty().MaximumLength(40);
    }
}

public class CreateBookCopyRequestValidator : AbstractValidator<CreateBookCopyRequest>
{
    public CreateBookCopyRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.BookId).NotEmpty();
        RuleFor(x => x.CopyNumber).NotEmpty().MaximumLength(60);
    }
}

public class IssueBookRequestValidator : AbstractValidator<IssueBookRequest>
{
    public IssueBookRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.BookCopyId).NotEmpty();
        RuleFor(x => x.BorrowerStudentId).NotEmpty();
        RuleFor(x => x.IssuedDate).NotEmpty();
        RuleFor(x => x.DueDate).GreaterThanOrEqualTo(x => x.IssuedDate);
    }
}

public class ReturnBookRequestValidator : AbstractValidator<ReturnBookRequest>
{
    public ReturnBookRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.DailyFineAmount).GreaterThanOrEqualTo(0);
    }
}

public class CreateAssetItemRequestValidator : AbstractValidator<CreateAssetItemRequest>
{
    public CreateAssetItemRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AssetCategoryId).NotEmpty();
        RuleFor(x => x.AssetTag).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.PurchaseDate).NotEmpty();
        RuleFor(x => x.Cost).GreaterThanOrEqualTo(0);
    }
}

public class CreateAssetAssignmentRequestValidator : AbstractValidator<CreateAssetAssignmentRequest>
{
    public CreateAssetAssignmentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AssetItemId).NotEmpty();
        RuleFor(x => x.AssignedToStaffId).NotEmpty();
        RuleFor(x => x.AssignedDate).NotEmpty();
    }
}

public class CreateAssetMaintenanceRequestValidator : AbstractValidator<CreateAssetMaintenanceRequest>
{
    public CreateAssetMaintenanceRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AssetItemId).NotEmpty();
        RuleFor(x => x.MaintenanceDate).NotEmpty();
        RuleFor(x => x.Description).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Cost).GreaterThanOrEqualTo(0);
    }
}

public class CreateVisitorRequestValidator : AbstractValidator<CreateVisitorRequest>
{
    public CreateVisitorRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(40);
        RuleFor(x => x.IdNumber).NotEmpty().MaximumLength(60);
    }
}

public class VisitorCheckInRequestValidator : AbstractValidator<VisitorCheckInRequest>
{
    public VisitorCheckInRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.VisitorId).NotEmpty();
        RuleFor(x => x.HostStaffId).NotEmpty();
        RuleFor(x => x.Purpose).NotEmpty().MaximumLength(300);
        RuleFor(x => x.BadgeNumber).NotEmpty().MaximumLength(40);
    }
}

public class VisitorCheckOutRequestValidator : AbstractValidator<VisitorCheckOutRequest>
{
    public VisitorCheckOutRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
    }
}

public class CreateComputerLabRequestValidator : AbstractValidator<CreateComputerLabRequest>
{
    public CreateComputerLabRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(500);
    }
}

public class CreateLabComputerRequestValidator : AbstractValidator<CreateLabComputerRequest>
{
    public CreateLabComputerRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ComputerLabId).NotEmpty();
        RuleFor(x => x.AssetTag).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
    }
}

public class CreateLabBookingRequestValidator : AbstractValidator<CreateLabBookingRequest>
{
    public CreateLabBookingRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ComputerLabId).NotEmpty();
        RuleFor(x => x.TeacherStaffId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.StreamId).NotEmpty();
        RuleFor(x => x.StartTimeUtc).NotEmpty();
        RuleFor(x => x.EndTimeUtc).GreaterThan(x => x.StartTimeUtc);
    }
}

public class CreateLabFaultRequestValidator : AbstractValidator<CreateLabFaultRequest>
{
    public CreateLabFaultRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.LabComputerId).NotEmpty();
        RuleFor(x => x.Description).NotEmpty().MaximumLength(1000);
    }
}

public class ResolveLabFaultRequestValidator : AbstractValidator<ResolveLabFaultRequest>
{
    public ResolveLabFaultRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class CreateQuestionPaperCategoryRequestValidator : AbstractValidator<CreateQuestionPaperCategoryRequest>
{
    public CreateQuestionPaperCategoryRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.SubjectId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
    }
}

public class CreateQuestionPaperRequestValidator : AbstractValidator<CreateQuestionPaperRequest>
{
    public CreateQuestionPaperRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.QuestionPaperCategoryId).NotEmpty();
        RuleFor(x => x.UploadedFileId).NotEmpty();
        RuleFor(x => x.ExamYear).InclusiveBetween(2000, 2100);
        RuleFor(x => x.ExamType).NotEmpty().MaximumLength(80);
    }
}

public class RegisterQuestionPaperDownloadRequestValidator : AbstractValidator<RegisterQuestionPaperDownloadRequest>
{
    public RegisterQuestionPaperDownloadRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.DownloadedByUserId).NotEmpty();
    }
}

public class CreateMemoRequestValidator : AbstractValidator<CreateMemoRequest>
{
    public CreateMemoRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Content).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.RequestedByUserId).NotEmpty();
    }
}

public class AddMemoApproverRequestValidator : AbstractValidator<AddMemoApproverRequest>
{
    public AddMemoApproverRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ApproverUserId).NotEmpty();
        RuleFor(x => x.ApprovalOrder).GreaterThan(0);
    }
}

public class AddMemoApprovalActionRequestValidator : AbstractValidator<AddMemoApprovalActionRequest>
{
    public AddMemoApprovalActionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ApproverUserId).NotEmpty();
        RuleFor(x => x.Action).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Comment).MaximumLength(2000);
    }
}

public class AddMemoAttachmentRequestValidator : AbstractValidator<AddMemoAttachmentRequest>
{
    public AddMemoAttachmentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.UploadedFileId).NotEmpty();
    }
}

public class CreatePosCategoryRequestValidator : AbstractValidator<CreatePosCategoryRequest>
{
    public CreatePosCategoryRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
    }
}

public class CreatePosProductRequestValidator : AbstractValidator<CreatePosProductRequest>
{
    public CreatePosProductRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.PosCategoryId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Sku).NotEmpty().MaximumLength(80);
        RuleFor(x => x.UnitPrice).GreaterThanOrEqualTo(0);
        RuleFor(x => x.OpeningQuantity).GreaterThanOrEqualTo(0);
    }
}

public class CreatePosStockMovementRequestValidator : AbstractValidator<CreatePosStockMovementRequest>
{
    public CreatePosStockMovementRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.PosProductId).NotEmpty();
        RuleFor(x => x.MovementType).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

public class OpenPosSessionRequestValidator : AbstractValidator<OpenPosSessionRequest>
{
    public OpenPosSessionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.CashierUserId).NotEmpty();
        RuleFor(x => x.OpeningFloat).GreaterThanOrEqualTo(0);
    }
}

public class ClosePosSessionRequestValidator : AbstractValidator<ClosePosSessionRequest>
{
    public ClosePosSessionRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ClosingAmount).GreaterThanOrEqualTo(0);
    }
}

public class CreatePosSaleRequestValidator : AbstractValidator<CreatePosSaleRequest>
{
    public CreatePosSaleRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.PosCashierSessionId).NotEmpty();
        RuleFor(x => x.ReceiptNumber).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Lines).NotNull().Must(x => x.Count > 0);
        RuleForEach(x => x.Lines).SetValidator(new CreatePosSaleLineItemValidator());
        RuleForEach(x => x.Payments).SetValidator(new CreatePosPaymentItemValidator());
    }
}

public class CreatePosSaleLineItemValidator : AbstractValidator<CreatePosSaleLineItem>
{
    public CreatePosSaleLineItemValidator()
    {
        RuleFor(x => x.PosProductId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

public class CreatePosPaymentItemValidator : AbstractValidator<CreatePosPaymentItem>
{
    public CreatePosPaymentItemValidator()
    {
        RuleFor(x => x.Method).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.Reference).MaximumLength(120);
    }
}

public class CreateSportRequestValidator : AbstractValidator<CreateSportRequest>
{
    public CreateSportRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
    }
}

public class CreateHouseRequestValidator : AbstractValidator<CreateHouseRequest>
{
    public CreateHouseRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.ColorCode).NotEmpty().MaximumLength(30);
    }
}

public class CreateSportTeamRequestValidator : AbstractValidator<CreateSportTeamRequest>
{
    public CreateSportTeamRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.SportId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
    }
}

public class AddSportPlayerRequestValidator : AbstractValidator<AddSportPlayerRequest>
{
    public AddSportPlayerRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.SportTeamId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.Position).NotEmpty().MaximumLength(80);
    }
}

public class CreateFixtureRequestValidator : AbstractValidator<CreateFixtureRequest>
{
    public CreateFixtureRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.SportTeamId).NotEmpty();
        RuleFor(x => x.FixtureDateUtc).NotEmpty();
        RuleFor(x => x.Opponent).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Venue).NotEmpty().MaximumLength(150);
    }
}

public class CreateSportResultRequestValidator : AbstractValidator<CreateSportResultRequest>
{
    public CreateSportResultRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.FixtureId).NotEmpty();
        RuleFor(x => x.TeamScore).GreaterThanOrEqualTo(0);
        RuleFor(x => x.OpponentScore).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Notes).MaximumLength(1000);
    }
}

public class CreateRoomRequestValidator : AbstractValidator<CreateRoomRequest>
{
    public CreateRoomRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(500);
    }
}

public class CreateTimetablePeriodRequestValidator : AbstractValidator<CreateTimetablePeriodRequest>
{
    public CreateTimetablePeriodRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        RuleFor(x => x.DayOfWeek).InclusiveBetween(1, 7);
        RuleFor(x => x.EndTime).Must((model, endTime) => endTime > model.StartTime)
            .WithMessage("EndTime must be later than StartTime.");
    }
}

public class CreateTimetableEntryRequestValidator : AbstractValidator<CreateTimetableEntryRequest>
{
    public CreateTimetableEntryRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.GradeId).NotEmpty();
        RuleFor(x => x.StreamId).NotEmpty();
        RuleFor(x => x.SubjectId).NotEmpty();
        RuleFor(x => x.StaffId).NotEmpty();
        RuleFor(x => x.RoomId).NotEmpty();
        RuleFor(x => x.TimetablePeriodId).NotEmpty();
    }
}

public class UpsertIntegrationSettingRequestValidator : AbstractValidator<UpsertIntegrationSettingRequest>
{
    public UpsertIntegrationSettingRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.IntegrationType).NotEmpty().MaximumLength(80);
        RuleFor(x => x.ProviderName).NotEmpty().MaximumLength(80);
        RuleFor(x => x).Must(x =>
                !string.IsNullOrWhiteSpace(x.PlainSettingsJson) ||
                !string.IsNullOrWhiteSpace(x.EncryptedSettingsJson))
            .WithMessage("Either plainSettingsJson or encryptedSettingsJson is required.");
    }
}

public class RegisterPaymentGatewayWebhookRequestValidator : AbstractValidator<RegisterPaymentGatewayWebhookRequest>
{
    public RegisterPaymentGatewayWebhookRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ProviderName).NotEmpty().MaximumLength(80);
        RuleFor(x => x.EventType).NotEmpty().MaximumLength(120);
        RuleFor(x => x.PayloadJson).NotEmpty();
    }
}

public class MarkWebhookProcessedRequestValidator : AbstractValidator<MarkWebhookProcessedRequest>
{
    public MarkWebhookProcessedRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
    }
}

public class RotateIntegrationSecretsRequestValidator : AbstractValidator<RotateIntegrationSecretsRequest>
{
    public RotateIntegrationSecretsRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ProviderName).MaximumLength(80).When(x => x.ProviderName is not null);
    }
}

public class CreateSchoolEventRequestValidator : AbstractValidator<CreateSchoolEventRequest>
{
    public CreateSchoolEventRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.StartAtUtc).NotEmpty();
        RuleFor(x => x.EndAtUtc).GreaterThan(x => x.StartAtUtc);
        RuleFor(x => x.Venue).NotEmpty().MaximumLength(200);
        RuleFor(x => x.MaxParticipants).GreaterThan(0).When(x => x.MaxParticipants.HasValue);
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
    }
}

public class UpdateSchoolEventRequestValidator : AbstractValidator<UpdateSchoolEventRequest>
{
    public UpdateSchoolEventRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.StartAtUtc).NotEmpty();
        RuleFor(x => x.EndAtUtc).GreaterThan(x => x.StartAtUtc);
        RuleFor(x => x.Venue).NotEmpty().MaximumLength(200);
        RuleFor(x => x.MaxParticipants).GreaterThan(0).When(x => x.MaxParticipants.HasValue);
        RuleFor(x => x.Status).NotEmpty().MaximumLength(50);
    }
}

public class AddEventParticipantRequestValidator : AbstractValidator<AddEventParticipantRequest>
{
    public AddEventParticipantRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ParticipantType).NotEmpty().MaximumLength(40);
        RuleFor(x => x.AttendanceStatus).NotEmpty().MaximumLength(40);
        RuleFor(x => x).Must(x => x.StudentId.HasValue || x.StaffId.HasValue || x.GuardianId.HasValue)
            .WithMessage("At least one participant id is required.");
    }
}

public class UpdateEventParticipantAttendanceRequestValidator : AbstractValidator<UpdateEventParticipantAttendanceRequest>
{
    public UpdateEventParticipantAttendanceRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.AttendanceStatus).NotEmpty().MaximumLength(40);
    }
}

public class RegisterEventParticipantsRequestValidator : AbstractValidator<RegisterEventParticipantsRequest>
{
    public RegisterEventParticipantsRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Participants).NotNull().Must(x => x.Count > 0);
    }
}

public class CreateTransportVehicleRequestValidator : AbstractValidator<CreateTransportVehicleRequest>
{
    public CreateTransportVehicleRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.RegistrationNumber).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(200);
        RuleFor(x => x.DriverStaffId).NotEmpty();
    }
}

public class UpdateTransportVehicleRequestValidator : AbstractValidator<UpdateTransportVehicleRequest>
{
    public UpdateTransportVehicleRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(200);
        RuleFor(x => x.DriverStaffId).NotEmpty();
    }
}

public class CreateTransportRouteRequestValidator : AbstractValidator<CreateTransportRouteRequest>
{
    public CreateTransportRouteRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.RouteCode).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.StartLocation).NotEmpty().MaximumLength(200);
        RuleFor(x => x.EndLocation).NotEmpty().MaximumLength(200);
    }
}

public class UpdateTransportRouteRequestValidator : AbstractValidator<UpdateTransportRouteRequest>
{
    public UpdateTransportRouteRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.StartLocation).NotEmpty().MaximumLength(200);
        RuleFor(x => x.EndLocation).NotEmpty().MaximumLength(200);
    }
}

public class CreateTransportRouteStopRequestValidator : AbstractValidator<CreateTransportRouteStopRequest>
{
    public CreateTransportRouteStopRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StopName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.StopOrder).GreaterThan(0).LessThanOrEqualTo(500);
    }
}

public class CreateTransportStudentAssignmentRequestValidator : AbstractValidator<CreateTransportStudentAssignmentRequest>
{
    public CreateTransportStudentAssignmentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.TransportRouteId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
        RuleFor(x => x.EffectiveTo)
            .GreaterThanOrEqualTo(x => x.EffectiveFrom)
            .When(x => x.EffectiveTo.HasValue);
    }
}

public class CreateTransportTripRequestValidator : AbstractValidator<CreateTransportTripRequest>
{
    public CreateTransportTripRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.TransportVehicleId).NotEmpty();
        RuleFor(x => x.TransportRouteId).NotEmpty();
        RuleFor(x => x.DriverStaffId).NotEmpty();
        RuleFor(x => x.Direction).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class UpdateTransportAssignmentStatusRequestValidator : AbstractValidator<UpdateTransportAssignmentStatusRequest>
{
    public UpdateTransportAssignmentStatusRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class LogTransportTripRequestValidator : AbstractValidator<LogTransportTripRequest>
{
    public LogTransportTripRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class CreateHostelRequestValidator : AbstractValidator<CreateHostelRequest>
{
    public CreateHostelRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.GenderPolicy).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(2000);
    }
}

public class UpdateHostelRequestValidator : AbstractValidator<UpdateHostelRequest>
{
    public UpdateHostelRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(120);
        RuleFor(x => x.GenderPolicy).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(2000);
    }
}

public class CreateHostelRoomRequestValidator : AbstractValidator<CreateHostelRoomRequest>
{
    public CreateHostelRoomRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(80);
        RuleFor(x => x.Capacity).GreaterThan(0).LessThanOrEqualTo(200);
        RuleFor(x => x.FloorName).MaximumLength(40);
    }
}

public class CreateHostelBedRequestValidator : AbstractValidator<CreateHostelBedRequest>
{
    public CreateHostelBedRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.BedCode).NotEmpty().MaximumLength(40);
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class CreateHostelAllocationRequestValidator : AbstractValidator<CreateHostelAllocationRequest>
{
    public CreateHostelAllocationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.HostelBedId).NotEmpty();
        RuleFor(x => x.AcademicYearId).NotEmpty();
        RuleFor(x => x.TermId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .When(x => x.EndDate.HasValue);
    }
}

public class UpdateHostelAllocationRequestValidator : AbstractValidator<UpdateHostelAllocationRequest>
{
    public UpdateHostelAllocationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class TransferHostelAllocationRequestValidator : AbstractValidator<TransferHostelAllocationRequest>
{
    public TransferHostelAllocationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.NewHostelBedId).NotEmpty();
        RuleFor(x => x.TransferDate).NotEmpty();
    }
}

public class CheckoutHostelAllocationRequestValidator : AbstractValidator<CheckoutHostelAllocationRequest>
{
    public CheckoutHostelAllocationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.CheckoutDate).NotEmpty();
    }
}

public class CreateHostelIncidentRequestValidator : AbstractValidator<CreateHostelIncidentRequest>
{
    public CreateHostelIncidentRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.HostelId).NotEmpty();
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.ReportedByStaffId).NotEmpty();
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Notes).MaximumLength(2000);
    }
}

public class UpdateHostelIncidentStatusRequestValidator : AbstractValidator<UpdateHostelIncidentStatusRequest>
{
    public UpdateHostelIncidentStatusRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class CreateHealthProfileRequestValidator : AbstractValidator<CreateHealthProfileRequest>
{
    public CreateHealthProfileRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.BloodGroup).MaximumLength(20);
        RuleFor(x => x.Allergies).MaximumLength(2000);
        RuleFor(x => x.ChronicConditions).MaximumLength(2000);
        RuleFor(x => x.EmergencyContactName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.EmergencyContactPhone).NotEmpty().MaximumLength(40);
        RuleFor(x => x).Must(x => x.StudentId.HasValue || x.StaffId.HasValue)
            .WithMessage("studentId or staffId is required.");
    }
}

public class UpdateHealthProfileRequestValidator : AbstractValidator<UpdateHealthProfileRequest>
{
    public UpdateHealthProfileRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.BloodGroup).MaximumLength(20);
        RuleFor(x => x.Allergies).MaximumLength(2000);
        RuleFor(x => x.ChronicConditions).MaximumLength(2000);
        RuleFor(x => x.EmergencyContactName).NotEmpty().MaximumLength(150);
        RuleFor(x => x.EmergencyContactPhone).NotEmpty().MaximumLength(40);
    }
}

public class CreateHealthScreeningRequestValidator : AbstractValidator<CreateHealthScreeningRequest>
{
    public CreateHealthScreeningRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.HealthProfileId).NotEmpty();
        RuleFor(x => x.BloodPressure).MaximumLength(60);
        RuleFor(x => x.Notes).MaximumLength(2000);
        RuleFor(x => x.ScreenedByStaffId).NotEmpty();
        RuleFor(x => x.HeightCm).GreaterThan(0).When(x => x.HeightCm.HasValue);
        RuleFor(x => x.WeightKg).GreaterThan(0).When(x => x.WeightKg.HasValue);
    }
}

public class CreateImmunizationRecordRequestValidator : AbstractValidator<CreateImmunizationRecordRequest>
{
    public CreateImmunizationRecordRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.HealthProfileId).NotEmpty();
        RuleFor(x => x.VaccineName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.DoseNumber).GreaterThan(0).LessThanOrEqualTo(20);
        RuleFor(x => x.Notes).MaximumLength(1000);
    }
}

public class UpdateImmunizationRecordRequestValidator : AbstractValidator<UpdateImmunizationRecordRequest>
{
    public UpdateImmunizationRecordRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Notes).MaximumLength(1000);
    }
}

public class CreateClinicVisitRequestValidator : AbstractValidator<CreateClinicVisitRequest>
{
    public CreateClinicVisitRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.PatientType).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Complaint).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.Diagnosis).MaximumLength(2000);
        RuleFor(x => x.Treatment).MaximumLength(2000);
        RuleFor(x => x.AttendedByStaffId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
        RuleFor(x => x).Must(x => x.StudentId.HasValue || x.StaffId.HasValue)
            .WithMessage("studentId or staffId is required.");
    }
}

public class UpdateClinicVisitRequestValidator : AbstractValidator<UpdateClinicVisitRequest>
{
    public UpdateClinicVisitRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Diagnosis).MaximumLength(2000);
        RuleFor(x => x.Treatment).MaximumLength(2000);
        RuleFor(x => x.Status).NotEmpty().MaximumLength(40);
    }
}

public class ReferClinicVisitRequestValidator : AbstractValidator<ReferClinicVisitRequest>
{
    public ReferClinicVisitRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.ReferralFacility).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ReferralReason).NotEmpty().MaximumLength(1000);
    }
}

public class ClinicFollowUpRequestValidator : AbstractValidator<ClinicFollowUpRequest>
{
    public ClinicFollowUpRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
    }
}

public class CreateClinicMedicationRequestValidator : AbstractValidator<CreateClinicMedicationRequest>
{
    public CreateClinicMedicationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Unit).NotEmpty().MaximumLength(30);
        RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ReorderLevel).GreaterThanOrEqualTo(0);
    }
}

public class UpdateClinicMedicationRequestValidator : AbstractValidator<UpdateClinicMedicationRequest>
{
    public UpdateClinicMedicationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.Unit).NotEmpty().MaximumLength(30);
        RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ReorderLevel).GreaterThanOrEqualTo(0);
    }
}

public class DispenseMedicationRequestValidator : AbstractValidator<DispenseMedicationRequest>
{
    public DispenseMedicationRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.SchoolId).NotEmpty();
        RuleFor(x => x.ClinicVisitId).NotEmpty();
        RuleFor(x => x.ClinicMedicationId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.Instructions).MaximumLength(1000);
        RuleFor(x => x.DispensedByStaffId).NotEmpty();
    }
}

public class AdjustClinicMedicationStockRequestValidator : AbstractValidator<AdjustClinicMedicationStockRequest>
{
    public AdjustClinicMedicationStockRequestValidator()
    {
        RuleFor(x => x.TenantId).NotEmpty();
        RuleFor(x => x.QuantityDelta).NotEqual(0);
    }
}
