import type { Match } from "./App";

type Props = {
  match: Match;
  onDelete: (id: number) => void;
  onEdit: (match: Match) => void;
};

function MatchCard({ match, onDelete, onEdit }: Props) {
  return (
    <article className="match-card">
      <div className="match-teams">
        <div><span>{match.home}</span><strong>{match.homeGoals}</strong></div>
        <span className="match-separator">-</span>
        <div><strong>{match.awayGoals}</strong><span>{match.away}</span></div>
      </div>
      <div className="match-buttons">
        <button onClick={() => onEdit(match)}>Bewerken</button>
        <button className="button-danger" onClick={() => onDelete(match.id)}>Verwijderen</button>
      </div>
    </article>
  );
}

export default MatchCard;
