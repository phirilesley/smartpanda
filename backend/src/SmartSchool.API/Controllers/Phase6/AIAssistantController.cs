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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Persistence.Data;
using System.Text.Json;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/ai-assistant")]
[Route("api/ai")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AIAssistantController : ControllerBase
{
    private readonly SmartSchoolDbContext dbContext;

    public AIAssistantController(SmartSchoolDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    [HttpPost("chat")]
    public async Task<ActionResult<AIChatResponse>> Chat([FromBody] AIChatRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        // Simulate AI processing (in real implementation, this would call an AI service)
        var response = await ProcessAIRequest(request, cancellationToken);
        
        return Ok(response);
    }

    [HttpPost("insights")]
    public async Task<ActionResult<AIInsightsResponse>> GetInsights([FromBody] AIInsightsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var insights = await GenerateInsights(request, cancellationToken);
        return Ok(insights);
    }

    [HttpPost("predictions")]
    public async Task<ActionResult<AIPredictionsResponse>> GetPredictions([FromBody] AIPredictionsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var predictions = await GeneratePredictions(request, cancellationToken);
        return Ok(predictions);
    }

    [HttpPost("generate-report-comment")]
    public async Task<ActionResult<string>> GenerateReportComment([FromBody] ReportCommentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var comment = await GenerateReportCommentInternal(request, cancellationToken);
        return Ok(comment);
    }

    [HttpPost("suggest-timetable")]
    public async Task<ActionResult<TimetableSuggestion>> SuggestTimetable([FromBody] TimetableRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var suggestion = await GenerateTimetableSuggestion(request, cancellationToken);
        return Ok(suggestion);
    }

    private async Task<AIChatResponse> ProcessAIRequest(AIChatRequest request, CancellationToken cancellationToken)
    {
        // Simulate AI processing with predefined responses
        var response = new AIChatResponse
        {
            Message = GetAIResponse(request.Message),
            Timestamp = DateTime.UtcNow,
            Confidence = 0.85,
            Suggestions = GetSuggestions(request.Message)
        };

        return await Task.FromResult(response);
    }

    private async Task<AIInsightsResponse> GenerateInsights(AIInsightsRequest request, CancellationToken cancellationToken)
    {
        var insights = new List<AIInsight>();

        if (request.InsightType == "academic")
        {
            // Generate academic insights
            var totalStudents = await dbContext.Students.CountAsync(s => s.TenantId == request.TenantId && s.SchoolId == request.SchoolId && !s.IsDeleted, cancellationToken);
            var avgAttendance = await dbContext.StudentAttendances
                .Where(a => a.TenantId == request.TenantId && a.SchoolId == request.SchoolId && !a.IsDeleted)
                .GroupBy(a => a.StudentId)
                .Select(g => g.Count(a => a.IsPresent) / (decimal)g.Count() * 100)
                .AverageAsync(cancellationToken);

            insights.Add(new AIInsight
            {
                Title = "Student Attendance Trend",
                Description = $"Average attendance rate is {avgAttendance:F1}% across {totalStudents} students",
                Type = "positive",
                Value = avgAttendance,
                Recommendation = "Consider recognizing students with 95%+ attendance"
            });
        }
        else if (request.InsightType == "financial")
        {
            // Generate financial insights
            var totalFees = await dbContext.Invoices
                .Where(i => i.TenantId == request.TenantId && i.SchoolId == request.SchoolId && !i.IsDeleted)
                .SumAsync(i => i.TotalAmount, cancellationToken);
            
            var paidFees = await dbContext.Payments
                .Where(p => p.TenantId == request.TenantId && p.SchoolId == request.SchoolId && !p.IsDeleted)
                .SumAsync(p => p.Amount, cancellationToken);

            var collectionRate = totalFees > 0 ? (paidFees / totalFees) * 100 : 0;

            insights.Add(new AIInsight
            {
                Title = "Fee Collection Performance",
                Description = $"Current collection rate is {collectionRate:F1}% of total billed fees",
                Type = collectionRate >= 80 ? "positive" : collectionRate >= 60 ? "warning" : "critical",
                Value = collectionRate,
                Recommendation = collectionRate < 80 ? "Implement automated payment reminders for outstanding fees" : "Maintain current collection strategy"
            });
        }

        return new AIInsightsResponse
        {
            Insights = insights,
            GeneratedAt = DateTime.UtcNow
        };
    }

    private async Task<AIPredictionsResponse> GeneratePredictions(AIPredictionsRequest request, CancellationToken cancellationToken)
    {
        var predictions = new List<AIPrediction>();

        if (request.PredictionType == "student-risk")
        {
            // Predict students at risk of failing
            var atRiskStudents = await dbContext.StudentEnrollments
                .Where(se => se.TenantId == request.TenantId && se.SchoolId == request.SchoolId && !se.IsDeleted)
                .Join(dbContext.Students, se => se.StudentId, s => s.Id, (se, s) => new { se, s })
                .Join(dbContext.StudentAttendances, x => x.s.Id, a => a.StudentId, (x, a) => new { x.se, x.s, a })
                .Where(x => x.a.IsPresent == false)
                .GroupBy(x => x.s.Id)
                .Where(g => g.Count() > 10) // More than 10 absences
                .Select(g => new { StudentId = g.Key, AbsenceCount = g.Count() })
                .Take(5)
                .ToListAsync(cancellationToken);

            foreach (var student in atRiskStudents)
            {
                predictions.Add(new AIPrediction
                {
                    Title = "Academic Risk Alert",
                    Description = $"Student has {student.AbsenceCount} absences - at risk of falling behind",
                    Confidence = 0.75,
                    Priority = "high",
                    ActionItems = new[] { "Schedule parent meeting", "Provide academic support", "Monitor attendance closely" }
                });
            }
        }
        else if (request.PredictionType == "fee-default")
        {
            // Predict parents likely to default on fees
            var defaultRisk = await dbContext.Invoices
                .Where(i => i.TenantId == request.TenantId && i.SchoolId == request.SchoolId && !i.IsDeleted)
                .Join(dbContext.StudentEnrollments, i => i.StudentEnrollmentId, se => se.Id, (i, se) => new { i, se })
                .Join(dbContext.Students, x => x.se.StudentId, s => s.Id, (x, s) => new { x.i, x.se, s })
                .Join(dbContext.Guardians, x => x.s.Id, g => g.StudentId, (x, g) => new { x.i, x.se, x.s, g })
                .Where(x => x.i.DueDate < DateTime.UtcNow.AddDays(30) && x.i.Status != "Paid")
                .GroupBy(x => x.g.GuardianId)
                .Where(g => g.Count() > 1) // Multiple overdue invoices
                .Select(g => new { GuardianId = g.Key, OverdueCount = g.Count() })
                .Take(5)
                .ToListAsync(cancellationToken);

            foreach (var guardian in defaultRisk)
            {
                predictions.Add(new AIPrediction
                {
                    Title = "Payment Default Risk",
                    Description = $"Guardian has {guardian.OverdueCount} overdue payments",
                    Confidence = 0.80,
                    Priority = "medium",
                    ActionItems = new[] { "Send payment reminder", "Offer payment plan", "Contact for discussion" }
                });
            }
        }

        return new AIPredictionsResponse
        {
            Predictions = predictions,
            GeneratedAt = DateTime.UtcNow
        };
    }

    private async Task<string> GenerateReportCommentInternal(ReportCommentRequest request, CancellationToken cancellationToken)
    {
        // Simulate AI-generated report comments based on performance
        var comments = new List<string>
        {
            $"{request.StudentName} demonstrates consistent effort and shows improvement in {request.Subject}. Continued practice will further enhance their skills.",
            $"{request.StudentName} has shown good progress in {request.Subject}. They participate actively in class and complete assignments on time.",
            $"{request.StudentName} is developing a solid understanding of {request.Subject} concepts. Additional focus on {request.WeakArea} would benefit their overall performance.",
            $"{request.StudentName} excels in {request.Subject} and often helps peers. Their analytical thinking skills are particularly noteworthy.",
            $"{request.StudentName} shows enthusiasm for learning {request.Subject}. With continued dedication, they will achieve even greater success."
        };

        var commentIndex = (request.PerformanceGrade?.Length ?? 0) % comments.Count;
        return await Task.FromResult(comments[commentIndex]);
    }

    private async Task<TimetableSuggestion> GenerateTimetableSuggestion(TimetableRequest request, CancellationToken cancellationToken)
    {
        // Simulate AI timetable optimization
        var suggestion = new TimetableSuggestion
        {
            OptimizationScore = 85,
            ConflictsResolved = 3,
            TeacherUtilization = 78,
            RoomUtilization = 82,
            Suggestions = new[]
            {
                "Move Mathematics to Period 2 for better student focus",
                "Combine Grade 10A and 10B for History to optimize teacher resources",
                "Schedule Science labs in morning sessions for better equipment availability"
            },
            GeneratedAt = DateTime.UtcNow
        };

        return await Task.FromResult(suggestion);
    }

    private string GetAIResponse(string message)
    {
        message = message.ToLowerInvariant();
        
        if (message.Contains("attendance"))
            return "I can help you analyze attendance patterns. Would you like to see attendance trends or identify students with low attendance?";
        
        if (message.Contains("fees") || message.Contains("payment"))
            return "I can assist with fee analysis and payment tracking. Would you like to see collection reports or identify overdue payments?";
        
        if (message.Contains("exam") || message.Contains("result"))
            return "I can help analyze exam performance and generate insights. Would you like to see subject-wise performance or identify students needing support?";
        
        if (message.Contains("timetable"))
            return "I can suggest timetable optimizations. Would you like me to analyze conflicts or suggest better scheduling?";
        
        return "I'm your AI assistant for Smart School System. I can help with attendance analysis, fee tracking, exam insights, and timetable optimization. What would you like to know?";
    }

    private string[] GetSuggestions(string message)
    {
        message = message.ToLowerInvariant();
        
        if (message.Contains("attendance"))
            return new[] { "View attendance report", "Check low attendance students", "Generate attendance insights" };
        
        if (message.Contains("fees"))
            return new[] { "View fee collection report", "Check overdue payments", "Analyze payment trends" };
        
        if (message.Contains("exam"))
            return new[] { "View exam results", "Analyze subject performance", "Identify at-risk students" };
        
        return new[] { "View dashboard", "Generate insights", "Check predictions" };
    }
}

// DTOs
public sealed record AIChatRequest(Guid TenantId, Guid SchoolId, string Message);
public sealed record AIChatResponse(string Message, DateTime Timestamp, double Confidence, string[] Suggestions);
public sealed record AIInsightsRequest(Guid TenantId, Guid SchoolId, string InsightType);
public sealed record AIInsightsResponse(AIInsight[] Insights, DateTime GeneratedAt);
public sealed record AIPredictionsRequest(Guid TenantId, Guid SchoolId, string PredictionType);
public sealed record AIPredictionsResponse(AIPrediction[] Predictions, DateTime GeneratedAt);
public sealed record ReportCommentRequest(Guid TenantId, Guid SchoolId, string StudentName, string Subject, string? PerformanceGrade, string? WeakArea);
public sealed record TimetableRequest(Guid TenantId, Guid SchoolId, Guid? GradeId, Guid? TermId);
public sealed record TimetableSuggestion(int OptimizationScore, int ConflictsResolved, int TeacherUtilization, int RoomUtilization, string[] Suggestions, DateTime GeneratedAt);
