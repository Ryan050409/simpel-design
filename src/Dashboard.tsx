import type { Player, Match } from "./types.ts";

type DashboardProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
};

function Dashboard({ matches, playerList, team }: DashboardProps) {
  const playedMatches = matches.filter(
    (match) => match.home === team || match.away === team,
  );

  const getTeamGoals = (match: Match) =>
    match.home === team ? match.homeGoals : match.awayGoals;

  const getOpponentGoals = (match: Match) =>
    match.home === team ? match.awayGoals : match.homeGoals;

  const wins = playedMatches.filter(
    (match) => getTeamGoals(match) > getOpponentGoals(match),
  ).length;

  const draws = playedMatches.filter(
    (match) => getTeamGoals(match) === getOpponentGoals(match),
  ).length;

  const losses = playedMatches.filter(
    (match) => getTeamGoals(match) < getOpponentGoals(match),
  ).length;

  const points = wins * 3 + draws;

  const goalsFor = playedMatches.reduce(
    (total, match) => total + getTeamGoals(match),
    0,
  );

  const goalsAgainst = playedMatches.reduce(
    (total, match) => total + getOpponentGoals(match),
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

  const scorers = teamPlayers.filter((player) => player.goals > 0);
  const topGoals = Math.max(0, ...scorers.map((player) => player.goals));
  const topScorers =
    topGoals > 0 ? scorers.filter((player) => player.goals === topGoals) : [];

  const assistLeaders = teamPlayers.filter((player) => player.assists > 0);
  const topAssists = Math.max(
    0,
    ...assistLeaders.map((player) => player.assists),
  );
  const topAssistPlayers =
    topAssists > 0
      ? assistLeaders.filter((player) => player.assists === topAssists)
      : [];

  const ratedPlayers = teamPlayers.filter((player) => player.rating > 0);
  const highestRating = Math.max(
    0,
    ...ratedPlayers.map((player) => player.rating),
  );
  const highestRatedPlayers =
    highestRating > 0
      ? ratedPlayers.filter((player) => player.rating === highestRating)
      : [];

  const maxGoals = Math.max(goalsFor, goalsAgainst, 1);

  const statCards = [
    {
      label: "Wedstrijden",
      value: playedMatches.length,
      icon: "⚽",
      detail: "Gespeeld",
      style: "matches",
    },
    {
      label: "Gewonnen",
      value: wins,
      icon: "✓",
      detail: "Overwinningen",
      style: "wins",
    },
    {
      label: "Gelijk",
      value: draws,
      icon: "＝",
      detail: "Gelijkspel",
      style: "draws",
    },
    {
      label: "Verloren",
      value: losses,
      icon: "↘",
      detail: "Nederlagen",
      style: "losses",
    },
    {
      label: "Punten",
      value: points,
      icon: "🏆",
      detail: "3 punten per winst",
      style: "points",
    },
    {
      label: "Doelsaldo",
      value: `${goalDifference > 0 ? "+" : ""}${goalDifference}`,
      icon: "📊",
      detail: "Goals voor − tegen",
      style: "difference",
    },
    {
      label: "Winstpercentage",
      value: `${winPercentage}%`,
      icon: "🎯",
      detail: "Gewonnen wedstrijden",
      style: "percentage",
    },
    {
      label: "Gem. goals",
      value: averageGoals,
      icon: "🥅",
      detail: "Per wedstrijd",
      style: "average",
    },
  ];

  return (
    <main className="dashboard">
      <header className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="dashboard-eyebrow">SEIZOENSOVERZICHT</span>
          <h1>Dashboard</h1>
          <p>
            Bekijk de prestaties en statistieken van <strong>{team}</strong>.
          </p>
        </div>

        <div className="dashboard-team-badge">
          <span aria-hidden="true">⚽</span>
          <div>
            <small>Geselecteerde club</small>
            <strong>{team}</strong>
          </div>
        </div>
      </header>

      <section className="dashboard-section" aria-labelledby="overview-heading">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">IN ÉÉN OOGOPSLAG</span>
            <h2 id="overview-heading">Wedstrijdresultaten</h2>
          </div>
          <span className="dashboard-section-count">
            {playedMatches.length}{" "}
            {playedMatches.length === 1 ? "wedstrijd" : "wedstrijden"}
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
          <p className="dashboard-empty-note">
            Er zijn nog geen wedstrijden voor {team}. De statistieken worden
            bijgewerkt zodra er wedstrijden beschikbaar zijn.
          </p>
        )}
      </section>

      <section
        className="dashboard-panel"
        aria-labelledby="team-analysis-heading"
      >
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">PRESTATIES</span>
            <h2 id="team-analysis-heading">Teamanalyse</h2>
            <p>De aanvallende en verdedigende prestaties van {team}.</p>
          </div>
          <span className="dashboard-panel-icon" aria-hidden="true">
            ⚽
          </span>
        </div>

        <div className="team-stats-overview">
          <article className="team-stat-block goals-for">
            <span>DOELPUNTEN VOOR</span>
            <strong>{goalsFor}</strong>
            <small>Gescoord</small>
          </article>

          <article className="team-stat-block goals-against">
            <span>DOELPUNTEN TEGEN</span>
            <strong>{goalsAgainst}</strong>
            <small>Tegendoelpunten</small>
          </article>

          <article className="team-stat-block goal-difference">
            <span>DOELSALDO</span>
            <strong>
              {goalDifference > 0 ? "+" : ""}
              {goalDifference}
            </strong>
            <small>
              {goalDifference > 0
                ? "Positief doelsaldo"
                : goalDifference < 0
                  ? "Negatief doelsaldo"
                  : "Neutraal doelsaldo"}
            </small>
          </article>
        </div>

        <div className="goals-comparison">
          <div className="goals-comparison-heading">
            <h3>Doelpunten vergelijken</h3>
            <span>
              {playedMatches.length}{" "}
              {playedMatches.length === 1 ? "wedstrijd" : "wedstrijden"}
            </span>
          </div>

          <div className="goals-comparison-item">
            <div className="goals-comparison-label">
              <span>Gescoord</span>
              <strong>{goalsFor}</strong>
            </div>
            <div
              className="goals-bar"
              role="img"
              aria-label={`${goalsFor} doelpunten voor`}
            >
              <div
                className="goals-bar-for"
                style={{
                  width: `${(goalsFor / maxGoals) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="goals-comparison-item">
            <div className="goals-comparison-label">
              <span>Tegendoelpunten</span>
              <strong>{goalsAgainst}</strong>
            </div>
            <div
              className="goals-bar"
              role="img"
              aria-label={`${goalsAgainst} doelpunten tegen`}
            >
              <div
                className="goals-bar-against"
                style={{
                  width: `${(goalsAgainst / maxGoals) * 100}%`,
                }}
              />
            </div>
          </div>

          {playedMatches.length === 0 && (
            <p className="dashboard-empty-note">
              Er zijn nog geen gegevens om te vergelijken.
            </p>
          )}
        </div>
      </section>

      <section className="dashboard-panel" aria-labelledby="players-heading">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">UITBLINKERS</span>
            <h2 id="players-heading">Spelers in de spotlight</h2>
            <p>
              De opvallendste spelers van {team}, op basis van de geregistreerde
              statistieken.
            </p>
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
              <span className="dashboard-player-label">TOPSCORER</span>
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
                    {topGoals} {topGoals === 1 ? "doelpunt" : "doelpunten"}
                    {topScorers.length > 1 ? " · gedeeld" : ""}
                  </p>
                </>
              ) : (
                <p>Nog geen uitblinker</p>
              )}
            </article>

            <article className="dashboard-player-card player-assists">
              <span className="dashboard-player-icon" aria-hidden="true">
                🎯
              </span>
              <span className="dashboard-player-label">MEESTE ASSISTS</span>
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
                    {topAssists} {topAssists === 1 ? "assist" : "assists"}
                    {topAssistPlayers.length > 1 ? " · gedeeld" : ""}
                  </p>
                </>
              ) : (
                <p>Nog geen uitblinker</p>
              )}
            </article>

            <article className="dashboard-player-card dashboard-player-rating">
              <span className="dashboard-player-icon" aria-hidden="true">
                ⭐
              </span>
              <span className="dashboard-player-label">HOOGSTE RATING</span>
              {highestRatedPlayers.length > 0 ? (
                <>
                  {highestRatedPlayers.map((player) => (
                    <p key={player.id}>
                      <strong>
                        {player.firstname} {player.lastname}
                      </strong>
                    </p>
                  ))}
                  <p>
                    Rating: <strong>{highestRating}</strong>
                    {highestRatedPlayers.length > 1 ? " · gedeeld" : ""}
                  </p>
                </>
              ) : (
                <p>Nog geen uitblinker</p>
              )}
            </article>
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <span aria-hidden="true">👥</span>
            <h3>Nog geen spelers beschikbaar</h3>
            <p>Er zijn nog geen spelers geregistreerd voor {team}.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
