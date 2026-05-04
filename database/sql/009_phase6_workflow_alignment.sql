BEGIN TRANSACTION;
GO

DROP INDEX [IX_SchoolEvents_TenantId_SchoolId_EventDateUtc_Title] ON [SchoolEvents];
GO

EXEC sp_rename N'[SchoolEvents].[EventDateUtc]', N'StartAtUtc', N'COLUMN';
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SchoolEvents]') AND [c].[name] = N'Venue');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [SchoolEvents] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [SchoolEvents] ALTER COLUMN [Venue] nvarchar(450) NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SchoolEvents]') AND [c].[name] = N'Title');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [SchoolEvents] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [SchoolEvents] ALTER COLUMN [Title] nvarchar(max) NOT NULL;
GO

ALTER TABLE [SchoolEvents] ADD [EndAtUtc] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
GO

ALTER TABLE [SchoolEvents] ADD [MaxParticipants] int NULL;
GO

ALTER TABLE [HostelIncidents] ADD [ResolvedAtUtc] datetime2 NULL;
GO

ALTER TABLE [HostelIncidents] ADD [Status] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [ClinicVisits] ADD [ClosedAtUtc] datetime2 NULL;
GO

ALTER TABLE [ClinicVisits] ADD [IsReferred] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

ALTER TABLE [ClinicVisits] ADD [ReferralFacility] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [ClinicVisits] ADD [ReferralReason] nvarchar(max) NOT NULL DEFAULT N'';
GO

ALTER TABLE [ClinicVisits] ADD [ReferredAtUtc] datetime2 NULL;
GO

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
GO

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
GO

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
GO

CREATE INDEX [IX_SchoolEvents_TenantId_SchoolId_Venue_StartAtUtc_EndAtUtc] ON [SchoolEvents] ([TenantId], [SchoolId], [Venue], [StartAtUtc], [EndAtUtc]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502234717_20260503_Phase6WorkflowAlignment', N'8.0.6');
GO

COMMIT;
GO

