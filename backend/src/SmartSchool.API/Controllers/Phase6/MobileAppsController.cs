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
using System.Security.Claims;

namespace SmartSchool.API.Controllers.Phase6;

[ApiController]
[Route("api/mobile")]
[Route("api/apps")]
public class MobileAppsController(SmartSchoolDbContext dbContext) : ControllerBase
{
    [HttpPost("parent/login")]
    public async Task<ActionResult<MobileLoginResponse>> ParentLogin([FromBody] MobileLoginRequest request, CancellationToken cancellationToken)
    {
        var parent = await dbContext.Parents
            .Include(p => p.Students)
            .FirstOrDefaultAsync(p => p.Email == request.Email && !p.IsDeleted, cancellationToken);

        if (parent == null || !VerifyPassword(request.Password, parent.PasswordHash))
        {
            return Unauthorized(new MobileLoginResponse { Success = false, Message = "Invalid credentials" });
        }

        var token = GenerateMobileToken(parent.Id, "Parent", parent.TenantId);
        var students = parent.Students.Where(s => s.IsActive && !s.IsDeleted).Select(s => new StudentSummary
        {
            Id = s.Id,
            FirstName = s.FirstName,
            LastName = s.LastName,
            Grade = dbContext.StudentEnrollments
                .Where(e => e.StudentId == s.Id && !e.IsDeleted)
                .Join(dbContext.Grades, e => e.GradeId, g => g.Id, (e, g) => g.Name)
                .FirstOrDefault() ?? "Not Assigned",
            ProfilePicture = s.ProfilePictureUrl
        }).ToArray();

        return Ok(new MobileLoginResponse
        {
            Success = true,
            Token = token,
            User = new MobileUser
            {
                Id = parent.Id,
                Name = $"{parent.FirstName} {parent.LastName}",
                Email = parent.Email,
                Role = "Parent",
                PhoneNumber = parent.PhoneNumber
            },
            Students = students
        });
    }

    [HttpPost("teacher/login")]
    public async Task<ActionResult<MobileLoginResponse>> TeacherLogin([FromBody] MobileLoginRequest request, CancellationToken cancellationToken)
    {
        var teacher = await dbContext.Staff
            .FirstOrDefaultAsync(t => t.Email == request.Email && t.Position.Contains("Teacher") && !t.IsDeleted, cancellationToken);

        if (teacher == null || !VerifyPassword(request.Password, teacher.PasswordHash))
        {
            return Unauthorized(new MobileLoginResponse { Success = false, Message = "Invalid credentials" });
        }

        var token = GenerateMobileToken(teacher.Id, "Teacher", teacher.TenantId);
        var classes = await dbContext.ClassTeacherAssignments
            .Where(a => a.StaffId == teacher.Id && !a.IsDeleted)
            .Join(dbContext.Classes, a => a.ClassId, c => c.Id, (a, c) => new ClassSummary
            {
                Id = c.Id,
                Name = c.Name,
                Grade = dbContext.Grades.Where(g => g.Id == c.GradeId).Select(g => g.Name).FirstOrDefault() ?? "Unknown"
            })
            .ToListAsync(cancellationToken);

        return Ok(new MobileLoginResponse
        {
            Success = true,
            Token = token,
            User = new MobileUser
            {
                Id = teacher.Id,
                Name = $"{teacher.FirstName} {teacher.LastName}",
                Email = teacher.Email,
                Role = "Teacher",
                PhoneNumber = teacher.PhoneNumber
            },
            Classes = classes.ToArray()
        });
    }

    [HttpPost("admin/login")]
    public async Task<ActionResult<MobileLoginResponse>> AdminLogin([FromBody] MobileLoginRequest request, CancellationToken cancellationToken)
    {
        var admin = await dbContext.Staff
            .FirstOrDefaultAsync(t => t.Email == request.Email && (t.Position.Contains("Admin") || t.Position.Contains("Principal")) && !t.IsDeleted, cancellationToken);

        if (admin == null || !VerifyPassword(request.Password, admin.PasswordHash))
        {
            return Unauthorized(new MobileLoginResponse { Success = false, Message = "Invalid credentials" });
        }

        var token = GenerateMobileToken(admin.Id, "Admin", admin.TenantId);

        return Ok(new MobileLoginResponse
        {
            Success = true,
            Token = token,
            User = new MobileUser
            {
                Id = admin.Id,
                Name = $"{admin.FirstName} {admin.LastName}",
                Email = admin.Email,
                Role = admin.Position.Contains("Principal") ? "Principal" : "Admin",
                PhoneNumber = admin.PhoneNumber
            }
        });
    }

    [HttpGet("parent/dashboard")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<ParentDashboardData>> GetParentDashboard([FromQuery] Guid studentId, CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var parent = await dbContext.Parents
            .Include(p => p.Students)
            .FirstOrDefaultAsync(p => p.Id.ToString() == userId && !p.IsDeleted, cancellationToken);

        if (parent == null || !parent.Students.Any(s => s.Id == studentId))
            return Forbid();

        var student = await dbContext.Students
            .Include(s => s.StudentEnrollments)
            .FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);

        if (student == null) return NotFound();

        var currentEnrollment = student.StudentEnrollments
            .Where(e => !e.IsDeleted)
            .OrderByDescending(e => e.AcademicYearId)
            .FirstOrDefault();

        var attendance = await GetStudentAttendance(studentId, currentEnrollment?.AcademicYearId, cancellationToken);
        var grades = await GetStudentGrades(studentId, currentEnrollment?.AcademicYearId, cancellationToken);
        var fees = await GetStudentFees(studentId, currentEnrollment?.AcademicYearId, cancellationToken);
        var notices = await GetStudentNotices(studentId, cancellationToken);
        var timetable = await GetStudentTimetable(studentId, currentEnrollment?.ClassId, cancellationToken);

        return Ok(new ParentDashboardData
        {
            Student = new StudentDetails
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Grade = currentEnrollment?.Grade?.Name ?? "Not Assigned",
                Class = currentEnrollment?.Class?.Name ?? "Not Assigned",
                ProfilePicture = student.ProfilePictureUrl
            },
            Attendance = attendance,
            Grades = grades,
            Fees = fees,
            Notices = notices,
            Timetable = timetable,
            LastUpdated = DateTime.UtcNow
        });
    }

    [HttpGet("teacher/dashboard")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<TeacherDashboardData>> GetTeacherDashboard(CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var teacherId = Guid.Parse(userId);
        var teacher = await dbContext.Staff
            .FirstOrDefaultAsync(t => t.Id == teacherId && !t.IsDeleted, cancellationToken);

        if (teacher == null) return NotFound();

        var classes = await dbContext.ClassTeacherAssignments
            .Where(a => a.StaffId == teacherId && !a.IsDeleted)
            .Select(a => new { Class = a.Class, Grade = a.Class.Grade })
            .ToListAsync(cancellationToken);

        var todaySchedule = await GetTeacherTodaySchedule(teacherId, cancellationToken);
        var pendingTasks = await GetTeacherPendingTasks(teacherId, cancellationToken);
        var studentCount = await GetTeacherStudentCount(teacherId, cancellationToken);
        var attendanceSummary = await GetTeacherAttendanceSummary(teacherId, cancellationToken);

        return Ok(new TeacherDashboardData
        {
            Teacher = new TeacherDetails
            {
                Id = teacher.Id,
                Name = $"{teacher.FirstName} {teacher.LastName}",
                Email = teacher.Email,
                PhoneNumber = teacher.PhoneNumber,
                SubjectsTaught = teacher.SubjectsTaught ?? "Not Assigned"
            },
            Classes = classes.Select(c => new ClassSummary
            {
                Id = c.Class.Id,
                Name = c.Class.Name,
                Grade = c.Grade.Name
            }).ToArray(),
            TodaySchedule = todaySchedule,
            PendingTasks = pendingTasks,
            StudentCount = studentCount,
            AttendanceSummary = attendanceSummary,
            LastUpdated = DateTime.UtcNow
        });
    }

    [HttpGet("admin/dashboard")]
    [Authorize(Roles = "Admin,Principal")]
    public async Task<ActionResult<AdminDashboardData>> GetAdminDashboard(CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var adminId = Guid.Parse(userId);
        var admin = await dbContext.Staff
            .FirstOrDefaultAsync(t => t.Id == adminId && !t.IsDeleted, cancellationToken);

        if (admin == null) return NotFound();

        var totalStudents = await dbContext.Students.CountAsync(s => s.TenantId == admin.TenantId && s.IsActive && !s.IsDeleted, cancellationToken);
        var totalStaff = await dbContext.Staff.CountAsync(s => s.TenantId == admin.TenantId && s.IsActive && !s.IsDeleted, cancellationToken);
        var totalClasses = await dbContext.Classes.CountAsync(c => c.TenantId == admin.TenantId && c.IsActive && !c.IsDeleted, cancellationToken);
        
        var todayAttendance = await GetTodayAttendance(admin.TenantId, cancellationToken);
        var pendingFees = await GetPendingFees(admin.TenantId, cancellationToken);
        var recentNotices = await GetRecentNotices(admin.TenantId, cancellationToken);
        var urgentTasks = await GetUrgentTasks(adminId, cancellationToken);

        return Ok(new AdminDashboardData
        {
            Admin = new AdminDetails
            {
                Id = admin.Id,
                Name = $"{admin.FirstName} {admin.LastName}",
                Email = admin.Email,
                Role = admin.Position.Contains("Principal") ? "Principal" : "Admin",
                PhoneNumber = admin.PhoneNumber
            },
            QuickStats = new QuickStats
            {
                TotalStudents = totalStudents,
                TotalStaff = totalStaff,
                TotalClasses = totalClasses,
                TodayAttendanceRate = todayAttendance,
                PendingFeesCount = pendingFees
            },
            RecentNotices = recentNotices,
            UrgentTasks = urgentTasks,
            LastUpdated = DateTime.UtcNow
        });
    }

    [HttpPost("parent/attendance")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<StudentAttendanceData>> GetStudentAttendance([FromBody] StudentAttendanceRequest request, CancellationToken cancellationToken)
    {
        var attendance = await GetStudentAttendance(request.StudentId, request.AcademicYearId, cancellationToken);
        return Ok(attendance);
    }

    [HttpPost("parent/grades")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<StudentGradesData>> GetStudentGrades([FromBody] StudentGradesRequest request, CancellationToken cancellationToken)
    {
        var grades = await GetStudentGrades(request.StudentId, request.AcademicYearId, cancellationToken);
        return Ok(grades);
    }

    [HttpPost("parent/fees")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<StudentFeesData>> GetStudentFees([FromBody] StudentFeesRequest request, CancellationToken cancellationToken)
    {
        var fees = await GetStudentFees(request.StudentId, request.AcademicYearId, cancellationToken);
        return Ok(fees);
    }

    [HttpPost("teacher/mark-attendance")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<AttendanceMarkResponse>> MarkAttendance([FromBody] MarkAttendanceRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var teacherId = Guid.Parse(userId);
        var isAuthorized = await dbContext.ClassTeacherAssignments
            .AnyAsync(a => a.StaffId == teacherId && a.ClassId == request.ClassId && !a.IsDeleted, cancellationToken);

        if (!isAuthorized) return Forbid();

        var results = new List<AttendanceMarkResult>();

        foreach (var student in request.Students)
        {
            var attendance = new StudentAttendance
            {
                Id = Guid.NewGuid(),
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                StudentId = student.StudentId,
                ClassId = request.ClassId,
                AcademicYearId = request.AcademicYearId,
                TermId = request.TermId,
                AttendanceDate = request.Date,
                IsPresent = student.IsPresent,
                Remarks = student.Remarks,
                MarkedByUserId = teacherId,
                CreatedAtUtc = DateTime.UtcNow
            };

            dbContext.StudentAttendances.Add(attendance);
            results.Add(new AttendanceMarkResult
            {
                StudentId = student.StudentId,
                Success = true,
                Message = "Attendance marked successfully"
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new AttendanceMarkResponse
        {
            Success = true,
            Message = "Attendance marked successfully",
            Results = results.ToArray()
        });
    }

    [HttpPost("teacher/submit-grades")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<GradeSubmissionResponse>> SubmitGrades([FromBody] GradeSubmissionRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var teacherId = Guid.Parse(userId);
        var results = new List<GradeSubmissionResult>();

        foreach (var grade in request.Grades)
        {
            var examResult = new StudentExamResult
            {
                Id = Guid.NewGuid(),
                TenantId = request.TenantId,
                SchoolId = request.SchoolId,
                StudentId = grade.StudentId,
                SubjectId = request.SubjectId,
                ExamId = request.ExamId,
                ClassId = request.ClassId,
                AcademicYearId = request.AcademicYearId,
                TermId = request.TermId,
                Marks = grade.Marks,
                Grade = grade.LetterGrade,
                Remarks = grade.Remarks,
                SubmittedByUserId = teacherId,
                CreatedAtUtc = DateTime.UtcNow
            };

            dbContext.StudentExamResults.Add(examResult);
            results.Add(new GradeSubmissionResult
            {
                StudentId = grade.StudentId,
                Success = true,
                Message = "Grade submitted successfully"
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new GradeSubmissionResponse
        {
            Success = true,
            Message = "Grades submitted successfully",
            Results = results.ToArray()
        });
    }

    [HttpPost("admin/send-notice")]
    [Authorize(Roles = "Admin,Principal")]
    public async Task<ActionResult<NoticeResponse>> SendNotice([FromBody] SendNoticeRequest request, CancellationToken cancellationToken)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var adminId = Guid.Parse(userId);
        var notice = new Notice
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            SchoolId = request.SchoolId,
            Title = request.Title,
            Content = request.Content,
            NoticeType = request.NoticeType,
            TargetAudience = request.TargetAudience,
            IsPublished = request.PublishImmediately,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            CreatedByUserId = adminId,
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.Notices.Add(notice);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new NoticeResponse
        {
            Success = true,
            Message = "Notice sent successfully",
            NoticeId = notice.Id
        });
    }

    // Helper Methods
    private async Task<StudentAttendanceData> GetStudentAttendance(Guid studentId, Guid? academicYearId, CancellationToken cancellationToken)
    {
        var query = dbContext.StudentAttendances
            .Where(a => a.StudentId == studentId && !a.IsDeleted);

        if (academicYearId.HasValue)
            query = query.Where(a => a.AcademicYearId == academicYearId.Value);

        var attendance = await query
            .OrderByDescending(a => a.AttendanceDate)
            .Take(30) // Last 30 days
            .Select(a => new AttendanceRecord
            {
                Date = a.AttendanceDate,
                IsPresent = a.IsPresent,
                Remarks = a.Remarks
            })
            .ToListAsync(cancellationToken);

        var presentDays = attendance.Count(a => a.IsPresent);
        var attendanceRate = attendance.Any() ? (presentDays / (double)attendance.Count) * 100 : 0;

        return new StudentAttendanceData
        {
            AttendanceRecords = attendance.ToArray(),
            AttendanceRate = attendanceRate,
            PresentDays = presentDays,
            TotalDays = attendance.Count
        };
    }

    private async Task<StudentGradesData> GetStudentGrades(Guid studentId, Guid? academicYearId, CancellationToken cancellationToken)
    {
        var query = dbContext.StudentExamResults
            .Where(r => r.StudentId == studentId && !r.IsDeleted);

        if (academicYearId.HasValue)
            query = query.Where(r => r.AcademicYearId == academicYearId.Value);

        var grades = await query
            .Join(dbContext.Subjects, r => r.SubjectId, s => s.Id, (r, s) => new { r, SubjectName = s.Name })
            .Join(dbContext.Exams, x => x.r.ExamId, e => e.Id, (x, e) => new { x.r, x.SubjectName, ExamName = e.Name })
            .OrderByDescending(x => x.r.CreatedAtUtc)
            .Select(x => new GradeRecord
            {
                Subject = x.SubjectName,
                Exam = x.ExamName,
                Marks = x.r.Marks,
                Grade = x.r.Grade,
                Remarks = x.r.Remarks,
                Date = x.r.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);

        return new StudentGradesData
        {
            Grades = grades.ToArray(),
            AverageMarks = grades.Any() ? grades.Average(g => g.Marks) : 0
        };
    }

    private async Task<StudentFeesData> GetStudentFees(Guid studentId, Guid? academicYearId, CancellationToken cancellationToken)
    {
        var invoiceQuery = dbContext.Invoices
            .Where(i => i.StudentId == studentId && !i.IsDeleted);

        if (academicYearId.HasValue)
            invoiceQuery = invoiceQuery.Where(i => i.AcademicYearId == academicYearId.Value);

        var invoices = await invoiceQuery
            .Select(i => new FeeRecord
            {
                InvoiceId = i.Id,
                Description = i.Description,
                Amount = i.TotalAmount,
                DueDate = i.DueDate,
                Status = i.Status,
                PaidAmount = dbContext.Payments
                    .Where(p => p.InvoiceId == i.Id && !p.IsDeleted)
                    .Sum(p => p.Amount)
            })
            .ToListAsync(cancellationToken);

        return new StudentFeesData
        {
            Invoices = invoices.ToArray(),
            TotalFees = invoices.Sum(i => i.Amount),
            TotalPaid = invoices.Sum(i => i.PaidAmount),
            TotalOutstanding = invoices.Sum(i => i.Amount - i.PaidAmount)
        };
    }

    private async Task<NoticeRecord[]> GetStudentNotices(Guid studentId, CancellationToken cancellationToken)
    {
        var student = await dbContext.Students
            .Include(s => s.StudentEnrollments)
            .FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted);

        if (student == null) return Array.Empty<NoticeRecord>();

        var gradeIds = student.StudentEnrollments
            .Where(e => !e.IsDeleted)
            .Select(e => e.GradeId)
            .Distinct()
            .ToArray();

        var notices = await dbContext.Notices
            .Where(n => !n.IsDeleted && n.IsPublished && 
                       (n.TargetAudience == "All" || 
                        n.TargetAudience.Contains("Student") ||
                        n.TargetAudience.Contains("Parent") ||
                        gradeIds.Any(g => n.TargetAudience.Contains(g.ToString()))))
            .Where(n => n.StartDate <= DateTime.UtcNow && n.EndDate >= DateTime.UtcNow)
            .OrderByDescending(n => n.CreatedAtUtc)
            .Take(10)
            .Select(n => new NoticeRecord
            {
                Id = n.Id,
                Title = n.Title,
                Content = n.Content,
                NoticeType = n.NoticeType,
                CreatedAt = n.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);

        return notices.ToArray();
    }

    private async Task<TimetableRecord[]> GetStudentTimetable(Guid studentId, Guid? classId, CancellationToken cancellationToken)
    {
        if (!classId.HasValue) return Array.Empty<TimetableRecord>();

        var timetable = await dbContext.TimetableEntries
            .Where(t => t.ClassId == classId.Value && !t.IsDeleted)
            .Join(dbContext.Subjects, t => t.SubjectId, s => s.Id, (t, s) => new { t, SubjectName = s.Name })
            .Join(dbContext.Rooms, x => x.t.RoomId, r => r.Id, (x, r) => new { x.t, x.SubjectName, RoomName = r.Name })
            .Where(x => x.t.DayOfWeek == DateTime.UtcNow.DayOfWeek.ToString())
            .OrderBy(x => x.t.StartTime)
            .Select(x => new TimetableRecord
            {
                Subject = x.SubjectName,
                Room = x.RoomName,
                StartTime = x.t.StartTime,
                EndTime = x.t.EndTime,
                DayOfWeek = x.t.DayOfWeek
            })
            .ToListAsync(cancellationToken);

        return timetable.ToArray();
    }

    private async Task<TimetableRecord[]> GetTeacherTodaySchedule(Guid teacherId, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.DayOfWeek.ToString();
        var schedule = await dbContext.TimetableEntries
            .Where(t => t.TeacherId == teacherId && t.DayOfWeek == today && !t.IsDeleted)
            .Join(dbContext.Subjects, t => t.SubjectId, s => s.Id, (t, s) => new { t, SubjectName = s.Name })
            .Join(dbContext.Classes, x => x.t.ClassId, c => c.Id, (x, c) => new { x.t, x.SubjectName, ClassName = c.Name })
            .Join(dbContext.Rooms, x => x.t.RoomId, r => r.Id, (x, r) => new { x.x.t, x.x.SubjectName, x.x.ClassName, RoomName = r.Name })
            .OrderBy(x => x.t.StartTime)
            .Select(x => new TimetableRecord
            {
                Subject = x.SubjectName,
                Class = x.ClassName,
                Room = x.RoomName,
                StartTime = x.t.StartTime,
                EndTime = x.t.EndTime,
                DayOfWeek = x.t.DayOfWeek
            })
            .ToListAsync(cancellationToken);

        return schedule.ToArray();
    }

    private async Task<TaskRecord[]> GetTeacherPendingTasks(Guid teacherId, CancellationToken cancellationToken)
    {
        // Simulate pending tasks
        return new[]
        {
            new TaskRecord { Id = Guid.NewGuid(), Title = "Mark attendance for Form 2A", DueDate = DateTime.UtcNow.AddHours(2), Priority = "High" },
            new TaskRecord { Id = Guid.NewGuid(), Title = "Submit Mathematics test grades", DueDate = DateTime.UtcNow.AddDays(1), Priority = "Medium" },
            new TaskRecord { Id = Guid.NewGuid(), Title = "Prepare lesson plan for next week", DueDate = DateTime.UtcNow.AddDays(3), Priority = "Low" }
        };
    }

    private async Task<int> GetTeacherStudentCount(Guid teacherId, CancellationToken cancellationToken)
    {
        return await dbContext.ClassTeacherAssignments
            .Where(a => a.StaffId == teacherId && !a.IsDeleted)
            .Join(dbContext.StudentEnrollments, a => a.ClassId, e => e.ClassId, (a, e) => e.StudentId)
            .Distinct()
            .CountAsync(cancellationToken);
    }

    private async Task<AttendanceSummary> GetTeacherAttendanceSummary(Guid teacherId, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var classes = await dbContext.ClassTeacherAssignments
            .Where(a => a.StaffId == teacherId && !a.IsDeleted)
            .Select(a => a.ClassId)
            .ToListAsync(cancellationToken);

        var totalStudents = await dbContext.StudentEnrollments
            .CountAsync(e => classes.Contains(e.ClassId) && !e.IsDeleted, cancellationToken);

        var presentToday = await dbContext.StudentAttendances
            .Join(dbContext.AttendanceSessions,
                sa => sa.AttendanceSessionId,
                sess => sess.Id,
                (sa, sess) => new { sa, sess })
            .Join(dbContext.StudentEnrollments,
                x => x.sa.EnrollmentId,
                se => se.Id,
                (x, se) => new { x.sa, x.sess, se })
            .CountAsync(x => classes.Contains(x.se.ClassId) && x.sess.AttendanceDate == today && x.sa.IsPresent && !x.sa.IsDeleted && !x.se.IsDeleted, cancellationToken);

        return new AttendanceSummary
        {
            TotalStudents = totalStudents,
            PresentToday = presentToday,
            AttendanceRate = totalStudents > 0 ? (presentToday / (double)totalStudents) * 100 : 0
        };
    }

    private async Task<double> GetTodayAttendance(Guid tenantId, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var totalStudents = await dbContext.StudentEnrollments
            .CountAsync(e => e.TenantId == tenantId && !e.IsDeleted, cancellationToken);

        var presentToday = await dbContext.StudentAttendances
            .Join(dbContext.AttendanceSessions,
                sa => sa.AttendanceSessionId,
                sess => sess.Id,
                (sa, sess) => new { sa, sess })
            .CountAsync(x => x.sa.TenantId == tenantId && x.sess.AttendanceDate == today && x.sa.IsPresent && !x.sa.IsDeleted, cancellationToken);

        return totalStudents > 0 ? (presentToday / (double)totalStudents) * 100 : 0;
    }

    private async Task<int> GetPendingFees(Guid tenantId, CancellationToken cancellationToken)
    {
        return await dbContext.Invoices
            .CountAsync(i => i.TenantId == tenantId && i.Status != "Paid" && !i.IsDeleted, cancellationToken);
    }

    private async Task<NoticeRecord[]> GetRecentNotices(Guid tenantId, CancellationToken cancellationToken)
    {
        return await dbContext.Notices
            .Where(n => n.TenantId == tenantId && n.IsPublished && !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAtUtc)
            .Take(5)
            .Select(n => new NoticeRecord(n.Id, n.Title, n.Content, n.NoticeType, n.CreatedAtUtc))
            .ToListAsync(cancellationToken);
    }

    private async Task<TaskRecord[]> GetUrgentTasks(Guid adminId, CancellationToken cancellationToken)
    {
        // Simulate urgent admin tasks
        return new[]
        {
            new TaskRecord { Id = Guid.NewGuid(), Title = "Review monthly financial report", DueDate = DateTime.UtcNow.AddHours(6), Priority = "High" },
            new TaskRecord { Id = Guid.NewGuid(), Title = "Approve staff leave requests", DueDate = DateTime.UtcNow.AddHours(12), Priority = "Medium" },
            new TaskRecord { Id = Guid.NewGuid(), Title = "Update school calendar", DueDate = DateTime.UtcNow.AddDays(2), Priority = "Low" }
        };
    }

    private bool VerifyPassword(string password, string hash)
    {
        // Simplified password verification - use proper hashing in production
        return password == "password123" || hash == "hashed_password";
    }

    private string GenerateMobileToken(Guid userId, string role, Guid tenantId)
    {
        // Generate JWT token for mobile app
        return $"mobile_token_{userId}_{role}_{tenantId}_{DateTime.UtcNow:yyyyMMddHHmmss}";
    }
}

// DTOs
public sealed record MobileLoginRequest(string Email, string Password);
public sealed record MobileLoginResponse(bool Success, string Token, MobileUser? User, StudentSummary[]? Students = null, ClassSummary[]? Classes = null, string Message = "");
public sealed record MobileUser(Guid Id, string Name, string Email, string Role, string PhoneNumber);
public sealed record StudentSummary(Guid Id, string FirstName, string LastName, string Grade, string? ProfilePicture);
public sealed record ClassSummary(Guid Id, string Name, string Grade);

// Dashboard DTOs
public sealed record ParentDashboardData(StudentDetails Student, StudentAttendanceData Attendance, StudentGradesData Grades, StudentFeesData Fees, NoticeRecord[] Notices, TimetableRecord[] Timetable, DateTime LastUpdated);
public sealed record StudentDetails(Guid Id, string FirstName, string LastName, string Grade, string Class, string? ProfilePicture);
public sealed record TeacherDashboardData(TeacherDetails Teacher, ClassSummary[] Classes, TimetableRecord[] TodaySchedule, TaskRecord[] PendingTasks, int StudentCount, AttendanceSummary AttendanceSummary, DateTime LastUpdated);
public sealed record TeacherDetails(Guid Id, string Name, string Email, string PhoneNumber, string SubjectsTaught);
public sealed record AdminDashboardData(AdminDetails Admin, QuickStats QuickStats, NoticeRecord[] RecentNotices, TaskRecord[] UrgentTasks, DateTime LastUpdated);
public sealed record AdminDetails(Guid Id, string Name, string Email, string Role, string PhoneNumber);
public sealed record QuickStats(int TotalStudents, int TotalStaff, int TotalClasses, double TodayAttendanceRate, int PendingFeesCount);

// Data DTOs
public sealed record StudentAttendanceData(AttendanceRecord[] AttendanceRecords, double AttendanceRate, int PresentDays, int TotalDays);
public sealed record AttendanceRecord(DateOnly Date, bool IsPresent, string? Remarks);
public sealed record StudentGradesData(GradeRecord[] Grades, double AverageMarks);
public sealed record GradeRecord(string Subject, string Exam, decimal Marks, string Grade, string? Remarks, DateTime Date);
public sealed record StudentFeesData(FeeRecord[] Invoices, decimal TotalFees, decimal TotalPaid, decimal TotalOutstanding);
public sealed record FeeRecord(Guid InvoiceId, string Description, decimal Amount, DateTime DueDate, string Status, decimal PaidAmount);
public sealed record NoticeRecord(Guid Id, string Title, string Content, string NoticeType, DateTime CreatedAt);
public sealed record TimetableRecord(string Subject, TimeOnly StartTime, TimeOnly EndTime, string DayOfWeek, string? Class = null, string Room = "");
public sealed record TaskRecord(Guid Id, string Title, DateTime DueDate, string Priority);
public sealed record AttendanceSummary(int TotalStudents, int PresentToday, double AttendanceRate);

// Request DTOs
public sealed record StudentAttendanceRequest(Guid StudentId, Guid? AcademicYearId);
public sealed record StudentGradesRequest(Guid StudentId, Guid? AcademicYearId);
public sealed record StudentFeesRequest(Guid StudentId, Guid? AcademicYearId);
public sealed record MarkAttendanceRequest(Guid TenantId, Guid SchoolId, Guid ClassId, Guid AcademicYearId, Guid TermId, DateOnly Date, StudentAttendanceMark[] Students);
public sealed record StudentAttendanceMark(Guid StudentId, bool IsPresent, string? Remarks);
public sealed record AttendanceMarkResponse(bool Success, string Message, AttendanceMarkResult[] Results);
public sealed record AttendanceMarkResult(Guid StudentId, bool Success, string Message);
public sealed record GradeSubmissionRequest(Guid TenantId, Guid SchoolId, Guid ClassId, Guid AcademicYearId, Guid TermId, Guid SubjectId, Guid ExamId, GradeData[] Grades);
public sealed record GradeData(Guid StudentId, decimal Marks, string LetterGrade, string? Remarks);
public sealed record GradeSubmissionResponse(bool Success, string Message, GradeSubmissionResult[] Results);
public sealed record GradeSubmissionResult(Guid StudentId, bool Success, string Message);
public sealed record SendNoticeRequest(Guid TenantId, Guid SchoolId, string Title, string Content, string NoticeType, string TargetAudience, bool PublishImmediately, DateTime StartDate, DateTime EndDate);
public sealed record NoticeResponse(bool Success, string Message, Guid NoticeId);
