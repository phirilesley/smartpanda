using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartSchool.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class _20260503_phase6_studentlife_modules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AcademicYearId",
                table: "SportTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AssistantCoachStaffId",
                table: "SportTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CoachStaffId",
                table: "SportTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentMembers",
                table: "SportTeams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "SportTeams",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "GradeId",
                table: "SportTeams",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomeVenue",
                table: "SportTeams",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "SportTeams",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxMembers",
                table: "SportTeams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PracticeSchedule",
                table: "SportTeams",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeamType",
                table: "SportTeams",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Sports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Sports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EquipmentRequired",
                table: "Sports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Sports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsTeamSport",
                table: "Sports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Season",
                table: "Sports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SportCategoryId",
                table: "Sports",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TeamSize",
                table: "Sports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AwardCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AwardType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SelectionCriteria = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AwardFrequency = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_AwardCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CeremonyAwards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PrizeGivingCeremonyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentAwardId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PresentationOrder = table.Column<int>(type: "int", nullable: false),
                    PresenterStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SpecialNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CeremonyAwards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClubActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActivityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubActivities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ClubCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
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
                    table.PrimaryKey("PK_ClubCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeadershipDuties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeadershipPositionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DutyTitle = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Priority = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_LeadershipDuties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeadershipDutyLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentLeadershipAssignmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeadershipDutyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DutyDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    DurationMinutes = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PerformanceNotes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SupervisorStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SupervisorRating = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    SupervisorComments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadershipDutyLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeadershipPositions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PositionType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HierarchyOrder = table.Column<int>(type: "int", nullable: false),
                    Responsibilities = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Qualifications = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SelectionProcess = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TermDuration = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_LeadershipPositions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrizeGivingCeremonies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CeremonyType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CeremonyDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    Venue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrganizerStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MasterOfCeremonies = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GuestOfHonor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExpectedAttendees = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Program = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrizeGivingCeremonies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrizeGivingCeremonies_StaffMembers_OrganizerStaffId",
                        column: x => x.OrganizerStaffId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SportAchievements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AchievementDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportAchievements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportAchievements_SportTeams_SportTeamId",
                        column: x => x.SportTeamId,
                        principalTable: "SportTeams",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SportAchievements_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SportCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
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
                    table.PrimaryKey("PK_SportCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SportEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SportTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    Venue = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Opponent = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_SportEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SportTeamMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SportTeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JerseyNumber = table.Column<int>(type: "int", nullable: true),
                    JoinDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Captain = table.Column<bool>(type: "bit", nullable: false),
                    ViceCaptain = table.Column<bool>(type: "bit", nullable: false),
                    PerformanceRating = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportTeamMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SportTeamMembers_SportTeams_SportTeamId",
                        column: x => x.SportTeamId,
                        principalTable: "SportTeams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SportTeamMembers_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Awards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AwardCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AwardLevel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PointsValue = table.Column<int>(type: "int", nullable: false),
                    CertificateTemplate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhysicalAward = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AcademicYearId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TermId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_Awards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Awards_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Awards_AwardCategories_AwardCategoryId",
                        column: x => x.AwardCategoryId,
                        principalTable: "AwardCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Awards_Terms_TermId",
                        column: x => x.TermId,
                        principalTable: "Terms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Clubs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClubCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MissionStatement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Objectives = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeetingSchedule = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeetingLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaxMembers = table.Column<int>(type: "int", nullable: false),
                    CurrentMembers = table.Column<int>(type: "int", nullable: false),
                    MembershipFee = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    AcademicYearId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdvisorStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CoAdvisorStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_Clubs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clubs_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Clubs_ClubCategories_ClubCategoryId",
                        column: x => x.ClubCategoryId,
                        principalTable: "ClubCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Clubs_StaffMembers_AdvisorStaffId",
                        column: x => x.AdvisorStaffId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Clubs_StaffMembers_CoAdvisorStaffId",
                        column: x => x.CoAdvisorStaffId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "StudentLeadershipAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeadershipPositionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AcademicYearId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GradeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ClassId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    HouseId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AppointmentDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppointmentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppointedByStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ReasonForAppointment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReasonForTermination = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PerformanceRating = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    DutiesFulfilled = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentLeadershipAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentLeadershipAssignments_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentLeadershipAssignments_Grades_GradeId",
                        column: x => x.GradeId,
                        principalTable: "Grades",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentLeadershipAssignments_LeadershipPositions_LeadershipPositionId",
                        column: x => x.LeadershipPositionId,
                        principalTable: "LeadershipPositions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentLeadershipAssignments_StaffMembers_AppointedByStaffId",
                        column: x => x.AppointedByStaffId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentLeadershipAssignments_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentAwards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AwardId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AcademicYearId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TermId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AwardDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CeremonyDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CeremonyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AchievementDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ranking = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CertificateNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IssuedByStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PresentedByStaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CertificateIssued = table.Column<bool>(type: "bit", nullable: false),
                    PhysicalAwardIssued = table.Column<bool>(type: "bit", nullable: false),
                    PointsAwarded = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_StudentAwards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentAwards_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentAwards_Awards_AwardId",
                        column: x => x.AwardId,
                        principalTable: "Awards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentAwards_StaffMembers_IssuedByStaffId",
                        column: x => x.IssuedByStaffId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentAwards_StaffMembers_PresentedByStaffId",
                        column: x => x.PresentedByStaffId,
                        principalTable: "StaffMembers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StudentAwards_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentAwards_Terms_TermId",
                        column: x => x.TermId,
                        principalTable: "Terms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ClubMeetings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeetingDate = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MeetingType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Agenda = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_ClubMeetings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubMeetings_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClubMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClubId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MemberType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JoinDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MembershipFeePaid = table.Column<bool>(type: "bit", nullable: false),
                    MembershipFeeAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Contribution = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SchoolId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubMembers_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClubMembers_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SportTeams_AcademicYearId",
                table: "SportTeams",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_SportTeams_AssistantCoachStaffId",
                table: "SportTeams",
                column: "AssistantCoachStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_SportTeams_CoachStaffId",
                table: "SportTeams",
                column: "CoachStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_SportTeams_GradeId",
                table: "SportTeams",
                column: "GradeId");

            migrationBuilder.CreateIndex(
                name: "IX_SportTeams_SportId",
                table: "SportTeams",
                column: "SportId");

            migrationBuilder.CreateIndex(
                name: "IX_Sports_SportCategoryId",
                table: "Sports",
                column: "SportCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AwardCategories_TenantId_SchoolId_Name",
                table: "AwardCategories",
                columns: new[] { "TenantId", "SchoolId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Awards_AcademicYearId",
                table: "Awards",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_Awards_AwardCategoryId",
                table: "Awards",
                column: "AwardCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Awards_TenantId_SchoolId_AwardCategoryId_Name",
                table: "Awards",
                columns: new[] { "TenantId", "SchoolId", "AwardCategoryId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Awards_TermId",
                table: "Awards",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_CeremonyAwards_TenantId_SchoolId_PrizeGivingCeremonyId_StudentAwardId",
                table: "CeremonyAwards",
                columns: new[] { "TenantId", "SchoolId", "PrizeGivingCeremonyId", "StudentAwardId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubCategories_TenantId_SchoolId_Code",
                table: "ClubCategories",
                columns: new[] { "TenantId", "SchoolId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubMeetings_ClubId",
                table: "ClubMeetings",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubMeetings_TenantId_SchoolId_ClubId_MeetingDate",
                table: "ClubMeetings",
                columns: new[] { "TenantId", "SchoolId", "ClubId", "MeetingDate" });

            migrationBuilder.CreateIndex(
                name: "IX_ClubMembers_ClubId",
                table: "ClubMembers",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubMembers_StudentId",
                table: "ClubMembers",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubMembers_TenantId_SchoolId_ClubId_StudentId",
                table: "ClubMembers",
                columns: new[] { "TenantId", "SchoolId", "ClubId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_AcademicYearId",
                table: "Clubs",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_AdvisorStaffId",
                table: "Clubs",
                column: "AdvisorStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_ClubCategoryId",
                table: "Clubs",
                column: "ClubCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_CoAdvisorStaffId",
                table: "Clubs",
                column: "CoAdvisorStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_TenantId_SchoolId_Code",
                table: "Clubs",
                columns: new[] { "TenantId", "SchoolId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeadershipDuties_TenantId_SchoolId_LeadershipPositionId_DutyTitle",
                table: "LeadershipDuties",
                columns: new[] { "TenantId", "SchoolId", "LeadershipPositionId", "DutyTitle" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeadershipDutyLogs_TenantId_SchoolId_StudentLeadershipAssignmentId_LeadershipDutyId_DutyDate",
                table: "LeadershipDutyLogs",
                columns: new[] { "TenantId", "SchoolId", "StudentLeadershipAssignmentId", "LeadershipDutyId", "DutyDate" });

            migrationBuilder.CreateIndex(
                name: "IX_LeadershipPositions_TenantId_SchoolId_Title",
                table: "LeadershipPositions",
                columns: new[] { "TenantId", "SchoolId", "Title" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PrizeGivingCeremonies_OrganizerStaffId",
                table: "PrizeGivingCeremonies",
                column: "OrganizerStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_PrizeGivingCeremonies_TenantId_SchoolId_CeremonyDate_Name",
                table: "PrizeGivingCeremonies",
                columns: new[] { "TenantId", "SchoolId", "CeremonyDate", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportAchievements_SportTeamId",
                table: "SportAchievements",
                column: "SportTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_SportAchievements_StudentId",
                table: "SportAchievements",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_SportAchievements_TenantId_SchoolId_StudentId_AchievementDate",
                table: "SportAchievements",
                columns: new[] { "TenantId", "SchoolId", "StudentId", "AchievementDate" });

            migrationBuilder.CreateIndex(
                name: "IX_SportCategories_TenantId_SchoolId_Code",
                table: "SportCategories",
                columns: new[] { "TenantId", "SchoolId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SportEvents_TenantId_SchoolId_EventDate_Venue",
                table: "SportEvents",
                columns: new[] { "TenantId", "SchoolId", "EventDate", "Venue" });

            migrationBuilder.CreateIndex(
                name: "IX_SportTeamMembers_SportTeamId",
                table: "SportTeamMembers",
                column: "SportTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_SportTeamMembers_StudentId",
                table: "SportTeamMembers",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_SportTeamMembers_TenantId_SchoolId_SportTeamId_StudentId",
                table: "SportTeamMembers",
                columns: new[] { "TenantId", "SchoolId", "SportTeamId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_AcademicYearId",
                table: "StudentAwards",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_AwardId",
                table: "StudentAwards",
                column: "AwardId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_IssuedByStaffId",
                table: "StudentAwards",
                column: "IssuedByStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_PresentedByStaffId",
                table: "StudentAwards",
                column: "PresentedByStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_StudentId",
                table: "StudentAwards",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_TenantId_SchoolId_AwardId_StudentId_AcademicYearId",
                table: "StudentAwards",
                columns: new[] { "TenantId", "SchoolId", "AwardId", "StudentId", "AcademicYearId" });

            migrationBuilder.CreateIndex(
                name: "IX_StudentAwards_TermId",
                table: "StudentAwards",
                column: "TermId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentLeadershipAssignments_AcademicYearId",
                table: "StudentLeadershipAssignments",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentLeadershipAssignments_AppointedByStaffId",
                table: "StudentLeadershipAssignments",
                column: "AppointedByStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentLeadershipAssignments_GradeId",
                table: "StudentLeadershipAssignments",
                column: "GradeId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentLeadershipAssignments_LeadershipPositionId",
                table: "StudentLeadershipAssignments",
                column: "LeadershipPositionId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentLeadershipAssignments_StudentId",
                table: "StudentLeadershipAssignments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentLeadershipAssignments_TenantId_SchoolId_StudentId_LeadershipPositionId_AcademicYearId",
                table: "StudentLeadershipAssignments",
                columns: new[] { "TenantId", "SchoolId", "StudentId", "LeadershipPositionId", "AcademicYearId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Sports_SportCategories_SportCategoryId",
                table: "Sports",
                column: "SportCategoryId",
                principalTable: "SportCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SportTeams_AcademicYears_AcademicYearId",
                table: "SportTeams",
                column: "AcademicYearId",
                principalTable: "AcademicYears",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SportTeams_Grades_GradeId",
                table: "SportTeams",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SportTeams_Sports_SportId",
                table: "SportTeams",
                column: "SportId",
                principalTable: "Sports",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SportTeams_StaffMembers_AssistantCoachStaffId",
                table: "SportTeams",
                column: "AssistantCoachStaffId",
                principalTable: "StaffMembers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SportTeams_StaffMembers_CoachStaffId",
                table: "SportTeams",
                column: "CoachStaffId",
                principalTable: "StaffMembers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sports_SportCategories_SportCategoryId",
                table: "Sports");

            migrationBuilder.DropForeignKey(
                name: "FK_SportTeams_AcademicYears_AcademicYearId",
                table: "SportTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_SportTeams_Grades_GradeId",
                table: "SportTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_SportTeams_Sports_SportId",
                table: "SportTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_SportTeams_StaffMembers_AssistantCoachStaffId",
                table: "SportTeams");

            migrationBuilder.DropForeignKey(
                name: "FK_SportTeams_StaffMembers_CoachStaffId",
                table: "SportTeams");

            migrationBuilder.DropTable(
                name: "CeremonyAwards");

            migrationBuilder.DropTable(
                name: "ClubActivities");

            migrationBuilder.DropTable(
                name: "ClubMeetings");

            migrationBuilder.DropTable(
                name: "ClubMembers");

            migrationBuilder.DropTable(
                name: "LeadershipDuties");

            migrationBuilder.DropTable(
                name: "LeadershipDutyLogs");

            migrationBuilder.DropTable(
                name: "PrizeGivingCeremonies");

            migrationBuilder.DropTable(
                name: "SportAchievements");

            migrationBuilder.DropTable(
                name: "SportCategories");

            migrationBuilder.DropTable(
                name: "SportEvents");

            migrationBuilder.DropTable(
                name: "SportTeamMembers");

            migrationBuilder.DropTable(
                name: "StudentAwards");

            migrationBuilder.DropTable(
                name: "StudentLeadershipAssignments");

            migrationBuilder.DropTable(
                name: "Clubs");

            migrationBuilder.DropTable(
                name: "Awards");

            migrationBuilder.DropTable(
                name: "LeadershipPositions");

            migrationBuilder.DropTable(
                name: "ClubCategories");

            migrationBuilder.DropTable(
                name: "AwardCategories");

            migrationBuilder.DropIndex(
                name: "IX_SportTeams_AcademicYearId",
                table: "SportTeams");

            migrationBuilder.DropIndex(
                name: "IX_SportTeams_AssistantCoachStaffId",
                table: "SportTeams");

            migrationBuilder.DropIndex(
                name: "IX_SportTeams_CoachStaffId",
                table: "SportTeams");

            migrationBuilder.DropIndex(
                name: "IX_SportTeams_GradeId",
                table: "SportTeams");

            migrationBuilder.DropIndex(
                name: "IX_SportTeams_SportId",
                table: "SportTeams");

            migrationBuilder.DropIndex(
                name: "IX_Sports_SportCategoryId",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "AcademicYearId",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "AssistantCoachStaffId",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "CoachStaffId",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "CurrentMembers",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "GradeId",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "HomeVenue",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "MaxMembers",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "PracticeSchedule",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "TeamType",
                table: "SportTeams");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "EquipmentRequired",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "IsTeamSport",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "Season",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "SportCategoryId",
                table: "Sports");

            migrationBuilder.DropColumn(
                name: "TeamSize",
                table: "Sports");
        }
    }
}
