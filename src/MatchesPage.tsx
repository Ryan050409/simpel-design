import { useState } from "react";
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
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [editingMatch, setEditingMatch] =
    useState<Match | null>(null);

  function addMatch() {
    if (
      home.trim() === "" ||
      away.trim() === ""
    ) {
      return;
    }

    const newMatch: Match = {
      id: editingMatch
        ? editingMatch.id
        : Date.now(),
      home,
      away,
      homeGoals,
      awayGoals,
      date
    };

    if (editingMatch) {
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          match.id === editingMatch.id
            ? newMatch
            : match
        )
      );
    } else {
      setMatches((currentMatches) =>
        [...currentMatches, newMatch].sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        )
      );
    }

    resetForm();
  }

  function deleteMatch(id: number) {
    setMatches((currentMatches) =>
      currentMatches.filter(
        (match) => match.id !== id
      )
    );
  }

  function editMatch(match: Match) {
    setEditingMatch(match);

    setHome(match.home);
    setAway(match.away);
    setHomeGoals(match.homeGoals);
    setAwayGoals(match.awayGoals);
    setDate(match.date);
  }

  function resetForm() {
    setHome("");
    setAway("");
    setHomeGoals(0);
    setAwayGoals(0);
    setDate(
      new Date().toISOString().split("T")[0]
    );
    setEditingMatch(null);
  }

  function getResult(match: Match) {
    if (match.homeGoals === match.awayGoals) {
      return "G";
    }

    const teamGoals =
      match.home === team
        ? match.homeGoals
        : match.awayGoals;

    const opponentGoals =
      match.home === team
        ? match.awayGoals
        : match.homeGoals;

    return teamGoals > opponentGoals
      ? "W"
      : "V";
  }

  function getResultClass(match: Match) {
    const result = getResult(match);

    if (result === "W") {
      return "result-win";
    }

    if (result === "G") {
      return "result-draw";
    }

    return "result-loss";
  }

  return (
    <div className="matches-page">
      <h1>🏟️ Wedstrijden</h1>

      <h2>{team}</h2>

      <div className="match-form">
        <input
          list="teams"
          type="text"
          placeholder="Thuisteam"
          value={home}
          onChange={(e) =>
            setHome(e.target.value)
          }
        />

        <input
          list="teams"
          type="text"
          placeholder="Uitteam"
          value={away}
          onChange={(e) =>
            setAway(e.target.value)
          }
        />

        <datalist id="teams">
          <option value="Ajax" />
          <option value="PSV" />
          <option value="Feyenoord" />
          <option value="AZ" />
          <option value="FC Twente" />
          <option value="FC Utrecht" />
        </datalist>

        <input
          type="number"
          min="0"
          placeholder="Goals thuis"
          value={homeGoals}
          onChange={(e) =>
            setHomeGoals(
              Number(e.target.value)
            )
          }
        />

        <input
          type="number"
          min="0"
          placeholder="Goals uit"
          value={awayGoals}
          onChange={(e) =>
            setAwayGoals(
              Number(e.target.value)
            )
          }
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button onClick={addMatch}>
          {editingMatch
            ? "Wijzigingen opslaan"
            : "Wedstrijd toevoegen"}
        </button>

        {editingMatch && (
          <button onClick={resetForm}>
            Annuleren
          </button>
        )}
      </div>

      <div className="matches-list">
        {matches.map((match) => (
          <div
            key={match.id}
            className="match-wrapper"
          >
            <MatchCard
              match={match}
              onDelete={deleteMatch}
              onEdit={editMatch}
            />

            <div
              className={`match-result ${getResultClass(
                match
              )}`}
            >
              {getResult(match)}
            </div>

            <p className="match-date">
              {new Date(
                match.date
              ).toLocaleDateString("nl-NL")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchesPage;