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

  const lastFiveMatches = [...playedMatches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const lastFiveData = lastFiveMatches.map((match) => {
    const teamGoals = getTeamGoals(match);

    const opponentGoals = getOpponentGoals(match);

    let result: "W" | "G" | "V";

    if (teamGoals > opponentGoals) {
      result = "W";
    } else if (teamGoals === opponentGoals) {
      result = "G";
    } else {
      result = "V";
    }

    return {
      match,
      opponent: match.home === team ? match.away : match.home,
      teamGoals,
      opponentGoals,
      result,
      goalDifference: teamGoals - opponentGoals,
    };
  });

  const lastFiveWins = lastFiveData.filter(
    (item) => item.result === "W",
  ).length;

  const lastFiveDraws = lastFiveData.filter(
    (item) => item.result === "G",
  ).length;

  const lastFiveLosses = lastFiveData.filter(
    (item) => item.result === "V",
  ).length;

  const highestGoalDifference =
    lastFiveData.length > 0
      ? Math.max(...lastFiveData.map((item) => Math.abs(item.goalDifference)))
      : 1;

  function getResultClass(result: "W" | "G" | "V") {
    if (result === "W") {
      return "last-five-win";
    }

    if (result === "G") {
      return "last-five-draw";
    }

    return "last-five-loss";
  }

  function getBarHeight(goalDifference: number) {
    if (goalDifference === 0) {
      return 20;
    }

    return Math.max(
      25,
      (Math.abs(goalDifference) / highestGoalDifference) * 100,
    );
  }

 return (
  <div className="dashboard">
    <div className="dashboard-page-header">
      <div>
        <h1>⚽ Dashboard</h1>
        <p>Bekijk het overzicht van {team}.</p>
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
        <h2>Teamstatistieken</h2>

        <p>
          <strong>⚽ Goals voor:</strong> {goalsFor}
        </p>

        <p>
          <strong>🥅 Goals tegen:</strong> {goalsAgainst}
        </p>

        <p>
          <strong>📊 Doelsaldo:</strong> {goalDifference > 0 ? "+" : ""}
          {goalDifference}
        </p>

        <p>
          <strong>📈 Gemiddeld goals per wedstrijd:</strong> {averageGoals}
        </p>
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

      <div className="last-five-section">
        <div className="last-five-header">
          <div>
            <h2>Laatste 5 wedstrijden</h2>

            <p>Recente resultaten van {team}</p>
          </div>

          <div className="last-five-legend">
            <span>
              <i className="legend-win"></i>
              Winst
            </span>

            <span>
              <i className="legend-draw"></i>
              Gelijk
            </span>

            <span>
              <i className="legend-loss"></i>
              Verlies
            </span>
          </div>
        </div>

        {lastFiveData.length > 0 ? (
          <>
            <div className="last-five-chart">
              {lastFiveData.map((item) => (
                <div className="last-five-column" key={item.match.id}>
                  <div className="last-five-value">
                    {item.goalDifference > 0 ? "+" : ""}
                    {item.goalDifference}
                  </div>

                  <div className="last-five-bar-container">
                    <div
                      className={`last-five-bar ${getResultClass(item.result)}`}
                      style={{
                        height: `${getBarHeight(item.goalDifference)}%`,
                      }}
                    ></div>
                  </div>

                  <strong className="last-five-result">{item.result}</strong>

                  <span className="last-five-opponent">vs {item.opponent}</span>

                  <span className="last-five-score">
                    {item.teamGoals} - {item.opponentGoals}
                  </span>

                  <span className="last-five-date">
                    {new Date(item.match.date).toLocaleDateString("nl-NL")}
                  </span>
                </div>
              ))}
            </div>

            <div className="last-five-summary">
              <span>
                <strong>Gewonnen:</strong> {lastFiveWins}
              </span>

              <span>
                <strong>Gelijk:</strong> {lastFiveDraws}
              </span>

              <span>
                <strong>Verloren:</strong> {lastFiveLosses}
              </span>
            </div>
          </>
        ) : (
          <p className="last-five-empty">Nog geen wedstrijden gespeeld.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
