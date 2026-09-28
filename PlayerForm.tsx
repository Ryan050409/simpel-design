import type { Dispatch, SetStateAction } from "react";

type Player = {
    name: string;
    team: string;
    position: string;
    goals: number;
    assists: number;
    matches: number;
    minutesplayed: number;
    rating: number;
};

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

                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Naam speler"
                    />

                    <input
                        list="teams"
                        type="text"
                        placeholder="Team"
                    />

                    <datalist id="teams">
                        <option value="Ajax" />
                        <option value="PSV" />
                        <option value="Feyenoord" />
                        <option value="AZ" />
                        <option value="FC Twente" />
                        <option value="FC Utrecht" />
                    </datalist>

                    <input
                        list="positions"
                        type="text"
                        placeholder="Positie"
                    />

                    <datalist id="positions">
                        <option value="Keeper" />
                        <option value="Verdediger" />
                        <option value="Middenvelder" />
                        <option value="Aanvaller" />
                    </datalist>

                    <input
                        type="number"
                        placeholder="Goals"
                    />

                    <input
                        type="number"
                        placeholder="Assists"
                    />

                    <input
                        type="number"
                        placeholder="Wedstrijden"
                    />

                    <input
                        type="number"
                        placeholder="Gespeelde minuten"
                    />

                    <input
                        type="number"
                        step="0.1"
                        placeholder="Rating"
                    />
                </div>

                <button
                    className="save-player-button"
                    onClick={() => {
                        setPlayerList((currentPlayers) =>
                            [...currentPlayers]
                        );

                        setEditingPlayer(null);
                        closeModal();
                    }}
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