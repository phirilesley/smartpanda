using System.Net;

namespace SmartSchool.API.IntegrationTests;

public class Phase6AuthorizationIsolationTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase6AuthorizationIsolationTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/hr/staff?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/library/books?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/assets?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/visitors?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/labs?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/question-bank/categories?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/memos/requests?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/pos/products?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/sports?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/timetable/entries?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&academicYearId=10000000-0000-0000-0000-000000000001&termId=10000000-0000-0000-0000-000000000002")]
    [InlineData("/api/integrations/settings?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/events?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/transport/vehicles?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/hostels?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/health/profiles?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/clinic/visits?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_RequireAuthentication(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/hr/staff?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/library/books?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/assets?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/visitors?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/labs?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/question-bank/categories?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/memos/requests?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/pos/products?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/sports?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/timetable/entries?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa&academicYearId=10000000-0000-0000-0000-000000000001&termId=10000000-0000-0000-0000-000000000002")]
    [InlineData("/api/integrations/settings?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/events?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/transport/vehicles?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/hostels?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/health/profiles?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/clinic/visits?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_EnforceTenantIsolation(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
