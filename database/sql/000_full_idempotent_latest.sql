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

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StudentInvoices]') AND [c].[name] = N'InvoiceNumber');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [StudentInvoices] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [StudentInvoices] ALTER COLUMN [InvoiceNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Receipts]') AND [c].[name] = N'ReceiptNumber');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Receipts] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Receipts] ALTER COLUMN [ReceiptNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FeeCategories]') AND [c].[name] = N'Name');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [FeeCategories] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [FeeCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StudentInvoices_TenantId_SchoolId_InvoiceNumber] ON [StudentInvoices] ([TenantId], [SchoolId], [InvoiceNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Receipts_TenantId_SchoolId_ReceiptNumber] ON [Receipts] ([TenantId], [SchoolId], [ReceiptNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    CREATE INDEX [IX_PaymentPlans_TenantId_SchoolId_InvoiceId_StudentId] ON [PaymentPlans] ([TenantId], [SchoolId], [InvoiceId], [StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    CREATE UNIQUE INDEX [IX_FeeStructures_TenantId_SchoolId_AcademicYearId_TermId_GradeId_FeeCategoryId_Currency] ON [FeeStructures] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [GradeId], [FeeCategoryId], [Currency]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    CREATE UNIQUE INDEX [IX_FeeCategories_TenantId_SchoolId_Name] ON [FeeCategories] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031151_Phase3FinanceCore'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502031151_Phase3FinanceCore', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExamTypes]') AND [c].[name] = N'Name');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [ExamTypes] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [ExamTypes] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExamSessions]') AND [c].[name] = N'Name');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [ExamSessions] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [ExamSessions] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StudentMarks_TenantId_SchoolId_EnrollmentId_ExamSessionId_SubjectId] ON [StudentMarks] ([TenantId], [SchoolId], [EnrollmentId], [ExamSessionId], [SubjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    CREATE INDEX [IX_ResultApprovals_TenantId_SchoolId_ExamSessionId_ApprovedByUserId] ON [ResultApprovals] ([TenantId], [SchoolId], [ExamSessionId], [ApprovedByUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ReportCards_TenantId_SchoolId_StudentId_AcademicYearId_TermId_GradeId] ON [ReportCards] ([TenantId], [SchoolId], [StudentId], [AcademicYearId], [TermId], [GradeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ExamTypes_TenantId_SchoolId_Name] ON [ExamTypes] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ExamSessions_TenantId_SchoolId_AcademicYearId_TermId_GradeId_Name] ON [ExamSessions] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [GradeId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502031822_Phase4ExamsResults'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502031822_Phase4ExamsResults', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReportDefinitions]') AND [c].[name] = N'QueryKey');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [ReportDefinitions] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [ReportDefinitions] ALTER COLUMN [QueryKey] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    DECLARE @var6 sysname;
    SELECT @var6 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NotificationTemplates]') AND [c].[name] = N'Name');
    IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [NotificationTemplates] DROP CONSTRAINT [' + @var6 + '];');
    ALTER TABLE [NotificationTemplates] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    DECLARE @var7 sysname;
    SELECT @var7 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NotificationTemplates]') AND [c].[name] = N'Channel');
    IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [NotificationTemplates] DROP CONSTRAINT [' + @var7 + '];');
    ALTER TABLE [NotificationTemplates] ALTER COLUMN [Channel] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    DECLARE @var8 sysname;
    SELECT @var8 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AttendanceSessions]') AND [c].[name] = N'SessionType');
    IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [AttendanceSessions] DROP CONSTRAINT [' + @var8 + '];');
    ALTER TABLE [AttendanceSessions] ALTER COLUMN [SessionType] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StudentAttendances_TenantId_SchoolId_AttendanceSessionId_StudentId] ON [StudentAttendances] ([TenantId], [SchoolId], [AttendanceSessionId], [StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StaffAttendances_TenantId_SchoolId_AttendanceSessionId_StaffId] ON [StaffAttendances] ([TenantId], [SchoolId], [AttendanceSessionId], [StaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ReportDefinitions_TenantId_SchoolId_QueryKey] ON [ReportDefinitions] ([TenantId], [SchoolId], [QueryKey]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    CREATE UNIQUE INDEX [IX_NotificationTemplates_TenantId_SchoolId_Name_Channel] ON [NotificationTemplates] ([TenantId], [SchoolId], [Name], [Channel]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AttendanceSessions_TenantId_SchoolId_AcademicYearId_TermId_AttendanceDate_SessionType] ON [AttendanceSessions] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [AttendanceDate], [SessionType]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502033136_Phase5OperationsExpansion'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502033136_Phase5OperationsExpansion', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var9 sysname;
    SELECT @var9 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Visitors]') AND [c].[name] = N'IdNumber');
    IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Visitors] DROP CONSTRAINT [' + @var9 + '];');
    ALTER TABLE [Visitors] ALTER COLUMN [IdNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var10 sysname;
    SELECT @var10 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[VisitorLogs]') AND [c].[name] = N'BadgeNumber');
    IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [VisitorLogs] DROP CONSTRAINT [' + @var10 + '];');
    ALTER TABLE [VisitorLogs] ALTER COLUMN [BadgeNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var11 sysname;
    SELECT @var11 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StaffMembers]') AND [c].[name] = N'EmployeeNumber');
    IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [StaffMembers] DROP CONSTRAINT [' + @var11 + '];');
    ALTER TABLE [StaffMembers] ALTER COLUMN [EmployeeNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var12 sysname;
    SELECT @var12 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SportTeams]') AND [c].[name] = N'Name');
    IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [SportTeams] DROP CONSTRAINT [' + @var12 + '];');
    ALTER TABLE [SportTeams] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var13 sysname;
    SELECT @var13 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sports]') AND [c].[name] = N'Name');
    IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [Sports] DROP CONSTRAINT [' + @var13 + '];');
    ALTER TABLE [Sports] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var14 sysname;
    SELECT @var14 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'Name');
    IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var14 + '];');
    ALTER TABLE [Rooms] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var15 sysname;
    SELECT @var15 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuestionPapers]') AND [c].[name] = N'ExamType');
    IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [QuestionPapers] DROP CONSTRAINT [' + @var15 + '];');
    ALTER TABLE [QuestionPapers] ALTER COLUMN [ExamType] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var16 sysname;
    SELECT @var16 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuestionPaperCategories]') AND [c].[name] = N'Name');
    IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [QuestionPaperCategories] DROP CONSTRAINT [' + @var16 + '];');
    ALTER TABLE [QuestionPaperCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var17 sysname;
    SELECT @var17 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PosSales]') AND [c].[name] = N'ReceiptNumber');
    IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [PosSales] DROP CONSTRAINT [' + @var17 + '];');
    ALTER TABLE [PosSales] ALTER COLUMN [ReceiptNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var18 sysname;
    SELECT @var18 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PosProducts]') AND [c].[name] = N'Sku');
    IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [PosProducts] DROP CONSTRAINT [' + @var18 + '];');
    ALTER TABLE [PosProducts] ALTER COLUMN [Sku] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var19 sysname;
    SELECT @var19 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PosCategories]') AND [c].[name] = N'Name');
    IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [PosCategories] DROP CONSTRAINT [' + @var19 + '];');
    ALTER TABLE [PosCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var20 sysname;
    SELECT @var20 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PayrollPeriods]') AND [c].[name] = N'Name');
    IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [PayrollPeriods] DROP CONSTRAINT [' + @var20 + '];');
    ALTER TABLE [PayrollPeriods] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var21 sysname;
    SELECT @var21 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PaymentGatewayWebhooks]') AND [c].[name] = N'ProviderName');
    IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [PaymentGatewayWebhooks] DROP CONSTRAINT [' + @var21 + '];');
    ALTER TABLE [PaymentGatewayWebhooks] ALTER COLUMN [ProviderName] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var22 sysname;
    SELECT @var22 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeaveTypes]') AND [c].[name] = N'Name');
    IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [LeaveTypes] DROP CONSTRAINT [' + @var22 + '];');
    ALTER TABLE [LeaveTypes] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var23 sysname;
    SELECT @var23 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LabComputers]') AND [c].[name] = N'AssetTag');
    IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [LabComputers] DROP CONSTRAINT [' + @var23 + '];');
    ALTER TABLE [LabComputers] ALTER COLUMN [AssetTag] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var24 sysname;
    SELECT @var24 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IntegrationSettings]') AND [c].[name] = N'ProviderName');
    IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [IntegrationSettings] DROP CONSTRAINT [' + @var24 + '];');
    ALTER TABLE [IntegrationSettings] ALTER COLUMN [ProviderName] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var25 sysname;
    SELECT @var25 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IntegrationSettings]') AND [c].[name] = N'IntegrationType');
    IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [IntegrationSettings] DROP CONSTRAINT [' + @var25 + '];');
    ALTER TABLE [IntegrationSettings] ALTER COLUMN [IntegrationType] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var26 sysname;
    SELECT @var26 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Houses]') AND [c].[name] = N'Name');
    IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [Houses] DROP CONSTRAINT [' + @var26 + '];');
    ALTER TABLE [Houses] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var27 sysname;
    SELECT @var27 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ComputerLabs]') AND [c].[name] = N'Name');
    IF @var27 IS NOT NULL EXEC(N'ALTER TABLE [ComputerLabs] DROP CONSTRAINT [' + @var27 + '];');
    ALTER TABLE [ComputerLabs] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var28 sysname;
    SELECT @var28 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Isbn');
    IF @var28 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var28 + '];');
    ALTER TABLE [Books] ALTER COLUMN [Isbn] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var29 sysname;
    SELECT @var29 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BookCopies]') AND [c].[name] = N'CopyNumber');
    IF @var29 IS NOT NULL EXEC(N'ALTER TABLE [BookCopies] DROP CONSTRAINT [' + @var29 + '];');
    ALTER TABLE [BookCopies] ALTER COLUMN [CopyNumber] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var30 sysname;
    SELECT @var30 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BookCategories]') AND [c].[name] = N'Name');
    IF @var30 IS NOT NULL EXEC(N'ALTER TABLE [BookCategories] DROP CONSTRAINT [' + @var30 + '];');
    ALTER TABLE [BookCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var31 sysname;
    SELECT @var31 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AssetItems]') AND [c].[name] = N'AssetTag');
    IF @var31 IS NOT NULL EXEC(N'ALTER TABLE [AssetItems] DROP CONSTRAINT [' + @var31 + '];');
    ALTER TABLE [AssetItems] ALTER COLUMN [AssetTag] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    DECLARE @var32 sysname;
    SELECT @var32 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AssetCategories]') AND [c].[name] = N'Name');
    IF @var32 IS NOT NULL EXEC(N'ALTER TABLE [AssetCategories] DROP CONSTRAINT [' + @var32 + '];');
    ALTER TABLE [AssetCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_Visitors_TenantId_SchoolId_IdNumber] ON [Visitors] ([TenantId], [SchoolId], [IdNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_VisitorLogs_TenantId_SchoolId_BadgeNumber_CheckInAtUtc] ON [VisitorLogs] ([TenantId], [SchoolId], [BadgeNumber], [CheckInAtUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TimetablePeriods_TenantId_SchoolId_DayOfWeek_StartTime_EndTime] ON [TimetablePeriods] ([TenantId], [SchoolId], [DayOfWeek], [StartTime], [EndTime]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TimetableEntries_TenantId_SchoolId_AcademicYearId_TermId_GradeId_StreamId_TimetablePeriodId] ON [TimetableEntries] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [GradeId], [StreamId], [TimetablePeriodId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StaffMembers_TenantId_SchoolId_EmployeeNumber] ON [StaffMembers] ([TenantId], [SchoolId], [EmployeeNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_SportTeams_TenantId_SchoolId_SportId_Name] ON [SportTeams] ([TenantId], [SchoolId], [SportId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Sports_TenantId_SchoolId_Name] ON [Sports] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_SportPlayers_TenantId_SchoolId_SportTeamId_StudentId] ON [SportPlayers] ([TenantId], [SchoolId], [SportTeamId], [StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Rooms_TenantId_SchoolId_Name] ON [Rooms] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_QuestionPapers_TenantId_SchoolId_QuestionPaperCategoryId_ExamYear_ExamType] ON [QuestionPapers] ([TenantId], [SchoolId], [QuestionPaperCategoryId], [ExamYear], [ExamType]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_QuestionPaperCategories_TenantId_SchoolId_SubjectId_GradeId_Name] ON [QuestionPaperCategories] ([TenantId], [SchoolId], [SubjectId], [GradeId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PosSales_TenantId_SchoolId_ReceiptNumber] ON [PosSales] ([TenantId], [SchoolId], [ReceiptNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PosProducts_TenantId_SchoolId_Sku] ON [PosProducts] ([TenantId], [SchoolId], [Sku]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PosCategories_TenantId_SchoolId_Name] ON [PosCategories] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_PosCashierSessions_TenantId_SchoolId_CashierUserId_ClosedAtUtc] ON [PosCashierSessions] ([TenantId], [SchoolId], [CashierUserId], [ClosedAtUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PayrollPeriods_TenantId_SchoolId_Name] ON [PayrollPeriods] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_PaymentGatewayWebhooks_TenantId_SchoolId_ProviderName_ReceivedAtUtc] ON [PaymentGatewayWebhooks] ([TenantId], [SchoolId], [ProviderName], [ReceivedAtUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MemoApprovers_TenantId_SchoolId_MemoRequestId_ApproverUserId] ON [MemoApprovers] ([TenantId], [SchoolId], [MemoRequestId], [ApproverUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_LeaveTypes_TenantId_SchoolId_Name] ON [LeaveTypes] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_LabComputers_TenantId_SchoolId_AssetTag] ON [LabComputers] ([TenantId], [SchoolId], [AssetTag]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_LabBookings_TenantId_SchoolId_ComputerLabId_StartTimeUtc_EndTimeUtc] ON [LabBookings] ([TenantId], [SchoolId], [ComputerLabId], [StartTimeUtc], [EndTimeUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_IntegrationSettings_TenantId_SchoolId_IntegrationType_ProviderName] ON [IntegrationSettings] ([TenantId], [SchoolId], [IntegrationType], [ProviderName]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Houses_TenantId_SchoolId_Name] ON [Houses] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComputerLabs_TenantId_SchoolId_Name] ON [ComputerLabs] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE INDEX [IX_Books_TenantId_SchoolId_Isbn] ON [Books] ([TenantId], [SchoolId], [Isbn]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_BookCopies_TenantId_SchoolId_CopyNumber] ON [BookCopies] ([TenantId], [SchoolId], [CopyNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_BookCategories_TenantId_SchoolId_Name] ON [BookCategories] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AssetItems_TenantId_SchoolId_AssetTag] ON [AssetItems] ([TenantId], [SchoolId], [AssetTag]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AssetCategories_TenantId_SchoolId_Name] ON [AssetCategories] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502034735_Phase6OperationsModules'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502034735_Phase6OperationsModules', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502041150_Phase7HardeningAndFeatureFlags'
)
BEGIN
    CREATE TABLE [TenantFeatureFlags] (
        [Id] uniqueidentifier NOT NULL,
        [FeatureCode] nvarchar(450) NOT NULL,
        [IsEnabled] bit NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TenantFeatureFlags] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502041150_Phase7HardeningAndFeatureFlags'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TenantFeatureFlags_TenantId_FeatureCode] ON [TenantFeatureFlags] ([TenantId], [FeatureCode]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502041150_Phase7HardeningAndFeatureFlags'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502041150_Phase7HardeningAndFeatureFlags', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [ClinicMedications] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Unit] nvarchar(max) NOT NULL,
        [QuantityInStock] decimal(18,2) NOT NULL,
        [ReorderLevel] decimal(18,2) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClinicMedications] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [ClinicVisits] (
        [Id] uniqueidentifier NOT NULL,
        [PatientType] nvarchar(450) NOT NULL,
        [StudentId] uniqueidentifier NULL,
        [StaffId] uniqueidentifier NULL,
        [VisitDateUtc] datetime2 NOT NULL,
        [Complaint] nvarchar(max) NOT NULL,
        [Diagnosis] nvarchar(max) NOT NULL,
        [Treatment] nvarchar(max) NOT NULL,
        [AttendedByStaffId] uniqueidentifier NOT NULL,
        [FollowUpDateUtc] datetime2 NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClinicVisits] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [EventParticipants] (
        [Id] uniqueidentifier NOT NULL,
        [SchoolEventId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NULL,
        [GuardianId] uniqueidentifier NULL,
        [StaffId] uniqueidentifier NULL,
        [ParticipantType] nvarchar(max) NOT NULL,
        [AttendanceStatus] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_EventParticipants] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [HealthProfiles] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NULL,
        [StaffId] uniqueidentifier NULL,
        [BloodGroup] nvarchar(max) NOT NULL,
        [Allergies] nvarchar(max) NOT NULL,
        [ChronicConditions] nvarchar(max) NOT NULL,
        [EmergencyContactName] nvarchar(max) NOT NULL,
        [EmergencyContactPhone] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HealthProfiles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [HealthScreenings] (
        [Id] uniqueidentifier NOT NULL,
        [HealthProfileId] uniqueidentifier NOT NULL,
        [ScreeningDateUtc] datetime2 NOT NULL,
        [HeightCm] decimal(18,2) NULL,
        [WeightKg] decimal(18,2) NULL,
        [BloodPressure] nvarchar(max) NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [ScreenedByStaffId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HealthScreenings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [HostelAllocations] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [HostelBedId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NULL,
        [IsCurrent] bit NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HostelAllocations] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [HostelBeds] (
        [Id] uniqueidentifier NOT NULL,
        [HostelRoomId] uniqueidentifier NOT NULL,
        [BedCode] nvarchar(450) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HostelBeds] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [HostelIncidents] (
        [Id] uniqueidentifier NOT NULL,
        [HostelId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [ReportedByStaffId] uniqueidentifier NOT NULL,
        [OccurredAtUtc] datetime2 NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HostelIncidents] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [HostelRooms] (
        [Id] uniqueidentifier NOT NULL,
        [HostelId] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Capacity] int NOT NULL,
        [FloorName] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HostelRooms] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [Hostels] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [GenderPolicy] nvarchar(max) NOT NULL,
        [Capacity] int NOT NULL,
        [MatronStaffId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Hostels] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [ImmunizationRecords] (
        [Id] uniqueidentifier NOT NULL,
        [HealthProfileId] uniqueidentifier NOT NULL,
        [VaccineName] nvarchar(450) NOT NULL,
        [DoseNumber] int NOT NULL,
        [DateGivenUtc] datetime2 NOT NULL,
        [NextDueDateUtc] datetime2 NULL,
        [Notes] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ImmunizationRecords] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [MedicationDispenses] (
        [Id] uniqueidentifier NOT NULL,
        [ClinicVisitId] uniqueidentifier NOT NULL,
        [ClinicMedicationId] uniqueidentifier NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [Instructions] nvarchar(max) NOT NULL,
        [DispensedByStaffId] uniqueidentifier NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_MedicationDispenses] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [SchoolEvents] (
        [Id] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NULL,
        [TermId] uniqueidentifier NULL,
        [Title] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [EventDateUtc] datetime2 NOT NULL,
        [Venue] nvarchar(max) NOT NULL,
        [OrganizerStaffId] uniqueidentifier NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SchoolEvents] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [TransportRoutes] (
        [Id] uniqueidentifier NOT NULL,
        [RouteCode] nvarchar(450) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [StartLocation] nvarchar(max) NOT NULL,
        [EndLocation] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TransportRoutes] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [TransportRouteStops] (
        [Id] uniqueidentifier NOT NULL,
        [TransportRouteId] uniqueidentifier NOT NULL,
        [StopName] nvarchar(max) NOT NULL,
        [StopOrder] int NOT NULL,
        [PlannedTime] time NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TransportRouteStops] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [TransportStudentAssignments] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [TransportRouteId] uniqueidentifier NOT NULL,
        [PickupStopId] uniqueidentifier NULL,
        [DropoffStopId] uniqueidentifier NULL,
        [EffectiveFrom] datetime2 NOT NULL,
        [EffectiveTo] datetime2 NULL,
        [Status] nvarchar(450) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TransportStudentAssignments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [TransportTrips] (
        [Id] uniqueidentifier NOT NULL,
        [TransportVehicleId] uniqueidentifier NOT NULL,
        [TransportRouteId] uniqueidentifier NOT NULL,
        [DriverStaffId] uniqueidentifier NOT NULL,
        [TripDate] date NOT NULL,
        [Direction] nvarchar(450) NOT NULL,
        [DepartureAtUtc] datetime2 NULL,
        [ArrivalAtUtc] datetime2 NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TransportTrips] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE TABLE [TransportVehicles] (
        [Id] uniqueidentifier NOT NULL,
        [RegistrationNumber] nvarchar(450) NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Capacity] int NOT NULL,
        [DriverStaffId] uniqueidentifier NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_TransportVehicles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ClinicMedications_TenantId_SchoolId_Name] ON [ClinicMedications] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_ClinicVisits_TenantId_SchoolId_VisitDateUtc_PatientType] ON [ClinicVisits] ([TenantId], [SchoolId], [VisitDateUtc], [PatientType]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_EventParticipants_TenantId_SchoolId_SchoolEventId_StudentId_StaffId_GuardianId] ON [EventParticipants] ([TenantId], [SchoolId], [SchoolEventId], [StudentId], [StaffId], [GuardianId]) WHERE [StudentId] IS NOT NULL AND [StaffId] IS NOT NULL AND [GuardianId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_HealthProfiles_TenantId_SchoolId_StudentId_StaffId] ON [HealthProfiles] ([TenantId], [SchoolId], [StudentId], [StaffId]) WHERE [StudentId] IS NOT NULL AND [StaffId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_HealthScreenings_TenantId_SchoolId_HealthProfileId_ScreeningDateUtc] ON [HealthScreenings] ([TenantId], [SchoolId], [HealthProfileId], [ScreeningDateUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_HostelAllocations_TenantId_SchoolId_StudentId_IsCurrent] ON [HostelAllocations] ([TenantId], [SchoolId], [StudentId], [IsCurrent]) WHERE [IsCurrent] = 1');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_HostelBeds_TenantId_SchoolId_HostelRoomId_BedCode] ON [HostelBeds] ([TenantId], [SchoolId], [HostelRoomId], [BedCode]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_HostelIncidents_TenantId_SchoolId_HostelId_OccurredAtUtc] ON [HostelIncidents] ([TenantId], [SchoolId], [HostelId], [OccurredAtUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_HostelRooms_TenantId_SchoolId_HostelId_Name] ON [HostelRooms] ([TenantId], [SchoolId], [HostelId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Hostels_TenantId_SchoolId_Name] ON [Hostels] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ImmunizationRecords_TenantId_SchoolId_HealthProfileId_VaccineName_DoseNumber] ON [ImmunizationRecords] ([TenantId], [SchoolId], [HealthProfileId], [VaccineName], [DoseNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_MedicationDispenses_TenantId_SchoolId_ClinicVisitId_ClinicMedicationId_CreatedAtUtc] ON [MedicationDispenses] ([TenantId], [SchoolId], [ClinicVisitId], [ClinicMedicationId], [CreatedAtUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_SchoolEvents_TenantId_SchoolId_EventDateUtc_Title] ON [SchoolEvents] ([TenantId], [SchoolId], [EventDateUtc], [Title]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TransportRoutes_TenantId_SchoolId_RouteCode] ON [TransportRoutes] ([TenantId], [SchoolId], [RouteCode]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TransportRouteStops_TenantId_SchoolId_TransportRouteId_StopOrder] ON [TransportRouteStops] ([TenantId], [SchoolId], [TransportRouteId], [StopOrder]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_TransportStudentAssignments_TenantId_SchoolId_StudentId_TransportRouteId_Status] ON [TransportStudentAssignments] ([TenantId], [SchoolId], [StudentId], [TransportRouteId], [Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE INDEX [IX_TransportTrips_TenantId_SchoolId_TransportVehicleId_TripDate_Direction] ON [TransportTrips] ([TenantId], [SchoolId], [TransportVehicleId], [TripDate], [Direction]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TransportVehicles_TenantId_SchoolId_RegistrationNumber] ON [TransportVehicles] ([TenantId], [SchoolId], [RegistrationNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502185604_20260502_Phase6_EventsTransportHostelHealthClinic', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    DROP INDEX [IX_SchoolEvents_TenantId_SchoolId_EventDateUtc_Title] ON [SchoolEvents];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    EXEC sp_rename N'[SchoolEvents].[EventDateUtc]', N'StartAtUtc', N'COLUMN';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    DECLARE @var33 sysname;
    SELECT @var33 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SchoolEvents]') AND [c].[name] = N'Venue');
    IF @var33 IS NOT NULL EXEC(N'ALTER TABLE [SchoolEvents] DROP CONSTRAINT [' + @var33 + '];');
    ALTER TABLE [SchoolEvents] ALTER COLUMN [Venue] nvarchar(450) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    DECLARE @var34 sysname;
    SELECT @var34 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SchoolEvents]') AND [c].[name] = N'Title');
    IF @var34 IS NOT NULL EXEC(N'ALTER TABLE [SchoolEvents] DROP CONSTRAINT [' + @var34 + '];');
    ALTER TABLE [SchoolEvents] ALTER COLUMN [Title] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [SchoolEvents] ADD [EndAtUtc] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [SchoolEvents] ADD [MaxParticipants] int NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [HostelIncidents] ADD [ResolvedAtUtc] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [HostelIncidents] ADD [Status] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [ClinicVisits] ADD [ClosedAtUtc] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [ClinicVisits] ADD [IsReferred] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [ClinicVisits] ADD [ReferralFacility] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [ClinicVisits] ADD [ReferralReason] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    ALTER TABLE [ClinicVisits] ADD [ReferredAtUtc] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    CREATE TABLE [ClinicPrescriptionItems] (
        [Id] uniqueidentifier NOT NULL,
        [ClinicPrescriptionId] uniqueidentifier NOT NULL,
        [ClinicMedicationId] uniqueidentifier NOT NULL,
        [Dosage] nvarchar(max) NOT NULL,
        [Frequency] nvarchar(max) NOT NULL,
        [Duration] nvarchar(max) NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [Instructions] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClinicPrescriptionItems] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    CREATE TABLE [ClinicPrescriptions] (
        [Id] uniqueidentifier NOT NULL,
        [ClinicVisitId] uniqueidentifier NOT NULL,
        [PrescriptionDateUtc] datetime2 NOT NULL,
        [PrescribedByStaffId] uniqueidentifier NOT NULL,
        [Notes] nvarchar(max) NOT NULL,
        [FulfilledAtUtc] datetime2 NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClinicPrescriptions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    CREATE TABLE [HealthActionPlans] (
        [Id] uniqueidentifier NOT NULL,
        [HealthProfileId] uniqueidentifier NOT NULL,
        [Condition] nvarchar(max) NOT NULL,
        [PlanDescription] nvarchar(max) NOT NULL,
        [TriggerConditions] nvarchar(max) NOT NULL,
        [RequiredActions] nvarchar(max) NOT NULL,
        [EmergencyContacts] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_HealthActionPlans] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    CREATE INDEX [IX_SchoolEvents_TenantId_SchoolId_Venue_StartAtUtc_EndAtUtc] ON [SchoolEvents] ([TenantId], [SchoolId], [Venue], [StartAtUtc], [EndAtUtc]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260502234717_20260503_Phase6WorkflowAlignment'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260502234717_20260503_Phase6WorkflowAlignment', N'8.0.6');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [AcademicYearId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [AssistantCoachStaffId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [CoachStaffId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [CurrentMembers] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [Description] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [GradeId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [HomeVenue] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [MaxMembers] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [PracticeSchedule] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD [TeamType] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [Code] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [Description] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [EquipmentRequired] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [IsTeamSport] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [Season] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [SportCategoryId] uniqueidentifier NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD [TeamSize] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [AwardCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [CategoryType] nvarchar(max) NOT NULL,
        [AwardType] nvarchar(max) NOT NULL,
        [SelectionCriteria] nvarchar(max) NULL,
        [AwardFrequency] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_AwardCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [CeremonyAwards] (
        [Id] uniqueidentifier NOT NULL,
        [PrizeGivingCeremonyId] uniqueidentifier NOT NULL,
        [StudentAwardId] uniqueidentifier NOT NULL,
        [PresentationOrder] int NOT NULL,
        [PresenterStaffId] uniqueidentifier NULL,
        [SpecialNotes] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_CeremonyAwards] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [ClubActivities] (
        [Id] uniqueidentifier NOT NULL,
        [ClubId] uniqueidentifier NOT NULL,
        [ActivityName] nvarchar(max) NOT NULL,
        [ActivityDate] date NOT NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClubActivities] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [ClubCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Code] nvarchar(450) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClubCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [LeadershipDuties] (
        [Id] uniqueidentifier NOT NULL,
        [LeadershipPositionId] uniqueidentifier NOT NULL,
        [DutyTitle] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Priority] int NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LeadershipDuties] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [LeadershipDutyLogs] (
        [Id] uniqueidentifier NOT NULL,
        [StudentLeadershipAssignmentId] uniqueidentifier NOT NULL,
        [LeadershipDutyId] uniqueidentifier NOT NULL,
        [DutyDate] date NOT NULL,
        [StartTime] time NULL,
        [EndTime] time NULL,
        [DurationMinutes] int NULL,
        [Status] nvarchar(max) NOT NULL,
        [PerformanceNotes] nvarchar(max) NULL,
        [SupervisorStaffId] uniqueidentifier NULL,
        [SupervisorRating] decimal(18,2) NULL,
        [SupervisorComments] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LeadershipDutyLogs] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [LeadershipPositions] (
        [Id] uniqueidentifier NOT NULL,
        [Title] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [PositionType] nvarchar(max) NOT NULL,
        [Level] nvarchar(max) NOT NULL,
        [HierarchyOrder] int NOT NULL,
        [Responsibilities] nvarchar(max) NULL,
        [Qualifications] nvarchar(max) NULL,
        [SelectionProcess] nvarchar(max) NULL,
        [TermDuration] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_LeadershipPositions] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [PrizeGivingCeremonies] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [CeremonyType] nvarchar(max) NOT NULL,
        [CeremonyDate] date NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NULL,
        [Venue] nvarchar(max) NULL,
        [OrganizerStaffId] uniqueidentifier NULL,
        [MasterOfCeremonies] nvarchar(max) NULL,
        [GuestOfHonor] nvarchar(max) NULL,
        [ExpectedAttendees] int NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Program] nvarchar(max) NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_PrizeGivingCeremonies] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PrizeGivingCeremonies_StaffMembers_OrganizerStaffId] FOREIGN KEY ([OrganizerStaffId]) REFERENCES [StaffMembers] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [SportAchievements] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [SportTeamId] uniqueidentifier NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [AchievementDate] date NOT NULL,
        [Level] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportAchievements] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SportAchievements_SportTeams_SportTeamId] FOREIGN KEY ([SportTeamId]) REFERENCES [SportTeams] ([Id]),
        CONSTRAINT [FK_SportAchievements_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [SportCategories] (
        [Id] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportCategories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [SportEvents] (
        [Id] uniqueidentifier NOT NULL,
        [SportId] uniqueidentifier NULL,
        [SportTeamId] uniqueidentifier NULL,
        [Name] nvarchar(max) NOT NULL,
        [EventType] nvarchar(max) NOT NULL,
        [EventDate] date NOT NULL,
        [StartTime] time NULL,
        [Venue] nvarchar(450) NOT NULL,
        [Opponent] nvarchar(max) NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportEvents] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [SportTeamMembers] (
        [Id] uniqueidentifier NOT NULL,
        [SportTeamId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [Position] nvarchar(max) NULL,
        [JerseyNumber] int NULL,
        [JoinDate] date NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [Captain] bit NOT NULL,
        [ViceCaptain] bit NOT NULL,
        [PerformanceRating] decimal(18,2) NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_SportTeamMembers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SportTeamMembers_SportTeams_SportTeamId] FOREIGN KEY ([SportTeamId]) REFERENCES [SportTeams] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_SportTeamMembers_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [Awards] (
        [Id] uniqueidentifier NOT NULL,
        [AwardCategoryId] uniqueidentifier NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [AwardLevel] nvarchar(max) NOT NULL,
        [Value] decimal(18,2) NOT NULL,
        [PointsValue] int NOT NULL,
        [CertificateTemplate] nvarchar(max) NULL,
        [PhysicalAward] nvarchar(max) NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Awards] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Awards_AcademicYears_AcademicYearId] FOREIGN KEY ([AcademicYearId]) REFERENCES [AcademicYears] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Awards_AwardCategories_AwardCategoryId] FOREIGN KEY ([AwardCategoryId]) REFERENCES [AwardCategories] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Awards_Terms_TermId] FOREIGN KEY ([TermId]) REFERENCES [Terms] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [Clubs] (
        [Id] uniqueidentifier NOT NULL,
        [ClubCategoryId] uniqueidentifier NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [Code] nvarchar(450) NOT NULL,
        [MissionStatement] nvarchar(max) NULL,
        [Objectives] nvarchar(max) NULL,
        [MeetingSchedule] nvarchar(max) NULL,
        [MeetingLocation] nvarchar(max) NULL,
        [MaxMembers] int NOT NULL,
        [CurrentMembers] int NOT NULL,
        [MembershipFee] decimal(18,2) NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [AdvisorStaffId] uniqueidentifier NULL,
        [CoAdvisorStaffId] uniqueidentifier NULL,
        [IsActive] bit NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_Clubs] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Clubs_AcademicYears_AcademicYearId] FOREIGN KEY ([AcademicYearId]) REFERENCES [AcademicYears] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Clubs_ClubCategories_ClubCategoryId] FOREIGN KEY ([ClubCategoryId]) REFERENCES [ClubCategories] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Clubs_StaffMembers_AdvisorStaffId] FOREIGN KEY ([AdvisorStaffId]) REFERENCES [StaffMembers] ([Id]),
        CONSTRAINT [FK_Clubs_StaffMembers_CoAdvisorStaffId] FOREIGN KEY ([CoAdvisorStaffId]) REFERENCES [StaffMembers] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [StudentLeadershipAssignments] (
        [Id] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [LeadershipPositionId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [GradeId] uniqueidentifier NULL,
        [ClassId] uniqueidentifier NULL,
        [HouseId] uniqueidentifier NULL,
        [ClubId] uniqueidentifier NULL,
        [AppointmentDate] date NOT NULL,
        [EndDate] date NULL,
        [Status] nvarchar(max) NOT NULL,
        [AppointmentType] nvarchar(max) NOT NULL,
        [AppointedByStaffId] uniqueidentifier NULL,
        [ReasonForAppointment] nvarchar(max) NULL,
        [ReasonForTermination] nvarchar(max) NULL,
        [PerformanceRating] decimal(18,2) NULL,
        [DutiesFulfilled] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentLeadershipAssignments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StudentLeadershipAssignments_AcademicYears_AcademicYearId] FOREIGN KEY ([AcademicYearId]) REFERENCES [AcademicYears] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StudentLeadershipAssignments_Grades_GradeId] FOREIGN KEY ([GradeId]) REFERENCES [Grades] ([Id]),
        CONSTRAINT [FK_StudentLeadershipAssignments_LeadershipPositions_LeadershipPositionId] FOREIGN KEY ([LeadershipPositionId]) REFERENCES [LeadershipPositions] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StudentLeadershipAssignments_StaffMembers_AppointedByStaffId] FOREIGN KEY ([AppointedByStaffId]) REFERENCES [StaffMembers] ([Id]),
        CONSTRAINT [FK_StudentLeadershipAssignments_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [StudentAwards] (
        [Id] uniqueidentifier NOT NULL,
        [AwardId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [AcademicYearId] uniqueidentifier NOT NULL,
        [TermId] uniqueidentifier NULL,
        [AwardDate] date NOT NULL,
        [CeremonyDate] date NULL,
        [CeremonyName] nvarchar(max) NULL,
        [Reason] nvarchar(max) NULL,
        [AchievementDetails] nvarchar(max) NULL,
        [Ranking] nvarchar(max) NULL,
        [CertificateNumber] nvarchar(max) NULL,
        [IssuedByStaffId] uniqueidentifier NULL,
        [PresentedByStaffId] uniqueidentifier NULL,
        [CertificateIssued] bit NOT NULL,
        [PhysicalAwardIssued] bit NOT NULL,
        [PointsAwarded] int NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_StudentAwards] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StudentAwards_AcademicYears_AcademicYearId] FOREIGN KEY ([AcademicYearId]) REFERENCES [AcademicYears] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StudentAwards_Awards_AwardId] FOREIGN KEY ([AwardId]) REFERENCES [Awards] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StudentAwards_StaffMembers_IssuedByStaffId] FOREIGN KEY ([IssuedByStaffId]) REFERENCES [StaffMembers] ([Id]),
        CONSTRAINT [FK_StudentAwards_StaffMembers_PresentedByStaffId] FOREIGN KEY ([PresentedByStaffId]) REFERENCES [StaffMembers] ([Id]),
        CONSTRAINT [FK_StudentAwards_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StudentAwards_Terms_TermId] FOREIGN KEY ([TermId]) REFERENCES [Terms] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [ClubMeetings] (
        [Id] uniqueidentifier NOT NULL,
        [ClubId] uniqueidentifier NOT NULL,
        [Title] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [MeetingDate] date NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NULL,
        [Location] nvarchar(max) NULL,
        [MeetingType] nvarchar(max) NOT NULL,
        [Agenda] nvarchar(max) NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClubMeetings] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ClubMeetings_Clubs_ClubId] FOREIGN KEY ([ClubId]) REFERENCES [Clubs] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE TABLE [ClubMembers] (
        [Id] uniqueidentifier NOT NULL,
        [ClubId] uniqueidentifier NOT NULL,
        [StudentId] uniqueidentifier NOT NULL,
        [MemberType] nvarchar(max) NOT NULL,
        [Position] nvarchar(max) NULL,
        [JoinDate] date NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [MembershipFeePaid] bit NOT NULL,
        [MembershipFeeAmount] decimal(18,2) NOT NULL,
        [Contribution] nvarchar(max) NULL,
        [CreatedAtUtc] datetime2 NOT NULL,
        [UpdatedAtUtc] datetime2 NULL,
        [DeletedAtUtc] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        [TenantId] uniqueidentifier NOT NULL,
        [SchoolId] uniqueidentifier NOT NULL,
        CONSTRAINT [PK_ClubMembers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ClubMembers_Clubs_ClubId] FOREIGN KEY ([ClubId]) REFERENCES [Clubs] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ClubMembers_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeams_AcademicYearId] ON [SportTeams] ([AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeams_AssistantCoachStaffId] ON [SportTeams] ([AssistantCoachStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeams_CoachStaffId] ON [SportTeams] ([CoachStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeams_GradeId] ON [SportTeams] ([GradeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeams_SportId] ON [SportTeams] ([SportId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Sports_SportCategoryId] ON [Sports] ([SportCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_AwardCategories_TenantId_SchoolId_Name] ON [AwardCategories] ([TenantId], [SchoolId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Awards_AcademicYearId] ON [Awards] ([AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Awards_AwardCategoryId] ON [Awards] ([AwardCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Awards_TenantId_SchoolId_AwardCategoryId_Name] ON [Awards] ([TenantId], [SchoolId], [AwardCategoryId], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Awards_TermId] ON [Awards] ([TermId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_CeremonyAwards_TenantId_SchoolId_PrizeGivingCeremonyId_StudentAwardId] ON [CeremonyAwards] ([TenantId], [SchoolId], [PrizeGivingCeremonyId], [StudentAwardId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ClubCategories_TenantId_SchoolId_Code] ON [ClubCategories] ([TenantId], [SchoolId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_ClubMeetings_ClubId] ON [ClubMeetings] ([ClubId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_ClubMeetings_TenantId_SchoolId_ClubId_MeetingDate] ON [ClubMeetings] ([TenantId], [SchoolId], [ClubId], [MeetingDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_ClubMembers_ClubId] ON [ClubMembers] ([ClubId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_ClubMembers_StudentId] ON [ClubMembers] ([StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ClubMembers_TenantId_SchoolId_ClubId_StudentId] ON [ClubMembers] ([TenantId], [SchoolId], [ClubId], [StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Clubs_AcademicYearId] ON [Clubs] ([AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Clubs_AdvisorStaffId] ON [Clubs] ([AdvisorStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Clubs_ClubCategoryId] ON [Clubs] ([ClubCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_Clubs_CoAdvisorStaffId] ON [Clubs] ([CoAdvisorStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Clubs_TenantId_SchoolId_Code] ON [Clubs] ([TenantId], [SchoolId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_LeadershipDuties_TenantId_SchoolId_LeadershipPositionId_DutyTitle] ON [LeadershipDuties] ([TenantId], [SchoolId], [LeadershipPositionId], [DutyTitle]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_LeadershipDutyLogs_TenantId_SchoolId_StudentLeadershipAssignmentId_LeadershipDutyId_DutyDate] ON [LeadershipDutyLogs] ([TenantId], [SchoolId], [StudentLeadershipAssignmentId], [LeadershipDutyId], [DutyDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_LeadershipPositions_TenantId_SchoolId_Title] ON [LeadershipPositions] ([TenantId], [SchoolId], [Title]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_PrizeGivingCeremonies_OrganizerStaffId] ON [PrizeGivingCeremonies] ([OrganizerStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PrizeGivingCeremonies_TenantId_SchoolId_CeremonyDate_Name] ON [PrizeGivingCeremonies] ([TenantId], [SchoolId], [CeremonyDate], [Name]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportAchievements_SportTeamId] ON [SportAchievements] ([SportTeamId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportAchievements_StudentId] ON [SportAchievements] ([StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportAchievements_TenantId_SchoolId_StudentId_AchievementDate] ON [SportAchievements] ([TenantId], [SchoolId], [StudentId], [AchievementDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_SportCategories_TenantId_SchoolId_Code] ON [SportCategories] ([TenantId], [SchoolId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportEvents_TenantId_SchoolId_EventDate_Venue] ON [SportEvents] ([TenantId], [SchoolId], [EventDate], [Venue]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeamMembers_SportTeamId] ON [SportTeamMembers] ([SportTeamId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_SportTeamMembers_StudentId] ON [SportTeamMembers] ([StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_SportTeamMembers_TenantId_SchoolId_SportTeamId_StudentId] ON [SportTeamMembers] ([TenantId], [SchoolId], [SportTeamId], [StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_AcademicYearId] ON [StudentAwards] ([AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_AwardId] ON [StudentAwards] ([AwardId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_IssuedByStaffId] ON [StudentAwards] ([IssuedByStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_PresentedByStaffId] ON [StudentAwards] ([PresentedByStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_StudentId] ON [StudentAwards] ([StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_TenantId_SchoolId_AwardId_StudentId_AcademicYearId] ON [StudentAwards] ([TenantId], [SchoolId], [AwardId], [StudentId], [AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentAwards_TermId] ON [StudentAwards] ([TermId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentLeadershipAssignments_AcademicYearId] ON [StudentLeadershipAssignments] ([AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentLeadershipAssignments_AppointedByStaffId] ON [StudentLeadershipAssignments] ([AppointedByStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentLeadershipAssignments_GradeId] ON [StudentLeadershipAssignments] ([GradeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentLeadershipAssignments_LeadershipPositionId] ON [StudentLeadershipAssignments] ([LeadershipPositionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE INDEX [IX_StudentLeadershipAssignments_StudentId] ON [StudentLeadershipAssignments] ([StudentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StudentLeadershipAssignments_TenantId_SchoolId_StudentId_LeadershipPositionId_AcademicYearId] ON [StudentLeadershipAssignments] ([TenantId], [SchoolId], [StudentId], [LeadershipPositionId], [AcademicYearId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [Sports] ADD CONSTRAINT [FK_Sports_SportCategories_SportCategoryId] FOREIGN KEY ([SportCategoryId]) REFERENCES [SportCategories] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD CONSTRAINT [FK_SportTeams_AcademicYears_AcademicYearId] FOREIGN KEY ([AcademicYearId]) REFERENCES [AcademicYears] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD CONSTRAINT [FK_SportTeams_Grades_GradeId] FOREIGN KEY ([GradeId]) REFERENCES [Grades] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD CONSTRAINT [FK_SportTeams_Sports_SportId] FOREIGN KEY ([SportId]) REFERENCES [Sports] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD CONSTRAINT [FK_SportTeams_StaffMembers_AssistantCoachStaffId] FOREIGN KEY ([AssistantCoachStaffId]) REFERENCES [StaffMembers] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    ALTER TABLE [SportTeams] ADD CONSTRAINT [FK_SportTeams_StaffMembers_CoachStaffId] FOREIGN KEY ([CoachStaffId]) REFERENCES [StaffMembers] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260503105102_20260503_phase6_studentlife_modules'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260503105102_20260503_phase6_studentlife_modules', N'8.0.6');
END;
GO

COMMIT;
GO

