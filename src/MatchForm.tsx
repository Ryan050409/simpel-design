import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Match, Team } from "./types.ts";

type MatchFormProps = {
  editingMatch?: Match | null;
  setEditingMatch?: Dispatch<SetStateAction<Match | null>>;
  setMatches: Dispatch<SetStateAction<Match[]>>;
  closeModal: () => void;
  teams: Team[];
};

function MatchForm({
  editingMatch,
  setEditingMatch,
  setMatches,
  closeModal,
  teams,
}: MatchFormProps) {
  const [home, setHome] = useState(editingMatch?.home ?? "");
  const [away, setAway] = useState(editingMatch?.away ?? "");

  const [homeGoals, setHomeGoals] = useState(
    editingMatch ? String(editingMatch.homeGoals) : "",
  );

  const [awayGoals, setAwayGoals] = useState(
    editingMatch ? String(editingMatch.awayGoals) : "",
  );

  const [date, setDate] = useState(
    editingMatch?.date ?? new Date().toISOString().split("T")[0],
  );

  const [warning, setWarning] = useState("");

  function saveMatch() {
    if (
      home.trim() === "" ||
      away.trim() === "" ||
      homeGoals.trim() === "" ||
      awayGoals.trim() === "" ||
      date === ""
    ) {
      setWarning("Alle velden moeten ingevuld worden!");
      return;
    }

    if (home.trim().toLowerCase() === away.trim().toLowerCase()) {
      setWarning("Een team kan niet tegen zichzelf spelen!");
      return;
    }

    if (Number(homeGoals) < 0 || Number(awayGoals) < 0) {
      setWarning("Het aantal doelpunten kan niet negatief zijn!");
      return;
    }

    const newMatch: Match = {
      id: editingMatch ? editingMatch.id : Date.now(),
      home: home.trim(),
      away: away.trim(),
      homeGoals: Number(homeGoals),
      awayGoals: Number(awayGoals),
      date,
    };

    setMatches((currentMatches) => {
      const updatedMatches = editingMatch
        ? currentMatches.map((match) =>
            match.id === editingMatch.id ? newMatch : match,
          )
        : [...currentMatches, newMatch];

      return [...updatedMatches].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    setEditingMatch?.(null);
    closeModal();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" type="button" onClick={closeModal}>
          ×
        </button>

        <h2 className="h2-player">
          {editingMatch ? "Wedstrijd bewerken" : "Wedstrijd toevoegen"}
        </h2>

        {warning && <p className="warning">{warning}</p>}

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="match-home">Thuisteam</label>
            <select
              id="match-home"
              value={home}
              onChange={(e) => setHome(e.target.value)}
            >
              <option value="">Kies thuisteam</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="match-away">Uitteam</label>
            <select
              id="match-away"
              value={home}
              onChange={(e) => setAway(e.target.value)}
            >
              <option value="">Kies uitteam</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="match-home-goals">Goals thuis</label>
            <input
              id="match-home-goals"
              type="number"
              min="0"
              value={homeGoals}
              onChange={(e) => setHomeGoals(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="match-away-goals">Goals uit</label>
            <input
              id="match-away-goals"
              type="number"
              min="0"
              value={awayGoals}
              onChange={(e) => setAwayGoals(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="match-date">Datum</label>
            <input
              id="match-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          className="save-player-button"
          onClick={saveMatch}
        >
          {editingMatch ? "Wijzigingen opslaan" : "Wedstrijd opslaan"}
        </button>
      </div>
    </div>
  );
}

export default MatchForm;
