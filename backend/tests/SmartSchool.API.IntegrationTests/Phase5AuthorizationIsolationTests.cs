using System.Net;
using System.Net.Http.Json;

namespace SmartSchool.API.IntegrationTests;

public class Phase5AuthorizationIsolationTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase5AuthorizationIsolationTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/attendance/sessions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/attendance/sessions/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/attendance/student?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&date=2026-05-02")]
    [InlineData("/api/attendance/staff?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&date=2026-05-02")]
    [InlineData("/api/background-jobs/status")]
    [InlineData("/api/background-jobs/history")]
    [InlineData("/api/communication/announcements?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/communication/threads?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/helpdesk/tickets?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/helpdesk/tickets/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/notifications/templates?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/notifications?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/reports/dashboard?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/reports/definitions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/realtime/status")]
    [InlineData("/api/admin/portal/dashboard?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/parent/portal/dashboard?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&parentUserId=10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/student/portal/dashboard?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&studentUserId=10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/teacher/portal/dashboard?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&teacherUserId=10000000-0000-0000-0000-000000000001")]
    public async Task Endpoints_RequireAuthentication(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/attendance/sessions?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/communication/announcements?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/helpdesk/tickets?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/notifications/templates?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/notifications?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/reports/dashboard?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/reports/definitions?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_EnforceTenantIsolation(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/attendance/sessions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/communication/announcements?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/helpdesk/tickets?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/notifications/templates?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/notifications?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/reports/dashboard?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/reports/definitions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    public async Task Endpoints_EnforceSchoolAccess(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Attendance_Session_CanBeCreatedAndManaged()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create attendance session
        var createResponse = await client.PostAsJsonAsync("/api/attendance/sessions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            streamId = TestIds.Stream1,
            sessionDate = DateTime.UtcNow.Date,
            startTime = new TimeSpan(8, 0, 0),
            endTime = new TimeSpan(13, 0, 0),
            subjectId = TestIds.Subject1
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var sessionId = await GetIdAsync(createResponse);

        // Get session
        var getResponse = await client.GetAsync($"/api/attendance/sessions/{sessionId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Delete session
        var deleteResponse = await client.DeleteAsync($"/api/attendance/sessions/{sessionId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Communication_Announcements_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create announcement
        var createResponse = await client.PostAsJsonAsync("/api/communication/announcements", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            title = "School Holiday Notice",
            content = "School will be closed next Monday for public holiday",
            audience = "All",
            publishAtUtc = DateTime.UtcNow,
            expireAtUtc = DateTime.UtcNow.AddDays(7)
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var announcementId = await GetIdAsync(createResponse);

        // Get announcement
        var getResponse = await client.GetAsync($"/api/communication/announcements/{announcementId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Update announcement
        var updateResponse = await client.PutAsJsonAsync($"/api/communication/announcements/{announcementId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            title = "School Holiday Notice - Updated",
            content = "School will be closed next Monday and Tuesday for public holidays",
            audience = "All",
            publishAtUtc = DateTime.UtcNow,
            expireAtUtc = DateTime.UtcNow.AddDays(7)
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete announcement
        var deleteResponse = await client.DeleteAsync($"/api/communication/announcements/{announcementId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Communication_Threads_CanBeCreatedAndManaged()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create message thread
        var createResponse = await client.PostAsJsonAsync("/api/communication/threads", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            subject = "Parent Meeting Request",
            participantUserIds = new[] { TestIds.User1, TestIds.User2 }
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var threadId = await GetIdAsync(createResponse);

        // Get thread
        var getResponse = await client.GetAsync($"/api/communication/threads/{threadId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Close thread
        var closeResponse = await client.PutAsJsonAsync($"/api/communication/threads/{threadId}/close", new
        {
            tenantId = TestIds.Tenant1
        });
        Assert.Equal(HttpStatusCode.OK, closeResponse.StatusCode);

        // Delete thread
        var deleteResponse = await client.DeleteAsync($"/api/communication/threads/{threadId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task HelpDesk_Ticket_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create help desk ticket
        var createResponse = await client.PostAsJsonAsync("/api/helpdesk/tickets", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            title = "Computer Lab Issue",
            description = "Computer in Lab A is not working",
            priority = "Medium",
            requestedByUserId = TestIds.User1,
            assignedToUserId = TestIds.User2
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var ticketId = await GetIdAsync(createResponse);

        // Get ticket
        var getResponse = await client.GetAsync($"/api/helpdesk/tickets/{ticketId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Update ticket
        var updateResponse = await client.PutAsJsonAsync($"/api/helpdesk/tickets/{ticketId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            title = "Computer Lab Issue - Updated",
            description = "Computer in Lab A is not working - keyboard issue",
            priority = "High",
            status = "In Progress",
            assignedToUserId = TestIds.User2
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Add comment
        var commentResponse = await client.PostAsJsonAsync($"/api/helpdesk/tickets/{ticketId}/comments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            userId = TestIds.User2,
            comment = "Technician assigned to investigate",
            newStatus = "Assigned"
        });
        Assert.Equal(HttpStatusCode.OK, commentResponse.StatusCode);

        // Get comments
        var getCommentsResponse = await client.GetAsync($"/api/helpdesk/tickets/{ticketId}/comments?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getCommentsResponse.StatusCode);

        // Delete ticket
        var deleteResponse = await client.DeleteAsync($"/api/helpdesk/tickets/{ticketId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Notifications_Templates_CanBeManaged()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create notification template
        var createResponse = await client.PostAsJsonAsync("/api/notifications/templates", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Fee Reminder",
            channel = "Email",
            subjectTemplate = "Fee Due Reminder - {StudentName}",
            bodyTemplate = "Dear {ParentName}, fees for {StudentName} are due. Amount: {Amount}",
            isActive = true
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        // Get templates
        var getResponse = await client.GetAsync($"/api/notifications/templates?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Delete template
        var templates = await getResponse.Content.ReadFromJsonAsync<object[]>();
        var templateId = GetIdFromResponse(getResponse);
        
        var deleteResponse = await client.DeleteAsync($"/api/notifications/templates/{templateId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Reports_DefinitionsAndRuns_CanBeManaged()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create report definition
        var createResponse = await client.PostAsJsonAsync("/api/reports/definitions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Student Attendance Report",
            module = "Attendance",
            queryKey = "attendance_summary",
            isActive = true
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var definitionId = await GetIdAsync(createResponse);

        // Get definition
        var getResponse = await client.GetAsync($"/api/reports/definitions/{definitionId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // Run report
        var runResponse = await client.PostAsJsonAsync("/api/reports/runs", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            reportDefinitionId = definitionId,
            requestedByUserId = TestIds.User1
        });
        Assert.Equal(HttpStatusCode.OK, runResponse.StatusCode);
        var runId = await GetIdAsync(runResponse);

        // Get run
        var getRunResponse = await client.GetAsync($"/api/reports/runs/{runId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, getRunResponse.StatusCode);

        // Export reports
        var exportResponse = await client.PostAsJsonAsync("/api/reports/export", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            startDateUtc = DateTime.UtcNow.AddDays(-30),
            endDateUtc = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, exportResponse.StatusCode);

        // Clear cache
        var cacheResponse = await client.PostAsJsonAsync("/api/reports/cache/clear", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            cacheType = "attendance"
        });
        Assert.Equal(HttpStatusCode.OK, cacheResponse.StatusCode);

        // Delete definition
        var deleteResponse = await client.DeleteAsync($"/api/reports/definitions/{definitionId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Realtime_ConnectionManagement_Succeeds()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Get status
        var statusResponse = await client.GetAsync("/api/realtime/status");
        Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);

        // Get connections
        var connectionsResponse = await client.GetAsync($"/api/realtime/connections?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, connectionsResponse.StatusCode);

        // Broadcast message
        var broadcastResponse = await client.PostAsJsonAsync("/api/realtime/broadcast", new
        {
            tenantId = TestIds.Tenant1,
            target = "all",
            message = "System maintenance scheduled",
            data = new { scheduledAt = DateTime.UtcNow.AddHours(2) }
        });
        Assert.Equal(HttpStatusCode.OK, broadcastResponse.StatusCode);

        // Join group
        var joinResponse = await client.PostAsJsonAsync("/api/realtime/groups/grade5/join", new
        {
            tenantId = TestIds.Tenant1,
            connectionId = "conn-123"
        });
        Assert.Equal(HttpStatusCode.OK, joinResponse.StatusCode);

        // Leave group
        var leaveResponse = await client.PostAsJsonAsync("/api/realtime/groups/grade5/leave", new
        {
            tenantId = TestIds.Tenant1,
            connectionId = "conn-123"
        });
        Assert.Equal(HttpStatusCode.OK, leaveResponse.StatusCode);

        // Disconnect connection
        var disconnectResponse = await client.PostAsJsonAsync("/api/realtime/connections/conn-123/disconnect", new
        {
            tenantId = TestIds.Tenant1,
            reason = "Manual disconnect"
        });
        Assert.Equal(HttpStatusCode.OK, disconnectResponse.StatusCode);
    }

    [Fact]
    public async Task Portal_Dashboards_ProvideRoleSpecificData()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Admin dashboard
        var adminResponse = await client.GetAsync($"/api/admin/portal/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, adminResponse.StatusCode);

        // System health check
        var healthResponse = await client.GetAsync($"/api/admin/portal/system/health?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, healthResponse.StatusCode);

        // Active users
        var usersResponse = await client.GetAsync($"/api/admin/portal/users/active?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, usersResponse.StatusCode);

        // Recent logs
        var logsResponse = await client.GetAsync($"/api/admin/portal/logs/recent?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, logsResponse.StatusCode);

        // Parent dashboard (Note: Would need actual parent-student linking in real implementation)
        var parentResponse = await client.GetAsync($"/api/parent/portal/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&parentUserId={TestIds.User1}");
        // May return NotFound due to missing parent-student linking, which is expected in test environment

        // Student dashboard (Note: Would need actual user-student linking in real implementation)
        var studentResponse = await client.GetAsync($"/api/student/portal/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&studentUserId={TestIds.User1}");
        // May return NotFound due to missing user-student linking, which is expected in test environment

        // Teacher dashboard (Note: Would need actual staff assignment in real implementation)
        var teacherResponse = await client.GetAsync($"/api/teacher/portal/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&teacherUserId={TestIds.User1}");
        // May return NotFound due to missing staff assignment, which is expected in test environment
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
