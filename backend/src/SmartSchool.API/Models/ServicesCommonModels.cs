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
using System;
using System.Collections.Generic;

namespace SmartSchool.API.Models
{
    // Common models for Phase 6 Services
    public class BankTransferResult { public bool Success { get; set; } public string? TransactionId { get; set; } public string Message { get; set; } = string.Empty; public string? EstimatedCompletion { get; set; } }
    public class CBZTransferRequest { public string AccountNumber { get; set; } = string.Empty; public decimal Amount { get; set; } public Guid StudentId { get; set; } public Guid ParentId { get; set; } public string StudentName { get; set; } = string.Empty; public string SchoolName { get; set; } = string.Empty; public Guid FeeId { get; set; } }
    public class CBZResponse { public string TransactionId { get; set; } = string.Empty; public string Status { get; set; } = string.Empty; }
    public class BankTransaction { public string TransactionId { get; set; } = string.Empty; public string Bank { get; set; } = string.Empty; public decimal Amount { get; set; } public Guid StudentId { get; set; } public Guid ParentId { get; set; } public Guid FeeId { get; set; } public string Status { get; set; } = string.Empty; public DateTime CreatedDate { get; set; } public DateTime EstimatedCompletion { get; set; } }
    
    public class StewardPaymentRequest { public string PhoneNumber { get; set; } = string.Empty; public decimal Amount { get; set; } public Guid StudentId { get; set; } public Guid ParentId { get; set; } }
    public class StewardResponse { public string Reference { get; set; } = string.Empty; public string Status { get; set; } = string.Empty; }
    
    public class EcoCashPaymentRequest { public string PhoneNumber { get; set; } = string.Empty; public decimal Amount { get; set; } public Guid StudentId { get; set; } public string MerchantCode { get; set; } = string.Empty; }
    public class EcoCashResponse { public string CorrelatorId { get; set; } = string.Empty; public string Status { get; set; } = string.Empty; }
    
    public class GovernmentReportRequest { public string ReportType { get; set; } = string.Empty; public Guid AcademicYearId { get; set; } public List<string> Modules { get; set; } = new(); }
    public class GovernmentReportResult { public string ReportId { get; set; } = string.Empty; public string Status { get; set; } = string.Empty; public string DownloadUrl { get; set; } = string.Empty; }
    
    public class DocumentRequest { public string TemplateCode { get; set; } = string.Empty; public Dictionary<string, string> Data { get; set; } = new(); public Guid StudentId { get; set; } }
    public class DocumentResult { public string DocumentId { get; set; } = string.Empty; public string Url { get; set; } = string.Empty; }
    
    // Sync and Analytics
    public record SyncRequest(Guid TenantId, Guid SchoolId, DateTime LastSyncAt);
    public record PagedResponse<T>(T[] Data, int TotalCount, int Page, int PageSize);
    public record SyncResponse(bool Success, string Message, DateTime SyncedAt);
    public record SyncConflict(string Type, string ItemId, object LocalData, object RemoteData, string ConflictReason);
    public record ResolvedConflict(string ConflictId, string Resolution, object ResolvedData, bool Success, string ResolutionMethod, double Confidence);
    public record ConflictResolutionResult(List<ResolvedConflict> ResolvedConflicts, object ConflictPatterns, object Recommendations, double ResolutionRate, DateTime ProcessingTime);
    public record SyncAnalyticsRequest(Guid TenantId, Guid SchoolId, DateTime? StartDate, DateTime? EndDate);
    public record SyncPerformanceMetrics(int TotalSyncSessions, int SuccessfulSyncs, int FailedSyncs, double AverageSyncTime, double AverageDataSize, double SuccessRate, object NetworkQualityDistribution, object DeviceTypeDistribution);
    public record SyncAnalytics(object Period, SyncPerformanceMetrics PerformanceMetrics, object UserEngagement, object GeographicDistribution, object Insights, object Trends, object Recommendations, DateTime GeneratedAt);
    public record BackgroundSyncRequest(int UserId, object DeviceCapabilities, double BatteryLevel, string NetworkConditions);
    public record BackgroundSyncResult(string SyncTaskId, object Configuration, DateTime EstimatedCompletion, List<string> DataToSync, string Priority, double Confidence);
    public record SyncExecutionResult(List<SyncedItem> SyncedItems, List<SyncConflict> Conflicts, DateTime StartTime, DateTime EndTime = default, double EstimatedTime = 0, bool Success = false);
    public record SyncedItem(string Type, string ItemId, string Status, DateTime SyncTime, double Size);

    // Profile and Data Models
    public record StudentProfile(Guid StudentId, string Name, string Grade, string Class, string? ProfilePicture, DateTime EnrollmentDate);
    public record GradeData(Guid GradeId, string Subject, decimal Score, string GradeLetter, string Term, DateTime Date);
    public record AssignmentData(Guid AssignmentId, string Title, string Subject, DateTime DueDate, string Description, string Priority);
    public record NotificationData(Guid Id, string Title, string Content, DateTime SentAt, bool IsRead);
    public record TeacherProfile(Guid TeacherId, string Name, string Department, string Email, string Phone);
    public record ClassData(Guid ClassId, string Name, string Grade, int StudentCount, string Subject);
    public record AttendanceRecord(Guid StudentId, DateTime Date, bool IsPresent, string? Reason);
    public record GradeSubmission(Guid GradeId, Guid StudentId, decimal Score, DateTime SubmittedAt);
    public record ParentProfile(Guid ParentId, string Name, string Email, string Phone);
    public record ChildData(Guid StudentId, string Name, string Grade, string Class);
    public record FeeStatement(Guid StudentId, decimal TotalBilled, decimal TotalPaid, decimal Balance, List<Payment> RecentPayments);

    // Technical Models
    public record NetworkRequirements(bool WifiOnly, bool LowDataMode, int MinSpeedKbps);
    public record DevicePerformance(double CPU, double Memory, double Storage, double Battery);
    public record UserActivityPattern(string ActivityType, DateTime TimeOfDay, double Frequency);
    public record SyncBackgroundTask(string TaskId, DateTime EstimatedCompletion, List<string> DataToSync, string Priority);
    public record UserEngagementAnalytics(int ActiveUsers, double AverageSyncsPerUser, int PeakSyncTime, string MostActiveDay);
    public record GeographicDistribution(int UrbanUsers, int RuralUsers, int InternationalUsers);
    public record SyncTrend(string TrendType, double Value, DateTime Date);
    public record SyncRecommendation(string Type, string Priority, string Description, string Action);
    public record CriticalDataItem(string Type, object Data, int Priority, double Size, DateTime LastModified);
    public record ImportantDataItem(string Type, object Data, int Priority, double Size, DateTime LastModified);
    public record OptionalDataItem(string Type, object Data, int Priority, double Size, DateTime LastModified);
    public record SyncDataResult(bool Success, object? RemoteData = null, string? Error = null);
    public record SyncAnalyticsData(int TotalItemsSynced, double TotalDataSize, int ConflictsResolved, double AverageSyncTime, double NetworkUtilization, DevicePerformance DevicePerformance, double SuccessRate);
    
    public class SyncRequestItem { public Guid DeviceId { get; set; } public DateTime LastSyncAt { get; set; } public List<SyncDataItem> Changes { get; set; } = new(); }
    public class SyncDataItem { public string Table { get; set; } = string.Empty; public string Action { get; set; } = string.Empty; public string Data { get; set; } = string.Empty; }
    public class SyncResult { public bool Success { get; set; } public DateTime SyncAt { get; set; } public List<SyncDataItem> ServerChanges { get; set; } = new(); }
}
