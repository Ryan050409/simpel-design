using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class FootballTrackerContext : IdentityDbContext<IdentityUser>
{
    public FootballTrackerContext(
        DbContextOptions<FootballTrackerContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }

    public DbSet<TodoItem> TodoItems { get; set; } = null!;
    public DbSet<Team> Teams { get; set; } = null!;
    public DbSet<Player> Players { get; set; } = null!;
    public DbSet<Match> Matches { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
}