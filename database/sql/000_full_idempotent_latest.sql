IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AcademicYears] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [IsActive] bit NOT NULL,
        [IsClosed] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AcademicYears] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Announcements] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [Audience] nvarchar(max) NOT NULL,
        [PublishAtUtc] datetime2 NOT NULL,
        [ExpireAtUtc] datetime2 NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Announcements] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NULL,
        [Description] nvarchar(max) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AssetAssignments] (
        [Id] uniqueidentifier NOT NULL,
        [AssetItemId] uniqueidentifier NOT NULL,
        [AssignedToStaffId] uniqueidentifier NOT NULL,
        [AssignedDate] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AssetAssignments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AssetCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AssetCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AssetItems] (
        [Id] uniqueidentifier NOT NULL,
        [AssetCategoryId] uniqueidentifier NOT NULL,
        [AssetTag] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [PurchaseDate] datetime2 NOT NULL,
        [Cost] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AssetItems] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AssetMaintenances] (
        [Id] uniqueidentifier NOT NULL,
        [AssetItemId] uniqueidentifier NOT NULL,
        [MaintenanceDate] datetime2 NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Cost] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AssetMaintenances] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AttendanceSessions] (
        [Id] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [AttendanceDate] datetime2 NOT NULL,
        [SessionType] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AttendanceSessions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NULL,
        [Action] nvarchar(max) NOT NULL,
        [EntityName] nvarchar(max) NOT NULL,
        [EntityId] nvarchar(max) NOT NULL,
        [OldValuesJson] nvarchar(max) NOT NULL,
        [NewValuesJson] nvarchar(max) NOT NULL,
        [IpAddress] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [BookCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_BookCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [BookCopies] (
        [Id] uniqueidentifier NOT NULL,
        [BookId] uniqueidentifier NOT NULL,
        [CopyNumber] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_BookCopies] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [BookIssues] (
        [Id] uniqueidentifier NOT NULL,
        [BookCopyId] uniqueidentifier NOT NULL,
        [BorrowerStudentId] uniqueidentifier NOT NULL,
        [IssuedDate] datetime2 NOT NULL,
        [DueDate] datetime2 NOT NULL,
        [ReturnedDate] datetime2 NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_BookIssues] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Books] (
        [Id] uniqueidentifier NOT NULL,
        [BookCategoryId] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Author] nvarchar(max) NOT NULL,
        [Isbn] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Books] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ComputerLabs] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Capacity] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ComputerLabs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Departments] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Departments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Discounts] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Discounts] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ExamSessions] (
        [Id] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ExamSessions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ExamTypes] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [WeightPercent] decimal(18,2) NOT NULL,
        [IsContinuousAssessment] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ExamTypes] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [FeeCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [IsMandatory] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_FeeCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [FeeStructures] (
        [Id] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [FeeCategoryId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Currency] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_FeeStructures] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Fixtures] (
        [Id] uniqueidentifier NOT NULL,
        [SportTeamId] uniqueidentifier NOT NULL,
        [FixtureDateUtc] datetime2 NOT NULL,
        [Opponent] nvarchar(max) NOT NULL,
        [Venue] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Fixtures] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Grades] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [GradeOrder] int NOT NULL,
        [IsTerminalGrade] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Grades] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [GradeScales] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [MinMark] decimal(18,2) NOT NULL,
        [MaxMark] decimal(18,2) NOT NULL,
        [LetterGrade] nvarchar(max) NOT NULL,
        [Points] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_GradeScales] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [GradeSubjects] (
        [Id] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [SubjectId] uniqueidentifier NOT NULL,
        [AssignedTeacherStaffId] uniqueidentifier NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_GradeSubjects] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Guardians] (
        [Id] uniqueidentifier NOT NULL,
        [FirstName] nvarchar(max) NOT NULL,
        [LastName] nvarchar(max) NOT NULL,
        [PhoneNumber] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [Relationship] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Guardians] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [HelpDeskComments] (
        [Id] uniqueidentifier NOT NULL,
        [HelpDeskTicketId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Comment] nvarchar(max) NOT NULL,
        [CommentedAtUtc] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HelpDeskComments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [HelpDeskSlaRules] (
        [Id] uniqueidentifier NOT NULL,
        [Priority] nvarchar(max) NOT NULL,
        [FirstResponseMinutes] int NOT NULL,
        [ResolutionMinutes] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HelpDeskSlaRules] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [HelpDeskTickets] (
        [Id] uniqueidentifier NOT NULL,
        [TicketNumber] nvarchar(max) NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Priority] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [RequestedByUserId] uniqueidentifier NOT NULL,
        [AssignedToUserId] uniqueidentifier NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HelpDeskTickets] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Houses] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [ColorCode] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Houses] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [IntegrationSettings] (
        [Id] uniqueidentifier NOT NULL,
        [IntegrationType] nvarchar(max) NOT NULL,
        [ProviderName] nvarchar(max) NOT NULL,
        [EncryptedSettingsJson] nvarchar(max) NOT NULL,
        [IsEnabled] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_IntegrationSettings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [LabBookings] (
        [Id] uniqueidentifier NOT NULL,
        [ComputerLabId] uniqueidentifier NOT NULL,
        [TeacherStaffId] uniqueidentifier NOT NULL,
        [StartTimeUtc] datetime2 NOT NULL,
        [EndTimeUtc] datetime2 NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [StreamId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LabBookings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [LabComputers] (
        [Id] uniqueidentifier NOT NULL,
        [ComputerLabId] uniqueidentifier NOT NULL,
        [AssetTag] nvarchar(max) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LabComputers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [LabFaults] (
        [Id] uniqueidentifier NOT NULL,
        [LabComputerId] uniqueidentifier NOT NULL,
        [ReportedAtUtc] datetime2 NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LabFaults] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [LeaveApplications] (
        [Id] uniqueidentifier NOT NULL,
        [StaffId] uniqueidentifier NOT NULL,
        [LeaveTypeId] uniqueidentifier NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LeaveApplications] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [LeaveTypes] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [AnnualDays] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LeaveTypes] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [LibraryFines] (
        [Id] uniqueidentifier NOT NULL,
        [BookIssueId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [IsPaid] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LibraryFines] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MarkSheets] (
        [Id] uniqueidentifier NOT NULL,
        [ExamSessionId] uniqueidentifier NOT NULL,
        [SubjectId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [StreamId] uniqueidentifier NOT NULL,
        [TeacherStaffId] uniqueidentifier NOT NULL,
        [IsSubmitted] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MarkSheets] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MemoApprovalActions] (
        [Id] uniqueidentifier NOT NULL,
        [MemoRequestId] uniqueidentifier NOT NULL,
        [ApproverUserId] uniqueidentifier NOT NULL,
        [Action] nvarchar(max) NOT NULL,
        [Comment] nvarchar(max) NOT NULL,
        [ActionAtUtc] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MemoApprovalActions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MemoApprovers] (
        [Id] uniqueidentifier NOT NULL,
        [MemoRequestId] uniqueidentifier NOT NULL,
        [ApproverUserId] uniqueidentifier NOT NULL,
        [ApprovalOrder] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MemoApprovers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MemoAttachments] (
        [Id] uniqueidentifier NOT NULL,
        [MemoRequestId] uniqueidentifier NOT NULL,
        [UploadedFileId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MemoAttachments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MemoRequests] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [RequestedByUserId] uniqueidentifier NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MemoRequests] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MessageParticipants] (
        [Id] uniqueidentifier NOT NULL,
        [MessageThreadId] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MessageParticipants] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Messages] (
        [Id] uniqueidentifier NOT NULL,
        [MessageThreadId] uniqueidentifier NOT NULL,
        [SenderUserId] uniqueidentifier NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [SentAtUtc] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Messages] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [MessageThreads] (
        [Id] uniqueidentifier NOT NULL,
        [Subject] nvarchar(max) NOT NULL,
        [IsClosed] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MessageThreads] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Notifications] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NULL,
        [StudentId] uniqueidentifier NULL,
        [Channel] nvarchar(max) NOT NULL,
        [Subject] nvarchar(max) NOT NULL,
        [Body] nvarchar(max) NOT NULL,
        [SentAtUtc] datetime2 NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [NotificationTemplates] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Channel] nvarchar(max) NOT NULL,
        [SubjectTemplate] nvarchar(max) NOT NULL,
        [BodyTemplate] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_NotificationTemplates] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PaymentGatewayWebhooks] (
        [Id] uniqueidentifier NOT NULL,
        [ProviderName] nvarchar(max) NOT NULL,
        [EventType] nvarchar(max) NOT NULL,
        [PayloadJson] nvarchar(max) NOT NULL,
        [ReceivedAtUtc] datetime2 NOT NULL,
        [IsProcessed] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PaymentGatewayWebhooks] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PaymentPlans] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [InvoiceId] uniqueidentifier NOT NULL,
        [Installments] int NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PaymentPlans] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Payments] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [InvoiceId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Currency] int NOT NULL,
        [Method] nvarchar(max) NOT NULL,
        [Reference] nvarchar(max) NOT NULL,
        [PaymentDate] datetime2 NOT NULL,
        [ReceivedByUserId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Payments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PayrollItems] (
        [Id] uniqueidentifier NOT NULL,
        [PayrollPeriodId] uniqueidentifier NOT NULL,
        [StaffId] uniqueidentifier NOT NULL,
        [ItemType] nvarchar(max) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PayrollItems] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PayrollPeriods] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [IsClosed] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PayrollPeriods] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Permissions] (
        [Id] uniqueidentifier NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Permissions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PortalQuickLinks] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [Label] nvarchar(max) NOT NULL,
        [Url] nvarchar(max) NOT NULL,
        [DisplayOrder] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PortalQuickLinks] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PortalWidgetPreferences] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [PortalType] nvarchar(max) NOT NULL,
        [WidgetKey] nvarchar(max) NOT NULL,
        [DisplayOrder] int NOT NULL,
        [IsVisible] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PortalWidgetPreferences] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosCashierSessions] (
        [Id] uniqueidentifier NOT NULL,
        [CashierUserId] uniqueidentifier NOT NULL,
        [OpenedAtUtc] datetime2 NOT NULL,
        [ClosedAtUtc] datetime2 NULL,
        [OpeningFloat] decimal(18,2) NOT NULL,
        [ClosingAmount] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosCashierSessions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosPayments] (
        [Id] uniqueidentifier NOT NULL,
        [PosSaleId] uniqueidentifier NOT NULL,
        [Method] nvarchar(max) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Reference] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosPayments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosProducts] (
        [Id] uniqueidentifier NOT NULL,
        [PosCategoryId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Sku] nvarchar(max) NOT NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [QuantityOnHand] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosProducts] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosSaleLines] (
        [Id] uniqueidentifier NOT NULL,
        [PosSaleId] uniqueidentifier NOT NULL,
        [PosProductId] uniqueidentifier NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [LineTotal] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosSaleLines] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosSales] (
        [Id] uniqueidentifier NOT NULL,
        [PosCashierSessionId] uniqueidentifier NOT NULL,
        [ReceiptNumber] nvarchar(max) NOT NULL,
        [SaleDateUtc] datetime2 NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosSales] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [PosStockMovements] (
        [Id] uniqueidentifier NOT NULL,
        [PosProductId] uniqueidentifier NOT NULL,
        [MovementType] nvarchar(max) NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [MovementDateUtc] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PosStockMovements] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [QuestionPaperCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [SubjectId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_QuestionPaperCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [QuestionPaperDownloads] (
        [Id] uniqueidentifier NOT NULL,
        [QuestionPaperId] uniqueidentifier NOT NULL,
        [DownloadedByUserId] uniqueidentifier NOT NULL,
        [DownloadedAtUtc] datetime2 NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_QuestionPaperDownloads] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [QuestionPapers] (
        [Id] uniqueidentifier NOT NULL,
        [QuestionPaperCategoryId] uniqueidentifier NOT NULL,
        [UploadedFileId] uniqueidentifier NOT NULL,
        [ExamYear] int NOT NULL,
        [ExamType] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_QuestionPapers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Receipts] (
        [Id] uniqueidentifier NOT NULL,
        [PaymentId] uniqueidentifier NOT NULL,
        [ReceiptNumber] nvarchar(max) NOT NULL,
        [IssuedAtUtc] datetime2 NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Receipts] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [RefreshTokens] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [TokenHash] nvarchar(450) NOT NULL,
        [ExpiresAtUtc] datetime2 NOT NULL,
        [RevokedAtUtc] datetime2 NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ReportCards] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [TotalMarks] decimal(18,2) NOT NULL,
        [AverageMark] decimal(18,2) NOT NULL,
        [PositionInClass] int NOT NULL,
        [IsPublished] bit NOT NULL,
        [PublishedAtUtc] datetime2 NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ReportCards] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ReportDefinitions] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Module] nvarchar(max) NOT NULL,
        [QueryKey] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ReportDefinitions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ReportRuns] (
        [Id] uniqueidentifier NOT NULL,
        [ReportDefinitionId] uniqueidentifier NOT NULL,
        [RequestedByUserId] uniqueidentifier NOT NULL,
        [RequestedAtUtc] datetime2 NOT NULL,
        [CompletedAtUtc] datetime2 NULL,
        [Status] nvarchar(max) NOT NULL,
        [OutputFileId] uniqueidentifier NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ReportRuns] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [ResultApprovals] (
        [Id] uniqueidentifier NOT NULL,
        [ExamSessionId] uniqueidentifier NOT NULL,
        [ApprovedByUserId] uniqueidentifier NOT NULL,
        [ApprovedAtUtc] datetime2 NOT NULL,
        [Comments] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ResultApprovals] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [RolePermissions] (
        [Id] uniqueidentifier NOT NULL,
        [RoleId] uniqueidentifier NOT NULL,
        [PermissionId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Rooms] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Capacity] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Scholarships] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Sponsor] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Scholarships] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [SchoolBranches] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [BranchCode] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SchoolBranches] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Schools] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [Phone] nvarchar(max) NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Schools] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [SportPlayers] (
        [Id] uniqueidentifier NOT NULL,
        [SportTeamId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [Position] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportPlayers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [SportResults] (
        [Id] uniqueidentifier NOT NULL,
        [FixtureId] uniqueidentifier NOT NULL,
        [TeamScore] int NOT NULL,
        [OpponentScore] int NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportResults] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Sports] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Sports] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [SportTeams] (
        [Id] uniqueidentifier NOT NULL,
        [SportId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [HouseId] uniqueidentifier NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportTeams] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StaffAttendances] (
        [Id] uniqueidentifier NOT NULL,
        [AttendanceSessionId] uniqueidentifier NOT NULL,
        [StaffId] uniqueidentifier NOT NULL,
        [IsPresent] bit NOT NULL,
        [Remarks] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StaffAttendances] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StaffContracts] (
        [Id] uniqueidentifier NOT NULL,
        [StaffId] uniqueidentifier NOT NULL,
        [ContractType] nvarchar(max) NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [BasicSalary] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StaffContracts] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StaffMembers] (
        [Id] uniqueidentifier NOT NULL,
        [EmployeeNumber] nvarchar(max) NOT NULL,
        [FirstName] nvarchar(max) NOT NULL,
        [LastName] nvarchar(max) NOT NULL,
        [DepartmentId] uniqueidentifier NOT NULL,
        [HireDate] datetime2 NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StaffMembers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Streams] (
        [Id] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Capacity] int NOT NULL,
        [ClassTeacherStaffId] uniqueidentifier NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Streams] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentAttendances] (
        [Id] uniqueidentifier NOT NULL,
        [AttendanceSessionId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [EnrollmentId] uniqueidentifier NOT NULL,
        [IsPresent] bit NOT NULL,
        [Remarks] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentAttendances] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentDocuments] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [UploadedFileId] uniqueidentifier NOT NULL,
        [DocumentType] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentDocuments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentEnrollments] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [StreamId] uniqueidentifier NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [IsCurrent] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentEnrollments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentGuardians] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [GuardianId] uniqueidentifier NOT NULL,
        [IsPrimaryContact] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentGuardians] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentInvoiceLines] (
        [Id] uniqueidentifier NOT NULL,
        [StudentInvoiceId] uniqueidentifier NOT NULL,
        [FeeCategoryId] uniqueidentifier NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentInvoiceLines] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentInvoices] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [InvoiceNumber] nvarchar(max) NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [Currency] int NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentInvoices] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentMarks] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [EnrollmentId] uniqueidentifier NOT NULL,
        [ExamSessionId] uniqueidentifier NOT NULL,
        [SubjectId] uniqueidentifier NOT NULL,
        [Mark] decimal(18,2) NOT NULL,
        [Grade] nvarchar(max) NOT NULL,
        [EnteredByStaffId] uniqueidentifier NOT NULL,
        [ApprovedAtUtc] datetime2 NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentMarks] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentMedicalRecords] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [Conditions] nvarchar(max) NOT NULL,
        [Allergies] nvarchar(max) NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentMedicalRecords] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentPromotions] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [FromAcademicYearId] uniqueidentifier NOT NULL,
        [ToAcademicYearId] uniqueidentifier NOT NULL,
        [FromGradeId] uniqueidentifier NOT NULL,
        [ToGradeId] uniqueidentifier NOT NULL,
        [Decision] int NOT NULL,
        [PromotionDate] datetime2 NOT NULL,
        [Remarks] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentPromotions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Students] (
        [Id] uniqueidentifier NOT NULL,
        [StudentNumber] nvarchar(450) NOT NULL,
        [FirstName] nvarchar(max) NOT NULL,
        [LastName] nvarchar(max) NOT NULL,
        [Gender] nvarchar(max) NOT NULL,
        [DateOfBirth] datetime2 NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Students] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [StudentTransfers] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [TransferDate] datetime2 NOT NULL,
        [FromSchoolName] nvarchar(max) NOT NULL,
        [ToSchoolName] nvarchar(max) NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentTransfers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Subjects] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [IsOptional] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Subjects] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [SubscriptionPlans] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [MonthlyPriceUsd] decimal(18,2) NOT NULL,
        [MaxSchools] int NOT NULL,
        [MaxUsers] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_SubscriptionPlans] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Tenants] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [ContactEmail] nvarchar(max) NOT NULL,
        [ContactPhone] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Tenants] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [TenantSubscriptions] (
        [Id] uniqueidentifier NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SubscriptionPlanId] uniqueidentifier NOT NULL,
        [StartDateUtc] datetime2 NOT NULL,
        [EndDateUtc] datetime2 NOT NULL,
        [AutoRenew] bit NOT NULL,
        [Status] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_TenantSubscriptions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Terms] (
        [Id] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [TermNumber] int NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [IsActive] bit NOT NULL,
        [IsClosed] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Terms] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [TimetableEntries] (
        [Id] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NOT NULL,
        [StreamId] uniqueidentifier NOT NULL,
        [SubjectId] uniqueidentifier NOT NULL,
        [StaffId] uniqueidentifier NOT NULL,
        [RoomId] uniqueidentifier NOT NULL,
        [TimetablePeriodId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TimetableEntries] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [TimetablePeriods] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [DayOfWeek] int NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TimetablePeriods] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [UploadedFiles] (
        [Id] uniqueidentifier NOT NULL,
        [OriginalFileName] nvarchar(max) NOT NULL,
        [StoredFileName] nvarchar(max) NOT NULL,
        [ContentType] nvarchar(max) NOT NULL,
        [SizeBytes] bigint NOT NULL,
        [StoragePath] nvarchar(max) NOT NULL,
        [UploadedByUserId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_UploadedFiles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [UserPermissions] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [PermissionId] uniqueidentifier NOT NULL,
        [IsAllowed] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_UserPermissions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [UserSchoolAccesses] (
        [Id] uniqueidentifier NOT NULL,
        [UserId] uniqueidentifier NOT NULL,
        [CanRead] bit NOT NULL,
        [CanWrite] bit NOT NULL,
        [CanApprove] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_UserSchoolAccesses] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [VisitorLogs] (
        [Id] uniqueidentifier NOT NULL,
        [VisitorId] uniqueidentifier NOT NULL,
        [HostStaffId] uniqueidentifier NOT NULL,
        [CheckInAtUtc] datetime2 NOT NULL,
        [CheckOutAtUtc] datetime2 NULL,
        [Purpose] nvarchar(max) NOT NULL,
        [BadgeNumber] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_VisitorLogs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [Visitors] (
        [Id] uniqueidentifier NOT NULL,
        [FullName] nvarchar(max) NOT NULL,
        [PhoneNumber] nvarchar(max) NOT NULL,
        [IdNumber] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Visitors] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] uniqueidentifier NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] uniqueidentifier NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] uniqueidentifier NOT NULL,
        [RoleId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] uniqueidentifier NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Grades_TenantId_SchoolId_GradeOrder] ON [Grades] ([TenantId], [SchoolId], [GradeOrder]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Permissions_Code] ON [Permissions] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_RefreshTokens_TenantId_UserId_TokenHash] ON [RefreshTokens] ([TenantId], [UserId], [TokenHash]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_RolePermissions_TenantId_RoleId_PermissionId] ON [RolePermissions] ([TenantId], [RoleId], [PermissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Schools_TenantId_Code] ON [Schools] ([TenantId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Streams_TenantId_SchoolId_GradeId_Name] ON [Streams] ([TenantId], [SchoolId], [GradeId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_StudentEnrollments_TenantId_SchoolId_StudentId_IsCurrent] ON [StudentEnrollments] ([TenantId], [SchoolId], [StudentId], [IsCurrent]) WHERE [IsCurrent] = 1');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Students_TenantId_SchoolId_StudentNumber] ON [Students] ([TenantId], [SchoolId], [StudentNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Subjects_TenantId_SchoolId_Code] ON [Subjects] ([TenantId], [SchoolId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Tenants_Code] ON [Tenants] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Terms_TenantId_SchoolId_AcademicYearId_TermNumber] ON [Terms] ([TenantId], [SchoolId], [AcademicYearId], [TermNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_UserPermissions_TenantId_UserId_PermissionId] ON [UserPermissions] ([TenantId], [UserId], [PermissionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    CREATE UNIQUE INDEX [IX_UserSchoolAccesses_TenantId_SchoolId_UserId] ON [UserSchoolAccesses] ([TenantId], [SchoolId], [UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502003522_InitialPhase1Foundation'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502003522_InitialPhase1Foundation', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502005002_Phase2StudentCoreAndSettings'
)
BEGIN
    CREATE TABLE [MasterDataItems] (
        [Id] uniqueidentifier NOT NULL,
        [DataType] nvarchar(450) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [DisplayOrder] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MasterDataItems] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502005002_Phase2StudentCoreAndSettings'
)
BEGIN
    CREATE TABLE [SchoolSettings] (
        [Id] uniqueidentifier NOT NULL,
        [SettingKey] nvarchar(450) NOT NULL,
        [SettingValue] nvarchar(max) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [IsSensitive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SchoolSettings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502005002_Phase2StudentCoreAndSettings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MasterDataItems_TenantId_SchoolId_DataType_Code] ON [MasterDataItems] ([TenantId], [SchoolId], [DataType], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502005002_Phase2StudentCoreAndSettings'
)
BEGIN
    CREATE UNIQUE INDEX [IX_SchoolSettings_TenantId_SchoolId_SettingKey] ON [SchoolSettings] ([TenantId], [SchoolId], [SettingKey]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502005002_Phase2StudentCoreAndSettings'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502005002_Phase2StudentCoreAndSettings', N'8.0.6');
END;
GO

COMMIT;
GO

