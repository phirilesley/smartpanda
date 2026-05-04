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
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/academics/terms")]
[Route("api/terms")]
[Authorize(Policy = PolicyNames.AcademicsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class TermsController(SmartSchoolDbContext dbContext, ILogger<TermsController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Term>>> GetAll([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? academicYearId, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting terms for tenant {TenantId}, school {SchoolId}, academic year {AcademicYearId}", tenantId, schoolId, academicYearId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            logger.LogWarning("Invalid parameters: tenantId={TenantId}, schoolId={SchoolId}, academicYearId={AcademicYearId}", tenantId, schoolId, academicYearId);
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            logger.LogWarning("User {UserId} denied access to tenant {TenantId}", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, tenantId);
            return Forbid();
        }

        try
        {
            var query = dbContext.Terms.AsNoTracking()
                .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
            if (academicYearId.HasValue && academicYearId.Value != Guid.Empty)
            {
                query = query.Where(x => x.AcademicYearId == academicYearId.Value);
            }

            var items = await query.OrderBy(x => x.TermNumber).ToListAsync(cancellationToken);

            logger.LogInformation("Retrieved {Count} terms for tenant {TenantId}, school {SchoolId}", items.Count, tenantId, schoolId);
            return Ok(items);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving terms for tenant {TenantId}, school {SchoolId}, academic year {AcademicYearId}", tenantId, schoolId, academicYearId);
            throw;
        }
    }

    [HttpPost]
    public async Task<ActionResult<Term>> Create([FromBody] CreateTermRequest request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating term {TermName} for tenant {TenantId}, school {SchoolId}, academic year {AcademicYearId}", 
            request.Name, request.TenantId, request.SchoolId, request.AcademicYearId);

        if (!User.CanAccessTenant(request.TenantId))
        {
            logger.LogWarning("User {UserId} denied access to tenant {TenantId} for term creation", 
                User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, request.TenantId);
            return Forbid();
        }

        try
        {
            var yearExists = await dbContext.AcademicYears.AsNoTracking().AnyAsync(x =>
                x.Id == request.AcademicYearId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                cancellationToken);

            if (!yearExists)
            {
                logger.LogWarning("Academic year {AcademicYearId} not found for tenant {TenantId}, school {SchoolId}", 
                    request.AcademicYearId, request.TenantId, request.SchoolId);
                return BadRequest("Academic year does not exist for tenant/school.");
            }

            var exists = await dbContext.Terms.AsNoTracking().AnyAsync(x =>
                x.TenantId == request.TenantId &&
                x.SchoolId == request.SchoolId &&
                x.AcademicYearId == request.AcademicYearId &&
                x.TermNumber == request.TermNumber,
                cancellationToken);

            if (exists)
            {
                logger.LogWarning("Term number {TermNumber} already exists for academic year {AcademicYearId}", 
                    request.TermNumber, request.AcademicYearId);
                return Conflict("Term number already exists for this academic year.");
            }

            var term = new Term
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                AcademicYearId = request.AcademicYearId,
                Name = request.Name.Trim(),
                TermNumber = request.TermNumber,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = true,
                IsClosed = false
            };

            dbContext.Terms.Add(term);
            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Successfully created term {TermId} ({TermName}) for tenant {TenantId}", 
                term.Id, term.Name, term.TenantId);

            return Ok(term);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating term {TermName} for tenant {TenantId}, school {SchoolId}", 
                request.Name, request.TenantId, request.SchoolId);
            throw;
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Term>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.Terms.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null)
        {
            return NotFound();
        }

        if (!User.CanAccessTenant(item.TenantId))
        {
            return Forbid();
        }

        return Ok(item);
    }
}

public sealed record CreateTermRequest(
    Guid TenantId,
    Guid SchoolId,
    Guid AcademicYearId,
    string Name,
    int TermNumber,
    DateTime StartDate,
    DateTime EndDate);
