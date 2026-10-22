import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import MatchForm from "./MatchForm.tsx";
import type { Match, Team } from "./types.ts";

type MatchesPageProps = {
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
  team: string;
  teams: Team[];
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

function getResultClass(result: string | null) {
  if (result === "W") {
    return "result-win";
  }

  if (result === "G") {
    return "result-draw";
  }

  if (result === "V") {
    return "result-loss";
  }

  return undefined;
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

function MatchesPage({ matches, setMatches, team, teams }: MatchesPageProps) {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
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

  function editMatch(match: Match) {
    setEditingMatch(match);
  }

  function closeModal() {
    setEditingMatch(null);
  }

  return (
    <div className="matches-page">
      <div className="matches-page-header">
        <div>
          <h1>⚽ Wedstrijden</h1>
          <p>Bekijk en beheer de wedstrijden van {team}.</p>
        </div>

        <div className="matches-page-actions">
          <button
            type="button"
            className="add-button"
            onClick={() => setShowMatchPopup(true)}
          >
            + Wedstrijd toevoegen
          </button>

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
              <th>Acties</th>
            </tr>
          </thead>

          <tbody>
            {sortedMatches.length === 0 ? (
              <tr>
                <td colSpan={6}>Geen wedstrijden gevonden.</td>
              </tr>
            ) : (
              sortedMatches.map((match) => {
                const result = getMatchResult(match, team);
                const homeIsFavorite = match.home === team;
                const awayIsFavorite = match.away === team;

                return (
                  <tr key={match.id} className={getRowClass(result)}>
                    <td>{new Date(match.date).toLocaleDateString("nl-NL")}</td>

                    <td className={homeIsFavorite ? "favorite-team-name" : ""}>
                      {homeIsFavorite && (
                        <span
                          className="favorite-indicator"
                          aria-label="Favoriet team"
                          title="Favoriet team"
                        >
                          ★{" "}
                        </span>
                      )}
                      {match.home}
                    </td>

                    <td className={awayIsFavorite ? "favorite-team-name" : ""}>
                      {awayIsFavorite && (
                        <span
                          className="favorite-indicator"
                          aria-label="Favoriet team"
                          title="Favoriet team"
                        >
                          ★{" "}
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
                        className={getResultClass(result)}
                        aria-label={
                          result === "W"
                            ? "Winst"
                            : result === "G"
                              ? "Gelijkspel"
                              : result === "V"
                                ? "Verlies"
                                : "Geen resultaat"
                        }
                        title={
                          result === "W"
                            ? "Winst"
                            : result === "G"
                              ? "Gelijkspel"
                              : result === "V"
                                ? "Verlies"
                                : "Geen resultaat"
                        }
                      >
                        {result ?? "-"}
                      </span>
                    </td>

                    <td>
                      <div className="match-actions">
                        <button type="button" onClick={() => editMatch(match)}>
                          Bewerken
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {editingMatch && (
          <MatchForm
            editingMatch={editingMatch}
            setEditingMatch={setEditingMatch}
            setMatches={setMatches}
            closeModal={closeModal}
            teams={teams}
          />
        )}

        {showMatchPopup && (
          <MatchForm
            setMatches={setMatches}
            closeModal={() => setShowMatchPopup(false)}
            teams={teams}
          />
        )}
      </div>
    </div>
  );
}

export default MatchesPage;
