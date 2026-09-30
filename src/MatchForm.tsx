import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Match, Team } from "./types.ts";

type MatchFormProps = {
    editingMatch: Match | null;
    setEditingMatch: Dispatch<SetStateAction<Match | null>>;
    setMatches: Dispatch<SetStateAction<Match[]>>;
    closeModal: () => void;
    teams: Team[];
};

function MatchForm({
    editingMatch,
    setEditingMatch,
    setMatches,
    closeModal,
    teams
}: MatchFormProps) {
    const [home, setHome] = useState(
        editingMatch?.home ?? ""
    );

    const [away, setAway] = useState(
        editingMatch?.away ?? ""
    );

    const [homeGoals, setHomeGoals] = useState(
        editingMatch
            ? String(editingMatch.homeGoals)
            : ""
    );

    const [awayGoals, setAwayGoals] = useState(
        editingMatch
            ? String(editingMatch.awayGoals)
            : ""
    );

    const [date, setDate] = useState(
        editingMatch?.date ??
        new Date().toISOString().split("T")[0]
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

        const newMatch: Match = {
            id: editingMatch
                ? editingMatch.id
                : Date.now(),
            home: home.trim(),
            away: away.trim(),
            homeGoals: Number(homeGoals),
            awayGoals: Number(awayGoals),
            date
        };

        if (editingMatch) {
            setMatches((currentMatches) =>
                currentMatches.map((match) =>
                    match.id === editingMatch.id
                        ? newMatch
                        : match
                )
            );
        } else {
            setMatches((currentMatches) =>
                [...currentMatches, newMatch].sort(
                    (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                )
            );
        }

        setEditingMatch(null);
        closeModal();
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button
                    className="modal-close"
                    onClick={closeModal}
                >
                    ×
                </button>

                <h2 className="h2-player">
                    {editingMatch
                        ? "Wedstrijd bewerken"
                        : "Wedstrijd toevoegen"}
                </h2>

                {warning && (
                    <p className="warning">
                        {warning}
                    </p>
                )}

                <div className="form-grid">
                    <input
                        list="match-teams"
                        type="text"
                        placeholder="Thuisteam"
                        value={home}
                        onChange={(e) =>
                            setHome(e.target.value)
                        }
                    />

                    <input
                        list="match-teams"
                        type="text"
                        placeholder="Uitteam"
                        value={away}
                        onChange={(e) =>
                            setAway(e.target.value)
                        }
                    />

                    <datalist id="match-teams">
                        {teams.map((team) => (
                            <option
                                key={team.id}
                                value={team.name}
                            />
                        ))}
                    </datalist>

                    <input
                        type="number"
                        min="0"
                        placeholder="Goals thuis"
                        value={homeGoals}
                        onChange={(e) =>
                            setHomeGoals(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        min="0"
                        placeholder="Goals uit"
                        value={awayGoals}
                        onChange={(e) =>
                            setAwayGoals(e.target.value)
                        }
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                    />
                </div>

                <button
                    className="save-player-button"
                    onClick={saveMatch}
                >
                    {editingMatch
                        ? "Wijzigingen opslaan"
                        : "Wedstrijd opslaan"}
                </button>
            </div>
        </div>
    );
}

export default MatchForm;