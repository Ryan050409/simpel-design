import { useState } from "react";
import type { Match } from "./types.ts";
import { translations, type Language } from "./translations.ts";
import teamLogos from "./teamLogos";

type MatchesPageProps = {
  matches: Match[];
  team: string;
  language: Language;
};

function getMatchResult(match: Match, team: string) {
  if (match.home !== team && match.away !== team) {
    return null;
  }

  if (
    typeof match.homeGoals !== "number" ||
    typeof match.awayGoals !== "number"
  ) {
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

function getLocale(language: Language) {
  const locales: Record<Language, string> = {
    nl: "nl-NL",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    sp: "es-ES",
    pt: "pt-PT",
  };

  return locales[language];
}

function formatMatchDate(date: string, language: Language) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const hasKickoffTime =
    parsedDate.getHours() !== 0 || parsedDate.getMinutes() !== 0;

  return new Intl.DateTimeFormat(getLocale(language), {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(hasKickoffTime && {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }).format(parsedDate);
}

function MatchesPage({ matches, team, language }: MatchesPageProps) {
  const t = translations[language];

  const [matchView, setMatchView] = useState<"favorite" | "all">("favorite");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [matchStatus, setMatchStatus] = useState<"all" | "upcoming" | "played">(
    "all",
  );
  const [resultFilter, setResultFilter] = useState<
    "all" | "home" | "draw" | "away"
  >("all");
  const [venueFilter, setVenueFilter] = useState<"all" | "home" | "away">(
    "all",
  );

  const visibleMatches =
    matchView === "favorite"
      ? matches.filter((match) => match.home === team || match.away === team)
      : matches;

  const venueFilteredMatches = visibleMatches.filter((match) => {
    if (venueFilter === "home") return match.home === team;
    if (venueFilter === "away") return match.away === team;

    return true;
  });

  const resultFilteredMatches = venueFilteredMatches.filter((match) => {
    if (resultFilter === "all") return true;

    const result = getMatchResult(match, team);

    if (resultFilter === "home") return result === "W";
    if (resultFilter === "draw") return result === "G";
    if (resultFilter === "away") return result === "V";

    return true;
  });

  const statusFilteredMatches = resultFilteredMatches.filter((match) => {
    const hasResult =
      typeof match.homeGoals === "number" &&
      typeof match.awayGoals === "number";

    const isUpcoming =
     match.homeGoals == null && match.awayGoals === null;

    if (matchStatus === "upcoming") return isUpcoming;
    if (matchStatus === "played") return hasResult;

    return true;
  });

  const sortedMatches = [...statusFilteredMatches].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const playedCount = visibleMatches.filter(
    (match) =>
      typeof match.homeGoals === "number" &&
      typeof match.awayGoals === "number",
  ).length;

  const upcomingCount = visibleMatches.filter(
    (match) => match.homeGoals === null && match.awayGoals === null,
  ).length;

  return (
    <main className="matches-page">
      <header className="matches-page-header">
        <div>
          <h1>⚽ {t.matches}</h1>
          <p>
            {t.matchesDescription} {team}.
          </p>
        </div>

        <div className="matches-page-summary">
          <div className="matches-summary-item">
            <span>Gespeeld</span>
            <strong>{playedCount}</strong>
          </div>

          <div className="matches-summary-item">
            <span>Aankomend</span>
            <strong>{upcomingCount}</strong>
          </div>
        </div>
      </header>

      <section className="matches-filter-panel">
        <div className="matches-filter-heading">
          <h2>Wedstrijden filteren</h2>
          <span>{sortedMatches.length} wedstrijden</span>
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
            <label htmlFor="match-venue-filter">Thuis / uit</label>
            <select
              id="match-venue-filter"
              value={venueFilter}
              onChange={(event) =>
                setVenueFilter(event.target.value as "all" | "home" | "away")
              }
            >
              <option value="all">Alle wedstrijden</option>
              <option value="home">Thuiswedstrijden</option>
              <option value="away">Uitwedstrijden</option>
            </select>
          </div>

          <div className="match-filter">
            <label htmlFor="match-result-filter">{t.filterByOutcome}</label>
            <select
              id="match-result-filter"
              value={resultFilter}
              onChange={(event) =>
                setResultFilter(
                  event.target.value as "all" | "home" | "draw" | "away",
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

        <div className="matches-status-tabs" aria-label="Wedstrijdstatus">
          <button
            type="button"
            className={matchStatus === "all" ? "active" : ""}
            aria-pressed={matchStatus === "all"}
            onClick={() => setMatchStatus("all")}
          >
            Alles
          </button>

          <button
            type="button"
            className={matchStatus === "upcoming" ? "active" : ""}
            aria-pressed={matchStatus === "upcoming"}
            onClick={() => setMatchStatus("upcoming")}
          >
            Aankomend
          </button>

          <button
            type="button"
            className={matchStatus === "played" ? "active" : ""}
            aria-pressed={matchStatus === "played"}
            onClick={() => setMatchStatus("played")}
          >
            Gespeeld
          </button>
        </div>
      </section>

      <section className="matches-card-list" aria-label={t.matches}>
        {sortedMatches.length === 0 ? (
          <div className="matches-empty-state">
            <span>⚽</span>
            <h2>Geen wedstrijden gevonden</h2>
            <p>{t.noMatchesFound}.</p>
          </div>
        ) : (
          sortedMatches.map((match) => {
            const result = getMatchResult(match, team);
            const hasResult =
              typeof match.homeGoals === "number" &&
              typeof match.awayGoals === "number";

            const isUpcoming =
              match.homeGoals === null && match.awayGoals === null;

            const homeIsFavorite = match.home === team;
            const awayIsFavorite = match.away === team;

            const homeIsWinner =
              hasResult && match.homeGoals! > match.awayGoals!;

            const awayIsWinner =
              hasResult && match.awayGoals! > match.homeGoals!;

            const resultLabel = getResultLabel(result, language);

            return (
              <article
                key={match.id}
                className={`match-card ${
                  result === "W"
                    ? "match-card-win"
                    : result === "G"
                      ? "match-card-draw"
                      : result === "V"
                        ? "match-card-loss"
                        : "match-card-upcoming"
                }`}
              >
                <div className="match-card-top">
                  <span className="match-card-date">
                    {formatMatchDate(match.date, language)}
                  </span>

                  <span
                    className={`match-card-status ${
                      isUpcoming ? "status-upcoming" : "status-played"
                    }`}
                  >
                    {isUpcoming ? "Aankomend" : resultLabel}
                  </span>
                </div>

                <div className="match-card-content">
                  <div
                    className={`match-card-team ${
                      homeIsWinner ? "match-card-winner" : ""
                    }`}
                  >
                    {homeIsFavorite && (
                      <span
                        className="match-card-favorite"
                        title={t.favoriteTeamIndicator}
                        aria-label={t.favoriteTeamIndicator}
                      >
                        ★
                      </span>
                    )}

                    <img
                      src={teamLogos[match.home]}
                      alt={`${match.home} logo`}
                      className="match-card-team-logo"
                    />
                    <strong>{match.home}</strong>
                    <span className="match-card-team-role">Thuis</span>
                  </div>

                  <div className="match-card-score">
                    {hasResult ? (
                      <>
                        <span className={homeIsWinner ? "score-winner" : ""}>
                          {match.homeGoals}
                        </span>
                        <span className="score-divider">-</span>
                        <span className={awayIsWinner ? "score-winner" : ""}>
                          {match.awayGoals}
                        </span>
                      </>
                    ) : (
                      <span className="match-card-vs">VS</span>
                    )}
                  </div>

                  <div
                    className={`match-card-team match-card-team-away ${
                      awayIsWinner ? "match-card-winner" : ""
                    }`}
                  >
                    {awayIsFavorite && (
                      <span
                        className="match-card-favorite"
                        title={t.favoriteTeamIndicator}
                        aria-label={t.favoriteTeamIndicator}
                      >
                        ★
                      </span>
                    )}
                    <img
                      src={teamLogos[match.away]}
                      alt={`${match.away} logo`}
                      className="match-card-team-logo"
                    />
                    <strong>{match.away}</strong>{" "}
                    <span className="match-card-team-role">Uit</span>
                  </div>
                </div>

                {hasResult && (
                  <div className="match-card-footer">
                    <span>{resultLabel}</span>
                    {result === "W" && <span>3 punten</span>}
                    {result === "G" && <span>1 punt</span>}
                    {result === "V" && <span>0 punten</span>}
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}

export default MatchesPage;
