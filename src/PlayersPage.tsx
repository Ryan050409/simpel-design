import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type Player = {
    name: string;
    team: string;
    goals: number;
    assists: number;
    matches: number;
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

    const [newPlayerName, setNewPlayerName] = useState("");
    const [newPlayerTeam, setNewPlayerTeam] = useState("");
    const [newPlayerGoals, setNewPlayerGoals] = useState("");
    const [newPlayerAssists, setNewPlayerAssists] = useState("");
    const [newPlayerMatches, setNewPlayerMatches] = useState("");
    const [newPlayerRating, setNewPlayerRating] = useState("");
    const [warning, setWarning] = useState("");

    function addPlayer() {
        if (
            newPlayerName.trim() === "" ||
            newPlayerTeam.trim() === "" ||
            newPlayerGoals.trim() === "" ||
            newPlayerAssists.trim() === "" ||
            newPlayerMatches.trim() === "" ||
            newPlayerRating.trim() === ""
        ) {
            setWarning("Alle velden moeten ingevuld worden!");
            return;
        }

        setWarning("");

        const newPlayer: Player = {
            name: newPlayerName,
            team: newPlayerTeam,
            goals: Number(newPlayerGoals) || 0,
            assists: Number(newPlayerAssists) || 0,
            matches: Number(newPlayerMatches) || 0,
            rating: Number(newPlayerRating) || 0
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

        setNewPlayerName("");
        setNewPlayerTeam("");
        setNewPlayerGoals("");
        setNewPlayerAssists("");
        setNewPlayerMatches("");
        setNewPlayerRating("");
        setEditingPlayer(null);
        setShowAddPlayer(false);
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
        setNewPlayerGoals(String(player.goals));
        setNewPlayerAssists(String(player.assists));
        setNewPlayerMatches(String(player.matches));
        setNewPlayerRating(String(player.rating));

        setShowAddPlayer(true);
    }

    function openAddPlayer() {
        setEditingPlayer(null);
        setNewPlayerName("");
        setNewPlayerTeam("");
        setNewPlayerGoals("");
        setNewPlayerAssists("");
        setNewPlayerMatches("");
        setNewPlayerRating("");
        setShowAddPlayer(true);
    }

    return (
        <div>
            <h1>⚽ Spelers</h1>

            <button onClick={openAddPlayer}>
                + Speler toevoegen
            </button>

            <div className="players">
                {playerList.map((player) => (
                    <div
                        className="player-card"
                        key={player.name}
                    >
                        <h2>{player.name}</h2>

                        <p>Team: {player.team}</p>
                        <p>Goals: {player.goals}</p>
                        <p>Assists: {player.assists}</p>
                        <p>Wedstrijden: {player.matches}</p>
                        <p>Rating: {player.rating}</p>

                        <button
                            onClick={() => editPlayer(player)}
                        >
                            Bewerken
                        </button>

                        <button
                            onClick={() =>
                                deletePlayer(player.name)
                            }
                        >
                            Verwijderen
                        </button>
                    </div>
                ))}
            </div>

            {showAddPlayer && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="modal-close"
                            onClick={() => {
                                setShowAddPlayer(false);
                                setWarning("");
                            }}
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
                            step="0.1"
                            placeholder="Rating"
                            value={newPlayerRating}
                            onChange={(e) =>
                                setNewPlayerRating(e.target.value)
                            }
                        />

                        <button onClick={addPlayer}>
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