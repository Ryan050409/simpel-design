import {useState} from "react";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import MatchCard from "./MatchCard.tsx";
import MatchForm from "./MatchForm.tsx";
type Match = {
    id: number;
    home: string;
    away: string;
    homeGoals: number;
    awayGoals: number;
    date: string;
};
 type Team = { 
    id: number; 
    name: string;
 }
type MatchesPageProps = {
    matches: Match[];
    setMatches: Dispatch<SetStateAction<Match[]>>;
    team: string;
    teams: Team[];
};
 const [editingMatch, setEditingMatch] = 
    useState<Match | null>(null);
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