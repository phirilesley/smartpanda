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

