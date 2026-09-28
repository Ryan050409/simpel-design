import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type Player = {
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  minutesplayed: number;
  rating: number;
};

type Match = {
  id: number;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  date: string;
};

type SettingsPageProps = {
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
  playerList: Player[];
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
};

function SettingsPage({
  matches,
  setMatches,
  playerList,
  setPlayerList
}: SettingsPageProps) {
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [date, setDate] = useState("");

  const [name, setName] = useState("");
  const [playerTeam, setPlayerTeam] = useState("");
  const [position, setPosition] = useState("");
  const [goals, setGoals] = useState("");
  const [assists, setAssists] = useState("");
  const [playerMatches, setPlayerMatches] = useState("");
  const [minutesPlayed, setMinutesPlayed] = useState("");
  const [rating, setRating] = useState("");

  function addMatch() {
    if (
      home.trim() === "" ||
      away.trim() === "" ||
      date === ""
    ) {
      return;
    }

    const newMatch: Match = {
      id: Date.now(),
      home: home.trim(),
      away: away.trim(),
      homeGoals: Number(homeGoals) || 0,
      awayGoals: Number(awayGoals) || 0,
      date
    };

    setMatches((currentMatches) =>
      [...currentMatches, newMatch].sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
    );

    setHome("");
    setAway("");
    setHomeGoals("");
    setAwayGoals("");
    setDate("");
  }

  function addPlayer() {
    if (
      name.trim() === "" ||
      playerTeam.trim() === "" ||
      position.trim() === ""
    ) {
      return;
    }

    const newPlayer: Player = {
      name: name.trim(),
      team: playerTeam.trim(),
      position: position.trim(),
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      matches: Number(playerMatches) || 0,
      minutesplayed: Number(minutesPlayed) || 0,
      rating: Number(rating) || 0
    };

    setPlayerList((currentPlayers) => [
      ...currentPlayers,
      newPlayer
    ]);

    setName("");
    setPlayerTeam("");
    setPosition("");
    setGoals("");
    setAssists("");
    setPlayerMatches("");
    setMinutesPlayed("");
    setRating("");
  }

  return (
    <div className="settings-page">
      <h1>⚙️ Instellingen</h1>

      <section>
        <h2>Wedstrijd toevoegen</h2>

        <div className="match-form">
          <input
            list="settings-teams"
            type="text"
            placeholder="Thuisteam"
            value={home}
            onChange={(e) =>
              setHome(e.target.value)
            }
          />

          <input
            list="settings-teams"
            type="text"
            placeholder="Uitteam"
            value={away}
            onChange={(e) =>
              setAway(e.target.value)
            }
          />

          <datalist id="settings-teams">
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
              setHomeGoals(e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Goals uit"
            value={awayGoals}
            onChange={(e) =>
              setAwayGoals(e.target.value)
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
            Wedstrijd toevoegen
          </button>
        </div>
      </section>

      <section>
        <h2>Speler toevoegen</h2>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Naam speler"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            list="settings-player-teams"
            type="text"
            placeholder="Team"
            value={playerTeam}
            onChange={(e) =>
              setPlayerTeam(e.target.value)
            }
          />

          <datalist id="settings-player-teams">
            <option value="Ajax" />
            <option value="PSV" />
            <option value="Feyenoord" />
            <option value="AZ" />
            <option value="FC Twente" />
            <option value="FC Utrecht" />
          </datalist>

          <input
            list="settings-positions"
            type="text"
            placeholder="Positie"
            value={position}
            onChange={(e) =>
              setPosition(e.target.value)
            }
          />

          <datalist id="settings-positions">
            <option value="Keeper" />
            <option value="Verdediger" />
            <option value="Middenvelder" />
            <option value="Aanvaller" />
          </datalist>

          <input
            type="number"
            min="0"
            placeholder="Goals"
            value={goals}
            onChange={(e) =>
              setGoals(e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Assists"
            value={assists}
            onChange={(e) =>
              setAssists(e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Wedstrijden"
            value={playerMatches}
            onChange={(e) =>
              setPlayerMatches(e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Gespeelde minuten"
            value={minutesPlayed}
            onChange={(e) =>
              setMinutesPlayed(e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Rating"
            value={rating}
            onChange={(e) =>
              setRating(e.target.value)
            }
          />

          <button onClick={addPlayer}>
            Speler toevoegen
          </button>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;