using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/students/promotions")]
[Route("api/student-promotions")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class StudentPromotionsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<StudentPromotion>> Promote([FromBody] CreateStudentPromotionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var currentEnrollment = await dbContext.StudentEnrollments
            .FirstOrDefaultAsync(x => x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.StudentId == request.StudentId && x.IsCurrent,
                cancellationToken);

        if (currentEnrollment is null)
        {
            return BadRequest("No current enrollment found for student.");
        }

        var decision = request.ResolveDecision();

        var promotion = new StudentPromotion
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            StudentId = request.StudentId,
            FromAcademicYearId = request.FromAcademicYearId,
            ToAcademicYearId = request.ToAcademicYearId,
            FromGradeId = request.FromGradeId,
            ToGradeId = request.ToGradeId,
            Decision = decision,
            PromotionDate = request.PromotionDate,
            Remarks = request.Remarks?.Trim() ?? request.Reason?.Trim() ?? string.Empty
        };

        currentEnrollment.IsCurrent = false;
        currentEnrollment.Status = decision.ToString();
        currentEnrollment.UpdatedAtUtc = DateTime.UtcNow;

        var student = await dbContext.Students.FirstOrDefaultAsync(x => x.Id == request.StudentId, cancellationToken);

        if (decision is EnrollmentDecision.Promoted or EnrollmentDecision.Repeated)
        {
            var toTermId = request.ToTermId == Guid.Empty ? currentEnrollment.TermId : request.ToTermId;
            var toStreamId = request.ToStreamId == Guid.Empty ? currentEnrollment.StreamId : request.ToStreamId;

            var enrollment = new StudentEnrollment
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                StudentId = request.StudentId,
                AcademicYearId = request.ToAcademicYearId,
                TermId = toTermId,
                GradeId = request.ToGradeId,
                StreamId = toStreamId,
                Status = "Active",
                IsCurrent = true
            };

            dbContext.StudentEnrollments.Add(enrollment);

            if (student is not null)
            {
                student.Status = "Active";
                student.UpdatedAtUtc = DateTime.UtcNow;
            }
        }
        else
        {
            if (student is not null)
            {
                student.Status = decision.ToString();
                student.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        dbContext.StudentPromotions.Add(promotion);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(promotion);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<StudentPromotion>>> GetByStudent([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? studentId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var query = dbContext.StudentPromotions.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (studentId.HasValue && studentId.Value != Guid.Empty)
        {
            query = query.Where(x => x.StudentId == studentId.Value);
        }

        var items = await query.OrderByDescending(x => x.PromotionDate).ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentPromotion>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var promotion = await dbContext.StudentPromotions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (promotion is null) return NotFound();
        if (!User.CanAccessTenant(promotion.TenantId)) return Forbid();
        return Ok(promotion);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var promotion = await dbContext.StudentPromotions.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (promotion is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(promotion.TenantId))
        {
            return Forbid();
        }

        dbContext.StudentPromotions.Remove(promotion);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed class CreateStudentPromotionRequest
{
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid StudentId { get; set; }
    public Guid FromAcademicYearId { get; set; }
    public Guid ToAcademicYearId { get; set; }
    public Guid FromGradeId { get; set; }
    public Guid ToGradeId { get; set; }
    public Guid ToTermId { get; set; }
    public Guid ToStreamId { get; set; }
    public EnrollmentDecision? Decision { get; set; }
    public string? Reason { get; set; }
    public DateTime PromotionDate { get; set; }
    public string? Remarks { get; set; }

    public EnrollmentDecision ResolveDecision() => Decision ?? EnrollmentDecision.Promoted;
}
