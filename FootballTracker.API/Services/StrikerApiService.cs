
using System.Net.Http.Json;
using System.Text.Json;
using FootballTracker.API.Models;

namespace FootballTracker.API.Services;

public class StrikerApiService
{
    private readonly HttpClient _httpClient;

    public StrikerApiService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        var apiKey = configuration["StrikerApi:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "StrikerAPI API-sleutel ontbreekt.");
        }

        _httpClient = httpClient;
        _httpClient.BaseAddress =
            new Uri("https://mcp.strikerapi.com/");

        _httpClient.DefaultRequestHeaders.Add(
            "x-api-key",
            apiKey);
    }

    public async Task<List<StrikerGame>> GetEredivisieGamesAsync(
        int season)
    {
        var allGames = new List<StrikerGame>();
        int offset = 0;
        const int limit = 100;

        while (true)
        {
            var request = new
            {
                league = "eredivisie",
                season,
                limit,
                offset
            };

            var response = await _httpClient.PostAsJsonAsync(
                "v1/list_games",
                request);

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            var result =
                JsonSerializer.Deserialize<StrikerGamesResponse>(json);

            var data = result?.Data
                ?? throw new InvalidOperationException(
                    "Ongeldige StrikerAPI-response.");

            allGames.AddRange(data.Games);

            if (!data.NextOffset.HasValue ||
                data.NextOffset.Value <= offset ||
                data.Games.Count == 0)
            {
                break;
            }

            offset = data.NextOffset.Value;
        }

        return allGames;
    }


    public async Task<JsonElement?> GetLineupsAsync(string gameId)
    {
        if (string.IsNullOrWhiteSpace(gameId))
        {
            throw new ArgumentException(
                "Game ID ontbreekt.",
                nameof(gameId));
        }

        var request = new
        {
            game_id = gameId,
            league = "eredivisie"
        };

        for (int attempt = 1; attempt <= 3; attempt++)
        {
            using var response = await _httpClient.PostAsJsonAsync(
                "v1/get_lineups",
                request);

            if ((int)response.StatusCode == 429)
            {
                if (attempt == 3)
                {
                    return null;
                }

                var retryAfter = response.Headers.RetryAfter;

                var delay = retryAfter?.Delta
                    ?? (retryAfter?.Date.HasValue == true
                        ? retryAfter.Date.Value - DateTimeOffset.UtcNow
                        : TimeSpan.FromSeconds(10));

                if (delay < TimeSpan.Zero)
                    delay = TimeSpan.Zero;

                await Task.Delay(delay);
                continue;
            }

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(json);
            var root = document.RootElement;

            var data = root.TryGetProperty("data", out var wrappedData)
                ? wrappedData
                : root;

            if (!data.TryGetProperty("lineups", out var lineups) ||
                lineups.ValueKind != JsonValueKind.Array ||
                lineups.GetArrayLength() == 0)
            {
                return null;
            }

            return data.Clone();
        }

        return null;
    }

}