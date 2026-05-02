using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Files;

public class UploadedFile : TenantSchoolEntityBase
{
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public Guid UploadedByUserId { get; set; }
}
