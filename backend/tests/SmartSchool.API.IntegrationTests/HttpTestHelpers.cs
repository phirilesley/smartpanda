namespace SmartSchool.API.IntegrationTests;

internal static class HttpTestHelpers
{
    public static void UsePlatformAdminAuth(this HttpClient client)
    {
        client.DefaultRequestHeaders.Remove("X-Test-Auth");
        client.DefaultRequestHeaders.Remove("X-Test-TenantId");
        client.DefaultRequestHeaders.Remove("X-Test-Roles");
        client.DefaultRequestHeaders.Remove("X-Test-Permissions");
        client.DefaultRequestHeaders.Remove("X-Test-UserId");
        client.DefaultRequestHeaders.Remove("X-School-Id");

        client.DefaultRequestHeaders.Add("X-Test-Auth", "1");
        client.DefaultRequestHeaders.Add("X-Test-TenantId", TestIds.Tenant1.ToString());
        client.DefaultRequestHeaders.Add("X-Test-Roles", "PlatformAdmin");
        client.DefaultRequestHeaders.Add("X-Test-UserId", TestIds.User1.ToString());
        client.DefaultRequestHeaders.Add("X-Test-Permissions", string.Join(',',
            "platform.manage",
            "schools.manage",
            "academics.manage",
            "students.manage",
            "finance.manage",
            "exams.manage",
            "operations.manage",
            "security.manage",
            "featureflags.manage",
            "portal.parent.access",
            "portal.student.access",
            "portal.staff.access",
            "events.manage",
            "events.view",
            "events.coordinate",
            "transport.manage",
            "transport.view",
            "transport.drive",
            "transport.assign",
            "hostels.manage",
            "hostels.view",
            "hostels.matron",
            "hostels.student",
            "health.manage",
            "health.view",
            "health.nurse",
            "health.student",
            "clinic.manage",
            "clinic.view",
            "clinic.doctor",
            "clinic.patient"));
        client.DefaultRequestHeaders.Add("X-School-Id", TestIds.School1.ToString());
    }

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
            "platform.manage",
            "schools.manage",
            "academics.manage",
            "students.manage",
            "finance.manage",
            "exams.manage",
            "operations.manage",
            "security.manage",
            "featureflags.manage",
            "portal.parent.access",
            "portal.student.access",
            "portal.staff.access",
            "events.manage",
            "events.view",
            "events.coordinate",
            "transport.manage",
            "transport.view",
            "transport.drive",
            "transport.assign",
            "hostels.manage",
            "hostels.view",
            "hostels.matron",
            "hostels.student",
            "health.manage",
            "health.view",
            "health.nurse",
            "health.student",
            "clinic.manage",
            "clinic.view",
            "clinic.doctor",
            "clinic.patient"));
        client.DefaultRequestHeaders.Add("X-School-Id", TestIds.School1.ToString());
    }
}
