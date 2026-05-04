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
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Integrations;

public interface IIntegrationSecretProtector
{
    string Protect(string plaintext);
    string? TryUnprotect(string protectedText);
    Task<int> RotateSecretsAsync(Guid tenantId, Guid schoolId, string? providerName, CancellationToken cancellationToken);
}

public class IntegrationSecretProtector(IDataProtectionProvider dataProtectionProvider, SmartSchoolDbContext dbContext) : IIntegrationSecretProtector
{
    private readonly IDataProtector _protector = dataProtectionProvider.CreateProtector("SmartSchool.Integrations.Secrets.v1");

    public string Protect(string plaintext)
    {
        return _protector.Protect(plaintext);
    }

    public string? TryUnprotect(string protectedText)
    {
        try
        {
            return _protector.Unprotect(protectedText);
        }
        catch
        {
            return null;
        }
    }

    public async Task<int> RotateSecretsAsync(Guid tenantId, Guid schoolId, string? providerName, CancellationToken cancellationToken)
    {
        var query = dbContext.IntegrationSettings
            .Where(x => x.TenantId == tenantId && x.SchoolId == schoolId);

        if (!string.IsNullOrWhiteSpace(providerName))
        {
            var provider = providerName.Trim();
            query = query.Where(x => x.ProviderName == provider);
        }

        var items = await query.ToListAsync(cancellationToken);
        var updated = 0;

        foreach (var item in items)
        {
            var plain = TryUnprotect(item.EncryptedSettingsJson);
            if (plain is null)
            {
                continue;
            }

            item.EncryptedSettingsJson = Protect(plain);
            item.UpdatedAtUtc = DateTime.UtcNow;
            updated++;
        }

        if (updated > 0)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return updated;
    }
}
