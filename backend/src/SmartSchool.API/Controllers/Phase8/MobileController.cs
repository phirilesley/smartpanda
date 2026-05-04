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
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Mobile;

namespace SmartSchool.API.Controllers.Phase8;

[ApiController]
[Route("api/mobile")]
[Authorize]
public class MobileController(IMobileService mobileService, ILogger<MobileController> logger) : ControllerBase
{
    [HttpGet("dashboard/student")]
    [Authorize(Policy = PolicyNames.PortalStudentAccess)]
    public async Task<ActionResult<StudentMobileDashboard>> GetStudentDashboard(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting mobile dashboard for student {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var dashboard = await mobileService.GetStudentDashboardAsync(tenantId, schoolId, userId!, cancellationToken);
            logger.LogInformation("Successfully retrieved student mobile dashboard for user {UserId}", userId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting student mobile dashboard for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("dashboard/parent")]
    [Authorize(Policy = PolicyNames.PortalParentAccess)]
    public async Task<ActionResult<ParentMobileDashboard>> GetParentDashboard(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting mobile dashboard for parent {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var dashboard = await mobileService.GetParentDashboardAsync(tenantId, schoolId, userId!, cancellationToken);
            logger.LogInformation("Successfully retrieved parent mobile dashboard for user {UserId}", userId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting parent mobile dashboard for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("dashboard/teacher")]
    [Authorize(Policy = PolicyNames.PortalStaffAccess)]
    public async Task<ActionResult<TeacherMobileDashboard>> GetTeacherDashboard(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting mobile dashboard for teacher {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var dashboard = await mobileService.GetTeacherDashboardAsync(tenantId, schoolId, userId!, cancellationToken);
            logger.LogInformation("Successfully retrieved teacher mobile dashboard for user {UserId}", userId);
            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting teacher mobile dashboard for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);
            throw;
        }
    }

    [HttpGet("offline/sync-data")]
    public async Task<ActionResult<OfflineSyncData>> GetOfflineSyncData(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromQuery] DateTime lastSyncTime,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting offline sync data for user {UserId}, tenant {TenantId}, school {SchoolId}, last sync {LastSyncTime}", userId, tenantId, schoolId, lastSyncTime);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var syncData = await mobileService.GetOfflineSyncDataAsync(tenantId, schoolId, userId!, lastSyncTime, cancellationToken);
            logger.LogInformation("Successfully retrieved offline sync data for user {UserId}", userId);
            return Ok(syncData);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting offline sync data for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("offline/sync-upload")]
    public async Task<ActionResult<SyncUploadResult>> UploadOfflineData(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromBody] OfflineDataUpload uploadData,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Uploading offline data for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var result = await mobileService.ProcessOfflineDataUploadAsync(tenantId, schoolId, userId!, uploadData, cancellationToken);
            logger.LogInformation("Successfully processed offline data upload for user {UserId}", userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing offline data upload for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("push/register")]
    public async Task<ActionResult<PushRegistrationResult>> RegisterForPushNotifications(
        [FromBody] PushNotificationRegistration registration,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Registering for push notifications for user {UserId}", userId);

        try
        {
            var parsedUserId = Guid.TryParse(userId, out var userGuid) ? userGuid : Guid.Empty;
            var domainRegistration = new SmartSchool.Domain.Modules.Mobile.PushNotificationRegistration
            {
                UserId = parsedUserId,
                DeviceToken = registration.DeviceToken,
                Platform = registration.Platform
            };

            var result = await mobileService.RegisterForPushNotificationsAsync(userId!, domainRegistration, cancellationToken);
            logger.LogInformation("Successfully registered push notifications for user {UserId}", userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error registering push notifications for user {UserId}", userId);
            throw;
        }
    }

    [HttpPost("push/unregister")]
    public async Task<ActionResult> UnregisterPushNotifications(
        [FromBody] PushNotificationUnrequest unrequest,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Unregistering push notifications for user {UserId}", userId);

        try
        {
            var parsedUserId = Guid.TryParse(userId, out var userGuid) ? userGuid : Guid.Empty;
            var domainUnrequest = new SmartSchool.Domain.Modules.Mobile.PushNotificationUnrequest
            {
                UserId = parsedUserId,
                DeviceToken = unrequest.DeviceToken
            };

            await mobileService.UnregisterPushNotificationsAsync(userId!, domainUnrequest, cancellationToken);
            logger.LogInformation("Successfully unregistered push notifications for user {UserId}", userId);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error unregistering push notifications for user {UserId}", userId);
            throw;
        }
    }

    [HttpGet("voice/commands")]
    public async Task<ActionResult<List<VoiceCommand>>> GetAvailableVoiceCommands(
        [FromQuery] string userType,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting voice commands for user {UserId}, type {UserType}", userId, userType);

        try
        {
            var commands = await mobileService.GetAvailableVoiceCommandsAsync(userId!, userType, cancellationToken);
            logger.LogInformation("Retrieved {Count} voice commands for user {UserId}", commands.Count, userId);
            return Ok(commands);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting voice commands for user {UserId}, type {UserType}", userId, userType);
            throw;
        }
    }

    [HttpPost("voice/execute")]
    public async Task<ActionResult<VoiceCommandResult>> ExecuteVoiceCommand(
        [FromBody] VoiceCommandRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Executing voice command '{Command}' for user {UserId}", request.Command, userId);

        try
        {
            var parsedUserId = Guid.TryParse(userId, out var userGuid) ? userGuid : Guid.Empty;
            var domainRequest = new SmartSchool.Domain.Modules.Mobile.VoiceCommandRequest
            {
                UserId = parsedUserId,
                Command = request.Command,
                Locale = request.Language
            };

            var result = await mobileService.ExecuteVoiceCommandAsync(userId!, domainRequest, cancellationToken);
            logger.LogInformation("Successfully executed voice command '{Command}' for user {UserId}", request.Command, userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error executing voice command '{Command}' for user {UserId}", request.Command, userId);
            throw;
        }
    }

    [HttpGet("accessibility/settings")]
    public async Task<ActionResult<AccessibilitySettings>> GetAccessibilitySettings(
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting accessibility settings for user {UserId}", userId);

        try
        {
            var settings = await mobileService.GetAccessibilitySettingsAsync(userId!, cancellationToken);
            logger.LogInformation("Retrieved accessibility settings for user {UserId}", userId);
            return Ok(settings);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting accessibility settings for user {UserId}", userId);
            throw;
        }
    }

    [HttpPost("accessibility/settings")]
    public async Task<ActionResult> UpdateAccessibilitySettings(
        [FromBody] AccessibilitySettings settings,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Updating accessibility settings for user {UserId}", userId);

        try
        {
            var domainSettings = new SmartSchool.Domain.Modules.Mobile.AccessibilitySettings
            {
                HighContrast = settings.HighContrastMode,
                LargeText = settings.FontSize > 1.0,
                VoiceAssistanceEnabled = settings.VoiceNavigationEnabled || settings.ScreenReaderEnabled
            };

            await mobileService.UpdateAccessibilitySettingsAsync(userId!, domainSettings, cancellationToken);
            logger.LogInformation("Successfully updated accessibility settings for user {UserId}", userId);
            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating accessibility settings for user {UserId}", userId);
            throw;
        }
    }

    [HttpGet("gamification/profile")]
    public async Task<ActionResult<GamificationProfile>> GetGamificationProfile(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Getting gamification profile for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var profile = await mobileService.GetGamificationProfileAsync(tenantId, schoolId, userId!, cancellationToken);
            logger.LogInformation("Successfully retrieved gamification profile for user {UserId}", userId);
            return Ok(profile);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting gamification profile for user {UserId}, tenant {TenantId}, school {SchoolId}", userId, tenantId, schoolId);
            throw;
        }
    }

    [HttpPost("gamification/achievement")]
    public async Task<ActionResult<AchievementResult>> UnlockAchievement(
        [FromQuery] Guid tenantId, 
        [FromQuery] Guid schoolId,
        [FromBody] AchievementUnlockRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        logger.LogInformation("Unlocking achievement {AchievementId} for user {UserId}, tenant {TenantId}, school {SchoolId}", request.AchievementId, userId, tenantId, schoolId);

        if (tenantId == Guid.Empty || schoolId == Guid.Empty)
        {
            return BadRequest("tenantId and schoolId are required.");
        }

        if (!User.CanAccessTenant(tenantId))
        {
            return Forbid();
        }

        try
        {
            var parsedUserId = Guid.TryParse(userId, out var userGuid) ? userGuid : Guid.Empty;
            var domainRequest = new SmartSchool.Domain.Modules.Mobile.AchievementUnlockRequest
            {
                UserId = parsedUserId,
                AchievementCode = request.AchievementId
            };

            var result = await mobileService.UnlockAchievementAsync(tenantId, schoolId, userId!, domainRequest, cancellationToken);
            logger.LogInformation("Successfully unlocked achievement {AchievementId} for user {UserId}", request.AchievementId, userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error unlocking achievement {AchievementId} for user {UserId}, tenant {TenantId}, school {SchoolId}", request.AchievementId, userId, tenantId, schoolId);
            throw;
        }
    }
}

// Request/Response Models
public class PushNotificationRegistration
{
    public string DeviceToken { get; init; } = string.Empty;
    public string Platform { get; init; } = string.Empty; // "ios", "android"
    public string AppVersion { get; init; } = string.Empty;
    public string DeviceId { get; init; } = string.Empty;
    public List<string> EnabledNotificationTypes { get; init; } = new();
}

public class PushNotificationUnrequest
{
    public string DeviceToken { get; init; } = string.Empty;
    public string Platform { get; init; } = string.Empty;
}

public class PushRegistrationResult
{
    public bool Success { get; init; }
    public string RegistrationId { get; init; } = string.Empty;
    public DateTime RegisteredAt { get; init; }
    public List<string> Warnings { get; init; } = new();
}

public class VoiceCommandRequest
{
    public string Command { get; init; } = string.Empty;
    public string Language { get; init; } = "en";
    public Dictionary<string, object> Context { get; init; } = new();
}

public class VoiceCommandResult
{
    public bool Success { get; init; }
    public string Response { get; init; } = string.Empty;
    public object? Data { get; init; }
    public List<string> Suggestions { get; init; } = new();
    public string Error { get; init; } = string.Empty;
}

public class AccessibilitySettings
{
    public bool HighContrastMode { get; init; }
    public double FontSize { get; init; }
    public bool ScreenReaderEnabled { get; init; }
    public bool ReducedMotion { get; init; }
    public string ColorBlindMode { get; init; } = string.Empty;
    public bool LargeTouchTargets { get; init; }
    public bool VoiceNavigationEnabled { get; init; }
}

public class AchievementUnlockRequest
{
    public string AchievementId { get; init; } = string.Empty;
    public Dictionary<string, object> Metadata { get; init; } = new();
}

public class AchievementResult
{
    public bool Success { get; init; }
    public string AchievementId { get; init; } = string.Empty;
    public string AchievementName { get; init; } = string.Empty;
    public string AchievementDescription { get; init; } = string.Empty;
    public int PointsAwarded { get; init; }
    public DateTime UnlockedAt { get; init; }
    public List<string> NewBadges { get; init; } = new();
}
