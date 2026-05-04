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
namespace SmartSchool.API.Validation;

public class ValidationResponse
{
    public bool Success { get; set; }
    public List<string> Errors { get; set; } = [];
    public List<string> Warnings { get; set; } = [];
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }

    public static ValidationResponse Successful(object? data = null, List<string>? warnings = null)
    {
        return new ValidationResponse
        {
            Success = true,
            Data = data,
            Warnings = warnings ?? []
        };
    }

    public static ValidationResponse Failed(List<string> errors, string message = "Validation failed")
    {
        return new ValidationResponse
        {
            Success = false,
            Errors = errors,
            Message = message
        };
    }

    public static ValidationResponse Warning(List<string> warnings, string message = "Validation completed with warnings")
    {
        return new ValidationResponse
        {
            Success = true,
            Warnings = warnings,
            Message = message
        };
    }
}

public class CrossEntityValidationWarning
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Severity { get; set; } = "Info"; // Info, Warning, Critical
    public string? SuggestedAction { get; set; }
    public Dictionary<string, object> Context { get; set; } = [];
}

public class ValidationSummary
{
    public int TotalValidations { get; set; }
    public int PassedValidations { get; set; }
    public int FailedValidations { get; set; }
    public int Warnings { get; set; }
    public List<CrossEntityValidationWarning> ValidationDetails { get; set; } = [];
    public DateTime ValidatedAt { get; set; } = DateTime.UtcNow;
    public string ValidatedBy { get; set; } = string.Empty;
}
