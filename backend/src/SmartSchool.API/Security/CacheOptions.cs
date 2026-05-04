namespace SmartSchool.API.Security;

public sealed class CacheOptions
{
    public const string SectionName = "Cache";

    public TimeSpan DefaultTtl { get; set; } = TimeSpan.FromMinutes(10);
    public TimeSpan ShortTtl { get; set; } = TimeSpan.FromMinutes(2);
    public TimeSpan LongTtl { get; set; } = TimeSpan.FromHours(1);
    public bool EnableCache { get; set; } = true;
    public string KeyPrefix { get; set; } = "SmartSchool:";
}
