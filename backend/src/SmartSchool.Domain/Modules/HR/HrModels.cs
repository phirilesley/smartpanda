using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.HR;

public class StaffMember : TenantSchoolEntityBase
{
    public string EmployeeNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Guid DepartmentId { get; set; }
    public DateTime HireDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public class StaffContract : TenantSchoolEntityBase
{
    public Guid StaffId { get; set; }
    public string ContractType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal BasicSalary { get; set; }
}

public class LeaveType : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public int AnnualDays { get; set; }
}

public class LeaveApplication : TenantSchoolEntityBase
{
    public Guid StaffId { get; set; }
    public Guid LeaveTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

public class PayrollPeriod : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsClosed { get; set; }
}

public class PayrollItem : TenantSchoolEntityBase
{
    public Guid PayrollPeriodId { get; set; }
    public Guid StaffId { get; set; }
    public string ItemType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
