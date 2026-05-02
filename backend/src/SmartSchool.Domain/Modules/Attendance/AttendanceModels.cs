using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Attendance;

public class AttendanceSession : TenantSchoolEntityBase
{
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public DateTime AttendanceDate { get; set; }
    public string SessionType { get; set; } = string.Empty;
}

public class StudentAttendance : TenantSchoolEntityBase
{
    public Guid AttendanceSessionId { get; set; }
    public Guid StudentId { get; set; }
    public Guid EnrollmentId { get; set; }
    public bool IsPresent { get; set; }
    public string Remarks { get; set; } = string.Empty;
}

public class StaffAttendance : TenantSchoolEntityBase
{
    public Guid AttendanceSessionId { get; set; }
    public Guid StaffId { get; set; }
    public bool IsPresent { get; set; }
    public string Remarks { get; set; } = string.Empty;
}
