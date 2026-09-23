type Match = {
  id: number;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
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
  return (
    <div className="match-card">

      <h2>
        {match.home} {match.homeGoals} - {match.awayGoals} {match.away}
      </h2>

      <div className="match-buttons">
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