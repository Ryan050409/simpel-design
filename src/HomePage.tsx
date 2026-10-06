import { Link } from "react-router-dom";
import type { Match, Player } from "./types.ts";

type HomePageProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
};

function HomePage({ matches, playerList, team }: HomePageProps) {
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const latestMatch = sortedMatches[0];

  const teamMatches = matches.filter(
    (match) => match.home === team || match.away === team,
  );

  const wins = teamMatches.filter((match) => {
    const teamGoals = match.home === team ? match.homeGoals : match.awayGoals;
    const opponentGoals = match.home === team ? match.awayGoals : match.homeGoals;
    return teamGoals > opponentGoals;
  }).length;

  return (
    <div className="home-page">
      <div className="home-page-header">
        <h1>🏠 Welkom bij Voetbaltracker</h1>
        <p>Houd je wedstrijden, spelers en statistieken eenvoudig bij.</p>
      </div>

      <div className="home-page-links">
        <Link to="/wedstrijden" className="home-page-card">
          <span>⚽</span>
          <h2>Wedstrijden</h2>
          <p>Bekijk en beheer je wedstrijden.</p>
        </Link>

        <Link to="/spelers" className="home-page-card">
          <span>👥</span>
          <h2>Spelers</h2>
          <p>Bekijk en beheer je spelers.</p>
        </Link>

        <Link to="/dashboard" className="home-page-card">
          <span>📊</span>
          <h2>Dashboard</h2>
          <p>Bekijk je belangrijkste statistieken.</p>
        </Link>
      </div>

      <div className="home-page-info">
        <div className="home-page-stats">
          <div className="home-page-stat">
            <span>Wedstrijden</span>
            <strong>{matches.length}</strong>
          </div>

          <div className="home-page-stat">
            <span>Spelers</span>
            <strong>{playerList.length}</strong>
          </div>

          <div className="home-page-stat">
            <span>Gewonnen</span>
            <strong>{wins}</strong>
          </div>
        </div>

        <div className="home-page-bottom">
          <div className="home-page-panel">

            <span className="home-page-panel-label">⭐ Favoriete team</span>
            <h2>{team}</h2>
          </div>

          <div className="home-page-panel">
            <span className="home-page-panel-label">🕐 Laatste wedstrijd</span>
            {latestMatch ? (
              <>
                <h2>
                  {latestMatch.home} {latestMatch.homeGoals} -{" "}
                  {latestMatch.awayGoals} {latestMatch.away}
                </h2>
                <p>{latestMatch.date}</p>
              </>
            ) : (
              <p>Nog geen wedstrijden.</p>
            )}
          </div>

          <Link to="/instellingen" className="home-page-panel home-page-settings">
            <span className="home-page-panel-icon">⚙️</span>
            <div>
              <span className="home-page-panel-label">Instellingen</span>
              <h2>Beheer je team</h2>
              <p>Pas je favoriete team en andere instellingen aan.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
