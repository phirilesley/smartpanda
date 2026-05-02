BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ReportDefinitions]') AND [c].[name] = N'QueryKey');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [ReportDefinitions] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [ReportDefinitions] ALTER COLUMN [QueryKey] nvarchar(450) NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NotificationTemplates]') AND [c].[name] = N'Name');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [NotificationTemplates] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [NotificationTemplates] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[NotificationTemplates]') AND [c].[name] = N'Channel');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [NotificationTemplates] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [NotificationTemplates] ALTER COLUMN [Channel] nvarchar(450) NOT NULL;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AttendanceSessions]') AND [c].[name] = N'SessionType');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [AttendanceSessions] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [AttendanceSessions] ALTER COLUMN [SessionType] nvarchar(450) NOT NULL;
GO

CREATE UNIQUE INDEX [IX_StudentAttendances_TenantId_SchoolId_AttendanceSessionId_StudentId] ON [StudentAttendances] ([TenantId], [SchoolId], [AttendanceSessionId], [StudentId]);
GO

CREATE UNIQUE INDEX [IX_StaffAttendances_TenantId_SchoolId_AttendanceSessionId_StaffId] ON [StaffAttendances] ([TenantId], [SchoolId], [AttendanceSessionId], [StaffId]);
GO

CREATE UNIQUE INDEX [IX_ReportDefinitions_TenantId_SchoolId_QueryKey] ON [ReportDefinitions] ([TenantId], [SchoolId], [QueryKey]);
GO

CREATE UNIQUE INDEX [IX_NotificationTemplates_TenantId_SchoolId_Name_Channel] ON [NotificationTemplates] ([TenantId], [SchoolId], [Name], [Channel]);
GO

CREATE UNIQUE INDEX [IX_AttendanceSessions_TenantId_SchoolId_AcademicYearId_TermId_AttendanceDate_SessionType] ON [AttendanceSessions] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [AttendanceDate], [SessionType]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502033136_Phase5OperationsExpansion', N'8.0.6');
GO

COMMIT;
GO

