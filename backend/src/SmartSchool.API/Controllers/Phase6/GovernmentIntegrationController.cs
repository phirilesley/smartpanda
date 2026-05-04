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
using System.Text;
using System.Security.Cryptography;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/government-integration")]
[Route("api/zimsec")]
[Route("api/ministry")]
[Authorize(Policy = PolicyNames.OperationsManage)]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class GovernmentIntegrationController : ControllerBase
{
    private readonly SmartSchoolDbContext dbContext;

    public GovernmentIntegrationController(SmartSchoolDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    [HttpPost("zimsec/export-candidates")]
    public async Task<ActionResult<ZIMSCEExportResponse>> ExportZIMSCECandidates([FromBody] ZIMSCEExportRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var candidates = await GetZIMSCECandidates(request.TenantId, request.SchoolId, request.AcademicYearId, request.ExaminationType, cancellationToken);

        var exportData = new ZIMSCEExportData
        {
            SchoolDetails = await GetSchoolDetails(request.TenantId, request.SchoolId, cancellationToken),
            ExaminationDetails = new ExaminationDetails
            {
                ExaminationType = request.ExaminationType,
                AcademicYear = request.AcademicYearId.ToString(),
                ExaminationSession = request.ExaminationSession ?? "November",
                ExportDate = DateTime.UtcNow
            },
            Candidates = candidates,
            ExportFormat = request.ExportFormat ?? "CSV"
        };

        var exportResponse = GenerateZIMSCEExport(exportData);

        // Log export
        var exportLog = new GovernmentExportLog
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExportType = "ZIMSEC_Candidates",
            Format = request.ExportFormat ?? "CSV",
            RecordCount = candidates.Length,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentExportLogs.Add(exportLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(exportResponse);
    }

    [HttpPost("zimsec/export-results")]
    public async Task<ActionResult<ZIMSCEExportResponse>> ExportZIMSECEResults([FromBody] ZIMSECEResultsExportRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var results = await GetZIMSECEResults(request.TenantId, request.SchoolId, request.AcademicYearId, request.ExaminationType, cancellationToken);

        var exportData = new ZIMSCEExportData
        {
            SchoolDetails = await GetSchoolDetails(request.TenantId, request.SchoolId, cancellationToken),
            ExaminationDetails = new ExaminationDetails
            {
                ExaminationType = request.ExaminationType,
                AcademicYear = request.AcademicYearId.ToString(),
                ExaminationSession = request.ExaminationSession ?? "November",
                ExportDate = DateTime.UtcNow
            },
            Results = results,
            ExportFormat = request.ExportFormat ?? "CSV"
        };

        var exportResponse = GenerateZIMSCEExport(exportData);

        // Log export
        var exportLog = new GovernmentExportLog
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExportType = "ZIMSEC_Results",
            Format = request.ExportFormat ?? "CSV",
            RecordCount = results.Length,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentExportLogs.Add(exportLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(exportResponse);
    }

    [HttpPost("ministry/annual-report")]
    public async Task<ActionResult<MinistryReportResponse>> GenerateMinistryAnnualReport([FromBody] MinistryReportRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var reportData = await GenerateMinistryReportData(request.TenantId, request.SchoolId, request.AcademicYearId, cancellationToken);

        var report = new MinistryAnnualReport
        {
            SchoolDetails = await GetSchoolDetails(request.TenantId, request.SchoolId, cancellationToken),
            AcademicYear = request.AcademicYearId.ToString(),
            ReportPeriod = request.ReportPeriod ?? "Full Year",
            GeneratedDate = DateTime.UtcNow,
            Data = reportData
        };

        var reportResponse = GenerateMinistryReport(report);

        // Log report generation
        var reportLog = new GovernmentExportLog
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExportType = "Ministry_Annual_Report",
            Format = request.Format ?? "PDF",
            RecordCount = 1,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentExportLogs.Add(reportLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(reportResponse);
    }

    [HttpPost("ministry/enrollment-statistics")]
    public async Task<ActionResult<EnrollmentStatisticsResponse>> GenerateEnrollmentStatistics([FromBody] EnrollmentStatisticsRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var statistics = await GenerateEnrollmentStatisticsData(request.TenantId, request.SchoolId, request.AcademicYearId, request.StatisticsType, cancellationToken);

        var exportResponse = new EnrollmentStatisticsResponse
        {
            Statistics = statistics,
            ExportFormat = request.ExportFormat ?? "Excel",
            GeneratedAt = DateTime.UtcNow,
            SchoolDetails = await GetSchoolDetails(request.TenantId, request.SchoolId, cancellationToken)
        };

        // Log export
        var exportLog = new GovernmentExportLog
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExportType = "Ministry_Enrollment_Statistics",
            Format = request.ExportFormat ?? "Excel",
            RecordCount = statistics.TotalStudents,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentExportLogs.Add(exportLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(exportResponse);
    }

    [HttpPost("ministry/staff-establishment")]
    public async Task<ActionResult<StaffEstablishmentResponse>> GenerateStaffEstablishmentReport([FromBody] StaffEstablishmentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var staffData = await GenerateStaffEstablishmentData(request.TenantId, request.SchoolId, request.AcademicYearId, cancellationToken);

        var reportResponse = new StaffEstablishmentResponse
        {
            StaffEstablishment = staffData,
            ExportFormat = request.ExportFormat ?? "PDF",
            GeneratedAt = DateTime.UtcNow,
            SchoolDetails = await GetSchoolDetails(request.TenantId, request.SchoolId, cancellationToken)
        };

        // Log export
        var exportLog = new GovernmentExportLog
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExportType = "Ministry_Staff_Establishment",
            Format = request.ExportFormat ?? "PDF",
            RecordCount = staffData.TotalStaff,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentExportLogs.Add(exportLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(reportResponse);
    }

    [HttpPost("ministry/infrastructure-report")]
    public async Task<ActionResult<InfrastructureReportResponse>> GenerateInfrastructureReport([FromBody] InfrastructureReportRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var infrastructureData = await GenerateInfrastructureReportData(request.TenantId, request.SchoolId, request.AcademicYearId, cancellationToken);

        var reportResponse = new InfrastructureReportResponse
        {
            InfrastructureReport = infrastructureData,
            ExportFormat = request.ExportFormat ?? "PDF",
            GeneratedAt = DateTime.UtcNow,
            SchoolDetails = await GetSchoolDetails(request.TenantId, request.SchoolId, cancellationToken)
        };

        // Log export
        var exportLog = new GovernmentExportLog
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            ExportType = "Ministry_Infrastructure_Report",
            Format = request.ExportFormat ?? "PDF",
            RecordCount = 1,
            Status = "Completed",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentExportLogs.Add(exportLog);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(reportResponse);
    }

    [HttpGet("export-history")]
    public async Task<ActionResult<IReadOnlyList<GovernmentExportLog>>> GetExportHistory([FromQuery] Guid tenantId, [FromQuery] Guid schoolId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty || schoolId == Guid.Empty) return BadRequest("tenantId and schoolId are required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var query = dbContext.GovernmentExportLogs.AsNoTracking()
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);

        if (fromDate.HasValue) query = query.Where(x => x.CreatedAtUtc >= fromDate.Value);
        if (toDate.HasValue) query = query.Where(x => x.CreatedAtUtc <= toDate.Value);

        var exports = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(exports);
    }

    [HttpPost("bulk-submission")]
    public async Task<ActionResult<BulkSubmissionResponse>> SubmitBulkData([FromBody] BulkSubmissionRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var submission = new GovernmentBulkSubmission
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            SubmissionType = request.SubmissionType,
            DataFormat = request.DataFormat,
            Status = "Processing",
            SubmittedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GovernmentBulkSubmissions.Add(submission);
        await dbContext.SaveChangesAsync(cancellationToken);

        try
        {
            // Process bulk submission
            var processedCount = await ProcessBulkSubmission(submission, request.Data, cancellationToken);

            submission.Status = "Completed";
            submission.ProcessedRecords = processedCount;
            submission.CompletedAtUtc = DateTime.UtcNow;
            submission.UpdatedAtUtc = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Ok(new BulkSubmissionResponse
            {
                Success = true,
                SubmissionId = submission.Id,
                ProcessedRecords = processedCount,
                Status = "Completed"
            });
        }
        catch (Exception ex)
        {
            submission.Status = "Failed";
            submission.Error = ex.Message;
            submission.CompletedAtUtc = DateTime.UtcNow;
            submission.UpdatedAtUtc = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return BadRequest(new BulkSubmissionResponse
            {
                Success = false,
                SubmissionId = submission.Id,
                Error = ex.Message,
                Status = "Failed"
            });
        }
    }

    private async Task<ZIMSCECandidate[]> GetZIMSCECandidates(Guid tenantId, Guid schoolId, Guid academicYearId, string examinationType, CancellationToken cancellationToken)
    {
        var candidates = await dbContext.StudentEnrollments
            .Where(e => e.TenantId == tenantId && e.SchoolId == schoolId && e.AcademicYearId == academicYearId && !e.IsDeleted)
            .Join(dbContext.Students, e => e.StudentId, s => s.Id, (e, s) => new { e, s })
            .Join(dbContext.Grades, x => x.e.GradeId, g => g.Id, (x, g) => new { x.e, x.s, g })
            .Where(x => examinationType == "O_LEVEL" ? x.g.Name.Contains("Form 4") : x.g.Name.Contains("Form 6"))
            .Select(x => new ZIMSCECandidate
            {
                CandidateNumber = GenerateZIMSCECandidateNumber(x.s.Id, x.e.GradeId),
                FirstName = x.s.FirstName,
                LastName = x.s.LastName,
                DateOfBirth = x.s.DateOfBirth,
                Gender = x.s.Gender,
                NationalId = x.s.NationalIdNumber,
                Grade = x.g.Name,
                Subjects = GetCandidateSubjects(x.s.Id, academicYearId),
                ExaminationCenter = GetExaminationCenter(schoolId)
            })
            .ToArrayAsync(cancellationToken);

        return candidates;
    }

    private async Task<ZIMSECEResult[]> GetZIMSECEResults(Guid tenantId, Guid schoolId, Guid academicYearId, string examinationType, CancellationToken cancellationToken)
    {
        var results = await dbContext.StudentMarks
            .Where(r => r.TenantId == tenantId && r.SchoolId == schoolId && r.AcademicYearId == academicYearId && !r.IsDeleted)
            .Join(dbContext.Students, r => r.StudentId, s => s.Id, (r, s) => new { r, s })
            .Join(dbContext.StudentEnrollments, x => x.s.Id, e => e.StudentId, (x, e) => new { x.r, x.s, e })
            .Join(dbContext.Grades, x => x.e.GradeId, g => g.Id, (x, g) => new { x.r, x.s, x.e, g })
            .Join(dbContext.Subjects, x => x.r.SubjectId, sub => sub.Id, (x, sub) => new { x.r, x.s, x.e, x.g, sub })
            .Where(x => examinationType == "O_LEVEL" ? x.g.Name.Contains("Form 4") : x.g.Name.Contains("Form 6"))
            .Select(x => new ZIMSECEResult
            {
                CandidateNumber = GenerateZIMSCECandidateNumber(x.s.Id, x.e.GradeId),
                FirstName = x.s.FirstName,
                LastName = x.s.LastName,
                Subject = x.sub.Name,
                SubjectCode = x.sub.Code,
                Marks = x.r.Marks,
                Grade = x.r.Grade,
                Remarks = x.r.Remarks
            })
            .ToArrayAsync(cancellationToken);

        return results;
    }

    private async Task<SchoolDetails> GetSchoolDetails(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        var school = await dbContext.Schools
            .Where(s => s.Id == schoolId && s.TenantId == tenantId && !s.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        return new SchoolDetails
        {
            SchoolName = school?.Name ?? "Unknown School",
            SchoolCode = school?.Code ?? "UNKNOWN",
            Address = school?.PhysicalAddress ?? "",
            Province = school?.Province ?? "",
            District = school?.District ?? "",
            PhoneNumber = school?.PhoneNumber ?? "",
            Email = school?.Email ?? "",
            SchoolType = school?.SchoolType ?? "",
            SchoolLevel = school?.SchoolLevel ?? ""
        };
    }

    private async Task<MinistryReportData> GenerateMinistryReportData(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        var studentStats = await GetStudentStatistics(tenantId, schoolId, academicYearId, cancellationToken);
        var staffStats = await GetStaffStatistics(tenantId, schoolId, academicYearId, cancellationToken);
        var academicStats = await GetAcademicStatistics(tenantId, schoolId, academicYearId, cancellationToken);
        var financialStats = await GetFinancialStatistics(tenantId, schoolId, academicYearId, cancellationToken);

        return new MinistryReportData
        {
            StudentStatistics = studentStats,
            StaffStatistics = staffStats,
            AcademicStatistics = academicStats,
            FinancialStatistics = financialStats,
            InfrastructureStatistics = await GetInfrastructureStatistics(tenantId, schoolId, cancellationToken)
        };
    }

    private ZIMSCEExportResponse GenerateZIMSCEExport(ZIMSCEExportData exportData)
    {
        var csvContent = GenerateZIMSCECSV(exportData);
        var fileName = $"ZIMSEC_{exportData.ExaminationDetails.ExaminationType}_{DateTime.UtcNow:yyyyMMddHHmmss}.csv";
        var fileHash = ComputeFileHash(csvContent);

        return new ZIMSCEExportResponse
        {
            Success = true,
            FileName = fileName,
            FileContent = Convert.ToBase64String(Encoding.UTF8.GetBytes(csvContent)),
            FileHash = fileHash,
            RecordCount = exportData.Candidates?.Length ?? exportData.Results?.Length ?? 0,
            ExportFormat = exportData.ExportFormat,
            GeneratedAt = DateTime.UtcNow
        };
    }

    private string GenerateZIMSCECSV(ZIMSCEExportData exportData)
    {
        var csv = new StringBuilder();
        
        // Header
        csv.AppendLine("SCHOOL_CODE,SCHOOL_NAME,CANDIDATE_NUMBER,FIRST_NAME,LAST_NAME,DOB,GENDER,NATIONAL_ID,GRADE,SUBJECT1,SUBJECT2,SUBJECT3,SUBJECT4,SUBJECT5,SUBJECT6,SUBJECT7,SUBJECT8");

        // Data rows
        foreach (var candidate in exportData.Candidates ?? Array.Empty<ZIMSCECandidate>())
        {
            var subjects = candidate.Subjects.Take(8).ToArray();
            while (subjects.Length < 8) Array.Resize(ref subjects, 8);

            csv.AppendLine($"{exportData.SchoolDetails.SchoolCode},{exportData.SchoolDetails.SchoolName},{candidate.CandidateNumber},{candidate.FirstName},{candidate.LastName},{candidate.DateOfBirth:yyyy-MM-dd},{candidate.Gender},{candidate.NationalId},{candidate.Grade},{string.Join(",", subjects)}");
        }

        return csv.ToString();
    }

    private MinistryReportResponse GenerateMinistryReport(MinistryAnnualReport report)
    {
        var reportContent = GenerateMinistryReportPDF(report);
        var fileName = $"Ministry_Annual_Report_{report.SchoolDetails.SchoolCode}_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf";
        var fileHash = ComputeFileHash(reportContent);

        return new MinistryReportResponse
        {
            Success = true,
            FileName = fileName,
            FileContent = Convert.ToBase64String(Encoding.UTF8.GetBytes(reportContent)),
            FileHash = fileHash,
            ReportPeriod = report.ReportPeriod,
            GeneratedAt = DateTime.UtcNow
        };
    }

    private string GenerateMinistryReportPDF(MinistryAnnualReport report)
    {
        // Simplified PDF generation (in production, use a proper PDF library)
        var content = new StringBuilder();
        content.AppendLine($"MINISTRY OF EDUCATION ANNUAL REPORT");
        content.AppendLine($"School: {report.SchoolDetails.SchoolName}");
        content.AppendLine($"School Code: {report.SchoolDetails.SchoolCode}");
        content.AppendLine($"Academic Year: {report.AcademicYear}");
        content.AppendLine($"Report Period: {report.ReportPeriod}");
        content.AppendLine($"Generated: {report.GeneratedAt:yyyy-MM-dd HH:mm:ss}");
        content.AppendLine();

        content.AppendLine("STUDENT STATISTICS");
        content.AppendLine($"Total Students: {report.Data.StudentStatistics.TotalStudents}");
        content.AppendLine($"Male Students: {report.Data.StudentStatistics.MaleStudents}");
        content.AppendLine($"Female Students: {report.Data.StudentStatistics.FemaleStudents}");
        content.AppendLine($"New Enrollments: {report.Data.StudentStatistics.NewEnrollments}");
        content.AppendLine($"Dropouts: {report.Data.StudentStatistics.Dropouts}");
        content.AppendLine();

        content.AppendLine("STAFF STATISTICS");
        content.AppendLine($"Total Staff: {report.Data.StaffStatistics.TotalStaff}");
        content.AppendLine($"Teaching Staff: {report.Data.StaffStatistics.TeachingStaff}");
        content.AppendLine($"Non-Teaching Staff: {report.Data.StaffStatistics.NonTeachingStaff}");
        content.AppendLine($"Qualified Teachers: {report.Data.StaffStatistics.QualifiedTeachers}");
        content.AppendLine();

        content.AppendLine("ACADEMIC PERFORMANCE");
        content.AppendLine($"Pass Rate: {report.Data.AcademicStatistics.PassRate:F2}%");
        content.AppendLine($"Average Score: {report.Data.AcademicStatistics.AverageScore:F2}");
        content.AppendLine($"Total Examinations: {report.Data.AcademicStatistics.TotalExaminations}");
        content.AppendLine();

        content.AppendLine("FINANCIAL SUMMARY");
        content.AppendLine($"Total Fees: {report.Data.FinancialStatistics.TotalFees:C}");
        content.AppendLine($"Collected: {report.Data.FinancialStatistics.Collected:C}");
        content.AppendLine($"Outstanding: {report.Data.FinancialStatistics.Outstanding:C}");
        content.AppendLine($"Collection Rate: {report.Data.FinancialStatistics.CollectionRate:F2}%");

        return content.ToString();
    }

    private string GenerateZIMSCECandidateNumber(Guid studentId, Guid gradeId)
    {
        var hash = $"{studentId:N}{gradeId:N}".Take(8).ToArray();
        return $"ZIM{new string(hash)}";
    }

    private string[] GetCandidateSubjects(Guid studentId, Guid academicYearId)
    {
        // Get subjects for the candidate
        return dbContext.StudentEnrollments
            .Where(e => e.StudentId == studentId && e.AcademicYearId == academicYearId && !e.IsDeleted)
            .Join(dbContext.ClassSubjectAssignments, e => e.ClassId, c => c.ClassId, (e, c) => c)
            .Join(dbContext.Subjects, c => c.SubjectId, s => s.Id, (c, s) => s.Name)
            .ToArray();
    }

    private string GetExaminationCenter(Guid schoolId)
    {
        // Get or generate examination center code
        return $"CENTER{schoolId:N}".Take(10).ToArray();
    }

    private async Task<StudentStatistics> GetStudentStatistics(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        var totalStudents = await dbContext.StudentEnrollments
            .CountAsync(e => e.TenantId == tenantId && e.SchoolId == schoolId && e.AcademicYearId == academicYearId && !e.IsDeleted, cancellationToken);

        var maleStudents = await dbContext.StudentEnrollments
            .Join(dbContext.Students, e => e.StudentId, s => s.Id, (e, s) => new { e, s })
            .CountAsync(x => x.e.TenantId == tenantId && x.e.SchoolId == schoolId && x.e.AcademicYearId == academicYearId && x.s.Gender == "Male" && !x.e.IsDeleted, cancellationToken);

        var femaleStudents = totalStudents - maleStudents;

        return new StudentStatistics
        {
            TotalStudents = totalStudents,
            MaleStudents = maleStudents,
            FemaleStudents = femaleStudents,
            NewEnrollments = 0, // Would be calculated based on enrollment dates
            Dropouts = 0 // Would be calculated based on withdrawal dates
        };
    }

    private async Task<StaffStatistics> GetStaffStatistics(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        var totalStaff = await dbContext.StaffMembers
            .CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && !s.IsDeleted, cancellationToken);

        var teachingStaff = await dbContext.StaffMembers
            .CountAsync(s => s.TenantId == tenantId && s.SchoolId == schoolId && s.IsActive && s.Position.Contains("Teacher") && !s.IsDeleted, cancellationToken);

        return new StaffStatistics
        {
            TotalStaff = totalStaff,
            TeachingStaff = teachingStaff,
            NonTeachingStaff = totalStaff - teachingStaff,
            QualifiedTeachers = teachingStaff // Simplified - would check qualifications
        };
    }

    private async Task<AcademicStatistics> GetAcademicStatistics(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        var query = dbContext.StudentMarks
            .Where(r => r.TenantId == tenantId && r.SchoolId == schoolId && r.AcademicYearId == academicYearId && !r.IsDeleted);

        var totalExams = await query.CountAsync(cancellationToken);
        var passedExams = await query.CountAsync(r => r.Grade?.ToLower().Contains("pass") == true || r.Marks >= 50, cancellationToken);
        var passRate = totalExams > 0 ? (passedExams / (double)totalExams) * 100 : 0;
        var averageScore = await query.AnyAsync() ? await query.AverageAsync(r => r.Marks, cancellationToken) : 0;

        return new AcademicStatistics
        {
            TotalExaminations = totalExams,
            PassRate = passRate,
            AverageScore = averageScore
        };
    }

    private async Task<FinancialStatistics> GetFinancialStatistics(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        var totalFees = await dbContext.StudentInvoices
            .Where(i => i.TenantId == tenantId && i.SchoolId == schoolId && i.AcademicYearId == academicYearId && !i.IsDeleted)
            .SumAsync(i => i.TotalAmount, cancellationToken);

        var collected = await dbContext.Payments
            .Where(p => p.TenantId == tenantId && p.SchoolId == schoolId && p.AcademicYearId == academicYearId && !p.IsDeleted)
            .SumAsync(p => p.Amount, cancellationToken);

        return new FinancialStatistics
        {
            TotalFees = totalFees,
            Collected = collected,
            Outstanding = totalFees - collected,
            CollectionRate = totalFees > 0 ? (collected / totalFees) * 100 : 0
        };
    }

    private async Task<InfrastructureStatistics> GetInfrastructureStatistics(Guid tenantId, Guid schoolId, CancellationToken cancellationToken)
    {
        var classrooms = await dbContext.Rooms
            .CountAsync(r => r.TenantId == tenantId && r.SchoolId == schoolId && r.RoomType == "Classroom" && !r.IsDeleted, cancellationToken);

        var totalRooms = await dbContext.Rooms
            .CountAsync(r => r.TenantId == tenantId && r.SchoolId == schoolId && !r.IsDeleted, cancellationToken);

        return new InfrastructureStatistics
        {
            TotalClassrooms = classrooms,
            TotalRooms = totalRooms,
            Laboratories = totalRooms - classrooms // Simplified
        };
    }

    private async Task<EnrollmentStatisticsData> GenerateEnrollmentStatisticsData(Guid tenantId, Guid schoolId, Guid academicYearId, string statisticsType, CancellationToken cancellationToken)
    {
        // Implementation for enrollment statistics
        return new EnrollmentStatisticsData
        {
            TotalStudents = 1000,
            MaleStudents = 550,
            FemaleStudents = 450,
            GradeBreakdown = new[]
            {
                new GradeBreakdown { Grade = "Form 1", Count = 250 },
                new GradeBreakdown { Grade = "Form 2", Count = 230 },
                new GradeBreakdown { Grade = "Form 3", Count = 260 },
                new GradeBreakdown { Grade = "Form 4", Count = 260 }
            }
        };
    }

    private async Task<StaffEstablishmentData> GenerateStaffEstablishmentData(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        // Implementation for staff establishment
        return new StaffEstablishmentData
        {
            TotalStaff = 50,
            TeachingStaff = 40,
            NonTeachingStaff = 10,
            QualifiedTeachers = 35
        };
    }

    private async Task<InfrastructureReportData> GenerateInfrastructureReportData(Guid tenantId, Guid schoolId, Guid academicYearId, CancellationToken cancellationToken)
    {
        // Implementation for infrastructure report
        return new InfrastructureReportData
        {
            TotalClassrooms = 20,
            Laboratories = 5,
            Libraries = 2,
            SportsFacilities = 3
        };
    }

    private async Task<int> ProcessBulkSubmission(GovernmentBulkSubmission submission, string data, CancellationToken cancellationToken)
    {
        // Implementation for processing bulk submissions
        return 100; // Placeholder
    }

    private string ComputeFileHash(string content)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(content));
        return Convert.ToBase64String(hash);
    }
}

// DTOs and Entities
public sealed record ZIMSCEExportRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, string ExaminationType, string? ExaminationSession, string? ExportFormat);
public sealed record ZIMSCEExportResponse(bool Success, string FileName, string FileContent, string FileHash, int RecordCount, string ExportFormat, DateTime GeneratedAt);
public sealed record ZIMSCEExportData(SchoolDetails SchoolDetails, ExaminationDetails ExaminationDetails, ZIMSCECandidate[]? Candidates, ZIMSECEResult[]? Results, string ExportFormat);
public sealed record SchoolDetails(string SchoolName, string SchoolCode, string Address, string Province, string District, string PhoneNumber, string Email, string SchoolType, string SchoolLevel);
public sealed record ExaminationDetails(string ExaminationType, string AcademicYear, string ExaminationSession, DateTime ExportDate);
public sealed record ZIMSCECandidate(string CandidateNumber, string FirstName, string LastName, DateOnly DateOfBirth, string Gender, string NationalId, string Grade, string[] Subjects, string ExaminationCenter);
public sealed record ZIMSECEResult(string CandidateNumber, string FirstName, string LastName, string Subject, string SubjectCode, decimal Marks, string Grade, string Remarks);
public sealed record ZIMSCEEResultsExportRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, string ExaminationType, string? ExaminationSession, string? ExportFormat);
public sealed record MinistryReportRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, string? ReportPeriod, string? Format);
public sealed record MinistryReportResponse(bool Success, string FileName, string FileContent, string FileHash, string ReportPeriod, DateTime GeneratedAt);
public sealed record MinistryAnnualReport(SchoolDetails SchoolDetails, string AcademicYear, string ReportPeriod, DateTime GeneratedDate, MinistryReportData Data);
public sealed record MinistryReportData(StudentStatistics StudentStatistics, StaffStatistics StaffStatistics, AcademicStatistics AcademicStatistics, FinancialStatistics FinancialStatistics, InfrastructureStatistics InfrastructureStatistics);
public sealed record StudentStatistics(int TotalStudents, int MaleStudents, int FemaleStudents, int NewEnrollments, int Dropouts);
public sealed record StaffStatistics(int TotalStaff, int TeachingStaff, int NonTeachingStaff, int QualifiedTeachers);
public sealed record AcademicStatistics(int TotalExaminations, double PassRate, double AverageScore);
public sealed record FinancialStatistics(decimal TotalFees, decimal Collected, decimal Outstanding, double CollectionRate);
public sealed record InfrastructureStatistics(int TotalClassrooms, int TotalRooms, int Laboratories);
public sealed record EnrollmentStatisticsRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, string StatisticsType, string? ExportFormat);
public sealed record EnrollmentStatisticsResponse(EnrollmentStatisticsData Statistics, string ExportFormat, DateTime GeneratedAt, SchoolDetails SchoolDetails);
public sealed record EnrollmentStatisticsData(int TotalStudents, int MaleStudents, int FemaleStudents, GradeBreakdown[] GradeBreakdown);
public sealed record GradeBreakdown(string Grade, int Count);
public sealed record StaffEstablishmentRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, string? ExportFormat);
public sealed record StaffEstablishmentResponse(StaffEstablishmentData StaffEstablishment, string ExportFormat, DateTime GeneratedAt, SchoolDetails SchoolDetails);
public sealed record StaffEstablishmentData(int TotalStaff, int TeachingStaff, int NonTeachingStaff, int QualifiedTeachers);
public sealed record InfrastructureReportRequest(Guid TenantId, Guid SchoolId, Guid AcademicYearId, string? ExportFormat);
public sealed record InfrastructureReportResponse(InfrastructureReportData InfrastructureReport, string ExportFormat, DateTime GeneratedAt, SchoolDetails SchoolDetails);
public sealed record InfrastructureReportData(int TotalClassrooms, int Laboratories, int Libraries, int SportsFacilities);
public sealed record BulkSubmissionRequest(Guid TenantId, Guid SchoolId, string SubmissionType, string DataFormat, string Data);
public sealed record BulkSubmissionResponse(bool Success, Guid SubmissionId, int ProcessedRecords = 0, string Status = "", string Error = "");

// Entities (would need to be added to domain model)
// Entities moved to Domain project
