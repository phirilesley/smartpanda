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
using Hangfire;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Jobs;

public class ReportGenerationJobs(
    SmartSchoolDbContext dbContext, 
    ILogger<ReportGenerationJobs> logger,
    IBackgroundJobClient jobClient)
{
    [AutomaticRetry(Attempts = 3)]
    public async Task GenerateStudentReportCards(Guid termId, Guid? schoolId = null)
    {
        logger.LogInformation("Starting report card generation for term {TermId}", termId);

        try
        {
            var studentsQuery = dbContext.Students.AsNoTracking();
            if (schoolId.HasValue)
            {
                studentsQuery = studentsQuery.Where(x => x.SchoolId == schoolId.Value);
            }

            var students = await studentsQuery.ToListAsync();
            
            foreach (var student in students)
            {
                // Queue individual report generation for each student
                jobClient.Enqueue(() => GenerateIndividualReportCard(student.Id, termId));
            }

            logger.LogInformation("Queued report card generation for {Count} students", students.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error queuing report card generation for term {TermId}", termId);
            throw;
        }
    }

    [AutomaticRetry(Attempts = 2)]
    public async Task GenerateIndividualReportCard(Guid studentId, Guid termId)
    {
        try
        {
            // Implementation would generate PDF report card
            // This is a placeholder for the actual report generation logic
            await Task.Delay(1000); // Simulate processing time

            logger.LogInformation("Generated report card for student {StudentId} in term {TermId}", studentId, termId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating report card for student {StudentId}", studentId);
            throw;
        }
    }

    [AutomaticRetry(Attempts = 1)]
    public async Task GenerateFeeStatements(Guid schoolId, DateTime month)
    {
        logger.LogInformation("Starting fee statement generation for school {SchoolId} for month {Month}", schoolId, month);

        try
        {
            var students = await dbContext.Students
                .Where(x => x.SchoolId == schoolId)
                .ToListAsync();

            foreach (var student in students)
            {
                jobClient.Enqueue(() => GenerateIndividualFeeStatement(student.Id, month));
            }

            logger.LogInformation("Queued fee statement generation for {Count} students", students.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error queuing fee statements for school {SchoolId}", schoolId);
            throw;
        }
    }

    [AutomaticRetry(Attempts = 2)]
    public async Task GenerateIndividualFeeStatement(Guid studentId, DateTime month)
    {
        try
        {
            // Implementation would generate PDF fee statement
            await Task.Delay(500); // Simulate processing time

            logger.LogInformation("Generated fee statement for student {StudentId} for month {Month}", studentId, month);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating fee statement for student {StudentId}", studentId);
            throw;
        }
    }

    [AutomaticRetry(Attempts = 0)]
    public async Task CleanupOldReports()
    {
        var cutoff = DateTime.UtcNow.AddMonths(-12); // Keep reports for 12 months
        
        // Implementation would clean up old generated reports
        await Task.Delay(100);
        
        logger.LogInformation("Completed cleanup of old reports older than {Cutoff}", cutoff);
    }
}
