using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Assets;
using SmartSchool.Domain.Modules.Attendance;
using SmartSchool.Domain.Modules.Communication;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Domain.Modules.Files;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.HelpDesk;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.Domain.Modules.Labs;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Memos;
using SmartSchool.Domain.Modules.Notifications;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Domain.Modules.Portals;
using SmartSchool.Domain.Modules.Pos;
using SmartSchool.Domain.Modules.QuestionBank;
using SmartSchool.Domain.Modules.Reports;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Domain.Modules.Settings;
using SmartSchool.Domain.Modules.Sports;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Visitors;

namespace SmartSchool.Persistence.Data;

public class SmartSchoolDbContext(DbContextOptions<SmartSchoolDbContext> options)
    : IdentityDbContext<AppUser, AppRole, Guid>(options)
{
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<SubscriptionPlan> SubscriptionPlans => Set<SubscriptionPlan>();
    public DbSet<TenantSubscription> TenantSubscriptions => Set<TenantSubscription>();
    public DbSet<School> Schools => Set<School>();
    public DbSet<SchoolBranch> SchoolBranches => Set<SchoolBranch>();

    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<AppRole> AppRoles => Set<AppRole>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<UserPermission> UserPermissions => Set<UserPermission>();
    public DbSet<UserSchoolAccess> UserSchoolAccesses => Set<UserSchoolAccess>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    public DbSet<AcademicYear> AcademicYears => Set<AcademicYear>();
    public DbSet<Term> Terms => Set<Term>();
    public DbSet<Grade> Grades => Set<Grade>();
    public DbSet<AcademicStream> Streams => Set<AcademicStream>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<GradeSubject> GradeSubjects => Set<GradeSubject>();

    public DbSet<Student> Students => Set<Student>();
    public DbSet<Guardian> Guardians => Set<Guardian>();
    public DbSet<StudentGuardian> StudentGuardians => Set<StudentGuardian>();
    public DbSet<StudentMedicalRecord> StudentMedicalRecords => Set<StudentMedicalRecord>();
    public DbSet<StudentDocument> StudentDocuments => Set<StudentDocument>();
    public DbSet<StudentEnrollment> StudentEnrollments => Set<StudentEnrollment>();
    public DbSet<StudentPromotion> StudentPromotions => Set<StudentPromotion>();
    public DbSet<StudentTransfer> StudentTransfers => Set<StudentTransfer>();

    public DbSet<ExamType> ExamTypes => Set<ExamType>();
    public DbSet<ExamSession> ExamSessions => Set<ExamSession>();
    public DbSet<MarkSheet> MarkSheets => Set<MarkSheet>();
    public DbSet<StudentMark> StudentMarks => Set<StudentMark>();
    public DbSet<GradeScale> GradeScales => Set<GradeScale>();
    public DbSet<ResultApproval> ResultApprovals => Set<ResultApproval>();
    public DbSet<ReportCard> ReportCards => Set<ReportCard>();

    public DbSet<FeeCategory> FeeCategories => Set<FeeCategory>();
    public DbSet<FeeStructure> FeeStructures => Set<FeeStructure>();
    public DbSet<StudentInvoice> StudentInvoices => Set<StudentInvoice>();
    public DbSet<StudentInvoiceLine> StudentInvoiceLines => Set<StudentInvoiceLine>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Receipt> Receipts => Set<Receipt>();
    public DbSet<Discount> Discounts => Set<Discount>();
    public DbSet<Scholarship> Scholarships => Set<Scholarship>();
    public DbSet<PaymentPlan> PaymentPlans => Set<PaymentPlan>();

    public DbSet<AttendanceSession> AttendanceSessions => Set<AttendanceSession>();
    public DbSet<StudentAttendance> StudentAttendances => Set<StudentAttendance>();
    public DbSet<StaffAttendance> StaffAttendances => Set<StaffAttendance>();

    public DbSet<StaffMember> StaffMembers => Set<StaffMember>();
    public DbSet<StaffContract> StaffContracts => Set<StaffContract>();
    public DbSet<LeaveType> LeaveTypes => Set<LeaveType>();
    public DbSet<LeaveApplication> LeaveApplications => Set<LeaveApplication>();
    public DbSet<PayrollPeriod> PayrollPeriods => Set<PayrollPeriod>();
    public DbSet<PayrollItem> PayrollItems => Set<PayrollItem>();

    public DbSet<BookCategory> BookCategories => Set<BookCategory>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<BookCopy> BookCopies => Set<BookCopy>();
    public DbSet<BookIssue> BookIssues => Set<BookIssue>();
    public DbSet<LibraryFine> LibraryFines => Set<LibraryFine>();

    public DbSet<AssetCategory> AssetCategories => Set<AssetCategory>();
    public DbSet<AssetItem> AssetItems => Set<AssetItem>();
    public DbSet<AssetAssignment> AssetAssignments => Set<AssetAssignment>();
    public DbSet<AssetMaintenance> AssetMaintenances => Set<AssetMaintenance>();

    public DbSet<Visitor> Visitors => Set<Visitor>();
    public DbSet<VisitorLog> VisitorLogs => Set<VisitorLog>();

    public DbSet<ComputerLab> ComputerLabs => Set<ComputerLab>();
    public DbSet<LabComputer> LabComputers => Set<LabComputer>();
    public DbSet<LabBooking> LabBookings => Set<LabBooking>();
    public DbSet<LabFault> LabFaults => Set<LabFault>();

    public DbSet<QuestionPaperCategory> QuestionPaperCategories => Set<QuestionPaperCategory>();
    public DbSet<QuestionPaper> QuestionPapers => Set<QuestionPaper>();
    public DbSet<QuestionPaperDownload> QuestionPaperDownloads => Set<QuestionPaperDownload>();

    public DbSet<MemoRequest> MemoRequests => Set<MemoRequest>();
    public DbSet<MemoApprover> MemoApprovers => Set<MemoApprover>();
    public DbSet<MemoApprovalAction> MemoApprovalActions => Set<MemoApprovalAction>();
    public DbSet<MemoAttachment> MemoAttachments => Set<MemoAttachment>();

    public DbSet<PosCategory> PosCategories => Set<PosCategory>();
    public DbSet<PosProduct> PosProducts => Set<PosProduct>();
    public DbSet<PosStockMovement> PosStockMovements => Set<PosStockMovement>();
    public DbSet<PosCashierSession> PosCashierSessions => Set<PosCashierSession>();
    public DbSet<PosSale> PosSales => Set<PosSale>();
    public DbSet<PosSaleLine> PosSaleLines => Set<PosSaleLine>();
    public DbSet<PosPayment> PosPayments => Set<PosPayment>();

    public DbSet<Sport> Sports => Set<Sport>();
    public DbSet<House> Houses => Set<House>();
    public DbSet<SportTeam> SportTeams => Set<SportTeam>();
    public DbSet<SportPlayer> SportPlayers => Set<SportPlayer>();
    public DbSet<Fixture> Fixtures => Set<Fixture>();
    public DbSet<SportResult> SportResults => Set<SportResult>();

    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<TimetablePeriod> TimetablePeriods => Set<TimetablePeriod>();
    public DbSet<TimetableEntry> TimetableEntries => Set<TimetableEntry>();

    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<MessageThread> MessageThreads => Set<MessageThread>();
    public DbSet<MessageParticipant> MessageParticipants => Set<MessageParticipant>();
    public DbSet<Message> Messages => Set<Message>();

    public DbSet<NotificationTemplate> NotificationTemplates => Set<NotificationTemplate>();
    public DbSet<Notification> Notifications => Set<Notification>();

    public DbSet<HelpDeskTicket> HelpDeskTickets => Set<HelpDeskTicket>();
    public DbSet<HelpDeskComment> HelpDeskComments => Set<HelpDeskComment>();
    public DbSet<HelpDeskSlaRule> HelpDeskSlaRules => Set<HelpDeskSlaRule>();

    public DbSet<ReportDefinition> ReportDefinitions => Set<ReportDefinition>();
    public DbSet<ReportRun> ReportRuns => Set<ReportRun>();

    public DbSet<UploadedFile> UploadedFiles => Set<UploadedFile>();
    public DbSet<IntegrationSetting> IntegrationSettings => Set<IntegrationSetting>();
    public DbSet<PaymentGatewayWebhook> PaymentGatewayWebhooks => Set<PaymentGatewayWebhook>();

    public DbSet<PortalWidgetPreference> PortalWidgetPreferences => Set<PortalWidgetPreference>();
    public DbSet<PortalQuickLink> PortalQuickLinks => Set<PortalQuickLink>();
    public DbSet<SchoolSetting> SchoolSettings => Set<SchoolSetting>();
    public DbSet<MasterDataItem> MasterDataItems => Set<MasterDataItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var decimalProperty in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            decimalProperty.SetPrecision(18);
            decimalProperty.SetScale(2);
        }

        modelBuilder.Entity<Tenant>().HasIndex(x => x.Code).IsUnique();
        modelBuilder.Entity<Permission>().HasIndex(x => x.Code).IsUnique();
        modelBuilder.Entity<School>().HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
        modelBuilder.Entity<Student>().HasIndex(x => new { x.TenantId, x.SchoolId, x.StudentNumber }).IsUnique();
        modelBuilder.Entity<Term>().HasIndex(x => new { x.TenantId, x.SchoolId, x.AcademicYearId, x.TermNumber }).IsUnique();
        modelBuilder.Entity<Grade>().HasIndex(x => new { x.TenantId, x.SchoolId, x.GradeOrder }).IsUnique();
        modelBuilder.Entity<AcademicStream>().HasIndex(x => new { x.TenantId, x.SchoolId, x.GradeId, x.Name }).IsUnique();
        modelBuilder.Entity<Subject>().HasIndex(x => new { x.TenantId, x.SchoolId, x.Code }).IsUnique();
        modelBuilder.Entity<RolePermission>().HasIndex(x => new { x.TenantId, x.RoleId, x.PermissionId }).IsUnique();
        modelBuilder.Entity<UserPermission>().HasIndex(x => new { x.TenantId, x.UserId, x.PermissionId }).IsUnique();
        modelBuilder.Entity<UserSchoolAccess>().HasIndex(x => new { x.TenantId, x.SchoolId, x.UserId }).IsUnique();
        modelBuilder.Entity<RefreshToken>().HasIndex(x => new { x.TenantId, x.UserId, x.TokenHash }).IsUnique();
        modelBuilder.Entity<SchoolSetting>().HasIndex(x => new { x.TenantId, x.SchoolId, x.SettingKey }).IsUnique();
        modelBuilder.Entity<MasterDataItem>().HasIndex(x => new { x.TenantId, x.SchoolId, x.DataType, x.Code }).IsUnique();

        modelBuilder.Entity<StudentEnrollment>()
            .HasIndex(x => new { x.TenantId, x.SchoolId, x.StudentId, x.IsCurrent })
            .HasFilter("[IsCurrent] = 1")
            .IsUnique();

        modelBuilder.Entity<Payment>().Property(x => x.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<StudentInvoice>().Property(x => x.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<StudentInvoiceLine>().Property(x => x.Amount).HasPrecision(18, 2);
        modelBuilder.Entity<FeeStructure>().Property(x => x.Amount).HasPrecision(18, 2);
    }
}
