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
using Hangfire;
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Jobs;

public class SystemMaintenanceJobs(SmartSchoolDbContext dbContext, ILogger<SystemMaintenanceJobs> logger)
{
    [AutomaticRetry(Attempts = 0)]
    public async Task PruneRefreshTokens()
    {
        var cutoff = DateTime.UtcNow.AddDays(-14);
        var oldTokens = await dbContext.RefreshTokens
            .Where(x => (x.RevokedAtUtc.HasValue && x.RevokedAtUtc < cutoff) || x.ExpiresAtUtc < cutoff)
            .ToListAsync();

        if (oldTokens.Count == 0)
        {
            return;
        }

        dbContext.RefreshTokens.RemoveRange(oldTokens);
        await dbContext.SaveChangesAsync();
        logger.LogInformation("Pruned {Count} refresh tokens", oldTokens.Count);
    }
}
