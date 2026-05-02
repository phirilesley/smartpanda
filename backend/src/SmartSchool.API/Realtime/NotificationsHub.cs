using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SmartSchool.API.Security;

namespace SmartSchool.API.Realtime;

[Authorize]
public class NotificationsHub : Hub
{
    public async Task JoinSchoolGroup(Guid schoolId)
    {
        var tenantId = Context.User?.FindFirstValue(ClaimTypesExt.TenantId);
        if (string.IsNullOrWhiteSpace(tenantId))
        {
            return;
        }

        var group = $"tenant:{tenantId}:school:{schoolId}";
        await Groups.AddToGroupAsync(Context.ConnectionId, group);
    }

    public async Task LeaveSchoolGroup(Guid schoolId)
    {
        var tenantId = Context.User?.FindFirstValue(ClaimTypesExt.TenantId);
        if (string.IsNullOrWhiteSpace(tenantId))
        {
            return;
        }

        var group = $"tenant:{tenantId}:school:{schoolId}";
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, group);
    }
}
