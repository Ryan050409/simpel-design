import { useState, useEffect } from "react";
import type { Player, Team, PlayerPosition } from "./types.ts";
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
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | "all">(
    "all",
  );
  const [sortOrder, setSortOrder] = useState("name");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showTeamFilter, setShowTeamFilter] = useState(false);
  const scrollToTeam = (teamId: string) => {
    document.getElementById(`team-${teamId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const filteredPlayers = playerList
    .filter((player) => {
      const fullName = `${player.firstname} ${player.lastname}`.toLowerCase();

      const matchesSearch = fullName.includes(searchTerm.toLowerCase().trim());

      const matchesPosition =
        positionFilter === "all" || player.position === positionFilter;

      const matchesTeam =
        selectedTeams.length === 0 || selectedTeams.includes(player.team);
      return matchesSearch && matchesPosition && matchesTeam;
    })
    .slice()
    .sort((a, b) => {
      switch (sortOrder) {
        case "goals":
          return (b.goals ?? 0) - (a.goals ?? 0);

        case "assists":
          return (b.assists ?? 0) - (a.assists ?? 0);

        case "matches":
          return (b.matches ?? 0) - (a.matches ?? 0);

        case "name":
        default:
          return `${a.firstname} ${a.lastname}`.localeCompare(
            `${b.firstname} ${b.lastname}`,
          );
      }
    });

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
            onChange={(event) =>
              setPositionFilter(event.target.value as PlayerPosition | "all")
            }
          >
            <option value="all">{t.allPositions}</option>

            <optgroup label="Keeper">
              <option value="GK">GK</option>
            </optgroup>

            <optgroup label="Verdedigers">
              <option value="CB">CB</option>
              <option value="LB">LB</option>
              <option value="RB">RB</option>
              <option value="LWB">LWB</option>
              <option value="RWB">RWB</option>
            </optgroup>

            <optgroup label="Middenvelders">
              <option value="CDM">CDM</option>
              <option value="CM">CM</option>
              <option value="CAM">CAM</option>
              <option value="LM">LM</option>
              <option value="RM">RM</option>
            </optgroup>

            <optgroup label="Aanvallers">
              <option value="LW">LW</option>
              <option value="RW">RW</option>
              <option value="CF">CF</option>
              <option value="ST">ST</option>
            </optgroup>
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
            <option value="matches">{t.sortPlayerMatches}</option>
          </select>
        </div>
        <div className="player-filter player-team-filter">
          <label>Teams</label>
          <button
            type="button"
            className="team-filter-button"
            onClick={() => setShowTeamFilter(!showTeamFilter)}
            aria-expanded={showTeamFilter}
            aria-haspopup="true"
          >
            {selectedTeams.length === 0
              ? "Alle teams"
              : `${selectedTeams.length} teams geselecteerd`}

            <span>{showTeamFilter ? "▲" : "▼"}</span>
          </button>

          {showTeamFilter && (
            <div className="team-filter-dropdown">
              <button
                type="button"
                className="team-filter-clear"
                onClick={() => setSelectedTeams([])}
              >
                Alle teams tonen
              </button>
              {teams
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => (
                  <label key={team.id} className="team-filter-option">
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team.name)}
                      onChange={() => {
                        setSelectedTeams((previous) =>
                          previous.includes(team.name)
                            ? previous.filter((name) => name !== team.name)
                            : [...previous, team.name],
                        );
                      }}
                    />
                    {team.name}
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>
      <nav className="players-team-navigation" aria-label={t.players}>
        {teams
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((team) =>
            filteredPlayers.some((player) => player.team === team.name),
          )
          .map((team) => (
            <button
              key={team.id}
              type="button"
              onClick={() => scrollToTeam(String(team.id))}
            >
              {team.name}
            </button>
          ))}
      </nav>
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`scroll-top-button ${
            showScrollTop ? "visible" : "hidden"
          }`}
          aria-label="Terug naar boven"
          title="Terug naar boven"
          tabIndex={showScrollTop ? 0 : -1}
        >
          ↑
        </button>
      )}
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
              <section
                className="players-team-section"
                id={`team-${team.id}`}
                key={team.id}
              >
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

                      <div className="player-position">{player.position}</div>

                      <div className="player-stats">
                        {/* Aanvallers en middenvelders */}
                        {(
                          [
                            "LW",
                            "RW",
                            "CF",
                            "ST",
                            "CDM",
                            "CM",
                            "CAM",
                            "LM",
                            "RM",
                          ] as PlayerPosition[]
                        ).includes(player.position) && (
                          <>
                            <div className="player-stat">
                              <strong>{player.goals ?? 0}</strong>
                              <span>{statLabels.goals}</span>
                            </div>

                            <div className="player-stat">
                              <strong>{player.assists ?? 0}</strong>
                              <span>{statLabels.assists}</span>
                            </div>
                          </>
                        )}

                        {/* Verdedigers */}
                        {(
                          ["CB", "LB", "RB", "LWB", "RWB"] as PlayerPosition[]
                        ).includes(player.position) && (
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

                        {/* Keepers */}
                        {player.position === "GK" && (
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
                          <strong>{player.matches ?? 0}</strong>
                          <span>{statLabels.matches}</span>
                        </div>

                        <div className="player-stat">
                          <strong>{player.minutesPlayed ?? 0}</strong>
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
                  {selectedPlayer.position}
                </span>
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
                  <strong>{selectedPlayer.minutesPlayed}</strong>
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
