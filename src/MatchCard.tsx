import type { Match} from "./types";

type MatchCardProps = {
  match: Match;
  onDelete: (id: number) => void;
  onEdit: (match: Match) => void;
};

function MatchCard({ match, onDelete, onEdit }: MatchCardProps) {
  let resultClass = "";

  if (match.homeGoals === match.awayGoals) {
    resultClass = "result-draw";
  } else if (match.homeGoals > match.awayGoals) {
    resultClass = "home-win away-loss";
  } else {
    resultClass = "away-win home-loss";
  }

  return (
    <div className={`match-card ${resultClass}`}>
      <div className="match-header">
        <span>{match.date}</span>

        <span className="match-result">
          {match.homeGoals === match.awayGoals
            ? "G"
            : match.homeGoals > match.awayGoals
              ? "W"
              : "V"}
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