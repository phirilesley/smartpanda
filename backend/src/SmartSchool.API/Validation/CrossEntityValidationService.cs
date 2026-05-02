using Microsoft.EntityFrameworkCore;
using SmartSchool.Domain.Common;
using SmartSchool.Domain.Modules.Academics;
using SmartSchool.Domain.Modules.Events;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Health;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Validation;

public class CrossEntityValidationService(SmartSchoolDbContext dbContext)
{
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = [];
        public List<string> Warnings { get; set; } = [];
    }

    #region Student-Related Validations

    public async Task<ValidationResult> ValidateStudentEnrollment(Guid studentId, Guid classId, Guid academicYearId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Check if student exists and is active
        var student = await dbContext.Students.FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);
        if (student == null)
        {
            result.Errors.Add("Student not found");
            return result;
        }

        // Check if class exists and is in the same school
        var @class = await dbContext.Classes.FirstOrDefaultAsync(c => c.Id == classId && !c.IsDeleted, cancellationToken);
        if (@class == null)
        {
            result.Errors.Add("Class not found");
            return result;
        }

        if (student.TenantId != @class.TenantId || student.SchoolId != @class.SchoolId)
        {
            result.Errors.Add("Student and class must belong to the same school");
            return result;
        }

        // Check academic year
        var academicYear = await dbContext.AcademicYears.FirstOrDefaultAsync(ay => ay.Id == academicYearId && !ay.IsDeleted, cancellationToken);
        if (academicYear == null)
        {
            result.Errors.Add("Academic year not found");
            return result;
        }

        // Check if student is already enrolled in another class for the same academic year
        var existingEnrollment = await dbContext.StudentEnrollments
            .AnyAsync(se => se.StudentId == studentId && se.AcademicYearId == academicYearId && !se.IsDeleted, cancellationToken);

        if (existingEnrollment)
        {
            result.Errors.Add("Student is already enrolled in a class for this academic year");
        }

        // Check class capacity
        var currentEnrollments = await dbContext.StudentEnrollments
            .CountAsync(se => se.ClassId == classId && se.AcademicYearId == academicYearId && !se.IsDeleted, cancellationToken);

        if (@class.MaxStudents.HasValue && currentEnrollments >= @class.MaxStudents.Value)
        {
            result.Errors.Add($"Class has reached maximum capacity of {@class.MaxStudents.Value} students");
        }

        // Check age appropriateness
        if (@class.MinAge.HasValue && student.DateOfBirth > DateTime.Today.AddYears(-@class.MinAge.Value))
        {
            result.Errors.Add($"Student is too young for this class. Minimum age: {@class.MinAge.Value}");
        }

        if (@class.MaxAge.HasValue && student.DateOfBirth < DateTime.Today.AddYears(-@class.MaxAge.Value))
        {
            result.Errors.Add($"Student is too old for this class. Maximum age: {@class.MaxAge.Value}");
        }

        // Check hostel conflicts
        var hostelAllocation = await dbContext.HostelAllocations
            .Include(ha => ha.HostelBed)
            .ThenInclude(hb => hb.HostelRoom)
            .ThenInclude(hr => hr.Hostel)
            .FirstOrDefaultAsync(ha => ha.StudentId == studentId && ha.IsCurrent && !ha.IsDeleted, cancellationToken);

        if (hostelAllocation != null && hostelAllocation.HostelBed?.HostelRoom?.Hostel != null)
        {
            // Check if hostel allows this gender
            if (!string.IsNullOrEmpty(hostelAllocation.HostelBed.HostelRoom.Hostel.GenderPolicy) && 
                hostelAllocation.HostelBed.HostelRoom.Hostel.GenderPolicy != "Mixed" && 
                hostelAllocation.HostelBed.HostelRoom.Hostel.GenderPolicy != student.Gender)
            {
                result.Warnings.Add($"Student gender ({student.Gender}) may not match hostel policy ({hostelAllocation.HostelBed.HostelRoom.Hostel.GenderPolicy})");
            }
        }

        // Check fee structure exists
        var feeStructure = await dbContext.FeeStructures
            .AnyAsync(fs => fs.GradeId == @class.GradeId && fs.AcademicYearId == academicYearId && !fs.IsDeleted, cancellationToken);

        if (!feeStructure)
        {
            result.Warnings.Add("No fee structure defined for this grade and academic year");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Finance-Related Validations

    public async Task<ValidationResult> ValidateStudentInvoiceGeneration(Guid studentId, Guid academicYearId, Guid termId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Check if student has active enrollment
        var enrollment = await dbContext.StudentEnrollments
            .Include(se => se.Class)
            .FirstOrDefaultAsync(se => se.StudentId == studentId && se.AcademicYearId == academicYearId && !se.IsDeleted, cancellationToken);

        if (enrollment == null)
        {
            result.Errors.Add("Student is not enrolled for this academic year");
            return result;
        }

        // Check if term exists and belongs to academic year
        var term = await dbContext.Terms.FirstOrDefaultAsync(t => t.Id == termId && t.AcademicYearId == academicYearId && !t.IsDeleted, cancellationToken);
        if (term == null)
        {
            result.Errors.Add("Term not found or does not belong to specified academic year");
            return result;
        }

        // Check for existing invoice for the same term
        var existingInvoice = await dbContext.StudentInvoices
            .AnyAsync(si => si.StudentId == studentId && si.AcademicYearId == academicYearId && si.TermId == termId && !si.IsDeleted, cancellationToken);

        if (existingInvoice)
        {
            result.Errors.Add("Invoice already exists for this student, academic year, and term");
        }

        // Check if student has outstanding balance that might affect new invoice
        var outstandingBalance = await GetStudentOutstandingBalance(studentId, cancellationToken);
        if (outstandingBalance > 0)
        {
            result.Warnings.Add($"Student has outstanding balance of {outstandingBalance:C}");
        }

        // Check for applicable discounts
        var applicableDiscounts = await dbContext.Discounts
            .Where(d => d.StudentId == studentId && d.AcademicYearId == academicYearId && d.TermId == termId && !d.IsDeleted)
            .ToListAsync(cancellationToken);

        if (applicableDiscounts.Any())
        {
            result.Warnings.Add($"{applicableDiscounts.Count} discount(s) will be applied to this invoice");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    public async Task<ValidationResult> ValidatePaymentProcessing(Guid invoiceId, decimal paymentAmount, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Get invoice details
        var invoice = await dbContext.StudentInvoices
            .Include(si => si.Student)
            .FirstOrDefaultAsync(si => si.Id == invoiceId && !si.IsDeleted, cancellationToken);

        if (invoice == null)
        {
            result.Errors.Add("Invoice not found");
            return result;
        }

        // Check if invoice is already paid
        if (invoice.Status == "Paid")
        {
            result.Errors.Add("Invoice is already paid");
            return result;
        }

        // Calculate outstanding balance
        var totalPaid = await dbContext.Payments
            .Where(p => p.InvoiceId == invoiceId && !p.IsDeleted)
            .SumAsync(p => p.Amount, cancellationToken);

        var outstandingBalance = invoice.TotalAmount - totalPaid;

        if (paymentAmount > outstandingBalance)
        {
            result.Errors.Add($"Payment amount ({paymentAmount:C}) exceeds outstanding balance ({outstandingBalance:C})");
        }

        if (paymentAmount <= 0)
        {
            result.Errors.Add("Payment amount must be greater than zero");
        }

        // Check for payment plan restrictions
        var paymentPlan = await dbContext.PaymentPlans
            .FirstOrDefaultAsync(pp => pp.InvoiceId == invoiceId && !pp.IsDeleted, cancellationToken);

        if (paymentPlan != null)
        {
            var installmentAmount = invoice.TotalAmount / paymentPlan.Installments;
            if (paymentAmount < installmentAmount * 0.8m) // Allow 80% of installment minimum
            {
                result.Warnings.Add($"Payment amount is less than typical installment amount of {installmentAmount:C}");
            }
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Event-Related Validations

    public async Task<ValidationResult> ValidateEventRegistration(Guid eventId, List<Guid> participantIds, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Get event details
        var @event = await dbContext.SchoolEvents
            .FirstOrDefaultAsync(e => e.Id == eventId && !e.IsDeleted, cancellationToken);

        if (@event == null)
        {
            result.Errors.Add("Event not found");
            return result;
        }

        if (@event.StartAtUtc < DateTime.UtcNow)
        {
            result.Errors.Add("Cannot register for past events");
            return result;
        }

        // Check event capacity
        var currentParticipants = await dbContext.EventParticipants
            .CountAsync(ep => ep.SchoolEventId == eventId && !ep.IsDeleted, cancellationToken);

        if (@event.MaxParticipants.HasValue)
        {
            var availableSpots = @event.MaxParticipants.Value - currentParticipants;
            if (participantIds.Count > availableSpots)
            {
                result.Errors.Add($"Only {availableSpots} spot(s) available. Requested: {participantIds.Count}");
            }
        }

        // Validate each participant
        foreach (var participantId in participantIds)
        {
            // Check if participant exists
            var participant = await dbContext.EventParticipants
                .FirstOrDefaultAsync(ep => ep.SchoolEventId == eventId && 
                    (ep.StudentId == participantId || ep.GuardianId == participantId || ep.StaffId == participantId) && 
                    !ep.IsDeleted, cancellationToken);

            if (participant != null)
            {
                result.Warnings.Add($"Participant is already registered for this event");
                continue;
            }

            // Check for conflicting events
            var conflictingEvents = await dbContext.EventParticipants
                .Join(dbContext.SchoolEvents, ep => ep.SchoolEventId, e => e.Id, (ep, e) => new { ep, e })
                .Where(x => x.ep.StudentId == participantId || x.ep.GuardianId == participantId || x.ep.StaffId == participantId)
                .Where(x => !x.ep.IsDeleted && !x.e.IsDeleted)
                .Where(x => x.e.StartAtUtc < @event.EndAtUtc && x.e.EndAtUtc > @event.StartAtUtc)
                .Select(x => x.e.Title)
                .ToListAsync(cancellationToken);

            if (conflictingEvents.Any())
            {
                result.Warnings.Add($"Participant has conflicting events: {string.Join(", ", conflictingEvents)}");
            }
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Transport-Related Validations

    public async Task<ValidationResult> ValidateTransportAssignment(Guid studentId, Guid routeId, Guid? pickupStopId, Guid? dropoffStopId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Check if student exists and is active
        var student = await dbContext.Students.FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);
        if (student == null)
        {
            result.Errors.Add("Student not found");
            return result;
        }

        // Check if route exists
        var route = await dbContext.TransportRoutes.FirstOrDefaultAsync(tr => tr.Id == routeId && !tr.IsDeleted, cancellationToken);
        if (route == null)
        {
            result.Errors.Add("Transport route not found");
            return result;
        }

        // Validate stops belong to route
        if (pickupStopId.HasValue)
        {
            var pickupStop = await dbContext.TransportRouteStops
                .AnyAsync(trs => trs.Id == pickupStopId.Value && trs.TransportRouteId == routeId && !trs.IsDeleted, cancellationToken);

            if (!pickupStop)
            {
                result.Errors.Add("Pickup stop does not belong to specified route");
            }
        }

        if (dropoffStopId.HasValue)
        {
            var dropoffStop = await dbContext.TransportRouteStops
                .AnyAsync(trs => trs.Id == dropoffStopId.Value && trs.TransportRouteId == routeId && !trs.IsDeleted, cancellationToken);

            if (!dropoffStop)
            {
                result.Errors.Add("Dropoff stop does not belong to specified route");
            }
        }

        // Check for existing transport assignment
        var existingAssignment = await dbContext.TransportStudentAssignments
            .Include(tsa => tsa.TransportRoute)
            .FirstOrDefaultAsync(tsa => tsa.StudentId == studentId && tsa.IsCurrent && !tsa.IsDeleted, cancellationToken);

        if (existingAssignment != null)
        {
            result.Warnings.Add($"Student already has transport assignment for route: {existingAssignment.TransportRoute.Name}");
        }

        // Check if route has capacity
        var currentAssignments = await dbContext.TransportStudentAssignments
            .CountAsync(tsa => tsa.TransportRouteId == routeId && tsa.IsCurrent && !tsa.IsDeleted, cancellationToken);

        var routeCapacity = await dbContext.TransportRoutes
            .Where(tr => tr.Id == routeId)
            .SelectMany(tr => tr.Vehicles)
            .SumAsync(tv => (int?)tv.Capacity, cancellationToken) ?? 0;

        if (currentAssignments >= routeCapacity)
        {
            result.Errors.Add($"Transport route has reached maximum capacity of {routeCapacity} students");
        }

        // Check hostel compatibility (if student is in hostel)
        var hostelAllocation = await dbContext.HostelAllocations
            .Include(ha => ha.HostelBed)
            .ThenInclude(hb => hb.HostelRoom)
            .ThenInclude(hr => hr.Hostel)
            .FirstOrDefaultAsync(ha => ha.StudentId == studentId && ha.IsCurrent && !ha.IsDeleted, cancellationToken);

        if (hostelAllocation != null && hostelAllocation.HostelBed?.HostelRoom?.Hostel != null)
        {
            // Check if route serves to hostel area
            if (!route.StartLocation.Contains("Hostel", StringComparison.OrdinalIgnoreCase) &&
                !route.EndLocation.Contains("Hostel", StringComparison.OrdinalIgnoreCase))
            {
                result.Warnings.Add("Transport route may not serve to student's hostel location");
            }
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Hostel-Related Validations

    public async Task<ValidationResult> ValidateHostelAllocation(Guid studentId, Guid bedId, DateTime startDate, DateTime? endDate, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Check if student exists
        var student = await dbContext.Students.FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);
        if (student == null)
        {
            result.Errors.Add("Student not found");
            return result;
        }

        // Check if bed exists and is available
        var bed = await dbContext.HostelBeds
            .Include(hb => hb.HostelRoom.Hostel)
            .FirstOrDefaultAsync(hb => hb.Id == bedId && !hb.IsDeleted, cancellationToken);

        if (bed == null)
        {
            result.Errors.Add("Hostel bed not found");
            return result;
        }

        if (bed.Status != "Available")
        {
            result.Errors.Add($"Bed is not available. Current status: {bed.Status}");
            return result;
        }

        // Check gender policy
        if (!string.IsNullOrEmpty(bed.HostelRoom.Hostel.GenderPolicy) && 
            bed.HostelRoom.Hostel.GenderPolicy != "Mixed" && 
            bed.HostelRoom.Hostel.GenderPolicy != student.Gender)
        {
            result.Errors.Add($"Student gender ({student.Gender}) does not match hostel policy ({bed.HostelRoom.Hostel.GenderPolicy})");
        }

        // Check for overlapping allocations
        var overlappingAllocations = await dbContext.HostelAllocations
            .Include(ha => ha.HostelBed)
            .Where(ha => ha.HostelBedId == bedId && !ha.IsDeleted)
            .Where(ha => ha.StartDate <= endDate && (ha.EndDate == null || ha.EndDate >= startDate))
            .ToListAsync(cancellationToken);

        if (overlappingAllocations.Any())
        {
            result.Errors.Add("Bed is already allocated for specified period");
        }

        // Check if student has existing allocation
        var existingAllocation = await dbContext.HostelAllocations
            .Include(ha => ha.HostelBed)
            .ThenInclude(hb => hb.HostelRoom)
            .ThenInclude(hr => hr.Hostel)
            .FirstOrDefaultAsync(ha => ha.StudentId == studentId && ha.IsCurrent && !ha.IsDeleted, cancellationToken);

        if (existingAllocation != null && existingAllocation.HostelBed?.HostelRoom?.Hostel != null)
        {
            result.Warnings.Add($"Student already allocated to bed: {existingAllocation.HostelBed.BedCode} in {existingAllocation.HostelBed.HostelRoom.Hostel.Name}");
        }

        // Check room capacity
        var roomOccupants = await dbContext.HostelAllocations
            .CountAsync(ha => ha.HostelBed.HostelRoomId == bed.HostelRoomId && ha.IsCurrent && !ha.IsDeleted, cancellationToken);

        if (roomOccupants >= bed.HostelRoom.Capacity)
        {
            result.Errors.Add($"Room has reached maximum capacity of {bed.HostelRoom.Capacity} occupants");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Health-Related Validations

    public async Task<ValidationResult> ValidateHealthRecordCreation(Guid studentId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Check if student exists
        var student = await dbContext.Students.FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);
        if (student == null)
        {
            result.Errors.Add("Student not found");
            return result;
        }

        // Check for existing health profile
        var existingProfile = await dbContext.HealthProfiles
            .FirstOrDefaultAsync(hp => hp.StudentId == studentId && !hp.IsDeleted, cancellationToken);

        if (existingProfile != null)
        {
            result.Warnings.Add("Student already has a health profile. Consider updating the existing profile.");
        }

        // Check for critical allergies that might affect other services
        if (!string.IsNullOrEmpty(student.Gender))
        {
            var severeAllergies = new[] { "peanut", "shellfish", "bee", "latex", "penicillin" };
            // Note: Allergies are stored in HealthProfile, not Student entity
            result.Warnings.Add("Consider checking student health profile for any severe allergies");
        }

        // Check age-appropriate health screenings
        var age = DateTime.Today.Year - student.DateOfBirth.Year;
        var requiredScreenings = age switch
        {
            < 7 => new[] { "Vision", "Hearing", "General" },
            < 13 => new[] { "Vision", "Hearing", "Dental", "General" },
            < 18 => new[] { "Vision", "Hearing", "Dental", "Scoliosis", "General" },
            _ => new[] { "Vision", "Hearing", "Dental", "Blood Pressure", "General" }
        };

        if (existingProfile != null)
        {
            var completedScreenings = await dbContext.HealthScreenings
                .Where(hs => hs.HealthProfileId == existingProfile.Id && !hs.IsDeleted)
                .Select(hs => hs.ScreeningDateUtc)
                .ToListAsync(cancellationToken);

            var missingScreenings = requiredScreenings.Except(completedScreenings.Select(d => d.ToString())).ToList();
            if (missingScreenings.Any())
            {
                result.Warnings.Add($"Student may need following health screenings: {string.Join(", ", missingScreenings)}");
            }
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Academic-Related Validations

    public async Task<ValidationResult> ValidateGradeAssignment(Guid studentId, Guid subjectId, decimal score, Guid examId, CancellationToken cancellationToken = default)
    {
        var result = new ValidationResult();

        // Check if student exists and is enrolled
        var student = await dbContext.Students
            .FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted, cancellationToken);

        if (student == null)
        {
            result.Errors.Add("Student not found");
            return result;
        }

        // Check if student has any enrollments
        var hasEnrollments = await dbContext.StudentEnrollments
            .AnyAsync(se => se.StudentId == studentId && !se.IsDeleted, cancellationToken);

        if (!hasEnrollments)
        {
            result.Errors.Add("Student is not enrolled in any class");
            return result;
        }

        // Check if subject exists
        var subject = await dbContext.Subjects.FirstOrDefaultAsync(s => s.Id == subjectId && !s.IsDeleted, cancellationToken);
        if (subject == null)
        {
            result.Errors.Add("Subject not found");
            return result;
        }

        // Check if exam exists
        var exam = await dbContext.ExamSessions.FirstOrDefaultAsync(e => e.Id == examId && !e.IsDeleted, cancellationToken);
        if (exam == null)
        {
            result.Errors.Add("Exam not found");
            return result;
        }

        // Validate score range
        if (score < 0 || score > 100) // Default max score if not specified
        {
            result.Errors.Add($"Score must be between 0 and 100");
        }

        // Check for existing grade
        var existingGrade = await dbContext.StudentMarks
            .FirstOrDefaultAsync(sm => sm.StudentId == studentId && sm.SubjectId == subjectId && sm.ExamSessionId == examId && !sm.IsDeleted, cancellationToken);

        if (existingGrade != null)
        {
            result.Warnings.Add("Student already has a grade for this subject and exam. Consider updating the existing grade.");
        }

        // Check if student is enrolled in a class that offers this subject
        var validEnrollment = await dbContext.StudentEnrollments
            .Include(se => se.Class)
            .ThenInclude(c => c.SubjectAssignments)
            .AnyAsync(se => se.StudentId == studentId && !se.IsDeleted &&
                se.Class.SubjectAssignments.Any(sa => sa.SubjectId == subjectId && !sa.IsDeleted), cancellationToken);

        if (!validEnrollment)
        {
            result.Warnings.Add("Student may not be enrolled in a class that offers this subject");
        }

        result.IsValid = result.Errors.Count == 0;
        return result;
    }

    #endregion

    #region Helper Methods

    private async Task<decimal> GetStudentOutstandingBalance(Guid studentId, CancellationToken cancellationToken)
    {
        var totalInvoices = await dbContext.StudentInvoices
            .Where(si => si.StudentId == studentId && !si.IsDeleted)
            .SumAsync(si => si.TotalAmount, cancellationToken);

        var totalPayments = await dbContext.Payments
            .Where(p => p.StudentId == studentId && !p.IsDeleted)
            .SumAsync(p => p.Amount, cancellationToken);

        return totalInvoices - totalPayments;
    }

    #endregion
}
