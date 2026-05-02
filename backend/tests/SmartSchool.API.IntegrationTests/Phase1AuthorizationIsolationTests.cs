using System.Net;

namespace SmartSchool.API.IntegrationTests;

public class Phase1AuthorizationIsolationTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase1AuthorizationIsolationTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/tenants?tenantId=11111111-1111-1111-1111-111111111111")]
    [InlineData("/api/tenants/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/subscription-plans")]
    [InlineData("/api/schools?tenantId=11111111-1111-1111-1111-111111111111")]
    [InlineData("/api/schools/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/academic-years?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/terms?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/grades?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/streams?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/subjects?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/security/permissions?tenantId=11111111-1111-1111-1111-111111111111")]
    [InlineData("/api/security/roles?tenantId=11111111-1111-1111-1111-111111111111")]
    [InlineData("/api/security/user-school-access?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/security/user-permissions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&userId=10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/tenant-subscriptions?tenantId=11111111-1111-1111-1111-111111111111")]
    [InlineData("/api/tenant-subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/audit-logs?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/system/settings?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/system/master-data?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&dataType=Nationality")]
    public async Task Endpoints_RequireAuthentication(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/schools?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/academic-years?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/terms?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/grades?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/streams?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/subjects?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/security/user-school-access?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/security/user-permissions?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&userId=10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/tenant-subscriptions/22222222-2222-2222-2222-222222222222")]
    [InlineData("/api/audit-logs?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/system/settings?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/system/master-data?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&dataType=Nationality")]
    public async Task Endpoints_EnforceTenantIsolation(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/schools?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/academic-years?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/terms?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/grades?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/streams?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/subjects?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/security/user-school-access?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/security/user-permissions?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb&userId=10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/audit-logs?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/system/settings?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/system/master-data?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb&dataType=Nationality")]
    public async Task Endpoints_EnforceSchoolAccess(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Tenant_Creation_EnforcesUniqueness()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UsePlatformAdminAuth();

        // Create first tenant
        var tenant1Response = await client.PostAsJsonAsync("/api/tenants", new
        {
            code = "UNIQUE-TENANT",
            name = "Test Tenant 1",
            contactEmail = "test1@example.com",
            phone = "1234567890"
        });
        Assert.Equal(HttpStatusCode.OK, tenant1Response.StatusCode);

        // Try to create tenant with same code
        var tenant2Response = await client.PostAsJsonAsync("/api/tenants", new
        {
            code = "UNIQUE-TENANT",
            name = "Test Tenant 2",
            contactEmail = "test2@example.com",
            phone = "0987654321"
        });
        Assert.Equal(HttpStatusCode.Conflict, tenant2Response.StatusCode);
    }

    [Fact]
    public async Task School_Creation_EnforcesUniquenessWithinTenant()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create first school
        var school1Response = await client.PostAsJsonAsync("/api/schools", new
        {
            tenantId = TestIds.Tenant1,
            code = "UNIQUE-SCHOOL",
            name = "Test School 1",
            address = "Address 1",
            contactEmail = "school1@example.com",
            phone = "1234567890"
        });
        Assert.Equal(HttpStatusCode.OK, school1Response.StatusCode);

        // Try to create school with same code in same tenant
        var school2Response = await client.PostAsJsonAsync("/api/schools", new
        {
            tenantId = TestIds.Tenant1,
            code = "UNIQUE-SCHOOL",
            name = "Test School 2",
            address = "Address 2",
            contactEmail = "school2@example.com",
            phone = "0987654321"
        });
        Assert.Equal(HttpStatusCode.Conflict, school2Response.StatusCode);
    }

    [Fact]
    public async Task Grade_Creation_EnforcesUniquenessWithinSchool()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create first grade
        var grade1Response = await client.PostAsJsonAsync("/api/grades", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Grade 5",
            level = 5
        });
        Assert.Equal(HttpStatusCode.OK, grade1Response.StatusCode);

        // Try to create grade with same name in same school
        var grade2Response = await client.PostAsJsonAsync("/api/grades", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Grade 5",
            level = 6
        });
        Assert.Equal(HttpStatusCode.Conflict, grade2Response.StatusCode);
    }

    [Fact]
    public async Task SystemSettings_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create setting
        var createResponse = await client.PostAsJsonAsync("/api/system/settings", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            category = "Academic",
            settingKey = "MaxStudentsPerClass",
            settingValue = "40",
            isSensitive = false
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        // Update setting
        var updateResponse = await client.PostAsJsonAsync("/api/system/settings", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            category = "Academic",
            settingKey = "MaxStudentsPerClass",
            settingValue = "45",
            isSensitive = false
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Get setting
        var getResponse = await client.GetAsync($"/api/system/settings?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&category=Academic");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
    }

    [Fact]
    public async Task AuditLogs_CanBeExportedAndPurged()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create some audit logs by performing actions
        await client.PostAsJsonAsync("/api/grades", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Grade 6",
            level = 6
        });

        // Export audit logs
        var exportResponse = await client.PostAsJsonAsync("/api/audit-logs/export", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            startDateUtc = DateTime.UtcNow.AddDays(-7),
            endDateUtc = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, exportResponse.StatusCode);

        // Purge old audit logs
        var purgeResponse = await client.PostAsJsonAsync("/api/audit-logs/purge", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            retentionDays = 30
        });
        Assert.Equal(HttpStatusCode.OK, purgeResponse.StatusCode);
    }
}
