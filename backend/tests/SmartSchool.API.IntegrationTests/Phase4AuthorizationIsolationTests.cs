using System.Net;
using System.Net.Http.Json;

namespace SmartSchool.API.IntegrationTests;

public class Phase4AuthorizationIsolationTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase4AuthorizationIsolationTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/exams/exam-types?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/exam-types/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/exams/exam-sessions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/exam-sessions/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/exams/student-marks?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/student-marks/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/exams/result-approvals?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/result-approvals/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/exams/report-cards?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/report-cards/10000000-0000-0000-0000-000000000001")]
    public async Task Endpoints_RequireAuthentication(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/exams/exam-types?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/exam-sessions?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/student-marks?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/result-approvals?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/exams/report-cards?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_EnforceTenantIsolation(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/exams/exam-types?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/exams/exam-sessions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/exams/student-marks?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/exams/result-approvals?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/exams/report-cards?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    public async Task Endpoints_EnforceSchoolAccess(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ExamType_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create exam type
        var createResponse = await client.PostAsJsonAsync("/api/exams/exam-types", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Mid-Term Examination",
            description = "Mid-term assessment",
            maxMarks = 100m,
            passingMarks = 50m
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var examTypeId = await GetIdAsync(createResponse);

        // Update exam type
        var updateResponse = await client.PutAsJsonAsync($"/api/exams/exam-types/{examTypeId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Mid-Term Examination - Updated",
            description = "Mid-term assessment with updates",
            maxMarks = 100m,
            passingMarks = 45m
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete exam type
        var deleteResponse = await client.DeleteAsync($"/api/exams/exam-types/{examTypeId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task ExamSession_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create exam type first
        var examTypeResponse = await client.PostAsJsonAsync("/api/exams/exam-types", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Final Examination",
            description = "Final year assessment",
            maxMarks = 100m,
            passingMarks = 50m
        });
        var examTypeId = await GetIdAsync(examTypeResponse);

        // Create exam session
        var sessionResponse = await client.PostAsJsonAsync("/api/exams/exam-sessions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Grade 5 Final Exam",
            examTypeId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            examDate = DateTime.UtcNow.AddDays(7),
            totalMarks = 100m,
            status = "Scheduled"
        });
        Assert.Equal(HttpStatusCode.OK, sessionResponse.StatusCode);
        var sessionId = await GetIdAsync(sessionResponse);

        // Update exam session
        var updateResponse = await client.PutAsJsonAsync($"/api/exams/exam-sessions/{sessionId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Grade 5 Final Exam - Rescheduled",
            examTypeId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            examDate = DateTime.UtcNow.AddDays(14),
            totalMarks = 100m,
            status = "Scheduled"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete exam session
        var deleteResponse = await client.DeleteAsync($"/api/exams/exam-sessions/{sessionId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task StudentMarks_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create exam type and session
        var examTypeResponse = await client.PostAsJsonAsync("/api/exams/exam-types", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Test Exam",
            description = "Test examination",
            maxMarks = 100m,
            passingMarks = 50m
        });
        var examTypeId = await GetIdAsync(examTypeResponse);

        var sessionResponse = await client.PostAsJsonAsync("/api/exams/exam-sessions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Test Session",
            examTypeId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            examDate = DateTime.UtcNow,
            totalMarks = 100m,
            status = "Completed"
        });
        var sessionId = await GetIdAsync(sessionResponse);

        // Create student
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU010",
            firstName = "Jack",
            lastName = "Wilson",
            dateOfBirth = new DateTime(2010, 4, 8),
            gender = "Male",
            gradeId = TestIds.Grade1
        });
        var studentId = await GetIdAsync(studentResponse);

        // Create student marks using bulk upsert
        var marksResponse = await client.PostAsJsonAsync("/api/exams/student-marks", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            examSessionId = sessionId,
            marks = new[]
            {
                new { studentId, mark = 85m, remarks = "Good performance" }
            }
        });
        Assert.Equal(HttpStatusCode.OK, marksResponse.StatusCode);

        // Get individual mark for update test
        var getResponse = await client.GetAsync($"/api/exams/student-marks?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&examSessionId={sessionId}&studentId={studentId}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Update individual mark (using the new PUT endpoint)
        var updateResponse = await client.PutAsJsonAsync($"/api/exams/student-marks/{sessionId}/{studentId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            mark = 90m,
            remarks = "Excellent performance"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete individual mark
        var deleteResponse = await client.DeleteAsync($"/api/exams/student-marks/{sessionId}/{studentId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task ResultApproval_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create exam type and session
        var examTypeResponse = await client.PostAsJsonAsync("/api/exams/exam-types", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Approval Test Exam",
            description = "Exam for approval testing",
            maxMarks = 100m,
            passingMarks = 50m
        });
        var examTypeId = await GetIdAsync(examTypeResponse);

        var sessionResponse = await client.PostAsJsonAsync("/api/exams/exam-sessions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Approval Test Session",
            examTypeId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            examDate = DateTime.UtcNow,
            totalMarks = 100m,
            status = "Completed"
        });
        var sessionId = await GetIdAsync(sessionResponse);

        // Create student and marks
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU011",
            firstName = "Kate",
            lastName = "Brown",
            dateOfBirth = new DateTime(2010, 6, 15),
            gender = "Female",
            gradeId = TestIds.Grade1
        });
        var studentId = await GetIdAsync(studentResponse);

        var marksResponse = await client.PostAsJsonAsync("/api/exams/student-marks", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            examSessionId = sessionId,
            marks = new[]
            {
                new { studentId, mark = 75m, remarks = "Average performance" }
            }
        });
        Assert.Equal(HttpStatusCode.OK, marksResponse.StatusCode);

        // Approve exam results
        var approvalResponse = await client.PostAsJsonAsync("/api/exams/result-approvals", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            examSessionId = sessionId,
            approvedByUserId = TestIds.User1,
            comments = "Results approved for publication"
        });
        Assert.Equal(HttpStatusCode.OK, approvalResponse.StatusCode);
        var approvalId = await GetIdAsync(approvalResponse);

        // Get approval record
        var getApprovalResponse = await client.GetAsync($"/api/exams/result-approvals/{approvalId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getApprovalResponse.StatusCode);

        // Delete approval (revert approval)
        var deleteResponse = await client.DeleteAsync($"/api/exams/result-approvals/{approvalId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task ReportCard_GenerationAndPublishing_Succeeds()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create exam type and session
        var examTypeResponse = await client.PostAsJsonAsync("/api/exams/exam-types", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Report Card Test Exam",
            description = "Exam for report card testing",
            maxMarks = 100m,
            passingMarks = 50m
        });
        var examTypeId = await GetIdAsync(examTypeResponse);

        var sessionResponse = await client.PostAsJsonAsync("/api/exams/exam-sessions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Report Card Test Session",
            examTypeId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            examDate = DateTime.UtcNow,
            totalMarks = 100m,
            status = "Completed"
        });
        var sessionId = await GetIdAsync(sessionResponse);

        // Create student and marks
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU012",
            firstName = "Leo",
            lastName = "Martinez",
            dateOfBirth = new DateTime(2010, 8, 20),
            gender = "Male",
            gradeId = TestIds.Grade1
        });
        var studentId = await GetIdAsync(studentResponse);

        var marksResponse = await client.PostAsJsonAsync("/api/exams/student-marks", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            examSessionId = sessionId,
            marks = new[]
            {
                new { studentId, mark = 88m, remarks = "Very good performance" }
            }
        });
        Assert.Equal(HttpStatusCode.OK, marksResponse.StatusCode);

        // Generate report cards for term
        var generateResponse = await client.PostAsJsonAsync("/api/exams/report-cards/generate-term", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, generateResponse.StatusCode);
        var reportCards = await generateResponse.Content.ReadFromJsonAsync<object[]>();
        Assert.NotNull(reportCards);
        Assert.True(reportCards.Length > 0);

        // Get report card ID from response
        var reportCardId = GetIdFromResponse(generateResponse);

        // Update report card
        var updateResponse = await client.PutAsJsonAsync($"/api/exams/report-cards/{reportCardId}", new
        {
            tenantId = TestIds.Tenant1,
            totalMarks = 88m,
            averageMark = 88m,
            positionInClass = 1
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Publish report card
        var publishResponse = await client.PostAsJsonAsync($"/api/exams/report-cards/{reportCardId}/publish", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            isPublished = true
        });
        Assert.Equal(HttpStatusCode.OK, publishResponse.StatusCode);

        // Try to delete published report card (should fail)
        var deletePublishedResponse = await client.DeleteAsync($"/api/exams/report-cards/{reportCardId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.BadRequest, deletePublishedResponse.StatusCode);

        // Unpublish and delete
        var unpublishResponse = await client.PostAsJsonAsync($"/api/exams/report-cards/{reportCardId}/publish", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            isPublished = false
        });
        Assert.Equal(HttpStatusCode.OK, unpublishResponse.StatusCode);

        var deleteResponse = await client.DeleteAsync($"/api/exams/report-cards/{reportCardId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    private static async Task<Guid> GetIdAsync(HttpResponseMessage response)
    {
        var text = await response.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(text);
        return doc.RootElement.GetProperty("id").GetGuid();
    }

    private static Guid GetIdFromResponse(HttpResponseMessage response)
    {
        var text = response.Content.ReadAsStringAsync().Result;
        using var doc = System.Text.Json.JsonDocument.Parse(text);
        // Handle array response - get first item's ID
        if (doc.RootElement.ValueKind == System.Text.Json.JsonValueKind.Array)
        {
            var firstItem = doc.RootElement.EnumerateArray().First();
            return firstItem.GetProperty("id").GetGuid();
        }
        return doc.RootElement.GetProperty("id").GetGuid();
    }
}
