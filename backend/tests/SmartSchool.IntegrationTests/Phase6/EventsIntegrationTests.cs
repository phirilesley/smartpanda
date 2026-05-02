using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SmartSchool.API;
using SmartSchool.Domain.Modules.Events;
using SmartSchool.Persistence.Data;
using System.Net.Http.Headers;

namespace SmartSchool.IntegrationTests.Phase6;

public class EventsIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly SmartSchoolDbContext _dbContext;
    private readonly Guid _tenantId = Guid.NewGuid();
    private readonly Guid _schoolId = Guid.NewGuid();

    public EventsIntegrationTests(WebApplicationFactory<Program> factory)
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
                    options.UseInMemoryDatabase("SmartSchoolTestDb");
                });
            });
        });

        _client = _factory.CreateClient();
        var scope = _factory.Services.CreateScope();
        _dbContext = scope.ServiceProvider.GetRequiredService<SmartSchoolDbContext>();
        
        // Setup test data
        SetupTestData().GetAwaiter().GetResult();
    }

    private async Task SetupTestData()
    {
        // Clean database
        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        // Create test event
        var testEvent = new SchoolEvent
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Title = "Annual Science Fair",
            Description = "Science exhibition for students",
            StartAtUtc = DateTime.UtcNow.AddDays(7),
            EndAtUtc = DateTime.UtcNow.AddDays(7).AddHours(4),
            Venue = "School Auditorium",
            MaxParticipants = 100,
            Status = "Scheduled"
        };

        _dbContext.SchoolEvents.Add(testEvent);
        await _dbContext.SaveChangesAsync();
    }

    [Fact]
    public async Task GetEvents_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());

        // Act
        var response = await _client.GetAsync($"/api/events/events?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }

    [Fact]
    public async Task CreateEvent_ValidInput_ReturnsCreatedResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var newEvent = new
        {
            tenantId = _tenantId,
            schoolId = _schoolId,
            academicYearId = Guid.NewGuid(),
            termId = Guid.NewGuid(),
            title = "Sports Day",
            description = "Annual sports competition",
            startAtUtc = DateTime.UtcNow.AddDays(14),
            endAtUtc = DateTime.UtcNow.AddDays(14).AddHours(6),
            venue = "School Ground",
            maxParticipants = 200,
            organizerStaffId = Guid.NewGuid()
        };

        var content = new StringContent(JsonConvert.SerializeObject(newEvent), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/events/events", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var createdEvent = JsonConvert.DeserializeObject<SchoolEvent>(responseContent);
        
        Assert.NotNull(createdEvent);
        Assert.Equal("Sports Day", createdEvent.Title);
        Assert.Equal(_tenantId, createdEvent.TenantId);
        Assert.Equal(_schoolId, createdEvent.SchoolId);
    }

    [Fact]
    public async Task RegisterParticipants_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var eventId = _dbContext.SchoolEvents.First().Id;
        var participants = new
        {
            participants = new[]
            {
                new { studentId = Guid.NewGuid() },
                new { studentId = Guid.NewGuid() }
            }
        };

        var content = new StringContent(JsonConvert.SerializeObject(participants), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/events/events/{eventId}/participants", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(result);
        Assert.True(result.registeredCount > 0);
    }

    [Fact]
    public async Task GetEventAnalytics_ReturnsCorrectData()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var eventId = _dbContext.SchoolEvents.First().Id;

        // Act
        var response = await _client.GetAsync($"/api/events/events/{eventId}/analytics?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var analytics = JsonConvert.DeserializeObject<dynamic>(responseContent);
        
        Assert.NotNull(analytics);
        Assert.NotNull(analytics.totalEvents);
        Assert.NotNull(analytics.upcomingEvents);
        Assert.NotNull(analytics.totalParticipants);
    }

    [Fact]
    public async Task UpdateEvent_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        var eventId = _dbContext.SchoolEvents.First().Id;
        
        var updateData = new
        {
            title = "Updated Science Fair",
            description = "Updated science exhibition",
            startAtUtc = DateTime.UtcNow.AddDays(8),
            endAtUtc = DateTime.UtcNow.AddDays(8).AddHours(5),
            venue = "Updated Auditorium"
        };

        var content = new StringContent(JsonConvert.SerializeObject(updateData), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync($"/api/events/events/{eventId}", content);

        // Assert
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var updatedEvent = JsonConvert.DeserializeObject<SchoolEvent>(responseContent);
        
        Assert.NotNull(updatedEvent);
        Assert.Equal("Updated Science Fair", updatedEvent.Title);
        Assert.Equal("Updated Auditorium", updatedEvent.Venue);
    }

    [Fact]
    public async Task DeleteEvent_ValidInput_ReturnsSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        // Create a test event to delete
        var testEvent = new SchoolEvent
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Title = "Event to Delete",
            Description = "Test event for deletion",
            StartAtUtc = DateTime.UtcNow.AddDays(30),
            EndAtUtc = DateTime.UtcNow.AddDays(30).AddHours(2),
            Venue = "Test Venue",
            Status = "Scheduled"
        };

        _dbContext.SchoolEvents.Add(testEvent);
        await _dbContext.SaveChangesAsync();

        // Act
        var response = await _client.DeleteAsync($"/api/events/events/{testEvent.Id}?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        response.EnsureSuccessStatusCode();
        
        // Verify event is marked as deleted
        var deletedEvent = await _dbContext.SchoolEvents.FindAsync(testEvent.Id);
        Assert.True(deletedEvent.IsDeleted);
    }

    [Fact]
    public async Task RegisterParticipants_ExceedsCapacity_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        // Create event with limited capacity
        var limitedEvent = new SchoolEvent
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantId,
            SchoolId = _schoolId,
            Title = "Limited Capacity Event",
            Description = "Event with limited capacity",
            StartAtUtc = DateTime.UtcNow.AddDays(7),
            EndAtUtc = DateTime.UtcNow.AddDays(7).AddHours(2),
            Venue = "Small Room",
            MaxParticipants = 2,
            Status = "Scheduled"
        };

        _dbContext.SchoolEvents.Add(limitedEvent);
        await _dbContext.SaveChangesAsync();

        var participants = new
        {
            participants = new[]
            {
                new { studentId = Guid.NewGuid() },
                new { studentId = Guid.NewGuid() },
                new { studentId = Guid.NewGuid() }, // This exceeds capacity
                new { studentId = Guid.NewGuid() }
            }
        };

        var content = new StringContent(JsonConvert.SerializeObject(participants), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync($"/api/events/events/{limitedEvent.Id}/participants", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains("capacity", responseContent.ToLower());
    }

    [Fact]
    public async Task GetEvents_Unauthorized_ReturnsUnauthorized()
    {
        // Arrange - No authorization header

        // Act
        var response = await _client.GetAsync($"/api/events/events?tenantId={_tenantId}&schoolId={_schoolId}");

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateEvent_InvalidInput_ReturnsBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GetTestToken());
        
        var invalidEvent = new
        {
            tenantId = Guid.Empty, // Invalid tenant ID
            schoolId = Guid.Empty,  // Invalid school ID
            title = "",             // Empty title
            description = "Test event with invalid data"
        };

        var content = new StringContent(JsonConvert.SerializeObject(invalidEvent), Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/events/events", content);

        // Assert
        Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
    }

    private string GetTestToken()
    {
        // This would normally generate a valid JWT token for testing
        // For simplicity, returning a mock token
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token";
    }
}
