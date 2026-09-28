import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

type PlayersPageProps = {
    playerList: Player[];
    setPlayerList: Dispatch<SetStateAction<Player[]>>;
};

function PlayersPage({
    playerList,
    setPlayerList
}: PlayersPageProps) {
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [editingPlayer, setEditingPlayer] =
        useState<Player | null>(null);
    const [searchParams] = useSearchParams();
    const [newPlayerName, setNewPlayerName] = useState("");
    const [newPlayerTeam, setNewPlayerTeam] = useState("");
    const [newPlayerPosition, setNewPlayerPosition] = useState("");
    const [newPlayerGoals, setNewPlayerGoals] = useState("");
    const [newPlayerAssists, setNewPlayerAssists] = useState("");
    const [newPlayerMatches, setNewPlayerMatches] = useState("");
    const [newPlayerMinutesPlayed, setNewPlayerMinutesPlayed] = useState("");
    const [newPlayerRating, setNewPlayerRating] = useState("");
    const [warning, setWarning] = useState("");
    
    function resetForm() {
        setNewPlayerName("");
        setNewPlayerTeam("");
        setNewPlayerPosition("");
        setNewPlayerGoals("");
        setNewPlayerAssists("");
        setNewPlayerMatches("");
        setNewPlayerMinutesPlayed("");
        setNewPlayerRating("");
        setEditingPlayer(null);
        setWarning("");
    }

    function openAddPlayer() {
        resetForm();
        setShowAddPlayer(true);
    }
        useEffect(() => {
        if (searchParams.get("toevoegen") === "1") {
            openAddPlayer();
        }
    }, [searchParams]);
    function closeModal() {
        resetForm();
        setShowAddPlayer(false);
    }

    function addPlayer() {
        if (
            newPlayerName.trim() === "" ||
            newPlayerTeam.trim() === "" ||
            newPlayerPosition.trim() === "" ||
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
            name: newPlayerName.trim(),
            team: newPlayerTeam.trim(),
            position: newPlayerPosition.trim(),
            goals: Number(newPlayerGoals),
            assists: Number(newPlayerAssists),
            matches: Number(newPlayerMatches),
            minutesplayed: Number(newPlayerMinutesPlayed),
            rating: Number(newPlayerRating)
        };

        if (editingPlayer) {
            setPlayerList(
                playerList.map((player) =>
                    player.name === editingPlayer.name
                        ? newPlayer
                        : player
                )
            );
        } else {
            setPlayerList([
                ...playerList,
                newPlayer
            ]);
        }

        closeModal();
    }

    function deletePlayer(name: string) {
        setPlayerList(
            playerList.filter(
                (player) => player.name !== name
            )
        );
    }

    function editPlayer(player: Player) {
        setEditingPlayer(player);

        setNewPlayerName(player.name);
        setNewPlayerTeam(player.team);
        setNewPlayerPosition(player.position);
        setNewPlayerGoals(String(player.goals));
        setNewPlayerAssists(String(player.assists));
        setNewPlayerMatches(String(player.matches));
        setNewPlayerMinutesPlayed(String(player.minutesplayed));
        setNewPlayerRating(String(player.rating));

        setWarning("");
        setShowAddPlayer(true);
    }

    return (
        <div className="players-page">
            <div className="players-page-header">
                <div>
                    <h1>⚽ Spelers</h1>
                    <p>Bekijk en beheer je spelers.</p>
                </div>

                <button
                    className="add-player-button"
                    onClick={openAddPlayer}
                >
                    + Speler toevoegen
                </button>
            </div>

            <div className="players">
                {playerList.map((player) => (
                    <div
                        className="player-card"
                        key={player.name}
                    >
                        <div className="player-card-header">
                            <div>
                                <h2>{player.name}</h2>
                                <p className="player-team">
                                    {player.team}
                                </p>
                            </div>

                            <div className="player-rating">
                                <span>RATING</span>
                                <strong>{player.rating}</strong>
                            </div>
                        </div>

                        <div className="player-position">
                            {player.position}
                        </div>

                        <div className="player-stats">
                            <div className="player-stat">
                                <strong>{player.goals}</strong>
                                <span>Goals</span>
                            </div>

                            <div className="player-stat">
                                <strong>{player.assists}</strong>
                                <span>Assists</span>
                            </div>

                            <div className="player-stat">
                                <strong>{player.matches}</strong>
                                <span>Wedstrijden</span>
                            </div>

                            <div className="player-stat">
                                <strong>{player.minutesplayed}</strong>
                                <span>Minuten</span>
                            </div>
                        </div>

                        <div className="player-actions">
                            <button
                                onClick={() => editPlayer(player)}
                            >
                                Bewerken
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    deletePlayer(player.name)
                                }
                            >
                                Verwijderen
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddPlayer && (
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
                                placeholder="Naam speler"
                                value={newPlayerName}
                                onChange={(e) =>
                                    setNewPlayerName(e.target.value)
                                }
                            />

                            <input
                                list="teams"
                                type="text"
                                placeholder="Team"
                                value={newPlayerTeam}
                                onChange={(e) =>
                                    setNewPlayerTeam(e.target.value)
                                }
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
                                value={newPlayerPosition}
                                onChange={(e) =>
                                    setNewPlayerPosition(e.target.value)
                                }
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
            )}
        </div>
    );
}

export default PlayersPage;