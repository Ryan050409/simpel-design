
using System.Text.Json.Serialization;

namespace FootballTracker.API.Models;

public class StrikerGame
{
    [JsonPropertyName("game_id")]
    public string GameId { get; set; } = "";

    [JsonPropertyName("season")]
    public int Season { get; set; }

    [JsonPropertyName("stage")]
    public string Stage { get; set; } = "";

    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("starts_at")]
    public DateTime StartsAt { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "";

    [JsonPropertyName("status_detail")]
    public string? StatusDetail { get; set; }

    [JsonPropertyName("home")]
    public StrikerTeam Home { get; set; } = new();

    [JsonPropertyName("away")]
    public StrikerTeam Away { get; set; } = new();

    [JsonPropertyName("result")]
    public string? Result { get; set; }

    [JsonPropertyName("venue")]
    public string? Venue { get; set; }

    [JsonPropertyName("city")]
    public string? City { get; set; }

    [JsonPropertyName("attendance")]
    public int? Attendance { get; set; }
}

public class StrikerTeam
{
    [JsonPropertyName("team_id")]
    public string TeamId { get; set; } = "";

    [JsonPropertyName("abbrev")]
    public string Abbrev { get; set; } = "";

    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("score")]
    public int? Score { get; set; }
}

public class StrikerGamesResponse
{
    [JsonPropertyName("data")]
    public StrikerGamesData? Data { get; set; }
}
public class StrikerGamesData
{
    [JsonPropertyName("games")]
    public List<StrikerGame> Games { get; set; } = new();

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("next_offset")]
    public int? NextOffset { get; set; }
}