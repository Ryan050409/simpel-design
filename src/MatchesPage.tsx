import { useState } from "react";
import type { Match } from "./types.ts";

type MatchesPageProps = {
  matches: Match[];
  team: string;
};
function getMatchResult(match: Match, team: string) {
  if (match.home !== team && match.away !== team) {
    return null;
  }

  const teamGoals = match.home === team ? match.homeGoals : match.awayGoals;
  const opponentGoals = match.home === team ? match.awayGoals : match.homeGoals;

  if (teamGoals > opponentGoals) {
    return "W";
  }

  if (teamGoals === opponentGoals) {
    return "G";
  }

  return "V";
}

function getResultLabel(result: string | null) {
  if (result === "W") return "Gewonnen";
  if (result === "G") return "Gelijkspel";
  if (result === "V") return "Verloren";

  return "Geen resultaat";
}

function getRowClass(result: string | null) {
  if (result === "W") {
    return "match-row-win";
  }

  if (result === "G") {
    return "match-row-draw";
  }

  if (result === "V") {
    return "match-row-loss";
  }

  return undefined;
}

function MatchesPage({ matches, team }: MatchesPageProps) {
  const [matchView, setMatchView] = useState<"favorite" | "all">("favorite");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const visibleMatches =
    matchView === "favorite"
      ? matches.filter((match) => match.home === team || match.away === team)
      : matches;

  const sortedMatches = [...visibleMatches].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="matches-page">
      <div className="matches-page-header">
        <div>
          <h1>⚽ Wedstrijden</h1>
          <p>Bekijk en beheer de wedstrijden van {team}.</p>
        </div>

        <div className="matches-page-actions">
          <div className="match-filter">
            <label htmlFor="match-view">Toon wedstrijden:</label>

            <select
              id="match-view"
              value={matchView}
              onChange={(event) =>
                setMatchView(event.target.value as "favorite" | "all")
              }
            >
              <option value="favorite">Favoriete team</option>
              <option value="all">Alle teams</option>
            </select>
          </div>

          <div className="match-filter">
            <label htmlFor="match-sort">Sorteer op datum:</label>

            <select
              id="match-sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">Nieuwste eerst</option>
              <option value="oldest">Oudste eerst</option>
            </select>
          </div>
        </div>
      </div>

      <div className="matches-table-wrapper">
        <table className="matches-table">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Thuis</th>
              <th>Uit</th>
              <th>Uitslag</th>
              <th>Resultaat</th>
            </tr>
          </thead>

          <tbody>
            {sortedMatches.length === 0 ? (
              <tr>
                <td colSpan={5}>Geen wedstrijden gevonden.</td>
              </tr>
            ) : (
              sortedMatches.map((match) => {
                const result = getMatchResult(match, team);
                const homeIsFavorite = match.home === team;
                const awayIsFavorite = match.away === team;
                const homeIsWinner = match.homeGoals > match.awayGoals;
                const awayIsWinner = match.awayGoals > match.homeGoals;

                return (
                  <tr key={match.id} className={getRowClass(result)}>
                    <td>{new Date(match.date).toLocaleDateString("nl-NL")}</td>

                    <td
                      className={[
                        homeIsFavorite ? "favorite-team-name" : "",
                        homeIsWinner ? "winner-team-name" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {homeIsFavorite && (
                        <span
                          className="favorite-indicator"
                          aria-label="Favoriet team"
                          title="Favoriet team"
                        >
                          {" "}
                        </span>
                      )}
                      {match.home}
                    </td>

                    <td
                      className={[
                        awayIsFavorite ? "favorite-team-name" : "",
                        awayIsWinner ? "winner-team-name" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {awayIsFavorite && (
                        <span
                          className="favorite-indicator"
                          aria-label="Favoriet team"
                          title="Favoriet team"
                        >
                          {" "}
                        </span>
                      )}
                      {match.away}
                    </td>

                    <td>
                      <span className="match-score">
                        {match.homeGoals} - {match.awayGoals}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          result === "W"
                            ? "result-win"
                            : result === "G"
                              ? "result-draw"
                              : result === "V"
                                ? "result-loss"
                                : "match-result-text"
                        }
                        aria-label={getResultLabel(result)}
                        title={getResultLabel(result)}
                      >
                        {result ? getResultLabel(result) : "-"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MatchesPage;
