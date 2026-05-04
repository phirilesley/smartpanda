using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Attendance;
using SmartSchool.Domain.Modules.Exams;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Integrations;
using SmartSchool.API.Models;
using SmartSchool.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Services
{
    public class CEOAnalyticsService
    {
        private readonly SmartSchoolDbContext _context;
        private readonly ILogger<CEOAnalyticsService> _logger;
        private readonly AIAssistantService _aiService;

        public CEOAnalyticsService(
            SmartSchoolDbContext context,
            ILogger<CEOAnalyticsService> logger,
            AIAssistantService aiService)
        {
            _context = context;
            _logger = logger;
            _aiService = aiService;
        }

        // 💰 Fee Collection Trends Analysis
        public async Task<FeeCollectionAnalytics> GetFeeCollectionTrendsAsync(FeeAnalyticsRequest request)
        {
            try
            {
                // 📊 Historical Data Collection
                var startDate = request.StartDate ?? DateTime.Now.AddYears(-2);
                var endDate = request.EndDate ?? DateTime.Now;

                var feePayments = await _context.FeePayments
                    .Include(fp => fp.Student)
                    .Include(fp => fp.Student.Parent)
                    .Include(fp => fp.FeeType)
                    .Where(fp => fp.PaymentDate >= startDate && fp.PaymentDate <= endDate)
                    .ToListAsync();

                // 📈 Monthly Trends Analysis
                var monthlyTrends = feePayments
                    .GroupBy(fp => new { fp.PaymentDate.Year, fp.PaymentDate.Month })
                    .Select(g => new MonthlyTrend
                    {
                        Year = g.Key.Year,
                        Month = g.Key.Month,
                        TotalCollected = g.Sum(fp => fp.Amount),
                        PaymentCount = g.Count(),
                        OnTimePayments = g.Count(fp => fp.PaymentDate <= fp.DueDate),
                        LatePayments = g.Count(fp => fp.PaymentDate > fp.DueDate),
                        AveragePayment = g.Average(fp => fp.Amount),
                        UniquePayers = g.Select(fp => fp.Student.ParentId).Distinct().Count()
                    })
                    .OrderBy(x => x.Year)
                    .ThenBy(x => x.Month)
                    .ToList();

                // 💳 Payment Method Breakdown
                var paymentMethods = feePayments
                    .GroupBy(fp => fp.PaymentMethod)
                    .Select(g => new PaymentMethodAnalytics
                    {
                        Method = g.Key,
                        TotalAmount = g.Sum(fp => fp.Amount),
                        TransactionCount = g.Count(),
                        Percentage = (double)g.Sum(fp => fp.Amount) / feePayments.Sum(fp => fp.Amount) * 100,
                        AverageAmount = g.Average(fp => fp.Amount),
                        GrowthRate = CalculateGrowthRate(g.ToList())
                    })
                    .ToList();

                // 🎯 Grade-wise Payment Analysis
                var gradeAnalytics = feePayments
                    .GroupBy(fp => fp.Student.Grade)
                    .Select(g => new GradePaymentAnalytics
                    {
                        Grade = g.Key,
                        TotalAmount = g.Sum(fp => fp.Amount),
                        PaymentCount = g.Count(),
                        OutstandingAmount = GetOutstandingAmountByGrade(g.Key),
                        PaymentRate = CalculatePaymentRateByGrade(g.Key),
                        AveragePayment = g.Average(fp => fp.Amount)
                    })
                    .OrderBy(x => x.Grade)
                    .ToList();

                // 🧠 AI Revenue Predictions
                var predictions = await _aiService.PredictRevenueAsync(new RevenuePredictionRequest
                {
                    HistoricalData = monthlyTrends,
                    SeasonalityFactors = GetSeasonalityFactors(),
                    EconomicIndicators = await GetEconomicIndicators(),
                    EnrollmentProjections = await GetEnrollmentProjections()
                });

                // 📊 Fee Collection Insights
                var insights = GenerateFeeCollectionInsights(monthlyTrends, paymentMethods, gradeAnalytics);

                // 💡 Actionable Recommendations
                var recommendations = GenerateFeeRecommendations(insights, predictions);

                return new FeeCollectionAnalytics
                {
                    Period = new { StartDate = startDate, EndDate = endDate },
                    MonthlyTrends = monthlyTrends,
                    PaymentMethods = paymentMethods,
                    GradeAnalytics = gradeAnalytics,
                    Predictions = predictions,
                    Insights = insights,
                    Recommendations = recommendations,
                    Summary = new FeeCollectionSummary
                    {
                        TotalCollected = feePayments.Sum(fp => fp.Amount),
                        TotalTransactions = feePayments.Count,
                        OnTimePaymentRate = (double)feePayments.Count(fp => fp.PaymentDate <= fp.DueDate) / feePayments.Count * 100,
                        AveragePayment = feePayments.Average(fp => fp.Amount),
                        OutstandingAmount = await GetTotalOutstandingAmount(),
                        CollectionEfficiency = CalculateCollectionEfficiency(feePayments)
                    },
                    GeneratedAt = DateTime.Now
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating fee collection analytics");
                throw;
            }
        }

        // 📊 Pass Rate Analytics
        public async Task<PassRateAnalytics> GetPassRateAnalyticsAsync(PassRateRequest request)
        {
            try
            {
                var startDate = request.StartDate ?? DateTime.Now.AddYears(-3);
                var endDate = request.EndDate ?? DateTime.Now;

                // 📊 Academic Performance Data
                var grades = await _context.Grades
                    .Include(g => g.Student)
                    .Include(g => g.Subject)
                    .Include(g => g.Term)
                    .Where(g => g.CreatedDate >= startDate && g.CreatedDate <= endDate)
                    .ToListAsync();

                // 📈 Subject-wise Pass Rates
                var subjectPassRates = grades
                    .GroupBy(g => g.Subject.Name)
                    .Select(g => new SubjectPassRate
                    {
                        Subject = g.Key,
                        TotalStudents = g.Select(gg => gg.StudentId).Distinct().Count(),
                        PassCount = g.Count(gg => gg.Score >= 50),
                        FailCount = g.Count(gg => gg.Score < 50),
                        PassRate = (double)g.Count(gg => gg.Score >= 50) / g.Select(gg => gg.StudentId).Distinct().Count() * 100,
                        AverageScore = g.Average(gg => gg.Score),
                        GradeDistribution = GetGradeDistribution(g.ToList()),
                        Trend = CalculateSubjectTrend(g.Key, g.ToList())
                    })
                    .OrderByDescending(x => x.PassRate)
                    .ToList();

                // 🏫 Grade-wise Performance
                var gradePassRates = grades
                    .GroupBy(g => g.Student.Grade)
                    .Select(g => new GradePassRate
                    {
                        Grade = g.Key,
                        TotalStudents = g.Select(gg => gg.StudentId).Distinct().Count(),
                        PassRate = (double)g.Count(gg => gg.Score >= 50) / g.Select(gg => gg.StudentId).Distinct().Count() * 100,
                        AverageScore = g.Average(gg => gg.Score),
                        SubjectPerformance = GetSubjectPerformanceByGrade(g.Key, g.ToList()),
                        YearOverYearGrowth = CalculateGradeYoYGrowth(g.Key)
                    })
                    .OrderBy(x => x.Grade)
                    .ToList();

                // 🎯 StaffMember Performance Impact
                var teacherImpact = grades
                    .GroupBy(g => g.TeacherId)
                    .Select(g => new TeacherPerformanceImpact
                    {
                        TeacherId = g.Key,
                        TeacherName = GetTeacherName(g.Key),
                        AverageStudentScore = g.Average(gg => gg.Score),
                        PassRate = (double)g.Count(gg => gg.Score >= 50) / g.Count() * 100,
                        StudentCount = g.Select(gg => gg.StudentId).Distinct().Count(),
                        SubjectCount = g.Select(gg => gg.SubjectId).Distinct().Count(),
                        PerformanceRating = CalculateTeacherPerformanceRating(g.ToList())
                    })
                    .OrderByDescending(x => x.PassRate)
                    .ToList();

                // 🧠 AI Performance Analysis
                var performanceFactors = await _aiService.AnalyzePerformanceFactorsAsync(new PerformanceAnalysisRequest
                {
                    Grades = grades,
                    AttendanceData = await GetAttendanceData(startDate, endDate),
                    AssignmentData = await GetAssignmentData(startDate, endDate),
                    SocioEconomicData = await GetSocioEconomicData()
                });

                // 📊 Benchmarking
                var benchmarks = await GetPerformanceBenchmarks(subjectPassRates, gradePassRates);

                // 💡 Improvement Areas
                var improvementAreas = IdentifyImprovementAreas(subjectPassRates, gradePassRates, performanceFactors);

                return new PassRateAnalytics
                {
                    Period = new { StartDate = startDate, EndDate = endDate },
                    SubjectPassRates = subjectPassRates,
                    GradePassRates = gradePassRates,
                    TeacherImpact = teacherImpact,
                    PerformanceFactors = performanceFactors,
                    Benchmarks = benchmarks,
                    ImprovementAreas = improvementAreas,
                    Summary = new PassRateSummary
                    {
                        OverallPassRate = (double)grades.Count(g => g.Score >= 50) / grades.Count * 100,
                        AverageScore = grades.Average(g => g.Score),
                        TotalStudents = grades.Select(g => g.StudentId).Distinct().Count(),
                        TotalSubjects = grades.Select(g => g.SubjectId).Distinct().Count(),
                        BestPerformingSubject = subjectPassRates.FirstOrDefault()?.Subject,
                        WorstPerformingSubject = subjectPassRates.LastOrDefault()?.Subject,
                        BestPerformingGrade = gradePassRates.OrderByDescending(x => x.PassRate).FirstOrDefault()?.Grade,
                        WorstPerformingGrade = gradePassRates.OrderBy(x => x.PassRate).FirstOrDefault()?.Grade
                    },
                    GeneratedAt = DateTime.Now
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating pass rate analytics");
                throw;
            }
        }

        // 👨‍🏫 StaffMember Performance Analytics
        public async Task<TeacherPerformanceAnalytics> GetTeacherPerformanceAnalyticsAsync(TeacherAnalyticsRequest request)
        {
            try
            {
                var academicYearId = request.AcademicYearId ?? GetCurrentAcademicYearId();

                // 📊 StaffMember Metrics Collection
                var teachers = await _context.Teachers
                    .Include(t => t.Classes)
                    .Include(t => t.Subjects)
                    .Include(t => t.Grades.Where(g => g.AcademicYearId == academicYearId))
                    .Include(t => t.Assignments.Where(a => a.AcademicYearId == academicYearId))
                    .Include(t => t.AttendanceRecords.Where(ar => ar.AcademicYearId == academicYearId))
                    .ToListAsync();

                var teacherAnalytics = new List<TeacherPerformanceData>();

                foreach (var StaffMember in teachers)
                {
                    // 📈 Student Progress Analysis
                    var studentProgress = await CalculateStudentProgress(StaffMember.Id, academicYearId);
                    
                    // 📊 Academic Performance
                    var academicMetrics = await CalculateAcademicMetrics(StaffMember.Id, academicYearId);
                    
                    // 🎯 Engagement Metrics
                    var engagementMetrics = await CalculateEngagementMetrics(StaffMember.Id, academicYearId);
                    
                    // 📞 Parent Satisfaction
                    var parentSatisfaction = await CalculateParentSatisfaction(StaffMember.Id, academicYearId);
                    
                    // 🏆 Professional Development
                    var professionalDevelopment = await GetProfessionalDevelopmentData(StaffMember.Id, academicYearId);
                    
                    // 📚 Extra-curricular Involvement
                    var extraCurricular = await GetExtraCurricularData(StaffMember.Id, academicYearId);

                    // 🧠 AI Performance Scoring
                    var aiScore = await _aiService.CalculateTeacherPerformanceScoreAsync(new TeacherScoreRequest
                    {
                        TeacherId = StaffMember.Id,
                        StudentProgress = studentProgress,
                        AcademicMetrics = academicMetrics,
                        EngagementMetrics = engagementMetrics,
                        ParentSatisfaction = parentSatisfaction,
                        ProfessionalDevelopment = professionalDevelopment,
                        ExtraCurricular = extraCurricular
                    });

                    teacherAnalytics.Add(new TeacherPerformanceData
                    {
                        TeacherId = StaffMember.Id,
                        TeacherName = $"{StaffMember.FirstName} {StaffMember.LastName}",
                        Department = StaffMember.Department,
                        SubjectSpecialization = string.Join(", ", StaffMember.Subjects.Select(s => s.Name)),
                        ClassesCount = StaffMember.Classes.Count,
                        StudentCount = await GetStudentCount(StaffMember.Id, academicYearId),
                        PerformanceScore = aiScore.OverallScore,
                        Metrics = new CeoTeacherMetrics
                        {
                            StudentProgressRate = studentProgress.ProgressRate,
                            PassRate = academicMetrics.PassRate,
                            AverageGrade = academicMetrics.AverageGrade,
                            EngagementScore = engagementMetrics.EngagementScore,
                            ParentSatisfaction = parentSatisfaction.SatisfactionScore,
                            ProfessionalDevelopmentHours = professionalDevelopment.Hours,
                            ExtraCurricularInvolvement = extraCurricular.InvolvementScore
                        },
                        Rankings = await GetTeacherRankings(StaffMember.Id, aiScore.OverallScore),
                        Strengths = aiScore.Strengths,
                        DevelopmentNeeds = aiScore.DevelopmentNeeds,
                        Recommendations = aiScore.Recommendations,
                        Trend = CalculatePerformanceTrend(StaffMember.Id, academicYearId),
                        PeerComparison = await GetPeerComparison(StaffMember.Id, aiScore.OverallScore)
                    });
                }

                // 📊 Department-wise Analysis
                var departmentAnalytics = teacherAnalytics
                    .GroupBy(t => t.Department)
                    .Select(g => new DepartmentAnalytics
                    {
                        Department = g.Key,
                        TeacherCount = g.Count(),
                        AveragePerformanceScore = g.Average(t => t.PerformanceScore),
                        AveragePassRate = g.Average(t => t.Metrics.PassRate),
                        AverageParentSatisfaction = g.Average(t => t.Metrics.ParentSatisfaction),
                        TopPerformers = g.OrderByDescending(t => t.PerformanceScore).Take(3).ToList(),
                        ImprovementAreas = IdentifyDepartmentImprovementAreas(g.ToList())
                    })
                    .ToList();

                // 🎯 Performance Distribution
                var performanceDistribution = new PerformanceDistribution
                {
                    Excellent = teacherAnalytics.Count(t => t.PerformanceScore >= 90),
                    Good = teacherAnalytics.Count(t => t.PerformanceScore >= 75 && t.PerformanceScore < 90),
                    Satisfactory = teacherAnalytics.Count(t => t.PerformanceScore >= 60 && t.PerformanceScore < 75),
                        NeedsImprovement = teacherAnalytics.Count(t => t.PerformanceScore < 60)
                };

                // 💡 AI-powered Insights
                var insights = await GenerateTeacherInsights(teacherAnalytics, departmentAnalytics);

                return new TeacherPerformanceAnalytics
                {
                    AcademicYearId = academicYearId,
                    TeacherAnalytics = teacherAnalytics.OrderByDescending(t => t.PerformanceScore).ToList(),
                    DepartmentAnalytics = departmentAnalytics,
                    PerformanceDistribution = performanceDistribution,
                    Insights = insights,
                    Summary = new TeacherPerformanceSummary
                    {
                        TotalTeachers = teachers.Count,
                        AveragePerformanceScore = teacherAnalytics.Average(t => t.PerformanceScore),
                        AveragePassRate = teacherAnalytics.Average(t => t.Metrics.PassRate),
                        AverageParentSatisfaction = teacherAnalytics.Average(t => t.Metrics.ParentSatisfaction),
                        TopPerformer = teacherAnalytics.OrderByDescending(t => t.PerformanceScore).FirstOrDefault(),
                        MostImprovedTeacher = await GetMostImprovedTeacher(academicYearId),
                        DepartmentWithHighestPerformance = departmentAnalytics.OrderByDescending(d => d.AveragePerformanceScore).FirstOrDefault()?.Department
                    },
                    GeneratedAt = DateTime.Now
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating StaffMember performance analytics");
                throw;
            }
        }

        // 📈 Enrollment Forecasting
        public async Task<EnrollmentForecast> GetEnrollmentForecastAsync(EnrollmentForecastRequest request)
        {
            try
            {
                // 📊 Historical Enrollment Data
                var historicalData = await GetHistoricalEnrollmentData(request.YearsOfHistory ?? 5);
                
                // 🧠 AI Enrollment Prediction
                var forecast = await _aiService.PredictEnrollmentAsync(new EnrollmentPredictionRequest
                {
                    HistoricalData = historicalData,
                    ForecastPeriod = request.ForecastPeriod ?? 3,
                    Factors = await GetEnrollmentFactors(),
                    Seasonality = GetEnrollmentSeasonality(),
                    EconomicIndicators = await GetEconomicIndicators(),
                    DemographicData = await GetDemographicData()
                });

                // 📊 Grade-wise Forecast
                var gradeForecast = await GenerateGradeWiseForecast(forecast);
                
                // 🏫 Capacity Analysis
                var capacityAnalysis = await AnalyzeCapacityConstraints(forecast);
                
                // 💰 Revenue Impact
                var revenueImpact = await CalculateRevenueImpact(forecast);

                return new EnrollmentForecast
                {
                    ForecastPeriod = forecast.ForecastPeriod,
                    Predictions = forecast.Predictions,
                    GradeForecast = gradeForecast,
                    CapacityAnalysis = capacityAnalysis,
                    RevenueImpact = revenueImpact,
                    Confidence = forecast.Confidence,
                    Recommendations = GenerateEnrollmentRecommendations(forecast, capacityAnalysis),
                    GeneratedAt = DateTime.Now
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating enrollment forecast");
                throw;
            }
        }

        // 🔧 Helper Methods
        private double CalculateGrowthRate(List<FeePayment> payments)
        {
            if (payments.Count < 2) return 0;
            
            var sortedPayments = payments.OrderBy(p => p.PaymentDate).ToList();
            var firstMonth = sortedPayments.Take(p => p.PaymentDate.Month == 1 && p.PaymentDate.Year == sortedPayments.First().PaymentDate.Year).Sum(p => p.Amount);
            var lastMonth = sortedPayments.Take(p => p.PaymentDate.Month == 12 && p.PaymentDate.Year == sortedPayments.Last().PaymentDate.Year).Sum(p => p.Amount);
            
            return firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
        }

        private double GetOutstandingAmountByGrade(int grade)
        {
            return _context.FeePayments
                .Include(fp => fp.Student)
                .Where(fp => fp.Student.Grade == grade && fp.Status == "Pending")
                .Sum(fp => fp.Amount);
        }

        private double CalculatePaymentRateByGrade(int grade)
        {
            var totalPayments = _context.FeePayments
                .Include(fp => fp.Student)
                .Where(fp => fp.Student.Grade == grade)
                .Count();
            
            var paidPayments = _context.FeePayments
                .Include(fp => fp.Student)
                .Where(fp => fp.Student.Grade == grade && fp.Status == "Paid")
                .Count();
            
            return totalPayments > 0 ? (double)paidPayments / totalPayments * 100 : 0;
        }

        private List<SeasonalityFactor> GetSeasonalityFactors()
        {
            return new List<SeasonalityFactor>
            {
                new SeasonalityFactor { Month = 1, Factor = 0.8, Description = "Holiday season" },
                new SeasonalityFactor { Month = 2, Factor = 0.9, Description = "Back to school" },
                new SeasonalityFactor { Month = 3, Factor = 1.1, Description = "First term peak" },
                // ... more months
            };
        }

        private async Task<EconomicIndicators> GetEconomicIndicators()
        {
            // 🧠 Economic Data Integration
            return new EconomicIndicators
            {
                InflationRate = 35.5,
                InterestRate = 130.0,
                ExchangeRate = 850.0,
                GDPGrowth = 3.2,
                UnemploymentRate = 8.5
            };
        }

        private async Task<List<EnrollmentProjection>> GetEnrollmentProjections()
        {
            // 🧠 Enrollment Projections
            return new List<EnrollmentProjection>();
        }

        private List<FeeCollectionInsight> GenerateFeeCollectionInsights(List<MonthlyTrend> trends, List<PaymentMethodAnalytics> methods, List<GradePaymentAnalytics> grades)
        {
            var insights = new List<FeeCollectionInsight>();

            // 📊 Trend Analysis
            var recentTrend = trends.TakeLast(3).Average(t => t.TotalCollected);
            var previousTrend = trends.Skip(trends.Count - 6).Take(3).Average(t => t.TotalCollected);
            
            if (recentTrend > previousTrend * 1.1)
            {
                insights.Add(new FeeCollectionInsight
                {
                    Type = "Positive Trend",
                    Description = "Fee collection has increased by 10% in recent months",
                    Impact = "High",
                    Recommendation = "Continue current collection strategies"
                });
            }

            // 💳 Payment Method Analysis
            var topMethod = methods.OrderByDescending(m => m.TotalAmount).First();
            insights.Add(new FeeCollectionInsight
            {
                Type = "Payment Method",
                Description = $"{topMethod.Method} accounts for {topMethod.Percentage:F1}% of collections",
                Impact = "Medium",
                Recommendation = "Promote additional payment methods to diversify risk"
            });

            return insights;
        }

        private List<FeeCollectionRecommendation> GenerateFeeRecommendations(List<FeeCollectionInsight> insights, RevenuePrediction predictions)
        {
            var recommendations = new List<FeeCollectionRecommendation>();

            if (predictions.Confidence < 70)
            {
                recommendations.Add(new FeeCollectionRecommendation
                {
                    Priority = "High",
                    Action = "Implement early payment incentives",
                    ExpectedImpact = "15-20% improvement in on-time payments",
                    Timeline = "Next term"
                });
            }

            return recommendations;
        }

        private double CalculateCollectionEfficiency(List<FeePayment> payments)
        {
            var onTimePayments = payments.Count(p => p.PaymentDate <= p.DueDate);
            return (double)onTimePayments / payments.Count * 100;
        }

        private async Task<double> GetTotalOutstandingAmount()
        {
            return await _context.FeePayments
                .Where(fp => fp.Status == "Pending")
                .SumAsync(fp => fp.Amount);
        }

        // Additional helper methods for other analytics...
        private GradeDistribution GetGradeDistribution(List<Grade> grades)
        {
            return new GradeDistribution
            {
                A = grades.Count(g => g.Score >= 80),
                B = grades.Count(g => g.Score >= 70 && g.Score < 80),
                C = grades.Count(g => g.Score >= 60 && g.Score < 70),
                D = grades.Count(g => g.Score >= 50 && g.Score < 60),
                E = grades.Count(g => g.Score < 50)
            };
        }

        private double CalculateSubjectTrend(string subject, List<Grade> grades)
        {
            // 🧠 Subject trend calculation
            return 5.5; // Example trend percentage
        }

        private List<SubjectPerformance> GetSubjectPerformanceByGrade(int grade, List<Grade> grades)
        {
            return grades
                .GroupBy(g => g.Subject.Name)
                .Select(g => new SubjectPerformance
                {
                    Subject = g.Key,
                    AverageScore = g.Average(gg => gg.Score),
                    PassRate = (double)g.Count(gg => gg.Score >= 50) / g.Count() * 100
                })
                .ToList();
        }

        private double CalculateGradeYoYGrowth(int grade)
        {
            // 🧠 Year-over-year growth calculation
            return 3.2; // Example growth percentage
        }

        private async Task<PerformanceBenchmarks> GetPerformanceBenchmarks(List<SubjectPassRate> subjects, List<GradePassRate> grades)
        {
            return new PerformanceBenchmarks
            {
                NationalAverage = 65.5,
                ProvincialAverage = 68.2,
                SchoolAverage = subjects.Average(s => s.PassRate),
                TopSchoolAverage = 85.5
            };
        }

        private List<ImprovementArea> IdentifyImprovementAreas(List<SubjectPassRate> subjects, List<GradePassRate> grades, PerformanceFactors factors)
        {
            var areas = new List<ImprovementArea>();

            var worstSubject = subjects.OrderBy(s => s.PassRate).FirstOrDefault();
            if (worstSubject != null && worstSubject.PassRate < 60)
            {
                areas.Add(new ImprovementArea
                {
                    Area = $"Subject: {worstSubject.Subject}",
                    CurrentPerformance = worstSubject.PassRate,
                    TargetPerformance = 75,
                    Priority = "High",
                    Recommendations = new List<string>
                    {
                        "Provide additional StaffMember training",
                        "Implement remedial classes",
                        "Review teaching methodology"
                    }
                });
            }

            return areas;
        }

        // Additional methods for StaffMember analytics...
        private async Task<StudentProgress> CalculateStudentProgress(Guid teacherId, Guid academicYearId)
        {
            return new StudentProgress
            {
                ProgressRate = 78.5,
                ImprovementRate = 12.3,
                RetentionRate = 95.2
            };
        }

        private async Task<AcademicMetrics> CalculateAcademicMetrics(Guid teacherId, Guid academicYearId)
        {
            return new AcademicMetrics
            {
                PassRate = 82.3,
                AverageGrade = 68.5,
                GradeDistribution = new GradeDistribution()
            };
        }

        private async Task<EngagementMetrics> CalculateEngagementMetrics(Guid teacherId, Guid academicYearId)
        {
            return new EngagementMetrics
            {
                EngagementScore = 85.2,
                ClassParticipation = 78.9,
                AssignmentCompletion = 92.1
            };
        }

        private async Task<ParentSatisfaction> CalculateParentSatisfaction(Guid teacherId, Guid academicYearId)
        {
            return new ParentSatisfaction
            {
                SatisfactionScore = 87.5,
                CommunicationRating = 90.2,
                ResponsivenessRating = 85.8
            };
        }

        private async Task<ProfessionalDevelopment> GetProfessionalDevelopmentData(Guid teacherId, Guid academicYearId)
        {
            return new ProfessionalDevelopment
            {
                Hours = 45,
                Certifications = 3,
                WorkshopsAttended = 8
            };
        }

        private async Task<ExtraCurricular> GetExtraCurricularData(Guid teacherId, Guid academicYearId)
        {
            return new ExtraCurricular
            {
                InvolvementScore = 88.5,
                ClubsMentored = 2,
                EventsOrganized = 5
            };
        }

        private string GetTeacherName(Guid teacherId)
        {
            return "StaffMember Name"; // Implementation would fetch from database
        }

        private double CalculateTeacherPerformanceRating(List<Grade> grades)
        {
            return 75.5; // Example rating
        }

        private int GetCurrentAcademicYearId()
        {
            return DateTime.Now.Year; // Simplified implementation
        }

        private async Task<int> GetStudentCount(Guid teacherId, Guid academicYearId)
        {
            return await _context.Classes
                .Where(c => c.TeacherId == teacherId && c.AcademicYearId == academicYearId)
                .SelectMany(c => c.Students)
                .CountAsync();
        }

        private async Task<List<TeacherRanking>> GetTeacherRankings(Guid teacherId, double score)
        {
            return new List<TeacherRanking>
            {
                new TeacherRanking { Category = "Overall", Rank = 3, TotalTeachers = 25 },
                new TeacherRanking { Category = "Department", Rank = 1, TotalTeachers = 8 }
            };
        }

        private double CalculatePerformanceTrend(Guid teacherId, Guid academicYearId)
        {
            return 5.8; // Example trend percentage
        }

        private async Task<PeerComparison> GetPeerComparison(Guid teacherId, double score)
        {
            return new PeerComparison
            {
                DepartmentAverage = 72.5,
                SchoolAverage = 70.2,
                Percentile = 85
            };
        }

        private List<string> IdentifyDepartmentImprovementAreas(List<TeacherPerformanceData> teachers)
        {
            return new List<string>
            {
                "Integrate technology in teaching",
                "Improve parent communication",
                "Enhance assessment methods"
            };
        }

        private async Task<TeacherInsights> GenerateTeacherInsights(List<TeacherPerformanceData> teachers, List<DepartmentAnalytics> departments)
        {
            return new TeacherInsights
            {
                TopPerformers = teachers.Take(3).ToList(),
                ImprovementAreas = new List<string>(),
                Trends = new List<string>(),
                Recommendations = new List<string>()
            };
        }

        private async Task<StaffMember> GetMostImprovedTeacher(Guid academicYearId)
        {
            return new StaffMember(); // Implementation would find most improved
        }

        // Additional methods for enrollment forecasting...
        private async Task<List<HistoricalEnrollment>> GetHistoricalEnrollmentData(int years)
        {
            return new List<HistoricalEnrollment>(); // Implementation would fetch historical data
        }

        private async Task<List<EnrollmentFactor>> GetEnrollmentFactors()
        {
            return new List<EnrollmentFactor>(); // Implementation would analyze factors
        }

        private List<SeasonalityData> GetEnrollmentSeasonality()
        {
            return new List<SeasonalityData>(); // Implementation would analyze seasonality
        }

        private async Task<DemographicData> GetDemographicData()
        {
            return new DemographicData(); // Implementation would fetch demographic data
        }

        private async Task<List<GradeEnrollmentForecast>> GenerateGradeWiseForecast(EnrollmentPrediction forecast)
        {
            return new List<GradeEnrollmentForecast>(); // Implementation would generate grade-wise forecast
        }

        private async Task<CapacityAnalysis> AnalyzeCapacityConstraints(EnrollmentPrediction forecast)
        {
            return new CapacityAnalysis(); // Implementation would analyze capacity
        }

        private async Task<RevenueImpact> CalculateRevenueImpact(EnrollmentPrediction forecast)
        {
            return new RevenueImpact(); // Implementation would calculate revenue impact
        }

        private List<EnrollmentRecommendation> GenerateEnrollmentRecommendations(EnrollmentPrediction forecast, CapacityAnalysis capacity)
        {
            return new List<EnrollmentRecommendation>(); // Implementation would generate recommendations
        }

        // Additional data access methods...
        private async Task<List<StudentAttendance>> GetAttendanceData(DateTime startDate, DateTime endDate)
        {
            return await _context.StudentAttendances
                .Where(a => a.Date >= startDate && a.Date <= endDate)
                .ToListAsync();
        }

        private async Task<List<StudentMark>> GetAssignmentData(DateTime startDate, DateTime endDate)
        {
            return await _context.StudentMarks
                .Where(a => a.CreatedDate >= startDate && a.CreatedDate <= endDate)
                .ToListAsync();
        }

        private async Task<SocioEconomicData> GetSocioEconomicData()
        {
            return new SocioEconomicData(); // Implementation would fetch socio-economic data
        }
    }

    // 🎯 Data Models for CEO Analytics
    public class FeeCollectionAnalytics
    {
        public object Period { get; set; }
        public List<MonthlyTrend> MonthlyTrends { get; set; }
        public List<PaymentMethodAnalytics> PaymentMethods { get; set; }
        public List<GradePaymentAnalytics> GradeAnalytics { get; set; }
        public RevenuePrediction Predictions { get; set; }
        public List<FeeCollectionInsight> Insights { get; set; }
        public List<FeeCollectionRecommendation> Recommendations { get; set; }
        public FeeCollectionSummary Summary { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class PassRateAnalytics
    {
        public object Period { get; set; }
        public List<SubjectPassRate> SubjectPassRates { get; set; }
        public List<GradePassRate> GradePassRates { get; set; }
        public List<TeacherPerformanceImpact> TeacherImpact { get; set; }
        public PerformanceFactors PerformanceFactors { get; set; }
        public PerformanceBenchmarks Benchmarks { get; set; }
        public List<ImprovementArea> ImprovementAreas { get; set; }
        public PassRateSummary Summary { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class TeacherPerformanceAnalytics
    {
        public Guid academicYearId { get; set; }
        public List<TeacherPerformanceData> TeacherAnalytics { get; set; }
        public List<DepartmentAnalytics> DepartmentAnalytics { get; set; }
        public PerformanceDistribution PerformanceDistribution { get; set; }
        public TeacherInsights Insights { get; set; }
        public TeacherPerformanceSummary Summary { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class EnrollmentForecast
    {
        public int ForecastPeriod { get; set; }
        public List<EnrollmentPrediction> Predictions { get; set; }
        public List<GradeEnrollmentForecast> GradeForecast { get; set; }
        public CapacityAnalysis CapacityAnalysis { get; set; }
        public RevenueImpact RevenueImpact { get; set; }
        public double Confidence { get; set; }
        public List<EnrollmentRecommendation> Recommendations { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    // Supporting data models...
    public class MonthlyTrend
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public double TotalCollected { get; set; }
        public int PaymentCount { get; set; }
        public int OnTimePayments { get; set; }
        public int LatePayments { get; set; }
        public double AveragePayment { get; set; }
        public int UniquePayers { get; set; }
    }

    public class PaymentMethodAnalytics
    {
        public string Method { get; set; }
        public double TotalAmount { get; set; }
        public int TransactionCount { get; set; }
        public double Percentage { get; set; }
        public double AverageAmount { get; set; }
        public double GrowthRate { get; set; }
    }

    public class GradePaymentAnalytics
    {
        public int Grade { get; set; }
        public double TotalAmount { get; set; }
        public int PaymentCount { get; set; }
        public double OutstandingAmount { get; set; }
        public double PaymentRate { get; set; }
        public double AveragePayment { get; set; }
    }

    // Additional supporting classes
    public class FeeCollectionRecommendation { public string Priority { get; set; } = string.Empty; public string Action { get; set; } = string.Empty; public string ExpectedImpact { get; set; } = string.Empty; public string Timeline { get; set; } = string.Empty; }
    public class FeeCollectionSummary { public decimal TotalCollected { get; set; } public int TotalTransactions { get; set; } public double OnTimePaymentRate { get; set; } public decimal AveragePayment { get; set; } public double OutstandingAmount { get; set; } public double CollectionEfficiency { get; set; } }
    public class RevenuePrediction { public double ProjectedRevenue { get; set; } public double Confidence { get; set; } public List<string> Drivers { get; set; } = new(); }
    public class FeeCollectionInsight { public string Type { get; set; } = string.Empty; public string Description { get; set; } = string.Empty; public string Impact { get; set; } = string.Empty; public string Recommendation { get; set; } = string.Empty; }
    public class SubjectPassRate { public string Subject { get; set; } = string.Empty; public int TotalStudents { get; set; } public int PassCount { get; set; } public int FailCount { get; set; } public double PassRate { get; set; } public double AverageScore { get; set; } public GradeDistribution GradeDistribution { get; set; } = new(); public double Trend { get; set; } }
    public class GradePassRate { public string Grade { get; set; } = string.Empty; public int TotalStudents { get; set; } public double PassRate { get; set; } public double AverageScore { get; set; } public List<SubjectPerformance> SubjectPerformance { get; set; } = new(); public double YearOverYearGrowth { get; set; } }
    public class TeacherPerformanceImpact { public Guid teacherId { get; set; } public string TeacherName { get; set; } = string.Empty; public double AverageStudentScore { get; set; } public double PassRate { get; set; } public int StudentCount { get; set; } public int SubjectCount { get; set; } public double PerformanceRating { get; set; } }
    public class PerformanceFactors { public List<string> Factors { get; set; } = new(); public double ImpactScore { get; set; } }
    public class PerformanceBenchmarks { public double NationalAverage { get; set; } public double ProvincialAverage { get; set; } public double SchoolAverage { get; set; } public double TopSchoolAverage { get; set; } }
    public class ImprovementArea { public string Area { get; set; } = string.Empty; public double CurrentPerformance { get; set; } public double TargetPerformance { get; set; } public string Priority { get; set; } = string.Empty; public List<string> Recommendations { get; set; } = new(); }
    public class PassRateSummary { public double OverallPassRate { get; set; } public double AverageScore { get; set; } public int TotalStudents { get; set; } public int TotalSubjects { get; set; } public string? BestPerformingSubject { get; set; } public string? WorstPerformingSubject { get; set; } public string? BestPerformingGrade { get; set; } public string? WorstPerformingGrade { get; set; } }
    public class TeacherPerformanceData { public Guid teacherId { get; set; } public string TeacherName { get; set; } = string.Empty; public string Department { get; set; } = string.Empty; public string SubjectSpecialization { get; set; } = string.Empty; public int ClassesCount { get; set; } public int StudentCount { get; set; } public double PerformanceScore { get; set; } public CeoTeacherMetrics Metrics { get; set; } = new(); public List<TeacherRanking> Rankings { get; set; } = new(); public List<string> Strengths { get; set; } = new(); public List<string> DevelopmentNeeds { get; set; } = new(); public List<string> Recommendations { get; set; } = new(); public double Trend { get; set; } public PeerComparison PeerComparison { get; set; } = new(); }
    public class CeoTeacherMetrics { public double StudentProgressRate { get; set; } public double PassRate { get; set; } public double AverageGrade { get; set; } public double EngagementScore { get; set; } public double ParentSatisfaction { get; set; } public int ProfessionalDevelopmentHours { get; set; } public double ExtraCurricularInvolvement { get; set; } }
    public class TeacherRanking { public string Category { get; set; } = string.Empty; public int Rank { get; set; } public int TotalTeachers { get; set; } }
    public class PeerComparison { public double DepartmentAverage { get; set; } public double SchoolAverage { get; set; } public int Percentile { get; set; } }
    public class DepartmentAnalytics { public string Department { get; set; } = string.Empty; public int TeacherCount { get; set; } public double AveragePerformanceScore { get; set; } public double AveragePassRate { get; set; } public double AverageParentSatisfaction { get; set; } public List<TeacherPerformanceData> TopPerformers { get; set; } = new(); public List<string> ImprovementAreas { get; set; } = new(); }
    public class PerformanceDistribution { public int Excellent { get; set; } public int Good { get; set; } public int Satisfactory { get; set; } public int NeedsImprovement { get; set; } }
    public class TeacherInsights { public List<TeacherPerformanceData> TopPerformers { get; set; } = new(); public List<string> ImprovementAreas { get; set; } = new(); public List<string> Trends { get; set; } = new(); public List<string> Recommendations { get; set; } = new(); }
    public class TeacherPerformanceSummary { public int TotalTeachers { get; set; } public double AveragePerformanceScore { get; set; } public double AveragePassRate { get; set; } public double AverageParentSatisfaction { get; set; } public TeacherPerformanceData? TopPerformer { get; set; } public StaffMember? MostImprovedTeacher { get; set; } public string? DepartmentWithHighestPerformance { get; set; } }
    public class EnrollmentPrediction { public int ForecastPeriod { get; set; } public List<int> Predictions { get; set; } = new(); public double Confidence { get; set; } }
    public class GradeEnrollmentForecast { public string Grade { get; set; } = string.Empty; public int ForecastCount { get; set; } }
    public class CapacityAnalysis { public double CurrentCapacity { get; set; } public double ProjectedCapacity { get; set; } public List<string> Constraints { get; set; } = new(); }
    public class RevenueImpact { public decimal CurrentRevenue { get; set; } public decimal ProjectedRevenue { get; set; } public decimal Change { get; set; } }
    public class EnrollmentRecommendation { public string Title { get; set; } = string.Empty; public string Action { get; set; } = string.Empty; }
    public class SeasonalityFactor { public int Month { get; set; } public double Factor { get; set; } public string Description { get; set; } = string.Empty; }
    public class EconomicIndicators { public double InflationRate { get; set; } public double InterestRate { get; set; } public double ExchangeRate { get; set; } public double GDPGrowth { get; set; } public double UnemploymentRate { get; set; } }
    public class SeasonalityData { public string Period { get; set; } = string.Empty; public double Impact { get; set; } }
    public class DemographicData { public int PopulationGrowth { get; set; } public int LocalStudentBase { get; set; } }
    public class SocioEconomicData { public double AverageIncome { get; set; } public double EmploymentRate { get; set; } }
    public class StudentProgress { public double ProgressRate { get; set; } public double ImprovementRate { get; set; } public double RetentionRate { get; set; } }
    public class AcademicMetrics { public double PassRate { get; set; } public double AverageGrade { get; set; } public GradeDistribution GradeDistribution { get; set; } = new(); }
    public class EngagementMetrics { public double EngagementScore { get; set; } public double ClassParticipation { get; set; } public double AssignmentCompletion { get; set; } }
    public class ParentSatisfaction { public double SatisfactionScore { get; set; } public double CommunicationRating { get; set; } public double ResponsivenessRating { get; set; } }
    public class ProfessionalDevelopment { public int Hours { get; set; } public int Certifications { get; set; } public int WorkshopsAttended { get; set; } }
    public class ExtraCurricular { public double InvolvementScore { get; set; } public int ClubsMentored { get; set; } public int EventsOrganized { get; set; } }
    public class HistoricalEnrollment { public int Year { get; set; } public int Count { get; set; } }
    public class SubjectPerformance { public string Subject { get; set; } = string.Empty; public double AverageScore { get; set; } public double PassRate { get; set; } }
    public class GradeDistribution { public int A { get; set; } public int B { get; set; } public int C { get; set; } public int D { get; set; } public int E { get; set; } }
}
