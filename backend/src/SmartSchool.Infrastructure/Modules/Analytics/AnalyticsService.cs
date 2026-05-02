using Microsoft.EntityFrameworkCore;
using SmartSchool.Domain.Modules.Analytics;
using SmartSchool.Persistence.Data;

namespace SmartSchool.Infrastructure.Modules.Analytics;

public class AnalyticsService(SmartSchoolDbContext dbContext, ILogger<AnalyticsService> logger) : IAnalyticsService
{
    public async Task<ExecutiveDashboard> GetExecutiveDashboardAsync(Guid tenantId, Guid schoolId, DateTime? from = null, DateTime? to = null, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating executive dashboard for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        var fromDate = from ?? DateTime.UtcNow.AddMonths(-12);
        var toDate = to ?? DateTime.UtcNow;

        try
        {
            var performance = await GetSchoolPerformanceMetricsAsync(tenantId, schoolId, cancellationToken);
            var financials = await GetFinancialOverviewAsync(tenantId, schoolId, fromDate, toDate, cancellationToken);
            var operations = await GetOperationalMetricsAsync(tenantId, schoolId, cancellationToken);
            var engagement = await GetStudentEngagementOverviewAsync(tenantId, schoolId, fromDate, toDate, cancellationToken);
            var alerts = await GetCriticalAlertsAsync(tenantId, schoolId, cancellationToken);

            return new ExecutiveDashboard
            {
                TenantId = tenantId,
                SchoolId = schoolId,
                GeneratedAt = DateTime.UtcNow,
                Performance = performance,
                Financials = financials,
                Operations = operations,
                Engagement = engagement,
                CriticalAlerts = alerts
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating executive dashboard for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<SchoolPerformanceMetrics> GetSchoolPerformanceMetricsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Calculating school performance metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        try
        {
            // Academic Performance calculation
            var academicPerformance = await CalculateAcademicPerformanceAsync(tenantId, schoolId, cancellationToken);
            
            // Student satisfaction (based on attendance, engagement, etc.)
            var studentSatisfaction = await CalculateStudentSatisfactionAsync(tenantId, schoolId, cancellationToken);
            
            // Teacher performance (based on class completion, grading timeliness, etc.)
            var teacherPerformance = await CalculateTeacherPerformanceAsync(tenantId, schoolId, cancellationToken);
            
            // Parent satisfaction (based on communication, portal usage, etc.)
            var parentSatisfaction = await CalculateParentSatisfactionAsync(tenantId, schoolId, cancellationToken);
            
            // Operational efficiency
            var operationalEfficiency = await CalculateOperationalEfficiencyScoreAsync(tenantId, schoolId, cancellationToken);
            
            // Financial health
            var financialHealth = await CalculateFinancialHealthScoreAsync(tenantId, schoolId, cancellationToken);

            var overallScore = (academicPerformance + studentSatisfaction + teacherPerformance + 
                               parentSatisfaction + operationalEfficiency + financialHealth) / 6.0;

            return new SchoolPerformanceMetrics
            {
                OverallScore = Math.Round(overallScore, 2),
                AcademicPerformance = Math.Round(academicPerformance, 2),
                StudentSatisfaction = Math.Round(studentSatisfaction, 2),
                TeacherPerformance = Math.Round(teacherPerformance, 2),
                ParentSatisfaction = Math.Round(parentSatisfaction, 2),
                OperationalEfficiency = Math.Round(operationalEfficiency, 2),
                FinancialHealth = Math.Round(financialHealth, 2),
                Trends = await GetPerformanceTrendsAsync(tenantId, schoolId, cancellationToken)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error calculating school performance metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<StudentEngagementReport> GetStudentEngagementReportAsync(Guid tenantId, Guid schoolId, Guid studentId, DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating student engagement report for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

        try
        {
            var attendance = await GetAttendanceMetricsAsync(tenantId, schoolId, studentId, from, to, cancellationToken);
            var participation = await GetParticipationMetricsAsync(tenantId, schoolId, studentId, from, to, cancellationToken);
            var assignments = await GetAssignmentMetricsAsync(tenantId, schoolId, studentId, from, to, cancellationToken);
            var communication = await GetCommunicationMetricsAsync(tenantId, schoolId, studentId, from, to, cancellationToken);
            var keyEvents = await GetEngagementEventsAsync(tenantId, schoolId, studentId, from, to, cancellationToken);

            // Calculate overall engagement score
            var engagementScore = (attendance.AttendanceRate * 0.3 + 
                                 participation.ClassParticipationScore * 0.25 + 
                                 assignments.SubmissionRate * 0.25 + 
                                 communication.CommunicationScore * 0.2);

            return new StudentEngagementReport
            {
                StudentId = studentId,
                From = from,
                To = to,
                EngagementScore = Math.Round(engagementScore, 2),
                Attendance = attendance,
                Participation = participation,
                Assignments = assignments,
                Communication = communication,
                KeyEvents = keyEvents
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating student engagement report for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    public async Task<List<StudentEngagementAlert>> GetEngagementAlertsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Getting engagement alerts for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        try
        {
            var alerts = new List<StudentEngagementAlert>();
            var thresholdDate = DateTime.UtcNow.AddDays(-7); // Last 7 days

            // Get students with low attendance
            var lowAttendanceStudents = await dbContext.StudentAttendances
                .Where(a => a.TenantId == tenantId && a.SchoolId == schoolId && a.Date >= thresholdDate)
                .GroupBy(a => a.StudentId)
                .Select(g => new { StudentId = g.Key, AttendanceRate = g.Count(a => a.IsPresent) / (double)g.Count() })
                .Where(x => x.AttendanceRate < 0.8) // Less than 80% attendance
                .ToListAsync(cancellationToken);

            alerts.AddRange(lowAttendanceStudents.Select(x => new StudentEngagementAlert
            {
                StudentId = x.StudentId,
                AlertType = "Low Attendance",
                Severity = x.AttendanceRate < 0.5 ? "High" : "Medium",
                Message = $"Student attendance rate is {Math.Round(x.AttendanceRate * 100, 1)}%",
                CreatedAt = DateTime.UtcNow
            }));

            // Get students with assignment submission issues
            var lateAssignmentStudents = await dbContext.StudentAssignments
                .Include(sa => sa.Assignment)
                .Where(sa => sa.Assignment.TenantId == tenantId && 
                            sa.Assignment.SchoolId == schoolId && 
                            sa.Assignment.DueDate >= thresholdDate &&
                            sa.SubmittedDate > sa.Assignment.DueDate)
                .GroupBy(sa => sa.StudentId)
                .Where(g => g.Count() >= 3) // 3+ late assignments
                .Select(g => new { StudentId = g.Key, LateCount = g.Count() })
                .ToListAsync(cancellationToken);

            alerts.AddRange(lateAssignmentStudents.Select(x => new StudentEngagementAlert
            {
                StudentId = x.StudentId,
                AlertType = "Late Assignments",
                Severity = x.LateCount >= 5 ? "High" : "Medium",
                Message = $"{x.LateCount} assignments submitted late in the last 7 days",
                CreatedAt = DateTime.UtcNow
            }));

            logger.LogInformation("Generated {Count} engagement alerts for tenant {TenantId}, school {SchoolId}", alerts.Count, tenantId, schoolId);
            return alerts;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting engagement alerts for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<StudentBehavioralPattern> AnalyzeBehavioralPatternsAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Analyzing behavioral patterns for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

        try
        {
            var patterns = new List<BehaviorPattern>();
            var interventions = new List<RecommendedIntervention>();

            // Analyze attendance patterns
            var attendancePattern = await AnalyzeAttendancePatternAsync(tenantId, schoolId, studentId, cancellationToken);
            if (attendancePattern != null)
            {
                patterns.Add(attendancePattern);
                if (attendancePattern.ImpactScore > 0.7)
                {
                    interventions.Add(new RecommendedIntervention
                    {
                        InterventionType = "Attendance Counseling",
                        Description = "Student shows concerning attendance patterns that may affect academic performance",
                        Priority = "High",
                        RecommendedDate = DateTime.UtcNow.AddDays(1),
                        ExpectedOutcome = "Improved attendance and academic engagement"
                    });
                }
            }

            // Analyze assignment submission patterns
            var assignmentPattern = await AnalyzeAssignmentPatternAsync(tenantId, schoolId, studentId, cancellationToken);
            if (assignmentPattern != null)
            {
                patterns.Add(assignmentPattern);
            }

            // Analyze participation patterns
            var participationPattern = await AnalyzeParticipationPatternAsync(tenantId, schoolId, studentId, cancellationToken);
            if (participationPattern != null)
            {
                patterns.Add(participationPattern);
            }

            return new StudentBehavioralPattern
            {
                StudentId = studentId,
                Patterns = patterns,
                Interventions = interventions,
                AnalyzedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error analyzing behavioral patterns for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    public async Task<FinancialForecast> GetFinancialForecastAsync(Guid tenantId, Guid schoolId, int monthsAhead = 12, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating financial forecast for tenant {TenantId}, school {SchoolId}, {MonthsAhead} months ahead", tenantId, schoolId, monthsAhead);

        try
        {
            var monthlyForecasts = new List<MonthlyForecast>();
            var currentDate = DateTime.UtcNow;

            // Get historical data for the last 12 months
            var historicalData = await GetHistoricalFinancialDataAsync(tenantId, schoolId, cancellationToken);

            for (int i = 1; i <= monthsAhead; i++)
            {
                var forecastDate = currentDate.AddMonths(i);
                var month = forecastDate.Month;
                var year = forecastDate.Year;

                // Simple forecasting based on historical patterns and seasonality
                var historicalMonthData = historicalData.Where(x => x.Month == month).ToList();
                var averageRevenue = historicalMonthData.Any() ? historicalMonthData.Average(x => x.Revenue) : 0;
                var averageExpenses = historicalMonthData.Any() ? historicalMonthData.Average(x => x.Expenses) : 0;

                // Apply growth factors
                var revenueGrowthFactor = 1.05; // 5% annual growth
                var expenseGrowthFactor = 1.03; // 3% annual growth

                var projectedRevenue = averageRevenue * revenueGrowthFactor * (i / 12.0);
                var projectedExpenses = averageExpenses * expenseGrowthFactor * (i / 12.0);
                var projectedNetIncome = projectedRevenue - projectedExpenses;

                monthlyForecasts.Add(new MonthlyForecast
                {
                    Year = year,
                    Month = month,
                    ProjectedRevenue = projectedRevenue,
                    ProjectedExpenses = projectedExpenses,
                    ProjectedNetIncome = projectedNetIncome,
                    ConfidenceLevel = Math.Max(0.5, 0.9 - (i * 0.05)), // Decreasing confidence over time
                    Factors = new List<ForecastFactor>
                    {
                        new() { Factor = "Historical Average", Weight = 0.6, Impact = 0.8 },
                        new() { Factor = "Seasonal Trend", Weight = 0.3, Impact = 0.7 },
                        new() { Factor = "Growth Projection", Weight = 0.1, Impact = 0.5 }
                    }
                });
            }

            return new FinancialForecast
            {
                SchoolId = schoolId,
                ForecastDate = DateTime.UtcNow,
                MonthlyForecasts = monthlyForecasts,
                Accuracy = new ForecastAccuracy
                {
                    HistoricalAccuracy = 0.85,
                    ModelConfidence = 0.78,
                    DataQuality = 0.92
                },
                Recommendations = GenerateFinancialRecommendations(monthlyForecasts)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating financial forecast for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<CashFlowProjection> GetCashFlowProjectionAsync(Guid tenantId, Guid schoolId, DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating cash flow projection for tenant {TenantId}, school {SchoolId}, from {From} to {To}", tenantId, schoolId, from, to);

        try
        {
            // Get expected receivables
            var expectedReceivables = await GetExpectedReceivablesAsync(tenantId, schoolId, from, to, cancellationToken);
            
            // Get expected payables
            var expectedPayables = await GetExpectedPayablesAsync(tenantId, schoolId, from, to, cancellationToken);
            
            // Get current cash position
            var currentCash = await GetCurrentCashPositionAsync(tenantId, schoolId, cancellationToken);

            var dailyProjections = new List<DailyCashFlow>();
            var currentDate = from;
            var runningCash = currentCash;

            while (currentDate <= to)
            {
                var dailyReceivables = expectedReceivables.Where(x => x.ExpectedDate.Date == currentDate.Date).Sum(x => x.Amount);
                var dailyPayables = expectedPayables.Where(x => x.DueDate.Date == currentDate.Date).Sum(x => x.Amount);
                
                runningCash += dailyReceivables - dailyPayables;

                dailyProjections.Add(new DailyCashFlow
                {
                    Date = currentDate,
                    OpeningBalance = runningCash - dailyReceivables + dailyPayables,
                    Inflows = dailyReceivables,
                    Outflows = dailyPayables,
                    ClosingBalance = runningCash
                });

                currentDate = currentDate.AddDays(1);
            }

            return new CashFlowProjection
            {
                SchoolId = schoolId,
                ProjectionPeriod = new DateRange(from, to),
                StartingCashPosition = currentCash,
                EndingCashPosition = runningCash,
                DailyProjections = dailyProjections,
                CashFlowWarnings = GenerateCashFlowWarnings(dailyProjections)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating cash flow projection for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<OperationalEfficiencyReport> GetOperationalEfficiencyReportAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating operational efficiency report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        try
        {
            var resourceUtilization = await GetResourceUtilizationMetricsAsync(tenantId, schoolId, cancellationToken);
            var processEfficiency = await GetProcessEfficiencyMetricsAsync(tenantId, schoolId, cancellationToken);
            var costEfficiency = await GetCostEfficiencyMetricsAsync(tenantId, schoolId, cancellationToken);
            var recommendations = GenerateEfficiencyRecommendations(resourceUtilization, processEfficiency, costEfficiency);

            var overallScore = (resourceUtilization.UtilizationScore + 
                              processEfficiency.EfficiencyScore + 
                              costEfficiency.CostScore) / 3.0;

            return new OperationalEfficiencyReport
            {
                SchoolId = schoolId,
                ReportDate = DateTime.UtcNow,
                OverallEfficiencyScore = Math.Round(overallScore, 2),
                ResourceUtilization = resourceUtilization,
                ProcessEfficiency = processEfficiency,
                CostEfficiency = costEfficiency,
                Recommendations = recommendations
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating operational efficiency report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<ResourceUtilizationMetrics> GetResourceUtilizationMetricsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Calculating resource utilization metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        try
        {
            // Classroom utilization
            var classroomUtilization = await CalculateClassroomUtilizationAsync(tenantId, schoolId, cancellationToken);
            
            // Teacher workload
            var teacherWorkload = await CalculateTeacherWorkloadAsync(tenantId, schoolId, cancellationToken);
            
            // Resource utilization
            var resourceUtilization = await CalculateResourceUtilizationAsync(tenantId, schoolId, cancellationToken);

            return new ResourceUtilizationMetrics
            {
                ClassroomUtilization = classroomUtilization,
                TeacherWorkload = teacherWorkload,
                ResourceUtilization = resourceUtilization,
                UtilizationScore = Math.Round((classroomUtilization + teacherWorkload + resourceUtilization) / 3.0, 2)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error calculating resource utilization metrics for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<CostAnalysisReport> GetCostAnalysisReportAsync(Guid tenantId, Guid schoolId, DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating cost analysis report for tenant {TenantId}, school {SchoolId}, from {From} to {To}", tenantId, schoolId, from, to);

        try
        {
            var costBreakdown = await GetCostBreakdownAsync(tenantId, schoolId, from, to, cancellationToken);
            var costTrends = await GetCostTrendsAsync(tenantId, schoolId, from, to, cancellationToken);
            var costPerStudent = await CalculateCostPerStudentAsync(tenantId, schoolId, from, to, cancellationToken);

            return new CostAnalysisReport
            {
                SchoolId = schoolId,
                AnalysisPeriod = new DateRange(from, to),
                CostBreakdown = costBreakdown,
                CostTrends = costTrends,
                CostPerStudent = costPerStudent,
                TotalCost = costBreakdown.Sum(x => x.Amount),
                Recommendations = GenerateCostRecommendations(costBreakdown, costTrends)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating cost analysis report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<StudentPerformancePrediction> PredictStudentPerformanceAsync(Guid tenantId, Guid schoolId, Guid studentId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Predicting performance for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);

        try
        {
            var historicalPerformance = await GetHistoricalPerformanceAsync(tenantId, schoolId, studentId, cancellationToken);
            var currentPerformance = await GetCurrentPerformanceAsync(tenantId, schoolId, studentId, cancellationToken);
            var riskFactors = await IdentifyRiskFactorsAsync(tenantId, schoolId, studentId, cancellationToken);

            var subjectPredictions = new List<SubjectPrediction>();
            var overallSuccessProbability = 0.0;

            // Predict performance for each subject
            foreach (var subject in historicalPerformance.Keys)
            {
                var prediction = PredictSubjectPerformance(subject, historicalPerformance[subject], currentPerformance.GetValueOrDefault(subject, 0), riskFactors);
                subjectPredictions.Add(prediction);
            }

            // Calculate overall success probability
            if (subjectPredictions.Any())
            {
                overallSuccessProbability = subjectPredictions.Average(x => x.SuccessProbability);
            }

            return new StudentPerformancePrediction
            {
                StudentId = studentId,
                SubjectPredictions = subjectPredictions,
                OverallSuccessProbability = Math.Round(overallSuccessProbability, 2),
                RiskFactors = riskFactors,
                Recommendations = GeneratePerformanceRecommendations(subjectPredictions, riskFactors),
                PredictedAt = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error predicting performance for student {StudentId}, tenant {TenantId}, school {SchoolId}", studentId, tenantId, schoolId);
            throw;
        }
    }

    public async Task<List<AtRiskStudent>> GetAtRiskStudentsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Identifying at-risk students for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        try
        {
            var atRiskStudents = new List<AtRiskStudent>();
            
            // Get all active students
            var students = await dbContext.Students
                .Where(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive)
                .ToListAsync(cancellationToken);

            foreach (var student in students)
            {
                var riskScore = await CalculateRiskScoreAsync(tenantId, schoolId, student.Id, cancellationToken);
                
                if (riskScore >= 0.6) // 60% or higher risk score
                {
                    var riskFactors = await IdentifyRiskFactorsAsync(tenantId, schoolId, student.Id, cancellationToken);
                    var interventions = GenerateInterventionsForAtRiskStudent(riskScore, riskFactors);

                    atRiskStudents.Add(new AtRiskStudent
                    {
                        StudentId = student.Id,
                        StudentName = $"{student.FirstName} {student.LastName}",
                        RiskScore = Math.Round(riskScore, 2),
                        RiskFactors = riskFactors,
                        RecommendedInterventions = interventions,
                        IdentifiedAt = DateTime.UtcNow
                    });
                }
            }

            logger.LogInformation("Identified {Count} at-risk students for tenant {TenantId}, school {SchoolId}", atRiskStudents.Count, tenantId, schoolId);
            return atRiskStudents.OrderByDescending(x => x.RiskScore).ToList();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error identifying at-risk students for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<BudgetOptimizationReport> GetBudgetOptimizationReportAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating budget optimization report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);

        try
        {
            var currentBudget = await GetCurrentBudgetAsync(tenantId, schoolId, cancellationToken);
            var spendingAnalysis = await AnalyzeSpendingPatternsAsync(tenantId, schoolId, cancellationToken);
            var optimizationOpportunities = await IdentifyOptimizationOpportunitiesAsync(tenantId, schoolId, cancellationToken);

            return new BudgetOptimizationReport
            {
                SchoolId = schoolId,
                ReportDate = DateTime.UtcNow,
                CurrentBudgetAllocation = currentBudget,
                SpendingAnalysis = spendingAnalysis,
                OptimizationOpportunities = optimizationOpportunities,
                PotentialSavings = optimizationOpportunities.Sum(x => x.PotentialSavings),
                Recommendations = GenerateBudgetRecommendations(currentBudget, optimizationOpportunities)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating budget optimization report for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    public async Task<EnrollmentProjection> GetEnrollmentProjectionAsync(Guid tenantId, Guid schoolId, int yearsAhead = 3, CancellationToken cancellationToken = default)
    {
        logger.LogInformation("Generating enrollment projection for tenant {TenantId}, school {SchoolId}, {YearsAhead} years ahead", tenantId, schoolId, yearsAhead);

        try
        {
            var historicalEnrollment = await GetHistoricalEnrollmentDataAsync(tenantId, schoolId, cancellationToken);
            var demographicTrends = await GetDemographicTrendsAsync(tenantId, schoolId, cancellationToken);
            var marketFactors = await GetMarketFactorsAsync(tenantId, schoolId, cancellationToken);

            var yearlyProjections = new List<YearlyEnrollmentProjection>();
            var currentYear = DateTime.UtcNow.Year;

            for (int i = 1; i <= yearsAhead; i++)
            {
                var projectionYear = currentYear + i;
                var projectedEnrollment = ProjectEnrollmentForYear(historicalEnrollment, demographicTrends, marketFactors, projectionYear);
                
                yearlyProjections.Add(projectedEnrollment);
            }

            return new EnrollmentProjection
            {
                SchoolId = schoolId,
                ProjectionDate = DateTime.UtcNow,
                YearsProjected = yearsAhead,
                YearlyProjections = yearlyProjections,
                ConfidenceLevel = CalculateEnrollmentProjectionConfidence(historicalEnrollment.Count()),
                KeyFactors = IdentifyKeyEnrollmentFactors(historicalEnrollment, demographicTrends, marketFactors)
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating enrollment projection for tenant {TenantId}, school {SchoolId}", tenantId, schoolId);
            throw;
        }
    }

    // Helper methods (implementations would go here)
    private async Task<double> CalculateAcademicPerformanceAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for calculating academic performance
        // Based on exam results, pass rates, etc.
        return 85.5; // Placeholder
    }

    private async Task<double> CalculateStudentSatisfactionAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for calculating student satisfaction
        // Based on attendance, engagement, feedback, etc.
        return 78.2; // Placeholder
    }

    private async Task<double> CalculateTeacherPerformanceAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for calculating teacher performance
        // Based on class completion, grading timeliness, etc.
        return 82.7; // Placeholder
    }

    private async Task<double> CalculateParentSatisfactionAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for calculating parent satisfaction
        // Based on communication, portal usage, feedback, etc.
        return 76.9; // Placeholder
    }

    private async Task<double> CalculateOperationalEfficiencyScoreAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for calculating operational efficiency
        // Based on resource utilization, process efficiency, etc.
        return 79.3; // Placeholder
    }

    private async Task<double> CalculateFinancialHealthScoreAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for calculating financial health
        // Based on revenue, expenses, cash flow, etc.
        return 81.4; // Placeholder
    }

    private async Task<List<PerformanceTrend>> GetPerformanceTrendsAsync(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        // Implementation for getting performance trends
        return new List<PerformanceTrend>(); // Placeholder
    }

    // Additional helper methods would be implemented similarly...
}

// Additional supporting classes
public class StudentEngagementAlert
{
    public Guid StudentId { get; init; }
    public string AlertType { get; init; } = string.Empty;
    public string Severity { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}

public class FinancialOverview
{
    public decimal TotalRevenue { get; init; }
    public decimal TotalExpenses { get; init; }
    public decimal NetIncome { get; init; }
    public decimal RevenueGrowth { get; init; }
    public decimal ExpenseGrowth { get; init; }
    public List<FinancialTrend> Trends { get; init; } = new();
}

public class OperationalMetrics
{
    public double ResourceUtilization { get; init; }
    public double ProcessEfficiency { get; init; }
    public double StaffProductivity { get; init; }
    public double OperationalCosts { get; init; }
}

public class StudentEngagementOverview
{
    public double AverageEngagementScore { get; init; }
    public int ActiveStudents { get; init; }
    public int AtRiskStudents { get; init; }
    public double AttendanceRate { get; init; }
}

public class AttendanceMetrics
{
    public double AttendanceRate { get; init; }
    public int TotalDays { get; init; }
    public int PresentDays { get; init; }
    public int AbsentDays { get; init; }
    public int LateDays { get; init; }
    public List<AttendancePattern> Patterns { get; init; } = new();
}

public class ParticipationMetrics
{
    public double ClassParticipationScore { get; init; }
    public int QuestionsAsked { get; init; }
    public int AssignmentsSubmitted { get; init; }
    public int ExtracurricularActivities { get; init; }
    public double EngagementTrend { get; init; }
}

public class AssignmentMetrics
{
    public double SubmissionRate { get; init; }
    public int TotalAssignments { get; init; }
    public int OnTimeSubmissions { get; init; }
    public int LateSubmissions { get; init; }
    public double AverageScore { get; init; }
}

public class CommunicationMetrics
{
    public double CommunicationScore { get; init; }
    public int MessagesSent { get; init; }
    public int MessagesReceived { get; init; }
    public int ParentInteractions { get; init; }
    public double ResponseRate { get; init; }
}

public class EngagementEvent
{
    public DateTime EventDate { get; init; }
    public string EventType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public double Impact { get; init; }
}

public class CashFlowProjection
{
    public Guid SchoolId { get; init; }
    public DateRange ProjectionPeriod { get; init; } = new();
    public decimal StartingCashPosition { get; init; }
    public decimal EndingCashPosition { get; init; }
    public List<DailyCashFlow> DailyProjections { get; init; } = new();
    public List<CashFlowWarning> CashFlowWarnings { get; init; } = new();
}

public class DateRange
{
    public DateTime Start { get; init; }
    public DateTime End { get; init; }

    public DateRange(DateTime start, DateTime end)
    {
        Start = start;
        End = end;
    }
}

public class DailyCashFlow
{
    public DateTime Date { get; init; }
    public decimal OpeningBalance { get; init; }
    public decimal Inflows { get; init; }
    public decimal Outflows { get; init; }
    public decimal ClosingBalance { get; init; }
}

public class CashFlowWarning
{
    public string WarningType { get; init; } = string.Empty;
    public DateTime WarningDate { get; init; }
    public decimal ProjectedBalance { get; init; }
    public string Recommendation { get; init; } = string.Empty;
}

public class BudgetOptimizationReport
{
    public Guid SchoolId { get; init; }
    public DateTime ReportDate { get; init; }
    public BudgetAllocation CurrentBudgetAllocation { get; init; } = new();
    public SpendingAnalysis SpendingAnalysis { get; init; } = new();
    public List<OptimizationOpportunity> OptimizationOpportunities { get; init; } = new();
    public decimal PotentialSavings { get; init; }
    public List<BudgetRecommendation> Recommendations { get; init; } = new();
}

public class BudgetAllocation
{
    public Dictionary<string, decimal> Categories { get; init; } = new();
    public decimal TotalBudget { get; init; }
}

public class SpendingAnalysis
{
    public Dictionary<string, decimal> ActualSpending { get; init; } = new();
    public Dictionary<string, decimal> VarianceAnalysis { get; init; } = new();
    public List<SpendingTrend> Trends { get; init; } = new();
}

public class OptimizationOpportunity
{
    public string Category { get; init; } = string.Empty;
    public decimal CurrentSpending { get; init; }
    public decimal RecommendedSpending { get; init; }
    public decimal PotentialSavings { get; init; }
    public string Rationale { get; init; } = string.Empty;
}

public class BudgetRecommendation
{
    public string Recommendation { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public decimal Impact { get; init; }
    public string Priority { get; init; } = string.Empty;
}

public class EnrollmentProjection
{
    public Guid SchoolId { get; init; }
    public DateTime ProjectionDate { get; init; }
    public int YearsProjected { get; init; }
    public List<YearlyEnrollmentProjection> YearlyProjections { get; init; } = new();
    public double ConfidenceLevel { get; init; }
    public List<string> KeyFactors { get; init; } = new();
}

public class YearlyEnrollmentProjection
{
    public int Year { get; init; }
    public int ProjectedEnrollment { get; init; }
    public double GrowthRate { get; init; }
    public List<GradeEnrollment> GradeEnrollments { get; init; } = new();
}

public class GradeEnrollment
{
    public string Grade { get; init; } = string.Empty;
    public int ProjectedStudents { get; init; }
    public double GrowthRate { get; init; }
}

// Additional supporting classes would be implemented similarly...
