BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExamTypes]') AND [c].[name] = N'Name');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [ExamTypes] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [ExamTypes] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[ExamSessions]') AND [c].[name] = N'Name');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [ExamSessions] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [ExamSessions] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

CREATE UNIQUE INDEX [IX_StudentMarks_TenantId_SchoolId_EnrollmentId_ExamSessionId_SubjectId] ON [StudentMarks] ([TenantId], [SchoolId], [EnrollmentId], [ExamSessionId], [SubjectId]);
GO

CREATE INDEX [IX_ResultApprovals_TenantId_SchoolId_ExamSessionId_ApprovedByUserId] ON [ResultApprovals] ([TenantId], [SchoolId], [ExamSessionId], [ApprovedByUserId]);
GO

CREATE UNIQUE INDEX [IX_ReportCards_TenantId_SchoolId_StudentId_AcademicYearId_TermId_GradeId] ON [ReportCards] ([TenantId], [SchoolId], [StudentId], [AcademicYearId], [TermId], [GradeId]);
GO

CREATE UNIQUE INDEX [IX_ExamTypes_TenantId_SchoolId_Name] ON [ExamTypes] ([TenantId], [SchoolId], [Name]);
GO

CREATE UNIQUE INDEX [IX_ExamSessions_TenantId_SchoolId_AcademicYearId_TermId_GradeId_Name] ON [ExamSessions] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [GradeId], [Name]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502031822_Phase4ExamsResults', N'8.0.6');
GO

COMMIT;
GO

