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

  const topScorer =
    teamPlayers.length > 0
      ? [...teamPlayers].sort((a, b) => b.goals - a.goals)[0]
      : null;

  const topAssistPlayer =
    teamPlayers.length > 0
      ? [...teamPlayers].sort((a, b) => b.assists - a.assists)[0]
      : null;

  const highestRatedPlayer =
    teamPlayers.length > 0
      ? [...teamPlayers].sort((a, b) => b.rating - a.rating)[0]
      : null;

  return (
    <div className="dashboard">
      <div className="dashboard-page-header">
        <div>
          <h1>📊 Statistieken</h1>
          <p>Bekijk de uitgebreide statistieken van {team}.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Wedstrijden</h3>
          <p>{playedMatches.length}</p>
        </div>

        <div className="stat-card">
          <h3>Gewonnen</h3>
          <p>{wins}</p>
        </div>

        <div className="stat-card">
          <h3>Gelijk</h3>
          <p>{draws}</p>
        </div>

        <div className="stat-card">
          <h3>Verloren</h3>
          <p>{losses}</p>
        </div>

        <div className="stat-card">
          <h3>Punten</h3>
          <p>{points}</p>
        </div>

        <div className="stat-card">
          <h3>Doelsaldo</h3>
          <p>
            {goalDifference > 0 ? "+" : ""}
            {goalDifference}
          </p>
        </div>

        <div className="stat-card">
          <h3>Winstpercentage</h3>
          <p>{winPercentage}%</p>
        </div>

        <div className="stat-card">
          <h3>Gem. goals</h3>
          <p>{averageGoals}</p>
        </div>
      </div>

      
<div className="dashboard-extra">
  <div className="team-stats-heading">
    <div>
      <span className="team-stats-eyebrow">TEAMANALYSE</span>
      <h2>Teamstatistieken</h2>
      <p>De aanvallende en verdedigende prestaties van {team}.</p>
    </div>
    <span className="team-stats-ball">⚽</span>
  </div>

  <div className="team-stats-overview">
    <div className="team-stat-block goals-for">
      <span>DOELPUNTEN VOOR</span>
      <strong>{goalsFor}</strong>
      <small>Gescoord</small>
    </div>

    <div className="team-stat-block goals-against">
      <span>DOELPUNTEN TEGEN</span>
      <strong>{goalsAgainst}</strong>
      <small>Tegendoelpunten</small>
    </div>

    <div className="team-stat-block goal-difference">
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
    </div>
  </div>

  <div className="goals-comparison">
    <div className="goals-comparison-label">
      <span>Gescoord</span>
      <strong>{goalsFor}</strong>
    </div>

    <div className="goals-bar">
      <div
        className="goals-bar-for"
        style={{
          width: `${(goalsFor / Math.max(goalsFor, goalsAgainst, 1)) * 100}%`,
        }}
      />
    </div>

    <div className="goals-comparison-label">
      <span>Tegendoelpunten</span>
      <strong>{goalsAgainst}</strong>
    </div>

    <div className="goals-bar">
      <div
        className="goals-bar-against"
        style={{
          width: `${(goalsAgainst / Math.max(goalsFor, goalsAgainst, 1)) * 100}%`,
        }}
      />
    </div>
  </div>
</div>

      <div className="dashboard-extra">
        <h2>Spelersstatistieken</h2>

        {teamPlayers.length > 0 ? (
          <>
            <p>
              <strong>🥇 Topscorer:</strong>{" "}
              {topScorer
                ? `${topScorer.firstname} ${topScorer.lastname} (${topScorer.goals} goals)`
                : "Nog geen gegevens"}
            </p>

            <p>
              <strong>🎯 Meeste assists:</strong>{" "}
              {topAssistPlayer
                ? `${topAssistPlayer.firstname} ${topAssistPlayer.lastname} (${topAssistPlayer.assists} assists)`
                : "Nog geen gegevens"}
            </p>

            <p>
              <strong>⭐ Hoogste rating:</strong>{" "}
              {highestRatedPlayer
                ? `${highestRatedPlayer.firstname} ${highestRatedPlayer.lastname} (${highestRatedPlayer.rating})`
                : "Nog geen gegevens"}
            </p>
          </>
        ) : (
          <p>Er zijn nog geen spelers voor {team}.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
