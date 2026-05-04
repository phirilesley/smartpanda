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
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Validation;

namespace SmartSchool.API.Middleware;

public class GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.Clear();
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            ValidationException validationEx => CreateValidationErrorResponse(validationEx),
            ArgumentException argEx => CreateErrorResponse(context, HttpStatusCode.BadRequest, argEx.Message),
            InvalidOperationException opEx => CreateErrorResponse(context, HttpStatusCode.BadRequest, opEx.Message),
            UnauthorizedAccessException unauthEx => CreateErrorResponse(context, HttpStatusCode.Unauthorized, unauthEx.Message),
            KeyNotFoundException keyEx => CreateErrorResponse(context, HttpStatusCode.NotFound, keyEx.Message),
            DbUpdateException dbEx => CreateDatabaseErrorResponse(context, dbEx),
            TimeoutException timeoutEx => CreateErrorResponse(context, HttpStatusCode.RequestTimeout, "Request timed out. Please try again."),
            _ => CreateErrorResponse(context, HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again.")
        };

        context.Response.StatusCode = response.StatusCode;
        
        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }

    private static ApiErrorResponse CreateValidationErrorResponse(ValidationException validationEx)
    {
        return new ApiErrorResponse
        {
            StatusCode = (int)HttpStatusCode.BadRequest,
            Message = "Validation failed",
            Errors = validationEx.Errors.Select(e => e.ErrorMessage).ToArray()
        };
    }

    private static ApiErrorResponse CreateErrorResponse(HttpContext context, HttpStatusCode statusCode, string message)
    {
        return new ApiErrorResponse
        {
            StatusCode = (int)statusCode,
            Message = message,
            TraceId = context.TraceIdentifier
        };
    }

    private static ApiErrorResponse CreateDatabaseErrorResponse(HttpContext context, DbUpdateException dbEx)
    {
        var message = "A database error occurred. Please try again.";
        
        // Check for specific database constraints
        if (dbEx.InnerException?.Message.Contains("UNIQUE constraint failed") == true ||
            dbEx.InnerException?.Message.Contains("duplicate key") == true)
        {
            message = "A record with these values already exists.";
        }
        else if (dbEx.InnerException?.Message.Contains("FOREIGN KEY constraint failed") == true ||
                 dbEx.InnerException?.Message.Contains("conflicted with the REFERENCES constraint") == true)
        {
            message = "Referenced record does not exist.";
        }

        return new ApiErrorResponse
        {
            StatusCode = (int)HttpStatusCode.BadRequest,
            Message = message,
            TraceId = context.TraceIdentifier
        };
    }
}

public class ApiErrorResponse
{
    public int StatusCode { get; init; }
    public string Message { get; init; } = string.Empty;
    public string[]? Errors { get; init; }
    public string? TraceId { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;
}
