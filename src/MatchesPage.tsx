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
  if (result === "W") return language === "nl" ? "Gewonnen" : "Won";
  if (result === "G") return language === "nl" ? "Gelijkspel" : "Draw";
  if (result === "V") return language === "nl" ? "Verloren" : "Lost";

  return language === "nl" ? "Geen resultaat" : "No result";
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

  const visibleMatches =
    matchView === "favorite"
      ? matches.filter((match) => match.home === team || match.away === team)
      : matches;

  const sortedMatches = [...visibleMatches].sort((a, b) => {
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
            {language === "nl"
              ? `Bekijk de wedstrijden van ${team}.`
              : `View the matches for ${team}.`}
          </p>
        </div>

        <div className="matches-page-actions">
          <div className="match-filter">
            <label htmlFor="match-view">
              {language === "nl" ? "Toon wedstrijden:" : "Show matches:"}
            </label>

            <select
              id="match-view"
              value={matchView}
              onChange={(event) =>
                setMatchView(event.target.value as "favorite" | "all")
              }
            >
              <option value="favorite">{t.favoriteTeam}</option>
              <option value="all">{t.allMatches}</option>
            </select>
          </div>

          <div className="match-filter">
            <label htmlFor="match-sort">
              {language === "nl" ? "Sorteer op datum:" : "Sort by date:"}
            </label>

            <select
              id="match-sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as "newest" | "oldest")
              }
            >
              <option value="newest">
                {language === "nl" ? "Nieuwste eerst" : "Newest first"}
              </option>
              <option value="oldest">
                {language === "nl" ? "Oudste eerst" : "Oldest first"}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="matches-table-wrapper">
        <table className="matches-table">
          <thead>
            <tr>
              <th>{language === "nl" ? "Datum" : "Date"}</th>
              <th>{language === "nl" ? "Thuis" : "Home"}</th>
              <th>{language === "nl" ? "Uit" : "Away"}</th>
              <th>{language === "nl" ? "Uitslag" : "Score"}</th>
              <th>{language === "nl" ? "Resultaat" : "Result"}</th>
            </tr>
          </thead>

          <tbody>
            {sortedMatches.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  {language === "nl"
                    ? "Geen wedstrijden gevonden."
                    : "No matches found."}
                </td>
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
                        language === "nl" ? "nl-NL" : "en-GB"
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
