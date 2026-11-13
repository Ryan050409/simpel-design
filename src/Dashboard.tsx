import type { Player, Match } from "./types.ts";
import { translations, type Language } from "./translations.ts";
const formatMatchDate = (date: string) => 
  new Intl.DateTimeFormat("nl-NL", { 
    day: "numeric", 
    month: "long",
    year: "numeric",
    hour: "2-digit", 
    minute: "2-digit",
  }).format(new Date(date))

type DashboardProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
  language: Language;
};

function Dashboard({ matches, playerList, team, language }: DashboardProps) {
  const t = translations[language];

  // Alle wedstrijden van het favoriete team
  const teamMatches = matches.filter(
    (match) => match.home === team || match.away === team,
  );

  // Alleen wedstrijden met een volledige uitslag
  const playedMatches = teamMatches.filter(
    (match) =>
      typeof match.homeGoals === "number" &&
      typeof match.awayGoals === "number",
  );

  // Alleen wedstrijden zonder uitslag
  const upcomingMatches = teamMatches
    .filter((match) => match.homeGoals === null && match.awayGoals === null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTeamGoals = (match: Match) =>
    match.home === team ? match.homeGoals : match.awayGoals;

  const getOpponentGoals = (match: Match) =>
    match.home === team ? match.awayGoals : match.homeGoals;

  const wins = playedMatches.filter(
    (match) => getTeamGoals(match)! > getOpponentGoals(match)!,
  ).length;

  const draws = playedMatches.filter(
    (match) => getTeamGoals(match) === getOpponentGoals(match),
  ).length;

  const losses = playedMatches.filter(
    (match) => getTeamGoals(match)! < getOpponentGoals(match)!,
  ).length;

  const points = wins * 3 + draws;

  const goalsFor = playedMatches.reduce(
    (total, match) => total + getTeamGoals(match)!,
    0,
  );

  const goalsAgainst = playedMatches.reduce(
    (total, match) => total + getOpponentGoals(match)!,
    0,
  );

  const goalDifference = goalsFor - goalsAgainst;

  const winPercentage =
    playedMatches.length > 0
      ? Math.round((wins / playedMatches.length) * 100)
      : 0;

  const averageGoals =
    playedMatches.length > 0
      ? (goalsFor / playedMatches.length).toFixed(2)
      : "0.00";

  const teamPlayers = playerList.filter((player) => player.team === team);

  const scorers = teamPlayers.filter((player) => (player.goals ?? 0) > 0);
  const topGoals = Math.max(0, ...scorers.map((player) => player.goals ?? 0));
  const topScorers =
    topGoals > 0 ? scorers.filter((player) => player.goals === topGoals) : [];

  const assistLeaders = teamPlayers.filter(
    (player) => (player.assists ?? 0) > 0,
  );
  const topAssists = Math.max(
    0,
    ...assistLeaders.map((player) => player.assists ?? 0),
  );
  const topAssistPlayers =
    topAssists > 0
      ? assistLeaders.filter((player) => player.assists === topAssists)
      : [];

  const maxGoals = Math.max(goalsFor, goalsAgainst, 1);

  const statCards = [
    {
      label: t.matches,
      value: playedMatches.length,
      icon: "⚽",
      detail: t.played,
      style: "matches",
    },
    {
      label: t.wins,
      value: wins,
      icon: "✓",
      detail: t.wins,
      style: "wins",
    },
    {
      label: t.draw,
      value: draws,
      icon: "＝",
      detail: t.draw,
      style: "draws",
    },
    {
      label: t.lost,
      value: losses,
      icon: "↘",
      detail: t.lost,
      style: "losses",
    },
    {
      label: t.points,
      value: points,
      icon: "🏆",
      detail: t.pointsPerWin,
      style: "points",
    },
    {
      label: t.goalDifference,
      value: `${goalDifference > 0 ? "+" : ""}${goalDifference}`,
      icon: "📊",
      detail: t.goalsForAgainst,
      style: "difference",
    },
    {
      label: t.winPercentage,
      value: `${winPercentage}%`,
      icon: "🎯",
      detail: t.wonMatches,
      style: "percentage",
    },
    {
      label: t.averageGoals,
      value: averageGoals,
      icon: "🥅",
      detail: t.perMatch,
      style: "average",
    },
  ];

  const matchWord =
    playedMatches.length === 1
      ? t.dashboardMatchSingular
      : t.dashboardMatchPlural;
  const noMatchesMessage = `${t.noMatchesForTeam} ${team}. ${t.noMatchesAvailable}`;
  const teamDescription = `${t.teamPerformance} ${team}.`;

  return (
    <main className="dashboard">
      <header className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-eyebrow">{t.seasonOverview}</span>
          <h1>{t.dashboardTitle}</h1>
          <p>
            {t.dashboardTeamIntro} <strong>{team}</strong>.
          </p>
        </div>

        <div className="dashboard-team-badge">
          <span aria-hidden="true">⚽</span>
          <div>
            <small>{t.selectedClub}</small>
            <strong>{team}</strong>
          </div>
        </div>
      </header>

      <section className="dashboard-section" aria-labelledby="overview-heading">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">{t.atAGlance}</span>
            <h2 id="overview-heading">{t.matchResults}</h2>
          </div>
          <span className="dashboard-section-count">
            {playedMatches.length} {matchWord}
          </span>
        </div>

        <div className="stats-grid dashboard-stats-grid">
          {statCards.map((stat) => (
            <article
              className={`stat-card dashboard-stat-card stat-${stat.style}`}
              key={stat.style}
            >
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon" aria-hidden="true">
                  {stat.icon}
                </span>
                <span className="dashboard-stat-label">{stat.label}</span>
              </div>

              <p className="dashboard-stat-value">{stat.value}</p>
              <span className="dashboard-stat-detail">{stat.detail}</span>
            </article>
          ))}
        </div>

        {playedMatches.length === 0 && (
          <p className="dashboard-empty-note">{noMatchesMessage}</p>
        )}
      </section>

<section className="dashboard-panel" aria-labelledby="upcoming-matches-heading">
  <div className="dashboard-section-heading">
    <div>
      <span className="dashboard-eyebrow">📅 Aankomend</span>
      <h2 id="upcoming-matches-heading">Volgende wedstrijden</h2>
    </div>
    <span className="dashboard-section-count">
      {upcomingMatches.length}
    </span>
  </div>

  {upcomingMatches.length > 0 ? (
    <div className="home-page-match-list">
      {upcomingMatches.slice(0, 5).map((match) => (
        <div className="home-page-match" key={match.id}>
          <div className="home-page-match-teams">
            <strong>{match.home}</strong>
            <strong className="home-page-match-score">vs</strong>
            <strong>{match.away}</strong>
          </div>

          <span className="home-page-match-date">
            {formatMatchDate(match.date)}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="dashboard-empty-note">
      Geen aankomende wedstrijden.
    </p>
  )}
</section>

      <section
        className="dashboard-panel"
        aria-labelledby="team-analysis-heading"
      >
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">{t.performances}</span>
            <h2 id="team-analysis-heading">{t.teamAnalysis}</h2>
            <p>{teamDescription}</p>
          </div>
          <span className="dashboard-panel-icon" aria-hidden="true">
            ⚽
          </span>
        </div>

        <div className="team-stats-overview">
          <article className="team-stat-block goals-for">
            <span>{t.goalsFor}</span>
            <strong>{goalsFor}</strong>
            <small>{t.scored}</small>
          </article>

          <article className="team-stat-block goals-against">
            <span>{t.goalsAgainst}</span>
            <strong>{goalsAgainst}</strong>
            <small>{t.conceded}</small>
          </article>

          <article className="team-stat-block goal-difference">
            <span>{t.goalDifference.toUpperCase()}</span>
            <strong>
              {goalDifference > 0 ? "+" : ""}
              {goalDifference}
            </strong>
            <small>
              {goalDifference > 0
                ? t.positiveDifference
                : goalDifference < 0
                  ? t.negativeDifference
                  : t.neutralDifference}
            </small>
          </article>
        </div>

        <div className="goals-comparison">
          <div className="goals-comparison-heading">
            <h3>{t.compareGoals}</h3>
            <span>
              {playedMatches.length} {matchWord}
            </span>
          </div>

          <div className="goals-comparison-item">
            <div className="goals-comparison-label">
              <span>{t.scored}</span>
              <strong>{goalsFor}</strong>
            </div>
            <div
              className="goals-bar"
              role="img"
              aria-label={`${goalsFor} ${t.dashboardScoredGoalsAriaLabel}`}
            >
              <div
                className="goals-bar-for"
                style={{ width: `${(goalsFor / maxGoals) * 100}%` }}
              />
            </div>
          </div>

          <div className="goals-comparison-item">
            <div className="goals-comparison-label">
              <span>{t.conceded}</span>
              <strong>{goalsAgainst}</strong>
            </div>
            <div
              className="goals-bar"
              role="img"
              aria-label={`${goalsAgainst} ${t.dashboardConcededGoalsAriaLabel}`}
            >
              <div
                className="goals-bar-against"
                style={{ width: `${(goalsAgainst / maxGoals) * 100}%` }}
              />
            </div>
          </div>

          {playedMatches.length === 0 && (
            <p className="dashboard-empty-note">{t.noComparison}</p>
          )}
        </div>
      </section>

      <section className="dashboard-panel" aria-labelledby="players-heading">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">{t.highlights}</span>
            <h2 id="players-heading">{t.playersSpotlight}</h2>
            <p>{t.dashboardPlayersDescription}</p>
          </div>
          <span className="dashboard-panel-icon" aria-hidden="true">
            🏅
          </span>
        </div>

        {teamPlayers.length > 0 ? (
          <div className="dashboard-player-grid">
            <article className="dashboard-player-card player-scorer">
              <span className="dashboard-player-icon" aria-hidden="true">
                ⚽
              </span>
              <span className="dashboard-player-label">{t.topScorer}</span>
              {topScorers.length > 0 ? (
                <>
                  {topScorers.map((player) => (
                    <p key={player.id}>
                      <strong>
                        {player.firstname} {player.lastname}
                      </strong>
                    </p>
                  ))}
                  <p>
                    {topGoals} {topGoals === 1 ? t.goal : t.goals}
                    {topScorers.length > 1 ? t.shared : ""}
                  </p>
                </>
              ) : (
                <p>{t.noStandout}</p>
              )}
            </article>

            <article className="dashboard-player-card player-assists">
              <span className="dashboard-player-icon" aria-hidden="true">
                🎯
              </span>
              <span className="dashboard-player-label">{t.mostAssists}</span>
              {topAssistPlayers.length > 0 ? (
                <>
                  {topAssistPlayers.map((player) => (
                    <p key={player.id}>
                      <strong>
                        {player.firstname} {player.lastname}
                      </strong>
                    </p>
                  ))}
                  <p>
                    {topAssists} {topAssists === 1 ? t.assist : t.assists}
                    {topAssistPlayers.length > 1 ? t.shared : ""}
                  </p>
                </>
              ) : (
                <p>{t.noStandout}</p>
              )}
            </article>
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <span aria-hidden="true">👥</span>
            <h3>{t.noPlayersAvailable}</h3>
            <p>
              {t.noRegisteredPlayers} {team}.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
