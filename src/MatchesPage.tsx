import { useState } from "react";
import type { Match } from "./types.ts";
import { translations, type Language } from "./translations.ts";

type MatchesPageProps = {
  matches: Match[];
  team: string;
  language: Language;
};

function getMatchResult(match: Match, team: string) {
  if (match.home !== team && match.away !== team) {
    return null;
  }

  const teamGoals = match.home === team ? match.homeGoals : match.awayGoals;
  const opponentGoals = match.home === team ? match.awayGoals : match.homeGoals;

  if (teamGoals > opponentGoals) return "W";
  if (teamGoals === opponentGoals) return "G";
  return "V";
}

function getResultLabel(result: string | null, language: Language) {
  const t = translations[language];
  if (result === "W") return t.resultWon;
  if (result === "G") return t.resultDraw;
  if (result === "V") return t.resultLost;

  return t.noResult;
}

function getRowClass(result: string | null) {
  if (result === "W") return "match-row-win";
  if (result === "G") return "match-row-draw";
  if (result === "V") return "match-row-loss";

  return undefined;
}

function MatchesPage({ matches, team, language }: MatchesPageProps) {
  const t = translations[language];

  const [matchView, setMatchView] = useState<"favorite" | "all">("favorite");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [resultFilter, setResultFilter] = useState<
    "all" | "home" | "draw" | "away"
  >("all");

  const visibleMatches =
    matchView === "favorite"
      ? matches.filter((match) => match.home === team || match.away === team)
      : matches;

  const resultFilteredMatches = visibleMatches.filter((match) => {
    if (resultFilter === "all") return true;

    if (resultFilter === "draw") {
      return match.homeGoals === match.awayGoals;
    }

    if (resultFilter === "home") {
      return match.homeGoals > match.awayGoals;
    }

    return match.awayGoals > match.homeGoals;
  });

  const sortedMatches = [...resultFilteredMatches].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const resultLabel = (result: string | null) =>
    getResultLabel(result, language);

  return (
    <div className="matches-page">
      <div className="matches-page-header">
        <div>
          <h1>⚽ {t.matches}</h1>
          <p>
            {t.matchesDescription} {team}.
          </p>
        </div>

        
<div className="matches-page-actions">
  <div className="match-filter">
    <label htmlFor="match-view">{t.showMatches}</label>

    <select
      id="match-view"
      value={matchView}
      onChange={(event) =>
        setMatchView(event.target.value as "favorite" | "all")
      }
    >
      <option value="favorite">{t.favoriteTeamOption}</option>
      <option value="all">{t.allTeams}</option>
    </select>
  </div>

  <div className="match-filter">
    <label htmlFor="match-result-filter">
      {t.filterByOutcome}
    </label>

    <select
      id="match-result-filter"
      value={resultFilter}
      onChange={(event) =>
        setResultFilter(
          event.target.value as "all" | "home" | "draw" | "away"
        )
      }
    >
      <option value="all">{t.allOutcomes}</option>
      <option value="home">{t.homeWinFilter}</option>
      <option value="draw">{t.drawFilter}</option>
      <option value="away">{t.awayWinFilter}</option>
    </select>
  </div>

  <div className="match-filter">
    <label htmlFor="match-sort">{t.sortByDate}</label>

    <select
      id="match-sort"
      value={sortOrder}
      onChange={(event) =>
        setSortOrder(event.target.value as "newest" | "oldest")
      }
    >
      <option value="newest">{t.newestFirst}</option>
      <option value="oldest">{t.oldestFirst}</option>
    </select>
  </div>
</div>

      </div>

      <div className="matches-table-wrapper">
        <table className="matches-table">
          <thead>
            <tr>
              <th>{t.dateColumn}</th>
              <th>{t.homeColumn}</th>
              <th>{t.awayColumn}</th>
              <th>{t.scoreColumn}</th>
              <th>{t.resultColumn}</th>
            </tr>
          </thead>

          <tbody>
            {sortedMatches.length === 0 ? (
              <tr>
                <td colSpan={5}>{t.noMatchesFound}.</td>
              </tr>
            ) : (
              sortedMatches.map((match) => {
                const result = getMatchResult(match, team);
                const homeIsFavorite = match.home === team;
                const awayIsFavorite = match.away === team;
                const homeIsWinner = match.homeGoals > match.awayGoals;
                const awayIsWinner = match.awayGoals > match.homeGoals;
                const label = resultLabel(result);

                return (
                  <tr key={match.id} className={getRowClass(result)}>
                    <td>
                      {new Date(match.date).toLocaleDateString(
                        language === "nl" ? "nl-NL" : "en-GB",
                      )}
                    </td>

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
                          aria-label={t.favoriteTeamIndicator}
                          title={t.favoriteTeamIndicator}
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
                          aria-label={
                            language === "nl"
                              ? "Favoriet team"
                              : "Favorite team"
                          }
                          title={
                            language === "nl"
                              ? "Favoriet team"
                              : "Favorite team"
                          }
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
                        aria-label={label}
                        title={label}
                      >
                        {result ? label : "-"}
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
