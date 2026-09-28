import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import PlayerForm from "./PlayerForm.tsx";

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

    function resetForm() {
        setEditingPlayer(null);
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

    function deletePlayer(name: string) {
        setPlayerList(
            playerList.filter(
                (player) => player.name !== name
            )
        );
    }

    function editPlayer(player: Player) {
        setEditingPlayer(player);
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
                                <strong>
                                    {player.minutesplayed}
                                </strong>
                                <span>Minuten</span>
                            </div>
                        </div>

                        <div className="player-actions">
                            <button
                                onClick={() =>
                                    editPlayer(player)
                                }
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
                <PlayerForm
                    editingPlayer={editingPlayer}
                    setEditingPlayer={setEditingPlayer}
                    setPlayerList={setPlayerList}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default PlayersPage;