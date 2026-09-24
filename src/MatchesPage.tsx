import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import MatchCard from "./MatchCard.tsx";
import type { Match } from "./App";

type ResultFilter = "ALL" | "W" | "G" | "V";
type LocationFilter = "ALL" | "HOME" | "AWAY";

type Props = {
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
  team: string;
};

function MatchesPage({ matches, setMatches, team }: Props) {
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("ALL");

  const getResult = (match: Match) => {
    const teamGoals = match.home === team ? match.homeGoals : match.awayGoals;
    const opponentGoals = match.home === team ? match.awayGoals : match.homeGoals;
    return teamGoals > opponentGoals ? "W" : teamGoals === opponentGoals ? "G" : "V";
  };

  const resetForm = () => {
    setHome(""); setAway(""); setHomeGoals(0); setAwayGoals(0);
    setDate(new Date().toISOString().split("T")[0]);
    setEditingMatch(null);
  };

  const saveMatch = () => {
    if (!home.trim() || !away.trim() || !date) return;
    const next: Match = {
      id: editingMatch?.id ?? Date.now(),
      home: home.trim(),
      away: away.trim(),
      homeGoals: Math.max(0, homeGoals),
      awayGoals: Math.max(0, awayGoals),
      date
    };
    setMatches((current) =>
      [...current.filter((match) => match.id !== next.id), next]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    resetForm();
  };

  const editMatch = (match: Match) => {
    setEditingMatch(match);
    setHome(match.home); setAway(match.away);
    setHomeGoals(match.homeGoals); setAwayGoals(match.awayGoals); setDate(match.date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMatch = (id: number) => setMatches((current) => current.filter((match) => match.id !== id));

  const filteredMatches = matches
    .filter((match) => resultFilter === "ALL" || getResult(match) === resultFilter)
    .filter((match) => locationFilter === "ALL" || (locationFilter === "HOME" ? match.home === team : match.away === team))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="matches-page">
      <div className="page-heading">
        <div><p className="eyebrow">MATCH CENTER</p><h1>🏟️ Wedstrijden</h1></div>
        <span className="team-pill">{team}</span>
      </div>

      <section className="panel match-form">
        <h2>{editingMatch ? "Wedstrijd bewerken" : "Wedstrijd toevoegen"}</h2>
        <div className="form-grid">
          <input list="teams" placeholder="Thuisteam" value={home} onChange={(e) => setHome(e.target.value)} />
          <input list="teams" placeholder="Uitteam" value={away} onChange={(e) => setAway(e.target.value)} />
          <input type="number" min="0" placeholder="Goals thuis" value={homeGoals} onChange={(e) => setHomeGoals(Number(e.target.value))} />
          <input type="number" min="0" placeholder="Goals uit" value={awayGoals} onChange={(e) => setAwayGoals(Number(e.target.value))} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={saveMatch}>{editingMatch ? "Wijzigingen opslaan" : "Wedstrijd toevoegen"}</button>
          {editingMatch && <button className="button-secondary" onClick={resetForm}>Annuleren</button>}
        </div>
        <datalist id="teams">
          <option value="Ajax" /><option value="PSV" /><option value="Feyenoord" />
          <option value="AZ" /><option value="FC Twente" /><option value="FC Utrecht" />
        </datalist>
      </section>

      <div className="filters">
        <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value as ResultFilter)}>
          <option value="ALL">Alle resultaten</option><option value="W">Gewonnen</option><option value="G">Gelijk</option><option value="V">Verloren</option>
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value as LocationFilter)}>
          <option value="ALL">Alle locaties</option><option value="HOME">Thuis</option><option value="AWAY">Uit</option>
        </select>
      </div>

      <div className="matches-list">
        {filteredMatches.map((match) => {
          const result = getResult(match);
          const resultClass = result === "W" ? "result-win" : result === "G" ? "result-draw" : "result-loss";
          return (
            <div className="match-wrapper" key={match.id}>
              <MatchCard match={match} onDelete={deleteMatch} onEdit={editMatch} />
              <div className={`match-result ${resultClass}`}>{result}</div>
              <p className="match-date">{new Date(match.date).toLocaleDateString("nl-NL")}</p>
            </div>
          );
        })}
        {!filteredMatches.length && <div className="panel empty-state">Geen wedstrijden gevonden.</div>}
      </div>
    </div>
  );
}

export default MatchesPage;
