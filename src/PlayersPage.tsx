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
    const [selectedPlayer, setSelectedPlayer] =
        useState<Player | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
 function deletePlayer(id: number) {
    const playerToDelete = playerList.find(
        (player) => player.id === id
    );

    if (!playerToDelete) {
        return;
    }

    const confirmed = window.confirm(
        `Weet je zeker dat je ${playerToDelete.firstname} ${playerToDelete.lastname} wilt verwijderen?`
    );

    if (!confirmed) {
        return;
    }

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
                    <h1>👥 Spelers</h1>
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
            <div className="player-search">
    <input
        type="text"
        placeholder="Zoek een speler..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
</div>
            <div className="players">
            {playerList.filter((player) =>
    `${player.firstname} ${player.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
).length === 0 && (
    <p>Geen spelers gevonden.</p>
)}    
                {playerList
                .filter((player) => 
                `${player.firstname} ${player.lastname}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
                )
                .map((player) => (
                    <div
                        className="player-card"
                        key={player.id}
                        onClick={() => setSelectedPlayer(player)}
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

                            {(player.position === "Aanvaller" ||
                                player.position === "Middenvelder") && (
                                    <>
                                        <div className="player-stat">
                                            <strong>{player.goals}</strong>
                                            <span>Goals</span>
                                        </div>

                                        <div className="player-stat">
                                            <strong>{player.assists}</strong>
                                            <span>Assists</span>
                                        </div>
                                    </>
                                )}

                            {player.position === "Verdediger" && (
                                <>
                                    <div className="player-stat">
                                        <strong>{player.tackles ?? 0}</strong>
                                        <span>Tackles</span>
                                    </div>

                                    <div className="player-stat">
                                        <strong>{player.interceptions ?? 0}</strong>
                                        <span>Interceptions</span>
                                    </div>
                                </>
                            )}

                            {player.position === "Keeper" && (
                                <>
                                    <div className="player-stat">
                                        <strong>{player.saves ?? 0}</strong>
                                        <span>Reddingen</span>
                                    </div>

                                    <div className="player-stat">
                                        <strong>{player.oneVSOneSaves ?? 0}</strong>
                                        <span>1-op-1 reddingen</span>
                                    </div>
                                </>
                            )}

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
                                type="button"
                                className="edit-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    editPlayer(player);
                                }}
                            >
                                Bewerken
                            </button>

                            <button
                                type="button"
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePlayer(player.id);
                                }}
                            >
                                Verwijderen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedPlayer && (
    <div
        className="modal-overlay"
        onClick={() => setSelectedPlayer(null)}
    >
        <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                className="modal-close"
                onClick={() => setSelectedPlayer(null)}
            >
                ×
            </button>

            <h2>
                {selectedPlayer.firstname}{" "}
                {selectedPlayer.lastname}
            </h2>

            <p>{selectedPlayer.position}</p>

            <div className="player-stats">

                <div className="player-stat">
                    <strong>{selectedPlayer.goals}</strong>
                    <span>Goals</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.assists}</strong>
                    <span>Assists</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.matches}</strong>
                    <span>Wedstrijden</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.minutesplayed}</strong>
                    <span>Minuten</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.tackles ?? 0}</strong>
                    <span>Tackles</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.interceptions ?? 0}</strong>
                    <span>Interceptions</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.blocks ?? 0}</strong>
                    <span>Blocks</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.clearences ?? 0}</strong>
                    <span>Clearences</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.duelsWon ?? 0}</strong>
                    <span>Gewonnen duels</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.fouls ?? 0}</strong>
                    <span>Overtredingen</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.saves ?? 0}</strong>
                    <span>Reddingen</span>
                </div>

                <div className="player-stat">
                    <strong>
                        {selectedPlayer.oneVSOneSaves ?? 0}
                    </strong>
                    <span>1-op-1 reddingen</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.cleanSheets ?? 0}</strong>
                    <span>Clean sheets</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.penaltySaves ?? 0}</strong>
                    <span>Penalty's gehouden</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.goalsConceded ?? 0}</strong>
                    <span>Tegengoals</span>
                </div>

                <div className="player-stat">
                    <strong>{selectedPlayer.rating}</strong>
                    <span>Rating</span>
                </div>

            </div>
        </div>
    </div>
)}
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