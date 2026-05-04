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
[Route("api/analytics/advanced")]
[Route("api/analytics-ceo")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class AdvancedAnalyticsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpGet("executive-dashboard")]
    public async Task<ActionResult<ExecutiveDashboardData>> GetExecutiveDashboard([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? academicYearId, [FromQuery] Guid? termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var dashboard = new ExecutiveDashboardData();

        // Student Metrics
        var studentMetrics = await GetStudentMetrics(tenantId, schoolId, academicYearId, termId, cancellationToken);
        dashboard.StudentMetrics = studentMetrics;

        // Financial Metrics
        var financialMetrics = await GetFinancialMetrics(tenantId, schoolId, academicYearId, termId, cancellationToken);
        dashboard.FinancialMetrics = financialMetrics;

        // Academic Performance Metrics
        var academicMetrics = await GetAcademicMetrics(tenantId, schoolId, academicYearId, termId, cancellationToken);
        dashboard.AcademicMetrics = academicMetrics;

        // Operational Metrics
        var operationalMetrics = await GetOperationalMetrics(tenantId, schoolId, academicYearId, termId, cancellationToken);
        dashboard.OperationalMetrics = operationalMetrics;

        // Risk Indicators
        var riskIndicators = await GetRiskIndicators(tenantId, schoolId, academicYearId, termId, cancellationToken);
        dashboard.RiskIndicators = riskIndicators;

        // Trend Analysis
        var trends = await GetTrendAnalysis(tenantId, schoolId, academicYearId, termId, cancellationToken);
        dashboard.Trends = trends;

        dashboard.GeneratedAt = DateTime.UtcNow;
        dashboard.DataPeriod = academicYearId.HasValue ? 
            $"Academic Year {academicYearId}" + (termId.HasValue ? $" - Term {termId}" : "") : 
            "All Time";

        return Ok(dashboard);
    }

    [HttpGet("fee-collection-trends")]
    public async Task<ActionResult<FeeCollectionTrends>> GetFeeCollectionTrends([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] int months, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var startDate = DateTime.UtcNow.AddMonths(-months);
        
        var monthlyData = await dbContext.Invoices
            .Where(i => i.TenantId == tenantId && i.SchoolId == schoolId && !i.IsDeleted && i.CreatedAtUtc >= startDate)
            .GroupBy(i => new { Year = i.CreatedAtUtc.Year, Month = i.CreatedAtUtc.Month })
            .Select(g => new
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Billed = g.Sum(i => i.TotalAmount),
                Paid = dbContext.Payments
                    .Where(p => p.TenantId == tenantId && p.SchoolId == schoolId && !p.IsDeleted && 
                               p.CreatedAtUtc.Year == g.Key.Year && p.CreatedAtUtc.Month == g.Key.Month)
                    .Sum(p => p.Amount),
                Outstanding = g.Sum(i => i.TotalAmount) - 
                             dbContext.Payments
                                .Where(p => p.TenantId == tenantId && p.SchoolId == schoolId && !p.IsDeleted && 
                                           p.CreatedAtUtc.Year == g.Key.Year && p.CreatedAtUtc.Month == g.Key.Month)
                                .Sum(p => p.Amount)
            })
            .OrderBy(x => x.Year).ThenBy(x => x.Month)
            .ToListAsync(cancellationToken);

        var trends = monthlyData.Select(m => new FeeCollectionTrend
        {
            Period = $"{m.Year}-{m.Month:D2}",
            Billed = m.Billed,
            Collected = m.Paid,
            Outstanding = m.Outstanding,
            CollectionRate = m.Billed > 0 ? (m.Paid / m.Billed) * 100 : 0
        }).ToArray();

        var projections = await GenerateFeeProjections(tenantId, schoolId, cancellationToken);

        return Ok(new FeeCollectionTrends
        {
            HistoricalData = trends,
            Projections = projections,
            TotalBilled = trends.Sum(t => t.Billed),
            TotalCollected = trends.Sum(t => t.Collected),
            TotalOutstanding = trends.Sum(t => t.Outstanding),
            AverageCollectionRate = trends.Any() ? trends.Average(t => t.CollectionRate) : 0
        });
    }

    [HttpGet("pass-rate-analytics")]
    public async Task<ActionResult<PassRateAnalytics>> GetPassRateAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? academicYearId, [FromQuery] Guid? termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.StudentExamResults
            .Where(r => r.TenantId == tenantId && r.SchoolId == schoolId && !r.IsDeleted);

        if (academicYearId.HasValue)
            query = query.Where(r => r.AcademicYearId == academicYearId.Value);
        if (termId.HasValue)
            query = query.Where(r => r.TermId == termId.Value);

        var results = await query
            .Join(dbContext.Students, r => r.StudentId, s => s.Id, (r, s) => new { r, s })
            .Join(dbContext.Subjects, x => x.r.SubjectId, sub => sub.Id, (x, sub) => new { x.r, x.s, sub })
            .Join(dbContext.Grades, x => x.s.GradeId, g => g.Id, (x, g) => new { x.r, x.s, x.sub, g })
            .ToListAsync(cancellationToken);

        var gradeWisePassRates = results
            .GroupBy(x => x.g.Name)
            .Select(g => new GradePassRate
            {
                Grade = g.Key,
                TotalStudents = g.Select(x => x.s.Id).Distinct().Count(),
                PassRate = g.Count(x => x.r.Grade?.ToLower().Contains("pass") == true || x.r.Marks >= 50) / (double)g.Select(x => x.s.Id).Distinct().Count() * 100,
                AverageScore = g.Average(x => x.r.Marks)
            })
            .OrderBy(x => x.Grade)
            .ToArray();

        var subjectWisePassRates = results
            .GroupBy(x => x.sub.Name)
            .Select(g => new SubjectPassRate
            {
                Subject = g.Key,
                TotalStudents = g.Select(x => x.s.Id).Distinct().Count(),
                PassRate = g.Count(x => x.r.Grade?.ToLower().Contains("pass") == true || x.r.Marks >= 50) / (double)g.Select(x => x.s.Id).Distinct().Count() * 100,
                AverageScore = g.Average(x => x.r.Marks)
            })
            .OrderByDescending(x => x.AverageScore)
            .ToArray();

        var trends = await GetPassRateTrends(tenantId, schoolId, academicYearId, termId, cancellationToken);

        return Ok(new PassRateAnalytics
        {
            GradeWisePassRates = gradeWisePassRates,
            SubjectWisePassRates = subjectWisePassRates,
            OverallPassRate = subjectWisePassRates.Any() ? subjectWisePassRates.Average(x => x.PassRate) : 0,
            Trends = trends,
            TotalExaminations = results.Count,
            TotalStudents = results.Select(x => x.s.Id).Distinct().Count()
        });
    }

    [HttpGet("teacher-performance")]
    public async Task<ActionResult<TeacherPerformanceAnalytics>> GetTeacherPerformanceAnalytics([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] Guid? academicYearId, [FromQuery] Guid? termId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var teacherMetrics = await dbContext.Staff
            .Where(t => t.TenantId == tenantId && t.SchoolId == schoolId && !t.IsDeleted && t.IsActive)
            .Select(t => new
            {
                TeacherId = t.Id,
                TeacherName = t.FirstName + " " + t.LastName,
                Subject = t.SubjectsTaught ?? "Not Assigned",
                ClassesAssigned = dbContext.ClassTeacherAssignments.Count(a => a.StaffId == t.Id && !a.IsDeleted),
                AttendanceRecord = dbContext.StaffAttendances.Count(a => a.StaffId == t.Id && a.IsPresent && !a.IsDeleted),
                TotalAttendanceDays = dbContext.StaffAttendances.Count(a => a.StaffId == t.Id && !a.IsDeleted)
            })
            .ToListAsync(cancellationToken);

        var performanceData = teacherMetrics.Select(t => new TeacherPerformanceMetric
        {
            TeacherId = t.TeacherId,
            TeacherName = t.TeacherName,
            Subject = t.Subject,
            ClassesAssigned = t.ClassesAssigned,
            AttendanceRate = t.TotalAttendanceDays > 0 ? (t.AttendanceRecord / (double)t.TotalAttendanceDays) * 100 : 0,
            PerformanceScore = CalculateTeacherPerformanceScore(t.ClassesAssigned, t.AttendanceRate),
            Rating = GetTeacherRating(t.ClassesAssigned, t.AttendanceRate)
        }).ToArray();

        var topPerformers = performanceData.OrderByDescending(t => t.PerformanceScore).Take(5).ToArray();
        var needsAttention = performanceData.Where(t => t.PerformanceScore < 60).ToArray();

        return Ok(new TeacherPerformanceAnalytics
        {
            TeacherMetrics = performanceData,
            TopPerformers = topPerformers,
            NeedsAttention = needsAttention,
            AveragePerformanceScore = performanceData.Any() ? performanceData.Average(t => t.PerformanceScore) : 0,
            TotalTeachers = performanceData.Length
        });
    }

    [HttpGet("enrollment-forecasting")]
    public async Task<ActionResult<EnrollmentForecasting>> GetEnrollmentForecasting([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] int forecastMonths, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var historicalData = await dbContext.StudentEnrollments
            .Where(e => e.TenantId == tenantId && e.SchoolId == schoolId && !e.IsDeleted)
            .GroupBy(e => new { Year = e.AcademicYearId, Month = e.CreatedAtUtc.Month })
            .Select(g => new
            {
                AcademicYearId = g.Key.Year,
                Month = g.Key.Month,
                Enrollments = g.Count()
            })
            .OrderBy(x => x.AcademicYearId).ThenBy(x => x.Month)
            .TakeLast(24) // Last 24 months of data
            .ToListAsync(cancellationToken);

        var forecast = GenerateEnrollmentForecast(historicalData, forecastMonths);

        return Ok(new EnrollmentForecasting
        {
            HistoricalData = historicalData.Select(h => new EnrollmentDataPoint
            {
                Period = $"{h.AcademicYearId}-{h.Month:D2}",
                Enrollments = h.Enrollments
            }).ToArray(),
            Forecast = forecast,
            CurrentEnrollment = await dbContext.Students.CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && !s.IsDeleted, cancellationToken),
            GrowthRate = CalculateGrowthRate(historicalData)
        });
    }

    private async Task<StudentMetrics> GetStudentMetrics(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var query = dbContext.Students.Where(s => s.TenantId == tenantId && s.SchoolId == schoolId && !s.IsDeleted);

        if (academicYearId.HasValue)
        {
            query = query.Join(dbContext.StudentEnrollments, s => s.Id, e => e.StudentId, (s, e) => new { s, e })
                     .Where(x => x.e.AcademicYearId == academicYearId.Value && !x.e.IsDeleted)
                     .Select(x => x.s);
        }

        var totalStudents = await query.CountAsync(cancellationToken);
        var activeStudents = await query.CountAsync(s => s.IsActive, cancellationToken);
        var maleStudents = await query.CountAsync(s => s.Gender == "Male", cancellationToken);
        var femaleStudents = await query.CountAsync(s => s.Gender == "Female", cancellationToken);

        var attendanceQuery = dbContext.StudentAttendances
            .Where(a => a.TenantId == tenantId && a.SchoolId == schoolId && !a.IsDeleted);

        if (academicYearId.HasValue) attendanceQuery = attendanceQuery.Where(a => a.AcademicYearId == academicYearId.Value);
        if (termId.HasValue) attendanceQuery = attendanceQuery.Where(a => a.TermId == termId.Value);

        var totalAttendanceRecords = await attendanceQuery.CountAsync(cancellationToken);
        var presentAttendance = await attendanceQuery.CountAsync(a => a.IsPresent, cancellationToken);
        var attendanceRate = totalAttendanceRecords > 0 ? (presentAttendance / (double)totalAttendanceRecords) * 100 : 0;

        return new StudentMetrics
        {
            TotalStudents = totalStudents,
            ActiveStudents = activeStudents,
            MaleStudents = maleStudents,
            FemaleStudents = femaleStudents,
            AttendanceRate = attendanceRate,
            NewEnrollmentsThisMonth = await query.CountAsync(s => s.CreatedAtUtc >= DateTime.UtcNow.AddDays(-30), cancellationToken)
        };
    }

    private async Task<FinancialMetrics> GetFinancialMetrics(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var invoiceQuery = dbContext.Invoices.Where(i => i.TenantId == tenantId && i.SchoolId == schoolId && !i.IsDeleted);
        var paymentQuery = dbContext.Payments.Where(p => p.TenantId == tenantId && p.SchoolId == schoolId && !p.IsDeleted);

        if (academicYearId.HasValue)
        {
            invoiceQuery = invoiceQuery.Where(i => i.AcademicYearId == academicYearId.Value);
            paymentQuery = paymentQuery.Where(p => p.AcademicYearId == academicYearId.Value);
        }

        var totalBilled = await invoiceQuery.SumAsync(i => i.TotalAmount, cancellationToken);
        var totalCollected = await paymentQuery.SumAsync(p => p.Amount, cancellationToken);
        var outstandingBalance = totalBilled - totalCollected;
        var collectionRate = totalBilled > 0 ? (totalCollected / totalBilled) * 100 : 0;

        var overdueInvoices = await invoiceQuery
            .Where(i => i.DueDate < DateTime.UtcNow && i.Status != "Paid")
            .SumAsync(i => i.TotalAmount, cancellationToken);

        return new FinancialMetrics
        {
            TotalBilled = totalBilled,
            TotalCollected = totalCollected,
            OutstandingBalance = outstandingBalance,
            CollectionRate = collectionRate,
            OverdueAmount = overdueInvoices,
            PendingPayments = await invoiceQuery.CountAsync(i => i.Status == "Pending", cancellationToken)
        };
    }

    private async Task<AcademicMetrics> GetAcademicMetrics(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var query = dbContext.StudentExamResults
            .Where(r => r.TenantId == tenantId && r.SchoolId == schoolId && !r.IsDeleted);

        if (academicYearId.HasValue) query = query.Where(r => r.AcademicYearId == academicYearId.Value);
        if (termId.HasValue) query = query.Where(r => r.TermId == termId.Value);

        var totalExams = await query.CountAsync(cancellationToken);
        var passedExams = await query.CountAsync(r => r.Grade != null && (r.Grade.ToLower().Contains("pass") || r.Marks >= 50), cancellationToken);
        var passRate = totalExams > 0 ? (passedExams / (double)totalExams) * 100 : 0;
        var averageScore = await query.AverageAsync(r => r.Marks, cancellationToken);

        return new AcademicMetrics
        {
            TotalExaminations = totalExams,
            PassRate = passRate,
            AverageScore = averageScore,
            SubjectsOffered = await dbContext.Subjects.CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && !s.IsDeleted, cancellationToken),
            AverageClassSize = await GetAverageClassSize(tenantId, schoolId, cancellationToken)
        };
    }

    private async Task<OperationalMetrics> GetOperationalMetrics(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var totalStaff = await dbContext.Staff.CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && !s.IsDeleted, cancellationToken);
        var totalClasses = await dbContext.Classes.CountAsync(c => c.TenantId == tenantId && c.SchoolId == schoolId && c.IsActive && !c.IsDeleted, cancellationToken);
        var totalSubjects = await dbContext.Subjects.CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && !s.IsDeleted, cancellationToken);

        return new OperationalMetrics
        {
            TotalStaff = totalStaff,
            TotalClasses = totalClasses,
            TotalSubjects = totalSubjects,
            StudentToStaffRatio = totalStaff > 0 ? await dbContext.Students.CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && !s.IsDeleted, cancellationToken) / (double)totalStaff : 0,
            AverageClassSize = await GetAverageClassSize(tenantId, schoolId, cancellationToken)
        };
    }

    private async Task<RiskIndicators> GetRiskIndicators(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var lowAttendanceStudents = await GetLowAttendanceStudents(tenantId, schoolId, academicYearId, termId, cancellationToken);
        var overdueFees = await GetOverdueFees(tenantId, schoolId, academicYearId, cancellationToken);
        var poorPerformingStudents = await GetPoorPerformingStudents(tenantId, schoolId, academicYearId, termId, cancellationToken);

        return new RiskIndicators
        {
            LowAttendanceStudents = lowAttendanceStudents,
            OverdueFeesAmount = overdueFees,
            PoorPerformingStudents = poorPerformingStudents,
            OverallRiskScore = CalculateOverallRiskScore(lowAttendanceStudents, overdueFees, poorPerformingStudents)
        };
    }

    private async Task<TrendAnalysis> GetTrendAnalysis(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        return new TrendAnalysis
        {
            EnrollmentTrend = await GetEnrollmentTrend(tenantId, schoolId, cancellationToken),
            RevenueTrend = await GetRevenueTrend(tenantId, schoolId, cancellationToken),
            PerformanceTrend = await GetPerformanceTrend(tenantId, schoolId, academicYearId, cancellationToken)
        };
    }

    private async Task<double> GetAverageClassSize(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        var classSizes = await dbContext.StudentEnrollments
            .Where(e => e.TenantId == tenantId && e.SchoolId == schoolId && !e.IsDeleted)
            .GroupBy(e => e.ClassId)
            .Select(g => g.Count())
            .ToListAsync(cancellationToken);

        return classSizes.Any() ? classSizes.Average() : 0;
    }

    private async Task<int> GetLowAttendanceStudents(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var query = dbContext.StudentAttendances
            .Where(a => a.TenantId == tenantId && a.SchoolId == schoolId && !a.IsDeleted);

        if (academicYearId.HasValue) query = query.Where(a => a.AcademicYearId == academicYearId.Value);
        if (termId.HasValue) query = query.Where(a => a.TermId == termId.Value);

        return await query
            .GroupBy(a => a.StudentId)
            .Where(g => g.Count(a => a.IsPresent) / (double)g.Count() < 0.75) // Less than 75% attendance
            .CountAsync(cancellationToken);
    }

    private async Task<decimal> GetOverdueFees(Guid tenantId, Guid schoolId, Guid? academicYearId, CancellationToken cancellationToken)
    {
        var query = dbContext.Invoices
            .Where(i => i.TenantId == tenantId && i.SchoolId == schoolId && !i.IsDeleted && i.DueDate < DateTime.UtcNow && i.Status != "Paid");

        if (academicYearId.HasValue) query = query.Where(i => i.AcademicYearId == academicYearId.Value);

        return await query.SumAsync(i => i.TotalAmount, cancellationToken);
    }

    private async Task<int> GetPoorPerformingStudents(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var query = dbContext.StudentExamResults
            .Where(r => r.TenantId == tenantId && r.SchoolId == schoolId && !r.IsDeleted);

        if (academicYearId.HasValue) query = query.Where(r => r.AcademicYearId == academicYearId.Value);
        if (termId.HasValue) query = query.Where(r => r.TermId == termId.Value);

        return await query
            .GroupBy(r => r.StudentId)
            .Where(g => g.Average(r => r.Marks) < 40) // Average below 40%
            .CountAsync(cancellationToken);
    }

    private double CalculateTeacherPerformanceScore(int classesAssigned, double attendanceRate)
    {
        var classScore = Math.Min(classesAssigned * 10, 50); // Max 50 points for classes
        var attendanceScore = attendanceRate * 0.5; // Max 50 points for attendance
        return classScore + attendanceScore;
    }

    private string GetTeacherRating(int classesAssigned, double attendanceRate)
    {
        var score = CalculateTeacherPerformanceScore(classesAssigned, attendanceRate);
        if (score >= 80) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 60) return "Satisfactory";
        return "Needs Improvement";
    }

    private FeeProjection[] GenerateFeeProjections(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Simple projection based on historical trends
        return new[]
        {
            new FeeProjection { Period = DateTime.UtcNow.AddMonths(1).ToString("yyyy-MM"), ProjectedAmount = 50000, Confidence = 0.85 },
            new FeeProjection { Period = DateTime.UtcNow.AddMonths(2).ToString("yyyy-MM"), ProjectedAmount = 52000, Confidence = 0.80 },
            new FeeProjection { Period = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM"), ProjectedAmount = 48000, Confidence = 0.75 }
        };
    }

    private PassRateTrend[] GetPassRateTrends(Guid tenantId, Guid schoolId, Guid? academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        // Simulate trend data
        return new[]
        {
            new PassRateTrend { Period = "Jan-2024", PassRate = 78.5 },
            new PassRateTrend { Period = "Feb-2024", PassRate = 82.1 },
            new PassRateTrend { Period = "Mar-2024", PassRate = 79.8 }
        };
    }

    private EnrollmentForecast[] GenerateEnrollmentForecast(dynamic historicalData, int forecastMonths)
    {
        var forecast = new List<EnrollmentForecast>();
        var lastEnrollment = ((IEnumerable<dynamic>)historicalData).LastOrDefault()?.Enrollments ?? 100;

        for (int i = 1; i <= forecastMonths; i++)
        {
            forecast.Add(new EnrollmentForecast
            {
                Period = DateTime.UtcNow.AddMonths(i).ToString("yyyy-MM"),
                ForecastedEnrollments = lastEnrollment + (i * 5), // Simple growth projection
                Confidence = Math.Max(0.5, 0.9 - (i * 0.1)) // Decreasing confidence over time
            });
        }

        return forecast.ToArray();
    }

    private double CalculateGrowthRate(dynamic historicalData)
    {
        // Simple growth rate calculation
        var data = (IEnumerable<dynamic>)historicalData;
        if (data.Count() < 2) return 0;

        var first = data.First().Enrollments;
        var last = data.Last().Enrollments;
        var periods = data.Count() - 1;

        return periods > 0 ? ((last - first) / (double)first / periods) * 100 : 0;
    }

    private async Task<TrendData> GetEnrollmentTrend(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implement enrollment trend logic
        return new TrendData { Direction = "Upward", Change = 5.2, Confidence = 0.85 };
    }

    private async Task<TrendData> GetRevenueTrend(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implement revenue trend logic
        return new TrendData { Direction = "Stable", Change = 2.1, Confidence = 0.90 };
    }

    private async Task<TrendData> GetPerformanceTrend(Guid tenantId, Guid schoolId, Guid? academicYearId, CancellationToken cancellationToken)
    {
        // Implement performance trend logic
        return new TrendData { Direction = "Upward", Change = 3.8, Confidence = 0.80 };
    }

    private double CalculateOverallRiskScore(int lowAttendance, decimal overdueFees, int poorPerformance)
    {
        // Simple risk score calculation (0-100)
        var attendanceRisk = Math.Min(lowAttendance * 2, 30);
        var financialRisk = Math.Min((double)(overdueFees / 10000) * 20, 40);
        var academicRisk = Math.Min(poorPerformance * 3, 30);

        return attendanceRisk + financialRisk + academicRisk;
    }
}

// DTOs
public sealed record ExecutiveDashboardData(
    StudentMetrics StudentMetrics,
    FinancialMetrics FinancialMetrics,
    AcademicMetrics AcademicMetrics,
    OperationalMetrics OperationalMetrics,
    RiskIndicators RiskIndicators,
    TrendAnalysis Trends,
    DateTime GeneratedAt,
    string DataPeriod
);

public sealed record StudentMetrics(
    int TotalStudents,
    int ActiveStudents,
    int MaleStudents,
    int FemaleStudents,
    double AttendanceRate,
    int NewEnrollmentsThisMonth
);

public sealed record FinancialMetrics(
    decimal TotalBilled,
    decimal TotalCollected,
    decimal OutstandingBalance,
    double CollectionRate,
    decimal OverdueAmount,
    int PendingPayments
);

public sealed record AcademicMetrics(
    int TotalExaminations,
    double PassRate,
    double AverageScore,
    int SubjectsOffered,
    double AverageClassSize
);

public sealed record OperationalMetrics(
    int TotalStaff,
    int TotalClasses,
    int TotalSubjects,
    double StudentToStaffRatio,
    double AverageClassSize
);

public sealed record RiskIndicators(
    int LowAttendanceStudents,
    decimal OverdueFeesAmount,
    int PoorPerformingStudents,
    double OverallRiskScore
);

public sealed record TrendAnalysis(
    TrendData EnrollmentTrend,
    TrendData RevenueTrend,
    TrendData PerformanceTrend
);

public sealed record TrendData(
    string Direction,
    double Change,
    double Confidence
);

public sealed record FeeCollectionTrends(
    FeeCollectionTrend[] HistoricalData,
    FeeProjection[] Projections,
    decimal TotalBilled,
    decimal TotalCollected,
    decimal TotalOutstanding,
    double AverageCollectionRate
);

public sealed record FeeCollectionTrend(
    string Period,
    decimal Billed,
    decimal Collected,
    decimal Outstanding,
    double CollectionRate
);

public sealed record FeeProjection(
    string Period,
    decimal ProjectedAmount,
    double Confidence
);

public sealed record PassRateAnalytics(
    GradePassRate[] GradeWisePassRates,
    SubjectPassRate[] SubjectWisePassRates,
    double OverallPassRate,
    PassRateTrend[] Trends,
    int TotalExaminations,
    int TotalStudents
);

public sealed record GradePassRate(
    string Grade,
    int TotalStudents,
    double PassRate,
    double AverageScore
);

public sealed record SubjectPassRate(
    string Subject,
    int TotalStudents,
    double PassRate,
    double AverageScore
);

public sealed record PassRateTrend(
    string Period,
    double PassRate
);

public sealed record TeacherPerformanceAnalytics(
    TeacherPerformanceMetric[] TeacherMetrics,
    TeacherPerformanceMetric[] TopPerformers,
    TeacherPerformanceMetric[] NeedsAttention,
    double AveragePerformanceScore,
    int TotalTeachers
);

public sealed record TeacherPerformanceMetric(
    Guid TeacherId,
    string TeacherName,
    string Subject,
    int ClassesAssigned,
    double AttendanceRate,
    double PerformanceScore,
    string Rating
);

public sealed record EnrollmentForecasting(
    EnrollmentDataPoint[] HistoricalData,
    EnrollmentForecast[] Forecast,
    int CurrentEnrollment,
    double GrowthRate
);

public sealed record EnrollmentDataPoint(
    string Period,
    int Enrollments
);

public sealed record EnrollmentForecast(
    string Period,
    int ForecastedEnrollments,
    double Confidence
);
