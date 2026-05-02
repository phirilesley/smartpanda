namespace SmartSchool.API.IntegrationTests;

internal static class HttpTestHelpers
{
    public static void UseTenantOwnerAuth(this HttpClient client, Guid? tenantId = null, string? permissionsCsv = null)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Auth");
        client.DefaultRequestHeaders.Remove("X-Test-TenantId");
        client.DefaultRequestHeaders.Remove("X-Test-Roles");
        client.DefaultRequestHeaders.Remove("X-Test-Permissions");
        client.DefaultRequestHeaders.Remove("X-Test-UserId");

        client.DefaultRequestHeaders.Add("X-Test-Auth", "1");
        client.DefaultRequestHeaders.Add("X-Test-TenantId", (tenantId ?? TestIds.Tenant1).ToString());
        client.DefaultRequestHeaders.Add("X-Test-Roles", "TenantOwner");
        client.DefaultRequestHeaders.Add("X-Test-UserId", TestIds.User1.ToString());
        client.DefaultRequestHeaders.Add("X-Test-Permissions", permissionsCsv ?? string.Join(',',
            "operations.manage",
            "featureflags.manage",
            "portal.parent.access",
            "portal.student.access",
            "portal.staff.access"));
        client.DefaultRequestHeaders.Add("X-School-Id", TestIds.School1.ToString());
    }
}
