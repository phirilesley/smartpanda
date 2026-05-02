using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Memos;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/memos")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class MemosController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("requests")]
    public async Task<ActionResult<IReadOnlyList<MemoRequest>>> GetRequests([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.MemoRequests.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("requests")]
    public async Task<ActionResult<MemoRequest>> CreateRequest([FromBody] CreateMemoRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var entity = new MemoRequest
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            RequestedByUserId = request.RequestedByUserId,
            Status = "Pending"
        };

        dbContext.MemoRequests.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("requests/{memoRequestId:guid}/approvers")]
    public async Task<ActionResult<MemoApprover>> AddApprover(Guid memoRequestId, [FromBody] AddMemoApproverRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var memo = await dbContext.MemoRequests.FirstOrDefaultAsync(x =>
            x.Id == memoRequestId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (memo is null) return NotFound();

        var exists = await dbContext.MemoApprovers.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.MemoRequestId == memoRequestId &&
            x.ApproverUserId == request.ApproverUserId,
            cancellationToken);
        if (exists) return Conflict("Approver is already assigned.");

        var entity = new MemoApprover
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            MemoRequestId = memoRequestId,
            ApproverUserId = request.ApproverUserId,
            ApprovalOrder = request.ApprovalOrder
        };

        memo.Status = "InReview";
        memo.UpdatedAtUtc = DateTime.UtcNow;

        dbContext.MemoApprovers.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("requests/{memoRequestId:guid}/actions")]
    public async Task<ActionResult<MemoApprovalAction>> AddApprovalAction(Guid memoRequestId, [FromBody] AddMemoApprovalActionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var memo = await dbContext.MemoRequests.FirstOrDefaultAsync(x =>
            x.Id == memoRequestId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (memo is null) return NotFound();

        var approverAssigned = await dbContext.MemoApprovers.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.MemoRequestId == memoRequestId &&
            x.ApproverUserId == request.ApproverUserId,
            cancellationToken);
        if (!approverAssigned) return BadRequest("Approver is not assigned to this memo.");

        var action = request.Action.Trim();
        var entity = new MemoApprovalAction
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            MemoRequestId = memoRequestId,
            ApproverUserId = request.ApproverUserId,
            Action = action,
            Comment = request.Comment.Trim(),
            ActionAtUtc = DateTime.UtcNow
        };

        if (string.Equals(action, "Reject", StringComparison.OrdinalIgnoreCase))
        {
            memo.Status = "Rejected";
        }
        else if (string.Equals(action, "Approve", StringComparison.OrdinalIgnoreCase))
        {
            var totalApprovers = await dbContext.MemoApprovers.AsNoTracking().CountAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.MemoRequestId == memoRequestId,
                cancellationToken);

            var approvedCount = await dbContext.MemoApprovalActions.AsNoTracking().CountAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.MemoRequestId == memoRequestId &&
                x.Action == "Approve",
                cancellationToken);

            memo.Status = approvedCount + 1 >= totalApprovers ? "Approved" : "InReview";
        }
        else
        {
            memo.Status = "InReview";
        }

        memo.UpdatedAtUtc = DateTime.UtcNow;
        dbContext.MemoApprovalActions.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("requests/{memoRequestId:guid}/attachments")]
    public async Task<ActionResult<MemoAttachment>> AddAttachment(Guid memoRequestId, [FromBody] AddMemoAttachmentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var memoExists = await dbContext.MemoRequests.AsNoTracking().AnyAsync(x =>
            x.Id == memoRequestId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!memoExists) return NotFound();

        var fileExists = await dbContext.UploadedFiles.AsNoTracking().AnyAsync(x =>
            x.Id == request.UploadedFileId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!fileExists) return BadRequest("Uploaded file not found.");

        var entity = new MemoAttachment
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            MemoRequestId = memoRequestId,
            UploadedFileId = request.UploadedFileId
        };

        dbContext.MemoAttachments.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }
}

public sealed record CreateMemoRequest(Guid TenantId, Guid SchoolId, string Title, string Content, Guid RequestedByUserId);
public sealed record AddMemoApproverRequest(Guid TenantId, Guid SchoolId, Guid ApproverUserId, int ApprovalOrder);
public sealed record AddMemoApprovalActionRequest(Guid TenantId, Guid SchoolId, Guid ApproverUserId, string Action, string Comment);
public sealed record AddMemoAttachmentRequest(Guid TenantId, Guid SchoolId, Guid UploadedFileId);
