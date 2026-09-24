import type { Player } from "./App";

type Match = {
  id: number;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  date: string;
};

type DashboardProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
};

function Dashboard({
  matches,
  playerList,
  team
}: DashboardProps) {
  const playedMatches = matches.filter(
    (match) =>
      match.home === team || match.away === team
  );

  const wins = playedMatches.filter((match) => {
    const teamGoals =
      match.home === team
        ? match.homeGoals
        : match.awayGoals;

    const opponentGoals =
      match.home === team
        ? match.awayGoals
        : match.homeGoals;

    return teamGoals > opponentGoals;
  }).length;

  const draws = playedMatches.filter((match) => {
    return match.homeGoals === match.awayGoals;
  }).length;

  const losses = playedMatches.filter((match) => {
    const teamGoals =
      match.home === team
        ? match.homeGoals
        : match.awayGoals;

    const opponentGoals =
      match.home === team
        ? match.awayGoals
        : match.homeGoals;

    return teamGoals < opponentGoals;
  }).length;

  const points = wins * 3 + draws;

  const goalsFor = playedMatches.reduce(
    (total, match) =>
      total +
      (match.home === team
        ? match.homeGoals
        : match.awayGoals),
    0
  );

  const goalsAgainst = playedMatches.reduce(
    (total, match) =>
      total +
      (match.home === team
        ? match.awayGoals
        : match.homeGoals),
    0
  );

  const goalDifference = goalsFor - goalsAgainst;

  const winPercentage =
    playedMatches.length > 0
      ? Math.round(
          (wins / playedMatches.length) * 100
        )
      : 0;

  const averageGoals =
    playedMatches.length > 0
      ? (goalsFor / playedMatches.length).toFixed(2)
      : "0.00";

  const topScorer =
    playerList.length > 0
      ? [...playerList].sort(
          (a, b) => b.goals - a.goals
        )[0]
      : null;

  return (
    <div className="dashboard">
      <h1>⚽ Dashboard</h1>

      <h2>{team}</h2>

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
          <p>{goalDifference}</p>
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
        <h2>Extra statistieken</h2>

        <p>
          <strong>Goals voor:</strong>{" "}
          {goalsFor}
        </p>

        <p>
          <strong>Goals tegen:</strong>{" "}
          {goalsAgainst}
        </p>

        <p>
          <strong>Topscorer:</strong>{" "}
          {topScorer
            ? `${topScorer.name} (${topScorer.goals} goals)`
            : "Nog geen spelers"}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;