import { useState } from "react";
import type { Player, Team } from "./types";
import { translations, type Language } from "./translations";

interface PlayersCompareProps {
  playerList: Player[];
  teams: Team[];
  language: Language;
}

export default function PlayersCompare({
  playerList,
  teams,
  language,
}: PlayersCompareProps) {
  const t = translations[language];

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [playerOneId, setPlayerOneId] = useState("");
  const [playerTwoId, setPlayerTwoId] = useState("");

  const filteredPlayers = playerList
    .filter((player) => selectedTeam === "all" || player.team === selectedTeam)
    .slice()
    .sort((a, b) =>
      `${a.firstname} ${a.lastname}`.localeCompare(
        `${b.firstname} ${b.lastname}`,
      ),
    );

  const playerOne = playerList.find(
    (player) => String(player.id) === playerOneId,
  );

  const playerTwo = playerList.find(
    (player) => String(player.id) === playerTwoId,
  );

  const statistics = [
    { label: t.matchesStat, key: "matches" },
    { label: t.minutesStat, key: "minutesplayed" },
    { label: t.goalsStat, key: "goals" },
    { label: t.assistsStat, key: "assists" },
    { label: t.averageRating, key: "rating" },
    { label: t.tacklesStat, key: "tackles" },
    { label: t.interceptionsStat, key: "interceptions" },
    { label: t.blocksStat, key: "blocks" },
    { label: t.clearancesStat, key: "clearances" },
    { label: t.duelsWonStat, key: "duelsWon" },
    { label: t.foulsStat, key: "fouls" },
  ] as const;

  return (
    <main className="players-compare-page">
      <header className="page-header">
        <h1>⚖️ {t.playersCompareTitle}</h1>
        <p>{t.playersCompareDescription}</p>
      </header>

      <section className="compare-filters">
        <label>
          {t.compareSelectTeam}
          <select
            value={selectedTeam}
            onChange={(event) => {
              setSelectedTeam(event.target.value);
              setPlayerOneId("");
              setPlayerTwoId("");
            }}
          >
            <option value="all">{t.compareAllTeams}</option>
            {teams
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
          </select>
        </label>
      </section>

      <div className="compare-selectors">
        <div className="compare-player-select">
          <h2>{t.comparePlayerOne}</h2>
          <select
            value={playerOneId}
            onChange={(event) => setPlayerOneId(event.target.value)}
          >
            <option value="">{t.compareSelectPlayer}</option>
            {filteredPlayers.map((player) => (
              <option key={player.id} value={String(player.id)}>
                {player.firstname} {player.lastname}
              </option>
            ))}
          </select>
        </div>

        <div className="compare-player-select">
          <h2>{t.comparePlayerTwo}</h2>
          <select
            value={playerTwoId}
            onChange={(event) => setPlayerTwoId(event.target.value)}
          >
            <option value="">{t.compareSelectPlayer}</option>
            {filteredPlayers.map((player) => (
              <option key={player.id} value={String(player.id)}>
                {player.firstname} {player.lastname}
              </option>
            ))}
          </select>
        </div>
      </div>

      {playerOne && playerTwo ? (
        <section className="compare-results">
          <div className="compare-player-names">
            <div>
              <h2>
                {playerOne.firstname} {playerOne.lastname}
              </h2>
              <p>
                {playerOne.team} · {playerOne.position}
              </p>
            </div>

            <span>VS</span>

            <div>
              <h2>
                {playerTwo.firstname} {playerTwo.lastname}
              </h2>
              <p>
                {playerTwo.team} · {playerTwo.position}
              </p>
            </div>
          </div>

          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>{t.compareStatistic}</th>
                  <th>{playerOne.firstname}</th>
                  <th>{playerTwo.firstname}</th>
                </tr>
              </thead>

              <tbody>
                {statistics.map((stat) => (
                  <tr key={stat.key}>
                    <td>{stat.label}</td>
                    <td>{playerOne[stat.key] ?? 0}</td>
                    <td>{playerTwo[stat.key] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="compare-empty">
          <p>{t.compareSelectTwoPlayers}</p>
        </div>
      )}
    </main>
  );
}
