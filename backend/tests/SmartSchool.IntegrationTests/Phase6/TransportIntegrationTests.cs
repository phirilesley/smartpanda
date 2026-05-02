using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SmartSchool.API;
using SmartSchool.Domain.Modules.Transport;
using SmartSchool.Persistence.Data;
using System.Net.Http.Headers;

namespace SmartSchool.IntegrationTests.Phase6;

public class TransportIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly SmartSchoolDbContext _dbContext;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _schoolId = Guid.NewGuid();

    public TransportIntegrationTests(WebApplicationFactory<Program> factory)
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
                    options.UseInMemoryDatabase("SmartSchoolTransportTestDb");
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

        // Create test vehicle
        var testVehicle = new TransportVehicle
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            RegistrationNumber = "TEST-001",
            Make = "Toyota",
            Model = "Hiace",
            Year = 2023,
            Capacity = 25,
            Status = "Active"
        };

        // Create test route
        var testRoute = new TransportRoute
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Name = "Downtown Express",
            StartLocation = "Downtown Bus Station",
            EndLocation = "Smart School",
            Distance = 15.5m,
            EstimatedDuration = TimeSpan.FromMinutes(45),
            Status = "Active"
        };

        _dbContext.TransportVehicles.Add(testVehicle);
        _dbContext.TransportRoutes.Add(testRoute);
        await _dbContext.SaveChangesAsync();
    }

    [Fact]
    public async Task GetVehicles_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/transport/vehicles?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }

    [Fact]
    public async Task CreateVehicle_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newVehicle = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            registrationNumber = "TEST-002",
            make = "Honda",
            model = "CR-V",
            year = 2023,
            capacity = 30,
            status = "Active"
        };

        var content = new StringContent(JsonConvert.SerializeObject(newVehicle), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/transport/vehicles", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdVehicle = JsonConvert.DeserializeObject<TransportVehicle>(responseContent);
        
        Assert.NotNull(createdVehicle);
        Assert.Equal("TEST-002", createdVehicle.RegistrationNumber);
        Assert.Equal(_tenantId, createdVehicle.TenantId);
        Assert.Equal(_schoolId, createdVehicle.SchoolId);
    }

    [Fact]
    public async Task CreateRoute_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newRoute = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Suburban Route",
            startLocation = "Suburban Mall",
            endLocation = "Smart School",
            distance = 12.3m,
            estimatedDuration = "00:35:00",
            status = "Active"
        };

        var content = new StringContent(JsonConvert.SerializeObject(newRoute), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/transport/routes", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdRoute = JsonConvert.DeserializeObject<TransportRoute>(responseContent);
        
        Assert.NotNull(createdRoute);
        Assert.Equal("Suburban Route", createdRoute.Name);
        Assert.Equal(_tenantId, createdRoute.TenantId);
        Assert.Equal(_schoolId, createdRoute.SchoolId);
    }

    [Fact]
    public async Task CreateStudentAssignment_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var routeId = _dbContext.TransportRoutes.First().Id;
        
        var assignment = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(),
            transportRouteId = routeId,
            pickupStopId = (Guid?)null,
            dropoffStopId = (Guid?)null,
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var content = new StringContent(JsonConvert.SerializeObject(assignment), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/transport/assignments", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdAssignment = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(createdAssignment);
        Assert.Equal(routeId.ToString(), createdAssignment.transportRouteId.ToString());
    }

    [Fact]
    public async Task CreateTrip_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var vehicleId = _dbContext.TransportVehicles.First().Id;
        var routeId = _dbContext.TransportRoutes.First().Id;
        
        var trip = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            vehicleId = vehicleId,
            routeId = routeId,
            driverStaffId = Guid.NewGuid(),
            scheduledStartTimeUtc = DateTime.UtcNow.AddHours(1),
            scheduledEndTimeUtc = DateTime.UtcNow.AddHours(2),
            actualStartTimeUtc = (DateTime?)null,
            actualEndTimeUtc = (DateTime?)null,
            status = "Scheduled"
        };

        var content = new StringContent(JsonConvert.SerializeObject(trip), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/transport/trips", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdTrip = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(createdTrip);
        Assert.Equal(vehicleId.ToString(), createdTrip.vehicleId.ToString());
        Assert.Equal(routeId.ToString(), createdTrip.routeId.ToString());
    }

    [Fact]
    public async Task GetTransportAnalytics_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/transport/analytics?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var analytics = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(analytics);
        Assert.NotNull(analytics.totalVehicles);
        Assert.NotNull(analytics.activeVehicles);
        Assert.NotNull(analytics.totalRoutes);
        Assert.NotNull(analytics.totalAssignments);
    }

    [Fact]
    public async Task OptimizeRouteSequence_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var routeId = _dbContext.TransportRoutes.First().Id;
        
        var optimizeRequest = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            optimizeByTime = true
        };

        var content = new StringContent(JsonConvert.SerializeObject(optimizeRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/transport/routes/{routeId}/optimize", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.optimizedSequence);
    }

    [Fact]
    public async Task NotifyParentsOfScheduleChange_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        // First create a student assignment
        var assignment = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(),
            transportRouteId = _dbContext.TransportRoutes.First().Id,
            pickupStopId = (Guid?)null,
            dropoffStopId = (Guid?)null,
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var content = new StringContent(JsonConvert.SerializeObject(assignment), Encoding.UTF8, "application/json");
        var assignResponse = await _client.PostAsync("/api/transport/assignments", content);
        assignResponse.EnsureSuccessStatusCode();

        var assignResponseContent = await assignResponse.Content.ReadAsStringAsync();
        var createdAssignment = JsonConvert.DeserializeObject<dynamic>(assignResponseContent);
        var assignmentId = Guid.Parse(createdAssignment.id.ToString());

        // Act
        var response = await _client.PostAsync($"/api/transport/assignments/{assignmentId}/notify-schedule-change", null);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.notifiedGuardians);
        Assert.NotNull(result.message);
    }

    [Fact]
    public async Task CreateVehicle_InvalidCapacity_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var invalidVehicle = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            registrationNumber = "TEST-INVALID",
            make = "Toyota",
            model = "Hiace",
            year = 2023,
            capacity = -1, // Invalid negative capacity
            status = "Active"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidVehicle), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/transport/vehicles", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetVehicles_Unauthorized_ReturnsUnauthorized()
    {
        // Arrange - No authorization header

        // Act
        var response = await _client.GetAsync($"/api/transport/vehicles?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateTrip_PastScheduledTime_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var vehicleId = _dbContext.TransportVehicles.First().Id;
        var routeId = _dbContext.TransportRoutes.First().Id;
        
        var invalidTrip = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            vehicleId = vehicleId,
            routeId = routeId,
            driverStaffId = Guid.NewGuid(),
            scheduledStartTimeUtc = DateTime.UtcNow.AddHours(-2), // Past time
            scheduledEndTimeUtc = DateTime.UtcNow.AddHours(-1),
            status = "Scheduled"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidTrip), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/transport/trips", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    private string GetTestToken()
    {
        // This would normally generate a valid JWT token for testing
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.transport.token";
    }
}
