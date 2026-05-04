using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSchool.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class _20260503_Phase6WorkflowAlignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SchoolEvents_TenantId_SchoolId_EventDateUtc_Title",
                table: "SchoolEvents");

            migrationBuilder.RenameColumn(
                name: "EventDateUtc",
                table: "SchoolEvents",
                newName: "StartAtUtc");

            migrationBuilder.AlterColumn<string>(
                name: "Venue",
                table: "SchoolEvents",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "SchoolEvents",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndAtUtc",
                table: "SchoolEvents",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "MaxParticipants",
                table: "SchoolEvents",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResolvedAtUtc",
                table: "HostelIncidents",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "HostelIncidents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedAtUtc",
                table: "ClinicVisits",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsReferred",
                table: "ClinicVisits",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ReferralFacility",
                table: "ClinicVisits",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReferralReason",
                table: "ClinicVisits",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReferredAtUtc",
                table: "ClinicVisits",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClinicPrescriptionItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClinicPrescriptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClinicMedicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicPrescriptionItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClinicPrescriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClinicVisitId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PrescriptionDateUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PrescribedByStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FulfilledAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClinicPrescriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HealthActionPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HealthProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Condition = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TriggerConditions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequiredActions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmergencyContacts = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthActionPlans", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SchoolEvents_TenantId_SchoolId_Venue_StartAtUtc_EndAtUtc",
                table: "SchoolEvents",
                columns: new[] { "TenantId", "SchoolId", "Venue", "StartAtUtc", "EndAtUtc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClinicPrescriptionItems");

            migrationBuilder.DropTable(
                name: "ClinicPrescriptions");

            migrationBuilder.DropTable(
                name: "HealthActionPlans");

            migrationBuilder.DropIndex(
                name: "IX_SchoolEvents_TenantId_SchoolId_Venue_StartAtUtc_EndAtUtc",
                table: "SchoolEvents");

            migrationBuilder.DropColumn(
                name: "EndAtUtc",
                table: "SchoolEvents");

            migrationBuilder.DropColumn(
                name: "MaxParticipants",
                table: "SchoolEvents");

            migrationBuilder.DropColumn(
                name: "ResolvedAtUtc",
                table: "HostelIncidents");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "HostelIncidents");

            migrationBuilder.DropColumn(
                name: "ClosedAtUtc",
                table: "ClinicVisits");

            migrationBuilder.DropColumn(
                name: "IsReferred",
                table: "ClinicVisits");

            migrationBuilder.DropColumn(
                name: "ReferralFacility",
                table: "ClinicVisits");

            migrationBuilder.DropColumn(
                name: "ReferralReason",
                table: "ClinicVisits");

            migrationBuilder.DropColumn(
                name: "ReferredAtUtc",
                table: "ClinicVisits");

            migrationBuilder.RenameColumn(
                name: "StartAtUtc",
                table: "SchoolEvents",
                newName: "EventDateUtc");

            migrationBuilder.AlterColumn<string>(
                name: "Venue",
                table: "SchoolEvents",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "SchoolEvents",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_SchoolEvents_TenantId_SchoolId_EventDateUtc_Title",
                table: "SchoolEvents",
                columns: new[] { "TenantId", "SchoolId", "EventDateUtc", "Title" });
        }
    }
}
