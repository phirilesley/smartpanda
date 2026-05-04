using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
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
    public const string EventsManage = "events.manage";
    public const string EventsView = "events.view";
    public const string EventsCoordinate = "events.coordinate";
    public const string TransportManage = "transport.manage";
    public const string TransportView = "transport.view";
    public const string TransportDrive = "transport.drive";
    public const string TransportAssign = "transport.assign";
    public const string HostelsManage = "hostels.manage";
    public const string HostelsView = "hostels.view";
    public const string HostelsMatron = "hostels.matron";
    public const string HostelsStudent = "hostels.student";
    public const string HealthManage = "health.manage";
    public const string HealthView = "health.view";
    public const string HealthNurse = "health.nurse";
    public const string HealthStudent = "health.student";
    public const string ClinicManage = "clinic.manage";
    public const string ClinicView = "clinic.view";
    public const string ClinicDoctor = "clinic.doctor";
    public const string ClinicPatient = "clinic.patient";
    public const string SportsManage = "sports.manage";
    public const string AwardsManage = "awards.manage";
    public const string ClubsManage = "clubs.manage";
    public const string LeadershipManage = "leadership.manage";
}

public static class RoleCodes
{
    public const string PlatformOwner = "PlatformOwner";
    public const string TenantOwner = "TenantOwner";
    public const string SchoolAdmin = "SchoolAdmin";
}
