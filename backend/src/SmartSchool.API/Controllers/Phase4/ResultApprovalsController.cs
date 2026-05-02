using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase4;

[ApiController]
[Route("api/exams/result-approvals")]
[Authorize(Policy = PolicyNames.ExamsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ResultApprovalsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ResultApproval>> Approve([FromBody] ApproveExamResultsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var session = await dbContext.ExamSessions.FirstOrDefaultAsync(x =>
            x.Id == request.ExamSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (session is null) return BadRequest("Exam session not found.");

        var approval = new ResultApproval
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExamSessionId = request.ExamSessionId,
            ApprovedByUserId = request.ApprovedByUserId,
            ApprovedAtUtc = request.ApprovedAtUtc == default ? DateTime.UtcNow : request.ApprovedAtUtc,
            Comments = request.Comments?.Trim() ?? string.Empty
        };

        dbContext.ResultApprovals.Add(approval);

        var marks = await dbContext.StudentMarks
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.ExamSessionId == request.ExamSessionId)
            .ToListAsync(cancellationToken);

        foreach (var mark in marks)
        {
            mark.ApprovedAtUtc = approval.ApprovedAtUtc;
            mark.UpdatedAtUtc = DateTime.UtcNow;
        }

        session.Status = "Approved";
        session.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(approval);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ResultApproval>>> GetBySession([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid examSessionId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || examSessionId == Guid.Empty)
        {
            return BadRequest("tenantId, schoolId, and examSessionId are required.");
        }

        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.ResultApprovals.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.ExamSessionId == examSessionId)
            .OrderByDescending(x => x.ApprovedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var approval = await dbContext.ResultApprovals.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (approval is null) return NotFound();

        if (!User.CanAccessTenant(approval.TenantId)) return Forbid();

        // Remove approval from marks
        var marks = await dbContext.StudentMarks
            .Where(x => x.TenantId == approval.TenantId && x.SchoolId == approval.SchoolId && x.ExamSessionId == approval.ExamSessionId)
            .ToListAsync(cancellationToken);

        foreach (var mark in marks)
        {
            mark.ApprovedAtUtc = null;
            mark.UpdatedAtUtc = DateTime.UtcNow;
        }

        // Update session status
        var session = await dbContext.ExamSessions.FirstOrDefaultAsync(x => x.Id == approval.ExamSessionId, cancellationToken);
        if (session is not null)
        {
            session.Status = "Draft";
            session.UpdatedAtUtc = DateTime.UtcNow;
        }

        dbContext.ResultApprovals.Remove(approval);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record ApproveExamResultsRequest(Guid TenantId, Guid SchoolId, Guid ExamSessionId, Guid ApprovedByUserId, DateTime ApprovedAtUtc, string? Comments);
