using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SmartSchool.API;
using SmartSchool.Domain.Modules.Events;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Domain.Modules.Health;
using SmartSchool.Domain.Modules.Finance;
using SmartSchool.Domain.Modules.Students;
using SmartSchool.Persistence.Data;
using System.Net.Http.Headers;

namespace SmartSchool.IntegrationTests.Phase6;

public class BusinessWorkflowTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly SmartSchoolDbContext _dbContext;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _schoolId = Guid.NewGuid();
    private readonly Guid _academicYearId = Guid.NewGuid();
    private readonly Guid _termId = Guid.NewGuid();

    public BusinessWorkflowTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<SmartSchoolDbContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<SmartSchoolDbContext>(options =>
                {
                    options.UseInMemoryDatabase("SmartSchoolWorkflowTestDb");
                });
            });
        });

        _client = _factory.CreateClient();
        var scope = _factory.Services.CreateScope();
        _dbContext = scope.ServiceProvider.GetRequiredService<SmartSchoolDbContext>();
        
        SetupTestData().GetAwaiter().GetResult();
    }

    private async Task SetupTestData()
    {
        // Clean database
        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        // Create test student
        var testStudent = new Student
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            StudentNumber = "STU001",
            FirstName = "John",
            LastName = "Doe",
            Gender = "Male",
            DateOfBirth = DateTime.UtcNow.AddYears(-15),
            Status = "Active"
        };

        // Create test class
        var testClass = new SmartSchool.Domain.Modules.Academics.Class
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Name = "Grade 10A",
            GradeId = Guid.NewGuid(),
            MaxStudents = 30
        };

        // Create fee structure
        var feeStructure = new SmartSchool.Domain.Modules.Finance.FeeStructure
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            AcademicYearId = _academicYearId,
            TermId = _termId,
            GradeId = testClass.GradeId,
            FeeCategoryId = Guid.NewGuid(),
            Amount = 1000m,
            Currency = SmartSchool.Domain.Common.CurrencyCode.USD
        };

        _dbContext.Students.Add(testStudent);
        _dbContext.Classes.Add(testClass);
        _dbContext.FeeStructures.Add(feeStructure);
        await _dbContext.SaveChangesAsync();
    }

    [Fact]
    public async Task CompleteStudentOnboardingWorkflow_Success()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;
        var classId = _dbContext.Classes.First().Id;

        // Step 1: Enroll student
        var enrollment = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            classId = classId,
            academicYearId = _academicYearId,
            termId = _termId,
            enrollmentDate = DateTime.UtcNow,
            status = "Active"
        };

        var enrollmentContent = new StringContent(JsonConvert.SerializeObject(enrollment), Encoding.UTF8, "application/json");
        var enrollmentResponse = await _client.PostAsync("/api/students/enrollments", enrollmentContent);
        enrollmentResponse.EnsureSuccessStatusCode();

        // Step 2: Generate invoice
        var invoice = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            academicYearId = _academicYearId,
            termId = _termId,
            dueDate = DateTime.UtcNow.AddDays(30),
            status = "Draft",
            lines = new[]
            {
                new
                {
                    feeCategoryId = _dbContext.FeeStructures.First().FeeCategoryId,
                    description = "Tuition Fee",
                    amount = 1000m
                }
            }
        };

        var invoiceContent = new StringContent(JsonConvert.SerializeObject(invoice), Encoding.UTF8, "application/json");
        var invoiceResponse = await _client.PostAsync("/api/finance/invoices", invoiceContent);
        invoiceResponse.EnsureSuccessStatusCode();

        var invoiceResponseContent = await invoiceResponse.Content.ReadAsStringAsync();
        var createdInvoice = JsonConvert.DeserializeObject<dynamic>(invoiceResponseContent);
        var invoiceId = Guid.Parse(createdInvoice.id.ToString());

        // Step 3: Process payment
        var payment = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            invoiceId = invoiceId,
            amount = 1000m,
            method = "Bank Transfer",
            reference = "PAY-001",
            paymentDate = DateTime.UtcNow,
            receivedByUserId = Guid.NewGuid()
        };

        var paymentContent = new StringContent(JsonConvert.SerializeObject(payment), Encoding.UTF8, "application/json");
        var paymentResponse = await _client.PostAsync("/api/finance/payments", paymentContent);
        paymentResponse.EnsureSuccessStatusCode();

        // Assert all steps completed successfully
        Assert.True(enrollmentResponse.IsSuccessStatusCode);
        Assert.True(invoiceResponse.IsSuccessStatusCode);
        Assert.True(paymentResponse.IsSuccessStatusCode);
    }

    [Fact]
    public async Task TransportAssignmentWorkflow_Success()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;

        // Step 1: Create vehicle
        var vehicle = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            registrationNumber = "BUS-001",
            make = "Toyota",
            model = "Coaster",
            year = 2023,
            capacity = 40,
            status = "Active"
        };

        var vehicleContent = new StringContent(JsonConvert.SerializeObject(vehicle), Encoding.UTF8, "application/json");
        var vehicleResponse = await _client.PostAsync("/api/transport/vehicles", vehicleContent);
        vehicleResponse.EnsureSuccessStatusCode();

        var vehicleResponseContent = await vehicleResponse.Content.ReadAsStringAsync();
        var createdVehicle = JsonConvert.DeserializeObject<dynamic>(vehicleResponseContent);
        var vehicleId = Guid.Parse(createdVehicle.id.ToString());

        // Step 2: Create route
        var route = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Morning Route",
            startLocation = "City Center",
            endLocation = "Smart School",
            distance = 10.5m,
            estimatedDuration = "00:30:00",
            status = "Active"
        };

        var routeContent = new StringContent(JsonConvert.SerializeObject(route), Encoding.UTF8, "application/json");
        var routeResponse = await _client.PostAsync("/api/transport/routes", routeContent);
        routeResponse.EnsureSuccessStatusCode();

        var routeResponseContent = await routeResponse.Content.ReadAsStringAsync();
        var createdRoute = JsonConvert.DeserializeObject<dynamic>(routeResponseContent);
        var routeId = Guid.Parse(createdRoute.id.ToString());

        // Step 3: Assign student to route
        var assignment = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            transportRouteId = routeId,
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var assignmentContent = new StringContent(JsonConvert.SerializeObject(assignment), Encoding.UTF8, "application/json");
        var assignmentResponse = await _client.PostAsync("/api/transport/assignments", assignmentContent);
        assignmentResponse.EnsureSuccessStatusCode();

        // Step 4: Create daily trip
        var trip = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            vehicleId = vehicleId,
            routeId = routeId,
            driverStaffId = Guid.NewGuid(),
            scheduledStartTimeUtc = DateTime.UtcNow.AddHours(1),
            scheduledEndTimeUtc = DateTime.UtcNow.AddHours(1).AddMinutes(30),
            status = "Scheduled"
        };

        var tripContent = new StringContent(JsonConvert.SerializeObject(trip), Encoding.UTF8, "application/json");
        var tripResponse = await _client.PostAsync("/api/transport/trips", tripContent);
        tripResponse.EnsureSuccessStatusCode();

        // Assert all steps completed successfully
        Assert.True(vehicleResponse.IsSuccessStatusCode);
        Assert.True(routeResponse.IsSuccessStatusCode);
        Assert.True(assignmentResponse.IsSuccessStatusCode);
        Assert.True(tripResponse.IsSuccessStatusCode);
    }

    [Fact]
    public async Task HostelAllocationWorkflow_Success()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;

        // Step 1: Create hostel
        var hostel = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Boys Hostel",
            genderPolicy = "Male",
            capacity = 100,
            isActive = true
        };

        var hostelContent = new StringContent(JsonConvert.SerializeObject(hostel), Encoding.UTF8, "application/json");
        var hostelResponse = await _client.PostAsync("/api/hostels/hostels", hostelContent);
        hostelResponse.EnsureSuccessStatusCode();

        var hostelResponseContent = await hostelResponse.Content.ReadAsStringAsync();
        var createdHostel = JsonConvert.DeserializeObject<dynamic>(hostelResponseContent);
        var hostelId = Guid.Parse(createdHostel.id.ToString());

        // Step 2: Create room
        var room = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelId = hostelId,
            name = "Room 101",
            capacity = 4,
            floorName = "Ground Floor"
        };

        var roomContent = new StringContent(JsonConvert.SerializeObject(room), Encoding.UTF8, "application/json");
        var roomResponse = await _client.PostAsync("/api/hostels/rooms", roomContent);
        roomResponse.EnsureSuccessStatusCode();

        var roomResponseContent = await roomResponse.Content.ReadAsStringAsync();
        var createdRoom = JsonConvert.DeserializeObject<dynamic>(roomResponseContent);
        var roomId = Guid.Parse(createdRoom.id.ToString());

        // Step 3: Create bed
        var bed = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelRoomId = roomId,
            bedCode = "A101",
            status = "Available"
        };

        var bedContent = new StringContent(JsonConvert.SerializeObject(bed), Encoding.UTF8, "application/json");
        var bedResponse = await _client.PostAsync("/api/hostels/beds", bedContent);
        bedResponse.EnsureSuccessStatusCode();

        var bedResponseContent = await bedResponse.Content.ReadAsStringAsync();
        var createdBed = JsonConvert.DeserializeObject<dynamic>(bedResponseContent);
        var bedId = Guid.Parse(createdBed.id.ToString());

        // Step 4: Allocate student to bed
        var allocation = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            hostelBedId = bedId,
            academicYearId = _academicYearId,
            termId = _termId,
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var allocationContent = new StringContent(JsonConvert.SerializeObject(allocation), Encoding.UTF8, "application/json");
        var allocationResponse = await _client.PostAsync("/api/hostels/allocations", allocationContent);
        allocationResponse.EnsureSuccessStatusCode();

        // Assert all steps completed successfully
        Assert.True(hostelResponse.IsSuccessStatusCode);
        Assert.True(roomResponse.IsSuccessStatusCode);
        Assert.True(bedResponse.IsSuccessStatusCode);
        Assert.True(allocationResponse.IsSuccessStatusCode);
    }

    [Fact]
    public async Task HealthManagementWorkflow_Success()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;

        // Step 1: Create health profile
        var profile = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            bloodGroup = "O+",
            allergies = "Peanuts",
            chronicConditions = "Asthma",
            emergencyContactName = "Parent",
            emergencyContactPhone = "+1234567890"
        };

        var profileContent = new StringContent(JsonConvert.SerializeObject(profile), Encoding.UTF8, "application/json");
        var profileResponse = await _client.PostAsync("/api/health/profiles", profileContent);
        profileResponse.EnsureSuccessStatusCode();

        var profileResponseContent = await profileResponse.Content.ReadAsStringAsync();
        var createdProfile = JsonConvert.DeserializeObject<dynamic>(profileResponseContent);
        var profileId = Guid.Parse(createdProfile.id.ToString());

        // Step 2: Create health screening
        var screening = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            screeningDateUtc = DateTime.UtcNow,
            heightCm = 165.0m,
            weightKg = 55.0m,
            bloodPressure = "110/70",
            notes = "Normal health parameters",
            screenedByStaffId = Guid.NewGuid()
        };

        var screeningContent = new StringContent(JsonConvert.SerializeObject(screening), Encoding.UTF8, "application/json");
        var screeningResponse = await _client.PostAsync("/api/health/screenings", screeningContent);
        screeningResponse.EnsureSuccessStatusCode();

        // Step 3: Create immunization record
        var immunization = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            vaccineName = "BCG",
            doseNumber = 1,
            administeredDateUtc = DateTime.UtcNow.AddDays(-30),
            nextDueDateUtc = DateTime.UtcNow.AddDays(365),
            administeredByStaffId = Guid.NewGuid(),
            batchNumber = "BCG-2023-001"
        };

        var immunizationContent = new StringContent(JsonConvert.SerializeObject(immunization), Encoding.UTF8, "application/json");
        var immunizationResponse = await _client.PostAsync("/api/health/immunizations", immunizationContent);
        immunizationResponse.EnsureSuccessStatusCode();

        // Step 4: Create action plan
        var actionPlan = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            title = "Asthma Management",
            description = "Daily monitoring and emergency procedures",
            startDateUtc = DateTime.UtcNow,
            endDateUtc = DateTime.UtcNow.AddDays(180),
            assignedToStaffId = Guid.NewGuid(),
            status = "Active"
        };

        var actionPlanContent = new StringContent(JsonConvert.SerializeObject(actionPlan), Encoding.UTF8, "application/json");
        var actionPlanResponse = await _client.PostAsync("/api/health/action-plans", actionPlanContent);
        actionPlanResponse.EnsureSuccessStatusCode();

        // Assert all steps completed successfully
        Assert.True(profileResponse.IsSuccessStatusCode);
        Assert.True(screeningResponse.IsSuccessStatusCode);
        Assert.True(immunizationResponse.IsSuccessStatusCode);
        Assert.True(actionPlanResponse.IsSuccessStatusCode);
    }

    [Fact]
    public async Task ClinicVisitWorkflow_Success()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;

        // Step 1: Create clinic visit
        var visit = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            visitDateUtc = DateTime.UtcNow,
            reasonForVisit = "Fever and headache",
            symptoms = "Temperature 38°C, mild headache",
            diagnosis = "Viral fever",
            treatment = "Paracetamol and rest",
            status = "Completed",
            attendingStaffId = Guid.NewGuid()
        };

        var visitContent = new StringContent(JsonConvert.SerializeObject(visit), Encoding.UTF8, "application/json");
        var visitResponse = await _client.PostAsync("/api/clinic/visits", visitContent);
        visitResponse.EnsureSuccessStatusCode();

        var visitResponseContent = await visitResponse.Content.ReadAsStringAsync();
        var createdVisit = JsonConvert.DeserializeObject<dynamic>(visitResponseContent);
        var visitId = Guid.Parse(createdVisit.id.ToString());

        // Step 2: Create medication
        var medication = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Paracetamol",
            description = "Pain relief and fever reducer",
            category = "Analgesic",
            unit = "Tablet",
            currentStock = 100,
            minimumStock = 20,
            maximumStock = 500,
            expiryDate = DateTime.UtcNow.AddYears(2),
            status = "Active"
        };

        var medicationContent = new StringContent(JsonConvert.SerializeObject(medication), Encoding.UTF8, "application/json");
        var medicationResponse = await _client.PostAsync("/api/clinic/medications", medicationContent);
        medicationResponse.EnsureSuccessStatusCode();

        var medicationResponseContent = await medicationResponse.Content.ReadAsStringAsync();
        var createdMedication = JsonConvert.DeserializeObject<dynamic>(medicationResponseContent);
        var medicationId = Guid.Parse(createdMedication.id.ToString());

        // Step 3: Create prescription
        var prescription = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            clinicVisitId = visitId,
            prescribedByStaffId = Guid.NewGuid(),
            notes = "Take for fever",
            items = new[]
            {
                new
                {
                    clinicMedicationId = medicationId,
                    dosage = "500mg",
                    frequency = "Every 6 hours",
                    duration = "3 days",
                    quantity = 6,
                    instructions = "Take after meals"
                }
            }
        };

        var prescriptionContent = new StringContent(JsonConvert.SerializeObject(prescription), Encoding.UTF8, "application/json");
        var prescriptionResponse = await _client.PostAsync("/api/clinic/prescriptions", prescriptionContent);
        prescriptionResponse.EnsureSuccessStatusCode();

        var prescriptionResponseContent = await prescriptionResponse.Content.ReadAsStringAsync();
        var createdPrescription = JsonConvert.DeserializeObject<dynamic>(prescriptionResponseContent);
        var prescriptionId = Guid.Parse(createdPrescription.id.ToString());

        // Step 4: Fulfill prescription
        var fulfillRequest = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            dispensedByStaffId = Guid.NewGuid()
        };

        var fulfillContent = new StringContent(JsonConvert.SerializeObject(fulfillRequest), Encoding.UTF8, "application/json");
        var fulfillResponse = await _client.PostAsync($"/api/clinic/prescriptions/{prescriptionId}/fulfill", fulfillContent);
        fulfillResponse.EnsureSuccessStatusCode();

        // Assert all steps completed successfully
        Assert.True(visitResponse.IsSuccessStatusCode);
        Assert.True(medicationResponse.IsSuccessStatusCode);
        Assert.True(prescriptionResponse.IsSuccessStatusCode);
        Assert.True(fulfillResponse.IsSuccessStatusCode);
    }

    [Fact]
    public async Task EventManagementWorkflow_Success()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;

        // Step 1: Create event
        var @event = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            academicYearId = _academicYearId,
            termId = _termId,
            title = "Sports Day",
            description = "Annual sports competition",
            startAtUtc = DateTime.UtcNow.AddDays(7),
            endAtUtc = DateTime.UtcNow.AddDays(7).AddHours(6),
            venue = "School Ground",
            maxParticipants = 200,
            organizerStaffId = Guid.NewGuid(),
            status = "Scheduled"
        };

        var eventContent = new StringContent(JsonConvert.SerializeObject(@event), Encoding.UTF8, "application/json");
        var eventResponse = await _client.PostAsync("/api/events/events", eventContent);
        eventResponse.EnsureSuccessStatusCode();

        var eventResponseContent = await eventResponse.Content.ReadAsStringAsync();
        var createdEvent = JsonConvert.DeserializeObject<dynamic>(eventResponseContent);
        var eventId = Guid.Parse(createdEvent.id.ToString());

        // Step 2: Register participants
        var participants = new
        {
            participants = new[]
            {
                new { studentId = studentId }
            }
        };

        var participantsContent = new StringContent(JsonConvert.SerializeObject(participants), Encoding.UTF8, "application/json");
        var participantsResponse = await _client.PostAsync($"/api/events/events/{eventId}/participants", participantsContent);
        participantsResponse.EnsureSuccessStatusCode();

        // Step 3: Mark attendance
        var attendance = new
        {
            participantId = studentId,
            attendanceStatus = "Present",
            notes = "Participated in 100m sprint"
        };

        var attendanceContent = new StringContent(JsonConvert.SerializeObject(attendance), Encoding.UTF8, "application/json");
        var attendanceResponse = await _client.PostAsync($"/api/events/events/{eventId}/attendance", attendanceContent);
        attendanceResponse.EnsureSuccessStatusCode();

        // Assert all steps completed successfully
        Assert.True(eventResponse.IsSuccessStatusCode);
        Assert.True(participantsResponse.IsSuccessStatusCode);
        Assert.True(attendanceResponse.IsSuccessStatusCode);
    }

    [Fact]
    public async Task CrossModuleIntegrationWorkflow_Success()
    {
        // This test demonstrates integration across multiple modules
        
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var studentId = _dbContext.Students.First().Id;

        // Step 1: Create health profile
        var profile = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            bloodGroup = "A+",
            allergies = "None",
            chronicConditions = "None",
            emergencyContactName = "Parent",
            emergencyContactPhone = "+1234567890"
        };

        var profileContent = new StringContent(JsonConvert.SerializeObject(profile), Encoding.UTF8, "application/json");
        var profileResponse = await _client.PostAsync("/api/health/profiles", profileContent);
        profileResponse.EnsureSuccessStatusCode();

        // Step 2: Allocate to hostel
        var hostel = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Integration Test Hostel",
            genderPolicy = "Male",
            capacity = 50,
            isActive = true
        };

        var hostelContent = new StringContent(JsonConvert.SerializeObject(hostel), Encoding.UTF8, "application/json");
        var hostelResponse = await _client.PostAsync("/api/hostels/hostels", hostelContent);
        hostelResponse.EnsureSuccessStatusCode();

        var hostelResponseContent = await hostelResponse.Content.ReadAsStringAsync();
        var createdHostel = JsonConvert.DeserializeObject<dynamic>(hostelResponseContent);
        var hostelId = Guid.Parse(createdHostel.id.ToString());

        // Step 3: Assign to transport route
        var route = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Hostel Shuttle",
            startLocation = $"{createdHostel.name} Premises",
            endLocation = "Smart School",
            distance = 2.0m,
            estimatedDuration = "00:10:00",
            status = "Active"
        };

        var routeContent = new StringContent(JsonConvert.SerializeObject(route), Encoding.UTF8, "application/json");
        var routeResponse = await _client.PostAsync("/api/transport/routes", routeContent);
        routeResponse.EnsureSuccessStatusCode();

        var routeResponseContent = await routeResponse.Content.ReadAsStringAsync();
        var createdRoute = JsonConvert.DeserializeObject<dynamic>(routeResponseContent);
        var routeId = Guid.Parse(createdRoute.id.ToString());

        var assignment = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            transportRouteId = routeId,
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var assignmentContent = new StringContent(JsonConvert.SerializeObject(assignment), Encoding.UTF8, "application/json");
        var assignmentResponse = await _client.PostAsync("/api/transport/assignments", assignmentContent);
        assignmentResponse.EnsureSuccessStatusCode();

        // Step 4: Register for school event
        var @event = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            title = "Welcome Event",
            description = "Welcome event for new students",
            startAtUtc = DateTime.UtcNow.AddDays(14),
            endAtUtc = DateTime.UtcNow.AddDays(14).AddHours(3),
            venue = "School Auditorium",
            maxParticipants = 100,
            status = "Scheduled"
        };

        var eventContent = new StringContent(JsonConvert.SerializeObject(@event), Encoding.UTF8, "application/json");
        var eventResponse = await _client.PostAsync("/api/events/events", eventContent);
        eventResponse.EnsureSuccessStatusCode();

        var eventResponseContent = await eventResponse.Content.ReadAsStringAsync();
        var createdEvent = JsonConvert.DeserializeObject<dynamic>(eventResponseContent);
        var eventId = Guid.Parse(createdEvent.id.ToString());

        var participants = new
        {
            participants = new[]
            {
                new { studentId = studentId }
            }
        };

        var participantsContent = new StringContent(JsonConvert.SerializeObject(participants), Encoding.UTF8, "application/json");
        var participantsResponse = await _client.PostAsync($"/api/events/events/{eventId}/participants", participantsContent);
        participantsResponse.EnsureSuccessStatusCode();

        // Assert all cross-module integrations completed successfully
        Assert.True(profileResponse.IsSuccessStatusCode);
        Assert.True(hostelResponse.IsSuccessStatusCode);
        Assert.True(routeResponse.IsSuccessStatusCode);
        Assert.True(assignmentResponse.IsSuccessStatusCode);
        Assert.True(eventResponse.IsSuccessStatusCode);
        Assert.True(participantsResponse.IsSuccessStatusCode);
    }

    private string GetTestToken()
    {
        // This would normally generate a valid JWT token for testing
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.workflow.token";
    }
}
