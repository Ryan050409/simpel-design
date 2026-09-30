import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import MatchCard from "./MatchCard.tsx";
import MatchForm from "./MatchForm.tsx";
import type { Match, Team } from "./types.ts"

type MatchesPageProps = {
    matches: Match[];
    setMatches: Dispatch<SetStateAction<Match[]>>;
    team: string;
    teams: Team[];
};

function MatchesPage({
    matches,
    setMatches,
    team,
    teams
}: MatchesPageProps) {
    function deleteMatch(id: number) {
        setMatches((currentMatches) =>
            currentMatches.filter(
                (match) => match.id !== id
            )
        );
    }
    const [editingMatch, setEditingMatch] =
        useState<Match | null>(null);
    function editMatch(match: Match) {
        setEditingMatch(match);
    }
    function closeModal() {
        setEditingMatch(null);
    }
    return (
        <div className="matches-page">
            <div className="matches-page-header">
                <div>
                    <h1>⚽ Wedstrijden</h1>
                    <h2>{team}</h2>
                </div>

                <NavLink
                    className="add-player-button"
                    to="/instellingen"
                >
                    ⚙️ Wedstrijd toevoegen
                </NavLink>
            </div>
            <table className="matches-table">
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Thuis</th>
                        <th>Uit</th>
                        <th>Uitslag</th>
                        <th>Resultaat</th>
                        <th>Acties</th>
                    </tr>
                </thead>

                <tbody>
                    {matches.map((match) => (
                        <tr
                            key={match.id}
                            className={
                                match.home === team
                                    ? match.homeGoals > match.awayGoals
                                        ? "match-row-win"
                                        : match.homeGoals === match.awayGoals
                                            ? "match-row-draw"
                                            : "match-row-loss"
                                    : match.awayGoals > match.homeGoals
                                        ? "match-row-win"
                                        : match.awayGoals === match.homeGoals
                                            ? "match-row-draw"
                                            : "match-row-loss"
                            }
                        >
                            <td>{match.date}</td>
                            <td>{match.home}</td>
                            <td>{match.away}</td>
                            <td>
                                {match.homeGoals} - {match.awayGoals}
                            </td>
                            <td>
                                <span
                                    className={
                                        match.home === team || match.away === team
                                            ? match.home === team
                                                ? match.homeGoals > match.awayGoals
                                                    ? "match-row-win"
                                                    : match.homeGoals === match.awayGoals
                                                        ? "match-row-draw"
                                                        : "match-row-loss"
                                                : match.awayGoals > match.homeGoals
                                                    ? "match-row-win"
                                                    : match.awayGoals === match.homeGoals
                                                        ? "match-row-draw"
                                                        : "match-row-loss"
                                            : undefined
                                    }
                                >
                                    {match.home === team
                                        ? match.homeGoals > match.awayGoals
                                            ? "W"
                                            : match.homeGoals === match.awayGoals
                                                ? "G"
                                                : "V"
                                        : match.awayGoals > match.homeGoals
                                            ? "W"
                                            : match.awayGoals === match.homeGoals
                                                ? "G"
                                                : "V"}
                                </span>
                            </td>
                            <td className="match-actions">
                                <button onClick={() => editMatch(match)}>
                                    Bewerken
                                </button>

                                <button onClick={() => deleteMatch(match.id)}>
                                    Verwijderen
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingMatch && (
                <MatchForm
                    editingMatch={editingMatch}
                    setEditingMatch={setEditingMatch}
                    setMatches={setMatches}
                    closeModal={closeModal}
                    teams={teams}
                />
            )}
        </div>
    );
}


export default MatchesPage;