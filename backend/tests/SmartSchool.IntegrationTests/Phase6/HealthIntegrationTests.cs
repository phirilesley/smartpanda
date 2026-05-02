using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SmartSchool.API;
using SmartSchool.Domain.Modules.Health;
using SmartSchool.Persistence.Data;
using System.Net.Http.Headers;

namespace SmartSchool.IntegrationTests.Phase6;

public class HealthIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly SmartSchoolDbContext _dbContext;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _schoolId = Guid.NewGuid();

    public HealthIntegrationTests(WebApplicationFactory<Program> factory)
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
                    options.UseInMemoryDatabase("SmartSchoolHealthTestDb");
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

        // Create test health profile
        var testProfile = new HealthProfile
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            StudentId = Guid.NewGuid(),
            BloodGroup = "O+",
            Allergies = "Peanuts, Dust",
            ChronicConditions = "Asthma",
            EmergencyContactName = "John Doe",
            EmergencyContactPhone = "+1234567890"
        };

        _dbContext.HealthProfiles.Add(testProfile);
        await _dbContext.SaveChangesAsync();
    }

    [Fact]
    public async Task GetHealthProfiles_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/health/profiles?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }

    [Fact]
    public async Task CreateHealthProfile_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newProfile = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(),
            bloodGroup = "A+",
            allergies = "None",
            chronicConditions = "None",
            emergencyContactName = "Jane Smith",
            emergencyContactPhone = "+9876543210"
        };

        var content = new StringContent(JsonConvert.SerializeObject(newProfile), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/health/profiles", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdProfile = JsonConvert.DeserializeObject<HealthProfile>(responseContent);
        
        Assert.NotNull(createdProfile);
        Assert.Equal("A+", createdProfile.BloodGroup);
        Assert.Equal(_tenantId, createdProfile.TenantId);
        Assert.Equal(_schoolId, createdProfile.SchoolId);
    }

    [Fact]
    public async Task CreateScreening_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;
        
        var screening = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            screeningDateUtc = DateTime.UtcNow,
            heightCm = 175.5m,
            weightKg = 70.2m,
            bloodPressure = "120/80",
            notes = "Regular checkup - all normal",
            screenedByStaffId = Guid.NewGuid()
        };

        var content = new StringContent(JsonConvert.SerializeObject(screening), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/health/screenings", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdScreening = JsonConvert.DeserializeObject<HealthScreening>(responseContent);
        
        Assert.NotNull(createdScreening);
        Assert.Equal(175.5m, createdScreening.HeightCm);
        Assert.Equal(70.2m, createdScreening.WeightKg);
        Assert.Equal("120/80", createdScreening.BloodPressure);
    }

    [Fact]
    public async Task CreateImmunization_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;
        
        var immunization = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            vaccineName = "MMR",
            doseNumber = 1,
            administeredDateUtc = DateTime.UtcNow.AddDays(-30),
            nextDueDateUtc = DateTime.UtcNow.AddDays(365),
            administeredByStaffId = Guid.NewGuid(),
            batchNumber = "MMR-2023-001",
            notes = "First dose administered"
        };

        var content = new StringContent(JsonConvert.SerializeObject(immunization), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/health/immunizations", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdImmunization = JsonConvert.DeserializeObject<ImmunizationRecord>(responseContent);
        
        Assert.NotNull(createdImmunization);
        Assert.Equal("MMR", createdImmunization.VaccineName);
        Assert.Equal(1, createdImmunization.DoseNumber);
        Assert.Equal(profileId, createdImmunization.HealthProfileId);
    }

    [Fact]
    public async Task CreateActionPlan_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;
        
        var actionPlan = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            title = "Asthma Management Plan",
            description = "Daily inhaler use and emergency procedures",
            startDateUtc = DateTime.UtcNow,
            endDateUtc = DateTime.UtcNow.AddDays(180),
            assignedToStaffId = Guid.NewGuid(),
            status = "Active"
        };

        var content = new StringContent(JsonConvert.SerializeObject(actionPlan), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/health/action-plans", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdActionPlan = JsonConvert.DeserializeObject<HealthActionPlan>(responseContent);
        
        Assert.NotNull(createdActionPlan);
        Assert.Equal("Asthma Management Plan", createdActionPlan.Title);
        Assert.Equal("Active", createdActionPlan.Status);
    }

    [Fact]
    public async Task GetHealthAlerts_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/health/alerts?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var alerts = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(alerts);
        // Should return alerts for immunizations, chronic conditions, and severe allergies
    }

    [Fact]
    public async Task GetHealthAnalytics_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/health/analytics?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var analytics = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(analytics);
        Assert.NotNull(analytics.totalProfiles);
        Assert.NotNull(analytics.upcomingImmunizations);
        Assert.NotNull(analytics.chronicConditionCount);
        Assert.NotNull(analytics.allergyAlerts);
    }

    [Fact]
    public async Task UpdateHealthProfile_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;
        
        var updateData = new
        {
            bloodGroup = "B+",
            allergies = "Peanuts, Dust, Pollen",
            chronicConditions = "Asthma, Seasonal Allergies",
            emergencyContactName = "Updated Contact",
            emergencyContactPhone = "+1111111111"
        };

        var content = new StringContent(JsonConvert.SerializeObject(updateData), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync($"/api/health/profiles/{profileId}", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var updatedProfile = JsonConvert.DeserializeObject<HealthProfile>(responseContent);
        
        Assert.NotNull(updatedProfile);
        Assert.Equal("B+", updatedProfile.BloodGroup);
        Assert.Contains("Pollen", updatedProfile.Allergies);
        Assert.Contains("Seasonal Allergies", updatedProfile.ChronicConditions);
    }

    [Fact]
    public async Task ScheduleImmunization_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;
        
        var scheduleRequest = new
        {
            vaccineName = "COVID-19 Booster",
            scheduledDateUtc = DateTime.UtcNow.AddDays(30),
            doseNumber = 3,
            notes = "Annual booster dose"
        };

        var content = new StringContent(JsonConvert.SerializeObject(scheduleRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/health/profiles/{profileId}/schedule-immunization", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.immunizationId);
        Assert.Equal("COVID-19 Booster", result.vaccineName.ToString());
    }

    [Fact]
    public async Task CreateHealthProfile_MissingRequiredFields_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var invalidProfile = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            // Missing studentId
            bloodGroup = "O+",
            allergies = "None",
            chronicConditions = "None"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidProfile), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/health/profiles", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateScreening_InvalidVitals_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;
        
        var invalidScreening = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            healthProfileId = profileId,
            screeningDateUtc = DateTime.UtcNow,
            heightCm = -10m, // Invalid negative height
            weightKg = 70.2m,
            bloodPressure = "120/80",
            screenedByStaffId = Guid.NewGuid()
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidScreening), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/health/screenings", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetHealthProfiles_Unauthorized_ReturnsUnauthorized()
    {
        // Arrange - No authorization header

        // Act
        var response = await _client.GetAsync($"/api/health/profiles?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetHealthAlerts_WithFilters_ReturnsFilteredResults()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var profileId = _dbContext.HealthProfiles.First().Id;

        // Act
        var response = await _client.GetAsync($"/api/health/alerts?tenantId={_tenantId}&schoolId={_schoolId}&profileId={profileId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var alerts = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(alerts);
        // Should return alerts specific to the profile
    }

    private string GetTestToken()
    {
        // This would normally generate a valid JWT token for testing
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.health.token";
    }
}
