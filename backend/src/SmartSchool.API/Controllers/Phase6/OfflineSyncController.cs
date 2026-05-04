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
using SmartSchool.Persistence.Data;
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/offline-sync")]
[Route("api/sync")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class OfflineSyncController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("status")]
    public async Task<ActionResult<SyncStatusResponse>> GetSyncStatus([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? deviceId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var lastSync = deviceId.HasValue ? 
            await dbContext.OfflineSyncLogs
                .Where(l => l.TenantId == tenantId && l.SchoolId == schoolId && l.DeviceId == deviceId.Value)
                .OrderByDescending(l => l.SyncTimestamp)
                .FirstOrDefaultAsync(cancellationToken) :
            null;

        var pendingUploads = await dbContext.OfflinePendingUploads
            .Where(u => u.TenantId == tenantId && u.SchoolId == schoolId && (!deviceId.HasValue || u.DeviceId == deviceId.Value))
            .CountAsync(cancellationToken);

        var pendingDownloads = await dbContext.OfflinePendingDownloads
            .Where(d => d.TenantId == tenantId && d.SchoolId == schoolId && (!deviceId.HasValue || d.DeviceId == deviceId.Value))
            .CountAsync(cancellationToken);

        return Ok(new SyncStatusResponse
        {
            IsOnline = IsOnline(),
            LastSyncTime = lastSync?.SyncTimestamp,
            PendingUploads = pendingUploads,
            PendingDownloads = pendingDownloads,
            SyncInProgress = false,
            DeviceId = deviceId
        });
    }

    [HttpPost("upload")]
    public async Task<ActionResult<SyncUploadResponse>> UploadOfflineData([FromBody] OfflineUploadRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var syncSession = new OfflineSyncSession
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DeviceId = request.DeviceId,
            SyncType = "Upload",
            Status = "Processing",
            StartedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.OfflineSyncSessions.Add(syncSession);
        await dbContext.SaveChangesAsync(cancellationToken);

        var processedItems = 0;
        var errors = new List<string>();

        try
        {
            foreach (var item in request.DataItems)
            {
                try
                {
                    await ProcessOfflineDataItem(item, request.TenantId, request.SchoolId, cancellationToken);
                    processedItems++;
                }
                catch (Exception ex)
                {
                    errors.Add($"Failed to process item {item.Id}: {ex.Message}");
                    
                    // Log failed item for retry
                    var failedItem = new OfflinePendingUpload
                    {
                        Id = Guid.NewGuid(),
                        TenantId = request.TenantId,
                        SchoolId = request.SchoolId,
                        DeviceId = request.DeviceId,
                        EntityType = item.EntityType,
                        EntityId = item.EntityId,
                        Data = JsonSerializer.Serialize(item.Data),
                        Operation = item.Operation,
                        RetryCount = 0,
                        CreatedAtUtc = DateTime.UtcNow,
                        Error = ex.Message
                    };
                    dbContext.OfflinePendingUploads.Add(failedItem);
                }
            }

            syncSession.Status = errors.Count == 0 ? "Completed" : "CompletedWithErrors";
            syncSession.ProcessedItems = processedItems;
            syncSession.ErrorCount = errors.Count;
            syncSession.CompletedAtUtc = DateTime.UtcNow;
            syncSession.UpdatedAtUtc = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Ok(new SyncUploadResponse
            {
                Success = true,
                ProcessedItems = processedItems,
                TotalItems = request.DataItems.Length,
                Errors = errors.ToArray(),
                SessionId = syncSession.Id
            });
        }
        catch (Exception ex)
        {
            syncSession.Status = "Failed";
            syncSession.Error = ex.Message;
            syncSession.CompletedAtUtc = DateTime.UtcNow;
            syncSession.UpdatedAtUtc = DateTime.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);

            return BadRequest(new SyncUploadResponse
            {
                Success = false,
                Errors = new[] { ex.Message },
                SessionId = syncSession.Id
            });
        }
    }

    [HttpGet("download")]
    public async Task<ActionResult<SyncDownloadResponse>> DownloadOfflineData([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid deviceId, [FromQuery] DateTime? lastSyncTime, [FromQuery] string[]? entityTypes, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var syncSession = new OfflineSyncSession
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            SchoolId = schoolId,
            DeviceId = deviceId,
            SyncType = "Download",
            Status = "Processing",
            StartedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.OfflineSyncSessions.Add(syncSession);
        await dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            var dataItems = new List<OfflineDataItem>();
            var cutoffTime = lastSyncTime ?? DateTime.UtcNow.AddDays(-7); // Default to 7 days ago

            // Get students
            if (entityTypes == null || entityTypes.Contains("students"))
            {
                var students = await dbContext.Students
                    .Where(s => s.TenantId == tenantId && s.SchoolId == schoolId && !s.IsDeleted && s.UpdatedAtUtc > cutoffTime)
                    .Select(s => new OfflineDataItem
                    {
                        EntityType = "Student",
                        EntityId = s.Id,
                        Operation = "Update",
                        Data = new
                        {
                            s.Id,
                            s.FirstName,
                            s.LastName,
                            s.DateOfBirth,
                            s.Gender,
                            s.IsActive,
                            s.UpdatedAtUtc
                        }
                    })
                    .ToListAsync(cancellationToken);

                dataItems.AddRange(students);
            }

            // Get attendance records
            if (entityTypes == null || entityTypes.Contains("attendance"))
            {
                var attendance = await dbContext.StudentAttendances
                    .Where(a => a.TenantId == tenantId && a.SchoolId == schoolId && !a.IsDeleted && a.CreatedAtUtc > cutoffTime)
                    .Select(a => new OfflineDataItem
                    {
                        EntityType = "StudentAttendance",
                        EntityId = a.Id,
                        Operation = "Create",
                        Data = new
                        {
                            a.Id,
                            a.StudentId,
                            a.Date,
                            a.IsPresent,
                            a.AcademicYearId,
                            a.TermId,
                            a.GradeId,
                            a.ClassId,
                            a.CreatedAtUtc
                        }
                    })
                    .ToListAsync(cancellationToken);

                dataItems.AddRange(attendance);
            }

            // Get exam results
            if (entityTypes == null || entityTypes.Contains("results"))
            {
                var results = await dbContext.StudentExamResults
                    .Where(r => r.TenantId == tenantId && r.SchoolId == schoolId && !r.IsDeleted && r.UpdatedAtUtc > cutoffTime)
                    .Select(r => new OfflineDataItem
                    {
                        EntityType = "StudentExamResult",
                        EntityId = r.Id,
                        Operation = "Update",
                        Data = new
                        {
                            r.Id,
                            r.StudentId,
                            r.ExamId,
                            r.SubjectId,
                            r.Marks,
                            r.Grade,
                            r.Remarks,
                            r.UpdatedAtUtc
                        }
                    })
                    .ToListAsync(cancellationToken);

                dataItems.AddRange(results);
            }

            syncSession.Status = "Completed";
            syncSession.ProcessedItems = dataItems.Count;
            syncSession.CompletedAtUtc = DateTime.UtcNow;
            syncSession.UpdatedAtUtc = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Ok(new SyncDownloadResponse
            {
                Success = true,
                DataItems = dataItems.ToArray(),
                TotalItems = dataItems.Count,
                SessionId = syncSession.Id,
                NextSyncToken = GenerateSyncToken()
            });
        }
        catch (Exception ex)
        {
            syncSession.Status = "Failed";
            syncSession.Error = ex.Message;
            syncSession.CompletedAtUtc = DateTime.UtcNow;
            syncSession.UpdatedAtUtc = DateTime.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);

            return BadRequest(new SyncDownloadResponse
            {
                Success = false,
                Errors = new[] { ex.Message },
                SessionId = syncSession.Id
            });
        }
    }

    [HttpPost("retry-uploads")]
    public async Task<ActionResult<SyncRetryResponse>> RetryFailedUploads([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid deviceId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var failedUploads = await dbContext.OfflinePendingUploads
            .Where(u => u.TenantId == tenantId && u.SchoolId == schoolId && u.DeviceId == deviceId && u.RetryCount < 3)
            .ToListAsync(cancellationToken);

        var retriedCount = 0;
        var errors = new List<string>();

        foreach (var upload in failedUploads)
        {
            try
            {
                var data = JsonSerializer.Deserialize<Dictionary<string, object>>(upload.Data);
                var item = new OfflineDataItem
                {
                    EntityType = upload.EntityType,
                    EntityId = upload.EntityId,
                    Operation = upload.Operation,
                    Data = data
                };

                await ProcessOfflineDataItem(item, tenantId, schoolId, cancellationToken);
                
                // Remove successful retry
                dbContext.OfflinePendingUploads.Remove(upload);
                retriedCount++;
            }
            catch (Exception ex)
            {
                upload.RetryCount++;
                upload.Error = ex.Message;
                upload.LastRetryAtUtc = DateTime.UtcNow;
                errors.Add($"Retry failed for {upload.EntityType} {upload.EntityId}: {ex.Message}");
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new SyncRetryResponse
        {
            Success = true,
            RetriedItems = retriedCount,
            TotalFailedItems = failedUploads.Count,
            Errors = errors.ToArray()
        });
    }

    [HttpGet("config")]
    public async Task<ActionResult<OfflineConfigResponse>> GetOfflineConfig([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var config = new OfflineConfigResponse
        {
            MaxOfflineDays = 30,
            SyncIntervalMinutes = 15,
            AutoSyncEnabled = true,
            MaxRetryAttempts = 3,
            SupportedEntityTypes = new[] { "students", "attendance", "results", "fees", "timetable" },
            DataRetentionDays = 90,
            CompressionEnabled = true,
            EncryptionEnabled = true
        };

        return Ok(config);
    }

    private async Task ProcessOfflineDataItem(OfflineDataItem item, Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        switch (item.EntityType)
        {
            case "StudentAttendance":
                await ProcessAttendance(item, tenantId, schoolId, cancellationToken);
                break;
            case "StudentExamResult":
                await ProcessExamResult(item, tenantId, schoolId, cancellationToken);
                break;
            case "FeePayment":
                await ProcessFeePayment(item, tenantId, schoolId, cancellationToken);
                break;
            // Add more entity types as needed
            default:
                throw new NotSupportedException($"Entity type {item.EntityType} is not supported for offline sync");
        }
    }

    private async Task ProcessAttendance(OfflineDataItem item, Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        var data = JsonSerializer.Deserialize<Dictionary<string, object>>(JsonSerializer.Serialize(item.Data));
        
        var attendance = new StudentAttendance
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            SchoolId = schoolId,
            StudentId = Guid.Parse(data["StudentId"].ToString()),
            Date = DateOnly.Parse(data["Date"].ToString()),
            IsPresent = bool.Parse(data["IsPresent"].ToString()),
            AcademicYearId = Guid.Parse(data["AcademicYearId"].ToString()),
            TermId = Guid.Parse(data["TermId"].ToString()),
            GradeId = Guid.Parse(data["GradeId"].ToString()),
            ClassId = Guid.Parse(data["ClassId"].ToString()),
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.StudentAttendances.Add(attendance);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task ProcessExamResult(OfflineDataItem item, Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        var data = JsonSerializer.Deserialize<Dictionary<string, object>>(JsonSerializer.Serialize(item.Data));
        
        var result = await dbContext.StudentExamResults
            .FirstOrDefaultAsync(r => r.Id == Guid.Parse(data["Id"].ToString()) && !r.IsDeleted, cancellationToken);

        if (result != null)
        {
            result.Marks = decimal.Parse(data["Marks"].ToString());
            result.Grade = data["Grade"].ToString();
            result.Remarks = data["Remarks"]?.ToString();
            result.UpdatedAtUtc = DateTime.UtcNow;
        }
        else
        {
            result = new StudentExamResult
            {
                Id = Guid.Parse(data["Id"].ToString()),
                TenantId = tenantId,
                SchoolId = schoolId,
                StudentId = Guid.Parse(data["StudentId"].ToString()),
                ExamId = Guid.Parse(data["ExamId"].ToString()),
                SubjectId = Guid.Parse(data["SubjectId"].ToString()),
                Marks = decimal.Parse(data["Marks"].ToString()),
                Grade = data["Grade"].ToString(),
                Remarks = data["Remarks"]?.ToString(),
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            };
            dbContext.StudentExamResults.Add(result);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task ProcessFeePayment(OfflineDataItem item, Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        var data = JsonSerializer.Deserialize<Dictionary<string, object>>(JsonSerializer.Serialize(item.Data));
        
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            SchoolId = schoolId,
            InvoiceId = Guid.Parse(data["InvoiceId"].ToString()),
            StudentId = Guid.Parse(data["StudentId"].ToString()),
            Amount = decimal.Parse(data["Amount"].ToString()),
            PaymentMethod = data["PaymentMethod"].ToString(),
            PaymentDate = DateTime.Parse(data["PaymentDate"].ToString()),
            Reference = data["Reference"].ToString(),
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.Payments.Add(payment);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private bool IsOnline()
    {
        // Simple connectivity check - in production, this would check actual network connectivity
        return true;
    }

    private string GenerateSyncToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }
}

// DTOs
public sealed record OfflineUploadRequest(Guid TenantId, Guid SchoolId, Guid DeviceId, OfflineDataItem[] DataItems);
public sealed record OfflineDataItem(string EntityType, Guid EntityId, string Operation, object Data);
public sealed record SyncUploadResponse(bool Success, int ProcessedItems, int TotalItems, string[] Errors, Guid SessionId);
public sealed record SyncDownloadResponse(bool Success, OfflineDataItem[] DataItems, int TotalItems, Guid SessionId, string NextSyncToken, string[] Errors = null);
public sealed record SyncStatusResponse(bool IsOnline, DateTime? LastSyncTime, int PendingUploads, int PendingDownloads, bool SyncInProgress, Guid? DeviceId);
public sealed record SyncRetryResponse(bool Success, int RetriedItems, int TotalFailedItems, string[] Errors);
public sealed record OfflineConfigResponse(int MaxOfflineDays, int SyncIntervalMinutes, bool AutoSyncEnabled, int MaxRetryAttempts, string[] SupportedEntityTypes, int DataRetentionDays, bool CompressionEnabled, bool EncryptionEnabled);

// Entities (would need to be added to domain model)
public class OfflineSyncSession
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid DeviceId { get; set; }
    public string SyncType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime StartedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public int ProcessedItems { get; set; }
    public int ErrorCount { get; set; }
    public string? Error { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}

public class OfflinePendingUpload
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid DeviceId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public string Data { get; set; } = string.Empty;
    public string Operation { get; set; } = string.Empty;
    public int RetryCount { get; set; }
    public DateTime? LastRetryAtUtc { get; set; }
    public string? Error { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class OfflinePendingDownload
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid DeviceId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public string FilterCriteria { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class OfflineSyncLog
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public Guid DeviceId { get; set; }
    public string SyncType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ItemsProcessed { get; set; }
    public int ItemsFailed { get; set; }
    public DateTime SyncTimestamp { get; set; }
    public string? Error { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
