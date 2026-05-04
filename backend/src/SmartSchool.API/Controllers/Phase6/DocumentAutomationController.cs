using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.API.Models;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.Integrations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchool.API.Security;
using SmartSchool.Persistence.Data;
using System.Text.Json;
using System.Text;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/documents")]
[Route("api/automation")]
[Route("api/reports")]
[Authorize(Policy = PolicyNames.SchoolAccess)]
public class DocumentAutomationController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpPost("generate-report-card")]
    public async Task<ActionResult<DocumentGenerationResponse>> GenerateReportCard([FromBody] ReportCardRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var reportCardData = await GetReportCardData(request.TenantId, request.SchoolId, request.StudentId, request.AcademicYearId, request.TermId, cancellationToken);

        var documentTemplate = await GetDocumentTemplate(request.TenantId, request.SchoolId, "ReportCard", cancellationToken);
        var generatedDocument = await GenerateReportCardPDF(reportCardData, documentTemplate, cancellationToken);

        var document = new GeneratedDocument
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = "ReportCard",
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            TemplateId = documentTemplate.Id,
            FileName = $"ReportCard_{reportCardData.Student.FullName}_{DateTime.UtcNow:yyyyMMdd}.pdf",
            FilePath = $"/documents/reportcards/{generatedDocument.Id}.pdf",
            FileSize = generatedDocument.Length,
            GeneratedByUserId = request.GeneratedByUserId,
            Status = "Generated",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GeneratedDocuments.Add(document);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DocumentGenerationResponse
        {
            Success = true,
            DocumentId = document.Id,
            FileName = document.FileName,
            FileContent = Convert.ToBase64String(generatedDocument),
            GeneratedAt = DateTime.UtcNow
        });
    }

    [HttpPost("generate-transcript")]
    public async Task<ActionResult<DocumentGenerationResponse>> GenerateTranscript([FromBody] TranscriptRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var transcriptData = await GetTranscriptData(request.TenantId, request.SchoolId, request.StudentId, request.AcademicYearId, cancellationToken);

        var documentTemplate = await GetDocumentTemplate(request.TenantId, request.SchoolId, "Transcript", cancellationToken);
        var generatedDocument = await GenerateTranscriptPDF(transcriptData, documentTemplate, cancellationToken);

        var document = new GeneratedDocument
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = "Transcript",
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TemplateId = documentTemplate.Id,
            FileName = $"Transcript_{transcriptData.Student.FullName}_{DateTime.UtcNow:yyyyMMdd}.pdf",
            FilePath = $"/documents/transcripts/{generatedDocument.Id}.pdf",
            FileSize = generatedDocument.Length,
            GeneratedByUserId = request.GeneratedByUserId,
            Status = "Generated",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GeneratedDocuments.Add(document);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DocumentGenerationResponse
        {
            Success = true,
            DocumentId = document.Id,
            FileName = document.FileName,
            FileContent = Convert.ToBase64String(generatedDocument),
            GeneratedAt = DateTime.UtcNow
        });
    }

    [HttpPost("generate-certificate")]
    public async Task<ActionResult<DocumentGenerationResponse>> GenerateCertificate([FromBody] CertificateRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var certificateData = await GetCertificateData(request.TenantId, request.SchoolId, request.StudentId, request.CertificateType, request.AcademicYearId, cancellationToken);

        var documentTemplate = await GetDocumentTemplate(request.TenantId, request.SchoolId, request.CertificateType, cancellationToken);
        var generatedDocument = await GenerateCertificatePDF(certificateData, documentTemplate, cancellationToken);

        var document = new GeneratedDocument
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = request.CertificateType,
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TemplateId = documentTemplate.Id,
            FileName = $"{request.CertificateType}_{certificateData.Student.FullName}_{DateTime.UtcNow:yyyyMMdd}.pdf",
            FilePath = $"/documents/certificates/{generatedDocument.Id}.pdf",
            FileSize = generatedDocument.Length,
            GeneratedByUserId = request.GeneratedByUserId,
            Status = "Generated",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GeneratedDocuments.Add(document);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DocumentGenerationResponse
        {
            Success = true,
            DocumentId = document.Id,
            FileName = document.FileName,
            FileContent = Convert.ToBase64String(generatedDocument),
            GeneratedAt = DateTime.UtcNow
        });
    }

    [HttpPost("generate-fee-statement")]
    public async Task<ActionResult<DocumentGenerationResponse>> GenerateFeeStatement([FromBody] FeeStatementRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var feeStatementData = await GetFeeStatementData(request.TenantId, request.SchoolId, request.StudentId, request.AcademicYearId, request.TermId, cancellationToken);

        var documentTemplate = await GetDocumentTemplate(request.TenantId, request.SchoolId, "FeeStatement", cancellationToken);
        var generatedDocument = await GenerateFeeStatementPDF(feeStatementData, documentTemplate, cancellationToken);

        var document = new GeneratedDocument
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = "FeeStatement",
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            TemplateId = documentTemplate.Id,
            FileName = $"FeeStatement_{feeStatementData.Student.FullName}_{DateTime.UtcNow:yyyyMMdd}.pdf",
            FilePath = $"/documents/feestatements/{generatedDocument.Id}.pdf",
            FileSize = generatedDocument.Length,
            GeneratedByUserId = request.GeneratedByUserId,
            Status = "Generated",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.GeneratedDocuments.Add(document);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DocumentGenerationResponse
        {
            Success = true,
            DocumentId = document.Id,
            FileName = document.FileName,
            FileContent = Convert.ToBase64String(generatedDocument),
            GeneratedAt = DateTime.UtcNow
        });
    }

    [HttpPost("generate-bulk-documents")]
    public async Task<ActionResult<BulkDocumentGenerationResponse>> GenerateBulkDocuments([FromBody] BulkDocumentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var bulkGeneration = new BulkDocumentGeneration
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = request.DocumentType,
            StudentIds = request.StudentIds,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            Status = "Processing",
            GeneratedByUserId = request.GeneratedByUserId,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.BulkDocumentGenerations.Add(bulkGeneration);
        await dbContext.SaveChangesAsync(cancellationToken);

        var results = new List<DocumentGenerationResponse>();

        try
        {
            foreach (var studentId in request.StudentIds)
            {
                var individualRequest = CreateIndividualRequest(request, studentId);
                var result = await GenerateDocumentByType(individualRequest, cancellationToken);
                results.Add(result);
            }

            bulkGeneration.Status = "Completed";
            bulkGeneration.CompletedAtUtc = DateTime.UtcNow;
            bulkGeneration.TotalDocuments = results.Count;
            bulkGeneration.SuccessfulDocuments = results.Count(r => r.Success);
            bulkGeneration.FailedDocuments = results.Count(r => !r.Success);
            bulkGeneration.UpdatedAtUtc = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Ok(new BulkDocumentGenerationResponse
            {
                Success = true,
                BulkGenerationId = bulkGeneration.Id,
                TotalDocuments = results.Count,
                SuccessfulDocuments = results.Count(r => r.Success),
                FailedDocuments = results.Count(r => !r.Success),
                Documents = results.ToArray()
            });
        }
        catch (Exception ex)
        {
            bulkGeneration.Status = "Failed";
            bulkGeneration.Error = ex.Message;
            bulkGeneration.CompletedAtUtc = DateTime.UtcNow;
            bulkGeneration.UpdatedAtUtc = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return BadRequest(new BulkDocumentGenerationResponse
            {
                Success = false,
                BulkGenerationId = bulkGeneration.Id,
                Error = ex.Message
            });
        }
    }

    [HttpGet("document-templates")]
    public async Task<ActionResult<IReadOnlyList<DocumentTemplate>>> GetDocumentTemplates([FromQuery] Guid tenantId, [FromQuery] Guid? schoolId, CancellationToken cancellationToken)
    {
        if (tenantId == Guid.Empty) return BadRequest("tenantId is required.");
        if (!User.CanAccessTenant(tenantId)) return Forbid();

        var templates = await dbContext.DocumentTemplates
            .Where(t => t.TenantId == tenantId && (!schoolId.HasValue || t.SchoolId == schoolId.Value) && t.IsActive && !t.IsDeleted)
            .OrderBy(t => t.DocumentType)
            .ToListAsync(cancellationToken);

        return Ok(templates);
    }

    [HttpPost("document-templates")]
    public async Task<ActionResult<DocumentTemplate>> CreateDocumentTemplate([FromBody] CreateDocumentTemplateRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var template = new DocumentTemplate
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = request.DocumentType,
            TemplateName = request.TemplateName,
            TemplateContent = request.TemplateContent,
            TemplateVariables = request.TemplateVariables,
            IsActive = true,
            CreatedByUserId = request.CreatedByUserId,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        dbContext.DocumentTemplates.Add(template);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(template);
    }

    [HttpGet("generated-documents")]
    public async Task<ActionResult<PagedResponse<GeneratedDocument>>> GetGeneratedDocuments([FromQuery] GeneratedDocumentsRequest request, CancellationToken cancellationToken)
    {
        if (request.TenantId == Guid.Empty) return BadRequest("tenantId is required.");
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var query = dbContext.GeneratedDocuments.AsNoTracking();

        if (request.SchoolId.HasValue) query = query.Where(d => d.SchoolId == request.SchoolId.Value);
        if (request.StudentId.HasValue) query = query.Where(d => d.StudentId == request.StudentId.Value);
        if (request.DocumentType != null) query = query.Where(d => d.DocumentType == request.DocumentType);
        if (request.AcademicYearId.HasValue) query = query.Where(d => d.AcademicYearId == request.AcademicYearId.Value);
        if (request.TermId.HasValue) query = query.Where(d => d.TermId == request.TermId.Value);
        if (request.FromDate.HasValue) query = query.Where(d => d.CreatedAtUtc >= request.FromDate.Value);
        if (request.ToDate.HasValue) query = query.Where(d => d.CreatedAtUtc <= request.ToDate.Value);

        var documents = await query
            .Include(d => d.Student)
            .OrderByDescending(d => d.CreatedAtUtc)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var totalCount = await query.CountAsync(cancellationToken);

        return Ok(new PagedResponse<GeneratedDocument>
        {
            Data = documents,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        });
    }

    [HttpGet("download-document")]
    public async Task<ActionResult> DownloadDocument([FromQuery] Guid documentId, CancellationToken cancellationToken)
    {
        var document = await dbContext.GeneratedDocuments
            .FirstOrDefaultAsync(d => d.Id == documentId, cancellationToken);

        if (document == null) return NotFound();

        // In a real implementation, you would read the file from storage
        var fileContent = await GetDocumentFileContent(document.FilePath, cancellationToken);

        return File(fileContent, "application/pdf", document.FileName);
    }

    [HttpPost("schedule-document-generation")]
    public async Task<ActionResult<ScheduledDocumentResponse>> ScheduleDocumentGeneration([FromBody] ScheduledDocumentRequest request, CancellationToken cancellationToken)
    {
        if (!User.CanAccessTenant(request.TenantId)) return Forbid();

        var scheduledDocument = new ScheduledDocumentGeneration
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            DocumentType = request.DocumentType,
            StudentId = request.StudentId,
            AcademicYearId = request.AcademicYearId,
            TermId = request.TermId,
            ScheduledDate = request.ScheduledDate,
            RecurrencePattern = request.RecurrencePattern,
            Status = "Scheduled",
            CreatedByUserId = request.CreatedByUserId,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.ScheduledDocumentGenerations.Add(scheduledDocument);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new ScheduledDocumentResponse
        {
            Success = true,
            ScheduledDocumentId = scheduledDocument.Id,
            ScheduledDate = scheduledDocument.ScheduledDate,
            Message = "Document generation scheduled successfully"
        });
    }

    // Helper Methods
    private async Task<ReportCardData> GetReportCardData(Guid tenantId, Guid schoolId, Guid studentId, Guid academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students
            .Include(s => s.StudentEnrollments)
            .FirstOrDefaultAsync(s => s.Id == studentId && s.TenantId == tenantId && s.SchoolId == schoolId && !s.IsDeleted, cancellationToken);

        if (student == null) throw new Exception("Student not found");

        var currentEnrollment = student.StudentEnrollments
            .FirstOrDefault(e => e.AcademicYearId == academicYearId && (!termId.HasValue || e.TermId == termId.Value) && !e.IsDeleted);

        var grades = await dbContext.StudentExamResults
            .Where(r => r.StudentId == studentId && r.AcademicYearId == academicYearId && (!termId.HasValue || r.TermId == termId.Value) && !r.IsDeleted)
            .Join(dbContext.Subjects, r => r.SubjectId, s => s.Id, (r, s) => new { r, SubjectName = s.Name })
            .Join(dbContext.Exams, x => x.r.ExamId, e => e.Id, (x, e) => new { x.r, x.SubjectName, ExamName = e.Name })
            .ToListAsync(cancellationToken);

        var attendance = await dbContext.StudentAttendances
            .Where(a => a.StudentId == studentId && a.AcademicYearId == academicYearId && (!termId.HasValue || a.TermId == termId.Value) && !a.IsDeleted)
            .ToListAsync(cancellationToken);

        var school = await dbContext.Schools
            .FirstOrDefaultAsync(s => s.Id == schoolId && s.TenantId == tenantId && !s.IsDeleted, cancellationToken);

        return new ReportCardData
        {
            Student = new StudentInfo
            {
                Id = student.Id,
                FullName = $"{student.FirstName} {student.LastName}",
                FirstName = student.FirstName,
                LastName = student.LastName,
                DateOfBirth = student.DateOfBirth,
                Gender = student.Gender,
                NationalId = student.NationalIdNumber,
                Grade = currentEnrollment?.Grade?.Name ?? "Not Assigned",
                Class = currentEnrollment?.Class?.Name ?? "Not Assigned"
            },
            School = new SchoolInfo
            {
                Name = school?.Name ?? "Unknown School",
                Address = school?.PhysicalAddress ?? "",
                PhoneNumber = school?.PhoneNumber ?? "",
                Email = school?.Email ?? "",
                LogoUrl = school?.LogoUrl ?? ""
            },
            AcademicYear = academicYearId.ToString(),
            Term = termId?.ToString() ?? "Full Year",
            Grades = grades.Select(g => new GradeInfo
            {
                Subject = g.SubjectName,
                Exam = g.ExamName,
                Marks = g.r.Marks,
                Grade = g.r.Grade,
                Remarks = g.r.Remarks
            }).ToArray(),
            Attendance = new AttendanceInfo
            {
                TotalDays = attendance.Count,
                PresentDays = attendance.Count(a => a.IsPresent),
                AbsentDays = attendance.Count(a => !a.IsPresent),
                AttendanceRate = attendance.Any() ? (attendance.Count(a => a.IsPresent) / (double)attendance.Count) * 100 : 0
            },
            Conduct = "Excellent",
            PrincipalRemarks = "Student has shown consistent performance throughout the term.",
            ClassTeacherRemarks = "Maintains good discipline and participates actively in class."
        };
    }

    private async Task<TranscriptData> GetTranscriptData(Guid tenantId, Guid schoolId, Guid studentId, Guid academicYearId, CancellationToken cancellationToken)
    {
        var reportCardData = await GetReportCardData(tenantId, schoolId, studentId, academicYearId, null, cancellationToken);
        
        // Get all terms for the academic year
        var allTermsGrades = await dbContext.StudentExamResults
            .Where(r => r.StudentId == studentId && r.AcademicYearId == academicYearId && !r.IsDeleted)
            .Join(dbContext.Subjects, r => r.SubjectId, s => s.Id, (r, s) => new { r, SubjectName = s.Name })
            .Join(dbContext.Terms, x => x.r.TermId, t => t.Id, (x, t) => new { x.r, x.SubjectName, TermName = t.Name })
            .GroupBy(x => x.SubjectName)
            .Select(g => new TranscriptSubjectInfo
            {
                Subject = g.Key,
                Terms = g.Select(x => new TermGradeInfo
                {
                    Term = x.TermName,
                    Marks = x.r.Marks,
                    Grade = x.r.Grade
                }).ToArray(),
                AverageMarks = g.Average(x => x.r.Marks),
                FinalGrade = g.Average(x => x.r.Marks) >= 80 ? "A" : g.Average(x => x.r.Marks) >= 70 ? "B" : g.Average(x => x.r.Marks) >= 60 ? "C" : g.Average(x => x.r.Marks) >= 50 ? "D" : "F"
            })
            .ToListAsync(cancellationToken);

        return new TranscriptData
        {
            Student = reportCardData.Student,
            School = reportCardData.School,
            AcademicYear = academicYearId.ToString(),
            Subjects = allTermsGrades.ToArray(),
            OverallAverage = allTermsGrades.Any() ? allTermsGrades.Average(s => s.AverageMarks) : 0,
            OverallGrade = allTermsGrades.Any() ? 
                (allTermsGrades.Average(s => s.AverageMarks) >= 80 ? "A" : 
                 allTermsGrades.Average(s => s.AverageMarks) >= 70 ? "B" : 
                 allTermsGrades.Average(s => s.AverageMarks) >= 60 ? "C" : 
                 allTermsGrades.Average(s => s.AverageMarks) >= 50 ? "D" : "F") : "N/A"
        };
    }

    private async Task<CertificateData> GetCertificateData(Guid tenantId, Guid schoolId, Guid studentId, string certificateType, Guid academicYearId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students
            .Include(s => s.StudentEnrollments)
            .FirstOrDefaultAsync(s => s.Id == studentId && s.TenantId == tenantId && s.SchoolId == schoolId && !s.IsDeleted, cancellationToken);

        var school = await dbContext.Schools
            .FirstOrDefaultAsync(s => s.Id == schoolId && s.TenantId == tenantId && !s.IsDeleted, cancellationToken);

        var currentEnrollment = student?.StudentEnrollments
            .FirstOrDefault(e => e.AcademicYearId == academicYearId && !e.IsDeleted);

        return new CertificateData
        {
            Student = new StudentInfo
            {
                Id = student!.Id,
                FullName = $"{student.FirstName} {student.LastName}",
                FirstName = student.FirstName,
                LastName = student.LastName,
                Grade = currentEnrollment?.Grade?.Name ?? "Not Assigned"
            },
            School = new SchoolInfo
            {
                Name = school?.Name ?? "Unknown School",
                Address = school?.PhysicalAddress ?? "",
                LogoUrl = school?.LogoUrl ?? ""
            },
            CertificateType = certificateType,
            AwardDate = DateTime.UtcNow,
            AcademicYear = academicYearId.ToString(),
            CertificateNumber = GenerateCertificateNumber(studentId, certificateType),
            Signatories = new[]
            {
                new SignatoryInfo { Name = "Principal", Title = "School Principal", SignatureUrl = "/signatures/principal.png" },
                new SignatoryInfo { Name = "Head Teacher", Title = "Head Teacher", SignatureUrl = "/signatures/headteacher.png" }
            }
        };
    }

    private async Task<FeeStatementData> GetFeeStatementData(Guid tenantId, Guid schoolId, Guid studentId, Guid academicYearId, Guid? termId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students
            .FirstOrDefaultAsync(s => s.Id == studentId && s.TenantId == tenantId && s.SchoolId == schoolId && !s.IsDeleted, cancellationToken);

        var school = await dbContext.Schools
            .FirstOrDefaultAsync(s => s.Id == schoolId && s.TenantId == tenantId && !s.IsDeleted, cancellationToken);

        var invoiceQuery = dbContext.Invoices
            .Where(i => i.StudentId == studentId && i.AcademicYearId == academicYearId && !i.IsDeleted);

        if (termId.HasValue) invoiceQuery = invoiceQuery.Where(i => i.TermId == termId.Value);

        var invoices = await invoiceQuery
            .Select(i => new FeeInvoiceInfo
            {
                InvoiceNumber = i.InvoiceNumber,
                Description = i.Description,
                Amount = i.TotalAmount,
                DueDate = i.DueDate,
                Status = i.Status,
                PaidAmount = dbContext.Payments
                    .Where(p => p.InvoiceId == i.Id && !p.IsDeleted)
                    .Sum(p => p.Amount),
                PaymentDate = dbContext.Payments
                    .Where(p => p.InvoiceId == i.Id && !p.IsDeleted)
                    .OrderByDescending(p => p.CreatedAtUtc)
                    .Select(p => (DateTime?)p.CreatedAtUtc)
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        return new FeeStatementData
        {
            Student = new StudentInfo
            {
                Id = student!.Id,
                FullName = $"{student.FirstName} {student.LastName}",
                FirstName = student.FirstName,
                LastName = student.LastName
            },
            School = new SchoolInfo
            {
                Name = school?.Name ?? "Unknown School",
                Address = school?.PhysicalAddress ?? "",
                PhoneNumber = school?.PhoneNumber ?? "",
                Email = school?.Email ?? ""
            },
            AcademicYear = academicYearId.ToString(),
            Term = termId?.ToString() ?? "Full Year",
            StatementDate = DateTime.UtcNow,
            Invoices = invoices.ToArray(),
            TotalFees = invoices.Sum(i => i.Amount),
            TotalPaid = invoices.Sum(i => i.PaidAmount),
            TotalOutstanding = invoices.Sum(i => i.Amount - i.PaidAmount)
        };
    }

    private async Task<DocumentTemplate> GetDocumentTemplate(Guid tenantId, Guid schoolId, string documentType, CancellationToken cancellationToken)
    {
        var template = await dbContext.DocumentTemplates
            .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.SchoolId == schoolId && t.DocumentType == documentType && t.IsActive && !t.IsDeleted, cancellationToken);

        if (template == null)
        {
            // Create default template if none exists
            template = new DocumentTemplate
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                SchoolId = schoolId,
                DocumentType = documentType,
                TemplateName = $"Default {documentType} Template",
                TemplateContent = GetDefaultTemplateContent(documentType),
                TemplateVariables = GetDefaultTemplateVariables(documentType),
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            };

            dbContext.DocumentTemplates.Add(template);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return template;
    }

    private async Task<byte[]> GenerateReportCardPDF(ReportCardData data, DocumentTemplate template, CancellationToken cancellationToken)
    {
        using var ms = new MemoryStream();
        var document = new Document(PageSize.A4);
        var writer = PdfWriter.GetInstance(document, ms);
        document.Open();

        // Add school logo
        if (!string.IsNullOrEmpty(data.School.LogoUrl))
        {
            var logo = Image.GetInstance(data.School.LogoUrl);
            logo.ScaleToFit(100, 100);
            document.Add(logo);
        }

        // School header
        var schoolNameFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
        var schoolName = new Paragraph(data.School.Name, schoolNameFont);
        schoolName.Alignment = Element.ALIGN_CENTER;
        document.Add(schoolName);

        document.Add(new Paragraph($"Address: {data.School.Address}"));
        document.Add(new Paragraph($"Phone: {data.School.PhoneNumber}"));
        document.Add(new Paragraph($"Email: {data.School.Email}"));
        document.Add(new Paragraph(" "));

        // Report Card Title
        var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14);
        var title = new Paragraph("REPORT CARD", titleFont);
        title.Alignment = Element.ALIGN_CENTER;
        document.Add(title);
        document.Add(new Paragraph(" "));

        // Student Information
        var studentInfoFont = FontFactory.GetFont(FontFactory.HELVETICA, 10);
        document.Add(new Paragraph($"Student Name: {data.Student.FullName}", studentInfoFont));
        document.Add(new Paragraph($"Grade: {data.Student.Grade}", studentInfoFont));
        document.Add(new Paragraph($"Class: {data.Student.Class}", studentInfoFont));
        document.Add(new Paragraph($"Academic Year: {data.AcademicYear}", studentInfoFont));
        document.Add(new Paragraph($"Term: {data.Term}", studentInfoFont));
        document.Add(new Paragraph(" "));

        // Grades Table
        var gradesTable = new PdfPTable(4);
        gradesTable.AddCell("Subject");
        gradesTable.AddCell("Exam");
        gradesTable.AddCell("Marks");
        gradesTable.AddCell("Grade");

        foreach (var grade in data.Grades)
        {
            gradesTable.AddCell(grade.Subject);
            gradesTable.AddCell(grade.Exam);
            gradesTable.AddCell(grade.Marks.ToString());
            gradesTable.AddCell(grade.Grade ?? "N/A");
        }

        document.Add(gradesTable);
        document.Add(new Paragraph(" "));

        // Attendance
        document.Add(new Paragraph($"Attendance: {data.Attendance.AttendanceRate:F1}% ({data.Attendance.PresentDays}/{data.Attendance.TotalDays} days)"));
        document.Add(new Paragraph(" "));

        // Remarks
        document.Add(new Paragraph($"Principal's Remarks: {data.PrincipalRemarks}"));
        document.Add(new Paragraph($"Class Teacher's Remarks: {data.ClassTeacherRemarks}"));
        document.Add(new Paragraph(" "));

        // Signature
        document.Add(new Paragraph("_________________________"));
        document.Add(new Paragraph("Principal Signature"));
        document.Add(new Paragraph(" "));
        document.Add(new Paragraph("_________________________"));
        document.Add(new Paragraph("Class Teacher Signature"));

        document.Close();
        return ms.ToArray();
    }

    private async Task<byte[]> GenerateTranscriptPDF(TranscriptData data, DocumentTemplate template, CancellationToken cancellationToken)
    {
        using var ms = new MemoryStream();
        var document = new Document(PageSize.A4);
        var writer = PdfWriter.GetInstance(document, ms);
        document.Open();

        // Similar structure to Report Card but focused on academic transcript
        var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
        var title = new Paragraph("ACADEMIC TRANSCRIPT", titleFont);
        title.Alignment = Element.ALIGN_CENTER;
        document.Add(title);
        document.Add(new Paragraph(" "));

        document.Add(new Paragraph($"Student: {data.Student.FullName}"));
        document.Add(new Paragraph($"Academic Year: {data.AcademicYear}"));
        document.Add(new Paragraph(" "));

        // Subjects table
        var subjectsTable = new PdfPTable(5);
        subjectsTable.AddCell("Subject");
        subjectsTable.AddCell("Term 1");
        subjectsTable.AddCell("Term 2");
        subjectsTable.AddCell("Term 3");
        subjectsTable.AddCell("Final Grade");

        foreach (var subject in data.Subjects)
        {
            subjectsTable.AddCell(subject.Subject);
            subjectsTable.AddCell(subject.Terms.FirstOrDefault(t => t.Term.Contains("1"))?.Grade ?? "N/A");
            subjectsTable.AddCell(subject.Terms.FirstOrDefault(t => t.Term.Contains("2"))?.Grade ?? "N/A");
            subjectsTable.AddCell(subject.Terms.FirstOrDefault(t => t.Term.Contains("3"))?.Grade ?? "N/A");
            subjectsTable.AddCell(subject.FinalGrade);
        }

        document.Add(subjectsTable);
        document.Add(new Paragraph(" "));
        document.Add(new Paragraph($"Overall Average: {data.OverallAverage:F2}"));
        document.Add(new Paragraph($"Overall Grade: {data.OverallGrade}"));

        document.Close();
        return ms.ToArray();
    }

    private async Task<byte[]> GenerateCertificatePDF(CertificateData data, DocumentTemplate template, CancellationToken cancellationToken)
    {
        using var ms = new MemoryStream();
        var document = new Document(PageSize.A4);
        var writer = PdfWriter.GetInstance(document, ms);
        document.Open();

        // Certificate design
        var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 24);
        var title = new Paragraph(data.CertificateType.ToUpper(), titleFont);
        title.Alignment = Element.ALIGN_CENTER;
        document.Add(title);
        document.Add(new Paragraph(" "));

        var contentFont = FontFactory.GetFont(FontFactory.HELVETICA, 14);
        var content = new Paragraph($"This is to certify that", contentFont);
        content.Alignment = Element.ALIGN_CENTER;
        document.Add(content);

        var nameFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18);
        var name = new Paragraph(data.Student.FullName, nameFont);
        name.Alignment = Element.ALIGN_CENTER;
        document.Add(name);

        document.Add(new Paragraph($"has successfully completed the requirements for", contentFont));
        document.Add(new Paragraph(data.CertificateType, contentFont));
        document.Add(new Paragraph($"during the academic year {data.AcademicYear}", contentFont));
        document.Add(new Paragraph(" "));

        document.Add(new Paragraph($"Awarded on: {data.AwardDate:dd MMMM yyyy}", contentFont));
        document.Add(new Paragraph($"Certificate Number: {data.CertificateNumber}", contentFont));
        document.Add(new Paragraph(" "));

        // Signatures
        document.Add(new Paragraph("_________________________"));
        document.Add(new Paragraph(data.Signatories[0].Name));
        document.Add(new Paragraph(data.Signatories[0].Title));
        document.Add(new Paragraph(" "));
        document.Add(new Paragraph("_________________________"));
        document.Add(new Paragraph(data.Signatories[1].Name));
        document.Add(new Paragraph(data.Signatories[1].Title));

        document.Close();
        return ms.ToArray();
    }

    private async Task<byte[]> GenerateFeeStatementPDF(FeeStatementData data, DocumentTemplate template, CancellationToken cancellationToken)
    {
        using var ms = new MemoryStream();
        var document = new Document(PageSize.A4);
        var writer = PdfWriter.GetInstance(document, ms);
        document.Open();

        var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
        var title = new Paragraph("FEE STATEMENT", titleFont);
        title.Alignment = Element.ALIGN_CENTER;
        document.Add(title);
        document.Add(new Paragraph(" "));

        document.Add(new Paragraph($"Student: {data.Student.FullName}"));
        document.Add(new Paragraph($"Academic Year: {data.AcademicYear}"));
        document.Add(new Paragraph($"Term: {data.Term}"));
        document.Add(new Paragraph($"Statement Date: {data.StatementDate:dd MMMM yyyy}"));
        document.Add(new Paragraph(" "));

        // Invoices table
        var invoicesTable = new PdfPTable(5);
        invoicesTable.AddCell("Invoice #");
        invoicesTable.AddCell("Description");
        invoicesTable.AddCell("Amount");
        invoicesTable.AddCell("Paid");
        invoicesTable.AddCell("Balance");

        foreach (var invoice in data.Invoices)
        {
            invoicesTable.AddCell(invoice.InvoiceNumber);
            invoicesTable.AddCell(invoice.Description);
            invoicesTable.AddCell(invoice.Amount.ToString("C"));
            invoicesTable.AddCell(invoice.PaidAmount.ToString("C"));
            invoicesTable.AddCell((invoice.Amount - invoice.PaidAmount).ToString("C"));
        }

        document.Add(invoicesTable);
        document.Add(new Paragraph(" "));
        document.Add(new Paragraph($"Total Fees: {data.TotalFees:C}"));
        document.Add(new Paragraph($"Total Paid: {data.TotalPaid:C}"));
        document.Add(new Paragraph($"Outstanding Balance: {data.TotalOutstanding:C}"));

        document.Close();
        return ms.ToArray();
    }

    private async Task<DocumentGenerationResponse> GenerateDocumentByType(object request, CancellationToken cancellationToken)
    {
        return request switch
        {
            ReportCardRequest r => await GenerateReportCard(r, cancellationToken),
            TranscriptRequest t => await GenerateTranscript(t, cancellationToken),
            CertificateRequest c => await GenerateCertificate(c, cancellationToken),
            FeeStatementRequest f => await GenerateFeeStatement(f, cancellationToken),
            _ => throw new ArgumentException("Unsupported document type")
        };
    }

    private object CreateIndividualRequest(BulkDocumentRequest bulkRequest, Guid studentId)
    {
        return bulkRequest.DocumentType switch
        {
            "ReportCard" => new ReportCardRequest
            {
                TenantId = bulkRequest.TenantId,
                SchoolId = bulkRequest.SchoolId,
                StudentId = studentId,
                AcademicYearId = bulkRequest.AcademicYearId,
                TermId = bulkRequest.TermId,
                GeneratedByUserId = bulkRequest.GeneratedByUserId
            },
            "Transcript" => new TranscriptRequest
            {
                TenantId = bulkRequest.TenantId,
                SchoolId = bulkRequest.SchoolId,
                StudentId = studentId,
                AcademicYearId = bulkRequest.AcademicYearId,
                GeneratedByUserId = bulkRequest.GeneratedByUserId
            },
            "Certificate" => new CertificateRequest
            {
                TenantId = bulkRequest.TenantId,
                SchoolId = bulkRequest.SchoolId,
                StudentId = studentId,
                CertificateType = "Completion",
                AcademicYearId = bulkRequest.AcademicYearId,
                GeneratedByUserId = bulkRequest.GeneratedByUserId
            },
            "FeeStatement" => new FeeStatementRequest
            {
                TenantId = bulkRequest.TenantId,
                SchoolId = bulkRequest.SchoolId,
                StudentId = studentId,
                AcademicYearId = bulkRequest.AcademicYearId,
                TermId = bulkRequest.TermId,
                GeneratedByUserId = bulkRequest.GeneratedByUserId
            },
            _ => throw new ArgumentException("Unsupported document type")
        };
    }

    private string GenerateCertificateNumber(Guid studentId, string certificateType)
    {
        return $"{certificateType.ToUpper().Substring(0, 3)}{DateTime.UtcNow:yyMMdd}{studentId:N}".Substring(0, 15).ToUpper();
    }

    private async Task<byte[]> GetDocumentFileContent(string filePath, CancellationToken cancellationToken)
    {
        // In a real implementation, you would read from file storage
        return Array.Empty<byte>();
    }

    private string GetDefaultTemplateContent(string documentType)
    {
        return documentType switch
        {
            "ReportCard" => "Default Report Card Template",
            "Transcript" => "Default Transcript Template",
            "Certificate" => "Default Certificate Template",
            "FeeStatement" => "Default Fee Statement Template",
            _ => "Default Template"
        };
    }

    private string GetDefaultTemplateVariables(string documentType)
    {
        return JsonSerializer.Serialize(new
        {
            StudentName = "{{Student.FullName}}",
            SchoolName = "{{School.Name}}",
            AcademicYear = "{{AcademicYear}}",
            Term = "{{Term}}"
        });
    }
}

// DTOs
public sealed record ReportCardRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid AcademicYearId, Guid? TermId, Guid GeneratedByUserId);
public sealed record TranscriptRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid AcademicYearId, Guid GeneratedByUserId);
public sealed record CertificateRequest(Guid TenantId, Guid SchoolId, Guid StudentId, string CertificateType, Guid AcademicYearId, Guid GeneratedByUserId);
public sealed record FeeStatementRequest(Guid TenantId, Guid SchoolId, Guid StudentId, Guid AcademicYearId, Guid? TermId, Guid GeneratedByUserId);
public sealed record BulkDocumentRequest(Guid TenantId, Guid SchoolId, string DocumentType, Guid[] StudentIds, Guid AcademicYearId, Guid? TermId, Guid GeneratedByUserId);
public sealed record BulkDocumentGenerationResponse(bool Success, Guid BulkGenerationId, int TotalDocuments = 0, int SuccessfulDocuments = 0, int FailedDocuments = 0, DocumentGenerationResponse[] Documents = null, string Error = "");
public sealed record DocumentGenerationResponse(bool Success, Guid DocumentId, string FileName, string FileContent, DateTime GeneratedAt);
public sealed record CreateDocumentTemplateRequest(Guid TenantId, Guid? SchoolId, string DocumentType, string TemplateName, string TemplateContent, string TemplateVariables, Guid CreatedByUserId);
public sealed record GeneratedDocumentsRequest(Guid TenantId, Guid? SchoolId, Guid? StudentId, string? DocumentType, Guid? AcademicYearId, Guid? TermId, DateTime? FromDate, DateTime? ToDate, int Page = 1, int PageSize = 50);
public sealed record ScheduledDocumentRequest(Guid TenantId, Guid? SchoolId, string DocumentType, Guid? StudentId, Guid AcademicYearId, Guid? TermId, DateTime ScheduledDate, string RecurrencePattern, Guid CreatedByUserId);
public sealed record ScheduledDocumentResponse(bool Success, Guid ScheduledDocumentId, DateTime ScheduledDate, string Message);
// PagedResponse moved to common models

// Data DTOs
public sealed record ReportCardData(StudentInfo Student, SchoolInfo School, string AcademicYear, string Term, GradeInfo[] Grades, AttendanceInfo Attendance, string Conduct, string PrincipalRemarks, string ClassTeacherRemarks);
public sealed record TranscriptData(StudentInfo Student, SchoolInfo School, string AcademicYear, TranscriptSubjectInfo[] Subjects, double OverallAverage, string OverallGrade);
public sealed record CertificateData(StudentInfo Student, SchoolInfo School, string CertificateType, DateTime AwardDate, string AcademicYear, string CertificateNumber, SignatoryInfo[] Signatories);
public sealed record FeeStatementData(StudentInfo Student, SchoolInfo School, string AcademicYear, string Term, DateTime StatementDate, FeeInvoiceInfo[] Invoices, decimal TotalFees, decimal TotalPaid, decimal TotalOutstanding);

public sealed record StudentInfo(Guid Id, string FullName, string FirstName, string LastName, DateOnly? DateOfBirth = null, string Gender = "", string NationalId = "", string Grade = "", string Class = "");
public sealed record SchoolInfo(string Name, string Address, string PhoneNumber = "", string Email = "", string LogoUrl = "");
public sealed record GradeInfo(string Subject, string Exam, decimal Marks, string Grade, string Remarks);
public sealed record AttendanceInfo(int TotalDays, int PresentDays, int AbsentDays, double AttendanceRate);
public sealed record TranscriptSubjectInfo(string Subject, TermGradeInfo[] Terms, double AverageMarks, string FinalGrade);
public sealed record TermGradeInfo(string Term, decimal Marks, string Grade);
public sealed record FeeInvoiceInfo(string InvoiceNumber, string Description, decimal Amount, DateTime DueDate, string Status, decimal PaidAmount, DateTime? PaymentDate);
public sealed record SignatoryInfo(string Name, string Title, string SignatureUrl);

// Entities (would need to be added to domain model)
public class DocumentTemplate
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid? SchoolId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public string TemplateName { get; set; } = string.Empty;
    public string TemplateContent { get; set; } = string.Empty;
    public string TemplateVariables { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public Guid? CreatedByUserId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}

public class GeneratedDocument
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public Guid? StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid? TermId { get; set; }
    public Guid TemplateId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public Guid GeneratedByUserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    
    // Navigation properties
    public Student? Student { get; set; }
}

public class BulkDocumentGeneration
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid SchoolId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public Guid[] StudentIds { get; set; } = Array.Empty<Guid>();
    public Guid AcademicYearId { get; set; }
    public Guid? TermId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Error { get; set; }
    public Guid GeneratedByUserId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public int TotalDocuments { get; set; }
    public int SuccessfulDocuments { get; set; }
    public int FailedDocuments { get; set; }
}

public class ScheduledDocumentGeneration
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid? SchoolId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public Guid? StudentId { get; set; }
    public Guid AcademicYearId { get; set; }
    public Guid? TermId { get; set; }
    public DateTime ScheduledDate { get; set; }
    public string RecurrencePattern { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
