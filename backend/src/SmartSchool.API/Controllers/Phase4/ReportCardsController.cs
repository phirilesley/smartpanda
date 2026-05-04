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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase4;

[ApiController]
[Route("api/exams/report-cards")]
[Authorize(Policy = PolicyNames.ExamsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class ReportCardsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ReportCard>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid academicYearId, [FromQuery] Guid termId, [FromQuery] Guid gradeId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.ReportCards.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (academicYearId != Guid.Empty) query = query.Where(x => x.AcademicYearId == academicYearId);
        if (termId != Guid.Empty) query = query.Where(x => x.TermId == termId);
        if (gradeId != Guid.Empty) query = query.Where(x => x.GradeId == gradeId);

        var items = await query.OrderBy(x => x.GradeId).ThenBy(x => x.PositionInClass).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReportCard>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.ReportCards.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (!User.CanAccessTenant(item.TenantId)) return Forbid();
        return Ok(item);
    }

    [HttpPost("generate-term")]
    public async Task<ActionResult<IReadOnlyList<ReportCard>>> GenerateForTerm([FromBody] GenerateReportCardsForTermRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var sessions = await dbContext.ExamSessions.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
                        x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId && x.GradeId == request.GradeId)
            .ToListAsync(cancellationToken);

        if (sessions.Count == 0) return BadRequest("No exam sessions found for scope.");

        var sessionIds = sessions.Select(x => x.Id).ToList();

        var enrollments = await dbContext.StudentEnrollments.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId &&
                        x.AcademicYearId == request.AcademicYearId && x.TermId == request.TermId && x.GradeId == request.GradeId)
            .ToListAsync(cancellationToken);

        if (enrollments.Count == 0) return BadRequest("No student enrollments found for scope.");

        var enrollmentMap = enrollments.ToDictionary(x => x.StudentId, x => x);

        var marks = await dbContext.StudentMarks.AsNoTracking()
            .Where(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && sessionIds.Contains(x.ExamSessionId))
            .ToListAsync(cancellationToken);

        var grouped = marks
            .GroupBy(x => x.StudentId)
            .Where(g => enrollmentMap.ContainsKey(g.Key))
            .Select(g => new
            {
                StudentId = g.Key,
                Total = g.Sum(m => m.Mark),
                Average = g.Average(m => m.Mark)
            })
            .OrderByDescending(x => x.Average)
            .ThenByDescending(x => x.Total)
            .ThenBy(x => x.StudentId)
            .ToList();

        var now = DateTime.UtcNow;
        var resultCards = new List<ReportCard>();

        for (var i = 0; i < grouped.Count; i++)
        {
            var item = grouped[i];
            var position = i + 1;

            var existing = await dbContext.ReportCards.FirstOrDefaultAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.StudentId == item.StudentId &&
                x.AcademicYearId == request.AcademicYearId &&
                x.TermId == request.TermId &&
                x.GradeId == request.GradeId,
                cancellationToken);

            if (existing is null)
            {
                existing = new ReportCard
                {
                    TenantId = request.TenantId,
                    SchoolId = request.SchoolId,
                    StudentId = item.StudentId,
                    AcademicYearId = request.AcademicYearId,
                    TermId = request.TermId,
                    GradeId = request.GradeId,
                    TotalMarks = item.Total,
                    AverageMark = item.Average,
                    PositionInClass = position,
                    IsPublished = false
                };
                dbContext.ReportCards.Add(existing);
            }
            else
            {
                existing.TotalMarks = item.Total;
                existing.AverageMark = item.Average;
                existing.PositionInClass = position;
                existing.UpdatedAtUtc = now;
            }

            resultCards.Add(existing);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(resultCards);
    }

    [HttpPost("{reportCardId:guid}/publish")]
    public async Task<ActionResult<ReportCard>> Publish(Guid reportCardId, [FromBody] PublishReportCardRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var card = await dbContext.ReportCards.FirstOrDefaultAsync(x =>
            x.Id == reportCardId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (card is null) return NotFound();

        card.IsPublished = request.IsPublished;
        card.PublishedAtUtc = request.IsPublished ? DateTime.UtcNow : null;
        card.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(card);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ReportCard>> Update(Guid id, [FromBody] UpdateReportCardRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var card = await dbContext.ReportCards.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (card is null) return NotFound();

        if (!User.CanAccessTenant(card.TenantId)) return Forbid();

        card.TotalMarks = request.TotalMarks;
        card.AverageMark = request.AverageMark;
        card.PositionInClass = request.PositionInClass;
        // Note: Comments field would need to be added to ReportCard entity if needed
        card.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(card);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var card = await dbContext.ReportCards.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (card is null) return NotFound();

        if (!User.CanAccessTenant(card.TenantId)) return Forbid();

        if (card.IsPublished)
        {
            return BadRequest("Cannot delete published report cards.");
        }

        dbContext.ReportCards.Remove(card);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record GenerateReportCardsForTermRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, Guid TermId, Guid GradeId);
public sealed record PublishReportCardRequest(Guid TenantId, Guid SchoolId, bool IsPublished);

public sealed record UpdateReportCardRequest(Guid TenantId, decimal TotalMarks, decimal AverageMark, int PositionInClass);
