namespace SmartSchool.Application.Portals;

public interface IPortalDashboardService
{
    Task<ParentPortalDashboard?> GetParentDashboardAsync(Guid tenantId, Guid schoolId, Guid parentUserId, Guid studentId, CancellationToken cancellationToken);
    Task<StudentPortalDashboard?> GetStudentDashboardAsync(Guid tenantId, Guid schoolId, Guid studentUserId, Guid studentId, CancellationToken cancellationToken);
    Task<StaffPortalDashboard?> GetStaffDashboardAsync(Guid tenantId, Guid schoolId, Guid staffUserId, Guid staffId, CancellationToken cancellationToken);
}
