
import { Link, useParams } from "react-router-dom";
import type { Match, Team } from "./types";
import { translations, type Language } from "./translations";

type ClubDetailPageProps = {
  teams: Team[];
  matches: Match[];
  favoriteTeam: string;
  onSetFavorite: (teamName: string) => void;
  language: Language;
};

function ClubDetailPage({
  teams,
  matches,
  favoriteTeam,
  onSetFavorite,
  language,
}: ClubDetailPageProps) {
  const t = translations[language];
  const { clubId } = useParams<{ clubId: string }>();

  const club = teams.find((item) => String(item.id) === clubId);

  const localeByLanguage: Record<Language, string> = {
    nl: "nl-NL",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
    sp: "es-ES",
    pt: "pt-PT",
  };

  if (!club) {
    return (
      <main className="club-detail-page">
        <h1>{t.clubNotFound}</h1>
        <p>{t.clubUnavailable}</p>
        <Link to="/competitie/clubs">← {t.backToClubs}</Link>
      </main>
    );
  }

  const clubMatches = matches.filter(
    (match) => match.home === club.name || match.away === club.name,
  );

  // Een wedstrijd telt als gespeeld wanneer beide scores geldig zijn.
  const playedMatches = clubMatches.filter(
    (match) =>
      match.homeGoals !== undefined &&
      match.awayGoals !== undefined &&
      Number.isFinite(Number(match.homeGoals)) &&
      Number.isFinite(Number(match.awayGoals)),
  );

  const wins = playedMatches.filter((match) => {
    if (match.home === club.name) {
      return match.homeGoals > match.awayGoals;
    }

    return match.awayGoals > match.homeGoals;
  }).length;

  const draws = playedMatches.filter(
    (match) => match.homeGoals === match.awayGoals,
  ).length;

  const losses = playedMatches.length - wins - draws;

  const goalsFor = playedMatches.reduce(
    (total, match) =>
      total +
      Number(
        match.home === club.name ? match.homeGoals : match.awayGoals,
      ),
    0,
  );

  const goalsAgainst = playedMatches.reduce(
    (total, match) =>
      total +
      Number(
        match.home === club.name ? match.awayGoals : match.homeGoals,
      ),
    0,
  );

  const points = wins * 3 + draws;
  const isFavorite = favoriteTeam === club.name;

  return (
    <main className="club-detail-page">
      <Link className="club-detail-back" to="/competitie/clubs">
        ← {t.backToClubs}
      </Link>

      <header className="club-detail-header">
        <div className="club-detail-logo" aria-hidden="true">
          {club.name.slice(0, 3).toUpperCase()}
        </div>

        <div className="club-detail-title">
          <p className="club-detail-eyebrow">{t.clubProfile}</p>
          <h1>{club.name}</h1>
          <p>{t.clubDetailDescription}</p>
        </div>

        <button
          type="button"
          className={`club-detail-favorite ${
            isFavorite ? "is-favorite" : ""
          }`}
          aria-pressed={isFavorite}
          onClick={() => onSetFavorite(club.name)}
        >
          {isFavorite ? `★ ${t.favoriteClub}` : `☆ ${t.makeFavoriteClub}`}
        </button>
      </header>

      <section className="club-detail-section">
        <h2>{t.clubMatchStatistics}</h2>

        <div className="club-stats-grid">
          <article className="club-stat-card">
            <span>{t.played}</span>
            <strong>{playedMatches.length}</strong>
          </article>

          <article className="club-stat-card">
            <span>{t.wins}</span>
            <strong>{wins}</strong>
          </article>

          <article className="club-stat-card">
            <span>{t.drawResult}</span>
            <strong>{draws}</strong>
          </article>

          <article className="club-stat-card">
            <span>{t.losses}</span>
            <strong>{losses}</strong>
          </article>

          <article className="club-stat-card">
            <span>{t.points}</span>
            <strong>{points}</strong>
          </article>

          <article className="club-stat-card">
            <span>{t.goalDifference}</span>
            <strong>{goalsFor - goalsAgainst}</strong>
          </article>
        </div>
      </section>

      <section className="club-detail-section">
        <h2>{t.goals}</h2>

        <div className="club-stats-grid">
          <article className="club-stat-card">
            <span>{t.goalsFor}</span>
            <strong>{goalsFor}</strong>
          </article>

          <article className="club-stat-card">
            <span>{t.goalsAgainst}</span>
            <strong>{goalsAgainst}</strong>
          </article>
        </div>
      </section>

      <section className="club-detail-section">
        <h2>{t.matchesForClub} {club.name}</h2>

        {clubMatches.length === 0 ? (
          <p className="club-detail-empty">
            {t.noMatchesForClub}
          </p>
        ) : (
          <div className="club-matches-list">
            {clubMatches.map((match) => {
              const hasScore =
                match.homeGoals !== undefined &&
                match.awayGoals !== undefined &&
                Number.isFinite(Number(match.homeGoals)) &&
                Number.isFinite(Number(match.awayGoals));

              return (
                <article className="club-match-row" key={match.id}>
                  <div className="club-match-teams">
                    <span>{match.home}</span>

                    <strong>
                      {hasScore
                        ? `${match.homeGoals} - ${match.awayGoals}`
                        : t.versusLabel}
                    </strong>

                    <span>{match.away}</span>
                  </div>

                  <time
                    dateTime={match.date || undefined}
                  >
                    {match.date
                      ? new Date(match.date).toLocaleDateString(
                          localeByLanguage[language],
                        )
                      : t.unknownDate}
                  </time>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default ClubDetailPage;
