import {useState} from "react";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import MatchCard from "./MatchCard.tsx";
import MatchForm from "./MatchForm.tsx";
import type {Match, Team} from "./types.ts"

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

            <div className="matches-list">
                {matches.map((match) => (
                    <MatchCard
                        key={match.id}
                        match={match}
                        onDelete={deleteMatch}
                        onEdit={editMatch}
                    />
                ))}
                
            </div>
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