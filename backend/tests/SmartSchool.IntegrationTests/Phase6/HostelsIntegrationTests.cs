using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SmartSchool.API;
using SmartSchool.Domain.Modules.Hostels;
using SmartSchool.Persistence.Data;
using System.Net.Http.Headers;

namespace SmartSchool.IntegrationTests.Phase6;

public class HostelsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly SmartSchoolDbContext _dbContext;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _schoolId = Guid.NewGuid();

    public HostelsIntegrationTests(WebApplicationFactory<Program> factory)
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
                    options.UseInMemoryDatabase("SmartSchoolHostelTestDb");
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

        // Create test hostel
        var testHostel = new Hostel
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Name = "Main Hostel",
            GenderPolicy = "Male",
            Capacity = 100,
            IsActive = true
        };

        // Create test room
        var testRoom = new HostelRoom
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            HostelId = testHostel.Id,
            Name = "Room 101",
            Capacity = 4,
            FloorName = "Ground Floor"
        };

        // Create test bed
        var testBed = new HostelBed
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            HostelRoomId = testRoom.Id,
            BedCode = "A101",
            Status = "Available"
        };

        _dbContext.Hostels.Add(testHostel);
        _dbContext.HostelRooms.Add(testRoom);
        _dbContext.HostelBeds.Add(testBed);
        await _dbContext.SaveChangesAsync();
    }

    [Fact]
    public async Task GetHostels_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/hostels/hostels?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }

    [Fact]
    public async Task CreateHostel_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newHostel = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            name = "Girls Hostel",
            genderPolicy = "Female",
            capacity = 80,
            matronStaffId = Guid.NewGuid(),
            isActive = true
        };

        var content = new StringContent(JsonConvert.SerializeObject(newHostel), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/hostels/hostels", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdHostel = JsonConvert.DeserializeObject<Hostel>(responseContent);
        
        Assert.NotNull(createdHostel);
        Assert.Equal("Girls Hostel", createdHostel.Name);
        Assert.Equal(_tenantId, createdHostel.TenantId);
        Assert.Equal(_schoolId, createdHostel.SchoolId);
    }

    [Fact]
    public async Task CreateRoom_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var hostelId = _dbContext.Hostels.First().Id;
        
        var newRoom = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelId = hostelId,
            name = "Room 201",
            capacity = 6,
            floorName = "First Floor"
        };

        var content = new StringContent(JsonConvert.SerializeObject(newRoom), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/hostels/rooms", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdRoom = JsonConvert.DeserializeObject<HostelRoom>(responseContent);
        
        Assert.NotNull(createdRoom);
        Assert.Equal("Room 201", createdRoom.Name);
        Assert.Equal(hostelId, createdRoom.HostelId);
    }

    [Fact]
    public async Task CreateBed_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var roomId = _dbContext.HostelRooms.First().Id;
        
        var newBed = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelRoomId = roomId,
            bedCode = "B102",
            status = "Available"
        };

        var content = new StringContent(JsonConvert.SerializeObject(newBed), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/hostels/beds", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdBed = JsonConvert.DeserializeObject<HostelBed>(responseContent);
        
        Assert.NotNull(createdBed);
        Assert.Equal("B102", createdBed.BedCode);
        Assert.Equal(roomId, createdBed.HostelRoomId);
    }

    [Fact]
    public async Task CreateAllocation_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var bedId = _dbContext.HostelBeds.First().Id;
        
        var allocation = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(),
            hostelBedId = bedId,
            academicYearId = Guid.NewGuid(),
            termId = Guid.NewGuid(),
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var content = new StringContent(JsonConvert.SerializeObject(allocation), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/hostels/allocations", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdAllocation = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(createdAllocation);
        Assert.Equal(bedId.ToString(), createdAllocation.hostelBedId.ToString());
    }

    [Fact]
    public async Task TransferStudent_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        // First create an allocation
        var bedId = _dbContext.HostelBeds.First().Id;
        var allocation = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(),
            hostelBedId = bedId,
            academicYearId = Guid.NewGuid(),
            termId = Guid.NewGuid(),
            startDate = DateTime.UtcNow,
            endDate = (DateTime?)null
        };

        var content = new StringContent(JsonConvert.SerializeObject(allocation), Encoding.UTF8, "application/json");
        var allocResponse = await _client.PostAsync("/api/hostels/allocations", content);
        allocResponse.EnsureSuccessStatusCode();

        var allocResponseContent = await allocResponse.Content.ReadAsStringAsync();
        var createdAllocation = JsonConvert.DeserializeObject<dynamic>(allocResponseContent);
        var allocationId = Guid.Parse(createdAllocation.id.ToString());

        // Create a new bed for transfer
        var newBed = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelRoomId = _dbContext.HostelRooms.First().Id,
            bedCode = "C103",
            status = "Available"
        };

        var newBedContent = new StringContent(JsonConvert.SerializeObject(newBed), Encoding.UTF8, "application/json");
        var bedResponse = await _client.PostAsync("/api/hostels/beds", newBedContent);
        bedResponse.EnsureSuccessStatusCode();

        var bedResponseContent = await bedResponse.Content.ReadAsStringAsync();
        var createdBed = JsonConvert.DeserializeObject<dynamic>(bedResponseContent);
        var newBedId = Guid.Parse(createdBed.id.ToString());

        var transferRequest = new
        {
            newHostelBedId = newBedId,
            transferReason = "Room upgrade",
            effectiveDate = DateTime.UtcNow.AddDays(1)
        };

        var transferContent = new StringContent(JsonConvert.SerializeObject(transferRequest), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/hostels/allocations/{allocationId}/transfer", transferContent);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.NotNull(result.newAllocationId);
    }

    [Fact]
    public async Task CreateIncident_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var hostelId = _dbContext.Hostels.First().Id;
        
        var incident = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelId = hostelId,
            studentId = Guid.NewGuid(),
            reportedByStaffId = Guid.NewGuid(),
            occurredAtUtc = DateTime.UtcNow.AddHours(-1),
            category = "Disciplinary",
            notes = "Student was found violating hostel rules",
            status = "Open"
        };

        var content = new StringContent(JsonConvert.SerializeObject(incident), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/hostels/incidents", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdIncident = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(createdIncident);
        Assert.Equal("Disciplinary", createdIncident.category.ToString());
        Assert.Equal(hostelId.ToString(), createdIncident.hostelId.ToString());
    }

    [Fact]
    public async Task GetHostelAnalytics_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/hostels/analytics?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var analytics = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(analytics);
        Assert.NotNull(analytics.totalHostels);
        Assert.NotNull(analytics.totalRooms);
        Assert.NotNull(analytics.totalBeds);
        Assert.NotNull(analytics.occupiedBeds);
        Assert.NotNull(analytics.availableBeds);
    }

    [Fact]
    public async Task CreateAllocation_OverlappingDates_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var bedId = _dbContext.HostelBeds.First().Id;
        var studentId = Guid.NewGuid();
        
        // First allocation
        var allocation1 = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = studentId,
            hostelBedId = bedId,
            academicYearId = Guid.NewGuid(),
            termId = Guid.NewGuid(),
            startDate = DateTime.UtcNow,
            endDate = DateTime.UtcNow.AddDays(30)
        };

        var content1 = new StringContent(JsonConvert.SerializeObject(allocation1), Encoding.UTF8, "application/json");
        var response1 = await _client.PostAsync("/api/hostels/allocations", content1);
        response1.EnsureSuccessStatusCode();

        // Second overlapping allocation
        var allocation2 = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            studentId = Guid.NewGuid(), // Different student
            hostelBedId = bedId, // Same bed
            academicYearId = Guid.NewGuid(),
            termId = Guid.NewGuid(),
            startDate = DateTime.UtcNow.AddDays(15), // Overlapping date
            endDate = DateTime.UtcNow.AddDays(45)
        };

        var content2 = new StringContent(JsonConvert.SerializeObject(allocation2), Encoding.UTF8, "application/json");

        // Act
        var response2 = await _client.PostAsync("/api/hostels/allocations", content2);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response2.StatusCode);
    }

    [Fact]
    public async Task CreateBed_InvalidRoom_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var invalidBed = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            hostelRoomId = Guid.NewGuid(), // Non-existent room
            bedCode = "INVALID",
            status = "Available"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidBed), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/hostels/beds", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetHostels_Unauthorized_ReturnsUnauthorized()
    {
        // Arrange - No authorization header

        // Act
        var response = await _client.GetAsync($"/api/hostels/hostels?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private string GetTestToken()
    {
        // This would normally generate a valid JWT token for testing
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.hostel.token";
    }
}
