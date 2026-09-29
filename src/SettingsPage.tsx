import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import PlayerForm from "./PlayerForm.tsx";
import MatchForm from "./MatchForm.tsx";
import type { Player, Match, Team } from "./types.ts";

type SettingsPageProps = {
    setMatches: Dispatch<SetStateAction<Match[]>>;
    setPlayerList: Dispatch<SetStateAction<Player[]>>;
    teams: Team[];
    setTeams: Dispatch<SetStateAction<Team[]>>;
};

function SettingsPage({
    setMatches,
    setPlayerList,
    teams,
    setTeams
}: SettingsPageProps) {
    const [showPlayerPopup, setShowPlayerPopup] =
        useState(false);

    const [editingPlayer, setEditingPlayer] =
        useState<Player | null>(null);

    const [showMatchPopup, setShowMatchPopup] =
        useState(false);

    const [editingMatch, setEditingMatch] =
        useState<Match | null>(null);

    const [newTeam, setNewTeam] = useState("");

    const [teamWarning, setTeamWarning] =
        useState("");

    const [openQuestion, setOpenQuestion] =
        useState<number | null>(null);

    const faqs = [
        {
            question: "Hoe voeg ik een speler toe?",
            answer:
                "Ga naar Instellingen en klik bij Spelers op '+ Speler toevoegen'. Vul de gegevens in en sla de speler op."
        },
        {
            question: "Hoe voeg ik een team toe?",
            answer:
                "Ga naar Instellingen en gebruik het onderdeel Teams. Vul de naam van het team in en klik op '+ Team toevoegen'."
        },
        {
            question: "Waar worden mijn gegevens opgeslagen?",
            answer:
                "Je gegevens worden lokaal in je browser opgeslagen. Daardoor blijven je spelers, wedstrijden en teams bewaard wanneer je de pagina opnieuw opent."
        },
        {
            question: "Kan ik een speler aanpassen?",
            answer:
                "Ja. Ga naar Spelers en klik bij de gewenste speler op 'Bewerken'."
        },
        {
            question: "Kan ik een wedstrijd verwijderen?",
            answer:
                "Ja. Ga naar Wedstrijden en klik bij de gewenste wedstrijd op 'Verwijderen'."
        },
        {
            question: "Kan ik zelf een teamnaam typen?",
            answer:
                "Ja. Bij het toevoegen van spelers en wedstrijden kun je een bestaand team kiezen of zelf een teamnaam invoeren."
        }
    ];

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

    function addTeam() {
        const teamName = newTeam.trim();



        if (teamName === "") {
            setTeamWarning("Vul een teamnaam in.");
            return;
        }

        const teamExists = teams.some(
            (team) =>
                team.name.toLowerCase() ===
                teamName.toLowerCase()
        );

        if (teamExists) {
            setTeamWarning("Dit team bestaat al.");
            return;
        }

        setTeams((currentTeams) => [
            ...currentTeams,
            {
                id: Date.now(),
                name: teamName
            }
        ]);

        setNewTeam("");
        setTeamWarning("");
    }
    function deleteTeam(id: number) {
        setTeams((currentTeams) =>
            currentTeams.filter(
                (team) => team.id !== id
            )
        );
    }
    return (
        <div className="settings-page">
            <h1>⚙️ Instellingen</h1>

            <div className="settings-list">
                <div className="setting-row">
                    <div>
                        <strong>Teams</strong>

                        <small>
                            Voeg teams toe die je in je
                            voetbaltracker wilt gebruiken.
                        </small>
                    </div>

                    <div className="team-setting-form">
                        <input
                            type="text"
                            placeholder="Nieuwe teamnaam"
                            value={newTeam}
                            onChange={(e) => {
                                setNewTeam(e.target.value);
                                setTeamWarning("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addTeam();
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={addTeam}
                        >
                            + Team toevoegen
                        </button>

                        {teamWarning && (
                            <small className="team-warning">
                                {teamWarning}
                            </small>
                        )}
                    </div>
                </div>

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

            <div className="teams-list">
                <h2>Teams</h2>

                {teams.map((team) => (
                    <div
                        className="team-item"
                        key={team.id}
                    >
                        <span>{team.name}</span>
                        <button
                            type="button"
                            onClick={() => deleteTeam(team.id)}
                        >
                            Verwijderen
                        </button>
                    </div>
                ))}
            </div>

            {showPlayerPopup && (
                <PlayerForm
                    editingPlayer={editingPlayer}
                    setEditingPlayer={setEditingPlayer}
                    setPlayerList={setPlayerList}
                    closeModal={closePlayerPopup}
                    teams ={teams}
                />
            )}

            {showMatchPopup && (
                <MatchForm
                    editingMatch={editingMatch}
                    setEditingMatch={setEditingMatch}
                    setMatches={setMatches}
                    closeModal={closeMatchPopup}
                    teams={teams}
                />
            )}

            <div className="faq-section">
                <h2>❓Veelgestelde vragen</h2>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            className="faq-item"
                            key={faq.question}
                        >
                            <button
                                type="button"
                                className="faq-question"
                                onClick={() =>
                                    setOpenQuestion(
                                        openQuestion === index
                                            ? null
                                            : index
                                    )
                                }
                            >
                                <span>{faq.question}</span>

                                <span>
                                    {openQuestion === index
                                        ? "−"
                                        : "+"}
                                </span>
                            </button>

                            {openQuestion === index && (
                                <div className="faq-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;