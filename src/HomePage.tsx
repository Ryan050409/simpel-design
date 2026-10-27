import { Link } from "react-router-dom";
import type { Match, Player } from "./types.ts";

type HomePageProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
};

function HomePage({ matches, playerList, team }: HomePageProps) {
  const teamMatches = matches.filter(
    (match) => match.home === team || match.away === team,
  );

  const recentMatches = [...teamMatches]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const latestMatch = recentMatches[0];
  const previousMatches = recentMatches.slice(1);
  const latestMatchResult = latestMatch
    ? latestMatch.homeGoals === latestMatch.awayGoals
      ? "Gelijkspel"
      : (
            latestMatch.home === team
              ? latestMatch.homeGoals > latestMatch.awayGoals
              : latestMatch.awayGoals > latestMatch.homeGoals
          )
        ? "Gewonnen"
        : "Verloren"
    : null;
  const wins = teamMatches.filter((match) => {
    const teamGoals = match.home === team ? match.homeGoals : match.awayGoals;
    const opponentGoals =
      match.home === team ? match.awayGoals : match.homeGoals;

    return teamGoals > opponentGoals;
  }).length;

  const draws = teamMatches.filter(
    (match) => match.homeGoals === match.awayGoals,
  ).length;

  const losses = teamMatches.length - wins - draws;

  const teamPlayers = playerList.filter((player) => player.team === team);

  const topScorer = [...teamPlayers].sort((a, b) => b.goals - a.goals)[0];

  const averageRating =
    teamPlayers.length > 0
      ? (
          teamPlayers.reduce((total, player) => total + player.rating, 0) /
          teamPlayers.length
        ).toFixed(1)
      : null;

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div>
          <h1>⚽ Welkom bij Voetbaltracker</h1>
          <p>Bekijk de prestaties en laatste wedstrijden van {team}.</p>
        </div>

        <div className="home-page-team-badge">
          <span aria-hidden="true">⭐</span>
          <strong>{team}</strong>
        </div>
      </div>

      {latestMatch && (
        <section
          className="home-page-featured-match"
          aria-labelledby="home-featured-match-title"
        >
          <div className="home-page-featured-match-heading">
            <span className="home-page-panel-label">⚽ LAATSTE UITSLAG</span>
            <Link to="/wedstrijden">Alle wedstrijden →</Link>
          </div>

          <h2 id="home-featured-match-title">Laatste wedstrijd van {team}</h2>
          {latestMatchResult && (
            <span
              className="home-page-match-status"
              aria-label={`Resultaat voor ${team}: ${latestMatchResult}`}
            >
              {latestMatchResult}
            </span>
          )}

          <div className="home-page-featured-match-score">
            <strong
              className={[
                latestMatch.home === team ? "featured-team-favorite" : "",
                latestMatch.homeGoals > latestMatch.awayGoals
                  ? "featured-team-winner"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {latestMatch.home}
            </strong>
            <div
              className="home-page-featured-score"
              aria-label={`Uitslag ${latestMatch.homeGoals} tegen ${latestMatch.awayGoals}`}
            >
              <span>{latestMatch.homeGoals}</span>
              <span aria-hidden="true">–</span>
              <span>{latestMatch.awayGoals}</span>
            </div>
            <strong
              className={[
                latestMatch.away === team ? "featured-team-favorite" : "",
                latestMatch.awayGoals > latestMatch.homeGoals
                  ? "featured-team-winner"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {latestMatch.away}
            </strong>{" "}
          </div>

          <p className="home-page-featured-match-date">
            Gespeeld op {latestMatch.date}
          </p>
        </section>
      )}

      <div className="home-page-section-title">
        <div>
          <h2>Jouw overzicht</h2>
          <p>Een korte samenvatting van je team.</p>
        </div>
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

      <div className="home-page-player-summary">
        <div className="home-page-player-summary-header">
          <div>
            <span className="home-page-panel-label">👥 TEAMSELECTIE</span>
          </div>

          <Link to="/spelers">Alle spelers →</Link>
        </div>

        <div className="home-page-player-summary-stats">
          <div>
            <strong>{teamPlayers.length}</strong>
            <span>{teamPlayers.length === 1 ? "speler" : "spelers"}</span>
          </div>

          <div>
            <strong>{averageRating ?? "-"}</strong>
            <span>gemiddelde rating</span>
          </div>
        </div>

        {topScorer && (
          <div className="home-page-player-summary-topscorer">
            <span>🏆 Topscorer</span>

            <div>
              <strong>
                {topScorer.firstname} {topScorer.lastname}
              </strong>

              <span>{topScorer.goals} doelpunten</span>
            </div>
          </div>
        )}
      </div>

      <div className="home-page-content-grid">
        <div className="home-page-panel">
          <div className="home-page-panel-heading">
            <div>
              <span className="home-page-panel-label">🕐 RECENT</span>
              <h2>Eerdere wedstrijden</h2>
            </div>
          </div>

          {previousMatches.length > 0 ? (
            <div className="home-page-match-list">
              {previousMatches.map((match) => {
                const teamIsHome = match.home === team;
                const teamGoals = teamIsHome
                  ? match.homeGoals
                  : match.awayGoals;
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

                const resultLabel =
                  result === "W"
                    ? "Gewonnen"
                    : result === "G"
                      ? "Gelijkspel"
                      : "Verloren";

                return (
                  <div className="home-page-match" key={match.id}>
                    <div
                      className={`home-page-result result-${result.toLowerCase()}`}
                      aria-label={resultLabel}
                      title={resultLabel}
                    >
                      <span className="home-page-result-text">
                        {resultLabel}
                      </span>
                    </div>

                    <div className="home-page-match-info">
                      <strong>
                        {team} - {opponent}
                      </strong>
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
              <span aria-hidden="true">⚽</span>
              <p>
                {latestMatch
                  ? "Er zijn nog geen eerdere wedstrijden."
                  : "Nog geen wedstrijden toegevoegd."}
              </p>
              <Link to="/wedstrijden">Bekijk wedstrijden →</Link>
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
          </div>

          <div className="home-page-panel home-page-top-player">
            <span className="home-page-panel-label">🏆 TOPSCORER</span>

            {topScorer ? (
              <>
                <h2>
                  {topScorer.firstname} {topScorer.lastname}
                </h2>

                <div className="home-page-top-player-stats">
                  <strong>{topScorer.goals}</strong>
                  <span>doelpunten</span>
                </div>
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
    </div>
  );
}

export default HomePage;
