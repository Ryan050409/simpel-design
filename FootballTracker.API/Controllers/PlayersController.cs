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
    public class PlayersController : ControllerBase
    {
        private readonly FootballTrackerContext _context;
        private readonly AuditLogService _auditLogService;

        public PlayersController(
            FootballTrackerContext context,
            AuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // Centrale auditregistratie voor spelers
        private void LogPlayer(
            string action,
            int playerId,
            string? oldValues,
            string? newValues)
        {
            _auditLogService.AddLog(
                userId: User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? string.Empty,
                userEmail: User.FindFirstValue(ClaimTypes.Email)
                    ?? User.Identity?.Name
                    ?? string.Empty,
                action: action,
                entityType: "Player",
                entityId: playerId,
                oldValues: oldValues,
                newValues: newValues
            );
        }

        // Centrale methode voor het aanpassen van spelergegevens
        private static void ApplyPlayerUpdates(
            Player player,
            Player updatedPlayer)
        {
            player.Firstname = updatedPlayer.Firstname;
            player.Lastname = updatedPlayer.Lastname;
            player.Team = updatedPlayer.Team;
            player.Position = updatedPlayer.Position;
            player.Number = updatedPlayer.Number;

            player.Goals = updatedPlayer.Goals;
            player.Assists = updatedPlayer.Assists;
            player.Matches = updatedPlayer.Matches;
            player.MinutesPlayed = updatedPlayer.MinutesPlayed;

            player.Tackles = updatedPlayer.Tackles;
            player.Interceptions = updatedPlayer.Interceptions;
            player.Blocks = updatedPlayer.Blocks;
            player.Clearances = updatedPlayer.Clearances;
            player.DuelsWon = updatedPlayer.DuelsWon;
            player.Fouls = updatedPlayer.Fouls;

            player.CleanSheets = updatedPlayer.CleanSheets;
            player.Saves = updatedPlayer.Saves;
            player.OneVSOneSaves = updatedPlayer.OneVSOneSaves;
            player.PenaltySaves = updatedPlayer.PenaltySaves;
            player.GoalsConceded = updatedPlayer.GoalsConceded;
        }

        // Alle spelers ophalen
        [HttpGet]
        public ActionResult<List<Player>> GetPlayers()
        {
            return _context.Players.ToList();
        }

        // Eén speler ophalen op basis van ID
        [HttpGet("{id}")]
        public ActionResult<Player> GetPlayer(int id)
        {
            var player = _context.Players.Find(id);

            if (player == null)
            {
                return NotFound();
            }

            return Ok(player);
        }

        // Nieuwe speler toevoegen
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public ActionResult<Player> CreatePlayer(Player player)
        {
            using var transaction =
                _context.Database.BeginTransaction();

            _context.Players.Add(player);
            _context.SaveChanges();

            LogPlayer(
                "Create",
                player.Id,
                null,
                JsonSerializer.Serialize(player)
            );

            _context.SaveChanges();
            transaction.Commit();

            return CreatedAtAction(
                nameof(GetPlayer),
                new { id = player.Id },
                player
            );
        }

        // Meerdere spelers tegelijk toevoegen
        [Authorize(Roles = "Admin")]
        [HttpPost("bulk")]
        public ActionResult<List<Player>> CreatePlayers(
            List<Player> players)
        {
            if (players == null || players.Count == 0)
            {
                return BadRequest("Geen spelers ontvangen.");
            }

            using var transaction =
                _context.Database.BeginTransaction();

            _context.Players.AddRange(players);
            _context.SaveChanges();

            foreach (var player in players)
            {
                LogPlayer(
                    "BulkCreate",
                    player.Id,
                    null,
                    JsonSerializer.Serialize(player)
                );
            }

            _context.SaveChanges();
            transaction.Commit();

            return Ok(players);
        }

        // Bestaande speler aanpassen
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdatePlayer(
            int id,
            Player updatedPlayer)
        {
            var player = _context.Players.Find(id);

            if (player == null)
            {
                return NotFound();
            }

            var oldValues = JsonSerializer.Serialize(player);

            ApplyPlayerUpdates(player, updatedPlayer);

            var newValues = JsonSerializer.Serialize(player);

            if (oldValues == newValues)
            {
                return Ok(player);
            }

            LogPlayer(
                "Update",
                player.Id,
                oldValues,
                newValues
            );

            _context.SaveChanges();

            return Ok(player);
        }

        // Meerdere spelers tegelijk aanpassen
        [Authorize(Roles = "Admin")]
        [HttpPut("bulk")]
        public IActionResult UpdatePlayersBulk(
            List<Player> updatedPlayers)
        {
            if (updatedPlayers == null || updatedPlayers.Count == 0)
            {
                return BadRequest("Geen spelers ontvangen.");
            }

            var ids = updatedPlayers.Select(p => p.Id).ToList();

            if (ids.Distinct().Count() != ids.Count)
            {
                return BadRequest(
                    "De lijst bevat dubbele speler-ID's."
                );
            }

            var players = _context.Players
                .Where(p => ids.Contains(p.Id))
                .ToList();

            if (players.Count != updatedPlayers.Count)
            {
                return NotFound(
                    "Een of meerdere spelers zijn niet gevonden."
                );
            }

            foreach (var updatedPlayer in updatedPlayers)
            {
                var player = players.First(
                    p => p.Id == updatedPlayer.Id
                );

                var oldValues = JsonSerializer.Serialize(player);

                ApplyPlayerUpdates(player, updatedPlayer);

                var newValues = JsonSerializer.Serialize(player);

                if (oldValues != newValues)
                {
                    LogPlayer(
                        "BulkUpdate",
                        player.Id,
                        oldValues,
                        newValues
                    );
                }
            }

            _context.SaveChanges();

            return Ok(players);
        }

        // Speler verwijderen
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeletePlayer(int id)
        {
            var player = _context.Players.Find(id);

            if (player == null)
            {
                return NotFound();
            }

            LogPlayer(
                "Delete",
                player.Id,
                JsonSerializer.Serialize(player),
                null
            );

            _context.Players.Remove(player);
            _context.SaveChanges();

            return NoContent();
        }
    }
}