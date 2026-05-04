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
