import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {Player} from "./types"
type PlayerFormProps = {
    editingPlayer: Player | null;
    setEditingPlayer: Dispatch<SetStateAction<Player | null>>;
    setPlayerList: Dispatch<SetStateAction<Player[]>>;
    closeModal: () => void;
};

function PlayerForm({
    editingPlayer,
    setEditingPlayer,
    setPlayerList,
    closeModal
}: PlayerFormProps) {
    const [newPlayerFirstName, setNewPlayerFirstName] = useState(
        editingPlayer?.firstname ?? ""
    );

    const [newPlayerLastName, setNewPlayerLastName] = useState(
        editingPlayer?.lastname ?? ""
    );

    const [newPlayerTeam, setNewPlayerTeam] = useState(
        editingPlayer?.team ?? ""
    );

    const [newPlayerPosition, setNewPlayerPosition] = useState(
        editingPlayer?.position ?? ""
    );

    const [newPlayerNumber, setNewPlayerNumber] = useState(
        editingPlayer?.number?.toString() || ""
    );

    const [newPlayerGoals, setNewPlayerGoals] = useState(
        editingPlayer ? String(editingPlayer.goals) : ""
    );

    const [newPlayerAssists, setNewPlayerAssists] = useState(
        editingPlayer ? String(editingPlayer.assists) : ""
    );

    const [newPlayerMatches, setNewPlayerMatches] = useState(
        editingPlayer ? String(editingPlayer.matches) : ""
    );

    const [newPlayerMinutesPlayed, setNewPlayerMinutesPlayed] = useState(
        editingPlayer
            ? String(editingPlayer.minutesplayed)
            : ""
    );

    const [newPlayerRating, setNewPlayerRating] = useState(
        editingPlayer ? String(editingPlayer.rating) : ""
    );

    const [warning, setWarning] = useState("");

    function addPlayer() {
        if (
            newPlayerFirstName.trim() === "" ||
            newPlayerLastName.trim() === "" ||
            newPlayerTeam.trim() === "" ||
            newPlayerPosition.trim() === "" ||
            newPlayerNumber.trim() === "" ||
            newPlayerGoals.trim() === "" ||
            newPlayerAssists.trim() === "" ||
            newPlayerMatches.trim() === "" ||
            newPlayerMinutesPlayed.trim() === "" ||
            newPlayerRating.trim() === ""
        ) {
            setWarning("Alle velden moeten ingevuld worden!");
            return;
        }

        const newPlayer: Player = {
            firstname: newPlayerFirstName.trim(),
            lastname: newPlayerLastName.trim(),
            team: newPlayerTeam.trim(),
            position: newPlayerPosition.trim(),
            number: Number(newPlayerNumber),
            goals: Number(newPlayerGoals),
            assists: Number(newPlayerAssists),
            matches: Number(newPlayerMatches),
            minutesplayed: Number(newPlayerMinutesPlayed),
            rating: Number(newPlayerRating)
        };

        if (editingPlayer) {
            setPlayerList((currentPlayers) =>
                currentPlayers.map((player) =>
                    player.firstname === editingPlayer.firstname
                        ? newPlayer
                        : player
                )
            );
        } else {
            setPlayerList((currentPlayers) => [
                ...currentPlayers,
                newPlayer
            ]);
        }

        setEditingPlayer(null);
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
                    {editingPlayer
                        ? "Speler bewerken"
                        : "Speler toevoegen"}
                </h2>

                {warning && (
                    <p className="warning">
                        {warning}
                    </p>
                )}

                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Voornaam speler"
                        value={newPlayerFirstName}
                        onChange={(e) =>
                            setNewPlayerFirstName(e.target.value)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Achternaam speler"
                        value={newPlayerLastName}
                        onChange={(e) =>
                            setNewPlayerLastName(e.target.value)
                        }
                    />
                    <input
                        list="player-teams"
                        type="text"
                        placeholder="Team"
                        value={newPlayerTeam}
                        onChange={(e) =>
                            setNewPlayerTeam(e.target.value)
                        }
                    />

                    <datalist id="player-teams">
                        <option value="Ajax" />
                        <option value="PSV" />
                        <option value="Feyenoord" />
                        <option value="AZ" />
                        <option value="FC Twente" />
                        <option value="FC Utrecht" />
                    </datalist>

                    <input
                        list="player-positions"
                        type="text"
                        placeholder="Positie"
                        value={newPlayerPosition}
                        onChange={(e) =>
                            setNewPlayerPosition(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Rugnummer"
                        value={newPlayerNumber}
                        onChange={(e) => setNewPlayerNumber(e.target.value)}>
                    </input>

                    <datalist id="player-positions">
                        <option value="Keeper" />
                        <option value="Verdediger" />
                        <option value="Middenvelder" />
                        <option value="Aanvaller" />
                    </datalist>

                    <input
                        type="number"
                        placeholder="Goals"
                        value={newPlayerGoals}
                        onChange={(e) =>
                            setNewPlayerGoals(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Assists"
                        value={newPlayerAssists}
                        onChange={(e) =>
                            setNewPlayerAssists(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Wedstrijden"
                        value={newPlayerMatches}
                        onChange={(e) =>
                            setNewPlayerMatches(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Gespeelde minuten"
                        value={newPlayerMinutesPlayed}
                        onChange={(e) =>
                            setNewPlayerMinutesPlayed(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        step="0.1"
                        placeholder="Rating"
                        value={newPlayerRating}
                        onChange={(e) =>
                            setNewPlayerRating(e.target.value)
                        }
                    />
                </div>

                <button
                    className="save-player-button"
                    onClick={addPlayer}
                >
                    {editingPlayer
                        ? "Wijzigingen opslaan"
                        : "Speler opslaan"}
                </button>
            </div>
        </div>
    );
}

export default PlayerForm;