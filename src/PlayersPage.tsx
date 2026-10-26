import { useState } from "react";
import type { Player, Team } from "./types.ts";

type PlayersPageProps = {
  playerList: Player[];
  teams: Team[];
};

function PlayersPage({ playerList, teams }: PlayersPageProps) {
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

  return (
    <div className="players-page">
      <div className="players-page-header">
        <div>
          <h1>👥 Spelers</h1>
          <p>Bekijk de spelers en hun statistieken.</p>
        </div>
      </div>

      <div className="player-search">
        <label htmlFor="player-search-input">Zoek een speler</label>
        <input
          id="player-search-input"
          type="search"
          placeholder="Zoek op voor- of achternaam..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="players-by-team">
        {filteredPlayers.length === 0 && (
          <p role="status">Geen spelers gevonden.</p>
        )}

        {teams
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((team) => {
            const teamPlayers = filteredPlayers.filter(
              (player) => player.team === team.name,
            );

            if (teamPlayers.length === 0) {
              return null;
            }

            return (
              <section className="players-team-section" key={team.id}>
                <div className="players-team-header">
                  <h2>{team.name}</h2>
                  <span>
                    {teamPlayers.length}{" "}
                    {teamPlayers.length === 1 ? "speler" : "spelers"}
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
                          aria-label={`Bekijk details van ${player.firstname} ${player.lastname}`}
                          title="Bekijk spelerdetails"
                          onClick={() => setSelectedPlayer(player)}
                        >
                          i
                        </button>
                      </div>

                      <div className="player-position">
                        {player.position}
                      </div>

                      <div className="player-stats">
                        {(player.position === "Aanvaller" ||
                          player.position === "Middenvelder") && (
                          <>
                            <div className="player-stat">
                              <strong>{player.goals}</strong>
                              <span>Goals</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.assists}</strong>
                              <span>Assists</span>
                            </div>
                          </>
                        )}

                        {player.position === "Verdediger" && (
                          <>
                            <div className="player-stat">
                              <strong>{player.tackles ?? 0}</strong>
                              <span>Tackles</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.interceptions ?? 0}</strong>
                              <span>Interceptions</span>
                            </div>
                          </>
                        )}

                        {player.position === "Keeper" && (
                          <>
                            <div className="player-stat">
                              <strong>{player.saves ?? 0}</strong>
                              <span>Reddingen</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.oneVSOneSaves ?? 0}</strong>
                              <span>1-op-1 reddingen</span>
                            </div>
                          </>
                        )}

                        <div className="player-stat">
                          <strong>{player.matches}</strong>
                          <span>Wedstrijden</span>
                        </div>

                        <div className="player-stat">
                          <strong>{player.minutesplayed}</strong>
                          <span>Minuten</span>
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
              aria-label="Sluit spelerdetails"
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

                <p className="player-details-team">
                  {selectedPlayer.team}
                </p>

                <span className="player-details-position">
                  {selectedPlayer.position}
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
              <h3>Algemeen</h3>

              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.matches}</strong>
                  <span>Wedstrijden</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.minutesplayed}</strong>
                  <span>Minuten</span>
                </div>
              </div>
            </div>

            <div className="player-details-section">
              <h3>Aanvallend</h3>

              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.goals}</strong>
                  <span>Goals</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.assists}</strong>
                  <span>Assists</span>
                </div>
              </div>
            </div>

            <div className="player-details-section">
              <h3>Verdedigend</h3>

              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.tackles ?? 0}</strong>
                  <span>Tackles</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.interceptions ?? 0}</strong>
                  <span>Interceptions</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.blocks ?? 0}</strong>
                  <span>Blocks</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.clearances ?? 0}</strong>
                  <span>Clearances</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.duelsWon ?? 0}</strong>
                  <span>Gewonnen duels</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.fouls ?? 0}</strong>
                  <span>Overtredingen</span>
                </div>
              </div>
            </div>

            <div className="player-details-section">
              <h3>Keepers</h3>

              <div className="player-details-stats">
                <div className="player-stat">
                  <strong>{selectedPlayer.saves ?? 0}</strong>
                  <span>Reddingen</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.oneVSOneSaves ?? 0}</strong>
                  <span>1-op-1 reddingen</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.cleanSheets ?? 0}</strong>
                  <span>Clean sheets</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.penaltySaves ?? 0}</strong>
                  <span>Penalty's gehouden</span>
                </div>

                <div className="player-stat">
                  <strong>{selectedPlayer.goalsConceded ?? 0}</strong>
                  <span>Tegengoals</span>
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
