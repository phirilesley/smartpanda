using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using SmartSchool.Domain.Modules.Caching;

namespace SmartSchool.Infrastructure.Caching;

public class RedisCacheService(IDistributedCache cache, ILogger<RedisCacheService> logger) : ICacheService
{
    private readonly DistributedCacheEntryOptions _defaultOptions = new DistributedCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30),
        SlidingExpiration = TimeSpan.FromMinutes(10)
    };

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Getting cache value for key: {Key}", key);

        try
        {
            var cachedValue = await cache.GetStringAsync(key, cancellationToken);
            if (string.IsNullOrEmpty(cachedValue))
            {
                logger.LogDebug("Cache miss for key: {Key}", key);
                return default;
            }

            var result = JsonSerializer.Deserialize<T>(cachedValue);
            logger.LogDebug("Cache hit for key: {Key}", key);
            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting cache value for key: {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Setting cache value for key: {Key}", key);

        try
        {
            var serializedValue = JsonSerializer.Serialize(value);
            var cacheOptions = options ?? _defaultOptions;

            await cache.SetStringAsync(key, serializedValue, cacheOptions, cancellationToken);
            logger.LogDebug("Successfully set cache value for key: {Key}", key);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting cache value for key: {Key}", key);
            throw;
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Removing cache value for key: {Key}", key);

        try
        {
            await cache.RemoveAsync(key, cancellationToken);
            logger.LogDebug("Successfully removed cache value for key: {Key}", key);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error removing cache value for key: {Key}", key);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Checking if cache key exists: {Key}", key);

        try
        {
            var cachedValue = await cache.GetStringAsync(key, cancellationToken);
            var exists = !string.IsNullOrEmpty(cachedValue);
            logger.LogDebug("Cache key {Key} exists: {Exists}", key, exists);
            return exists;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking if cache key exists: {Key}", key);
            return false;
        }
    }

    public async Task RefreshAsync(string key, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Refreshing cache key: {Key}", key);

        try
        {
            await cache.RefreshAsync(key, cancellationToken);
            logger.LogDebug("Successfully refreshed cache key: {Key}", key);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error refreshing cache key: {Key}", key);
            throw;
        }
    }

    public async Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Get or create cache value for key: {Key}", key);

        try
        {
            var cachedValue = await GetAsync<T>(key, cancellationToken);
            if (cachedValue != null)
            {
                logger.LogDebug("Cache hit for key: {Key}", key);
                return cachedValue;
            }

            logger.LogDebug("Cache miss for key: {Key}, creating new value", key);
            var value = await factory();
            await SetAsync(key, value, options, cancellationToken);
            return value;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in GetOrCreate for key: {Key}", key);
            throw;
        }
    }

    public async Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Removing cache keys by pattern: {Pattern}", pattern);

        try
        {
            // Note: Redis supports pattern matching, but DistributedCache interface doesn't expose it directly
            // This would require a custom Redis implementation or direct Redis client usage
            logger.LogWarning("Pattern-based cache removal requires direct Redis client implementation");
            
            // For now, we'll log a warning
            // In a real implementation, you would use StackExchange.Redis directly
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error removing cache keys by pattern: {Pattern}", pattern);
            throw;
        }
    }

    public async Task<IDictionary<string, T>> GetMultipleAsync<T>(IEnumerable<string> keys, CancellationToken cancellationToken = default)
    {
        var keyList = keys.ToList();
        logger.LogDebug("Getting multiple cache values for {Count} keys", keyList.Count);

        try
        {
            var tasks = keyList.Select(async key =>
            {
                var value = await GetAsync<T>(key, cancellationToken);
                return new { Key = key, Value = value };
            });

            var results = await Task.WhenAll(tasks);
            var dictionary = results.Where(x => x.Value != null)
                                   .ToDictionary(x => x.Key!, x => x.Value!);

            logger.LogDebug("Retrieved {Count} values from cache", dictionary.Count);
            return dictionary;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting multiple cache values");
            throw;
        }
    }

    public async Task SetMultipleAsync<T>(IDictionary<string, T> items, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Setting multiple cache values for {Count} keys", items.Count);

        try
        {
            var tasks = items.Select(async item =>
            {
                await SetAsync(item.Key, item.Value, options, cancellationToken);
            });

            await Task.WhenAll(tasks);
            logger.LogDebug("Successfully set {Count} cache values", items.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting multiple cache values");
            throw;
        }
    }

    public async Task<long> IncrementAsync(string key, long value = 1, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Incrementing cache key: {Key} by {Value}", key, value);

        try
        {
            // Note: DistributedCache doesn't support atomic operations
            // This would require direct Redis client usage
            var current = await GetAsync<long>(key, cancellationToken) ?? 0;
            var newValue = current + value;
            await SetAsync(key, newValue, options, cancellationToken);
            
            logger.LogDebug("Incremented cache key {Key} from {Current} to {NewValue}", key, current, newValue);
            return newValue;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error incrementing cache key: {Key}", key);
            throw;
        }
    }

    public async Task<double> DecrementAsync(string key, double value = 1, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Decrementing cache key: {Key} by {Value}", key, value);

        try
        {
            var current = await GetAsync<double>(key, cancellationToken) ?? 0;
            var newValue = current - value;
            await SetAsync(key, newValue, options, cancellationToken);
            
            logger.LogDebug("Decremented cache key {Key} from {Current} to {NewValue}", key, current, newValue);
            return newValue;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error decrementing cache key: {Key}", key);
            throw;
        }
    }

    public async Task<CacheStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        logger.LogDebug("Getting cache statistics");

        try
        {
            // Note: DistributedCache doesn't provide statistics
            // This would require direct Redis client usage or custom tracking
            return new CacheStatistics
            {
                TotalKeys = 0,
                TotalMemoryUsage = 0,
                HitRate = 0.0,
                MissRate = 0.0,
                EvictionCount = 0,
                ConnectionCount = 1
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting cache statistics");
            throw;
        }
    }

    public async Task FlushAllAsync(CancellationToken cancellationToken = default)
    {
        logger.LogWarning("Flushing all cache data");

        try
        {
            // Note: DistributedCache doesn't support flush all
            // This would require direct Redis client usage
            logger.LogWarning("Cache flush requires direct Redis client implementation");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error flushing cache");
            throw;
        }
    }
}

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default);
    Task SetAsync<T>(string key, T value, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default);
    Task RemoveAsync(string key, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default);
    Task RefreshAsync(string key, CancellationToken cancellationToken = default);
    Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default);
    Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default);
    Task<IDictionary<string, T>> GetMultipleAsync<T>(IEnumerable<string> keys, CancellationToken cancellationToken = default);
    Task SetMultipleAsync<T>(IDictionary<string, T> items, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default);
    Task<long> IncrementAsync(string key, long value = 1, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default);
    Task<double> DecrementAsync(string key, double value = 1, DistributedCacheEntryOptions? options = null, CancellationToken cancellationToken = default);
    Task<CacheStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default);
    Task FlushAllAsync(CancellationToken cancellationToken = default);
}

public class CacheStatistics
{
    public long TotalKeys { get; init; }
    public long TotalMemoryUsage { get; init; }
    public double HitRate { get; init; }
    public double MissRate { get; init; }
    public long EvictionCount { get; init; }
    public int ConnectionCount { get; init; }
}
