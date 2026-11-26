using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using FootballTracker.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddHttpClient<StrikerApiService>();

var connectionString =
    builder.Configuration.GetConnectionString("FootballTracker")
    ?? throw new InvalidOperationException(
        "Connection string 'FootballTracker' not found.");

builder.Services.AddControllers();

builder.Services.AddDataProtection()
    .SetApplicationName("FootballTracker.Auth.v2");

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<FootballTrackerContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services
    .AddIdentityApiEndpoints<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<FootballTrackerContext>();

builder.Services.AddScoped<AuditLogService>();

var app = builder.Build();

Console.WriteLine($"Environment: {app.Environment.EnvironmentName}");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/external-football/matches", async (
    int? season,
    StrikerApiService strikerApiService) =>
{
    try
    {
        var matches = await strikerApiService
            .GetEredivisieGamesAsync(season ?? 2026);

        return Results.Ok(matches);
    }
    catch (HttpRequestException)
    {
        return Results.Problem(
            "Wedstrijdgegevens ophalen bij StrikerAPI is mislukt.",
            statusCode: 502
        );
    }
}).RequireAuthorization(policy => policy.RequireRole("Admin"));

app.MapGroup("/api/auth")
    .MapIdentityApi<IdentityUser>();

app.MapGet("/api/auth/me", async (
    HttpContext context,
    UserManager<IdentityUser> userManager) =>
{
    var user = await userManager.GetUserAsync(context.User);

    if (user == null)
    {
        return Results.Unauthorized();
    }

    var roles = await userManager.GetRolesAsync(user);

    return Results.Ok(new
    {
        user.Id,
        user.Email,
        Roles = roles
    });
}).RequireAuthorization();

app.MapGet("/api/auth/users/{email}", async (
    string email,
    UserManager<IdentityUser> userManager) =>
{
    var user = await userManager.FindByEmailAsync(email);

    if (user == null)
    {
        return Results.NotFound("Gebruiker niet gevonden.");
    }

    var roles = await userManager.GetRolesAsync(user);

    return Results.Ok(new
    {
        user.Id,
        user.Email,
        Roles = roles
    });
}).RequireAuthorization(policy => policy.RequireRole("Admin"));

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole>>();

    string[] roles = { "Admin", "Player" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

app.Run();