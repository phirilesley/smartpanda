using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Settings;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase1;

[ApiController]
[Route("api/system/settings")]
[Authorize(Policy = PolicyNames.SchoolsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class SystemSettingsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SchoolSetting>>> GetSettings([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] string? category, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var query = dbContext.SchoolSettings.AsNoTracking().Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(x => x.Category == category.Trim());
        }

        var items = await query.OrderBy(x => x.Category).ThenBy(x => x.SettingKey).ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<SchoolSetting>> UpsertSetting([FromBody] UpsertSchoolSettingRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var existing = await dbContext.SchoolSettings.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.SettingKey == request.SettingKey.Trim(),
            cancellationToken);

        if (existing is null)
        {
            var entity = new SchoolSetting
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                Category = request.Category.Trim(),
                SettingKey = request.SettingKey.Trim(),
                SettingValue = request.SettingValue,
                IsSensitive = request.IsSensitive
            };
            dbContext.SchoolSettings.Add(entity);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Ok(entity);
        }

        existing.Category = request.Category.Trim();
        existing.SettingValue = request.SettingValue;
        existing.IsSensitive = request.IsSensitive;
        existing.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(existing);
    }

    [HttpGet("master-data")]
    public async Task<ActionResult<IReadOnlyList<MasterDataItem>>> GetMasterData([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] string dataType, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty || string.IsNullOrWhiteSpace(dataType))
        {
            return BadRequest("tenantId, schoolId and dataType are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        var items = await dbContext.MasterDataItems.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId && x.DataType == dataType.Trim())
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.Name)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpPost("master-data")]
    public async Task<ActionResult<MasterDataItem>> UpsertMasterData([FromBody] UpsertMasterDataItemRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId))
        {
            return Forbid();
        }

        var code = request.Code.Trim().ToUpperInvariant();
        var existing = await dbContext.MasterDataItems.FirstOrDefaultAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.DataType == request.DataType.Trim() && x.Code == code,
            cancellationToken);

        if (existing is null)
        {
            var entity = new MasterDataItem
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                DataType = request.DataType.Trim(),
                Code = code,
                Name = request.Name.Trim(),
                DisplayOrder = request.DisplayOrder,
                IsActive = request.IsActive
            };

            dbContext.MasterDataItems.Add(entity);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Ok(entity);
        }

        existing.Name = request.Name.Trim();
        existing.DisplayOrder = request.DisplayOrder;
        existing.IsActive = request.IsActive;
        existing.UpdatedAtUtc = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(existing);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SchoolSetting>> GetSetting(Guid id, CancellationToken cancellationToken)
    {
        var setting = await dbContext.SchoolSettings.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (setting is null) return NotFound();

        if (!User.CanAccessTenant(setting.TenantId)) return Forbid();

        return Ok(setting);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSetting(Guid id, CancellationToken cancellationToken)
    {
        var setting = await dbContext.SchoolSettings.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (setting is null) return NotFound();

        if (!User.CanAccessTenant(setting.TenantId)) return Forbid();

        dbContext.SchoolSettings.Remove(setting);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("master-data/{id:guid}")]
    public async Task<ActionResult<MasterDataItem>> GetMasterDataItem(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.MasterDataItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();

        if (!User.CanAccessTenant(item.TenantId)) return Forbid();

        return Ok(item);
    }

    [HttpDelete("master-data/{id:guid}")]
    public async Task<IActionResult> DeleteMasterDataItem(Guid id, CancellationToken cancellationToken)
    {
        var item = await dbContext.MasterDataItems.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();

        if (!User.CanAccessTenant(item.TenantId)) return Forbid();

        dbContext.MasterDataItems.Remove(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record UpsertSchoolSettingRequest(Guid TenantId, Guid SchoolId, string Category, string SettingKey, string SettingValue, bool IsSensitive);
public sealed record UpsertMasterDataItemRequest(Guid TenantId, Guid SchoolId, string DataType, string Code, string Name, int DisplayOrder, bool IsActive);
