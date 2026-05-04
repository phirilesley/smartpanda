using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using SmartSchool.API.Security;

namespace SmartSchool.API.Services;

public class CacheService
{
    private readonly IDistributedCache _cache;
    private readonly CacheOptions _options;

    public CacheService(IDistributedCache cache, IOptions<CacheOptions> options)
    {
        _cache = cache;
        _options = options.Value;
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
    {
        if (!_options.EnableCache) return null;

        var cachedData = await _cache.GetStringAsync(_options.KeyPrefix + key, cancellationToken);
        return cachedData is null ? null : JsonSerializer.Deserialize<T>(cachedData);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? ttl = null, CancellationToken cancellationToken = default) where T : class
    {
        if (!_options.EnableCache || value is null) return;

        var serializedData = JsonSerializer.Serialize(value);
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = ttl ?? _options.DefaultTtl
        };

        await _cache.SetStringAsync(_options.KeyPrefix + key, serializedData, options, cancellationToken);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _cache.RemoveAsync(_options.KeyPrefix + key, cancellationToken);
    }

    public async Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default)
    {
        // Redis pattern removal - would need Redis specific implementation
        // For now, we'll skip this as it's complex with IDistributedCache
        // In production, consider using StackExchange.Redis directly for pattern operations
    }

    // 🚀 Smart Caching Methods for Common API Patterns
    public async Task<T?> GetOrSetAsync<T>(
        string key,
        Func<Task<T>> factory,
        TimeSpan? ttl = null,
        CancellationToken cancellationToken = default) where T : class
    {
        var cached = await GetAsync<T>(key, cancellationToken);
        if (cached is not null) return cached;

        var fresh = await factory();
        await SetAsync(key, fresh, ttl, cancellationToken);
        return fresh;
    }

    public async Task InvalidateByTenantAsync(Guid tenantId, string entityType, CancellationToken cancellationToken = default)
    {
        // Invalidate cache keys related to a tenant and entity type
        var pattern = $"{tenantId}:{entityType}:*";
        await RemoveByPatternAsync(pattern, cancellationToken);
    }

    public async Task InvalidateBySchoolAsync(Guid tenantId, Guid schoolId, string entityType, CancellationToken cancellationToken = default)
    {
        // Invalidate cache keys related to a specific school
        var pattern = $"{tenantId}:{schoolId}:{entityType}:*";
        await RemoveByPatternAsync(pattern, cancellationToken);
    }

    // 🚀 Cache Keys for Frequent API Endpoints
    public static class CacheKeys
    {
        public static string StudentProfile(Guid tenantId, Guid schoolId, Guid studentId) =>
            $"{tenantId}:{schoolId}:student:{studentId}";

        public static string StudentList(Guid tenantId, Guid schoolId, Guid gradeId, Guid streamId, int page, int pageSize) =>
            $"{tenantId}:{schoolId}:students:list:{gradeId}:{streamId}:{page}:{pageSize}";

        public static string AttendanceSummary(Guid tenantId, Guid schoolId, DateTime date) =>
            $"{tenantId}:{schoolId}:attendance:summary:{date:yyyy-MM-dd}";

        public static string FeeStatement(Guid tenantId, Guid schoolId, Guid studentId, Guid academicYearId) =>
            $"{tenantId}:{schoolId}:fee:statement:{studentId}:{academicYearId}";

        public static string AcademicReport(Guid tenantId, Guid schoolId, Guid studentId, Guid examSessionId) =>
            $"{tenantId}:{schoolId}:academic:report:{studentId}:{examSessionId}";

        public static string StaffProfile(Guid tenantId, Guid schoolId, Guid staffId) =>
            $"{tenantId}:{schoolId}:staff:{staffId}";

        public static string Timetable(Guid tenantId, Guid schoolId, Guid gradeId, Guid streamId, DayOfWeek day) =>
            $"{tenantId}:{schoolId}:timetable:{gradeId}:{streamId}:{(int)day}";

        public static string SchoolDashboard(Guid tenantId, Guid schoolId) =>
            $"{tenantId}:{schoolId}:dashboard";
    }
}
