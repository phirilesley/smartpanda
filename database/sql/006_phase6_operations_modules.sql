BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Visitors]') AND [c].[name] = N'IdNumber');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Visitors] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Visitors] ALTER COLUMN [IdNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[VisitorLogs]') AND [c].[name] = N'BadgeNumber');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [VisitorLogs] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [VisitorLogs] ALTER COLUMN [BadgeNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StaffMembers]') AND [c].[name] = N'EmployeeNumber');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [StaffMembers] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [StaffMembers] ALTER COLUMN [EmployeeNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var3 sysname;
SELECT @var3 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SportTeams]') AND [c].[name] = N'Name');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [SportTeams] DROP CONSTRAINT [' + @var3 + '];');
ALTER TABLE [SportTeams] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var4 sysname;
SELECT @var4 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Sports]') AND [c].[name] = N'Name');
IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Sports] DROP CONSTRAINT [' + @var4 + '];');
ALTER TABLE [Sports] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var5 sysname;
SELECT @var5 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'Name');
IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var5 + '];');
ALTER TABLE [Rooms] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var6 sysname;
SELECT @var6 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuestionPapers]') AND [c].[name] = N'ExamType');
IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [QuestionPapers] DROP CONSTRAINT [' + @var6 + '];');
ALTER TABLE [QuestionPapers] ALTER COLUMN [ExamType] nvarchar(450) NOT NULL;
GO

DECLARE @var7 sysname;
SELECT @var7 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[QuestionPaperCategories]') AND [c].[name] = N'Name');
IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [QuestionPaperCategories] DROP CONSTRAINT [' + @var7 + '];');
ALTER TABLE [QuestionPaperCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var8 sysname;
SELECT @var8 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PosSales]') AND [c].[name] = N'ReceiptNumber');
IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [PosSales] DROP CONSTRAINT [' + @var8 + '];');
ALTER TABLE [PosSales] ALTER COLUMN [ReceiptNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var9 sysname;
SELECT @var9 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PosProducts]') AND [c].[name] = N'Sku');
IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [PosProducts] DROP CONSTRAINT [' + @var9 + '];');
ALTER TABLE [PosProducts] ALTER COLUMN [Sku] nvarchar(450) NOT NULL;
GO

DECLARE @var10 sysname;
SELECT @var10 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PosCategories]') AND [c].[name] = N'Name');
IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [PosCategories] DROP CONSTRAINT [' + @var10 + '];');
ALTER TABLE [PosCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var11 sysname;
SELECT @var11 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PayrollPeriods]') AND [c].[name] = N'Name');
IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [PayrollPeriods] DROP CONSTRAINT [' + @var11 + '];');
ALTER TABLE [PayrollPeriods] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var12 sysname;
SELECT @var12 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[PaymentGatewayWebhooks]') AND [c].[name] = N'ProviderName');
IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [PaymentGatewayWebhooks] DROP CONSTRAINT [' + @var12 + '];');
ALTER TABLE [PaymentGatewayWebhooks] ALTER COLUMN [ProviderName] nvarchar(450) NOT NULL;
GO

DECLARE @var13 sysname;
SELECT @var13 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LeaveTypes]') AND [c].[name] = N'Name');
IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [LeaveTypes] DROP CONSTRAINT [' + @var13 + '];');
ALTER TABLE [LeaveTypes] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var14 sysname;
SELECT @var14 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[LabComputers]') AND [c].[name] = N'AssetTag');
IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [LabComputers] DROP CONSTRAINT [' + @var14 + '];');
ALTER TABLE [LabComputers] ALTER COLUMN [AssetTag] nvarchar(450) NOT NULL;
GO

DECLARE @var15 sysname;
SELECT @var15 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IntegrationSettings]') AND [c].[name] = N'ProviderName');
IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [IntegrationSettings] DROP CONSTRAINT [' + @var15 + '];');
ALTER TABLE [IntegrationSettings] ALTER COLUMN [ProviderName] nvarchar(450) NOT NULL;
GO

DECLARE @var16 sysname;
SELECT @var16 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[IntegrationSettings]') AND [c].[name] = N'IntegrationType');
IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [IntegrationSettings] DROP CONSTRAINT [' + @var16 + '];');
ALTER TABLE [IntegrationSettings] ALTER COLUMN [IntegrationType] nvarchar(450) NOT NULL;
GO

DECLARE @var17 sysname;
SELECT @var17 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Houses]') AND [c].[name] = N'Name');
IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [Houses] DROP CONSTRAINT [' + @var17 + '];');
ALTER TABLE [Houses] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var18 sysname;
SELECT @var18 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ComputerLabs]') AND [c].[name] = N'Name');
IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [ComputerLabs] DROP CONSTRAINT [' + @var18 + '];');
ALTER TABLE [ComputerLabs] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var19 sysname;
SELECT @var19 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Books]') AND [c].[name] = N'Isbn');
IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [Books] DROP CONSTRAINT [' + @var19 + '];');
ALTER TABLE [Books] ALTER COLUMN [Isbn] nvarchar(450) NOT NULL;
GO

DECLARE @var20 sysname;
SELECT @var20 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BookCopies]') AND [c].[name] = N'CopyNumber');
IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [BookCopies] DROP CONSTRAINT [' + @var20 + '];');
ALTER TABLE [BookCopies] ALTER COLUMN [CopyNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var21 sysname;
SELECT @var21 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[BookCategories]') AND [c].[name] = N'Name');
IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [BookCategories] DROP CONSTRAINT [' + @var21 + '];');
ALTER TABLE [BookCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var22 sysname;
SELECT @var22 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AssetItems]') AND [c].[name] = N'AssetTag');
IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [AssetItems] DROP CONSTRAINT [' + @var22 + '];');
ALTER TABLE [AssetItems] ALTER COLUMN [AssetTag] nvarchar(450) NOT NULL;
GO

DECLARE @var23 sysname;
SELECT @var23 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[AssetCategories]') AND [c].[name] = N'Name');
IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [AssetCategories] DROP CONSTRAINT [' + @var23 + '];');
ALTER TABLE [AssetCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

CREATE INDEX [IX_Visitors_TenantId_SchoolId_IdNumber] ON [Visitors] ([TenantId], [SchoolId], [IdNumber]);
GO

CREATE INDEX [IX_VisitorLogs_TenantId_SchoolId_BadgeNumber_CheckInAtUtc] ON [VisitorLogs] ([TenantId], [SchoolId], [BadgeNumber], [CheckInAtUtc]);
GO

CREATE UNIQUE INDEX [IX_TimetablePeriods_TenantId_SchoolId_DayOfWeek_StartTime_EndTime] ON [TimetablePeriods] ([TenantId], [SchoolId], [DayOfWeek], [StartTime], [EndTime]);
GO

CREATE UNIQUE INDEX [IX_TimetableEntries_TenantId_SchoolId_AcademicYearId_TermId_GradeId_StreamId_TimetablePeriodId] ON [TimetableEntries] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [GradeId], [StreamId], [TimetablePeriodId]);
GO

CREATE UNIQUE INDEX [IX_StaffMembers_TenantId_SchoolId_EmployeeNumber] ON [StaffMembers] ([TenantId], [SchoolId], [EmployeeNumber]);
GO

CREATE UNIQUE INDEX [IX_SportTeams_TenantId_SchoolId_SportId_Name] ON [SportTeams] ([TenantId], [SchoolId], [SportId], [Name]);
GO

CREATE UNIQUE INDEX [IX_Sports_TenantId_SchoolId_Name] ON [Sports] ([TenantId], [SchoolId], [Name]);
GO

CREATE UNIQUE INDEX [IX_SportPlayers_TenantId_SchoolId_SportTeamId_StudentId] ON [SportPlayers] ([TenantId], [SchoolId], [SportTeamId], [StudentId]);
GO

CREATE UNIQUE INDEX [IX_Rooms_TenantId_SchoolId_Name] ON [Rooms] ([TenantId], [SchoolId], [Name]);
GO

CREATE INDEX [IX_QuestionPapers_TenantId_SchoolId_QuestionPaperCategoryId_ExamYear_ExamType] ON [QuestionPapers] ([TenantId], [SchoolId], [QuestionPaperCategoryId], [ExamYear], [ExamType]);
GO

CREATE UNIQUE INDEX [IX_QuestionPaperCategories_TenantId_SchoolId_SubjectId_GradeId_Name] ON [QuestionPaperCategories] ([TenantId], [SchoolId], [SubjectId], [GradeId], [Name]);
GO

CREATE UNIQUE INDEX [IX_PosSales_TenantId_SchoolId_ReceiptNumber] ON [PosSales] ([TenantId], [SchoolId], [ReceiptNumber]);
GO

CREATE UNIQUE INDEX [IX_PosProducts_TenantId_SchoolId_Sku] ON [PosProducts] ([TenantId], [SchoolId], [Sku]);
GO

CREATE UNIQUE INDEX [IX_PosCategories_TenantId_SchoolId_Name] ON [PosCategories] ([TenantId], [SchoolId], [Name]);
GO

CREATE INDEX [IX_PosCashierSessions_TenantId_SchoolId_CashierUserId_ClosedAtUtc] ON [PosCashierSessions] ([TenantId], [SchoolId], [CashierUserId], [ClosedAtUtc]);
GO

CREATE UNIQUE INDEX [IX_PayrollPeriods_TenantId_SchoolId_Name] ON [PayrollPeriods] ([TenantId], [SchoolId], [Name]);
GO

CREATE INDEX [IX_PaymentGatewayWebhooks_TenantId_SchoolId_ProviderName_ReceivedAtUtc] ON [PaymentGatewayWebhooks] ([TenantId], [SchoolId], [ProviderName], [ReceivedAtUtc]);
GO

CREATE UNIQUE INDEX [IX_MemoApprovers_TenantId_SchoolId_MemoRequestId_ApproverUserId] ON [MemoApprovers] ([TenantId], [SchoolId], [MemoRequestId], [ApproverUserId]);
GO

CREATE UNIQUE INDEX [IX_LeaveTypes_TenantId_SchoolId_Name] ON [LeaveTypes] ([TenantId], [SchoolId], [Name]);
GO

CREATE UNIQUE INDEX [IX_LabComputers_TenantId_SchoolId_AssetTag] ON [LabComputers] ([TenantId], [SchoolId], [AssetTag]);
GO

CREATE INDEX [IX_LabBookings_TenantId_SchoolId_ComputerLabId_StartTimeUtc_EndTimeUtc] ON [LabBookings] ([TenantId], [SchoolId], [ComputerLabId], [StartTimeUtc], [EndTimeUtc]);
GO

CREATE UNIQUE INDEX [IX_IntegrationSettings_TenantId_SchoolId_IntegrationType_ProviderName] ON [IntegrationSettings] ([TenantId], [SchoolId], [IntegrationType], [ProviderName]);
GO

CREATE UNIQUE INDEX [IX_Houses_TenantId_SchoolId_Name] ON [Houses] ([TenantId], [SchoolId], [Name]);
GO

CREATE UNIQUE INDEX [IX_ComputerLabs_TenantId_SchoolId_Name] ON [ComputerLabs] ([TenantId], [SchoolId], [Name]);
GO

CREATE INDEX [IX_Books_TenantId_SchoolId_Isbn] ON [Books] ([TenantId], [SchoolId], [Isbn]);
GO

CREATE UNIQUE INDEX [IX_BookCopies_TenantId_SchoolId_CopyNumber] ON [BookCopies] ([TenantId], [SchoolId], [CopyNumber]);
GO

CREATE UNIQUE INDEX [IX_BookCategories_TenantId_SchoolId_Name] ON [BookCategories] ([TenantId], [SchoolId], [Name]);
GO

CREATE UNIQUE INDEX [IX_AssetItems_TenantId_SchoolId_AssetTag] ON [AssetItems] ([TenantId], [SchoolId], [AssetTag]);
GO

CREATE UNIQUE INDEX [IX_AssetCategories_TenantId_SchoolId_Name] ON [AssetCategories] ([TenantId], [SchoolId], [Name]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502034735_Phase6OperationsModules', N'8.0.6');
GO

COMMIT;
GO

