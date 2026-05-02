using SmartSchool.Domain.Common;

namespace SmartSchool.Domain.Modules.Pos;

public class PosCategory : TenantSchoolEntityBase
{
    public string Name { get; set; } = string.Empty;
}

public class PosProduct : TenantSchoolEntityBase
{
    public Guid PosCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal QuantityOnHand { get; set; }
}

public class PosStockMovement : TenantSchoolEntityBase
{
    public Guid PosProductId { get; set; }
    public string MovementType { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public DateTime MovementDateUtc { get; set; }
}

public class PosCashierSession : TenantSchoolEntityBase
{
    public Guid CashierUserId { get; set; }
    public DateTime OpenedAtUtc { get; set; }
    public DateTime? ClosedAtUtc { get; set; }
    public decimal OpeningFloat { get; set; }
    public decimal ClosingAmount { get; set; }
}

public class PosSale : TenantSchoolEntityBase
{
    public Guid PosCashierSessionId { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime SaleDateUtc { get; set; }
    public decimal TotalAmount { get; set; }
}

public class PosSaleLine : TenantSchoolEntityBase
{
    public Guid PosSaleId { get; set; }
    public Guid PosProductId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

public class PosPayment : TenantSchoolEntityBase
{
    public Guid PosSaleId { get; set; }
    public string Method { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Reference { get; set; } = string.Empty;
}
