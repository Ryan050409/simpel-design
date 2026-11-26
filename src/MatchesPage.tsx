import { useState } from "react";
import type { Match, TeamLineup } from "./types.ts";
import { translations, type Language } from "./translations.ts";
import teamLogos from "./teamLogos";

type MatchesPageProps = {
  matches: Match[];
  team: string;
  language: Language;
};

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

function formatCount(template: string, count: number, language: Language) {
  return template.replace(
    "{count}",
    new Intl.NumberFormat(getLocale(language)).format(count),
  );
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
function parseLineup(json: string | null): TeamLineup | null {
  if (!json) return null;

  try {
    return JSON.parse(json) as TeamLineup;
  } catch {
    return null;
  }
}
function getClubForm(matches: Match[], club: string, beforeDate: string) {
  const cutoff = new Date(beforeDate).getTime();

  return matches
    .filter((match) => {
      const isClubInMatch = match.home === club || match.away === club;
      const isPlayed = match.homeGoals !== null && match.awayGoals !== null;
      const isBeforeSelectedMatch = new Date(match.date).getTime() < cutoff;

      return isClubInMatch && isPlayed && isBeforeSelectedMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((match) => {
      const isHome = match.home === club;
      const goalsFor = isHome ? match.homeGoals! : match.awayGoals!;
      const goalsAgainst = isHome ? match.awayGoals! : match.homeGoals!;

      let result: "W" | "G" | "V";

      if (goalsFor > goalsAgainst) {
        result = "W";
      } else if (goalsFor === goalsAgainst) {
        result = "G";
      } else {
        result = "V";
      }

      return {
        ...match,
        result,
        goalsFor,
        goalsAgainst,
      };
    });
}

function getHeadToHead(matches: Match[], selected: Match) {
  return matches
    .filter((match) => {
      const sameTeams =
        (match.home === selected.home && match.away === selected.away) ||
        (match.home === selected.away && match.away === selected.home);

      const isPlayed = match.homeGoals !== null && match.awayGoals !== null;

      const isEarlier =
        new Date(match.date).getTime() < new Date(selected.date).getTime();

      return sameTeams && isPlayed && isEarlier;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
}

function MatchesPage({ matches, team, language }: MatchesPageProps) {
  const t = translations[language];

  const [selectedTeams, setSelectedTeams] = useState<string[]>([team]);
  const [selectedMatchDays, setSelectedMatchDays] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [activeMatchTab, setActiveMatchTab] = useState<
    "overview" | "lineups" | "stats"
  >("overview");

  const availableTeams = Array.from(
    new Set(matches.flatMap((match) => [match.home, match.away])),
  ).sort((a, b) => a.localeCompare(b));

  const availableMatchDays = Array.from(
    new Set(matches.map((match) => match.matchday).filter((day) => day > 0)),
  ).sort((a, b) => a - b);

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [matchStatus, setMatchStatus] = useState<"all" | "upcoming" | "played">(
    "all",
  );

  const [venueFilter, setVenueFilter] = useState<"all" | "home" | "away">(
    "all",
  );
  const [selectedLineupTeam, setSelectedLineupTeam] = useState<"home" | "away">(
    "home",
  );
  const visibleMatches = matches.filter((match) => {
    const matchesTeam =
      selectedTeams.length === 0 ||
      selectedTeams.includes(match.home) ||
      selectedTeams.includes(match.away);

    const matchesMatchday =
      selectedMatchDays.length === 0 ||
      selectedMatchDays.includes(match.matchday);

    return matchesTeam && matchesMatchday;
  });

  const venueFilteredMatches = visibleMatches.filter((match) => {
    if (selectedTeams.length === 0 || venueFilter === "all") return true;

    if (venueFilter === "home") {
      return selectedTeams.includes(match.home);
    }

    if (venueFilter === "away") {
      return selectedTeams.includes(match.away);
    }

    return true;
  });

  const statusFilteredMatches = venueFilteredMatches.filter((match) => {
    const hasResult =
      typeof match.homeGoals === "number" &&
      typeof match.awayGoals === "number";

    const isUpcoming = match.homeGoals == null && match.awayGoals == null;

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
            <span>{t.played}</span>
            <strong>{playedCount}</strong>
          </div>

          <div className="matches-summary-item">
            <span>{t.upcomingMatches}</span>
            <strong>{upcomingCount}</strong>
          </div>
        </div>
      </header>

      <section className="matches-filter-panel">
        <div className="matches-filter-heading">
          <h2>{t.matchesFilterTitle}</h2>
          <span>
            {sortedMatches.length}{" "}
            {sortedMatches.length === 1
              ? t.matchesCountSingular
              : t.matchesCountPlural}
          </span>
        </div>

        <div className="matches-page-actions">
          <div className="match-filter">
            <label>{t.showMatches}</label>

            <details className="team-multiselect">
              <summary>
                {selectedTeams.length === 0
                  ? t.allTeams
                  : formatCount(
                      t.selectedTeamsCount,
                      selectedTeams.length,
                      language,
                    )}
              </summary>

              <div className="team-multiselect-options">
                {availableTeams.map((teamName) => (
                  <label key={teamName}>
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(teamName)}
                      onChange={(event) => {
                        setSelectedTeams((current) =>
                          event.target.checked
                            ? [...current, teamName]
                            : current.filter((name) => name !== teamName),
                        );
                      }}
                    />
                    {teamName}
                  </label>
                ))}

                <button type="button" onClick={() => setSelectedTeams([])}>
                  {t.showAllTeams}
                </button>
              </div>
            </details>
          </div>

          <div className="match-filter">
            <label>{t.matchdayLabel}</label>

            <details className="team-multiselect">
              <summary>
                {selectedMatchDays.length === 0
                  ? t.allMatchdays
                  : formatCount(
                      t.selectedMatchdaysCount,
                      selectedMatchDays.length,
                      language,
                    )}
              </summary>

              <div className="team-multiselect-options">
                {availableMatchDays.map((matchday) => (
                  <label key={matchday}>
                    <input
                      type="checkbox"
                      checked={selectedMatchDays.includes(matchday)}
                      onChange={(event) => {
                        setSelectedMatchDays((current) =>
                          event.target.checked
                            ? [...current, matchday]
                            : current.filter((day) => day !== matchday),
                        );
                      }}
                    />
                    {t.matchdayLabel} {matchday}
                  </label>
                ))}

                <button type="button" onClick={() => setSelectedMatchDays([])}>
                  {t.showAllMatchdays}
                </button>
              </div>
            </details>
          </div>

          <div className="match-filter">
            <label htmlFor="match-venue-filter">{t.matchVenueFilter}</label>
            <select
              id="match-venue-filter"
              value={venueFilter}
              onChange={(event) =>
                setVenueFilter(event.target.value as "all" | "home" | "away")
              }
            >
              <option value="all">{t.allMatches}</option>
              <option value="home">{t.matchHome}</option>
              <option value="away">{t.matchAway}</option>
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

        <div className="matches-status-tabs" aria-label={t.matchStatusFilter}>
          <button
            type="button"
            className={matchStatus === "all" ? "active" : ""}
            aria-pressed={matchStatus === "all"}
            onClick={() => setMatchStatus("all")}
          >
            {t.allMatchesStatus}
          </button>

          <button
            type="button"
            className={matchStatus === "upcoming" ? "active" : ""}
            aria-pressed={matchStatus === "upcoming"}
            onClick={() => setMatchStatus("upcoming")}
          >
            {t.upcomingMatches}
          </button>

          <button
            type="button"
            className={matchStatus === "played" ? "active" : ""}
            aria-pressed={matchStatus === "played"}
            onClick={() => setMatchStatus("played")}
          >
            {t.played}
          </button>
        </div>
      </section>

      <section className="matches-card-list" aria-label={t.matches}>
        {sortedMatches.length === 0 ? (
          <div className="matches-empty-state">
            <span>⚽</span>
            <h2>{t.noMatchesFound}</h2>
          </div>
        ) : (
          sortedMatches.map((match) => {
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

            return (
              <article key={match.id} className="match-card">
                <div className="match-card-top">
                  <div className="match-card-meta">
                    <span className="match-card-date">
                      {formatMatchDate(match.date, language)}
                    </span>

                    <span className="match-card-matchday">
                      <span className="match-card-matchday-label">
                        {t.matchdayLabel}
                      </span>
                      <strong>{match.matchday}</strong>
                    </span>
                  </div>

                  <span
                    className={`match-card-status ${
                      isUpcoming ? "status-upcoming" : "status-played"
                    }`}
                  >
                    {isUpcoming ? t.upcomingMatches : t.played}
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
                    <span className="match-card-team-role">{t.matchHome}</span>
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
                    <strong>{match.away}</strong>
                    <span className="match-card-team-role">{t.matchAway}</span>
                  </div>

                  <button
                    type="button"
                    className="match-details-button"
                    onClick={() => setSelectedMatch(match)}
                  >
                    Bekijk wedstrijd
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {selectedMatch && (
        <div
          className="match-modal-overlay"
          onClick={() => setSelectedMatch(null)}
        >
          <section
            className="match-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="match-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="match-modal-close"
              onClick={() => setSelectedMatch(null)}
              aria-label="Sluiten"
            >
              ×
            </button>

            <h2 id="match-modal-title">Match Center</h2>

            <div className="match-modal-header">
              <div className="match-modal-topline">
                <span className="match-modal-competition">EREDIVISIE</span>

                <span
                  className={`match-modal-status ${
                    selectedMatch.homeGoals !== null &&
                    selectedMatch.awayGoals !== null
                      ? "played"
                      : "upcoming"
                  }`}
                >
                  {selectedMatch.homeGoals !== null &&
                  selectedMatch.awayGoals !== null
                    ? "Afgelopen"
                    : "Programma"}
                </span>
              </div>

              <div className="match-modal-score">
                <div className="match-modal-club">
                  <img
                    src={teamLogos[selectedMatch.home]}
                    alt={`${selectedMatch.home} logo`}
                    className="match-modal-team-logo"
                  />
                  <h3>{selectedMatch.home}</h3>
                  <span>Thuis</span>
                </div>

                <div className="match-modal-score-center">
                  <div className="match-modal-score-value">
                    {selectedMatch.homeGoals === null ||
                    selectedMatch.awayGoals === null
                      ? "VS"
                      : `${selectedMatch.homeGoals} - ${selectedMatch.awayGoals}`}
                  </div>

                  <span className="match-modal-score-label">
                    {selectedMatch.homeGoals === null ||
                    selectedMatch.awayGoals === null
                      ? "Nog niet gespeeld"
                      : "Eindstand"}
                  </span>
                </div>

                <div className="match-modal-club">
                  <img
                    src={teamLogos[selectedMatch.away]}
                    alt={`${selectedMatch.away} logo`}
                    className="match-modal-team-logo"
                  />
                  <h3>{selectedMatch.away}</h3>
                  <span>Uit</span>
                </div>
              </div>

              <div className="match-modal-date">
                <span>{formatMatchDate(selectedMatch.date, language)}</span>
                <span>Speelronde {selectedMatch.matchday}</span>
              </div>
            </div>

            <nav className="match-modal-tabs" aria-label="Wedstrijdonderdelen">
              <button
                type="button"
                className={activeMatchTab === "overview" ? "active" : ""}
                onClick={() => setActiveMatchTab("overview")}
              >
                Overzicht
              </button>

              <button
                type="button"
                className={activeMatchTab === "lineups" ? "active" : ""}
                onClick={() => setActiveMatchTab("lineups")}
              >
                Opstellingen
              </button>

              <button
                type="button"
                className={activeMatchTab === "stats" ? "active" : ""}
                onClick={() => setActiveMatchTab("stats")}
              >
                Statistieken
              </button>
            </nav>

            <div className="match-modal-tab-content">
              {activeMatchTab === "overview" && (
                <>
                  <div className="match-modal-section">
                    <h3>Recente vorm</h3>

                    <div className="match-form-grid">
                      {[selectedMatch.home, selectedMatch.away].map((club) => {
                        const form = getClubForm(
                          matches,
                          club,
                          selectedMatch.date,
                        );

                        return (
                          <div className="match-form-team" key={club}>
                            <h4>{club}</h4>

                            {form.length === 0 ? (
                              <p>Geen eerdere wedstrijden beschikbaar.</p>
                            ) : (
                              <div className="match-form-results">
                                {form.map((item) => (
                                  <div
                                    className={`match-form-result result-${item.result.toLowerCase()}`}
                                    key={item.id}
                                    title={`${item.home} ${item.homeGoals} - ${item.awayGoals} ${item.away}`}
                                  >
                                    {item.result}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="match-modal-section">
                    <h3>Onderlinge resultaten</h3>

                    {(() => {
                      const previousMatches = getHeadToHead(
                        matches,
                        selectedMatch,
                      );

                      if (previousMatches.length === 0) {
                        return (
                          <p>Geen eerdere onderlinge wedstrijden gevonden.</p>
                        );
                      }

                      return (
                        <div className="match-head-to-head">
                          {previousMatches.map((previousMatch) => (
                            <div
                              className="match-head-to-head-row"
                              key={previousMatch.id}
                            >
                              <span>
                                {formatMatchDate(previousMatch.date, language)}
                              </span>

                              <strong>
                                {previousMatch.home} {previousMatch.homeGoals} -{" "}
                                {previousMatch.awayGoals} {previousMatch.away}
                              </strong>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </>
              )}

              {activeMatchTab === "lineups" &&
                (() => {
                  const homeLineup = parseLineup(selectedMatch.homeLineup);
                  const awayLineup = parseLineup(selectedMatch.awayLineup);
                  const selectedLineup =
                    selectedLineupTeam === "home" ? homeLineup : awayLineup;

                  const selectedClub =
                    selectedLineupTeam === "home"
                      ? selectedMatch.home
                      : selectedMatch.away;
                  if (!homeLineup || !awayLineup) {
                    return (
                      <div className="match-modal-section">
                        <h3>Opstellingen</h3>
                        <p>Opstellingen nog niet bekend.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="match-modal-section">
                      <h3>Opstellingen</h3>
                      <div className="lineup-team-selector">
                        <button
                          type="button"
                          className={
                            selectedLineupTeam === "home" ? "active" : ""
                          }
                          onClick={() => setSelectedLineupTeam("home")}
                        >
                          <img
                            src={teamLogos[selectedMatch.home]}
                            alt={selectedMatch.home}
                          />
                          <span>{selectedMatch.home}</span>
                        </button>

                        <button
                          type="button"
                          className={
                            selectedLineupTeam === "away" ? "active" : ""
                          }
                          onClick={() => setSelectedLineupTeam("away")}
                        >
                          <img
                            src={teamLogos[selectedMatch.away]}
                            alt={selectedMatch.away}
                          />
                          <span>{selectedMatch.away}</span>
                        </button>
                      </div>
                      <div className="match-lineups">
                        {selectedLineup && (
                          <div className="match-lineup-team">
                            <h4>{selectedClub}</h4>
                            <p>Formatie: {selectedLineup.formation}</p>

                            <h5>Basiself</h5>

                            <div className="lineup-pitch">
                              <div className="pitch-line pitch-center-line" />
                              <div className="pitch-center-circle" />
                              <div className="pitch-center-dot" />

                              <div className="pitch-penalty-area pitch-penalty-top" />
                              <div className="pitch-penalty-area pitch-penalty-bottom" />

                              {(selectedLineup.starting_xi ?? []).map(
                                (player) => (
                                  <div
                                    key={player.player_id}
                                    className={`lineup-player lineup-player-${player.formation_place}`}
                                  >
                                    <span className="lineup-player-number">
                                      {player.jersey ?? "-"}
                                    </span>

                                    <span className="lineup-player-name">
                                      {player.name}
                                    </span>

                                    <span className="lineup-player-position">
                                      {player.position ?? "Onbekend"}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>

                            <div className="lineup-substitutes">
                              <div className="lineup-substitute-section">
                                <h5>Ingevallen wissels</h5>

                                {(selectedLineup.substitutes_used ?? []).map(
                                  (player) => {
                                    const replacedPlayer = (
                                      selectedLineup.starting_xi ?? []
                                    ).find(
                                      (starter) =>
                                        starter.minute_off != null &&
                                        starter.minute_off === player.minute_on,
                                    );

                                    return (
                                      <div
                                        className="lineup-substitute-player"
                                        key={player.player_id}
                                      >
                                        <span className="substitute-number">
                                          {player.jersey ?? "-"}
                                        </span>

                                        <div className="substitute-details">
                                          <span className="substitute-name">
                                            {player.name}
                                          </span>
                                          <span className="substitute-replaced">
                                            {replacedPlayer
                                              ? `Voor ${replacedPlayer.name}`
                                              : "Vervangen speler onbekend"}
                                          </span>
                                        </div>

                                        <span className="substitute-minute">
                                          {player.minute_on != null
                                            ? `${player.minute_on}'`
                                            : ""}
                                        </span>
                                      </div>
                                    );
                                  },
                                )}
                              </div>

                              <div className="lineup-substitute-section">
                                <h5>Ongebruikte wissels</h5>

                                {(selectedLineup.unused_substitutes ?? []).map(
                                  (player) => (
                                    <div
                                      className="lineup-substitute-player"
                                      key={player.player_id}
                                    >
                                      <span className="substitute-number">
                                        {player.jersey ?? "-"}
                                      </span>
                                      <span className="substitute-name">
                                        {player.name}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {activeMatchTab === "stats" && (
                <div className="match-modal-section">
                  <h3>Wedstrijdstatistieken</h3>
                  <p>
                    Hier komen onder andere balbezit, schoten, hoekschoppen en
                    overtredingen.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default MatchesPage;
