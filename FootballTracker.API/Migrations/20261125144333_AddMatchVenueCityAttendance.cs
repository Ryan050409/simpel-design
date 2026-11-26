using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchVenueCityAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Attendance",
                table: "Matches",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Venue",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attendance",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "Venue",
                table: "Matches");
        }
    }
}
