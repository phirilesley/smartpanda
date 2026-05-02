using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSchool.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase5OperationsExpansion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "QueryKey",
                table: "ReportDefinitions",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "NotificationTemplates",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Channel",
                table: "NotificationTemplates",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "SessionType",
                table: "AttendanceSessions",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttendances_TenantId_SchoolId_AttendanceSessionId_StudentId",
                table: "StudentAttendances",
                columns: new[] { "TenantId", "SchoolId", "AttendanceSessionId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StaffAttendances_TenantId_SchoolId_AttendanceSessionId_StaffId",
                table: "StaffAttendances",
                columns: new[] { "TenantId", "SchoolId", "AttendanceSessionId", "StaffId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReportDefinitions_TenantId_SchoolId_QueryKey",
                table: "ReportDefinitions",
                columns: new[] { "TenantId", "SchoolId", "QueryKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotificationTemplates_TenantId_SchoolId_Name_Channel",
                table: "NotificationTemplates",
                columns: new[] { "TenantId", "SchoolId", "Name", "Channel" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceSessions_TenantId_SchoolId_AcademicYearId_TermId_AttendanceDate_SessionType",
                table: "AttendanceSessions",
                columns: new[] { "TenantId", "SchoolId", "AcademicYearId", "TermId", "AttendanceDate", "SessionType" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentAttendances_TenantId_SchoolId_AttendanceSessionId_StudentId",
                table: "StudentAttendances");

            migrationBuilder.DropIndex(
                name: "IX_StaffAttendances_TenantId_SchoolId_AttendanceSessionId_StaffId",
                table: "StaffAttendances");

            migrationBuilder.DropIndex(
                name: "IX_ReportDefinitions_TenantId_SchoolId_QueryKey",
                table: "ReportDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_NotificationTemplates_TenantId_SchoolId_Name_Channel",
                table: "NotificationTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceSessions_TenantId_SchoolId_AcademicYearId_TermId_AttendanceDate_SessionType",
                table: "AttendanceSessions");

            migrationBuilder.AlterColumn<string>(
                name: "QueryKey",
                table: "ReportDefinitions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "NotificationTemplates",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Channel",
                table: "NotificationTemplates",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "SessionType",
                table: "AttendanceSessions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
