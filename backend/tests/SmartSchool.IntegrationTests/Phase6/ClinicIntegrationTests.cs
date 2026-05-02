using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SmartSchool.API;
using SmartSchool.Domain.Modules.Health;
using SmartSchool.Persistence.Data;
using System.Net.Http.Headers;

namespace SmartSchool.IntegrationTests.Phase6;

public class ClinicIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly SmartSchoolDbContext _dbContext;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _schoolId = Guid.NewGuid();

    public ClinicIntegrationTests(WebApplicationFactory<Program> factory)
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
                    options.UseInMemoryDatabase("SmartSchoolClinicTestDb");
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

        // Create test clinic visit
        var testVisit = new ClinicVisit
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            StudentId = Guid.NewGuid(),
            VisitDateUtc = DateTime.UtcNow,
            ReasonForVisit = "Routine Checkup",
            Symptoms = "No symptoms",
            Diagnosis = "Healthy",
            Treatment = "No treatment needed",
            Status = "Completed",
            AttendingStaffId = Guid.NewGuid()
        };

        // Create test medication
        var testMedication = new ClinicMedication
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Name = "Paracetamol",
            Description = "Pain relief medication",
            Category = "Analgesic",
            Unit = "Tablet",
            CurrentStock = 100,
            MinimumStock = 20,
            MaximumStock = 500,
            ExpiryDate = DateTime.UtcNow.AddYears(2),
            Status = "Active"
        };

        _dbContext.ClinicVisits.Add(testVisit);
        _dbContext.ClinicMedications.Add(testMedication);
        await _dbContext.SaveChangesAsync();
    }

    [Fact]
    public async Task GetClinicVisits_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/clinic/visits?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }

    [Fact]
    public async Task CreateClinicVisit_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newVisit = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(),
            visitDateUtc = DateTime.UtcNow,
            reasonForVisit = "Headache",
            symptoms = "Mild headache, fatigue",
            diagnosis = "Tension headache",
            treatment = "Rest and hydration",
            status = "Completed",
            attendingStaffId = Guid.NewGuid()
        };

        var content = new StringContent(JsonConvert.SerializeObject(newVisit), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/clinic/visits", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdVisit = JsonConvert.DeserializeObject<ClinicVisit>(responseContent);
        
        Assert.NotNull(createdVisit);
        Assert.Equal("Headache", createdVisit.ReasonForVisit);
        Assert.Equal(_tenantId, createdVisit.TenantId);
        Assert.Equal(_schoolId, createdVisit.SchoolId);
    }

    [Fact]
    public async Task CreateMedication_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newMedication = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Ibuprofen",
            description = "Anti-inflammatory medication",
            category = "NSAID",
            unit = "Tablet",
            currentStock = 50,
            minimumStock = 10,
            maximumStock = 200,
            expiryDate = DateTime.UtcNow.AddYears(3),
            status = "Active"
        };

        var content = new StringContent(JsonConvert.SerializeObject(newMedication), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/clinic/medications", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdMedication = JsonConvert.DeserializeObject<ClinicMedication>(responseContent);
        
        Assert.NotNull(createdMedication);
        Assert.Equal("Ibuprofen", createdMedication.Name);
        Assert.Equal(50, createdMedication.CurrentStock);
        Assert.Equal(_tenantId, createdMedication.TenantId);
    }

    [Fact]
    public async Task CreatePrescription_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var visitId = _dbContext.ClinicVisits.First().Id;
        var medicationId = _dbContext.ClinicMedications.First().Id;
        
        var prescription = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            clinicVisitId = visitId,
            prescribedByStaffId = Guid.NewGuid(),
            notes = "Take as needed for pain",
            items = new[]
            {
                new
                {
                    clinicMedicationId = medicationId,
                    dosage = "500mg",
                    frequency = "Every 6 hours as needed",
                    duration = "3 days",
                    quantity = 6,
                    instructions = "Take with food"
                }
            }
        };

        var content = new StringContent(JsonConvert.SerializeObject(prescription), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/clinic/prescriptions", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdPrescription = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(createdPrescription);
        Assert.Equal(visitId.ToString(), createdPrescription.clinicVisitId.ToString());
        Assert.NotNull(createdPrescription.items);
    }

    [Fact]
    public async Task CreateMedicationDispense_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var medicationId = _dbContext.ClinicMedications.First().Id;
        
        var dispense = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            clinicMedicationId = medicationId,
            quantityDispensed = 5,
            dispensedToStudentId = Guid.NewGuid(),
            dispensedByStaffId = Guid.NewGuid(),
            dispensedAtUtc = DateTime.UtcNow,
            notes = "For headache treatment"
        };

        var content = new StringContent(JsonConvert.SerializeObject(dispense), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/clinic/medication-dispenses", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdDispense = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(createdDispense);
        Assert.Equal(medicationId.ToString(), createdDispense.clinicMedicationId.ToString());
        Assert.Equal(5, createdDispense.quantityDispensed);
    }

    [Fact]
    public async Task FulfillPrescription_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        // First create a prescription
        var visitId = _dbContext.ClinicVisits.First().Id;
        var medicationId = _dbContext.ClinicMedications.First().Id;
        
        var prescription = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            clinicVisitId = visitId,
            prescribedByStaffId = Guid.NewGuid(),
            notes = "Take as needed for pain",
            items = new[]
            {
                new
                {
                    clinicMedicationId = medicationId,
                    dosage = "500mg",
                    frequency = "Every 6 hours as needed",
                    duration = "3 days",
                    quantity = 6,
                    instructions = "Take with food"
                }
            }
        };

        var prescriptionContent = new StringContent(JsonConvert.SerializeObject(prescription), Encoding.UTF8, "application/json");
        var prescriptionResponse = await _client.PostAsync("/api/clinic/prescriptions", prescriptionContent);
        prescriptionResponse.EnsureSuccessStatusCode();

        var prescriptionResponseContent = await prescriptionResponse.Content.ReadAsStringAsync();
        var createdPrescription = JsonConvert.DeserializeObject<dynamic>(prescriptionResponseContent);
        var prescriptionId = Guid.Parse(createdPrescription.id.ToString());

        var fulfillRequest = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            dispensedByStaffId = Guid.NewGuid()
        };

        var fulfillContent = new StringContent(JsonConvert.SerializeObject(fulfillRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/clinic/prescriptions/{prescriptionId}/fulfill", fulfillContent);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.dispensedItems);
        Assert.NotNull(result.updatedStockLevels);
    }

    [Fact]
    public async Task GetClinicAnalytics_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/clinic/analytics?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var analytics = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(analytics);
        Assert.NotNull(analytics.totalVisits);
        Assert.NotNull(analytics.totalPrescriptions);
        Assert.NotNull(analytics.totalMedications);
        Assert.NotNull(analytics.lowStockMedications);
    }

    [Fact]
    public async Task ReferVisit_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var visitId = _dbContext.ClinicVisits.First().Id;
        
        var referralRequest = new
        {
            referralReason = "Specialist consultation needed",
            referredTo = "Cardiologist",
            referralNotes = "Patient needs cardiac evaluation",
            referralDateUtc = DateTime.UtcNow.AddDays(7)
        };

        var content = new StringContent(JsonConvert.SerializeObject(referralRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/clinic/visits/{visitId}/refer", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.referralId);
        Assert.Equal("Cardiologist", result.referredTo.ToString());
    }

    [Fact]
    public async Task UpdateMedicationStock_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var medicationId = _dbContext.ClinicMedications.First().Id;
        
        var stockUpdate = new
        {
            adjustmentQuantity = 20,
            adjustmentType = "Add",
            reason = "New stock received",
            adjustedByStaffId = Guid.NewGuid()
        };

        var content = new StringContent(JsonConvert.SerializeObject(stockUpdate), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/clinic/medications/{medicationId}/adjust-stock", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.newStockLevel);
        Assert.Equal(120, result.newStockLevel); // Original 100 + 20
    }

    [Fact]
    public async Task CreateMedication_InvalidStockLevels_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var invalidMedication = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Invalid Medication",
            description = "Test medication",
            category = "Test",
            unit = "Tablet",
            currentStock = 10,
            minimumStock = 20, // Minimum greater than current
            maximumStock = 5,  // Maximum less than current
            expiryDate = DateTime.UtcNow.AddYears(1),
            status = "Active"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidMedication), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/clinic/medications", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateMedicationDispense_ExceedsStock_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var medicationId = _dbContext.ClinicMedications.First().Id;
        
        var invalidDispense = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            clinicMedicationId = medicationId,
            quantityDispensed = 150, // Exceeds current stock of 100
            dispensedToStudentId = Guid.NewGuid(),
            dispensedByStaffId = Guid.NewGuid(),
            dispensedAtUtc = DateTime.UtcNow,
            notes = "Invalid dispense"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidDispense), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/clinic/medication-dispenses", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetClinicVisits_Unauthorized_ReturnsUnauthorized()
    {
        // Arrange - No authorization header

        // Act
        var response = await _client.GetAsync($"/api/clinic/visits?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetLowStockMedications_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/clinic/medications/low-stock?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var lowStockMeds = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(lowStockMeds);
        // Should return medications below minimum stock threshold
    }

    private string GetTestToken()
    {
        // This would normally generate a valid JWT token for testing
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.clinic.token";
    }
}
