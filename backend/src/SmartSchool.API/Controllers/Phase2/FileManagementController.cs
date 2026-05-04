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
using SmartSchool.Domain.Modules.Files;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase2;

[ApiController]
[Route("api/files")]
[Authorize(Policy = PolicyNames.StudentsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class FileManagementController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UploadedFile>>> GetFiles([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.UploadedFiles.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("{fileId:guid}")]
    public async Task<ActionResult<UploadedFile>> GetFile(Guid fileId, [FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var item = await dbContext.UploadedFiles.AsNoTracking().FirstOrDefaultAsync(x =>
            x.Id == fileId && x.TenantId == tenantId && x.SchoolId == schoolId,
            cancellationToken);

        if (item is null) return NotFound();
        return Ok(item);
    }

    [HttpPost("metadata")]
    public async Task<ActionResult<UploadedFile>> CreateMetadata([FromBody] CreateUploadedFileMetadataRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var item = new UploadedFile
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            OriginalFileName = request.OriginalFileName.Trim(),
            StoredFileName = request.StoredFileName.Trim(),
            ContentType = request.ContentType.Trim(),
            SizeBytes = request.SizeBytes,
            StoragePath = request.StoragePath.Trim(),
            UploadedByUserId = request.UploadedByUserId
        };

        dbContext.UploadedFiles.Add(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(item);
    }

    [HttpPut("{fileId:guid}")]
    public async Task<ActionResult<UploadedFile>> UpdateFile(Guid fileId, [FromBody] UpdateUploadedFileRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var item = await dbContext.UploadedFiles.FirstOrDefaultAsync(x => x.Id == fileId, cancellationToken);
        if (item is null) return NotFound();

        if (!User.CanAccessTenant(item.TenantId)) return Forbid();

        item.OriginalFileName = request.OriginalFileName.Trim();
        item.ContentType = request.ContentType.Trim();
        item.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(item);
    }

    [HttpDelete("{fileId:guid}")]
    public async Task<IActionResult> DeleteFile(Guid fileId, [FromQuery] Guid tenantId, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var item = await dbContext.UploadedFiles.FirstOrDefaultAsync(x => x.Id == fileId && x.TenantId == tenantId, cancellationToken);
        if (item is null) return NotFound();

        // Note: In a real implementation, this would also delete the physical file from storage
        // For now, just remove the database record

        dbContext.UploadedFiles.Remove(item);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateUploadedFileMetadataRequest(
    Guid TenantId,
    Guid SchoolId,
    string OriginalFileName,
    string StoredFileName,
    string ContentType,
    long SizeBytes,
    string StoragePath,
    Guid UploadedByUserId);

public sealed record UpdateUploadedFileRequest(Guid TenantId, string OriginalFileName, string ContentType);
