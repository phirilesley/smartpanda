namespace SmartSchool.Domain.Modules.Mobile;

public sealed class PushNotificationRegistration { public Guid UserId { get; set; } public string DeviceToken { get; set; } = string.Empty; public string Platform { get; set; } = string.Empty; }
public sealed class PushRegistrationResult { public bool IsSuccess { get; set; } public string Message { get; set; } = string.Empty; }
public sealed class PushNotificationUnrequest { public Guid UserId { get; set; } public string DeviceToken { get; set; } = string.Empty; }
public sealed class VoiceCommandRequest { public Guid UserId { get; set; } public string Command { get; set; } = string.Empty; public string Locale { get; set; } = string.Empty; }
public sealed class VoiceCommandResult { public bool IsSuccess { get; set; } public string Intent { get; set; } = string.Empty; public string Message { get; set; } = string.Empty; }
public sealed class AccessibilitySettings { public bool HighContrast { get; set; } public bool LargeText { get; set; } public bool VoiceAssistanceEnabled { get; set; } }
public sealed class AchievementUnlockRequest { public Guid UserId { get; set; } public string AchievementCode { get; set; } = string.Empty; }
public sealed class AchievementResult { public bool IsUnlocked { get; set; } public string AchievementCode { get; set; } = string.Empty; public string Message { get; set; } = string.Empty; }
public sealed class SubjectGrade { public Guid SubjectId { get; set; } public decimal Mark { get; set; } public string Grade { get; set; } = string.Empty; }
public sealed class GradeDistribution { public string Grade { get; set; } = string.Empty; public int Count { get; set; } }
public sealed class ClassScheduleOfflineData { public Guid TimetableEntryId { get; set; } public Guid SubjectId { get; set; } public Guid RoomId { get; set; } public Guid PeriodId { get; set; } }
public sealed class EventOfflineData { public Guid EventId { get; set; } public string Title { get; set; } = string.Empty; public DateTime StartsAtUtc { get; set; } public DateTime EndsAtUtc { get; set; } }
public sealed class SubjectOfflineData { public Guid SubjectId { get; set; } public string SubjectName { get; set; } = string.Empty; public string SubjectCode { get; set; } = string.Empty; }
public sealed class StudentAttendanceRecord { public Guid StudentId { get; set; } public DateTime Date { get; set; } public bool IsPresent { get; set; } }
public sealed class GradeOfflineData { public Guid StudentId { get; set; } public IReadOnlyList<SubjectGrade> SubjectGrades { get; set; } = []; }
public sealed class TeacherOfflineData { public Guid StaffId { get; set; } public string FirstName { get; set; } = string.Empty; public string LastName { get; set; } = string.Empty; public string Department { get; set; } = string.Empty; }
public sealed class SchoolSettingsOfflineData { public string Key { get; set; } = string.Empty; public string Value { get; set; } = string.Empty; public string Category { get; set; } = string.Empty; }
public sealed class AttachmentOfflineData { public Guid FileId { get; set; } public string FileName { get; set; } = string.Empty; public string ContentType { get; set; } = string.Empty; public long SizeBytes { get; set; } }
public sealed class ClassAttendanceSummary { public Guid StreamId { get; set; } public DateTime Date { get; set; } public int PresentCount { get; set; } public int AbsentCount { get; set; } }
public sealed class AttendanceOfflineData { public Guid AttendanceSessionId { get; set; } public IReadOnlyList<StudentAttendanceRecord> Records { get; set; } = []; }
public sealed class AttachmentUploadData { public Guid FileId { get; set; } public string StoragePath { get; set; } = string.Empty; public bool IsUploaded { get; set; } public string Message { get; set; } = string.Empty; }
