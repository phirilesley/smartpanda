using System.Security.Claims;
using System.Text;
using SmartSchool.API.Security;
using SmartSchool.Domain.Modules.Security;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Middleware;

public class AuditLoggingMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, SmartSchoolDbContext dbContext)
    {
        var method = context.Request.Method;
        var isMutating = method == HttpMethods.Post || method == HttpMethods.Put || method == HttpMethods.Patch || method == HttpMethods.Delete;

        if (!isMutating)
        {
            await next(context);
            return;
        }

        string requestBody = string.Empty;
        if (context.Request.ContentLength is > 0 && context.Request.Body.CanRead)
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, detectEncodingFromByteOrderMarks: false, leaveOpen: true);
            requestBody = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;

            if (requestBody.Length > 4000)
            {
                requestBody = requestBody[..4000];
            }
        }

        await next(context);

        if (context.Response.StatusCode >= 400)
        {
            return;
        }

        var user = context.User;
        var userIdRaw = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var tenantIdRaw = user.FindFirstValue(ClaimTypesExt.TenantId);

        if (!Guid.TryParse(tenantIdRaw, out var tenantId))
        {
            return;
        }

        var schoolId = Guid.Empty;
        if (context.Request.Headers.TryGetValue("X-School-Id", out var schoolHeader))
        {
            Guid.TryParse(schoolHeader.FirstOrDefault(), out schoolId);
        }

        Guid? userId = null;
        if (Guid.TryParse(userIdRaw, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        var path = context.Request.Path.Value ?? string.Empty;
        var entityName = path.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? "unknown";

        dbContext.AuditLogs.Add(new AuditLog
        {
            TenantId = tenantId,
            SchoolId = schoolId,
            UserId = userId,
            Action = method,
            EntityName = entityName,
            EntityId = context.TraceIdentifier,
            OldValuesJson = string.Empty,
            NewValuesJson = requestBody,
            IpAddress = context.Connection.RemoteIpAddress?.ToString() ?? string.Empty
        });

        await dbContext.SaveChangesAsync();
    }
}
