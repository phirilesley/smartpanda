namespace SmartSchool.Domain.Common;

public abstract class EntityBase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
    public DateTime? DeletedAtUtc { get; set; }
    public bool IsDeleted { get; set; }
}

public abstract class TenantEntityBase : EntityBase
{
    public Guid TenantId { get; set; }
}

public abstract class TenantSchoolEntityBase : TenantEntityBase
{
    public Guid SchoolId { get; set; }
}
