using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSchool.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase4ExamsResults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ExamTypes",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ExamSessions",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_StudentMarks_TenantId_SchoolId_EnrollmentId_ExamSessionId_SubjectId",
                table: "StudentMarks",
                columns: new[] { "TenantId", "SchoolId", "EnrollmentId", "ExamSessionId", "SubjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ResultApprovals_TenantId_SchoolId_ExamSessionId_ApprovedByUserId",
                table: "ResultApprovals",
                columns: new[] { "TenantId", "SchoolId", "ExamSessionId", "ApprovedByUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_ReportCards_TenantId_SchoolId_StudentId_AcademicYearId_TermId_GradeId",
                table: "ReportCards",
                columns: new[] { "TenantId", "SchoolId", "StudentId", "AcademicYearId", "TermId", "GradeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExamTypes_TenantId_SchoolId_Name",
                table: "ExamTypes",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExamSessions_TenantId_SchoolId_AcademicYearId_TermId_GradeId_Name",
                table: "ExamSessions",
                columns: new[] { "TenantId", "SchoolId", "AcademicYearId", "TermId", "GradeId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentMarks_TenantId_SchoolId_EnrollmentId_ExamSessionId_SubjectId",
                table: "StudentMarks");

            migrationBuilder.DropIndex(
                name: "IX_ResultApprovals_TenantId_SchoolId_ExamSessionId_ApprovedByUserId",
                table: "ResultApprovals");

            migrationBuilder.DropIndex(
                name: "IX_ReportCards_TenantId_SchoolId_StudentId_AcademicYearId_TermId_GradeId",
                table: "ReportCards");

            migrationBuilder.DropIndex(
                name: "IX_ExamTypes_TenantId_SchoolId_Name",
                table: "ExamTypes");

            migrationBuilder.DropIndex(
                name: "IX_ExamSessions_TenantId_SchoolId_AcademicYearId_TermId_GradeId_Name",
                table: "ExamSessions");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ExamTypes",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ExamSessions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
