using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/library")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class LibraryController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("books")]
    public async Task<ActionResult<IReadOnlyList<Book>>> GetBooks([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var items = await dbContext.Books.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId)
            .OrderBy(x => x.Title)
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost("books")]
    public async Task<ActionResult<Book>> CreateBook([FromBody] CreateBookRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var categoryExists = await dbContext.BookCategories.AsNoTracking().AnyAsync(x =>
            x.Id == request.BookCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!categoryExists) return BadRequest("Book category not found.");

        var entity = new Book
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            BookCategoryId = request.BookCategoryId,
            Title = request.Title.Trim(),
            Author = request.Author.Trim(),
            Isbn = request.Isbn.Trim()
        };

        dbContext.Books.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("copies")]
    public async Task<ActionResult<BookCopy>> CreateCopy([FromBody] CreateBookCopyRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var bookExists = await dbContext.Books.AsNoTracking().AnyAsync(x =>
            x.Id == request.BookId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!bookExists) return BadRequest("Book not found.");

        var entity = new BookCopy
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            BookId = request.BookId,
            CopyNumber = request.CopyNumber.Trim().ToUpperInvariant(),
            Status = "Available"
        };

        dbContext.BookCopies.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(entity);
    }

    [HttpPost("issues")]
    public async Task<ActionResult<BookIssue>> IssueBook([FromBody] IssueBookRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var copy = await dbContext.BookCopies.FirstOrDefaultAsync(x =>
            x.Id == request.BookCopyId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (copy is null) return BadRequest("Book copy not found.");
        if (!string.Equals(copy.Status, "Available", StringComparison.OrdinalIgnoreCase)) return BadRequest("Book copy is not available.");

        var studentExists = await dbContext.Students.AsNoTracking().AnyAsync(x =>
            x.Id == request.BorrowerStudentId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!studentExists) return BadRequest("Borrower student not found.");

        var issue = new BookIssue
        {
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            BookCopyId = request.BookCopyId,
            BorrowerStudentId = request.BorrowerStudentId,
            IssuedDate = request.IssuedDate,
            DueDate = request.DueDate,
            ReturnedDate = null
        };

        copy.Status = "Issued";
        copy.UpdatedAtUtc = DateTime.UtcNow;

        dbContext.BookIssues.Add(issue);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(issue);
    }

    [HttpPost("issues/{issueId:guid}/return")]
    public async Task<ActionResult<BookIssue>> ReturnBook(Guid issueId, [FromBody] ReturnBookRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var issue = await dbContext.BookIssues.FirstOrDefaultAsync(x =>
            x.Id == issueId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);

        if (issue is null) return NotFound();
        if (issue.ReturnedDate.HasValue) return BadRequest("Book is already returned.");

        var copy = await dbContext.BookCopies.FirstOrDefaultAsync(x => x.Id == issue.BookCopyId, cancellationToken);
        if (copy is not null)
        {
            copy.Status = "Available";
            copy.UpdatedAtUtc = DateTime.UtcNow;
        }

        issue.ReturnedDate = request.ReturnedDate == default ? DateTime.UtcNow : request.ReturnedDate;
        issue.UpdatedAtUtc = DateTime.UtcNow;

        if (issue.ReturnedDate.Value.Date > issue.DueDate.Date)
        {
            var overdueDays = (issue.ReturnedDate.Value.Date - issue.DueDate.Date).Days;
            var fine = new LibraryFine
            {
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                BookIssueId = issue.Id,
                Amount = overdueDays * Math.Max(0, request.DailyFineAmount),
                Reason = "Overdue return",
                IsPaid = false
            };
            dbContext.LibraryFines.Add(fine);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(issue);
    }

    [HttpGet("books/{id:guid}")]
    public async Task<ActionResult<Book>> GetBook(Guid id, CancellationToken cancellationToken)
    {
        var book = await dbContext.Books.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (book is null) return NotFound();

        if (!User.CanAccessTenant(book.TenantId)) return Forbid();

        return Ok(book);
    }

    [HttpPut("books/{id:guid}")]
    public async Task<ActionResult<Book>> UpdateBook(Guid id, [FromBody] UpdateBookRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (book is null) return NotFound();

        if (!User.CanAccessTenant(book.TenantId)) return Forbid();

        var categoryExists = await dbContext.BookCategories.AsNoTracking().AnyAsync(x =>
            x.Id == request.BookCategoryId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!categoryExists) return BadRequest("Book category not found.");

        book.BookCategoryId = request.BookCategoryId;
        book.Title = request.Title.Trim();
        book.Author = request.Author.Trim();
        book.Isbn = request.Isbn.Trim();
        book.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(book);
    }

    [HttpDelete("books/{id:guid}")]
    public async Task<IActionResult> DeleteBook(Guid id, CancellationToken cancellationToken)
    {
        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (book is null) return NotFound();

        if (!User.CanAccessTenant(book.TenantId)) return Forbid();

        // Check if book has copies
        var hasCopies = await dbContext.BookCopies.AnyAsync(x => x.BookId == id, cancellationToken);
        if (hasCopies)
        {
            return BadRequest("Cannot delete book with existing copies.");
        }

        dbContext.Books.Remove(book);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("copies/{id:guid}")]
    public async Task<ActionResult<BookCopy>> GetCopy(Guid id, CancellationToken cancellationToken)
    {
        var copy = await dbContext.BookCopies.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (copy is null) return NotFound();

        if (!User.CanAccessTenant(copy.TenantId)) return Forbid();

        return Ok(copy);
    }

    [HttpPut("copies/{id:guid}")]
    public async Task<ActionResult<BookCopy>> UpdateCopy(Guid id, [FromBody] UpdateBookCopyRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var copy = await dbContext.BookCopies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (copy is null) return NotFound();

        if (!User.CanAccessTenant(copy.TenantId)) return Forbid();

        var bookExists = await dbContext.Books.AsNoTracking().AnyAsync(x =>
            x.Id == request.BookId && x.TenantId == request.TenantId && x.SchoolId == request.SchoolId,
            cancellationToken);
        if (!bookExists) return BadRequest("Book not found.");

        copy.BookId = request.BookId;
        copy.CopyNumber = request.CopyNumber.Trim().ToUpperInvariant();
        copy.Status = request.Status.Trim();
        copy.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return Ok(copy);
    }

    [HttpDelete("copies/{id:guid}")]
    public async Task<IActionResult> DeleteCopy(Guid id, CancellationToken cancellationToken)
    {
        var copy = await dbContext.BookCopies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (copy is null) return NotFound();

        if (!User.CanAccessTenant(copy.TenantId)) return Forbid();

        // Check if copy is issued
        var isIssued = await dbContext.BookIssues.AnyAsync(x => x.BookCopyId == id && !x.ReturnedDate.HasValue, cancellationToken);
        if (isIssued)
        {
            return BadRequest("Cannot delete issued book copy.");
        }

        dbContext.BookCopies.Remove(copy);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}

public sealed record CreateBookRequest(Guid TenantId, Guid SchoolId, Guid BookCategoryId, string Title, string Author, string Isbn);
public sealed record UpdateBookRequest(Guid TenantId, Guid SchoolId, Guid BookCategoryId, string Title, string Author, string Isbn);
public sealed record CreateBookCopyRequest(Guid TenantId, Guid SchoolId, Guid BookId, string CopyNumber);
public sealed record UpdateBookCopyRequest(Guid TenantId, Guid SchoolId, Guid BookId, string CopyNumber, string Status);
public sealed record IssueBookRequest(Guid TenantId, Guid SchoolId, Guid BookCopyId, Guid BorrowerStudentId, DateTime IssuedDate, DateTime DueDate);
public sealed record ReturnBookRequest(Guid TenantId, Guid SchoolId, DateTime ReturnedDate, decimal DailyFineAmount);
