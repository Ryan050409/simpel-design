using FootballTracker.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using TodoApi.Models;

namespace FootballTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly FootballTrackerContext _context;
    private readonly AuditLogService _auditLogService;

    public MatchesController(
        FootballTrackerContext context,
        AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }
    private static string NormalizeTeamName(string name)
    {
        var normalized = string.Concat(
            name.Trim()
                .ToLowerInvariant()
                .Where(char.IsLetterOrDigit)
        );

        return normalized switch
        {
            "feyenoordrotterdam" => "feyenoord",
            "azalkmaar" => "az",
            "heerenveen" => "scheerenveen",
            "ajaxamsterdam" => "ajax",
            "psveindhoven" => "psv",
            "excelsior" => "excelsiorrotterdam",
            _ => normalized
        };
    }
    // GET: api/Matches

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
    {
        return await _context.Matches.ToListAsync();
    }

    // GET: api/Matches/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Match>> GetMatch(int id)
    {
        var match = await _context.Matches.FindAsync(id);

        if (match == null)
        {
            return NotFound();
        }

        return match;
    }
    // GET: api/Matches/lineups-status
    [Authorize(Roles = "Admin")]
    [HttpGet("lineups-status")]
    public async Task<IActionResult> GetLineupsStatus()
    {
        var matches = await _context.Matches
            .AsNoTracking()
            .ToListAsync();

        return Ok(new
        {
            Total = matches.Count,
            WithBothLineups = matches.Count(m =>
                !string.IsNullOrWhiteSpace(m.HomeLineup) &&
                !string.IsNullOrWhiteSpace(m.AwayLineup)),
            MissingLineups = matches.Count(m =>
                string.IsNullOrWhiteSpace(m.HomeLineup) ||
                string.IsNullOrWhiteSpace(m.AwayLineup))
        });
    }
    // GET: api/Matches/sync-preview
    [Authorize(Roles = "Admin")]
    [HttpGet("sync-preview")]
    public async Task<IActionResult> PreviewStrikerSync(
        [FromQuery] int season,
        [FromServices] StrikerApiService strikerApiService)
    {
        var externalGames =
            await strikerApiService.GetEredivisieGamesAsync(season);

        var existingMatches =
            await _context.Matches.AsNoTracking().ToListAsync();

        var alreadyLinked = 0;
        var existingWithoutId = 0;
        var newMatches = 0;

        foreach (var game in externalGames)
        {
            if (existingMatches.Any(m =>
                m.ExternalGameId == game.GameId))
            {
                alreadyLinked++;
                continue;
            }

            var manualMatch = existingMatches.Any(m =>
    m.ExternalGameId == null &&
    NormalizeTeamName(m.Home) == NormalizeTeamName(game.Home.Name) &&
    NormalizeTeamName(m.Away) == NormalizeTeamName(game.Away.Name) &&
    m.Date.Date == game.Date.Date);

            if (manualMatch)
                existingWithoutId++;
            else
                newMatches++;
        }
        var unmatchedGames = externalGames
    .Where(game =>
        !existingMatches.Any(m =>
            m.ExternalGameId == game.GameId) &&
        !existingMatches.Any(m =>
    m.ExternalGameId == null &&
    NormalizeTeamName(m.Home) == NormalizeTeamName(game.Home.Name) &&
    NormalizeTeamName(m.Away) == NormalizeTeamName(game.Away.Name) &&
    m.Date.Date == game.Date.Date))
    .Take(10)
    .Select(game => new
    {
        game.GameId,
        Home = game.Home.Name,
        Away = game.Away.Name,
        game.Date
    })
    .ToList();
        var unmatchedLocalMatches = existingMatches
    .Where(m =>
        m.ExternalGameId == null &&
        !externalGames.Any(game =>
            NormalizeTeamName(m.Home) == NormalizeTeamName(game.Home.Name) &&
            NormalizeTeamName(m.Away) == NormalizeTeamName(game.Away.Name) &&
            m.Date.Date == game.Date.Date
        )
    )
    .Take(15)
    .Select(m => new
    {
        m.Home,
        m.Away,
        m.Date,
        PossibleExternalMatches = externalGames
            .Where(game =>
                NormalizeTeamName(m.Home) == NormalizeTeamName(game.Home.Name) &&
                NormalizeTeamName(m.Away) == NormalizeTeamName(game.Away.Name) &&
                m.Date.Date == game.Date.Date
            )
            .Select(game => new
            {
                game.GameId,
                game.Date,
                game.StartsAt
            })
            .ToList()
    })
    .ToList();

        return Ok(new
        {
            Season = season,
            ExternalTotal = externalGames.Count,
            AlreadyLinked = alreadyLinked,
            ExistingWithoutExternalId = existingWithoutId,
            WouldAdd = newMatches,
            UnmatchedExamples = unmatchedGames,
            UnmatchedLocalExamples = unmatchedLocalMatches
        });
    }
    // POST: api/Matches
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Match>> PostMatch(Match match)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? string.Empty;

        var userEmail = User.FindFirstValue(ClaimTypes.Email)
            ?? User.Identity?.Name
            ?? string.Empty;

        _auditLogService.AddLog(
            userId: userId,
            userEmail: userEmail,
            action: "Create",
            entityType: "Match",
            entityId: match.Id,
            oldValues: null,
            newValues: JsonSerializer.Serialize(match)
        );

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return CreatedAtAction(
            nameof(GetMatch),
            new { id = match.Id },
            match
        );
    }
    // POST: api/Matches/bulk
    [Authorize(Roles = "Admin")]
    [HttpPost("bulk")]
    public async Task<ActionResult<List<Match>>> PostMatches(List<Match> matches)
    {
        if (matches == null || matches.Count == 0)
        {
            return BadRequest("Geen wedstrijden ontvangen.");
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        _context.Matches.AddRange(matches);
        await _context.SaveChangesAsync();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? string.Empty;

        var userEmail = User.FindFirstValue(ClaimTypes.Email)
            ?? User.Identity?.Name
            ?? string.Empty;

        foreach (var match in matches)
        {
            _auditLogService.AddLog(
                userId: userId,
                userEmail: userEmail,
                action: "BulkCreate",
                entityType: "Match",
                entityId: match.Id,
                oldValues: null,
                newValues: JsonSerializer.Serialize(match)
            );
        }

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return Ok(matches);
    }
    // POST: api/Matches/sync-strikerapi
    [Authorize(Roles = "Admin")]
    [HttpPost("sync-strikerapi")]
    public async Task<IActionResult> SyncStrikerApi(
        [FromQuery] int season,
        [FromServices] StrikerApiService strikerApiService)
    {
        var externalGames =
    await strikerApiService.GetEredivisieGamesAsync(season);

        var existingMatches = await _context.Matches.ToListAsync();

        var added = 0;
        var updated = 0;

        foreach (var game in externalGames)
        {
            var match = existingMatches.FirstOrDefault(m =>
    m.ExternalGameId == game.GameId
);

            if (match == null)
            {
                match = existingMatches.FirstOrDefault(m =>
                    m.ExternalGameId == null &&
                    NormalizeTeamName(m.Home) == NormalizeTeamName(game.Home.Name) &&
                    NormalizeTeamName(m.Away) == NormalizeTeamName(game.Away.Name) &&
                    m.Date.Date == game.Date.Date
                );
            }

            if (match == null)
            {
                match = new Match
                {
                    ExternalGameId = game.GameId,
                    Home = game.Home.Name,
                    Away = game.Away.Name,
                    HomeGoals = game.Home.Score,
                    AwayGoals = game.Away.Score,
                    Date = game.StartsAt,
                    Matchday = 0,
                    Venue = game.Venue,
                    City = game.City,
                    Attendance = game.Attendance
                };
                _context.Matches.Add(match);
                existingMatches.Add(match);
                added++;
            }
            else
            {
                match.ExternalGameId = game.GameId;
                match.Date = game.StartsAt;
                match.Venue = game.Venue;
                match.City = game.City;
                match.Attendance = game.Attendance;
                if (game.Home.Score.HasValue)
                    match.HomeGoals = game.Home.Score;

                if (game.Away.Score.HasValue)
                    match.AwayGoals = game.Away.Score;

                updated++;
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Season = season,
            Added = added,
            Updated = updated,
            Total = externalGames.Count
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/sync-lineups")]
    public async Task<IActionResult> SyncLineups(
        int id,
        [FromServices] StrikerApiService strikerApiService)
    {
        var match = await _context.Matches.FindAsync(id);

        if (match == null)
            return NotFound("Wedstrijd niet gevonden.");

        if (string.IsNullOrWhiteSpace(match.ExternalGameId))
            return BadRequest("Deze wedstrijd heeft geen ExternalGameId.");

        var result = await strikerApiService.GetLineupsAsync(
            match.ExternalGameId);

        if (result == null)
            return NotFound("Geen opstellingen beschikbaar.");

        var game = result.Value.GetProperty("game");
        var lineups = result.Value.GetProperty("lineups");

        var homeTeamId = game.GetProperty("home")
            .GetProperty("team_id").GetString();

        var awayTeamId = game.GetProperty("away")
            .GetProperty("team_id").GetString();

        var homeLineup = lineups.EnumerateArray()
            .FirstOrDefault(x =>
                x.GetProperty("team_id").GetString() == homeTeamId);

        var awayLineup = lineups.EnumerateArray()
            .FirstOrDefault(x =>
                x.GetProperty("team_id").GetString() == awayTeamId);

        if (homeLineup.ValueKind == JsonValueKind.Undefined ||
            awayLineup.ValueKind == JsonValueKind.Undefined)
        {
            return BadRequest("Thuis- of uitopstelling ontbreekt.");
        }

        match.HomeLineup = homeLineup.GetRawText();
        match.AwayLineup = awayLineup.GetRawText();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Thuis- en uitopstelling afzonderlijk opgeslagen.",
            MatchId = match.Id
        });
    }

    // POST: api/Matches/sync-all-lineups
    [HttpPost("sync-all-lineups")]
    public IActionResult SyncAllLineups()
    {
        return StatusCode(503, "StrikerAPI-synchronisatie is tijdelijk uitgeschakeld.");
    }

    // PUT: api/Matches/5
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMatch(int id, Match match)
    {
        if (id != match.Id)
        {
            return BadRequest();
        }

        var existingMatch = await _context.Matches.FindAsync(id);

        if (existingMatch == null)
        {
            return NotFound();
        }

        var oldValues = JsonSerializer.Serialize(existingMatch);

        existingMatch.Home = match.Home;
        existingMatch.Away = match.Away;
        existingMatch.HomeGoals = match.HomeGoals;
        existingMatch.AwayGoals = match.AwayGoals;
        existingMatch.Date = match.Date;
        existingMatch.Matchday = match.Matchday;

        var newValues = JsonSerializer.Serialize(existingMatch);

        if (oldValues == newValues)
        {
            return NoContent();
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? string.Empty;

        var userEmail = User.FindFirstValue(ClaimTypes.Email)
            ?? User.Identity?.Name
            ?? string.Empty;

        _auditLogService.AddLog(
            userId: userId,
            userEmail: userEmail,
            action: "Update",
            entityType: "Match",
            entityId: id,
            oldValues: oldValues,
            newValues: newValues
        );

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Matches.AnyAsync(e => e.Id == id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }
    // DELETE: api/Matches/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMatch(int id)
    {
        var match = await _context.Matches.FindAsync(id);

        if (match == null)
        {
            return NotFound();
        }

        var oldValues = JsonSerializer.Serialize(match);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? string.Empty;

        var userEmail = User.FindFirstValue(ClaimTypes.Email)
            ?? User.Identity?.Name
            ?? string.Empty;

        _auditLogService.AddLog(
            userId: userId,
            userEmail: userEmail,
            action: "Delete",
            entityType: "Match",
            entityId: id,
            oldValues: oldValues,
            newValues: null
        );

        _context.Matches.Remove(match);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
