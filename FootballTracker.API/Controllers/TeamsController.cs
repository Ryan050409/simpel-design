using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using FootballTracker.API.Services;
using System.Security.Claims;
using System.Text.Json;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly FootballTrackerContext _context;
        private readonly AuditLogService _auditLogService;

        public TeamsController(
            FootballTrackerContext context,
            AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        [HttpGet]
        public ActionResult<List<Team>> GetTeams()
        {
            return _context.Teams.ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Team> GetTeam(int id)
        {
            var team = _context.Teams.Find(id);

            if (team == null)
            {
                return NotFound();
            }

            return Ok(team);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public ActionResult<Team> CreateTeam(Team team)
        {
            using var transaction =
                _context.Database.BeginTransaction();

            _context.Teams.Add(team);
            _context.SaveChanges();

            _auditLogService.AddLog(
                userId: User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? string.Empty,
                userEmail: User.FindFirstValue(ClaimTypes.Email)
                    ?? User.Identity?.Name
                    ?? string.Empty,
                action: "Create",
                entityType: "Team",
                entityId: team.Id,
                oldValues: null,
                newValues: JsonSerializer.Serialize(team)
            );

            _context.SaveChanges();
            transaction.Commit();

            return CreatedAtAction(
                nameof(GetTeam),
                new { id = team.Id },
                team
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateTeam(int id, Team updatedTeam)
        {
            var team = _context.Teams.Find(id);

            if (team == null)
            {
                return NotFound();
            }

            var oldValues = JsonSerializer.Serialize(team);

            team.Name = updatedTeam.Name;
            team.LogoPath = updatedTeam.LogoPath;

            var newValues = JsonSerializer.Serialize(team);

            if (oldValues == newValues)
            {
                return Ok(team);
            }

            _auditLogService.AddLog(
                userId: User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? string.Empty,
                userEmail: User.FindFirstValue(ClaimTypes.Email)
                    ?? User.Identity?.Name
                    ?? string.Empty,
                action: "Update",
                entityType: "Team",
                entityId: team.Id,
                oldValues: oldValues,
                newValues: newValues
            );

            _context.SaveChanges();

            return Ok(team);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteTeam(int id)
        {
            var team = _context.Teams.Find(id);

            if (team == null)
            {
                return NotFound();
            }

            _auditLogService.AddLog(
                userId: User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? string.Empty,
                userEmail: User.FindFirstValue(ClaimTypes.Email)
                    ?? User.Identity?.Name
                    ?? string.Empty,
                action: "Delete",
                entityType: "Team",
                entityId: team.Id,
                oldValues: JsonSerializer.Serialize(team),
                newValues: null
            );

            _context.Teams.Remove(team);
            _context.SaveChanges();

            return NoContent();
        }
    }
}