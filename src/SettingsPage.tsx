import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import PlayerForm from "./PlayerForm.tsx";
import MatchForm from "./MatchForm.tsx";

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

type Match = {
    id: number;
    home: string;
    away: string;
    homeGoals: number;
    awayGoals: number;
    date: string;
};

type SettingsPageProps = {
    matches: Match[];
    setMatches: Dispatch<SetStateAction<Match[]>>;
    playerList: Player[];
    setPlayerList: Dispatch<SetStateAction<Player[]>>;
};

function SettingsPage({
    matches,
    setMatches,
    playerList,
    setPlayerList
}: SettingsPageProps) {
    const [showPlayerPopup, setShowPlayerPopup] =
        useState(false);

    const [showMatchPopup, setShowMatchPopup] =
        useState(false);

    const [editingPlayer, setEditingPlayer] =
        useState<Player | null>(null);

    const [editingMatch, setEditingMatch] =
        useState<Match | null>(null);

    function openPlayerPopup() {
        setEditingPlayer(null);
        setShowPlayerPopup(true);
    }

    function closePlayerPopup() {
        setEditingPlayer(null);
        setShowPlayerPopup(false);
    }

    function openMatchPopup() {
        setEditingMatch(null);
        setShowMatchPopup(true);
    }

    function closeMatchPopup() {
        setEditingMatch(null);
        setShowMatchPopup(false);
    }

    return (
        <div className="settings-page">
            <h1>⚙️ Instellingen</h1>

            <div className="settings-list">
                <div className="setting-row">
                    <div>
                        <strong>Spelers</strong>

                        <small>
                            Voeg een nieuwe speler toe aan je
                            voetbaltracker.
                        </small>
                    </div>

                    <button
                        type="button"
                        onClick={openPlayerPopup}
                    >
                        + Speler toevoegen
                    </button>
                </div>

                <div className="setting-row">
                    <div>
                        <strong>Wedstrijden</strong>

                        <small>
                            Voeg een nieuwe wedstrijd toe aan
                            je voetbaltracker.
                        </small>
                    </div>

                    <button
                        type="button"
                        onClick={openMatchPopup}
                    >
                        + Wedstrijd toevoegen
                    </button>
                </div>
            </div>

            {showPlayerPopup && (
                <PlayerForm
                    editingPlayer={editingPlayer}
                    setEditingPlayer={setEditingPlayer}
                    setPlayerList={setPlayerList}
                    closeModal={closePlayerPopup}
                />
            )}

            {showMatchPopup && (
                <MatchForm
                    editingMatch={editingMatch}
                    setEditingMatch={setEditingMatch}
                    setMatches={setMatches}
                    closeModal={closeMatchPopup}
                />
            )}
        </div>
    );
}

export default SettingsPage;