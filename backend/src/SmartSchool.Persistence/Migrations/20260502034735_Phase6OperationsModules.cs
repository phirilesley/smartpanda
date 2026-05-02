using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSchool.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase6OperationsModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "IdNumber",
                table: "Visitors",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "BadgeNumber",
                table: "VisitorLogs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeNumber",
                table: "StaffMembers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SportTeams",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Sports",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ExamType",
                table: "QuestionPapers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "QuestionPaperCategories",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiptNumber",
                table: "PosSales",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Sku",
                table: "PosProducts",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PosCategories",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PayrollPeriods",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ProviderName",
                table: "PaymentGatewayWebhooks",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "LeaveTypes",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AssetTag",
                table: "LabComputers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ProviderName",
                table: "IntegrationSettings",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "IntegrationType",
                table: "IntegrationSettings",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Houses",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ComputerLabs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Isbn",
                table: "Books",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CopyNumber",
                table: "BookCopies",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "BookCategories",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "AssetTag",
                table: "AssetItems",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AssetCategories",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Visitors_TenantId_SchoolId_IdNumber",
                table: "Visitors",
                columns: new[] { "TenantId", "SchoolId", "IdNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_VisitorLogs_TenantId_SchoolId_BadgeNumber_CheckInAtUtc",
                table: "VisitorLogs",
                columns: new[] { "TenantId", "SchoolId", "BadgeNumber", "CheckInAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_TimetablePeriods_TenantId_SchoolId_DayOfWeek_StartTime_EndTime",
                table: "TimetablePeriods",
                columns: new[] { "TenantId", "SchoolId", "DayOfWeek", "StartTime", "EndTime" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TimetableEntries_TenantId_SchoolId_AcademicYearId_TermId_GradeId_StreamId_TimetablePeriodId",
                table: "TimetableEntries",
                columns: new[] { "TenantId", "SchoolId", "AcademicYearId", "TermId", "GradeId", "StreamId", "TimetablePeriodId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StaffMembers_TenantId_SchoolId_EmployeeNumber",
                table: "StaffMembers",
                columns: new[] { "TenantId", "SchoolId", "EmployeeNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportTeams_TenantId_SchoolId_SportId_Name",
                table: "SportTeams",
                columns: new[] { "TenantId", "SchoolId", "SportId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sports_TenantId_SchoolId_Name",
                table: "Sports",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportPlayers_TenantId_SchoolId_SportTeamId_StudentId",
                table: "SportPlayers",
                columns: new[] { "TenantId", "SchoolId", "SportTeamId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_TenantId_SchoolId_Name",
                table: "Rooms",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuestionPapers_TenantId_SchoolId_QuestionPaperCategoryId_ExamYear_ExamType",
                table: "QuestionPapers",
                columns: new[] { "TenantId", "SchoolId", "QuestionPaperCategoryId", "ExamYear", "ExamType" });

            migrationBuilder.CreateIndex(
                name: "IX_QuestionPaperCategories_TenantId_SchoolId_SubjectId_GradeId_Name",
                table: "QuestionPaperCategories",
                columns: new[] { "TenantId", "SchoolId", "SubjectId", "GradeId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PosSales_TenantId_SchoolId_ReceiptNumber",
                table: "PosSales",
                columns: new[] { "TenantId", "SchoolId", "ReceiptNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PosProducts_TenantId_SchoolId_Sku",
                table: "PosProducts",
                columns: new[] { "TenantId", "SchoolId", "Sku" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PosCategories_TenantId_SchoolId_Name",
                table: "PosCategories",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PosCashierSessions_TenantId_SchoolId_CashierUserId_ClosedAtUtc",
                table: "PosCashierSessions",
                columns: new[] { "TenantId", "SchoolId", "CashierUserId", "ClosedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_PayrollPeriods_TenantId_SchoolId_Name",
                table: "PayrollPeriods",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentGatewayWebhooks_TenantId_SchoolId_ProviderName_ReceivedAtUtc",
                table: "PaymentGatewayWebhooks",
                columns: new[] { "TenantId", "SchoolId", "ProviderName", "ReceivedAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_MemoApprovers_TenantId_SchoolId_MemoRequestId_ApproverUserId",
                table: "MemoApprovers",
                columns: new[] { "TenantId", "SchoolId", "MemoRequestId", "ApproverUserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveTypes_TenantId_SchoolId_Name",
                table: "LeaveTypes",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LabComputers_TenantId_SchoolId_AssetTag",
                table: "LabComputers",
                columns: new[] { "TenantId", "SchoolId", "AssetTag" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LabBookings_TenantId_SchoolId_ComputerLabId_StartTimeUtc_EndTimeUtc",
                table: "LabBookings",
                columns: new[] { "TenantId", "SchoolId", "ComputerLabId", "StartTimeUtc", "EndTimeUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationSettings_TenantId_SchoolId_IntegrationType_ProviderName",
                table: "IntegrationSettings",
                columns: new[] { "TenantId", "SchoolId", "IntegrationType", "ProviderName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Houses_TenantId_SchoolId_Name",
                table: "Houses",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComputerLabs_TenantId_SchoolId_Name",
                table: "ComputerLabs",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Books_TenantId_SchoolId_Isbn",
                table: "Books",
                columns: new[] { "TenantId", "SchoolId", "Isbn" });

            migrationBuilder.CreateIndex(
                name: "IX_BookCopies_TenantId_SchoolId_CopyNumber",
                table: "BookCopies",
                columns: new[] { "TenantId", "SchoolId", "CopyNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookCategories_TenantId_SchoolId_Name",
                table: "BookCategories",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssetItems_TenantId_SchoolId_AssetTag",
                table: "AssetItems",
                columns: new[] { "TenantId", "SchoolId", "AssetTag" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AssetCategories_TenantId_SchoolId_Name",
                table: "AssetCategories",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Visitors_TenantId_SchoolId_IdNumber",
                table: "Visitors");

            migrationBuilder.DropIndex(
                name: "IX_VisitorLogs_TenantId_SchoolId_BadgeNumber_CheckInAtUtc",
                table: "VisitorLogs");

            migrationBuilder.DropIndex(
                name: "IX_TimetablePeriods_TenantId_SchoolId_DayOfWeek_StartTime_EndTime",
                table: "TimetablePeriods");

            migrationBuilder.DropIndex(
                name: "IX_TimetableEntries_TenantId_SchoolId_AcademicYearId_TermId_GradeId_StreamId_TimetablePeriodId",
                table: "TimetableEntries");

            migrationBuilder.DropIndex(
                name: "IX_StaffMembers_TenantId_SchoolId_EmployeeNumber",
                table: "StaffMembers");

            migrationBuilder.DropIndex(
                name: "IX_SportTeams_TenantId_SchoolId_SportId_Name",
                table: "SportTeams");

            migrationBuilder.DropIndex(
                name: "IX_Sports_TenantId_SchoolId_Name",
                table: "Sports");

            migrationBuilder.DropIndex(
                name: "IX_SportPlayers_TenantId_SchoolId_SportTeamId_StudentId",
                table: "SportPlayers");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_TenantId_SchoolId_Name",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_QuestionPapers_TenantId_SchoolId_QuestionPaperCategoryId_ExamYear_ExamType",
                table: "QuestionPapers");

            migrationBuilder.DropIndex(
                name: "IX_QuestionPaperCategories_TenantId_SchoolId_SubjectId_GradeId_Name",
                table: "QuestionPaperCategories");

            migrationBuilder.DropIndex(
                name: "IX_PosSales_TenantId_SchoolId_ReceiptNumber",
                table: "PosSales");

            migrationBuilder.DropIndex(
                name: "IX_PosProducts_TenantId_SchoolId_Sku",
                table: "PosProducts");

            migrationBuilder.DropIndex(
                name: "IX_PosCategories_TenantId_SchoolId_Name",
                table: "PosCategories");

            migrationBuilder.DropIndex(
                name: "IX_PosCashierSessions_TenantId_SchoolId_CashierUserId_ClosedAtUtc",
                table: "PosCashierSessions");

            migrationBuilder.DropIndex(
                name: "IX_PayrollPeriods_TenantId_SchoolId_Name",
                table: "PayrollPeriods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentGatewayWebhooks_TenantId_SchoolId_ProviderName_ReceivedAtUtc",
                table: "PaymentGatewayWebhooks");

            migrationBuilder.DropIndex(
                name: "IX_MemoApprovers_TenantId_SchoolId_MemoRequestId_ApproverUserId",
                table: "MemoApprovers");

            migrationBuilder.DropIndex(
                name: "IX_LeaveTypes_TenantId_SchoolId_Name",
                table: "LeaveTypes");

            migrationBuilder.DropIndex(
                name: "IX_LabComputers_TenantId_SchoolId_AssetTag",
                table: "LabComputers");

            migrationBuilder.DropIndex(
                name: "IX_LabBookings_TenantId_SchoolId_ComputerLabId_StartTimeUtc_EndTimeUtc",
                table: "LabBookings");

            migrationBuilder.DropIndex(
                name: "IX_IntegrationSettings_TenantId_SchoolId_IntegrationType_ProviderName",
                table: "IntegrationSettings");

            migrationBuilder.DropIndex(
                name: "IX_Houses_TenantId_SchoolId_Name",
                table: "Houses");

            migrationBuilder.DropIndex(
                name: "IX_ComputerLabs_TenantId_SchoolId_Name",
                table: "ComputerLabs");

            migrationBuilder.DropIndex(
                name: "IX_Books_TenantId_SchoolId_Isbn",
                table: "Books");

            migrationBuilder.DropIndex(
                name: "IX_BookCopies_TenantId_SchoolId_CopyNumber",
                table: "BookCopies");

            migrationBuilder.DropIndex(
                name: "IX_BookCategories_TenantId_SchoolId_Name",
                table: "BookCategories");

            migrationBuilder.DropIndex(
                name: "IX_AssetItems_TenantId_SchoolId_AssetTag",
                table: "AssetItems");

            migrationBuilder.DropIndex(
                name: "IX_AssetCategories_TenantId_SchoolId_Name",
                table: "AssetCategories");

            migrationBuilder.AlterColumn<string>(
                name: "IdNumber",
                table: "Visitors",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "BadgeNumber",
                table: "VisitorLogs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "EmployeeNumber",
                table: "StaffMembers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SportTeams",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Sports",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ExamType",
                table: "QuestionPapers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "QuestionPaperCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiptNumber",
                table: "PosSales",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Sku",
                table: "PosProducts",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PosCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "PayrollPeriods",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ProviderName",
                table: "PaymentGatewayWebhooks",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "LeaveTypes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "AssetTag",
                table: "LabComputers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ProviderName",
                table: "IntegrationSettings",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "IntegrationType",
                table: "IntegrationSettings",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Houses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ComputerLabs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Isbn",
                table: "Books",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "CopyNumber",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "BookCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "AssetTag",
                table: "AssetItems",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AssetCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
