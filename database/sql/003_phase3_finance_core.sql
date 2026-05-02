BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StudentInvoices]') AND [c].[name] = N'InvoiceNumber');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [StudentInvoices] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [StudentInvoices] ALTER COLUMN [InvoiceNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Receipts]') AND [c].[name] = N'ReceiptNumber');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Receipts] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [Receipts] ALTER COLUMN [ReceiptNumber] nvarchar(450) NOT NULL;
GO

DECLARE @var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FeeCategories]') AND [c].[name] = N'Name');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [FeeCategories] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [FeeCategories] ALTER COLUMN [Name] nvarchar(450) NOT NULL;
GO

CREATE UNIQUE INDEX [IX_StudentInvoices_TenantId_SchoolId_InvoiceNumber] ON [StudentInvoices] ([TenantId], [SchoolId], [InvoiceNumber]);
GO

CREATE UNIQUE INDEX [IX_Receipts_TenantId_SchoolId_ReceiptNumber] ON [Receipts] ([TenantId], [SchoolId], [ReceiptNumber]);
GO

CREATE INDEX [IX_PaymentPlans_TenantId_SchoolId_InvoiceId_StudentId] ON [PaymentPlans] ([TenantId], [SchoolId], [InvoiceId], [StudentId]);
GO

CREATE UNIQUE INDEX [IX_FeeStructures_TenantId_SchoolId_AcademicYearId_TermId_GradeId_FeeCategoryId_Currency] ON [FeeStructures] ([TenantId], [SchoolId], [AcademicYearId], [TermId], [GradeId], [FeeCategoryId], [Currency]);
GO

CREATE UNIQUE INDEX [IX_FeeCategories_TenantId_SchoolId_Name] ON [FeeCategories] ([TenantId], [SchoolId], [Name]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260502031151_Phase3FinanceCore', N'8.0.6');
GO

COMMIT;
GO

