using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSchool.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Phase3FinanceCore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "InvoiceNumber",
                table: "StudentInvoices",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiptNumber",
                table: "Receipts",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "FeeCategories",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_StudentInvoices_TenantId_SchoolId_InvoiceNumber",
                table: "StudentInvoices",
                columns: new[] { "TenantId", "SchoolId", "InvoiceNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_TenantId_SchoolId_ReceiptNumber",
                table: "Receipts",
                columns: new[] { "TenantId", "SchoolId", "ReceiptNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentPlans_TenantId_SchoolId_InvoiceId_StudentId",
                table: "PaymentPlans",
                columns: new[] { "TenantId", "SchoolId", "InvoiceId", "StudentId" });

            migrationBuilder.CreateIndex(
                name: "IX_FeeStructures_TenantId_SchoolId_AcademicYearId_TermId_GradeId_FeeCategoryId_Currency",
                table: "FeeStructures",
                columns: new[] { "TenantId", "SchoolId", "AcademicYearId", "TermId", "GradeId", "FeeCategoryId", "Currency" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeeCategories_TenantId_SchoolId_Name",
                table: "FeeCategories",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentInvoices_TenantId_SchoolId_InvoiceNumber",
                table: "StudentInvoices");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_TenantId_SchoolId_ReceiptNumber",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_PaymentPlans_TenantId_SchoolId_InvoiceId_StudentId",
                table: "PaymentPlans");

            migrationBuilder.DropIndex(
                name: "IX_FeeStructures_TenantId_SchoolId_AcademicYearId_TermId_GradeId_FeeCategoryId_Currency",
                table: "FeeStructures");

            migrationBuilder.DropIndex(
                name: "IX_FeeCategories_TenantId_SchoolId_Name",
                table: "FeeCategories");

            migrationBuilder.AlterColumn<string>(
                name: "InvoiceNumber",
                table: "StudentInvoices",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiptNumber",
                table: "Receipts",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "FeeCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
