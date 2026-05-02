using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/hr")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class HrController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("staff")]
    public async Task<ActionResult<IReadOnlyList<StaffMember>>> GetStaff([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.StaffMembers.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.LastName).ThenBy(x => x.FirstName)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("staff")]
    public async Task<ActionResult<StaffMember>> CreateStaff([FromBody] CreateStaffMemberRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.EmployeeNumber == request.EmployeeNumber.Trim().ToUpperInvariant(),
            cancellationToken);
        if (exists) return Conflict("Employee number already exists.");

        var entity = new StaffMember
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            EmployeeNumber = request.EmployeeNumber.Trim().ToUpperInvariant(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            DepartmentId = request.DepartmentId,
            HireDate = request.HireDate,
            IsActive = true
        };

        dbContext.StaffMembers.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("contracts")]
    public async Task<ActionResult<StaffContract>> CreateContract([FromBody] CreateStaffContractRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.StaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!staffExists) return BadRequest("Staff member not found.");

        var entity = new StaffContract
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StaffId = request.StaffId,
            ContractType = request.ContractType.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            BasicSalary = request.BasicSalary
        };

        dbContext.StaffContracts.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("leave-types")]
    public async Task<ActionResult<IReadOnlyList<LeaveType>>> GetLeaveTypes([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.LeaveTypes.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("leave-types")]
    public async Task<ActionResult<LeaveType>> CreateLeaveType([FromBody] CreateLeaveTypeRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.LeaveTypes.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("Leave type already exists.");

        var entity = new LeaveType
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            AnnualDays = request.AnnualDays
        };

        dbContext.LeaveTypes.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("leave-applications")]
    public async Task<ActionResult<LeaveApplication>> CreateLeaveApplication([FromBody] CreateLeaveApplicationRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.StaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var leaveTypeExists = await dbContext.LeaveTypes.AsNoTracking().AnyAsync(x =>
            x.Id == request.LeaveTypeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!staffExists || !leaveTypeExists) return BadRequest("Invalid staff or leave type.");

        var entity = new LeaveApplication
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StaffId = request.StaffId,
            LeaveTypeId = request.LeaveTypeId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = "Pending",
            Reason = request.Reason.Trim()
        };

        dbContext.LeaveApplications.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("payroll-periods")]
    public async Task<ActionResult<IReadOnlyList<PayrollPeriod>>> GetPayrollPeriods([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.PayrollPeriods.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.StartDate)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("payroll-periods")]
    public async Task<ActionResult<PayrollPeriod>> CreatePayrollPeriod([FromBody] CreatePayrollPeriodRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.PayrollPeriods.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("Payroll period name already exists.");

        var entity = new PayrollPeriod
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsClosed = false
        };

        dbContext.PayrollPeriods.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("payroll-items")]
    public async Task<ActionResult<PayrollItem>> CreatePayrollItem([FromBody] CreatePayrollItemRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var period = await dbContext.PayrollPeriods.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == request.PayrollPeriodId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (period is null) return BadRequest("Payroll period not found.");
        if (period.IsClosed) return BadRequest("Payroll period is already closed.");

        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.StaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!staffExists) return BadRequest("Staff member not found.");

        var entity = new PayrollItem
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            PayrollPeriodId = request.PayrollPeriodId,
            StaffId = request.StaffId,
            ItemType = request.ItemType.Trim(),
            Amount = request.Amount
        };

        dbContext.PayrollItems.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("payroll-summary")]
    public async Task<ActionResult<IReadOnlyList<PayrollSummaryItem>>> GetPayrollSummary([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid payrollPeriodId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || payrollPeriodId == Guid.Empty)
        {
            return BadRequest("tenantId, schoolId, and payrollPeriodId are required.");
        }

        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var rawItems = await dbContext.PayrollItems.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.PayrollPeriodId == payrollPeriodId)
            .ToListAsync(cancellationToken);

        var items = rawItems
            .GroupBy(x => x.StaffId)
            .Select(g => new PayrollSummaryItem(g.Key, g.Sum(x => x.Amount), g.Count()))
            .OrderByDescending(x => x.TotalAmount)
            .ToList();

        return Ok(items);
    }
}

public sealed record CreateStaffMemberRequest(Guid TenantId, Guid SchoolId, string EmployeeNumber, string FirstName, string LastName, Guid DepartmentId, DateTime HireDate);
public sealed record CreateStaffContractRequest(Guid TenantId, Guid SchoolId, Guid StaffId, string ContractType, DateTime StartDate, DateTime EndDate, decimal BasicSalary);
public sealed record CreateLeaveTypeRequest(Guid TenantId, Guid SchoolId, string Name, int AnnualDays);
public sealed record CreateLeaveApplicationRequest(Guid TenantId, Guid SchoolId, Guid StaffId, Guid LeaveTypeId, DateTime StartDate, DateTime EndDate, string Reason);
public sealed record CreatePayrollPeriodRequest(Guid TenantId, Guid SchoolId, string Name, DateTime StartDate, DateTime EndDate);
public sealed record CreatePayrollItemRequest(Guid TenantId, Guid SchoolId, Guid PayrollPeriodId, Guid StaffId, string ItemType, decimal Amount);
public sealed record PayrollSummaryItem(Guid StaffId, decimal TotalAmount, int ItemCount);
