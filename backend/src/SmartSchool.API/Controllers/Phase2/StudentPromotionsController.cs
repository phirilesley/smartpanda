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

        var decision = request.Decision;

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
            Remarks = request.Remarks?.Trim() ?? string.Empty
        };

        currentEnrollment.IsCurrent = false;
        currentEnrollment.Status = decision.ToString();
        currentEnrollment.UpdatedAtUtc = DateTime.UtcNow;

        var student = await dbContext.Students.FirstOrDefaultAsync(x => x.Id == request.StudentId, cancellationToken);

        if (decision is EnrollmentDecision.Promoted or EnrollmentDecision.Repeated)
        {
            if (request.ToTermId == Guid.Empty || request.ToStreamId == Guid.Empty)
            {
                return BadRequest("ToTermId and ToStreamId are required for promoted/repeated students.");
            }

            var enrollment = new StudentEnrollment
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                StudentId = request.StudentId,
                AcademicYearId = request.ToAcademicYearId,
                TermId = request.ToTermId,
                GradeId = request.ToGradeId,
                StreamId = request.ToStreamId,
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
}

public sealed record CreateStudentPromotionRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid StudentId,
    Guid FromAcademicYearId,
    Guid ToAcademicYearId,
    Guid FromGradeId,
    Guid ToGradeId,
    Guid ToTermId,
    Guid ToStreamId,
    EnrollmentDecision Decision,
    DateTime PromotionDate,
    string? Remarks);
