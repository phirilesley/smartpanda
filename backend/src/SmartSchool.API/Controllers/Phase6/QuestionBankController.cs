using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.QuestionBank;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/question-bank")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class QuestionBankController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<QuestionPaperCategory>>> GetCategories([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.QuestionPaperCategories.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("categories")]
    public async Task<ActionResult<QuestionPaperCategory>> CreateCategory([FromBody] CreateQuestionPaperCategoryRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var subjectExists = await dbContext.Subjects.AsNoTracking().AnyAsync(x =>
            x.Id == request.SubjectId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var gradeExists = await dbContext.Grades.AsNoTracking().AnyAsync(x =>
            x.Id == request.GradeId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!subjectExists || !gradeExists) return BadRequest("Invalid subject or grade.");

        var entity = new QuestionPaperCategory
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim(),
            SubjectId = request.SubjectId,
            GradeId = request.GradeId
        };

        dbContext.QuestionPaperCategories.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpGet("papers")]
    public async Task<ActionResult<IReadOnlyList<QuestionPaper>>> GetPapers([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.QuestionPapers.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.ExamYear)
            .ThenByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("papers")]
    public async Task<ActionResult<QuestionPaper>> CreatePaper([FromBody] CreateQuestionPaperRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var categoryExists = await dbContext.QuestionPaperCategories.AsNoTracking().AnyAsync(x =>
            x.Id == request.QuestionPaperCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!categoryExists) return BadRequest("Question paper category not found.");

        var fileExists = await dbContext.UploadedFiles.AsNoTracking().AnyAsync(x =>
            x.Id == request.UploadedFileId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!fileExists) return BadRequest("Uploaded file not found.");

        var entity = new QuestionPaper
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            QuestionPaperCategoryId = request.QuestionPaperCategoryId,
            UploadedFileId = request.UploadedFileId,
            ExamYear = request.ExamYear,
            ExamType = request.ExamType.Trim()
        };

        dbContext.QuestionPapers.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("papers/{paperId:guid}/downloads")]
    public async Task<ActionResult<QuestionPaperDownload>> RegisterDownload(Guid paperId, [FromBody] RegisterQuestionPaperDownloadRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var paperExists = await dbContext.QuestionPapers.AsNoTracking().AnyAsync(x =>
            x.Id == paperId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!paperExists) return NotFound();

        var entity = new QuestionPaperDownload
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            QuestionPaperId = paperId,
            DownloadedByUserId = request.DownloadedByUserId,
            DownloadedAtUtc = DateTime.UtcNow
        };

        dbContext.QuestionPaperDownloads.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }
}

public sealed record CreateQuestionPaperCategoryRequest(Guid TenantId, Guid SchoolId, string Name, Guid SubjectId, Guid GradeId);
public sealed record CreateQuestionPaperRequest(Guid TenantId, Guid SchoolId, Guid QuestionPaperCategoryId, Guid UploadedFileId, int ExamYear, string ExamType);
public sealed record RegisterQuestionPaperDownloadRequest(Guid TenantId, Guid SchoolId, Guid DownloadedByUserId);
