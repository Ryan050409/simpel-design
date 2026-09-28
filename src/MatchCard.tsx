type Match = {
    id: number;
    home: string;
    away: string;
    homeGoals: number;
    awayGoals: number;
    date: string;
};

type MatchCardProps = {
    match: Match;
    onDelete: (id: number) => void;
    onEdit: (match: Match) => void;
};

function MatchCard({
    match,
    onDelete,
    onEdit
}: MatchCardProps) {

    const result =
        match.homeGoals > match.awayGoals
            ? "W"
            : match.homeGoals < match.awayGoals
                ? "V"
                : "G";

    return (
        <div className={`match-card result-${result.toLowerCase()}`}>
            <div className="match-header">
                <span>{match.date}</span>
                <span className="match-result">
                    {result}
                </span>
            </div>

            <div className="match-teams">
                <div className="match-team">
                    <strong>{match.home}</strong>
                </div>

                <div className="match-score">
                    <span>{match.homeGoals}</span>
                    <span>-</span>
                    <span>{match.awayGoals}</span>
                </div>

                <div className="match-team">
                    <strong>{match.away}</strong>
                </div>
            </div>

            <div className="match-actions">
                <button onClick={() => onEdit(match)}>
                    Bewerken
                </button>

                <button onClick={() => onDelete(match.id)}>
                    Verwijderen
                </button>
            </div>
        </div>
    );
}

export default MatchCard;