import type { Match, Player } from "./App";

type DashboardProps = {
  matches: Match[];
  playerList: Player[];
  team: string;
  setTeam: (team: string) => void;
};

function Dashboard({ matches, playerList, team, setTeam }: DashboardProps) {
  const played = matches.filter((match) => match.home === team || match.away === team);

  const getTeamGoals = (match: Match) => match.home === team ? match.homeGoals : match.awayGoals;
  const getOpponentGoals = (match: Match) => match.home === team ? match.awayGoals : match.homeGoals;

  const wins = played.filter((match) => getTeamGoals(match) > getOpponentGoals(match)).length;
  const draws = played.filter((match) => getTeamGoals(match) === getOpponentGoals(match)).length;
  const losses = played.filter((match) => getTeamGoals(match) < getOpponentGoals(match)).length;
  const points = wins * 3 + draws;
  const goalsFor = played.reduce((sum, match) => sum + getTeamGoals(match), 0);
  const goalsAgainst = played.reduce((sum, match) => sum + getOpponentGoals(match), 0);
  const goalDifference = goalsFor - goalsAgainst;
  const winPercentage = played.length ? Math.round((wins / played.length) * 100) : 0;
  const averageGoals = played.length ? (goalsFor / played.length).toFixed(2) : "0.00";

  const form = [...played]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((match) => {
      const result = getTeamGoals(match) > getOpponentGoals(match) ? "W" : getTeamGoals(match) === getOpponentGoals(match) ? "G" : "V";
      return <span key={match.id} className={`form-badge result-${result === "W" ? "win" : result === "G" ? "draw" : "loss"}`}>{result}</span>;
    });

  const topScorer = [...playerList].sort((a, b) => b.goals - a.goals)[0];
  const bestPlayer = [...playerList].sort((a, b) => b.rating - a.rating)[0];
  const totalGoals = playerList.reduce((sum, player) => sum + player.goals, 0);
  const totalAssists = playerList.reduce((sum, player) => sum + player.assists, 0);
  const totalMatches = playerList.reduce((sum, player) => sum + player.matches, 0);
  const averageRating = playerList.length
    ? (playerList.reduce((sum, player) => sum + player.rating, 0) / playerList.length).toFixed(1)
    : "0.0";

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <p className="eyebrow">TEAM OVERVIEW</p>
          <h1>⚽ Dashboard</h1>
        </div>
        <select value={team} onChange={(e) => setTeam(e.target.value)} className="team-select">
          <option>Feyenoord</option>
          <option>Ajax</option>
          <option>PSV</option>
          <option>AZ</option>
          <option>FC Twente</option>
          <option>FC Utrecht</option>
        </select>
      </div>

      <div className="stats-grid">
        {[
          ["Wedstrijden", played.length],
          ["Gewonnen", wins],
          ["Gelijk", draws],
          ["Verloren", losses],
          ["Punten", points],
          ["Doelsaldo", goalDifference],
          ["Winstpercentage", `${winPercentage}%`],
          ["Gem. goals", averageGoals]
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <h3>{label}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h2>Teamstatistieken</h2>
          <div className="stat-list">
            <p><span>Goals voor</span><strong>{goalsFor}</strong></p>
            <p><span>Goals tegen</span><strong>{goalsAgainst}</strong></p>
            <p><span>Doelsaldo</span><strong>{goalDifference}</strong></p>
            <p><span>Gemiddeld goals</span><strong>{averageGoals}</strong></p>
          </div>
        </section>

        <section className="panel">
          <h2>Teamvorm</h2>
          <div className="form-row">{form.length ? form : <span>Geen wedstrijden</span>}</div>
          <p className="muted">Laatste 5 wedstrijden</p>
        </section>

        <section className="panel">
          <h2>Beste speler</h2>
          {bestPlayer ? <div className="highlight-player"><span>⭐ {bestPlayer.name}</span><strong>{bestPlayer.rating.toFixed(1)}</strong></div> : <p>Geen spelers</p>}
          {topScorer && <p className="muted">Topscorer: {topScorer.name} · {topScorer.goals} goals</p>}
        </section>

        <section className="panel">
          <h2>Spelersstatistieken</h2>
          <div className="stat-list">
            <p><span>Spelers</span><strong>{playerList.length}</strong></p>
            <p><span>Goals</span><strong>{totalGoals}</strong></p>
            <p><span>Assists</span><strong>{totalAssists}</strong></p>
            <p><span>Wedstrijden</span><strong>{totalMatches}</strong></p>
            <p><span>Gem. rating</span><strong>{averageRating}</strong></p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
