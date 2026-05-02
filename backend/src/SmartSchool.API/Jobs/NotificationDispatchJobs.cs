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
