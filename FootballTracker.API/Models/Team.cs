using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;
    public class Team
    {
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    public string? LogoPath { get; set; }
}
