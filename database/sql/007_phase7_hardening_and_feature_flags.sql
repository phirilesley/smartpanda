BEGIN TRANSACTION;
GO

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
GO

CREATE UNIQUE INDEX [IX_TenantFeatureFlags_TenantId_FeatureCode] ON [TenantFeatureFlags] ([TenantId], [FeatureCode]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502041150_Phase7HardeningAndFeatureFlags', N'8.0.6');
GO

COMMIT;
GO

