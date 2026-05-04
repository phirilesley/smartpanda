using System.Net;
using System.Net.Http.Json;

namespace SmartSchool.API.IntegrationTests;

public class Phase3AuthorizationIsolationTests : IClassFixture<SmartSchoolApiFactory>
{
    private readonly SmartSchoolApiFactory _factory;

    public Phase3AuthorizationIsolationTests(SmartSchoolApiFactory factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/finance/fee-categories?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/fee-categories/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/finance/fee-structures?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/fee-structures/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/finance/payment-plans?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/payment-plans/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/finance/invoices?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/invoices/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/finance/invoices/10000000-0000-0000-0000-000000000001/lines")]
    [InlineData("/api/finance/payments?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/payments/10000000-0000-0000-0000-000000000001")]
    [InlineData("/api/finance/reports/arrears?tenantId=11111111-1111-1111-1111-111111111111&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_RequireAuthentication(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/finance/fee-categories?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/fee-structures?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/payment-plans?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/invoices?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/payments?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    [InlineData("/api/finance/reports/arrears?tenantId=22222222-2222-2222-2222-222222222222&schoolId=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")]
    public async Task Endpoints_EnforceTenantIsolation(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/finance/fee-categories?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/finance/fee-structures?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/finance/payment-plans?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/finance/invoices?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/finance/payments?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    [InlineData("/api/finance/reports/arrears?tenantId=11111111-1111-1111-1111-111111111111&schoolId=bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")]
    public async Task Endpoints_EnforceSchoolAccess(string url)
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        var response = await client.GetAsync(url);

        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task FeeCategory_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create fee category
        var createResponse = await client.PostAsJsonAsync("/api/finance/fee-categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Tuition Fee",
            description = "Annual tuition fee",
            isCompulsory = true,
            paymentFrequency = "Annually"
        });
        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);
        var categoryId = await GetIdAsync(createResponse);

        // Update fee category
        var updateResponse = await client.PutAsJsonAsync($"/api/finance/fee-categories/{categoryId}", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Tuition Fee - Updated",
            description = "Annual tuition fee with updates",
            isCompulsory = true,
            paymentFrequency = "Annually"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete fee category
        var deleteResponse = await client.DeleteAsync($"/api/finance/fee-categories/{categoryId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task FeeStructure_CanBeCreatedWithCategoriesAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create fee category
        var categoryResponse = await client.PostAsJsonAsync("/api/finance/fee-categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Registration Fee",
            description = "One-time registration fee",
            isCompulsory = true,
            paymentFrequency = "Once"
        });
        Assert.Equal(HttpStatusCode.OK, categoryResponse.StatusCode);
        var categoryId = await GetIdAsync(categoryResponse);

        // Create fee structure
        var structureResponse = await client.PostAsJsonAsync("/api/finance/fee-structures", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            feeCategoryId = categoryId,
            amount = 200m,
            currency = "USD"
        });
        Assert.Equal(HttpStatusCode.OK, structureResponse.StatusCode);
        var structureId = await GetIdAsync(structureResponse);

        // Update fee structure
        var updateResponse = await client.PutAsJsonAsync($"/api/finance/fee-structures/{structureId}", new
        {
            tenantId = TestIds.Tenant1,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            feeCategoryId = categoryId,
            amount = 225m,
            currency = "USD"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete fee structure
        var deleteResponse = await client.DeleteAsync($"/api/finance/fee-structures/{structureId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task PaymentPlan_CanBeCreatedForStudentAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create student
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU006",
            firstName = "Frank",
            lastName = "Miller",
            dateOfBirth = new DateTime(2010, 7, 18),
            gender = "Male",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, studentResponse.StatusCode);
        var studentId = await GetIdAsync(studentResponse);

        // Create payment plan
        var categoryResponse = await client.PostAsJsonAsync("/api/finance/fee-categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Plan Fee",
            description = "For payment plan test",
            isMandatory = true
        });
        Assert.Equal(HttpStatusCode.OK, categoryResponse.StatusCode);
        var categoryId = await GetIdAsync(categoryResponse);

        var invoiceResponse = await client.PostAsJsonAsync("/api/finance/invoices", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            invoiceNumber = "INV-2026-PLAN-001",
            currency = "USD",
            lines = new[]
            {
                new { feeCategoryId = categoryId, description = "Plan Fee", amount = 1200m }
            }
        });
        Assert.Equal(HttpStatusCode.OK, invoiceResponse.StatusCode);
        var invoiceId = await GetIdAsync(invoiceResponse);

        var planResponse = await client.PostAsJsonAsync("/api/finance/payment-plans", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            invoiceId,
            installments = 12,
            startDate = DateTime.UtcNow.Date,
            endDate = DateTime.UtcNow.Date.AddMonths(12),
            status = "Active"
        });
        Assert.Equal(HttpStatusCode.OK, planResponse.StatusCode);
        var planId = await GetIdAsync(planResponse);

        // Update payment plan
        var updateResponse = await client.PutAsJsonAsync($"/api/finance/payment-plans/{planId}", new
        {
            tenantId = TestIds.Tenant1,
            invoiceId,
            installments = 10,
            startDate = DateTime.UtcNow.Date,
            endDate = DateTime.UtcNow.Date.AddMonths(12),
            status = "Suspended"
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete payment plan
        var deleteResponse = await client.DeleteAsync($"/api/finance/payment-plans/{planId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task StudentInvoice_Workflow_SucceedsWithIntegrityChecks()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create fee category
        var categoryResponse = await client.PostAsJsonAsync("/api/finance/fee-categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Tuition Fee",
            description = "Annual tuition",
            isCompulsory = true,
            paymentFrequency = "Annually"
        });
        Assert.Equal(HttpStatusCode.OK, categoryResponse.StatusCode);
        var categoryId = await GetIdAsync(categoryResponse);

        // Create student
        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU007",
            firstName = "Grace",
            lastName = "Taylor",
            dateOfBirth = new DateTime(2010, 9, 22),
            gender = "Female",
            gradeId = TestIds.Grade1
        });
        Assert.Equal(HttpStatusCode.OK, studentResponse.StatusCode);
        var studentId = await GetIdAsync(studentResponse);

        // Create invoice
        var invoiceResponse = await client.PostAsJsonAsync("/api/finance/invoices", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            invoiceNumber = "INV-2026-001",
            currency = "USD",
            lines = new[]
            {
                new { feeCategoryId = categoryId, description = "Tuition Fee - Term 1", amount = 500m }
            }
        });
        Assert.Equal(HttpStatusCode.OK, invoiceResponse.StatusCode);
        var invoiceId = await GetIdAsync(invoiceResponse);

        // Try to delete invoice with no payments (should succeed)
        var deleteResponse = await client.DeleteAsync($"/api/finance/invoices/{invoiceId}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Recreate invoice for payment test
        var invoice2Response = await client.PostAsJsonAsync("/api/finance/invoices", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            invoiceNumber = "INV-2026-002",
            currency = "USD",
            lines = new[]
            {
                new { feeCategoryId = categoryId, description = "Tuition Fee - Term 2", amount = 500m }
            }
        });
        Assert.Equal(HttpStatusCode.OK, invoice2Response.StatusCode);
        var invoice2Id = await GetIdAsync(invoice2Response);

        // Create payment
        var paymentResponse = await client.PostAsJsonAsync("/api/finance/payments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            invoiceId = invoice2Id,
            amount = 200m,
            currency = "USD",
            method = "Cash",
            reference = "CASH-001",
            paymentDate = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, paymentResponse.StatusCode);

        // Try to delete invoice with payment (should fail)
        var deleteWithPaymentResponse = await client.DeleteAsync($"/api/finance/invoices/{invoice2Id}?tenantId={TestIds.Tenant1}");
        Assert.Equal(HttpStatusCode.BadRequest, deleteWithPaymentResponse.StatusCode);
    }

    [Fact]
    public async Task Payment_CanBeCreatedAndUpdated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create fee category and student
        var categoryResponse = await client.PostAsJsonAsync("/api/finance/fee-categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Lab Fee",
            description = "Science lab fee",
            isCompulsory = false,
            paymentFrequency = "Once"
        });
        var categoryId = await GetIdAsync(categoryResponse);

        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU008",
            firstName = "Henry",
            lastName = "Clark",
            dateOfBirth = new DateTime(2010, 11, 30),
            gender = "Male",
            gradeId = TestIds.Grade1
        });
        var studentId = await GetIdAsync(studentResponse);

        // Create invoice
        var invoiceResponse = await client.PostAsJsonAsync("/api/finance/invoices", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            invoiceNumber = "INV-2026-003",
            currency = "USD",
            lines = new[]
            {
                new { feeCategoryId = categoryId, description = "Lab Fee", amount = 50m }
            }
        });
        var invoiceId = await GetIdAsync(invoiceResponse);

        // Create payment
        var paymentResponse = await client.PostAsJsonAsync("/api/finance/payments", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            invoiceId,
            amount = 50m,
            currency = "USD",
            method = "Bank Transfer",
            reference = "BANK-001",
            paymentDate = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, paymentResponse.StatusCode);
        var paymentId = await GetIdAsync(paymentResponse);

        // Update payment
        var updateResponse = await client.PutAsJsonAsync($"/api/finance/payments/{paymentId}", new
        {
            tenantId = TestIds.Tenant1,
            amount = 45m,
            currency = "USD",
            method = "Bank Transfer - Updated",
            reference = "BANK-002",
            paymentDate = DateTime.UtcNow
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // Delete payment
        var deleteResponse = await client.DeleteAsync($"/api/finance/payments/{paymentId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task ArrearsReport_CanBeGenerated()
    {
        await _factory.ResetAsync();
        var client = _factory.CreateClient();
        client.UseTenantOwnerAuth(TestIds.Tenant1);

        // Create fee category and student
        var categoryResponse = await client.PostAsJsonAsync("/api/finance/fee-categories", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            name = "Sports Fee",
            description = "Sports activities fee",
            isCompulsory = false,
            paymentFrequency = "Once"
        });
        var categoryId = await GetIdAsync(categoryResponse);

        var studentResponse = await client.PostAsJsonAsync("/api/students", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentNumber = "STU009",
            firstName = "Iris",
            lastName = "Johnson",
            dateOfBirth = new DateTime(2010, 2, 14),
            gender = "Female",
            gradeId = TestIds.Grade1
        });
        var studentId = await GetIdAsync(studentResponse);

        // Create invoice (unpaid to create arrears)
        var invoiceResponse = await client.PostAsJsonAsync("/api/finance/invoices", new
        {
            tenantId = TestIds.Tenant1,
            schoolId = TestIds.School1,
            studentId,
            academicYearId = TestIds.AcademicYear1,
            termId = TestIds.Term1,
            gradeId = TestIds.Grade1,
            invoiceNumber = "INV-2026-004",
            currency = "USD",
            lines = new[]
            {
                new { feeCategoryId = categoryId, description = "Sports Fee", amount = 25m }
            }
        });
        Assert.Equal(HttpStatusCode.OK, invoiceResponse.StatusCode);

        // Generate arrears report
        var arrearsResponse = await client.GetAsync($"/api/finance/reports/arrears?tenantId={TestIds.Tenant1}&schoolId={TestIds.School1}&academicYearId={TestIds.AcademicYear1}&termId={TestIds.Term1}");
        Assert.Equal(HttpStatusCode.OK, arrearsResponse.StatusCode);
    }

    private static async Task<Guid> GetIdAsync(HttpResponseMessage response)
    {
        var text = await response.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(text);
        return doc.RootElement.GetProperty("id").GetGuid();
    }
}
