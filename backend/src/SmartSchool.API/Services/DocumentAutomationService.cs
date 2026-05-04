using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Library;
using SmartSchool.Domain.Modules.Platform;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Timetable;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.HR;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.API.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using iTextSharp.text;
using iTextSharp.text.pdf;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Services
{
    public class DocumentAutomationService
    {
        private readonly SmartSchoolDbContext _context;
        private readonly ILogger<DocumentAutomationService> _logger;
        private readonly AIAssistantService _aiService;

        public DocumentAutomationService(
            SmartSchoolDbContext context,
            ILogger<DocumentAutomationService> logger,
            AIAssistantService aiService)
        {
            _context = context;
            _logger = logger;
            _aiService = aiService;
        }

        // ðŸ“„ Auto-Generate Report Cards
        public async Task<ReportCardResult> GenerateReportCardAsync(ReportCardRequest request)
        {
            try
            {
                // ðŸ“Š Get Student Data
                var studentData = await GetStudentReportData(request.StudentId, request.TermId);
                
                // ðŸ§  AI-Powered Comment Generation
                var aiComments = await _aiService.GenerateReportCommentsAsync(request.StudentId, request.TermId);
                
                // ðŸ“„ Generate PDF Report Card
                var pdfBytes = await GenerateReportCardPDF(studentData, aiComments, request.Template);
                
                // ðŸ“Š Generate Analytics
                var analytics = await GenerateReportCardAnalytics(studentData);
                
                // ðŸ’¾ Save Document Record
                var documentRecord = await SaveDocumentRecord(new DocumentRecord
                {
                    DocumentType = "ReportCard",
                    StudentId = request.StudentId,
                    TermId = request.TermId,
                    FileName = $"ReportCard_{studentData.Student.Name}_{request.TermId}.pdf",
                    FilePath = await SaveDocumentToStorage(pdfBytes, $"ReportCard_{studentData.Student.Id}_{request.TermId}.pdf"),
                    GeneratedAt = DateTime.Now,
                    GeneratedBy = request.GeneratedBy,
                    TemplateUsed = request.Template,
                    AIEnhanced = true
                });

                // ðŸ“§ Send to Parents
                if (request.SendToParents)
                {
                    await SendReportCardToParents(documentRecord, studentData.Student);
                }

                return new ReportCardResult
                {
                    Success = true,
                    DocumentId = documentRecord.Id,
                    PDFBytes = pdfBytes,
                    FileName = documentRecord.FileName,
                    StudentData = studentData,
                    AIComments = aiComments,
                    Analytics = analytics,
                    GeneratedAt = documentRecord.GeneratedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Report card generation failed");
                return new ReportCardResult
                {
                    Success = false,
                    Error = ex.Message,
                    GeneratedAt = DateTime.Now
                };
            }
        }

        // ðŸ“œ Auto-Generate Transcripts
        public async Task<TranscriptResult> GenerateTranscriptAsync(TranscriptRequest request)
        {
            try
            {
                // ðŸ“Š Get Complete Academic History
                var academicHistory = await GetStudentAcademicHistory(request.StudentId);
                
                // ðŸ§  AI-Powered Academic Analysis
                var academicInsights = await _aiService.AnalyzeAcademicPerformanceAsync(new AcademicAnalysisRequest
                {
                    StudentId = request.StudentId,
                    AcademicHistory = academicHistory,
                    IncludePredictions = request.IncludePredictions,
                    IncludeRecommendations = request.IncludeRecommendations
                });
                
                // ðŸ“„ Generate PDF Transcript
                var pdfBytes = await GenerateTranscriptPDF(academicHistory, academicInsights, request.Template);
                
                // ðŸ“Š Generate Transcript Analytics
                var analytics = await GenerateTranscriptAnalytics(academicHistory, academicInsights);
                
                // ðŸ’¾ Save Document Record
                var documentRecord = await SaveDocumentRecord(new DocumentRecord
                {
                    DocumentType = "Transcript",
                    StudentId = request.StudentId,
                    FileName = $"Transcript_{academicHistory.Student.Name}_{DateTime.Now:yyyyMMdd}.pdf",
                    FilePath = await SaveDocumentToStorage(pdfBytes, $"Transcript_{academicHistory.Student.Id}_{DateTime.Now:yyyyMMdd}.pdf"),
                    GeneratedAt = DateTime.Now,
                    GeneratedBy = request.GeneratedBy,
                    TemplateUsed = request.Template,
                    AIEnhanced = true
                });

                // ðŸ” Add Security Features
                var securedTranscript = await AddTranscriptSecurity(pdfBytes, request.SecurityLevel);

                return new TranscriptResult
                {
                    Success = true,
                    DocumentId = documentRecord.Id,
                    PDFBytes = securedTranscript,
                    FileName = documentRecord.FileName,
                    AcademicHistory = academicHistory,
                    Insights = academicInsights,
                    Analytics = analytics,
                    SecurityFeatures = GetSecurityFeatures(request.SecurityLevel),
                    GeneratedAt = documentRecord.GeneratedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Transcript generation failed");
                return new TranscriptResult
                {
                    Success = false,
                    Error = ex.Message,
                    GeneratedAt = DateTime.Now
                };
            }
        }

        // ðŸ† Auto-Generate Certificates
        public async Task<CertificateResult> GenerateCertificateAsync(CertificateRequest request)
        {
            try
            {
                // ðŸ“Š Get Certificate Data
                var certificateData = await GetCertificateData(request);
                
                // ðŸ§  AI-Powered Certificate Design
                var designOptimization = await _aiService.OptimizeCertificateDesignAsync(new CertificateDesignRequest
                {
                    CertificateType = request.CertificateType,
                    StudentData = certificateData,
                    SchoolBranding = await GetSchoolBranding(),
                    ComplianceRequirements = await GetCertificateCompliance(request.CertificateType)
                });
                
                // ðŸ“„ Generate Certificate PDF
                var pdfBytes = await GenerateCertificatePDF(certificateData, designOptimization, request.Template);
                
                // ðŸ” Add Certificate Security
                var securedCertificate = await AddCertificateSecurity(pdfBytes, request.CertificateType);
                
                // ðŸ“Š Generate Verification Code
                var verificationCode = await GenerateVerificationCode(certificateData, securedCertificate);
                
                // ðŸ’¾ Save Document Record
                var documentRecord = await SaveDocumentRecord(new DocumentRecord
                {
                    DocumentType = "Certificate",
                    StudentId = certificateData.Student.Id,
                    FileName = $"{request.CertificateType}_{certificateData.Student.Name}_{DateTime.Now:yyyyMMdd}.pdf",
                    FilePath = await SaveDocumentToStorage(securedCertificate, $"{request.CertificateType}_{certificateData.Student.Id}_{DateTime.Now:yyyyMMdd}.pdf"),
                    GeneratedAt = DateTime.Now,
                    GeneratedBy = request.GeneratedBy,
                    TemplateUsed = request.Template,
                    AIEnhanced = true,
                    VerificationCode = verificationCode
                });

                // ðŸ“§ Send Certificate
                if (request.SendToStudent)
                {
                    await SendCertificateToStudent(documentRecord, certificateData.Student);
                }

                return new CertificateResult
                {
                    Success = true,
                    DocumentId = documentRecord.Id,
                    PDFBytes = securedCertificate,
                    FileName = documentRecord.FileName,
                    VerificationCode = verificationCode,
                    CertificateData = certificateData,
                    DesignOptimization = designOptimization,
                    SecurityFeatures = GetCertificateSecurityFeatures(request.CertificateType),
                    GeneratedAt = documentRecord.GeneratedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Certificate generation failed");
                return new CertificateResult
                {
                    Success = false,
                    Error = ex.Message,
                    GeneratedAt = DateTime.Now
                };
            }
        }

        // ðŸ’° Auto-Generate Fee Statements
        public async Task<FeeStatementResult> GenerateFeeStatementAsync(FeeStatementRequest request)
        {
            try
            {
                // ðŸ“Š Get Fee Data
                var feeData = await GetFeeStatementData(request.ParentId, request.Period);
                
                // ðŸ§  AI-Powered Fee Analysis
                var feeInsights = await _aiService.AnalyzeFeePatternsAsync(new FeeAnalysisRequest
                {
                    ParentId = request.ParentId,
                    FeeData = feeData,
                    IncludePredictions = request.IncludePredictions,
                    IncludePaymentRecommendations = true
                });
                
                // ðŸ“„ Generate PDF Fee Statement
                var pdfBytes = await GenerateFeeStatementPDF(feeData, feeInsights, request.Template);
                
                // ðŸ“Š Generate Fee Analytics
                var analytics = await GenerateFeeStatementAnalytics(feeData, feeInsights);
                
                // ðŸ’¾ Save Document Record
                var documentRecord = await SaveDocumentRecord(new DocumentRecord
                {
                    DocumentType = "FeeStatement",
                    ParentId = request.ParentId,
                    FileName = $"FeeStatement_{feeData.Parent.Name}_{request.Period}.pdf",
                    FilePath = await SaveDocumentToStorage(pdfBytes, $"FeeStatement_{feeData.Parent.Id}_{request.Period}.pdf"),
                    GeneratedAt = DateTime.Now,
                    GeneratedBy = request.GeneratedBy,
                    TemplateUsed = request.Template,
                    AIEnhanced = true
                });

                // ðŸ“§ Send Statement
                if (request.SendToParent)
                {
                    await SendFeeStatementToParent(documentRecord, feeData.Parent);
                }

                return new FeeStatementResult
                {
                    Success = true,
                    DocumentId = documentRecord.Id,
                    PDFBytes = pdfBytes,
                    FileName = documentRecord.FileName,
                    FeeData = feeData,
                    Insights = feeInsights,
                    Analytics = analytics,
                    GeneratedAt = documentRecord.GeneratedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fee statement generation failed");
                return new FeeStatementResult
                {
                    Success = false,
                    Error = ex.Message,
                    GeneratedAt = DateTime.Now
                };
            }
        }

        // ðŸ“‹ Bulk Document Generation
        public async Task<BulkDocumentResult> GenerateBulkDocumentsAsync(BulkDocumentRequest request)
        {
            try
            {
                var results = new List<DocumentGenerationResult>();
                var totalProcessed = 0;
                var totalSuccessful = 0;

                // ðŸ“Š Process each document request
                foreach (var docRequest in request.DocumentRequests)
                {
                    totalProcessed++;

                    try
                    {
                        DocumentGenerationResult result = docRequest.DocumentType switch
                        {
                            "ReportCard" => await GenerateSingleReportCard(docRequest),
                            "Transcript" => await GenerateSingleTranscript(docRequest),
                            "Certificate" => await GenerateSingleCertificate(docRequest),
                            "FeeStatement" => await GenerateSingleFeeStatement(docRequest),
                            _ => throw new ArgumentException($"Unknown document type: {docRequest.DocumentType}")
                        };

                        results.Add(result);
                        
                        if (result.Success)
                        {
                            totalSuccessful++;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Failed to generate {docRequest.DocumentType} for {docRequest.EntityId}");
                        results.Add(new DocumentGenerationResult
                        {
                            Success = false,
                            DocumentType = docRequest.DocumentType,
                            EntityId = docRequest.EntityId,
                            Error = ex.Message
                        });
                    }
                }

                // ðŸ“Š Generate Bulk Analytics
                var bulkAnalytics = await GenerateBulkDocumentAnalytics(results);

                // ðŸ“§ Send Bulk Notifications
                if (request.SendNotifications)
                {
                    await SendBulkDocumentNotifications(results);
                }

                return new BulkDocumentResult
                {
                    Success = true,
                    TotalProcessed = totalProcessed,
                    TotalSuccessful = totalSuccessful,
                    SuccessRate = (double)totalSuccessful / totalProcessed * 100,
                    Results = results,
                    Analytics = bulkAnalytics,
                    GeneratedAt = DateTime.Now
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bulk document generation failed");
                return new BulkDocumentResult
                {
                    Success = false,
                    Error = ex.Message,
                    GeneratedAt = DateTime.Now
                };
            }
        }

        // ðŸŽ¨ Template Management
        public async Task<TemplateResult> CreateTemplateAsync(TemplateRequest request)
        {
            try
            {
                // ðŸ§  AI-Powered Template Design
                var templateDesign = await _aiService.DesignTemplateAsync(new TemplateDesignRequest
                {
                    DocumentType = request.DocumentType,
                    Requirements = request.Requirements,
                    SchoolBranding = await GetSchoolBranding(),
                    ComplianceRequirements = await GetTemplateCompliance(request.DocumentType),
                    UserPreferences = request.UserPreferences
                });

                // ðŸ“„ Create Template HTML
                var templateHtml = await GenerateTemplateHTML(templateDesign);
                
                // ðŸŽ¨ Create Template CSS
                var templateCSS = await GenerateTemplateCSS(templateDesign);
                
                // ðŸ’¾ Save Template
                var template = new DocumentTemplate
                {
                    Name = request.Name,
                    DocumentType = request.DocumentType,
                    HTMLContent = templateHtml,
                    CSSContent = templateCSS,
                    DesignMetadata = System.Text.Json.JsonSerializer.Serialize(templateDesign),
                    CreatedBy = request.CreatedBy,
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    Version = "1.0"
                };

                _context.DocumentTemplates.Add(template);
                await _context.SaveChangesAsync();

                // ðŸ§ª Test Template
                var testResult = await TestTemplate(template);

                return new TemplateResult
                {
                    Success = true,
                    TemplateId = template.Id,
                    Name = template.Name,
                    Design = templateDesign,
                    TestResult = testResult,
                    CreatedAt = template.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Template creation failed");
                return new TemplateResult
                {
                    Success = false,
                    Error = ex.Message,
                    CreatedAt = DateTime.Now
                };
            }
        }

        // ðŸ“… Scheduled Document Generation
        public async Task<ScheduledDocumentResult> ScheduleDocumentGenerationAsync(ScheduleRequest request)
        {
            try
            {
                // ðŸ“Š Create Schedule
                var schedule = new DocumentGenerationSchedule
                {
                    Name = request.Name,
                    DocumentType = request.DocumentType,
                    ScheduleType = request.ScheduleType,
                    Frequency = request.Frequency,
                    NextRunTime = CalculateNextRunTime(request.ScheduleType, request.Frequency),
                    Parameters = System.Text.Json.JsonSerializer.Serialize(request.Parameters),
                    IsActive = true,
                    CreatedBy = request.CreatedBy,
                    CreatedAt = DateTime.Now
                };

                _context.DocumentGenerationSchedules.Add(schedule);
                await _context.SaveChangesAsync();

                // ðŸ§  AI-Powered Schedule Optimization
                var optimization = await _aiService.OptimizeScheduleAsync(new ScheduleOptimizationRequest
                {
                    Schedule = schedule,
                    SystemLoad = await GetSystemLoad(),
                    UserActivity = await GetUserActivityPatterns(),
                    ResourceAvailability = await GetResourceAvailability()
                });

                // ðŸ“§ Send Confirmation
                await SendScheduleConfirmation(schedule);

                return new ScheduledDocumentResult
                {
                    Success = true,
                    ScheduleId = schedule.Id,
                    NextRunTime = schedule.NextRunTime,
                    Optimization = optimization,
                    CreatedAt = schedule.CreatedAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Schedule creation failed");
                return new ScheduledDocumentResult
                {
                    Success = false,
                    Error = ex.Message,
                    CreatedAt = DateTime.Now
                };
            }
        }

        // ðŸ”§ Helper Methods
        private async Task<byte[]> GenerateReportCardPDF(StudentReportData studentData, GeneratedComments aiComments, string template)
        {
            using (var stream = new MemoryStream())
            {
                var document = new Document(PageSize.A4);
                var writer = PdfWriter.GetInstance(stream, document);

                document.Open();

                // ðŸŽ¨ Apply Template Styling
                ApplyTemplateStyling(writer, template);

                // ðŸ“„ Add Header
                AddReportCardHeader(writer, studentData, template);

                // ðŸ‘¤ Add Student Information
                AddStudentInfo(writer, studentData, template);

                // ðŸ“Š Add Grades Table
                AddGradesTable(writer, studentData.Grades, template);

                // ðŸ“ Add AI Comments
                AddAIComments(writer, aiComments, template);

                // ðŸ“ˆ Add Performance Chart
                AddPerformanceChart(writer, studentData, template);

                // ðŸ“‹ Add Attendance Summary
                AddAttendanceSummary(writer, studentData.Attendance, template);

                // ðŸ” Add Footer with Security
                AddSecurityFooter(writer, studentData, template);

                document.Close();

                return stream.ToArray();
            }
        }

        private async Task<byte[]> GenerateTranscriptPDF(AcademicHistory academicHistory, AcademicInsights insights, string template)
        {
            using (var stream = new MemoryStream())
            {
                var document = new Document(PageSize.A4);
                var writer = PdfWriter.GetInstance(stream, document);

                document.Open();

                // ðŸŽ¨ Apply Template Styling
                ApplyTemplateStyling(writer, template);

                // ðŸ“„ Add Header
                AddTranscriptHeader(writer, academicHistory, template);

                // ðŸ‘¤ Add Student Information
                AddStudentInfo(writer, academicHistory.Student, template);

                // ðŸ“š Add Academic Summary
                AddAcademicSummary(writer, academicHistory, insights, template);

                // ðŸ“Š Add Term-by-Term Performance
                AddTermPerformance(writer, academicHistory.Terms, template);

                // ðŸ“ˆ Add Performance Trends
                AddPerformanceTrends(writer, insights, template);

                // ðŸ† Add Achievements
                AddAchievements(writer, academicHistory.Achievements, template);

                // ðŸ” Add Security Features
                AddTranscriptSecurity(writer, academicHistory, template);

                document.Close();

                return stream.ToArray();
            }
        }

        private async Task<byte[]> GenerateCertificatePDF(CertificateData certificateData, CertificateDesign design, string template)
        {
            using (var stream = new MemoryStream())
            {
                var document = new Document(PageSize.A4.Rotate());
                var writer = PdfWriter.GetInstance(stream, document);

                document.Open();

                // ðŸŽ¨ Apply Certificate Design
                ApplyCertificateDesign(writer, design);

                // ðŸ« Add School Header
                AddSchoolHeader(writer, certificateData.School, design);

                // ðŸ† Add Certificate Title
                AddCertificateTitle(writer, certificateData.CertificateType, design);

                // ðŸ‘¤ Add Recipient Information
                AddRecipientInfo(writer, certificateData.Student, design);

                // ðŸ“ Add Certificate Text
                AddCertificateText(writer, certificateData, design);

                // ðŸ“… Add Date and Signatures
                AddCertificateSignatures(writer, certificateData, design);

                // ðŸ” Add Security Features
                AddCertificateSecurity(writer, certificateData, design);

                document.Close();

                return stream.ToArray();
            }
        }

        private async Task<byte[]> GenerateFeeStatementPDF(FeeStatementData feeData, FeeInsights insights, string template)
        {
            using (var stream = new MemoryStream())
            {
                var document = new Document(PageSize.A4);
                var writer = PdfWriter.GetInstance(stream, document);

                document.Open();

                // ðŸŽ¨ Apply Template Styling
                ApplyTemplateStyling(writer, template);

                // ðŸ“„ Add Header
                AddFeeStatementHeader(writer, feeData, template);

                // ðŸ‘¤ Add Parent Information
                AddParentInfo(writer, feeData.Parent, template);

                // ðŸ“Š Add Fee Summary
                AddFeeSummary(writer, feeData, insights, template);

                // ðŸ’³ Add Payment History
                AddPaymentHistory(writer, feeData.Payments, template);

                // ðŸ“ˆ Add Payment Analytics
                AddPaymentAnalytics(writer, insights, template);

                // ðŸ”” Add Next Payment Reminder
                AddPaymentReminder(writer, feeData, template);

                document.Close();

                return stream.ToArray();
            }
        }

        // ðŸŽ¨ PDF Generation Helper Methods
        private void ApplyTemplateStyling(PdfWriter writer, string template)
        {
            // ðŸŽ¨ Apply template-specific styling
            var contentByte = writer.DirectContent;
            
            // Add background if specified in template
            if (template.Contains("background"))
            {
                AddBackground(contentByte, template);
            }
        }

        private void AddReportCardHeader(PdfWriter writer, StudentReportData studentData, string template)
        {
            // ðŸ“„ Add report card header with school logo and information
            var table = new PdfPTable(3);
            table.WidthPercentage = 100;

            // School Logo
            var logoCell = new PdfPCell();
            logoCell.Border = Rectangle.NO_BORDER;
            // Add school logo image here
            table.AddCell(logoCell);

            // School Name
            var schoolCell = new PdfPCell(new Phrase(studentData.School.Name, GetFont("Header", 16, Font.BOLD)));
            schoolCell.Border = Rectangle.NO_BORDER;
            schoolCell.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(schoolCell);

            // Report Card Title
            var titleCell = new PdfPCell(new Phrase("REPORT CARD", GetFont("Header", 14, Font.BOLD)));
            titleCell.Border = Rectangle.NO_BORDER;
            titleCell.HorizontalAlignment = Element.ALIGN_RIGHT;
            table.AddCell(titleCell);

            writer.AddElement(table);
        }

        private void AddStudentInfo(PdfWriter writer, StudentReportData studentData, string template)
        {
            // ðŸ‘¤ Add student information section
            var table = new PdfPTable(2);
            table.WidthPercentage = 100;

            AddTableRow(table, "Student Name:", studentData.Student.Name);
            AddTableRow(table, "Grade:", studentData.Student.Grade.ToString());
            AddTableRow(table, "Class:", studentData.Student.Class);
            AddTableRow(table, "Term:", studentData.Term.Name);
            AddTableRow(table, "Academic Year:", studentData.Term.AcademicYear.ToString());

            writer.AddElement(table);
        }

        private void AddGradesTable(PdfWriter writer, List<SubjectGrade> grades, string template)
        {
            // ðŸ“Š Add grades table
            var table = new PdfPTable(5);
            table.WidthPercentage = 100;

            // Headers
            AddTableHeaderCell(table, "Subject");
            AddTableHeaderCell(table, "Teacher");
            AddTableHeaderCell(table, "Score");
            AddTableHeaderCell(table, "Grade");
            AddTableHeaderCell(table, "Remarks");

            // Grade data
            foreach (var grade in grades)
            {
                table.AddCell(new Phrase(grade.Subject, GetFont("Body", 10)));
                table.AddCell(new Phrase(grade.Teacher, GetFont("Body", 10)));
                table.AddCell(new Phrase(grade.Score.ToString("F1"), GetFont("Body", 10)));
                table.AddCell(new Phrase(grade.Grade, GetFont("Body", 10)));
                table.AddCell(new Phrase(grade.Remarks, GetFont("Body", 9)));
            }

            writer.AddElement(table);
        }

        private void AddAIComments(PdfWriter writer, GeneratedComments aiComments, string template)
        {
            // ðŸ“ Add AI-generated comments section
            var title = new Paragraph("AI-Generated Comments", GetFont("Header", 12, Font.BOLD));
            title.SpacingAfter = 10;
            writer.AddElement(title);

            var comments = new Paragraph(aiComments.OverallComments, GetFont("Body", 10));
            comments.SpacingAfter = 10;
            writer.AddElement(comments);

            // Add specific comments
            var academicComment = new Paragraph($"Academic Performance: {aiComments.AcademicComments}", GetFont("Body", 10));
            academicComment.SpacingAfter = 5;
            writer.AddElement(academicComment);

            var attendanceComment = new Paragraph($"Attendance: {aiComments.AttendanceComments}", GetFont("Body", 10));
            attendanceComment.SpacingAfter = 5;
            writer.AddElement(attendanceComment);
        }

        private void AddPerformanceChart(PdfWriter writer, StudentReportData studentData, string template)
        {
            // ðŸ“ˆ Add performance chart (placeholder for actual chart implementation)
            var chartTitle = new Paragraph("Performance Overview", GetFont("Header", 12, Font.BOLD));
            chartTitle.SpacingAfter = 10;
            writer.AddElement(chartTitle);

            // Add chart placeholder
            var chartPlaceholder = new Paragraph("[Performance Chart Would Be Generated Here]", GetFont("Body", 10, Font.ITALIC));
            chartPlaceholder.SpacingAfter = 10;
            writer.AddElement(chartPlaceholder);
        }

        private void AddAttendanceSummary(PdfWriter writer, AttendanceData attendance, string template)
        {
            // ðŸ“‹ Add attendance summary
            var title = new Paragraph("Attendance Summary", GetFont("Header", 12, Font.BOLD));
            title.SpacingAfter = 10;
            writer.AddElement(title);

            var table = new PdfPTable(2);
            table.WidthPercentage = 50;

            AddTableRow(table, "Total Days:", attendance.TotalDays.ToString());
            AddTableRow(table, "Days Present:", attendance.DaysPresent.ToString());
            AddTableRow(table, "Days Absent:", attendance.DaysAbsent.ToString());
            AddTableRow(table, "Attendance Rate:", $"{attendance.AttendanceRate:F1}%");

            writer.AddElement(table);
        }

        private void AddSecurityFooter(PdfWriter writer, StudentReportData studentData, string template)
        {
            // ðŸ” Add security footer with verification code
            var securityCode = GenerateSecurityCode(studentData);
            
            var footer = new Paragraph($"Verification Code: {securityCode}", GetFont("Security", 8, Font.ITALIC));
            footer.Alignment = Element.ALIGN_CENTER;
            footer.SpacingBefore = 20;
            writer.AddElement(footer);
        }

        // ðŸŽ¨ Font and Styling Helpers
        private Font GetFont(string type, int size, int style = Font.NORMAL)
        {
            // ðŸŽ¨ Get font based on type and style
            var fontPath = type switch
            {
                "Header" => "fonts/Arial.ttf",
                "Body" => "fonts/Arial.ttf",
                "Security" => "fonts/Arial.ttf",
                _ => "fonts/Arial.ttf"
            };

            return FontFactory.GetFont(fontPath, "Identity-H", true, size, style, BaseColor.BLACK);
        }

        private void AddTableRow(PdfPTable table, string label, string value)
        {
            table.AddCell(new Phrase(label, GetFont("Body", 10, Font.BOLD)));
            table.AddCell(new Phrase(value, GetFont("Body", 10)));
        }

        private void AddTableHeaderCell(PdfPTable table, string text)
        {
            var cell = new PdfPCell(new Phrase(text, GetFont("Header", 10, Font.BOLD)));
            cell.BackgroundColor = BaseColor.LIGHT_GRAY;
            cell.HorizontalAlignment = Element.ALIGN_CENTER;
            table.AddCell(cell);
        }

        // ðŸ” Security Methods
        private string GenerateSecurityCode(StudentReportData studentData)
        {
            // ðŸ” Generate unique verification code
            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var studentHash = studentData.Student.Id.ToString("X");
            return $"RC-{studentHash}-{timestamp}";
        }

        private async Task<byte[]> AddTranscriptSecurity(byte[] pdfBytes, string securityLevel)
        {
            // ðŸ” Add security features to transcript
            if (securityLevel == "High")
            {
                // Add watermark
                pdfBytes = await AddWatermark(pdfBytes, "OFFICIAL TRANSCRIPT");
                
                // Add digital signature
                pdfBytes = await AddDigitalSignature(pdfBytes);
                
                // Add encryption
                pdfBytes = await EncryptPDF(pdfBytes);
            }

            return pdfBytes;
        }

        private async Task<byte[]> AddCertificateSecurity(byte[] pdfBytes, string certificateType)
        {
            // ðŸ” Add certificate-specific security
            pdfBytes = await AddWatermark(pdfBytes, certificateType.ToUpper());
            pdfBytes = await AddQRCode(pdfBytes, "verification");
            pdfBytes = await AddHologram(pdfBytes);

            return pdfBytes;
        }

        // ðŸ“Š Data Retrieval Methods
        private async Task<StudentReportData> GetStudentReportData(Guid studentId, Guid termId)
        {
            // ðŸ“Š Get comprehensive student report data
            var student = await _context.Students
                .Include(s => s.School)
                .Include(s => s.Grades.Where(g => g.TermId == termId))
                .Include(s => s.Attendances.Where(a => a.TermId == termId))
                .Include(s => s.Term)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            return new StudentReportData
            {
                Student = student,
                School = student.School,
                Term = student.Term,
                Grades = student.Grades.Select(g => new SubjectGrade
                {
                    Subject = g.Subject.Name,
                    Teacher = g.Teacher.Name,
                    Score = g.Score,
                    Grade = g.GradeLetter,
                    Remarks = g.Comments
                }).ToList(),
                Attendance = new AttendanceData
                {
                    TotalDays = student.Attendances.Count,
                    DaysPresent = student.Attendances.Count(a => a.Status == "Present"),
                    DaysAbsent = student.Attendances.Count(a => a.Status == "Absent"),
                    AttendanceRate = student.Attendances.Count > 0 
                        ? (double)student.Attendances.Count(a => a.Status == "Present") / student.Attendances.Count * 100 
                        : 0
                }
            };
        }

        private async Task<AcademicHistory> GetStudentAcademicHistory(Guid studentId)
        {
            // ðŸ“Š Get complete academic history
            var student = await _context.Students
                .Include(s => s.School)
                .Include(s => s.Grades)
                .Include(s => s.Attendances)
                .Include(s => s.Achievements)
                .Include(s => s.Terms)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            return new AcademicHistory
            {
                Student = student,
                School = student.School,
                Terms = student.Terms.Select(t => new TermData
                {
                    TermId = t.Id,
                    Name = t.Name,
                    AcademicYear = t.AcademicYear,
                    Grades = student.Grades.Where(g => g.TermId == t.Id).ToList(),
                    Attendance = student.Attendances.Where(a => a.TermId == t.Id).ToList()
                }).ToList(),
                Achievements = student.Achievements.ToList()
            };
        }

        private async Task<CertificateData> GetCertificateData(CertificateRequest request)
        {
            // ðŸ“Š Get certificate data based on type
            switch (request.CertificateType)
            {
                case "AcademicExcellence":
                    return await GetAcademicExcellenceCertificateData(request.StudentId);
                case "Attendance":
                    return await GetAttendanceCertificateData(request.StudentId);
                case "Sports":
                    return await GetSportsCertificateData(request.StudentId);
                default:
                    throw new ArgumentException($"Unknown certificate type: {request.CertificateType}");
            }
        }

        private async Task<FeeStatementData> GetFeeStatementData(Guid parentId, string period)
        {
            // ðŸ“Š Get fee statement data
            var parent = await _context.Parents
                .Include(p => p.Students)
                .Include(p => p.FeePayments)
                .FirstOrDefaultAsync(p => p.Id == parentId);

            return new FeeStatementData
            {
                Parent = parent,
                Students = parent.Students.ToList(),
                Payments = parent.FeePayments.Where(p => IsPaymentInPeriod(p.PaymentDate, period)).ToList(),
                Period = period
            };
        }

        // Additional helper methods...
        private bool IsPaymentInPeriod(DateTime paymentDate, string period)
        {
            // ðŸ“… Check if payment is in specified period
            return period switch
            {
                "Monthly" => paymentDate >= DateTime.Now.AddMonths(-1),
                "Quarterly" => paymentDate >= DateTime.Now.AddMonths(-3),
                "Yearly" => paymentDate >= DateTime.Now.AddYears(-1),
                _ => true
            };
        }

        private DateTime CalculateNextRunTime(string scheduleType, string frequency)
        {
            // ðŸ“… Calculate next run time based on schedule
            return scheduleType switch
            {
                "Daily" => DateTime.Now.AddDays(1),
                "Weekly" => DateTime.Now.AddDays(7),
                "Monthly" => DateTime.Now.AddMonths(1),
                "Quarterly" => DateTime.Now.AddMonths(3),
                _ => DateTime.Now.AddDays(1)
            };
        }

        private async Task<DocumentRecord> SaveDocumentRecord(DocumentRecord record)
        {
            // ðŸ’¾ Save document record to database
            _context.DocumentRecords.Add(record);
            await _context.SaveChangesAsync();
            return record;
        }

        private async Task<string> SaveDocumentToStorage(byte[] documentBytes, string fileName)
        {
            // ðŸ’¾ Save document to storage system
            var filePath = Path.Combine("documents", fileName);
            await File.WriteAllBytesAsync(filePath, documentBytes);
            return filePath;
        }

        // Additional implementation methods would go here...
        // (Due to length, showing main structure)
    }

    // ðŸŽ¯ Data Models for Document Automation
    public class ReportCardRequest
    {
        public Guid studentId { get; set; }
        public Guid termId { get; set; }
        public string Template { get; set; }
        public bool SendToParents { get; set; }
        public int GeneratedBy { get; set; }
    }

    public class ReportCardResult
    {
        public bool Success { get; set; }
        public int DocumentId { get; set; }
        public byte[] PDFBytes { get; set; }
        public string FileName { get; set; }
        public StudentReportData StudentData { get; set; }
        public GeneratedComments AIComments { get; set; }
        public ReportCardAnalytics Analytics { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string Error { get; set; }
    }

    public class TranscriptRequest
    {
        public Guid studentId { get; set; }
        public string Template { get; set; }
        public string SecurityLevel { get; set; }
        public bool IncludePredictions { get; set; }
        public bool IncludeRecommendations { get; set; }
        public int GeneratedBy { get; set; }
    }

    public class TranscriptResult
    {
        public bool Success { get; set; }
        public int DocumentId { get; set; }
        public byte[] PDFBytes { get; set; }
        public string FileName { get; set; }
        public AcademicHistory AcademicHistory { get; set; }
        public AcademicInsights Insights { get; set; }
        public TranscriptAnalytics Analytics { get; set; }
        public List<SecurityFeature> SecurityFeatures { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string Error { get; set; }
    }

    public class CertificateRequest
    {
        public Guid studentId { get; set; }
        public string CertificateType { get; set; }
        public string Template { get; set; }
        public bool SendToStudent { get; set; }
        public int GeneratedBy { get; set; }
    }

    public class CertificateResult
    {
        public bool Success { get; set; }
        public int DocumentId { get; set; }
        public byte[] PDFBytes { get; set; }
        public string FileName { get; set; }
        public string VerificationCode { get; set; }
        public CertificateData CertificateData { get; set; }
        public CertificateDesign DesignOptimization { get; set; }
        public List<SecurityFeature> SecurityFeatures { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string Error { get; set; }
    }

    public class FeeStatementRequest
    {
        public Guid parentId { get; set; }
        public string Period { get; set; }
        public string Template { get; set; }
        public bool IncludePredictions { get; set; }
        public bool SendToParent { get; set; }
        public int GeneratedBy { get; set; }
    }

    public class FeeStatementResult
    {
        public bool Success { get; set; }
        public int DocumentId { get; set; }
        public byte[] PDFBytes { get; set; }
        public string FileName { get; set; }
        public FeeStatementData FeeData { get; set; }
        public FeeInsights Insights { get; set; }
        public FeeStatementAnalytics Analytics { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string Error { get; set; }
    }

    public class BulkDocumentRequest
    {
        public List<SingleDocumentRequest> DocumentRequests { get; set; }
        public bool SendNotifications { get; set; }
        public int GeneratedBy { get; set; }
    }

    public class BulkDocumentResult
    {
        public bool Success { get; set; }
        public int TotalProcessed { get; set; }
        public int TotalSuccessful { get; set; }
        public double SuccessRate { get; set; }
        public List<DocumentGenerationResult> Results { get; set; }
        public BulkDocumentAnalytics Analytics { get; set; }
        public DateTime GeneratedAt { get; set; }
        public string Error { get; set; }
    }

    // Supporting data models...
    public class StudentReportData
    {
        public Student Student { get; set; }
        public School School { get; set; }
        public Term Term { get; set; }
        public List<SubjectGrade> Grades { get; set; }
        public AttendanceData Attendance { get; set; }
    }

    public class SubjectGrade
    {
        public string Subject { get; set; }
        public string Teacher { get; set; }
        public double Score { get; set; }
        public string Grade { get; set; }
        public string Remarks { get; set; }
    }

    public class AttendanceData
    {
        public int TotalDays { get; set; }
        public int DaysPresent { get; set; }
        public int DaysAbsent { get; set; }
        public double AttendanceRate { get; set; }
    }

    public class GeneratedComments
    {
        public string AcademicComments { get; set; }
        public string AttendanceComments { get; set; }
        public string BehavioralComments { get; set; }
        public string OverallComments { get; set; }
        public string PersonalizationLevel { get; set; }
        public string Tone { get; set; }
        public string Language { get; set; }
        public DateTime GeneratedDate { get; set; }
    }

    // Additional supporting classes would be defined here...
    // (Due to length, showing main structure)
}
