using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Timetable;

public class Room : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
}

public class TimetablePeriod : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int DayOfWeek { get; set; }
}

public class TimetableEntry : TenantSchoolEntityBase
{
    public Guid AcademicYearId { get; set; }
    public Guid TermId { get; set; }
    public Guid GradeId { get; set; }
    public Guid StreamId { get; set; }
    public Guid SubjectId { get; set; }
    public Guid StaffId { get; set; }
    public Guid RoomId { get; set; }
    public Guid TimetablePeriodId { get; set; }
}
