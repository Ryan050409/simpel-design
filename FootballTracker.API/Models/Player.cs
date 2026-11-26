
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class Player
{
    public int Id { get; set; }

    [Required]
    public string Firstname { get; set; } = string.Empty;

    [Required]
    public string Lastname { get; set; } = string.Empty;

    [Required]
    public string Team { get; set; } = string.Empty;

    [Required]
    public string Position { get; set; } = string.Empty;

    public int Number { get; set; }

    public int? Goals { get; set; }
    public int? Assists { get; set; }
    public int? Matches { get; set; }
    public int? MinutesPlayed { get; set; }
    public int? Tackles { get; set; }
    public int? Interceptions { get; set; }
    public int? Blocks { get; set; }
    public int? Clearances { get; set; }
    public int? DuelsWon { get; set; }
    public int? Fouls { get; set; }

    public int? CleanSheets { get; set; }
    public int? Saves { get; set; }
    public int? OneVSOneSaves { get; set; }
    public int? PenaltySaves { get; set; }
    public int? GoalsConceded { get; set; }
}
