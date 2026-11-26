using TodoApi.Models;

namespace FootballTracker.API.Services;

public class AuditLogService
{
    private readonly FootballTrackerContext _context;

    public AuditLogService(FootballTrackerContext context)
    {
        _context = context;
    }

    public void AddLog(
        string userId,
        string userEmail,
        string action,
        string entityType,
        int entityId,
        string? oldValues = null,
        string? newValues = null)
    {
        var log = new AuditLog
        {
            UserId = userId,
            UserEmail = userEmail,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValues = oldValues,
            NewValues = newValues,
            CreatedAt = DateTime.UtcNow
        };

        _context.AuditLogs.Add(log);
    }
}