using System.Net;
using System.Net.Http.Json;

namespace SmartSchool.API.IntegrationTests;

public class Phase2AuthorizationIsolationTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase2AuthorizationIsolationTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/students?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/students/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/guardians?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/guardians/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/student-enrollments?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/student-enrollments/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/student-promotions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/student-promotions/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/student-guardians?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/files?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/files/10000000-0000-0000-0000-000000000001")]
    public async Task Endpoints_RequireAuthentication(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/students?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/guardians?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/student-enrollments?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/student-promotions?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/student-guardians?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/files?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_EnforceTenantIsolation(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/students?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/guardians?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/student-enrollments?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/student-promotions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/student-guardians?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/files?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    public async Task Endpoints_EnforceSchoolAccess(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Student_Creation_EnforcesUniquenessWithinSchool()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create first student
        var student1Response = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU001",
            firstName = "John",
            lastName = "Doe",
            dateOfBirth = new DateTime(2010, 5, 15),
            gender = "Male",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, student1Response.StatusCode);

        // Try to create student with same number in same school
        var student2Response = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU001",
            firstName = "Jane",
            lastName = "Smith",
            dateOfBirth = new DateTime(2010, 6, 20),
            gender = "Female",
            gradeId = TestIds.Grade2
        });
        Assert.Equal(HttpStatusCode.Conflict, student2Response.StatusCode);
    }

    [Fact]
    public async Task Student_CanBeUpdatedAndDeleted()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create student
        var createResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU002",
            firstName = "Alice",
            lastName = "Brown",
            dateOfBirth = new DateTime(2011, 3, 10),
            gender = "Female",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var studentId = await GetIdAsync(createResponse);

        // Update student
        var updateResponse = await client.PutAsJsonAsync($"/api/students/{studentId}", new
        {
            tenantId = TestIds.Tenant1,
            firstName = "Alice Mary",
            lastName = "Brown",
            dateOfBirth = new DateTime(2011, 3, 10),
            gender = "Female",
            gradeId = TestIds.Grade2
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete student
        var deleteResponse = await client.DeleteAsync($"/api/students/{studentId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Guardian_CanBeLinkedToStudentAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create guardian
        var guardianResponse = await client.PostAsJsonAsync("/api/guardians", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            firstName = "Robert",
            lastName = "Brown",
            relationship = "Father",
            phoneNumber = "0771234567",
            email = "robert@example.com"
        });
        Assert.Equal(HttpStatusCode.OK, guardianResponse.StatusCode);
        var guardianId = await GetIdAsync(guardianResponse);

        // Create student
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU003",
            firstName = "Alice",
            lastName = "Brown",
            dateOfBirth = new DateTime(2011, 3, 10),
            gender = "Female",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, studentResponse.StatusCode);
        var studentId = await GetIdAsync(studentResponse);

        // Link guardian to student
        var linkResponse = await client.PostAsJsonAsync("/api/student-guardians", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            guardianId,
            isPrimary = true
        });
        Assert.Equal(HttpStatusCode.OK, linkResponse.StatusCode);

        // Update guardian
        var updateResponse = await client.PutAsJsonAsync($"/api/guardians/{guardianId}", new
        {
            tenantId = TestIds.Tenant1,
            firstName = "Robert James",
            lastName = "Brown",
            relationship = "Father",
            phoneNumber = "0771234567",
            email = "robert.james@example.com"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
    }

    [Fact]
    public async Task StudentEnrollment_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create student
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU004",
            firstName = "David",
            lastName = "Wilson",
            dateOfBirth = new DateTime(2010, 8, 25),
            gender = "Male",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, studentResponse.StatusCode);
        var studentId = await GetIdAsync(studentResponse);

        // Create enrollment
        var enrollmentResponse = await client.PostAsJsonAsync("/api/student-enrollments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            streamId = TestIds.Stream1,
            enrollmentDate = DateTime.UtcNow.Date
        });
        Assert.Equal(HttpStatusCode.OK, enrollmentResponse.StatusCode);
        var enrollmentId = await GetIdAsync(enrollmentResponse);

        // Update enrollment
        var updateResponse = await client.PutAsJsonAsync($"/api/student-enrollments/{enrollmentId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade2,
            streamId = TestIds.Stream1,
            enrollmentDate = DateTime.UtcNow.Date
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete enrollment
        var deleteResponse = await client.DeleteAsync($"/api/student-enrollments/{enrollmentId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task StudentPromotion_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create student and enroll in current grade
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU005",
            firstName = "Emma",
            lastName = "Davis",
            dateOfBirth = new DateTime(2010, 12, 5),
            gender = "Female",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, studentResponse.StatusCode);
        var studentId = await GetIdAsync(studentResponse);

        var enrollmentResponse = await client.PostAsJsonAsync("/api/student-enrollments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            streamId = TestIds.Stream1,
            enrollmentDate = DateTime.UtcNow.Date
        });
        Assert.Equal(HttpStatusCode.OK, enrollmentResponse.StatusCode);

        // Promote student
        var promotionResponse = await client.PostAsJsonAsync("/api/student-promotions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            fromGradeId = TestIds.Grade1,
            toGradeId = TestIds.Grade2,
            fromAcademicYearId = TestIds.AcademicYear1,
            toAcademicYearId = TestIds.AcademicYear1,
            promotionDate = DateTime.UtcNow.Date,
            reason = "Academic Progress"
        });
        Assert.Equal(HttpStatusCode.OK, promotionResponse.StatusCode);

        // Verify promotion exists
        var getResponse = await client.GetAsync($"/api/student-promotions?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
    }

    [Fact]
    public async Task FileManagement_CanCreateAndUpdateMetadata()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create file metadata
        var createResponse = await client.PostAsJsonAsync("/api/files/metadata", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            originalFileName = "test.pdf",
            storedFileName = "stored_123.pdf",
            contentType = "application/pdf",
            sizeBytes = 1024000L,
            storagePath = "/uploads/2026/05/stored_123.pdf",
            uploadedByUserId = TestIds.User1
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var fileId = await GetIdAsync(createResponse);

        // Update file metadata
        var updateResponse = await client.PutAsJsonAsync($"/api/files/{fileId}", new
        {
            tenantId = TestIds.Tenant1,
            originalFileName = "test_updated.pdf",
            contentType = "application/pdf"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete file
        var deleteResponse = await client.DeleteAsync($"/api/files/{fileId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    private static async Task<Guid> GetIdAsync(HttpResponseMessage response)
    {
        var text = await response.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(text);
        return doc.RootElement.GetProperty("id").GetGuid();
    }
}
