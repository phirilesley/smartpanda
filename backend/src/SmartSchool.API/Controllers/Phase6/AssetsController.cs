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
using SmartSchool.Domain.Modules.Assets;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/assets")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AssetsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AssetItem>>> GetAssets([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.AssetItems.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<AssetItem>> CreateAsset([FromBody] CreateAssetItemRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var categoryExists = await dbContext.AssetCategories.AsNoTracking().AnyAsync(x =>
            x.Id == request.AssetCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!categoryExists) return BadRequest("Asset category not found.");

        var exists = await dbContext.AssetItems.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.AssetTag == request.AssetTag.Trim().ToUpperInvariant(),
            cancellationToken);
        if (exists) return Conflict("Asset tag already exists.");

        var entity = new AssetItem
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AssetCategoryId = request.AssetCategoryId,
            AssetTag = request.AssetTag.Trim().ToUpperInvariant(),
            Name = request.Name.Trim(),
            PurchaseDate = request.PurchaseDate,
            Cost = request.Cost
        };

        dbContext.AssetItems.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("assignments")]
    public async Task<ActionResult<AssetAssignment>> Assign([FromBody] CreateAssetAssignmentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var assetExists = await dbContext.AssetItems.AsNoTracking().AnyAsync(x =>
            x.Id == request.AssetItemId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        var staffExists = await dbContext.StaffMembers.AsNoTracking().AnyAsync(x =>
            x.Id == request.AssignedToStaffId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!assetExists || !staffExists) return BadRequest("Invalid asset or staff member.");

        var entity = new AssetAssignment
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AssetItemId = request.AssetItemId,
            AssignedToStaffId = request.AssignedToStaffId,
            AssignedDate = request.AssignedDate
        };

        dbContext.AssetAssignments.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("maintenance")]
    public async Task<ActionResult<AssetMaintenance>> AddMaintenance([FromBody] CreateAssetMaintenanceRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var assetExists = await dbContext.AssetItems.AsNoTracking().AnyAsync(x =>
            x.Id == request.AssetItemId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!assetExists) return BadRequest("Asset not found.");

        var entity = new AssetMaintenance
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            AssetItemId = request.AssetItemId,
            MaintenanceDate = request.MaintenanceDate,
            Description = request.Description.Trim(),
            Cost = request.Cost
        };

        dbContext.AssetMaintenances.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }
}

public sealed record CreateAssetItemRequest(Guid TenantId, Guid SchoolId, Guid AssetCategoryId, string AssetTag, string Name, DateTime PurchaseDate, decimal Cost);
public sealed record CreateAssetAssignmentRequest(Guid TenantId, Guid SchoolId, Guid AssetItemId, Guid AssignedToStaffId, DateTime AssignedDate);
public sealed record CreateAssetMaintenanceRequest(Guid TenantId, Guid SchoolId, Guid AssetItemId, DateTime MaintenanceDate, string Description, decimal Cost);
