import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Position } from "./App";

type Props = {
  playerList: Player[];
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
};

type SortOption = "name" | "goals" | "assists" | "rating" | "position";
const positions: Position[] = ["Keeper", "Verdediger", "Middenvelder", "Aanvaller"];

function PlayersPage({ playerList, setPlayerList }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [sort, setSort] = useState<SortOption>("name");
  const [warning, setWarning] = useState("");

  const emptyForm = { name: "", team: "", number: "", position: "Middenvelder" as Position, goals: "", assists: "", matches: "", rating: "" };
  const [form, setForm] = useState(emptyForm);

  const selectedPlayer = playerList.find((player) => player.name === selectedName) ?? playerList[0];
  const bestPlayer = [...playerList].sort((a, b) => b.rating - a.rating)[0];

  const filteredPlayers = useMemo(() => {
    const list = playerList.filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase()) &&
      (positionFilter === "ALL" || player.position === positionFilter)
    );
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "position") return a.position.localeCompare(b.position);
      return b[sort] - a[sort];
    });
  }, [playerList, search, positionFilter, sort]);

  const openAdd = () => {
    setEditingPlayer(null);
    setForm(emptyForm);
    setWarning("");
    setShowModal(true);
  };

  const openEdit = (player: Player) => {
    setEditingPlayer(player);
    setForm({
      name: player.name, team: player.team, number: String(player.number),
      position: player.position, goals: String(player.goals), assists: String(player.assists),
      matches: String(player.matches), rating: String(player.rating)
    });
    setWarning("");
    setShowModal(true);
  };

  const savePlayer = () => {
    if (!form.name.trim() || !form.team.trim() || !form.number.trim() || !form.goals.trim() || !form.assists.trim() || !form.matches.trim() || !form.rating.trim()) {
      setWarning("Vul alle velden in.");
      return;
    }

    const player: Player = {
      name: form.name.trim(), team: form.team.trim(), number: Number(form.number),
      position: form.position, goals: Number(form.goals), assists: Number(form.assists),
      matches: Number(form.matches), rating: Number(form.rating)
    };

    setPlayerList((current) =>
      editingPlayer
        ? current.map((item) => item.name === editingPlayer.name ? player : item)
        : [...current, player]
    );
    setSelectedName(player.name);
    setShowModal(false);
  };

  const deletePlayer = (name: string) => {
    setPlayerList((current) => current.filter((player) => player.name !== name));
    if (selectedName === name) setSelectedName("");
  };

  const goalsPerMatch = selectedPlayer?.matches ? (selectedPlayer.goals / selectedPlayer.matches).toFixed(2) : "0.00";
  const assistsPerMatch = selectedPlayer?.matches ? (selectedPlayer.assists / selectedPlayer.matches).toFixed(2) : "0.00";
  const totalGoals = playerList.reduce((sum, player) => sum + player.goals, 0);
  const totalAssists = playerList.reduce((sum, player) => sum + player.assists, 0);
  const totalMatches = playerList.reduce((sum, player) => sum + player.matches, 0);
  const averageRating = playerList.length ? (playerList.reduce((sum, player) => sum + player.rating, 0) / playerList.length).toFixed(1) : "0.0";

  return (
    <div className="players-page">
      <div className="page-heading">
        <div><p className="eyebrow">SQUAD</p><h1>👥 Spelers</h1></div>
        <button onClick={openAdd}>+ Speler toevoegen</button>
      </div>

      <div className="player-tools">
        <input placeholder="🔎 Zoek speler..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
          <option value="ALL">Alle posities</option>
          {positions.map((position) => <option key={position}>{position}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
          <option value="name">Naam A-Z</option><option value="goals">Meeste goals</option>
          <option value="assists">Meeste assists</option><option value="rating">Hoogste rating</option>
          <option value="position">Positie</option>
        </select>
      </div>

      <section className="player-summary">
        <div><span>Spelers</span><strong>{playerList.length}</strong></div>
        <div><span>Goals</span><strong>{totalGoals}</strong></div>
        <div><span>Assists</span><strong>{totalAssists}</strong></div>
        <div><span>Wedstrijden</span><strong>{totalMatches}</strong></div>
        <div><span>Gem. rating</span><strong>{averageRating}</strong></div>
      </section>

      {bestPlayer && <div className="best-player">⭐ Beste speler: <strong>{bestPlayer.name}</strong> · rating {bestPlayer.rating.toFixed(1)}</div>}

      <div className="players-grid">
        {filteredPlayers.map((player) => (
          <article key={player.name} className={`player-card ${selectedPlayer?.name === player.name ? "selected-player" : ""}`} onClick={() => setSelectedName(player.name)}>
            <div className="player-card-top"><span className="player-number">#{player.number}</span><span className="position-badge">{player.position}</span></div>
            <h2>{player.name} {bestPlayer?.name === player.name && <span>⭐</span>}</h2>
            <p>{player.team}</p>
            <div className="player-stats">
              <span><strong>{player.goals}</strong> Goals</span>
              <span><strong>{player.assists}</strong> Assists</span>
              <span><strong>{player.matches}</strong> Wed.</span>
              <span><strong>{player.rating.toFixed(1)}</strong> Rating</span>
            </div>
            <div className="player-actions">
              <button onClick={(e) => { e.stopPropagation(); openEdit(player); }}>Bewerken</button>
              <button className="button-danger" onClick={(e) => { e.stopPropagation(); deletePlayer(player.name); }}>Verwijderen</button>
            </div>
          </article>
        ))}
      </div>

      {selectedPlayer && (
        <section className="panel selected-panel">
          <h2>Geselecteerde speler</h2>
          <h3>{selectedPlayer.name}</h3>
          <p>{selectedPlayer.position} · #{selectedPlayer.number} · {selectedPlayer.team}</p>
          <div className="stats-grid compact">
            <div className="stat-card"><h3>Goals/wedstrijd</h3><p>{goalsPerMatch}</p></div>
            <div className="stat-card"><h3>Assists/wedstrijd</h3><p>{assistsPerMatch}</p></div>
            <div className="stat-card"><h3>Goals</h3><p>{selectedPlayer.goals}</p></div>
            <div className="stat-card"><h3>Rating</h3><p>{selectedPlayer.rating.toFixed(1)}</p></div>
          </div>
        </section>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>{editingPlayer ? "Speler bewerken" : "Speler toevoegen"}</h2>
            {warning && <p className="warning">{warning}</p>}
            <input placeholder="Naam speler" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input list="player-teams" placeholder="Team" value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} />
            <datalist id="player-teams"><option value="Ajax" /><option value="PSV" /><option value="Feyenoord" /><option value="AZ" /><option value="FC Twente" /><option value="FC Utrecht" /></datalist>
            <input type="number" min="0" placeholder="Rugnummer" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as Position })}>{positions.map((position) => <option key={position}>{position}</option>)}</select>
            <input type="number" min="0" placeholder="Goals" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
            <input type="number" min="0" placeholder="Assists" value={form.assists} onChange={(e) => setForm({ ...form, assists: e.target.value })} />
            <input type="number" min="0" placeholder="Wedstrijden" value={form.matches} onChange={(e) => setForm({ ...form, matches: e.target.value })} />
            <input type="number" min="0" max="10" step="0.1" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            <button onClick={savePlayer}>{editingPlayer ? "Wijzigingen opslaan" : "Speler opslaan"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayersPage;
