using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace FootballTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AuditLogsController : ControllerBase
{
    private readonly FootballTrackerContext _context;

    public AuditLogsController(FootballTrackerContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuditLog>>> GetAuditLogs()
    {
        return await _context.AuditLogs
            .AsNoTracking()
            .OrderByDescending(log => log.CreatedAt)
            .ThenByDescending(log => log.Id)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuditLog>> GetAuditLog(int id)
    {
        var log = await _context.AuditLogs.FindAsync(id);

        if (log == null)
        {
            return NotFound();
        }

        return log;
    }
}