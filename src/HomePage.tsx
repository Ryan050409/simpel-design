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

  const recentMatches = [...teamMatches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const wins = teamMatches.filter((match) => {
    const teamGoals = match.home === team ? match.homeGoals : match.awayGoals;
    const opponentGoals = match.home === team ? match.awayGoals : match.homeGoals;
    return teamGoals > opponentGoals;
  }).length;

  const draws = teamMatches.filter(
    (match) => match.homeGoals === match.awayGoals,
  ).length;

  const losses = teamMatches.length - wins - draws;

  const teamPlayers = playerList.filter((player) => player.team === team);

const topScorer = [...teamPlayers].sort(
  (a, b) => b.goals - a.goals,
)[0];

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div>
          <span className="home-page-welcome-label">OVERZICHT</span>
          <h1>🏠 Welkom bij Voetbaltracker</h1>
          <p>
            Alles wat je nodig hebt om je team, wedstrijden en spelers snel te
            bekijken.
          </p>
        </div>
        <div className="home-page-team-badge">
          <span>⭐</span>
          <strong>{team}</strong>
        </div>
      </div>

      <div className="home-page-links">
        <Link to="/dashboard" className="home-page-card">
          <span>📊</span>
          <div>
            <h2>Dashboard</h2>
            <p>Bekijk je belangrijkste statistieken.</p>
          </div>
          <strong className="home-page-card-arrow">→</strong>
        </Link>

        <Link to="/wedstrijden" className="home-page-card">
          <span>⚽</span>
          <div>
            <h2>Wedstrijden</h2>
            <p>Bekijk en beheer je wedstrijden.</p>
          </div>
          <strong className="home-page-card-arrow">→</strong>
        </Link>

        <Link to="/spelers" className="home-page-card">
          <span>👥</span>
          <div>
            <h2>Spelers</h2>
            <p>Bekijk en beheer je spelers.</p>
          </div>
          <strong className="home-page-card-arrow">→</strong>
        </Link>

        <Link to="/instellingen" className="home-page-card">
          <span>⚙️</span>
          <div>
            <h2>Instellingen</h2>
            <p>Beheer je team en voorkeuren.</p>
          </div>
          <strong className="home-page-card-arrow">→</strong>
        </Link>
      </div>

      <div className="home-page-section-title">
        <div>
          <h2>Jouw overzicht</h2>
          <p>Een snelle samenvatting van je team.</p>
        </div>
        <Link to="/dashboard">Alles bekijken →</Link>
      </div>

      <div className="home-page-stats">
        <div className="home-page-stat">
          <span>Wedstrijden</span>
          <strong>{teamMatches.length}</strong>
          <small>totaal gespeeld</small>
        </div>

        <div className="home-page-stat">
          <span>Gewonnen</span>
          <strong>{wins}</strong>
          <small>van {teamMatches.length} wedstrijden</small>
        </div>

        <div className="home-page-stat">
          <span>Gelijk</span>
          <strong>{draws}</strong>
          <small>onbesliste wedstrijden</small>
        </div>

        <div className="home-page-stat">
          <span>Verloren</span>
          <strong>{losses}</strong>
          <small>verloren wedstrijden</small>
        </div>
      </div>

      <div className="home-page-content-grid">
        <div className="home-page-panel">
          <div className="home-page-panel-heading">
            <div>
              <span className="home-page-panel-label">🕐 RECENT</span>
              <h2>Laatste wedstrijden</h2>
            </div>
            <Link to="/wedstrijden">Bekijk alles</Link>
          </div>

          {recentMatches.length > 0 ? (
            <div className="home-page-match-list">
              {recentMatches.map((match) => {
                const teamIsHome = match.home === team;
                const teamGoals = teamIsHome ? match.homeGoals : match.awayGoals;
                const opponentGoals = teamIsHome
                  ? match.awayGoals
                  : match.homeGoals;
                const opponent = teamIsHome ? match.away : match.home;
                const result =
                  teamGoals > opponentGoals
                    ? "W"
                    : teamGoals === opponentGoals
                      ? "G"
                      : "V";

                return (
                  <div className="home-page-match" key={match.id}>
                    <div className={`home-page-result result-${result.toLowerCase()}`}>
                      {result}
                    </div>
                    <div className="home-page-match-info">
                      <strong>{team} - {opponent}</strong>
                      <span>{match.date}</span>
                    </div>
                    <strong className="home-page-match-score">
                      {teamGoals} - {opponentGoals}
                    </strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="home-page-empty">
              <span>⚽</span>
              <p>Nog geen wedstrijden toegevoegd.</p>
              <Link to="/wedstrijden">Eerste wedstrijd toevoegen →</Link>
            </div>
          )}
        </div>

        <div className="home-page-side-column">
          <div className="home-page-panel home-page-team-panel">
            <span className="home-page-panel-label">⭐ FAVORIET TEAM</span>
            <h2>{team}</h2>
            <p>
              {teamMatches.length === 0
                ? "Voeg je eerste wedstrijd toe om hier meer teaminformatie te zien."
                : `${wins} gewonnen · ${draws} gelijk · ${losses} verloren`}
            </p>
            <Link to="/instellingen">Team aanpassen →</Link>
          </div>

          <div className="home-page-panel home-page-top-player">
            <span className="home-page-panel-label">🏆 TOPSCORER</span>
            {topScorer ? (
              <>
                <h2>{topScorer.firstname} {topScorer.lastname}</h2>
                <div className="home-page-top-player-stats">
                  <strong>{topScorer.goals}</strong>
                  <span>doelpunten</span>
                </div>
                <Link to="/spelers">Alle spelers →</Link>
              </>
            ) : (
              <div className="home-page-empty-small">
                <p>Nog geen spelers toegevoegd.</p>
                <Link to="/spelers">Eerste speler toevoegen →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="home-page-latest">
        <div>
          <span className="home-page-panel-label">LAATSTE ACTIVITEIT</span>
          {latestMatch ? (
            <>
              <h2>
                {latestMatch.home} {latestMatch.homeGoals} -{" "}
                {latestMatch.awayGoals} {latestMatch.away}
              </h2>
              <p>Laatste geregistreerde wedstrijd · {latestMatch.date}</p>
            </>
          ) : (
            <>
              <h2>Klaar om te beginnen?</h2>
              <p>Voeg een wedstrijd of speler toe om je overzicht te vullen.</p>
            </>
          )}
        </div>
        <Link to={latestMatch ? "/wedstrijden" : "/spelers"}>
          {latestMatch ? "Wedstrijden beheren →" : "Aan de slag →"}
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
