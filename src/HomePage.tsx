import { Link } from "react-router-dom";
import type { Match, Player } from "./types.ts";
import { translations, type Language } from "./translations.ts";
import teamLogos from "./teamLogos";

type HomePageProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
  language: Language;
};

function HomePage({ matches, playerList, team, language }: HomePageProps) {
  const t = translations[language];


// Alle wedstrijden van het favoriete team
const teamMatches = matches.filter(
  (match) => match.home === team || match.away === team,
);

// Alleen wedstrijden met een volledige uitslag
const playedTeamMatches = teamMatches.filter(
  (match) =>
    typeof match.homeGoals === "number" &&
    typeof match.awayGoals === "number",
);

// Alleen wedstrijden zonder uitslag
const upcomingTeamMatches = teamMatches.filter(
  (match) =>
    match.homeGoals === null &&
    match.awayGoals === null,
);

// Laatst gespeelde wedstrijden: nieuwste eerst
const recentMatches = [...playedTeamMatches]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6);

// Eerstvolgende wedstrijden: oudste datum eerst
const upcomingMatches = [...upcomingTeamMatches]
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 5);

const latestMatch = recentMatches[0];
const previousMatches = recentMatches.slice(1);

// Resultaat van de laatst gespeelde wedstrijd
const latestMatchResult =
  latestMatch &&
  latestMatch.homeGoals !== null &&
  latestMatch.awayGoals !== null
    ? latestMatch.homeGoals === latestMatch.awayGoals
      ? t.draw
      : (
            latestMatch.home === team
              ? latestMatch.homeGoals > latestMatch.awayGoals
              : latestMatch.awayGoals > latestMatch.homeGoals
          )
        ? t.won
        : t.lost
    : null;
// Statistieken uitsluitend op basis van gespeelde wedstrijden
const wins = playedTeamMatches.filter((match) => {
  const teamGoals = match.home === team ? match.homeGoals! : match.awayGoals!;
  const opponentGoals = match.home === team ? match.awayGoals! : match.homeGoals!;

  return teamGoals > opponentGoals;
}).length;

const draws = playedTeamMatches.filter(
  (match) => match.homeGoals === match.awayGoals,
).length;

const losses = playedTeamMatches.length - wins - draws;

  const teamPlayers = playerList.filter((player) => player.team === team);

  const topScorer = [...teamPlayers].sort(
  (a, b) => (b.goals ?? 0) - (a.goals ?? 0),
)[0];

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div>
          <h1>⚽ {t.welcome}</h1>
          <p>
            {t.teamDescription} {team}.
          </p>
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
            <span className="home-page-panel-label">⚽ {t.latestResult}</span>
            <Link to="/wedstrijden">{t.allMatches} →</Link>
          </div>

          <h2 id="home-featured-match-title">
            {t.latestMatch} {team}
          </h2>

          {latestMatchResult && (
            <span
              className="home-page-match-status"
              aria-label={`${t.latestResult} ${team}: ${latestMatchResult}`}
            >
              {latestMatchResult}
            </span>
          )}

          <div className="home-page-featured-match-score">
            <div className="home-page-featured-team">
              {teamLogos[latestMatch.home] && (
                <img
                  src={teamLogos[latestMatch.home]}
                  alt=""
                  className="home-page-featured-logo"
                />
              )}

              <strong
                className={[
                  latestMatch.home === team ? "featured-team-favorite" : "",
                  latestMatch.homeGoals! > latestMatch.awayGoals!
                    ? "featured-team-winner"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {latestMatch.home}
              </strong>
            </div>

            <div
              className="home-page-featured-score"
              aria-label={`${t.scoreLabel} ${latestMatch.homeGoals} ${t.scoreAgainst} ${latestMatch.awayGoals}`}
            >
              <span>{latestMatch.homeGoals}</span>
              <span aria-hidden="true">–</span>
              <span>{latestMatch.awayGoals}</span>
            </div>

            <div className="home-page-featured-team">
              {teamLogos[latestMatch.away] && (
                <img
                  src={teamLogos[latestMatch.away]}
                  alt=""
                  className="home-page-featured-logo"
                />
              )}

              <strong
                className={[
                  latestMatch.away === team ? "featured-team-favorite" : "",
                  latestMatch.awayGoals! > latestMatch.homeGoals!
                    ? "featured-team-winner"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {latestMatch.away}
              </strong>
            </div>
          </div>

          <p className="home-page-featured-match-date">
            {t.playedOn} {latestMatch.date}
          </p>
        </section>
      )}

      <div className="home-page-section-title">
        <div>
          <h2>{t.overview}</h2>
          <p>{t.teamSummary}</p>
        </div>
      </div>

      <div className="home-page-stats">
        <div className="home-page-stat">
          <span>{t.matches}</span>
          <strong>{playedTeamMatches.length}</strong>
          <small>{t.totalMatches}</small>
        </div>

        <div className="home-page-stat">
          <span>{t.won}</span>
          <strong>{wins}</strong>
          <small>
            {t.ofMatches} {teamMatches.length} {t.matches.toLowerCase()}
          </small>
        </div>

        <div className="home-page-stat">
          <span>{t.draw}</span>
          <strong>{draws}</strong>
          <small>{t.undecidedMatches}</small>
        </div>

        <div className="home-page-stat">
          <span>{t.lost}</span>
          <strong>{losses}</strong>
          <small>{t.lostMatches}</small>
        </div>
      </div>

      <div className="home-page-player-summary">
        <div className="home-page-player-summary-header">
          <div>
            <span className="home-page-panel-label">👥 {t.teamSelection}</span>
          </div>

          <Link to="/spelers">{t.allPlayers} →</Link>
        </div>

        <div className="home-page-player-summary-stats">
          <div>
            <strong>{teamPlayers.length}</strong>
            <span>{teamPlayers.length === 1 ? t.player : t.players}</span>
          </div>
        </div>

        {topScorer && (
          <div className="home-page-player-summary-topscorer">
            <span>🏆 {t.topScorer}</span>

            <div>
              <strong>
                {topScorer.firstname} {topScorer.lastname}
              </strong>

              <span>
                {topScorer.goals} {t.goals}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="home-page-content-grid">
        <div className="home-page-panel">
          <div className="home-page-panel-heading">
            <div>
              <span className="home-page-panel-label">🕐 {t.recent}</span>
              <h2>{t.previousMatches}</h2>
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

                const result =
                  teamGoals! > opponentGoals!
                    ? "W"
                    : teamGoals === opponentGoals
                      ? "G"
                      : "V";

                const resultLabel =
                  result === "W" ? t.won : result === "G" ? t.draw : t.lost;

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
                    <div className="home-page-match-teams">
                      <div className="home-page-match-team">
                        {teamLogos[match.home] && (
                          <img src={teamLogos[match.home]} alt="" />
                        )}
                        <strong>{match.home}</strong>
                      </div>

                      <strong className="home-page-match-score">
                        {match.homeGoals} - {match.awayGoals}
                      </strong>

                      <div className="home-page-match-team home-page-match-opponent">
                        {teamLogos[match.away] && (
                          <img src={teamLogos[match.away]} alt="" />
                        )}
                        <strong>{match.away}</strong>
                      </div>
                    </div>

                    <span className="home-page-match-date">{match.date}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="home-page-empty">
              <span aria-hidden="true">⚽</span>
              <p>{latestMatch ? t.noPreviousMatches : t.noMatches}</p>
              <Link to="/wedstrijden">{t.viewMatches} →</Link>
            </div>
          )}
        </div>

        <div className="home-page-side-column">

<div className="home-page-panel">
  <div className="home-page-panel-heading">
    <div>
      <span className="home-page-panel-label">📅 Aankomend</span>
      <h2>{t.matches}</h2>
    </div>
    <Link to="/wedstrijden">{t.allMatches} →</Link>
  </div>

  {upcomingMatches.length > 0 ? (
    <div className="home-page-match-list">
      {upcomingMatches.map((match) => (
        <div className="home-page-match" key={match.id}>
          <div className="home-page-match-teams">
            <div className="home-page-match-team">
              {teamLogos[match.home] && (
                <img src={teamLogos[match.home]} alt="" />
              )}
              <strong>{match.home}</strong>
            </div>

            <strong className="home-page-match-score">vs</strong>

            <div className="home-page-match-team home-page-match-opponent">
              {teamLogos[match.away] && (
                <img src={teamLogos[match.away]} alt="" />
              )}
              <strong>{match.away}</strong>
            </div>
          </div>

          <span className="home-page-match-date">{match.date}</span>
        </div>
      ))}
    </div>
  ) : (
    <div className="home-page-empty">
      <span aria-hidden="true">📅</span>
      <p>Geen aankomende wedstrijden.</p>
    </div>
  )}
</div>

          <div className="home-page-panel home-page-team-panel">
            <span className="home-page-panel-label">⭐ {t.favoriteTeam}</span>
            <h2>{team}</h2>
            <p>
              {teamMatches.length === 0
                ? t.addFirstMatch
                : `${wins} ${t.wonShort} · ${draws} ${t.drawShort} · ${losses} ${t.lostShort}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
