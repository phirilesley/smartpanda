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
using Microsoft.EntityFrameworkCore;
using SmartSchool.Persistence.Data;

namespace SmartSchool.API.Jobs;

public class NotificationDispatchJobs(SmartSchoolDbContext dbContext, ILogger<NotificationDispatchJobs> logger)
{
    public async Task DispatchQueuedNotifications()
    {
        var queued = await dbContext.Notifications
            .Where(x => x.Status == "Queued")
            .OrderBy(x => x.CreatedAtUtc)
            .Take(200)
            .ToListAsync();

        if (queued.Count == 0)
        {
            return;
        }

        foreach (var item in queued)
        {
            item.Status = "Sent";
            item.SentAtUtc = DateTime.UtcNow;
            item.UpdatedAtUtc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync();
        logger.LogInformation("Dispatched {Count} queued notifications.", queued.Count);
    }
}
