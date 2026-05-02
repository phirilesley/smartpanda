using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Assets;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Domain.Modules.Settings;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.Files;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.IntegrationTests;

internal static class TestDataSeeder
{
    public static async Task SeedAsync(SmartSchoolDbContext dbContext)
    {
        dbContext.Database.EnsureDeleted();
        dbContext.Database.EnsureCreated();

        dbContext.Tenants.AddRange(
            new Tenant { Id = TestIds.Tenant1, Name = "Tenant One", Code = "TEN1", ContactEmail = "one@tenant.test", IsActive = true },
            new Tenant { Id = TestIds.Tenant2, Name = "Tenant Two", Code = "TEN2", ContactEmail = "two@tenant.test", IsActive = true });

        dbContext.Schools.AddRange(
            new School { Id = TestIds.School1, TenantId = TestIds.Tenant1, Name = "School One", Code = "SCH1", IsActive = true },
            new School { Id = TestIds.School2, TenantId = TestIds.Tenant2, Name = "School Two", Code = "SCH2", IsActive = true });

        dbContext.AcademicYears.Add(new AcademicYear
        {
            Id = TestIds.AcademicYear1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            Name = "2026",
            StartDate = new DateTime(2026, 1, 10),
            EndDate = new DateTime(2026, 12, 1),
            IsActive = true
        });

        dbContext.Terms.Add(new Term
        {
            Id = TestIds.Term1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            AcademicYearId = TestIds.AcademicYear1,
            Name = "Term 1",
            TermNumber = 1,
            StartDate = new DateTime(2026, 1, 10),
            EndDate = new DateTime(2026, 4, 10),
            IsActive = true
        });

        dbContext.Grades.Add(new Grade
        {
            Id = TestIds.Grade1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            Name = "Grade 5",
            GradeOrder = 5,
            IsActive = true
        });

        dbContext.Streams.Add(new AcademicStream
        {
            Id = TestIds.Stream1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            GradeId = TestIds.Grade1,
            Name = "Blue",
            Capacity = 35
        });

        dbContext.Subjects.Add(new Subject
        {
            Id = TestIds.Subject1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            Name = "Mathematics",
            Code = "MATH",
            IsActive = true
        });

        dbContext.Departments.Add(new Department
        {
            Id = TestIds.Department1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            Name = "Academics",
            Description = "Teaching department"
        });

        dbContext.Students.Add(new Student
        {
            Id = TestIds.Student1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            StudentNumber = "STU001",
            FirstName = "Tariro",
            LastName = "Moyo",
            Gender = "F",
            DateOfBirth = new DateTime(2014, 5, 1),
            Status = "Active"
        });

        dbContext.StudentEnrollments.Add(new StudentEnrollment
        {
            Id = TestIds.Enrollment1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            StudentId = TestIds.Student1,
            AcademicYearId = TestIds.AcademicYear1,
            TermId = TestIds.Term1,
            GradeId = TestIds.Grade1,
            StreamId = TestIds.Stream1,
            Status = "Active",
            IsCurrent = true
        });

        dbContext.StaffMembers.Add(new StaffMember
        {
            Id = TestIds.Staff1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            EmployeeNumber = "EMP001",
            FirstName = "Nyasha",
            LastName = "Sibanda",
            DepartmentId = TestIds.Department1,
            HireDate = new DateTime(2024, 1, 1),
            IsActive = true
        });

        dbContext.BookCategories.Add(new BookCategory
        {
            Id = TestIds.BookCategory1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            Name = "Textbooks"
        });

        dbContext.AssetCategories.Add(new AssetCategory
        {
            Id = TestIds.AssetCategory1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            Name = "Computers"
        });

        dbContext.UploadedFiles.Add(new UploadedFile
        {
            Id = TestIds.UploadedFile1,
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            OriginalFileName = "sample.pdf",
            StoredFileName = "sample_1.pdf",
            ContentType = "application/pdf",
            SizeBytes = 2048,
            StoragePath = "tests/sample.pdf",
            UploadedByUserId = TestIds.User1
        });

        dbContext.StudentInvoices.Add(new StudentInvoice
        {
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            StudentId = TestIds.Student1,
            AcademicYearId = TestIds.AcademicYear1,
            TermId = TestIds.Term1,
            GradeId = TestIds.Grade1,
            InvoiceNumber = "INV-TST-001",
            TotalAmount = 100m,
            Currency = CurrencyCode.USD,
            Status = "Unpaid"
        });

        dbContext.Payments.Add(new Payment
        {
            TenantId = TestIds.Tenant1,
            SchoolId = TestIds.School1,
            StudentId = TestIds.Student1,
            InvoiceId = Guid.NewGuid(),
            AcademicYearId = TestIds.AcademicYear1,
            TermId = TestIds.Term1,
            Amount = 40m,
            Currency = CurrencyCode.USD,
            PaymentDate = DateTime.UtcNow,
            Method = "Cash",
            Reference = "TESTPAY001",
            ReceivedByUserId = TestIds.User1
        });

        dbContext.TenantFeatureFlags.AddRange(
            new TenantFeatureFlag { TenantId = TestIds.Tenant1, FeatureCode = "portal.parent", IsEnabled = true, Description = "Parent portal" },
            new TenantFeatureFlag { TenantId = TestIds.Tenant1, FeatureCode = "portal.student", IsEnabled = true, Description = "Student portal" },
            new TenantFeatureFlag { TenantId = TestIds.Tenant1, FeatureCode = "portal.staff", IsEnabled = true, Description = "Staff portal" });

        await dbContext.SaveChangesAsync();
    }
}
