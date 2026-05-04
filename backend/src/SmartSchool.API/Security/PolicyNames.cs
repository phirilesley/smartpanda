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

public static class PolicyNames
{
    public const string PlatformManage = "platform.manage.policy";
    public const string SchoolsManage = "schools.manage.policy";
    public const string AcademicsManage = "academics.manage.policy";
    public const string StudentsManage = "students.manage.policy";
    public const string FinanceManage = "finance.manage.policy";
    public const string ExamsManage = "exams.manage.policy";
    public const string OperationsManage = "operations.manage.policy";
    public const string SecurityManage = "security.manage.policy";
    public const string FeatureFlagsManage = "featureflags.manage.policy";
    public const string PortalParentAccess = "portal.parent.access.policy";
    public const string PortalStudentAccess = "portal.student.access.policy";
    public const string PortalStaffAccess = "portal.staff.access.policy";
    public const string SchoolAccess = "school.access.policy";

    // Phase 6 Module-specific Policies
    public const string EventsManage = "events.manage.policy";
    public const string EventsView = "events.view.policy";
    public const string EventsCoordinate = "events.coordinate.policy";
    
    public const string TransportManage = "transport.manage.policy";
    public const string TransportView = "transport.view.policy";
    public const string TransportDrive = "transport.drive.policy";
    public const string TransportAssign = "transport.assign.policy";
    
    public const string HostelsManage = "hostels.manage.policy";
    public const string HostelsView = "hostels.view.policy";
    public const string HostelsMatron = "hostels.matron.policy";
    public const string HostelsStudent = "hostels.student.policy";
    
    public const string HealthManage = "health.manage.policy";
    public const string HealthView = "health.view.policy";
    public const string HealthNurse = "health.nurse.policy";
    public const string HealthStudent = "health.student.policy";
    
    public const string ClinicManage = "clinic.manage.policy";
    public const string ClinicView = "clinic.view.policy";
    public const string ClinicDoctor = "clinic.doctor.policy";
    public const string ClinicPatient = "clinic.patient.policy";
    public const string SportsManage = "sports.manage.policy";
    public const string AwardsManage = "awards.manage.policy";
    public const string ClubsManage = "clubs.manage.policy";
    public const string LeadershipManage = "leadership.manage.policy";
    
    // System Roles
    public const string Developer = "system.developer.policy";
    public const string CEO = "system.ceo.policy";
    public const string Admin = "system.admin.policy";
    public const string SystemAdmin = "system.admin.policy";
    public const string SuperAdmin = "system.superadmin.policy";
}
