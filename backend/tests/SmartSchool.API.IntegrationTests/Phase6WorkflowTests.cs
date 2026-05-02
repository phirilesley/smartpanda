using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SmartSchool.API.IntegrationTests;

public class Phase6WorkflowTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase6WorkflowTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Hr_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var staffResponse = await client.PostAsJsonAsync("/api/hr/staff", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            employeeNumber = "EMP100",
            firstName = "Faith",
            lastName = "Maseko",
            departmentId = TestIds.Department1,
            hireDate = DateTime.UtcNow.Date
        });
        Assert.Equal(HttpStatusCode.OK, staffResponse.StatusCode);
        var staffId = await GetIdAsync(staffResponse);

        var contractResponse = await client.PostAsJsonAsync("/api/hr/contracts", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            staffId,
            contractType = "Permanent",
            startDate = DateTime.UtcNow.Date,
            endDate = DateTime.UtcNow.Date.AddYears(1),
            basicSalary = 750m
        });
        Assert.Equal(HttpStatusCode.OK, contractResponse.StatusCode);

        var leaveTypeResponse = await client.PostAsJsonAsync("/api/hr/leave-types", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Annual",
            annualDays = 30
        });
        Assert.Equal(HttpStatusCode.OK, leaveTypeResponse.StatusCode);
        var leaveTypeId = await GetIdAsync(leaveTypeResponse);

        var leaveResponse = await client.PostAsJsonAsync("/api/hr/leave-applications", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            staffId,
            leaveTypeId,
            startDate = DateTime.UtcNow.Date,
            endDate = DateTime.UtcNow.Date.AddDays(2),
            reason = "Medical"
        });
        Assert.Equal(HttpStatusCode.OK, leaveResponse.StatusCode);

        var periodResponse = await client.PostAsJsonAsync("/api/hr/payroll-periods", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "May 2026",
            startDate = new DateTime(2026, 5, 1),
            endDate = new DateTime(2026, 5, 31)
        });
        Assert.Equal(HttpStatusCode.OK, periodResponse.StatusCode);
        var payrollPeriodId = await GetIdAsync(periodResponse);

        var itemResponse = await client.PostAsJsonAsync("/api/hr/payroll-items", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            payrollPeriodId,
            staffId,
            itemType = "BasicSalary",
            amount = 750m
        });
        Assert.Equal(HttpStatusCode.OK, itemResponse.StatusCode);

        var summaryResponse = await client.GetAsync($"/api/hr/payroll-summary?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&payrollPeriodId={payrollPeriodId}");
        Assert.Equal(HttpStatusCode.OK, summaryResponse.StatusCode);
    }

    [Fact]
    public async Task Library_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var bookResponse = await client.PostAsJsonAsync("/api/library/books", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            bookCategoryId = TestIds.BookCategory1,
            title = "Math Grade 5",
            author = "Zim Author",
            isbn = "ISBN-001"
        });
        Assert.Equal(HttpStatusCode.OK, bookResponse.StatusCode);
        var bookId = await GetIdAsync(bookResponse);

        var copyResponse = await client.PostAsJsonAsync("/api/library/copies", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            bookId,
            copyNumber = "CPY-01"
        });
        Assert.Equal(HttpStatusCode.OK, copyResponse.StatusCode);
        var copyId = await GetIdAsync(copyResponse);

        var issueResponse = await client.PostAsJsonAsync("/api/library/issues", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            bookCopyId = copyId,
            borrowerStudentId = TestIds.Student1,
            issuedDate = DateTime.UtcNow.Date,
            dueDate = DateTime.UtcNow.Date.AddDays(1)
        });
        Assert.Equal(HttpStatusCode.OK, issueResponse.StatusCode);
        var issueId = await GetIdAsync(issueResponse);

        var returnResponse = await client.PostAsJsonAsync($"/api/library/issues/{issueId}/return", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            returnedDate = DateTime.UtcNow.Date.AddDays(2),
            dailyFineAmount = 2m
        });
        Assert.Equal(HttpStatusCode.OK, returnResponse.StatusCode);
    }

    [Fact]
    public async Task Assets_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var assetResponse = await client.PostAsJsonAsync("/api/assets", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            assetCategoryId = TestIds.AssetCategory1,
            assetTag = "ASSET-001",
            name = "Lenovo Laptop",
            purchaseDate = DateTime.UtcNow.Date,
            cost = 900m
        });
        Assert.Equal(HttpStatusCode.OK, assetResponse.StatusCode);
        var assetId = await GetIdAsync(assetResponse);

        var assignResponse = await client.PostAsJsonAsync("/api/assets/assignments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            assetItemId = assetId,
            assignedToStaffId = TestIds.Staff1,
            assignedDate = DateTime.UtcNow.Date
        });
        Assert.Equal(HttpStatusCode.OK, assignResponse.StatusCode);

        var maintenanceResponse = await client.PostAsJsonAsync("/api/assets/maintenance", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            assetItemId = assetId,
            maintenanceDate = DateTime.UtcNow.Date,
            description = "Battery check",
            cost = 20m
        });
        Assert.Equal(HttpStatusCode.OK, maintenanceResponse.StatusCode);
    }

    [Fact]
    public async Task Visitors_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var visitorResponse = await client.PostAsJsonAsync("/api/visitors", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            fullName = "John Dube",
            phoneNumber = "0771234567",
            idNumber = "63-123456-A-12"
        });
        Assert.Equal(HttpStatusCode.OK, visitorResponse.StatusCode);
        var visitorId = await GetIdAsync(visitorResponse);

        var checkInResponse = await client.PostAsJsonAsync("/api/visitors/check-ins", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            visitorId,
            hostStaffId = TestIds.Staff1,
            checkInAtUtc = DateTime.UtcNow,
            purpose = "Meeting",
            badgeNumber = "B-01"
        });
        Assert.Equal(HttpStatusCode.OK, checkInResponse.StatusCode);
        var logId = await GetIdAsync(checkInResponse);

        var checkOutResponse = await client.PostAsJsonAsync($"/api/visitors/check-outs/{logId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            checkOutAtUtc = DateTime.UtcNow.AddHours(1)
        });
        Assert.Equal(HttpStatusCode.OK, checkOutResponse.StatusCode);
    }

    [Fact]
    public async Task Labs_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var labResponse = await client.PostAsJsonAsync("/api/labs", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Lab A",
            capacity = 30
        });
        Assert.Equal(HttpStatusCode.OK, labResponse.StatusCode);
        var labId = await GetIdAsync(labResponse);

        var computerResponse = await client.PostAsJsonAsync("/api/labs/computers", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            computerLabId = labId,
            assetTag = "LABPC-1",
            name = "Lab PC 1"
        });
        Assert.Equal(HttpStatusCode.OK, computerResponse.StatusCode);
        var computerId = await GetIdAsync(computerResponse);

        var bookingResponse = await client.PostAsJsonAsync("/api/labs/bookings", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            computerLabId = labId,
            teacherStaffId = TestIds.Staff1,
            startTimeUtc = DateTime.UtcNow.AddHours(2),
            endTimeUtc = DateTime.UtcNow.AddHours(3),
            gradeId = TestIds.Grade1,
            streamId = TestIds.Stream1
        });
        Assert.Equal(HttpStatusCode.OK, bookingResponse.StatusCode);

        var faultResponse = await client.PostAsJsonAsync("/api/labs/faults", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            labComputerId = computerId,
            reportedAtUtc = DateTime.UtcNow,
            description = "Keyboard not working"
        });
        Assert.Equal(HttpStatusCode.OK, faultResponse.StatusCode);
        var faultId = await GetIdAsync(faultResponse);

        var resolveResponse = await client.PostAsJsonAsync($"/api/labs/faults/{faultId}/resolve", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            status = "Resolved"
        });
        Assert.Equal(HttpStatusCode.OK, resolveResponse.StatusCode);
    }

    [Fact]
    public async Task QuestionBank_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var categoryResponse = await client.PostAsJsonAsync("/api/question-bank/categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "End of Term",
            subjectId = TestIds.Subject1,
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, categoryResponse.StatusCode);
        var categoryId = await GetIdAsync(categoryResponse);

        var paperResponse = await client.PostAsJsonAsync("/api/question-bank/papers", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            questionPaperCategoryId = categoryId,
            uploadedFileId = TestIds.UploadedFile1,
            examYear = 2026,
            examType = "MidTerm"
        });
        Assert.Equal(HttpStatusCode.OK, paperResponse.StatusCode);
        var paperId = await GetIdAsync(paperResponse);

        var downloadResponse = await client.PostAsJsonAsync($"/api/question-bank/papers/{paperId}/downloads", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            downloadedByUserId = TestIds.User1
        });
        Assert.Equal(HttpStatusCode.OK, downloadResponse.StatusCode);
    }

    [Fact]
    public async Task Memos_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var memoResponse = await client.PostAsJsonAsync("/api/memos/requests", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            title = "Purchase request",
            content = "Need lab cables",
            requestedByUserId = TestIds.User1
        });
        Assert.Equal(HttpStatusCode.OK, memoResponse.StatusCode);
        var memoId = await GetIdAsync(memoResponse);

        var approverResponse = await client.PostAsJsonAsync($"/api/memos/requests/{memoId}/approvers", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            approverUserId = TestIds.User2,
            approvalOrder = 1
        });
        Assert.Equal(HttpStatusCode.OK, approverResponse.StatusCode);

        var actionResponse = await client.PostAsJsonAsync($"/api/memos/requests/{memoId}/actions", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            approverUserId = TestIds.User2,
            action = "Approve",
            comment = "Approved"
        });
        Assert.Equal(HttpStatusCode.OK, actionResponse.StatusCode);

        var attachmentResponse = await client.PostAsJsonAsync($"/api/memos/requests/{memoId}/attachments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            uploadedFileId = TestIds.UploadedFile1
        });
        Assert.Equal(HttpStatusCode.OK, attachmentResponse.StatusCode);
    }

    [Fact]
    public async Task Pos_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var categoryResponse = await client.PostAsJsonAsync("/api/pos/categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Snacks"
        });
        Assert.Equal(HttpStatusCode.OK, categoryResponse.StatusCode);
        var categoryId = await GetIdAsync(categoryResponse);

        var productResponse = await client.PostAsJsonAsync("/api/pos/products", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            posCategoryId = categoryId,
            name = "Bun",
            sku = "BUN-1",
            unitPrice = 1.5m,
            openingQuantity = 20m
        });
        Assert.Equal(HttpStatusCode.OK, productResponse.StatusCode);
        var productId = await GetIdAsync(productResponse);

        var sessionResponse = await client.PostAsJsonAsync("/api/pos/sessions/open", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            cashierUserId = TestIds.User1,
            openingFloat = 10m
        });
        Assert.Equal(HttpStatusCode.OK, sessionResponse.StatusCode);
        var sessionId = await GetIdAsync(sessionResponse);

        var saleResponse = await client.PostAsJsonAsync("/api/pos/sales", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            posCashierSessionId = sessionId,
            receiptNumber = "RCPT-1",
            lines = new[] { new { posProductId = productId, quantity = 2m } },
            payments = new[] { new { method = "Cash", amount = 3m, reference = "cash" } }
        });
        Assert.Equal(HttpStatusCode.OK, saleResponse.StatusCode);

        var closeResponse = await client.PostAsJsonAsync($"/api/pos/sessions/{sessionId}/close", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            closedAtUtc = DateTime.UtcNow,
            closingAmount = 13m
        });
        Assert.Equal(HttpStatusCode.OK, closeResponse.StatusCode);
    }

    [Fact]
    public async Task Sports_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var sportResponse = await client.PostAsJsonAsync("/api/sports", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Football"
        });
        Assert.Equal(HttpStatusCode.OK, sportResponse.StatusCode);
        var sportId = await GetIdAsync(sportResponse);

        var houseResponse = await client.PostAsJsonAsync("/api/sports/houses", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Mhofu",
            colorCode = "#00AA00"
        });
        Assert.Equal(HttpStatusCode.OK, houseResponse.StatusCode);
        var houseId = await GetIdAsync(houseResponse);

        var teamResponse = await client.PostAsJsonAsync("/api/sports/teams", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            sportId,
            name = "U14 A",
            houseId
        });
        Assert.Equal(HttpStatusCode.OK, teamResponse.StatusCode);
        var teamId = await GetIdAsync(teamResponse);

        var playerResponse = await client.PostAsJsonAsync("/api/sports/players", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            sportTeamId = teamId,
            studentId = TestIds.Student1,
            position = "Forward"
        });
        Assert.Equal(HttpStatusCode.OK, playerResponse.StatusCode);

        var fixtureResponse = await client.PostAsJsonAsync("/api/sports/fixtures", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            sportTeamId = teamId,
            fixtureDateUtc = DateTime.UtcNow.AddDays(3),
            opponent = "Rival School",
            venue = "Main Field"
        });
        Assert.Equal(HttpStatusCode.OK, fixtureResponse.StatusCode);
        var fixtureId = await GetIdAsync(fixtureResponse);

        var resultResponse = await client.PostAsJsonAsync("/api/sports/results", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            fixtureId,
            teamScore = 2,
            opponentScore = 1,
            notes = "Good match"
        });
        Assert.Equal(HttpStatusCode.OK, resultResponse.StatusCode);
    }

    [Fact]
    public async Task Timetable_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var roomResponse = await client.PostAsJsonAsync("/api/timetable/rooms", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Room 1",
            capacity = 40
        });
        Assert.Equal(HttpStatusCode.OK, roomResponse.StatusCode);
        var roomId = await GetIdAsync(roomResponse);

        var periodResponse = await client.PostAsJsonAsync("/api/timetable/periods", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "P1",
            startTime = new TimeOnly(8, 0),
            endTime = new TimeOnly(8, 40),
            dayOfWeek = 1
        });
        Assert.Equal(HttpStatusCode.OK, periodResponse.StatusCode);
        var periodId = await GetIdAsync(periodResponse);

        var entryResponse = await client.PostAsJsonAsync("/api/timetable/entries", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            streamId = TestIds.Stream1,
            subjectId = TestIds.Subject1,
            staffId = TestIds.Staff1,
            roomId,
            timetablePeriodId = periodId
        });
        Assert.Equal(HttpStatusCode.OK, entryResponse.StatusCode);
    }

    [Fact]
    public async Task Integrations_Workflow_EncryptsAndRotates()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var upsertResponse = await client.PostAsJsonAsync("/api/integrations/settings", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            integrationType = "Payments",
            providerName = "Paynow",
            plainSettingsJson = "{\"apiKey\":\"secret\"}",
            isEnabled = true
        });
        Assert.Equal(HttpStatusCode.OK, upsertResponse.StatusCode);

        var getResponse = await client.GetAsync($"/api/integrations/settings?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var payload = await getResponse.Content.ReadAsStringAsync();
        Assert.DoesNotContain("\"apiKey\":\"secret\"", payload, StringComparison.OrdinalIgnoreCase);

        var rotateResponse = await client.PostAsJsonAsync("/api/integrations/settings/rotate-secrets", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            providerName = "Paynow"
        });
        Assert.Equal(HttpStatusCode.OK, rotateResponse.StatusCode);
    }

    [Fact]
    public async Task FeatureFlags_And_Portals_Workflow_Succeeds()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var flagUpsertResponse = await client.PostAsJsonAsync("/api/feature-flags", new
        {
            tenantId = TestIds.Tenant1,
            featureCode = "portal.parent",
            isEnabled = true,
            description = "Parent portal access"
        });
        Assert.Equal(HttpStatusCode.OK, flagUpsertResponse.StatusCode);

        var flagGetResponse = await client.GetAsync($"/api/feature-flags?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.OK, flagGetResponse.StatusCode);

        var parentDashboard = await client.GetAsync($"/api/portal/parent/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&studentId={TestIds.Student1}");
        Assert.Equal(HttpStatusCode.OK, parentDashboard.StatusCode);

        var studentDashboard = await client.GetAsync($"/api/portal/student/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&studentId={TestIds.Student1}");
        Assert.Equal(HttpStatusCode.OK, studentDashboard.StatusCode);

        var staffDashboard = await client.GetAsync($"/api/portal/staff/dashboard?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&staffId={TestIds.Staff1}");
        Assert.Equal(HttpStatusCode.OK, staffDashboard.StatusCode);
    }

    [Fact]
    public async Task Events_Workflow_Succeeds_WithConflictDetection()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var createResponse = await client.PostAsJsonAsync("/api/events", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            title = "Term 1 Parents Day",
            description = "Parent engagement day",
            startAtUtc = new DateTime(2026, 5, 10, 8, 0, 0, DateTimeKind.Utc),
            endAtUtc = new DateTime(2026, 5, 10, 12, 0, 0, DateTimeKind.Utc),
            venue = "Main Hall",
            maxParticipants = 100,
            organizerStaffId = TestIds.Staff1,
            status = "Scheduled"
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var eventId = await GetIdAsync(createResponse);

        var participantResponse = await client.PostAsJsonAsync($"/api/events/{eventId}/participants", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId = TestIds.Student1,
            guardianId = (Guid?)null,
            staffId = (Guid?)null,
            participantType = "Student",
            attendanceStatus = "Registered"
        });
        Assert.Equal(HttpStatusCode.OK, participantResponse.StatusCode);
        var participantId = await GetIdAsync(participantResponse);

        var attendanceResponse = await client.PutAsJsonAsync($"/api/events/participants/{participantId}/attendance", new
        {
            tenantId = TestIds.Tenant1,
            attendanceStatus = "Attended"
        });
        Assert.Equal(HttpStatusCode.OK, attendanceResponse.StatusCode);

        var conflictResponse = await client.PostAsJsonAsync("/api/events", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            title = "Another Event",
            description = "Overlap",
            startAtUtc = new DateTime(2026, 5, 10, 10, 0, 0, DateTimeKind.Utc),
            endAtUtc = new DateTime(2026, 5, 10, 11, 0, 0, DateTimeKind.Utc),
            venue = "Main Hall",
            maxParticipants = 50,
            organizerStaffId = TestIds.Staff1,
            status = "Scheduled"
        });
        Assert.Equal(HttpStatusCode.Conflict, conflictResponse.StatusCode);
    }

    [Fact]
    public async Task Transport_Workflow_Succeeds_WithAssignmentLifecycle()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var vehicleResponse = await client.PostAsJsonAsync("/api/transport/vehicles", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            registrationNumber = "ACX001",
            name = "Blue Bus",
            capacity = 40,
            driverStaffId = TestIds.Staff1,
            isActive = true
        });
        Assert.Equal(HttpStatusCode.OK, vehicleResponse.StatusCode);
        var vehicleId = await GetIdAsync(vehicleResponse);

        var routeResponse = await client.PostAsJsonAsync("/api/transport/routes", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            routeCode = "R-1",
            name = "Norton Route",
            startLocation = "Norton",
            endLocation = "School",
            isActive = true
        });
        Assert.Equal(HttpStatusCode.OK, routeResponse.StatusCode);
        var routeId = await GetIdAsync(routeResponse);

        var stopResponse = await client.PostAsJsonAsync($"/api/transport/routes/{routeId}/stops", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            stopName = "Whitehouse",
            stopOrder = 1,
            plannedTime = new TimeOnly(6, 30)
        });
        Assert.Equal(HttpStatusCode.OK, stopResponse.StatusCode);
        var stopId = await GetIdAsync(stopResponse);

        var assignmentResponse = await client.PostAsJsonAsync("/api/transport/assignments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId = TestIds.Student1,
            transportRouteId = routeId,
            pickupStopId = stopId,
            dropoffStopId = stopId,
            effectiveFrom = DateTime.UtcNow.Date,
            effectiveTo = (DateTime?)null,
            status = "Active"
        });
        Assert.Equal(HttpStatusCode.OK, assignmentResponse.StatusCode);
        var assignmentId = await GetIdAsync(assignmentResponse);

        var statusResponse = await client.PutAsJsonAsync($"/api/transport/assignments/{assignmentId}/status", new
        {
            tenantId = TestIds.Tenant1,
            status = "Suspended",
            effectiveTo = DateTime.UtcNow.Date.AddDays(30)
        });
        Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);

        var tripResponse = await client.PostAsJsonAsync("/api/transport/trips", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            transportVehicleId = vehicleId,
            transportRouteId = routeId,
            driverStaffId = TestIds.Staff1,
            tripDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
            direction = "Pickup",
            departureAtUtc = (DateTime?)null,
            arrivalAtUtc = (DateTime?)null,
            status = "Planned"
        });
        Assert.Equal(HttpStatusCode.OK, tripResponse.StatusCode);
        var tripId = await GetIdAsync(tripResponse);

        var logResponse = await client.PutAsJsonAsync($"/api/transport/trips/{tripId}/log", new
        {
            tenantId = TestIds.Tenant1,
            departureAtUtc = DateTime.UtcNow.AddMinutes(-40),
            arrivalAtUtc = DateTime.UtcNow,
            status = "Completed"
        });
        Assert.Equal(HttpStatusCode.OK, logResponse.StatusCode);
    }

    [Fact]
    public async Task Hostel_Workflow_Succeeds_WithTransferAndCheckout()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var hostelResponse = await client.PostAsJsonAsync("/api/hostels", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Boys East",
            genderPolicy = "Male",
            capacity = 200,
            matronStaffId = TestIds.Staff1,
            isActive = true
        });
        Assert.Equal(HttpStatusCode.OK, hostelResponse.StatusCode);
        var hostelId = await GetIdAsync(hostelResponse);

        var roomResponse = await client.PostAsJsonAsync($"/api/hostels/{hostelId}/rooms", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "A1",
            capacity = 20,
            floorName = "Ground"
        });
        Assert.Equal(HttpStatusCode.OK, roomResponse.StatusCode);
        var roomId = await GetIdAsync(roomResponse);

        var bed1Response = await client.PostAsJsonAsync($"/api/hostels/rooms/{roomId}/beds", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            bedCode = "A1-01",
            status = "Available"
        });
        Assert.Equal(HttpStatusCode.OK, bed1Response.StatusCode);
        var bed1Id = await GetIdAsync(bed1Response);

        var bed2Response = await client.PostAsJsonAsync($"/api/hostels/rooms/{roomId}/beds", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            bedCode = "A1-02",
            status = "Available"
        });
        Assert.Equal(HttpStatusCode.OK, bed2Response.StatusCode);
        var bed2Id = await GetIdAsync(bed2Response);

        var allocationResponse = await client.PostAsJsonAsync("/api/hostels/allocations", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId = TestIds.Student1,
            hostelBedId = bed1Id,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            startDate = DateTime.UtcNow.Date,
            endDate = (DateTime?)null,
            isCurrent = true,
            status = "Active"
        });
        Assert.Equal(HttpStatusCode.OK, allocationResponse.StatusCode);
        var allocationId = await GetIdAsync(allocationResponse);

        var transferResponse = await client.PostAsJsonAsync($"/api/hostels/allocations/{allocationId}/transfer", new
        {
            tenantId = TestIds.Tenant1,
            newHostelBedId = bed2Id,
            transferDate = DateTime.UtcNow.Date.AddDays(1)
        });
        Assert.Equal(HttpStatusCode.OK, transferResponse.StatusCode);
        var transferredAllocationId = await GetIdAsync(transferResponse);

        var checkoutResponse = await client.PostAsJsonAsync($"/api/hostels/allocations/{transferredAllocationId}/checkout", new
        {
            tenantId = TestIds.Tenant1,
            checkoutDate = DateTime.UtcNow.Date.AddDays(2)
        });
        Assert.Equal(HttpStatusCode.OK, checkoutResponse.StatusCode);
    }

    [Fact]
    public async Task Health_Workflow_Succeeds_WithDueImmunizationQuery()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var profileResponse = await client.PostAsJsonAsync("/api/health/profiles", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId = TestIds.Student1,
            staffId = (Guid?)null,
            bloodGroup = "O+",
            allergies = "None",
            chronicConditions = "None",
            emergencyContactName = "Parent One",
            emergencyContactPhone = "0771111111"
        });
        Assert.Equal(HttpStatusCode.OK, profileResponse.StatusCode);
        var profileId = await GetIdAsync(profileResponse);

        var screeningResponse = await client.PostAsJsonAsync("/api/health/screenings", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            healthProfileId = profileId,
            screeningDateUtc = DateTime.UtcNow,
            heightCm = 150m,
            weightKg = 45m,
            bloodPressure = "110/70",
            notes = "Routine",
            screenedByStaffId = TestIds.Staff1
        });
        Assert.Equal(HttpStatusCode.OK, screeningResponse.StatusCode);

        var immunizationResponse = await client.PostAsJsonAsync("/api/health/immunizations", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            healthProfileId = profileId,
            vaccineName = "Tetanus",
            doseNumber = 1,
            dateGivenUtc = DateTime.UtcNow.AddMonths(-11),
            nextDueDateUtc = DateTime.UtcNow.AddDays(10),
            notes = "Due soon"
        });
        Assert.Equal(HttpStatusCode.OK, immunizationResponse.StatusCode);

        var dueResponse = await client.GetAsync($"/api/health/immunizations/due?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&withinDays=30");
        Assert.Equal(HttpStatusCode.OK, dueResponse.StatusCode);
    }

    [Fact]
    public async Task Clinic_Workflow_Succeeds_WithDispenseReferralAndStockControls()
    {
        await _factory.ResetAsync();
        var client = CreateAuthClient();

        var visitResponse = await client.PostAsJsonAsync("/api/clinic/visits", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            patientType = "Student",
            studentId = TestIds.Student1,
            staffId = (Guid?)null,
            visitDateUtc = DateTime.UtcNow,
            complaint = "Headache",
            diagnosis = "Mild fever",
            treatment = "Rest and fluids",
            attendedByStaffId = TestIds.Staff1,
            followUpDateUtc = DateTime.UtcNow.AddDays(2),
            status = "Open"
        });
        Assert.Equal(HttpStatusCode.OK, visitResponse.StatusCode);
        var visitId = await GetIdAsync(visitResponse);

        var medicationResponse = await client.PostAsJsonAsync("/api/clinic/medications", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Paracetamol",
            unit = "tablet",
            quantityInStock = 50m,
            reorderLevel = 10m,
            isActive = true
        });
        Assert.Equal(HttpStatusCode.OK, medicationResponse.StatusCode);
        var medicationId = await GetIdAsync(medicationResponse);

        var dispenseResponse = await client.PostAsJsonAsync("/api/clinic/dispense", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            clinicVisitId = visitId,
            clinicMedicationId = medicationId,
            quantity = 2m,
            instructions = "Take twice daily",
            dispensedByStaffId = TestIds.Staff1
        });
        Assert.Equal(HttpStatusCode.OK, dispenseResponse.StatusCode);

        var referResponse = await client.PostAsJsonAsync($"/api/clinic/visits/{visitId}/refer", new
        {
            tenantId = TestIds.Tenant1,
            referralFacility = "Parirenyatwa Hospital",
            referralReason = "Further assessment",
            referredAtUtc = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, referResponse.StatusCode);

        var followUpResponse = await client.PostAsJsonAsync($"/api/clinic/visits/{visitId}/follow-up", new
        {
            tenantId = TestIds.Tenant1,
            followUpDateUtc = DateTime.UtcNow.AddDays(5),
            status = "FollowUpScheduled"
        });
        Assert.Equal(HttpStatusCode.OK, followUpResponse.StatusCode);

        var stockResponse = await client.PostAsJsonAsync($"/api/clinic/medications/{medicationId}/stock-adjustment", new
        {
            tenantId = TestIds.Tenant1,
            quantityDelta = -5m
        });
        Assert.Equal(HttpStatusCode.OK, stockResponse.StatusCode);
    }

    private HttpClient CreateAuthClient()
    {
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);
        return client;
    }

    private static async Task<Guid> GetIdAsync(HttpResponseMessage response)
    {
        var text = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(text);
        return doc.RootElement.GetProperty("id").GetGuid();
    }
}
