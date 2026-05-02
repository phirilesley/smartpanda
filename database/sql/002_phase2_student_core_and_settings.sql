BEGIN TRANSACTION;
GO

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
GO

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
GO

CREATE UNIQUE INDEX [IX_MasterDataItems_TenantId_SchoolId_DataType_Code] ON [MasterDataItems] ([TenantId], [SchoolId], [DataType], [Code]);
GO

CREATE UNIQUE INDEX [IX_SchoolSettings_TenantId_SchoolId_SettingKey] ON [SchoolSettings] ([TenantId], [SchoolId], [SettingKey]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502005002_Phase2StudentCoreAndSettings', N'8.0.6');
GO

COMMIT;
GO

