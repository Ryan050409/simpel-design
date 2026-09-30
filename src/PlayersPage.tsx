import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import PlayerForm from "./PlayerForm.tsx";
import type { Player, Team } from "./types.ts";

type PlayersPageProps = {
    playerList: Player[];
    setPlayerList: Dispatch<SetStateAction<Player[]>>;
    teams: Team[];
};

function PlayersPage({
    playerList,
    setPlayerList,
    teams
}: PlayersPageProps) {
    const [editingPlayer, setEditingPlayer] =
        useState<Player | null>(null);
    function deletePlayer(id: number) {
        setPlayerList((currentPlayers) =>
            currentPlayers.filter(
                (player) => player.id !== id
            )
        );
    }

    function editPlayer(player: Player) {
        setEditingPlayer(player);
    }

    return (
        <div className="players-page">
            <div className="players-page-header">
                <div>
                    <h1>⚽ Spelers</h1>
                    <p>
                        Bekijk en beheer je spelers.
                    </p>
                </div>

                <NavLink
                    className="add-player-button"
                    to="/instellingen"
                >
                    ⚙️ Speler toevoegen
                </NavLink>
            </div>

            <div className="players">
                {playerList.map((player) => (
                    <div
                        className="player-card"
                        key={player.id}
                    >
                        <div className="player-card-header">
                            <div>
                                <div className="player-fullname-row">
                                    <h2>
                                        {player.firstname}{" "}
                                        {player.lastname}
                                    </h2>

                                    <span className="player-number">
                                        #{player.number}
                                    </span>
                                </div>

                                <p className="player-team">
                                    {player.team}
                                </p>
                            </div>

                            <div className="player-rating">
                                <span>RATING</span>

                                <strong>
                                    {player.rating}
                                </strong>
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
                                type="button"
                                className="edit-button"
                                onClick={() =>
                                    editPlayer(player)
                                }
                            >
                                Bewerken
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={() =>
                                    deletePlayer(player.id)
                                }
                            >
                                Verwijderen
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingPlayer && (
                <PlayerForm
                    editingPlayer={editingPlayer}
                    setEditingPlayer={setEditingPlayer}
                    setPlayerList={setPlayerList}
                    closeModal={() =>
                        setEditingPlayer(null)
                    }
                    teams={teams}
                />
            )}
        </div>
    );
}

export default PlayersPage;