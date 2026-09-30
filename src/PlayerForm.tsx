import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Team } from "./types.ts";

type PlayerFormProps = {
editingPlayer: Player | null;
setEditingPlayer: Dispatch<SetStateAction<Player | null>>;
setPlayerList: Dispatch<SetStateAction<Player[]>>;
closeModal: () => void;
teams: Team[];
};

function PlayerForm({
editingPlayer,
setEditingPlayer,
setPlayerList,
closeModal,
teams
}: PlayerFormProps) {
const [formStep, setFormStep] = useState(1);

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
    editingPlayer?.number?.toString() ?? ""
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

function goToNextStep() {
    if (
        newPlayerFirstName.trim() === "" ||
        newPlayerLastName.trim() === "" ||
        newPlayerNumber.trim() === "" ||
        newPlayerPosition.trim() === ""
    ) {
        setWarning("Vul eerst alle basisgegevens in!");
        return;
    }

    setWarning("");
    setFormStep(2);
}

function savePlayer() {
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
        id: editingPlayer
            ? editingPlayer.id
            : Date.now(),

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
                player.id === editingPlayer.id
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

function goBack() {
    setWarning("");
    setFormStep(1);
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

            {formStep === 1 && (
                <>
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
                            type="number"
                            placeholder="Rugnummer"
                            value={newPlayerNumber}
                            onChange={(e) =>
                                setNewPlayerNumber(e.target.value)
                            }
                        />

                        <input
                            list="player-positions"
                            type="text"
                            placeholder="Positie"
                            value={newPlayerPosition}
                            onChange={(e) =>
                                setNewPlayerPosition(e.target.value)
                            }
                        />

                        <datalist id="player-positions">
                            <option value="Keeper" />
                            <option value="Verdediger" />
                            <option value="Middenvelder" />
                            <option value="Aanvaller" />
                        </datalist>

                    </div>

                    <button
                        className="save-player-button"
                        onClick={goToNextStep}
                    >
                        Doorgaan
                    </button>
                </>
            )}

            {formStep === 2 && (
                <>
                    <div className="form-grid">

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
                            {teams.map((team) => (
                                <option
                                    key={team.id}
                                    value={team.name}
                                />
                            ))}
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
                            placeholder="Minuten gespeeld"
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
                        onClick={goBack}
                    >
                        Terug
                    </button>

                    <button
                        className="save-player-button"
                        onClick={savePlayer}
                    >
                        {editingPlayer
                            ? "Wijzigingen opslaan"
                            : "Speler opslaan"}
                    </button>
                </>
            )}

        </div>
    </div>
);


}

export default PlayerForm;
