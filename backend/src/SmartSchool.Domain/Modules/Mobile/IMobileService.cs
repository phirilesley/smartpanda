namespace SmartSchool.Domain.Modules.Mobile;

public interface IMobileService
{
    // Mobile Dashboards
    Task<StudentMobileDashboard> GetStudentDashboardAsync(Guid tenantId, Guid schoolId, string userId, CancellationToken cancellationToken = default);
    Task<ParentMobileDashboard> GetParentDashboardAsync(Guid tenantId, Guid schoolId, string userId, CancellationToken cancellationToken = default);
    Task<TeacherMobileDashboard> GetTeacherDashboardAsync(Guid tenantId, Guid schoolId, string userId, CancellationToken cancellationToken = default);
    
    // Offline Functionality
    Task<OfflineSyncData> GetOfflineSyncDataAsync(Guid tenantId, Guid schoolId, string userId, DateTime lastSyncTime, CancellationToken cancellationToken = default);
    Task<SyncUploadResult> ProcessOfflineDataUploadAsync(Guid tenantId, Guid schoolId, string userId, OfflineDataUpload uploadData, CancellationToken cancellationToken = default);
    
    // Push Notifications
    Task<PushRegistrationResult> RegisterForPushNotificationsAsync(string userId, PushNotificationRegistration registration, CancellationToken cancellationToken = default);
    Task UnregisterPushNotificationsAsync(string userId, PushNotificationUnrequest unrequest, CancellationToken cancellationToken = default);
    
    // Voice Commands
    Task<List<VoiceCommand>> GetAvailableVoiceCommandsAsync(string userId, string userType, CancellationToken cancellationToken = default);
    Task<VoiceCommandResult> ExecuteVoiceCommandAsync(string userId, VoiceCommandRequest request, CancellationToken cancellationToken = default);
    
    // Accessibility
    Task<AccessibilitySettings> GetAccessibilitySettingsAsync(string userId, CancellationToken cancellationToken = default);
    Task UpdateAccessibilitySettingsAsync(string userId, AccessibilitySettings settings, CancellationToken cancellationToken = default);
    
    // Gamification
    Task<GamificationProfile> GetGamificationProfileAsync(Guid tenantId, Guid schoolId, string userId, CancellationToken cancellationToken = default);
    Task<AchievementResult> UnlockAchievementAsync(Guid tenantId, Guid schoolId, string userId, AchievementUnlockRequest request, CancellationToken cancellationToken = default);
}

// Data Models
public class StudentMobileDashboard
{
    public string StudentId { get; init; } = string.Empty;
    public string StudentName { get; init; } = string.Empty;
    public string Grade { get; init; } = string.Empty;
    public string Section { get; init; } = string.Empty;
    public DateTime LastUpdated { get; init; }
    
    // Academic Overview
    public AcademicOverview AcademicOverview { get; init; } = new();
    
    // Today's Schedule
    public List<TodayClass> TodaySchedule { get; init; } = new();
    
    // Recent Assignments
    public List<RecentAssignment> RecentAssignments { get; init; } = new();
    
    // Recent Grades
    public List<RecentGrade> RecentGrades { get; init; } = new();
    
    // Attendance Summary
    public AttendanceSummary AttendanceSummary { get; init; } = new();
    
    // Notifications
    public List<MobileNotification> Notifications { get; init; } = new();
    
    // Quick Actions
    public List<QuickAction> QuickActions { get; init; } = new();
}

public class ParentMobileDashboard
{
    public string ParentId { get; init; } = string.Empty;
    public string ParentName { get; init; } = string.Empty;
    public List<ChildSummary> Children { get; init; } = new();
    public DateTime LastUpdated { get; init; }
    
    // Overview
    public ParentOverview Overview { get; init; } = new();
    
    // Recent Notifications
    public List<MobileNotification> Notifications { get; init; } = new();
    
    // Fee Status
    public List<FeeStatus> FeeStatuses { get; init; } = new();
    
    // Recent Activities
    public List<ChildActivity> RecentActivities { get; init; } = new();
    
    // Upcoming Events
    public List<SchoolEvent> UpcomingEvents { get; init; } = new();
    
    // Quick Actions
    public List<QuickAction> QuickActions { get; init; } = new();
}

public class TeacherMobileDashboard
{
    public string TeacherId { get; init; } = string.Empty;
    public string TeacherName { get; init; } = string.Empty;
    public List<string> Subjects { get; init; } = new();
    public DateTime LastUpdated { get; init; }
    
    // Today's Classes
    public List<TeacherClassSchedule> TodayClasses { get; init; } = new();
    
    // Pending Tasks
    public List<PendingTask> PendingTasks { get; init; } = new();
    
    // Student Statistics
    public TeacherStudentStats StudentStats { get; init; } = new();
    
    // Recent Messages
    public List<TeacherMessage> RecentMessages { get; init; } = new();
    
    // Attendance Summary
    public TeacherAttendanceSummary AttendanceSummary { get; init; } = new();
    
    // Quick Actions
    public List<QuickAction> QuickActions { get; init; } = new();
}

public class OfflineSyncData
{
    public DateTime SyncTimestamp { get; init; }
    public Guid SyncId { get; init; }
    
    // Student Data (if applicable)
    public List<StudentOfflineData> StudentData { get; init; } = new();
    
    // Schedule Data
    public List<ScheduleOfflineData> ScheduleData { get; init; } = new();
    
    // Assignment Data
    public List<AssignmentOfflineData> AssignmentData { get; init; } = new();
    
    // Notification Data
    public List<NotificationOfflineData> NotificationData { get; init; } = new();
    
    // Static Data (rarely changes)
    public StaticOfflineData StaticData { get; init; } = new();
    
    // Sync Configuration
    public SyncConfiguration SyncConfig { get; init; } = new();
}

public class OfflineDataUpload
{
    public Guid SyncId { get; init; }
    public DateTime UploadTimestamp { get; init; }
    public List<UploadedAttendanceData> AttendanceData { get; init; } = new();
    public List<UploadedAssignmentData> AssignmentData { get; init; } = new();
    public List<UploadedMessageData> MessageData { get; init; } = new();
    public List<UploadedBehaviorData> BehaviorData { get; init; } = new();
    public DeviceInfo DeviceInfo { get; init; } = new();
}

public class SyncUploadResult
{
    public bool Success { get; init; }
    public Guid SyncId { get; init; }
    public DateTime ProcessedAt { get; init; }
    public List<SyncItemResult> ItemResults { get; init; } = new();
    public List<SyncConflict> Conflicts { get; init; } = new();
    public List<string> Errors { get; init; } = new();
}

public class VoiceCommand
{
    public string CommandId { get; init; } = string.Empty;
    public string Phrase { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public List<string> Parameters { get; init; } = new();
    public List<string> ExamplePhrases { get; init; } = new();
    public bool IsEnabled { get; init; }
}

public class GamificationProfile
{
    public string UserId { get; init; } = string.Empty;
    public int TotalPoints { get; init; }
    public int CurrentLevel { get; init; }
    public int PointsToNextLevel { get; init; }
    public List<Achievement> Achievements { get; init; } = new();
    public List<Badge> Badges { get; init; } = new();
    public List<LeaderboardEntry> LeaderboardEntries { get; init; } = new();
    public StreakInfo CurrentStreak { get; init; } = new();
    public DateTime LastUpdated { get; init; }
}

// Supporting Models
public class AcademicOverview
{
    public double OverallGPA { get; init; }
    public int TotalSubjects { get; init; }
    public int PassingSubjects { get; init; }
    public List<SubjectGrade> SubjectGrades { get; init; } = new();
    public string AcademicStanding { get; init; } = string.Empty;
}

public class TodayClass
{
    public string Subject { get; init; } = string.Empty;
    public string Teacher { get; init; } = string.Empty;
    public string Room { get; init; } = string.Empty;
    public DateTime StartTime { get; init; }
    public DateTime EndTime { get; init; }
    public string Status { get; init; } = string.Empty; // "Upcoming", "In Progress", "Completed"
    public bool HasAssignment { get; init; }
}

public class RecentAssignment
{
    public string AssignmentId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public DateTime DueDate { get; init; }
    public string Status { get; init; } = string.Empty; // "Not Started", "In Progress", "Submitted", "Graded"
    public double? Grade { get; init; }
    public bool IsOverdue { get; init; }
}

public class RecentGrade
{
    public string GradeId { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public string Assessment { get; init; } = string.Empty;
    public double Score { get; init; }
    public double MaxScore { get; init; }
    public DateTime GradedDate { get; init; }
    public string GradeLetter { get; init; } = string.Empty;
}

public class AttendanceSummary
{
    public double AttendanceRate { get; init; }
    public int PresentDays { get; init; }
    public int AbsentDays { get; init; }
    public int LateDays { get; init; }
    public int TotalDays { get; init; }
    public string CurrentStatus { get; init; } = string.Empty;
}

public class MobileNotification
{
    public string Id { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public bool IsRead { get; init; }
    public string Priority { get; init; } = string.Empty;
    public Dictionary<string, object> Metadata { get; init; } = new();
}

public class QuickAction
{
    public string ActionId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Icon { get; init; } = string.Empty;
    public string Target { get; init; } = string.Empty;
    public bool IsEnabled { get; init; }
}

public class ChildSummary
{
    public string ChildId { get; init; } = string.Empty;
    public string ChildName { get; init; } = string.Empty;
    public string Grade { get; init; } = string.Empty;
    public string PhotoUrl { get; init; } = string.Empty;
    public bool HasUnreadNotifications { get; init; }
    public double? CurrentGPA { get; init; }
    public string AttendanceStatus { get; init; } = string.Empty;
}

public class ParentOverview
{
    public int TotalChildren { get; init; }
    public int ChildrenWithGoodGrades { get; init; }
    public int ChildrenWithAttendanceIssues { get; init; }
    public int UnreadNotifications { get; init; }
    public int PendingFees { get; init; }
    public List<SchoolEvent> UpcomingEvents { get; init; } = new();
}

public class FeeStatus
{
    public string ChildId { get; init; } = string.Empty;
    public string ChildName { get; init; } = string.Empty;
    public decimal TotalAmount { get; init; }
    public decimal PaidAmount { get; init; }
    public decimal OutstandingAmount { get; init; }
    public DateTime NextDueDate { get; init; }
    public string Status { get; init; } = string.Empty; // "Paid", "Partial", "Overdue"
}

public class ChildActivity
{
    public string ChildId { get; init; } = string.Empty;
    public string ChildName { get; init; } = string.Empty;
    public string ActivityType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime ActivityDate { get; init; }
    public string Subject { get; init; } = string.Empty;
}

public class SchoolEvent
{
    public string EventId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime EventDate { get; init; }
    public string EventType { get; init; } = string.Empty;
    public bool IsAllDay { get; init; }
    public string Location { get; init; } = string.Empty;
}

public class TeacherClassSchedule
{
    public string ClassId { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public string Grade { get; init; } = string.Empty;
    public string Section { get; init; } = string.Empty;
    public string Room { get; init; } = string.Empty;
    public DateTime StartTime { get; init; }
    public DateTime EndTime { get; init; }
    public int StudentCount { get; init; }
    public string Status { get; init; } = string.Empty;
}

public class PendingTask
{
    public string TaskId { get; init; } = string.Empty;
    public string TaskType { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime DueDate { get; init; }
    public string Priority { get; init; } = string.Empty;
    public int StudentCount { get; init; }
}

public class TeacherStudentStats
{
    public int TotalStudents { get; init; }
    public int PresentToday { get; init; }
    public int AbsentToday { get; init; }
    public int AssignmentsPendingGrading { get; init; }
    public int MessagesRequiringReply { get; init; }
    public List<GradeDistribution> GradeDistributions { get; init; } = new();
}

public class TeacherMessage
{
    public string MessageId { get; init; } = string.Empty;
    public string SenderName { get; init; } = string.Empty;
    public string SenderType { get; init; } = string.Empty; // "Parent", "Student", "Admin"
    public string Subject { get; init; } = string.Empty;
    public string Preview { get; init; } = string.Empty;
    public DateTime SentAt { get; init; }
    public bool IsRead { get; init; }
    public bool RequiresReply { get; init; }
}

public class TeacherAttendanceSummary
{
    public int TotalClassesToday { get; init; }
    public int AttendanceTaken { get; init; }
    public int AttendancePending { get; init; }
    public double OverallAttendanceRate { get; init; }
    public List<ClassAttendanceSummary> ClassSummaries { get; init; } = new();
}

// Offline Data Models
public class StudentOfflineData
{
    public string StudentId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Grade { get; init; } = string.Empty;
    public string Section { get; init; } = string.Empty;
    public List<AssignmentOfflineData> Assignments { get; init; } = new();
    public List<GradeOfflineData> Grades { get; init; } = new();
    public List<AttendanceOfflineData> Attendance { get; init; } = new();
}

public class ScheduleOfflineData
{
    public DateTime Date { get; init; }
    public List<ClassScheduleOfflineData> Classes { get; init; } = new();
    public List<EventOfflineData> Events { get; init; } = new();
}

public class AssignmentOfflineData
{
    public string AssignmentId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime DueDate { get; init; }
    public string Status { get; init; } = string.Empty;
    public double? MaxScore { get; init; }
    public List<AttachmentOfflineData> Attachments { get; init; } = new();
}

public class NotificationOfflineData
{
    public string NotificationId { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public bool IsRead { get; init; }
    public Dictionary<string, object> Metadata { get; init; } = new();
}

public class StaticOfflineData
{
    public List<SubjectOfflineData> Subjects { get; init; } = new();
    public List<GradeOfflineData> Grades { get; init; } = new();
    public List<TeacherOfflineData> Teachers { get; init; } = new();
    public List<SchoolSettingsOfflineData> SchoolSettings { get; init; } = new();
}

public class SyncConfiguration
{
    public TimeSpan SyncInterval { get; init; }
    public List<string> SyncDataTypes { get; init; } = new();
    public int MaxOfflineDays { get; init; }
    public bool EnableBackgroundSync { get; init; }
    public long MaxStorageSize { get; init; }
}

// Upload Data Models
public class UploadedAttendanceData
{
    public string ClassId { get; init; } = string.Empty;
    public DateTime Date { get; init; }
    public List<StudentAttendanceRecord> AttendanceRecords { get; init; } = new();
    public DateTime RecordedAt { get; init; }
    public string RecordedBy { get; init; } = string.Empty;
}

public class UploadedAssignmentData
{
    public string AssignmentId { get; init; } = string.Empty;
    public string StudentId { get; init; } = string.Empty;
    public string SubmissionType { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public List<AttachmentUploadData> Attachments { get; init; } = new();
    public DateTime SubmittedAt { get; init; }
}

public class UploadedMessageData
{
    public string MessageId { get; init; } = string.Empty;
    public string RecipientId { get; init; } = string.Empty;
    public string RecipientType { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public List<AttachmentUploadData> Attachments { get; init; } = new();
    public DateTime SentAt { get; init; }
}

public class UploadedBehaviorData
{
    public string StudentId { get; init; } = string.Empty;
    public string BehaviorType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Severity { get; init; } = string.Empty;
    public DateTime RecordedAt { get; init; }
    public string RecordedBy { get; init; } = string.Empty;
}

public class DeviceInfo
{
    public string DeviceId { get; init; } = string.Empty;
    public string DeviceType { get; init; } = string.Empty;
    public string Platform { get; init; } = string.Empty;
    public string AppVersion { get; init; } = string.Empty;
    public string OSVersion { get; init; } = string.Empty;
    public DateTime LastSync { get; init; }
}

public class SyncItemResult
{
    public string ItemType { get; init; } = string.Empty;
    public string ItemId { get; init; } = string.Empty;
    public bool Success { get; init; }
    public string Status { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public DateTime ProcessedAt { get; init; }
}

public class SyncConflict
{
    public string ItemType { get; init; } = string.Empty;
    public string ItemId { get; init; } = string.Empty;
    public string ConflictType { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public object ServerData { get; init; } = new();
    public object ClientData { get; init; } = new();
    public string ResolutionAction { get; init; } = string.Empty;
}

// Gamification Models
public class Achievement
{
    public string AchievementId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Icon { get; init; } = string.Empty;
    public int Points { get; init; }
    public DateTime UnlockedAt { get; init; }
    public bool IsNew { get; init; }
}

public class Badge
{
    public string BadgeId { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Icon { get; init; } = string.Empty;
    public string Rarity { get; init; } = string.Empty;
    public DateTime EarnedAt { get; init; }
    public bool IsNew { get; init; }
}

public class LeaderboardEntry
{
    public string Category { get; init; } = string.Empty;
    public int Rank { get; init; }
    public string DisplayName { get; init; } = string.Empty;
    public int Score { get; init; }
    public string Avatar { get; init; } = string.Empty;
}

public class StreakInfo
{
    public int CurrentStreak { get; init; }
    public int LongestStreak { get; init; }
    public DateTime LastActivityDate { get; init; }
    public string StreakType { get; init; } = string.Empty;
}

// Additional supporting models would be implemented similarly...
