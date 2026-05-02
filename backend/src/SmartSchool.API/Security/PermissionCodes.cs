namespace SmartSchool.API.Security;

public static class PermissionCodes
{
    public const string PlatformManage = "platform.manage";
    public const string SchoolsManage = "schools.manage";
    public const string AcademicsManage = "academics.manage";
    public const string StudentsManage = "students.manage";
    public const string FinanceManage = "finance.manage";
    public const string ExamsManage = "exams.manage";
    public const string OperationsManage = "operations.manage";
    public const string SecurityManage = "security.manage";
    public const string FeatureFlagsManage = "featureflags.manage";
    public const string PortalParentAccess = "portal.parent.access";
    public const string PortalStudentAccess = "portal.student.access";
    public const string PortalStaffAccess = "portal.staff.access";
}

public static class RoleCodes
{
    public const string PlatformOwner = "PlatformOwner";
    public const string TenantOwner = "TenantOwner";
    public const string SchoolAdmin = "SchoolAdmin";
}
