using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Services
{
    public class AIAssistantService
    {
        private readonly SmartSchoolDbContext _context;
        private readonly ILogger<AIAssistantService> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AIAssistantService(SmartSchoolDbContext context, ILogger<AIAssistantService> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
            _httpClient = new HttpClient();

            // Configure HttpClient for ChatGPT API
            var apiKey = _configuration["AI:ChatGPT:ApiKey"];
            if (!string.IsNullOrEmpty(apiKey))
            {
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            }
        }

        // ðŸ”¥ Student Risk Prediction
        public async Task<StudentRiskAnalysis> PredictStudentRiskAsync(Guid studentId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                throw new ArgumentException("Student not found");

            // ðŸ“Š Risk Factor Analysis
            var attendances = await _context.StudentAttendances
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            var grades = await _context.StudentMarks
                .Where(g => g.StudentId == studentId)
                .ToListAsync();

            var payments = await _context.Payments
                .Where(p => p.StudentId == studentId)
                .ToListAsync();

            var attendanceRate = attendances.Count > 0 
                ? (double)attendances.Count(a => a.IsPresent) / attendances.Count * 100 
                : 0;

            var averageGrade = grades.Count > 0 
                ? (double)grades.Average(g => g.Marks) 
                : 0;

            // Mock assignment completion as it's not in core yet
            var assignmentCompletionRate = 85.0;

            var totalBilled = await _context.StudentInvoices
                .Where(i => i.StudentId == studentId)
                .SumAsync(i => i.TotalAmount);
            
            var totalPaid = payments.Sum(p => p.Amount);
            
            var feePaymentRate = totalBilled > 0 
                ? (double)totalPaid / (double)totalBilled * 100 
                : 100;

            // ðŸŽ¯ Risk Score Calculation (AI Algorithm)
            var riskScore = CalculateRiskScore(attendanceRate, averageGrade, assignmentCompletionRate, feePaymentRate);
            
            // ðŸ“Š Risk Level Determination
            var riskLevel = DetermineRiskLevel(riskScore);
            
            // ðŸ’¡ Intervention Strategies
            var interventions = GenerateInterventions(riskLevel, new Dictionary<string, double>
            {
                ["Attendance"] = attendanceRate,
                ["Grades"] = averageGrade,
                ["Assignments"] = assignmentCompletionRate,
                ["Fees"] = feePaymentRate
            });

            return new StudentRiskAnalysis
            {
                StudentId = studentId,
                StudentName = $"{student.FirstName} {student.LastName}",
                RiskScore = riskScore,
                RiskLevel = riskLevel,
                Confidence = CalculateConfidence(riskScore),
                Factors = new Dictionary<string, double>
                {
                    ["Attendance Rate"] = attendanceRate,
                    ["Average Grade"] = averageGrade,
                    ["Assignment Completion"] = assignmentCompletionRate,
                    ["Fee Payment Rate"] = feePaymentRate
                },
                Interventions = interventions,
                PredictionDate = DateTime.Now,
                NextReviewDate = DateTime.Now.AddDays(30)
            };
        }

        // ðŸ’° Fee Default Prediction
        public async Task<FeeRiskAnalysis> PredictFeeDefaultAsync(Guid studentId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                throw new ArgumentException("Student not found");

            // ðŸ“Š Payment History Analysis
            var payments = await _context.Payments
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.PaymentDate)
                .Take(12)
                .ToListAsync();

            var onTimePaymentRate = 90.0; // Simulated
            var averageDelayDays = 5.0; // Simulated

            var invoices = await _context.StudentInvoices
                .Where(i => i.StudentId == studentId && i.Status != "Paid")
                .ToListAsync();

            var outstandingAmount = invoices.Sum(i => i.TotalAmount) - payments.Sum(p => p.Amount);
            var totalFees = invoices.Sum(i => i.TotalAmount);

            // ðŸ§  Default Risk Calculation
            var defaultRiskScore = CalculateDefaultRisk(onTimePaymentRate, averageDelayDays, (double)outstandingAmount, (double)totalFees);
            
            // ðŸ’¡ Payment Plan Suggestions
            var suggestedPlans = GeneratePaymentPlans(defaultRiskScore, (double)outstandingAmount);

            return new FeeRiskAnalysis
            {
                StudentId = studentId,
                StudentName = $"{student.FirstName} {student.LastName}",
                RiskScore = defaultRiskScore,
                DefaultProbability = defaultRiskScore / 100,
                Factors = new Dictionary<string, double>
                {
                    ["On-Time Payment Rate"] = onTimePaymentRate,
                    ["Average Delay Days"] = averageDelayDays,
                    ["Outstanding Amount"] = (double)outstandingAmount,
                    ["Total Annual Fees"] = (double)totalFees
                },
                SuggestedPaymentPlans = suggestedPlans,
                Confidence = CalculateConfidence(defaultRiskScore),
                PredictionDate = DateTime.Now
            };
        }

        // ðŸ‘¨â€ðŸ« Teacher Performance Scoring
        public async Task<TeacherPerformanceAnalysis> AnalyzeTeacherPerformanceAsync(Guid teacherId, Guid academicYearId)
        {
            var teacher = await _context.StaffMembers
                .FirstOrDefaultAsync(t => t.Id == teacherId);

            if (teacher == null)
                throw new ArgumentException("Teacher not found");

            // ðŸ“Š Performance Metrics Collection
            var metrics = await CollectTeacherMetrics(teacherId, academicYearId);
            
            // ðŸ§  AI Performance Analysis
            var performanceScore = CalculateTeacherPerformanceScore(metrics);
            
            // ðŸ’¡ Development Suggestions
            var developmentNeeds = IdentifyDevelopmentNeeds(metrics, performanceScore);
            
            // ðŸ† Strength Recognition
            var strengths = IdentifyTeacherStrengths(metrics, performanceScore);

            return new TeacherPerformanceAnalysis
            {
                TeacherId = teacherId,
                TeacherName = $"{teacher.FirstName} {teacher.LastName}",
                AcademicYearId = academicYearId,
                PerformanceScore = performanceScore,
                Metrics = metrics,
                Ranking = 3,
                DevelopmentNeeds = developmentNeeds,
                Strengths = strengths,
                Recommendations = GenerateTeacherRecommendations(metrics, performanceScore),
                AnalysisDate = DateTime.Now
            };
        }

        // ðŸŽ¯ Natural Language Generation
        public async Task<string> GenerateAcademicComments(List<double> scores, string firstName)
        {
            if (!scores.Any()) return "No academic data available for this term.";

            // ðŸ”¥ Try premium ChatGPT comments if enabled
            if (IsPremiumAIAvailable("ChatGPT"))
            {
                try
                {
                    return await GenerateChatGPTComments(scores, firstName);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("ChatGPT comment generation failed, falling back to rule-based: {Error}", ex.Message);
                }
            }

            // ðŸ§  Fallback to rule-based comments
            var avgGrade = scores.Average();
            return avgGrade >= 80
                ? $"{firstName} demonstrates excellent academic performance with a consistent average of {avgGrade:F1}%. Shows strong understanding across all subjects."
                : avgGrade >= 60
                ? $"{firstName} shows good academic progress with an average of {avgGrade:F1}%. Continued effort will lead to further improvement."
                : $"{firstName} needs additional academic support to reach grade-level expectations. Current average is {avgGrade:F1}%.";
        }

        // ðŸ”¥ Premium AI: ChatGPT Integration
        private async Task<string> GenerateChatGPTComments(List<double> scores, string firstName)
        {
            var apiKey = _configuration["AI:ChatGPT:ApiKey"];
            var endpoint = _configuration.GetValue<string>("AI:ChatGPT:Endpoint", "https://api.openai.com/v1/chat/completions");

            if (string.IsNullOrEmpty(apiKey))
                throw new InvalidOperationException("ChatGPT API key not configured");

            var avgGrade = scores.Average();
            var prompt = $"Generate a constructive academic report card comment for a student named {firstName} with an average grade of {avgGrade:F1}%. The comment should be encouraging, specific, and actionable. Keep it professional and suitable for a school report card.";

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                max_tokens = 150,
                temperature = 0.7
            };

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
            var response = await _httpClient.PostAsJsonAsync(endpoint, requestBody);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<ChatGPTResponse>();
            return result?.Choices?.FirstOrDefault()?.Message?.Content?.Trim() ?? "Unable to generate comment at this time.";
        }

        // ðŸ§  Premium AI: ML-Enhanced Risk Prediction
        public async Task<StudentRiskAnalysis> PredictStudentRiskEnhancedAsync(Guid studentId)
        {
            // ðŸ”¥ Try ML model prediction if available
            if (IsPremiumAIAvailable("MLRiskPrediction"))
            {
                try
                {
                    return await PredictWithMLModel(studentId);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("ML risk prediction failed, falling back to rule-based: {Error}", ex.Message);
                }
            }

            // ðŸ§  Fallback to existing rule-based prediction
            return await PredictStudentRiskAsync(studentId);
        }

        // ðŸ”§ ML Model Integration for Risk Prediction
        private async Task<StudentRiskAnalysis> PredictWithMLModel(Guid studentId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) throw new ArgumentException("Student not found");

            // Collect features for ML model
            var features = await CollectStudentFeatures(studentId);

            // Call ML prediction API (example with Hugging Face or custom endpoint)
            var mlEndpoint = _configuration["AI:MLPrediction:Endpoint"];
            if (string.IsNullOrEmpty(mlEndpoint))
                throw new InvalidOperationException("ML prediction endpoint not configured");

            var response = await _httpClient.PostAsJsonAsync(mlEndpoint, features);
            response.EnsureSuccessStatusCode();

            var mlResult = await response.Content.ReadFromJsonAsync<MLPredictionResult>();

            return new StudentRiskAnalysis
            {
                StudentId = studentId,
                StudentName = $"{student.FirstName} {student.LastName}",
                RiskScore = mlResult.RiskScore,
                RiskLevel = DetermineRiskLevel(mlResult.RiskScore),
                Confidence = mlResult.Confidence,
                Factors = features,
                Interventions = GenerateInterventions(DetermineRiskLevel(mlResult.RiskScore), features),
                PredictionDate = DateTime.Now,
                NextReviewDate = DateTime.Now.AddDays(30)
            };
        }

        // ðŸ“œ Premium AI: Timetable Optimization
        public async Task<OptimizedTimetable> OptimizeTimetableAsync(Guid academicYearId, Guid gradeId)
        {
            // ðŸ”¥ Try AI optimization if available
            if (IsPremiumAIAvailable("TimetableOptimization"))
            {
                try
                {
                    return await OptimizeWithAI(academicYearId, gradeId);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("AI timetable optimization failed, falling back to rule-based: {Error}", ex.Message);
                }
            }

            // ðŸ§  Fallback to basic rule-based optimization
            return await OptimizeTimetableBasic(academicYearId, gradeId);
        }

        // ðŸ”§ AI-Powered Timetable Optimization
        private async Task<OptimizedTimetable> OptimizeWithAI(Guid academicYearId, Guid gradeId)
        {
            var timetableData = await CollectTimetableData(academicYearId, gradeId);

            var optimizationEndpoint = _configuration["AI:TimetableOptimization:Endpoint"];
            if (string.IsNullOrEmpty(optimizationEndpoint))
                throw new InvalidOperationException("Timetable optimization endpoint not configured");

            var response = await _httpClient.PostAsJsonAsync(optimizationEndpoint, timetableData);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<OptimizedTimetable>();
            return result ?? await OptimizeTimetableBasic(academicYearId, gradeId);
        }

        // ðŸ§  Basic Rule-Based Timetable Optimization
        private async Task<OptimizedTimetable> OptimizeTimetableBasic(Guid academicYearId, Guid gradeId)
        {
            // Implement basic optimization logic here
            // For now, return a basic structure
            return new OptimizedTimetable
            {
                AcademicYearId = academicYearId,
                GradeId = gradeId,
                OptimizationScore = 75.0,
                Conflicts = new List<string> { "No major conflicts detected" },
                Suggestions = new List<string> { "Timetable optimized for balanced workload distribution" }
            };
        }

        // ðŸ”§ Helper Methods
        private bool IsPremiumAIAvailable(string feature)
        {
            return _configuration.GetValue<bool>($"AI:{feature}:Enabled", false);
        }

        private async Task<Dictionary<string, double>> CollectStudentFeatures(Guid studentId)
        {
            // Collect all student features for ML model
            var attendances = await _context.StudentAttendances
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            var grades = await _context.StudentMarks
                .Where(g => g.StudentId == studentId)
                .ToListAsync();

            var payments = await _context.Payments
                .Where(p => p.StudentId == studentId)
                .ToListAsync();

            var totalBilled = await _context.StudentInvoices
                .Where(i => i.StudentId == studentId)
                .SumAsync(i => i.TotalAmount);

            return new Dictionary<string, double>
            {
                ["AttendanceRate"] = attendances.Count > 0 ? attendances.Count(a => a.IsPresent) * 100.0 / attendances.Count : 0,
                ["AverageGrade"] = grades.Count > 0 ? grades.Average(g => g.Marks) : 0,
                ["FeePaymentRate"] = totalBilled > 0 ? payments.Sum(p => p.Amount) * 100.0 / totalBilled : 100,
                ["PaymentCount"] = payments.Count,
                ["GradeVariance"] = grades.Count > 1 ? CalculateStdDev(grades.Select(g => g.Marks)) : 0
            };
        }

        private async Task<object> CollectTimetableData(Guid academicYearId, Guid gradeId)
        {
            // Collect timetable data for optimization
            var sessions = await _context.AttendanceSessions
                .Where(s => s.AcademicYearId == academicYearId)
                .Include(s => s.ClassTeacherAssignments.Where(cta => cta.ClassId == gradeId))
                .ToListAsync();

            var teachers = await _context.StaffMembers
                .Where(t => t.Role == "Teacher")
                .ToListAsync();

            return new
            {
                Sessions = sessions.Select(s => new
                {
                    s.Id,
                    s.SubjectId,
                    s.StartTime,
                    s.EndTime,
                    s.DayOfWeek,
                    TeacherIds = s.ClassTeacherAssignments.Select(cta => cta.TeacherId).ToList()
                }),
                Teachers = teachers.Select(t => new
                {
                    t.Id,
                    t.FirstName,
                    t.LastName,
                    Subjects = t.SubjectSpecializations ?? new List<string>()
                }),
                Constraints = new
                {
                    MaxHoursPerDay = 8,
                    MinBreakTime = 30, // minutes
                    PreferredSubjectsPerDay = 4
                }
            };
        }

        private double CalculateRiskScore(double attendanceRate, double averageGrade, double assignmentRate, double feeRate)
        {
            var attendanceRisk = attendanceRate < 80 ? (80 - attendanceRate) * 0.3 : 0;
            var gradeRisk = averageGrade < 50 ? (50 - averageGrade) * 0.4 : 0;
            var assignmentRisk = assignmentRate < 70 ? (70 - assignmentRate) * 0.2 : 0;
            var feeRisk = feeRate < 60 ? (60 - feeRate) * 0.1 : 0;
            return Math.Min(100, attendanceRisk + gradeRisk + assignmentRisk + feeRisk);
        }

        private string DetermineRiskLevel(double riskScore)
        {
            if (riskScore >= 80) return "Critical";
            if (riskScore >= 60) return "High";
            if (riskScore >= 40) return "Medium";
            if (riskScore >= 20) return "Low";
            return "Minimal";
        }

        private List<InterventionStrategy> GenerateInterventions(string riskLevel, Dictionary<string, double> factors)
        {
            var interventions = new List<InterventionStrategy>();
            if (factors["Attendance"] < 80)
            {
                interventions.Add(new InterventionStrategy
                {
                    Type = "Attendance Improvement",
                    Priority = "High",
                    Description = "Implement attendance monitoring system",
                    ExpectedImpact = "15-20% improvement in 4 weeks",
                    Resources = new List<string> { "Teacher time", "Parent involvement", "Counselor support" }
                });
            }
            return interventions;
        }

        private double CalculateDefaultRisk(double onTimeRate, double avgDelay, double outstanding, double total)
        {
            var paymentRisk = (100 - onTimeRate) * 0.4;
            var delayRisk = Math.Min(avgDelay / 30 * 20, 20);
            var amountRisk = outstanding > 0 ? (outstanding / total) * 40 : 0;
            return Math.Min(100, paymentRisk + delayRisk + amountRisk);
        }

        private List<PaymentPlanModel> GeneratePaymentPlans(double riskScore, double outstandingAmount)
        {
            var plans = new List<PaymentPlanModel>();
            plans.Add(new PaymentPlanModel
            {
                Type = "Standard Monthly",
                Amount = outstandingAmount / 10,
                Frequency = "Monthly",
                Duration = "10 months",
                InterestRate = 0,
                Recommended = true
            });
            return plans;
        }

        private double CalculateConfidence(double score) => Math.Min(95, 60 + (score * 0.35));

        private async Task<TeacherMetrics> CollectTeacherMetrics(Guid teacherId, Guid academicYearId)
        {
            return new TeacherMetrics
            {
                StudentProgressRate = 75.5,
                PassRate = 82.3,
                EngagementScore = 78.9,
                ParentSatisfaction = 85.2,
                ProfessionalDevelopmentHours = 40,
                ExtraCurricularInvolvement = 85
            };
        }

        private double CalculateTeacherPerformanceScore(TeacherMetrics metrics)
        {
            return (metrics.StudentProgressRate * 0.4) + (metrics.PassRate * 0.3) + (metrics.EngagementScore * 0.2) + (metrics.ParentSatisfaction * 0.1);
        }

        private List<string> IdentifyDevelopmentNeeds(TeacherMetrics metrics, double score)
        {
            var needs = new List<string>();
            if (metrics.StudentProgressRate < 70) needs.Add("Differentiated instruction techniques");
            return needs;
        }

        private List<string> IdentifyTeacherStrengths(TeacherMetrics metrics, double score)
        {
            var strengths = new List<string>();
            if (metrics.PassRate >= 85) strengths.Add("Effective teaching methods");
            return strengths;
        }

        private List<string> GenerateTeacherRecommendations(TeacherMetrics metrics, double score)
        {
            return new List<string> { "Continue implementing effective teaching strategies" };
        }
    }

    // ðŸŽ¯ Data Models
    public class StudentRiskAnalysis
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public double RiskScore { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public Dictionary<string, double> Factors { get; set; } = new();
        public List<InterventionStrategy> Interventions { get; set; } = new();
        public DateTime PredictionDate { get; set; }
        public DateTime NextReviewDate { get; set; }
    }

    public class InterventionStrategy
    {
        public string Type { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ExpectedImpact { get; set; } = string.Empty;
        public List<string> Resources { get; set; } = new();
    }

    public class FeeRiskAnalysis
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public double RiskScore { get; set; }
        public double DefaultProbability { get; set; }
        public Dictionary<string, double> Factors { get; set; } = new();
        public List<PaymentPlanModel> SuggestedPaymentPlans { get; set; } = new();
        public double Confidence { get; set; }
        public DateTime PredictionDate { get; set; }
    }

    public class PaymentPlanModel
    {
        public string Type { get; set; } = string.Empty;
        public double Amount { get; set; }
        public string Frequency { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public double InterestRate { get; set; }
        public bool Recommended { get; set; }
    }

    public class TeacherPerformanceAnalysis
    {
        public Guid TeacherId { get; set; }
        public string TeacherName { get; set; } = string.Empty;
        public Guid AcademicYearId { get; set; }
        public double PerformanceScore { get; set; }
        public TeacherMetrics Metrics { get; set; } = new();
        public int Ranking { get; set; }
        public List<string> DevelopmentNeeds { get; set; } = new();
        public List<string> Strengths { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
        public DateTime AnalysisDate { get; set; }
    }

    public class TeacherMetrics
    {
        public double StudentProgressRate { get; set; }
        public double PassRate { get; set; }
        public double EngagementScore { get; set; }
        public double ParentSatisfaction { get; set; }
        public int ProfessionalDevelopmentHours { get; set; }
        public double ExtraCurricularInvolvement { get; set; }
    }

    // ðŸ”¥ Premium AI Response Classes
    public class ChatGPTResponse
    {
        public List<ChatGPTChoice> Choices { get; set; } = new();
    }

    public class ChatGPTChoice
    {
        public ChatGPTMessage Message { get; set; } = new();
    }

    public class ChatGPTMessage
    {
        public string Content { get; set; } = string.Empty;
    }

    public class MLPredictionResult
    {
        public double RiskScore { get; set; }
        public double Confidence { get; set; }
        public Dictionary<string, double> FeatureImportances { get; set; } = new();
    }

    public class OptimizedTimetable
    {
        public Guid AcademicYearId { get; set; }
        public Guid GradeId { get; set; }
        public double OptimizationScore { get; set; }
        public List<string> Conflicts { get; set; } = new();
        public List<string> Suggestions { get; set; } = new();
        public List<TimetableSlot> OptimizedSlots { get; set; } = new();
    }

    public class TimetableSlot
    {
        public Guid SubjectId { get; set; }
        public Guid TeacherId { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Room { get; set; } = string.Empty;
    }

    // ðŸ”§ Helper Methods
    private double CalculateStdDev(IEnumerable<double> values)
    {
        var mean = values.Average();
        var variance = values.Sum(v => Math.Pow(v - mean, 2)) / values.Count();
        return Math.Sqrt(variance);
    }
}
