using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Pos;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/pos")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class PosController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("products")]
    public async Task<ActionResult<IReadOnlyList<PosProduct>>> GetProducts([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.PosProducts.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("categories")]
    public async Task<ActionResult<PosCategory>> CreateCategory([FromBody] CreatePosCategoryRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var exists = await dbContext.PosCategories.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Name == request.Name.Trim(),
            cancellationToken);
        if (exists) return Conflict("POS category already exists.");

        var entity = new PosCategory
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Name = request.Name.Trim()
        };

        dbContext.PosCategories.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("products")]
    public async Task<ActionResult<PosProduct>> CreateProduct([FromBody] CreatePosProductRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var categoryExists = await dbContext.PosCategories.AsNoTracking().AnyAsync(x =>
            x.Id == request.PosCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!categoryExists) return BadRequest("POS category not found.");

        var sku = request.Sku.Trim().ToUpperInvariant();
        var skuExists = await dbContext.PosProducts.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId && x.SchoolId == request.SchoolId && x.Sku == sku,
            cancellationToken);
        if (skuExists) return Conflict("SKU already exists.");

        var entity = new PosProduct
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            PosCategoryId = request.PosCategoryId,
            Name = request.Name.Trim(),
            Sku = sku,
            UnitPrice = request.UnitPrice,
            QuantityOnHand = request.OpeningQuantity
        };

        dbContext.PosProducts.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("stock-movements")]
    public async Task<ActionResult<PosStockMovement>> AddStockMovement([FromBody] CreatePosStockMovementRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var product = await dbContext.PosProducts.FirstOrDefaultAsync(x =>
            x.Id == request.PosProductId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (product is null) return BadRequest("POS product not found.");

        var movementType = request.MovementType.Trim();
        var qty = request.Quantity;
        if (string.Equals(movementType, "IN", StringComparison.OrdinalIgnoreCase))
        {
            product.QuantityOnHand += qty;
        }
        else
        {
            if (product.QuantityOnHand < qty) return BadRequest("Insufficient stock on hand.");
            product.QuantityOnHand -= qty;
        }

        product.UpdatedAtUtc = DateTime.UtcNow;

        var movement = new PosStockMovement
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            PosProductId = request.PosProductId,
            MovementType = movementType.ToUpperInvariant(),
            Quantity = qty,
            MovementDateUtc = request.MovementDateUtc == default ? DateTime.UtcNow : request.MovementDateUtc
        };

        dbContext.PosStockMovements.Add(movement);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(movement);
    }

    [HttpPost("sessions/open")]
    public async Task<ActionResult<PosCashierSession>> OpenSession([FromBody] OpenPosSessionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var hasOpenSession = await dbContext.PosCashierSessions.AsNoTracking().AnyAsync(x =>
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId &&
            x.CashierUserId == request.CashierUserId &&
            x.ClosedAtUtc == null,
            cancellationToken);
        if (hasOpenSession) return Conflict("Cashier already has an open session.");

        var session = new PosCashierSession
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            CashierUserId = request.CashierUserId,
            OpenedAtUtc = DateTime.UtcNow,
            OpeningFloat = request.OpeningFloat,
            ClosingAmount = 0
        };

        dbContext.PosCashierSessions.Add(session);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(session);
    }

    [HttpPost("sessions/{sessionId:guid}/close")]
    public async Task<ActionResult<PosCashierSession>> CloseSession(Guid sessionId, [FromBody] ClosePosSessionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var session = await dbContext.PosCashierSessions.FirstOrDefaultAsync(x =>
            x.Id == sessionId &&
            x.TenantId == request.TenantId &&
            x.SchoolId == request.SchoolId,
            cancellationToken);
        if (session is null) return NotFound();
        if (session.ClosedAtUtc.HasValue) return BadRequest("Session already closed.");

        session.ClosingAmount = request.ClosingAmount;
        session.ClosedAtUtc = request.ClosedAtUtc == default ? DateTime.UtcNow : request.ClosedAtUtc;
        session.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(session);
    }

    [HttpPost("sales")]
    public async Task<ActionResult<PosSale>> CreateSale([FromBody] CreatePosSaleRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var session = await dbContext.PosCashierSessions.FirstOrDefaultAsync(x =>
            x.Id == request.PosCashierSessionId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (session is null) return BadRequest("POS cashier session not found.");
        if (session.ClosedAtUtc.HasValue) return BadRequest("POS session is closed.");

        var lineItems = new List<PosSaleLine>();
        decimal total = 0;

        foreach (var line in request.Lines)
        {
            var product = await dbContext.PosProducts.FirstOrDefaultAsync(x =>
                x.Id == line.PosProductId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
                cancellationToken);
            if (product is null) return BadRequest($"POS product not found: {line.PosProductId}");
            if (product.QuantityOnHand < line.Quantity) return BadRequest($"Insufficient stock for product {product.Sku}.");

            var lineTotal = Math.Round(line.Quantity * product.UnitPrice, 2, MidpointRounding.AwayFromZero);
            total += lineTotal;

            product.QuantityOnHand -= line.Quantity;
            product.UpdatedAtUtc = DateTime.UtcNow;

            lineItems.Add(new PosSaleLine
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                PosProductId = product.Id,
                Quantity = line.Quantity,
                UnitPrice = product.UnitPrice,
                LineTotal = lineTotal
            });
        }

        var sale = new PosSale
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            PosCashierSessionId = request.PosCashierSessionId,
            ReceiptNumber = request.ReceiptNumber.Trim().ToUpperInvariant(),
            SaleDateUtc = DateTime.UtcNow,
            TotalAmount = total
        };

        dbContext.PosSales.Add(sale);
        await dbContext.SaveChangesAsync(cancellationToken);

        foreach (var line in lineItems)
        {
            line.PosSaleId = sale.Id;
        }

        dbContext.PosSaleLines.AddRange(lineItems);

        foreach (var payment in request.Payments)
        {
            dbContext.PosPayments.Add(new PosPayment
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                PosSaleId = sale.Id,
                Method = payment.Method.Trim(),
                Amount = payment.Amount,
                Reference = payment.Reference.Trim()
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(sale);
    }
}

public sealed record CreatePosCategoryRequest(Guid TenantId, Guid SchoolId, string Name);
public sealed record CreatePosProductRequest(Guid TenantId, Guid SchoolId, Guid PosCategoryId, string Name, string Sku, decimal UnitPrice, decimal OpeningQuantity);
public sealed record CreatePosStockMovementRequest(Guid TenantId, Guid SchoolId, Guid PosProductId, string MovementType, decimal Quantity, DateTime MovementDateUtc);
public sealed record OpenPosSessionRequest(Guid TenantId, Guid SchoolId, Guid CashierUserId, decimal OpeningFloat);
public sealed record ClosePosSessionRequest(Guid TenantId, Guid SchoolId, DateTime ClosedAtUtc, decimal ClosingAmount);
public sealed record CreatePosSaleRequest(Guid TenantId, Guid SchoolId, Guid PosCashierSessionId, string ReceiptNumber, IReadOnlyList<CreatePosSaleLineItem> Lines, IReadOnlyList<CreatePosPaymentItem> Payments);
public sealed record CreatePosSaleLineItem(Guid PosProductId, decimal Quantity);
public sealed record CreatePosPaymentItem(string Method, decimal Amount, string Reference);
