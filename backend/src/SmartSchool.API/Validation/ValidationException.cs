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

public class ValidationException : Exception
{
    public List<ValidationError> Errors { get; }

    public ValidationException(string message) : base(message)
    {
        Errors = new List<ValidationError>();
    }

    public ValidationException(string message, List<ValidationError> errors) : base(message)
    {
        Errors = errors;
    }

    public ValidationException(List<ValidationError> errors) : base("Validation failed")
    {
        Errors = errors;
    }
}

public class ValidationError
{
    public string PropertyName { get; init; } = string.Empty;
    public string ErrorMessage { get; init; } = string.Empty;
    public object? AttemptedValue { get; init; }
}
