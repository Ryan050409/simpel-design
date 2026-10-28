import { useState } from "react";
import type { Player, Team } from "./types.ts";
import { translations, type Language } from "./translations.ts";

type PlayersPageProps = {
  playerList: Player[];
  teams: Team[];
  language: Language;
};

function PlayersPage({ playerList, teams, language }: PlayersPageProps) {
  const t = translations[language];
  const isDutch = language === "nl";

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = playerList.filter((player) =>
    `${player.firstname} ${player.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  function getRatingClass(rating: number) {
    if (rating >= 9) return "rating-excellent";
    if (rating >= 8) return "rating-very-good";
    if (rating >= 7) return "rating-good";
    if (rating >= 6) return "rating-average";
    return "rating-low";
  }

  const positionLabels: Record<string, string> = {
    Keeper: isDutch ? "Keeper" : "Goalkeeper",
    Verdediger: isDutch ? "Verdediger" : "Defender",
    Middenvelder: isDutch ? "Middenvelder" : "Midfielder",
    Aanvaller: isDutch ? "Aanvaller" : "Forward",
  };

  const statLabels = {
    goals: isDutch ? "Goals" : "Goals",
    assists: isDutch ? "Assists" : "Assists",
    tackles: isDutch ? "Tackles" : "Tackles",
    interceptions: isDutch ? "Onderscheppingen" : "Interceptions",
    saves: isDutch ? "Reddingen" : "Saves",
    oneVsOne: isDutch ? "1-op-1 reddingen" : "One-on-one saves",
    matches: isDutch ? "Wedstrijden" : "Matches",
    minutes: isDutch ? "Minuten" : "Minutes",
    blocks: isDutch ? "Blokkades" : "Blocks",
    clearances: isDutch ? "Weggewerkte ballen" : "Clearances",
    duelsWon: isDutch ? "Gewonnen duels" : "Duels won",
    fouls: isDutch ? "Overtredingen" : "Fouls",
    cleanSheets: isDutch ? "Clean sheets" : "Clean sheets",
    penaltySaves: isDutch ? "Penalty's gestopt" : "Penalties saved",
    goalsConceded: isDutch ? "Tegengoals" : "Goals conceded",
  };

  return (
    <div className="players-page">
      <div className="players-page-header">
        <div>
          <h1>👥 {t.players}</h1>
          <p>
            {isDutch
              ? "Bekijk de spelers en hun statistieken."
              : "View the players and their statistics."}
          </p>
        </div>
      </div>

      <div className="player-search">
        <label htmlFor="player-search-input">
          {isDutch ? "Zoek een speler" : "Search for a player"}
        </label>
        <input
          id="player-search-input"
          type="search"
          placeholder={
            isDutch
              ? "Zoek op voor- of achternaam..."
              : "Search by first or last name..."
          }
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="players-by-team">
        {filteredPlayers.length === 0 && (
          <p role="status">
            {isDutch ? "Geen spelers gevonden." : "No players found."}
          </p>
        )}

        {teams
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((team) => {
            const teamPlayers = filteredPlayers.filter(
              (player) => player.team === team.name,
            );

            if (teamPlayers.length === 0) return null;

            return (
              <section className="players-team-section" key={team.id}>
                <div className="players-team-header">
                  <h2>{team.name}</h2>
                  <span>
                    {teamPlayers.length}{" "}
                    {teamPlayers.length === 1
                      ? isDutch
                        ? "speler"
                        : "player"
                      : isDutch
                        ? "spelers"
                        : "players"}
                  </span>
                </div>

                <div className="players">
                  {teamPlayers.map((player) => (
                    <div
                      className="player-card player-card-v2"
                      key={player.id}
                    >
                      <div className="player-card-header">
                        <div>
                          <div className="player-fullname-row">
                            <h2 className="player-name-v2">
                              {player.firstname} {player.lastname}
                            </h2>

                            <span className="player-number player-number-v2">
                              #{player.number}
                            </span>
                          </div>

                          <p className="player-team">{player.team}</p>
                        </div>

                        <div className="player-rating">
                          <span>RATING</span>
                          <strong className={getRatingClass(player.rating)}>
                            {player.rating}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="player-info-button"
                          aria-label={
                            isDutch
                              ? `Bekijk details van ${player.firstname} ${player.lastname}`
                              : `View details for ${player.firstname} ${player.lastname}`
                          }
                          title={
                            isDutch
                              ? "Bekijk spelerdetails"
                              : "View player details"
                          }
                          onClick={() => setSelectedPlayer(player)}
                        >
                          i
                        </button>
                      </div>

                      <div className="player-position">
                        {positionLabels[player.position] ?? player.position}
                      </div>

                      <div className="player-stats">
                        {(player.position === "Aanvaller" ||
                          player.position === "Middenvelder") && (
                          <>
                            <div className="player-stat">
                              <strong>{player.goals}</strong>
                              <span>{statLabels.goals}</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.assists}</strong>
                              <span>{statLabels.assists}</span>
                            </div>
                          </>
                        )}

                        {player.position === "Verdediger" && (
                          <>
                            <div className="player-stat">
                              <strong>{player.tackles ?? 0}</strong>
                              <span>{statLabels.tackles}</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.interceptions ?? 0}</strong>
                              <span>{statLabels.interceptions}</span>
                            </div>
                          </>
                        )}

                        {player.position === "Keeper" && (
                          <>
                            <div className="player-stat">
                              <strong>{player.saves ?? 0}</strong>
                              <span>{statLabels.saves}</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.oneVSOneSaves ?? 0}</strong>
                              <span>{statLabels.oneVsOne}</span>
                            </div>
                          </>
                        )}

                        <div className="player-stat">
                          <strong>{player.matches}</strong>
                          <span>{statLabels.matches}</span>
                        </div>

                        <div className="player-stat">
                          <strong>{player.minutesplayed}</strong>
                          <span>{statLabels.minutes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
      </div>

      {selectedPlayer && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="modal player-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label={isDutch ? "Sluit spelerdetails" : "Close player details"}
              onClick={() => setSelectedPlayer(null)}
            >
              ×
            </button>

            <div className="player-details-header">
              <div className="player-details-info">
                <div className="player-details-name-row">
                  <h2 id="player-details-title">
                    {selectedPlayer.firstname} {selectedPlayer.lastname}
                  </h2>

                  <span className="player-details-number">
                    #{selectedPlayer.number}
                  </span>
                </div>

                <p className="player-details-team">{selectedPlayer.team}</p>

                <span className="player-details-position">
                  {positionLabels[selectedPlayer.position] ??
                    selectedPlayer.position}
                </span>
              </div>

              <div className="player-details-rating">
                <span>RATING</span>
                <strong className={getRatingClass(selectedPlayer.rating)}>
                  {selectedPlayer.rating}
                </strong>
              </div>
            </div>

            <div className="player-details-section">
              <h3>{isDutch ? "Algemeen" : "General"}</h3>
              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.matches}</strong>
                  <span>{statLabels.matches}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.minutesplayed}</strong>
                  <span>{statLabels.minutes}</span>
                </div>
              </div>
            </div>

            <div className="player-details-section">
              <h3>{isDutch ? "Aanvallend" : "Attacking"}</h3>
              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.goals}</strong>
                  <span>{statLabels.goals}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.assists}</strong>
                  <span>{statLabels.assists}</span>
                </div>
              </div>
            </div>

            <div className="player-details-section">
              <h3>{isDutch ? "Verdedigend" : "Defending"}</h3>
              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.tackles ?? 0}</strong>
                  <span>{statLabels.tackles}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.interceptions ?? 0}</strong>
                  <span>{statLabels.interceptions}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.blocks ?? 0}</strong>
                  <span>{statLabels.blocks}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.clearances ?? 0}</strong>
                  <span>{statLabels.clearances}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.duelsWon ?? 0}</strong>
                  <span>{statLabels.duelsWon}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.fouls ?? 0}</strong>
                  <span>{statLabels.fouls}</span>
                </div>
              </div>
            </div>

            <div className="player-details-section">
              <h3>{isDutch ? "Keepers" : "Goalkeepers"}</h3>
              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.saves ?? 0}</strong>
                  <span>{statLabels.saves}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.oneVSOneSaves ?? 0}</strong>
                  <span>{statLabels.oneVsOne}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.cleanSheets ?? 0}</strong>
                  <span>{statLabels.cleanSheets}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.penaltySaves ?? 0}</strong>
                  <span>{statLabels.penaltySaves}</span>
                </div>
                <div className="player-stat">
                  <strong>{selectedPlayer.goalsConceded ?? 0}</strong>
                  <span>{statLabels.goalsConceded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayersPage;
