import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import MatchForm from "./MatchForm.tsx";
import type { Match, Team } from "./types.ts";

type MatchesPageProps = {
    matches: Match[];
    setMatches: Dispatch<SetStateAction<Match[]>>;
    team: string;
    teams: Team[];
};

function getMatchResult(match: Match, team: string) {
    if (match.home !== team && match.away !== team) {
        return null;
    }

    const teamGoals =
        match.home === team
            ? match.homeGoals
            : match.awayGoals;

    const opponentGoals =
        match.home === team
            ? match.awayGoals
            : match.homeGoals;

    if (teamGoals > opponentGoals) return "W";
    if (teamGoals === opponentGoals) return "G";
    return "V";
}

function getResultClass(result: string | null) {
    if (result === "W") return "result-win";
    if (result === "G") return "result-draw";
    if (result === "V") return "result-loss";
    return undefined;
}

function getRowClass(result: string | null) {
    if (result === "W") return "match-row-win";
    if (result === "G") return "match-row-draw";
    if (result === "V") return "match-row-loss";
    return undefined;
}

function MatchesPage({
    matches,
    setMatches,
    team,
    teams
}: MatchesPageProps) {
    const [editingMatch, setEditingMatch] =
        useState<Match | null>(null);

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

    function getMatchResult(match: Match) {
        if (
            match.home !== team &&
            match.away !== team
        ) {
            return null;
        }

        const teamGoals =
            match.home === team
                ? match.homeGoals
                : match.awayGoals;

        const opponentGoals =
            match.home === team
                ? match.awayGoals
                : match.homeGoals;

        if (teamGoals > opponentGoals) {
            return "W";
        }

        if (teamGoals === opponentGoals) {
            return "G";
        }

        return "V";
    }

    function getResultClass(result: string | null) {
        if (result === "W") {
            return "result-win";
        }

        if (result === "G") {
            return "result-draw";
        }

        if (result === "V") {
            return "result-loss";
        }

        return undefined;
    }

    function getRowClass(result: string | null) {
        if (result === "W") {
            return "match-row-win";
        }

        if (result === "G") {
            return "match-row-draw";
        }

        if (result === "V") {
            return "match-row-loss";
        }

        return undefined;
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
                    {matches.map((match) => {
                        const result = getMatchResult(match);

                        return (
                            <tr
                                key={match.id}
                                className={getRowClass(result)}
                            >
                                <td>{match.date}</td>

                                <td>{match.home}</td>

                                <td>{match.away}</td>

                                <td>
                                    {match.homeGoals} -{" "}
                                    {match.awayGoals}
                                </td>

                                <td>
                                    <span
                                        className={getResultClass(
                                            result
                                        )}
                                    >
                                        {result ?? "-"}
                                    </span>
                                </td>

                                <td className="match-actions">
                                    <button
                                        onClick={() =>
                                            editMatch(match)
                                        }
                                    >
                                        Bewerken
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteMatch(match.id)
                                        }
                                    >
                                        Verwijderen
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
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
