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

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("name");

  const filteredPlayers = playerList
    .filter((player) => {
      const fullName = `${player.firstname} ${player.lastname}`.toLowerCase();

      const matchesSearch = fullName.includes(searchTerm.toLowerCase().trim());

      const matchesPosition =
        positionFilter === "all" || player.position === positionFilter;

      return matchesSearch && matchesPosition;
    })
    .slice()
    .sort((a, b) => {
      switch (sortOrder) {
        case "goals":
          return b.goals - a.goals;

        case "assists":
          return b.assists - a.assists;

        case "rating":
          return b.rating - a.rating;

        case "matches":
          return b.matches - a.matches;

        case "name":
        default:
          return `${a.firstname} ${a.lastname}`.localeCompare(
            `${b.firstname} ${b.lastname}`,
          );
      }
    });
  function getRatingClass(rating: number) {
    if (rating >= 9) return "rating-excellent";
    if (rating >= 8) return "rating-very-good";
    if (rating >= 7) return "rating-good";
    if (rating >= 6) return "rating-average";
    return "rating-low";
  }

  const positionLabels: Record<string, string> = {
    Keeper: t.goalkeeperPosition,
    Verdediger: t.defenderPosition,
    Middenvelder: t.midfielderPosition,
    Aanvaller: t.forwardPosition,
  };

  const statLabels = {
    goals: t.goalsStat,
    assists: t.assistsStat,
    tackles: t.tacklesStat,
    interceptions: t.interceptionsStat,
    saves: t.savesStat,
    oneVsOne: t.oneVsOneSavesStat,
    matches: t.matchesStat,
    minutes: t.minutesStat,
    blocks: t.blocksStat,
    clearances: t.clearancesStat,
    duelsWon: t.duelsWonStat,
    fouls: t.foulsStat,
    cleanSheets: t.cleanSheetsStat,
    penaltySaves: t.penaltySavesStat,
    goalsConceded: t.goalsConcededStat,
  };

  return (
    <div className="players-page">
      <div className="players-page-header">
        <div>
          <h1>👥 {t.players}</h1>
          <p>{t.playersDescriptionPage}</p>
        </div>
      </div>

      <div className="player-search">
        <label htmlFor="player-search-input">{t.searchPlayerLabel}</label>
        <input
          id="player-search-input"
          type="search"
          placeholder={t.searchPlayerPlaceholderPage}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="player-filters">
        <div className="player-filter">
          <label htmlFor="player-position-filter">{t.filterByPosition}</label>

          <select
            id="player-position-filter"
            value={positionFilter}
            onChange={(event) => setPositionFilter(event.target.value)}
          >
            <option value="all">{t.allPositions}</option>
            <option value="Keeper">{t.goalkeeperPosition}</option>
            <option value="Verdediger">{t.defenderPosition}</option>
            <option value="Middenvelder">{t.midfielderPosition}</option>
            <option value="Aanvaller">{t.forwardPosition}</option>
          </select>
        </div>

        <div className="player-filter">
          <label htmlFor="player-sort-order">{t.sortPlayersBy}</label>

          <select
            id="player-sort-order"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="name">{t.sortAlphabetically}</option>
            <option value="goals">{t.sortPlayerGoals}</option>
            <option value="assists">{t.sortPlayerAssists}</option>
            <option value="rating">{t.sortPlayerRating}</option>
            <option value="matches">{t.sortPlayerMatches}</option>
          </select>
        </div>
      </div>
      <div className="players-by-team">
        {filteredPlayers.length === 0 && (
          <p role="status">{t.noPlayersMatchSearch}</p>
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
                    {teamPlayers.length === 1 ? t.player : t.playerCount}
                  </span>
                </div>

                <div className="players">
                  {teamPlayers.map((player) => (
                    <div className="player-card player-card-v2" key={player.id}>
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
                          <span>{t.ratingUppercase}</span>
                          <strong className={getRatingClass(player.rating)}>
                            {player.rating}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="player-info-button"
                          aria-label={`${t.viewPlayerDetails} ${player.firstname} ${player.lastname}`}
                          title={t.playerDetails}
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
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
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
              aria-label={t.closePlayerDetails}
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
                <span>{t.ratingUppercase}</span>
                <strong className={getRatingClass(selectedPlayer.rating)}>
                  {selectedPlayer.rating}
                </strong>
              </div>
            </div>

            <div className="player-details-section">
              <h3>{t.playerFormGeneralSection}</h3>
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
              <h3>{t.playerAttackingSection}</h3>
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
              <h3>{t.playerDefendingSection}</h3>
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
              <h3>{t.playerGoalkeeperSection}</h3>
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
