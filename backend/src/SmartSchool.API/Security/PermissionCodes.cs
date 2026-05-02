namespace SmartSchool.API.Security;

public static class PermissionCodes
{
    public const string PlatformManage = "platform.manage";
    public const string SchoolsManage = "schools.manage";
    public const string AcademicsManage = "academics.manage";
    public const string StudentsManage = "students.manage";
    public const string SecurityManage = "security.manage";
}

public static class RoleCodes
{
    public const string PlatformOwner = "PlatformOwner";
    public const string TenantOwner = "TenantOwner";
    public const string SchoolAdmin = "SchoolAdmin";
}
