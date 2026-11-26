using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class Match
{
    public int Id { get; set; }

    public string? ExternalGameId { get; set; }

    [Required]
    public string Home { get; set; } = string.Empty;

    [Required]
    public string Away { get; set; } = string.Empty;

    public int? HomeGoals { get; set; }

    public int? AwayGoals { get; set; }

    public DateTime Date { get; set; }

    public int Matchday { get; set; }
    public string? Venue { get; set; }

    public string? City { get; set; }

    public int? Attendance { get; set; }
    public string? HomeLineup { get; set; }
    public string? AwayLineup { get; set; }
}