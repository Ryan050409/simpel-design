import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import MatchCard from "./MatchCard.tsx";

type Match = {
    id: number;
    home: string;
    away: string;
    homeGoals: number;
    awayGoals: number;
    date: string;
};

type MatchesPageProps = {
    matches: Match[];
    setMatches: Dispatch<SetStateAction<Match[]>>;
    team: string;
};

function MatchesPage({
    matches,
    setMatches,
    team
}: MatchesPageProps) {
    function deleteMatch(id: number) {
        setMatches((currentMatches) =>
            currentMatches.filter(
                (match) => match.id !== id
            )
        );
    }

    function editMatch(match: Match) {
        console.log("Wedstrijd bewerken:", match);
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
        </div>
    );
}

export default MatchesPage;