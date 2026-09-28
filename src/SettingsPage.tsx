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
  const [favoriteTeam, setFavoriteTeam] =
    useState("Feyenoord");

  const [showPlayerPopup, setShowPlayerPopup] =
    useState(false);

  const [showMatchPopup, setShowMatchPopup] =
    useState(false);

  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [position, setPosition] = useState("");
  const [goals, setGoals] = useState("");
  const [assists, setAssists] = useState("");
  const [matchesPlayed, setMatchesPlayed] =
    useState("");
  const [minutesPlayed, setMinutesPlayed] =
    useState("");
  const [rating, setRating] = useState("");

  function addPlayer() {
    if (
      name.trim() === "" ||
      team.trim() === "" ||
      position.trim() === ""
    ) {
      return;
    }

    const newPlayer: Player = {
      name: name.trim(),
      team: team.trim(),
      position: position.trim(),
      goals: Number(goals) || 0,
      assists: Number(assists) || 0,
      matches: Number(matchesPlayed) || 0,
      minutesplayed: Number(minutesPlayed) || 0,
      rating: Number(rating) || 0
    };

    setPlayerList((currentPlayers) => [
      ...currentPlayers,
      newPlayer
    ]);

    setName("");
    setTeam("");
    setPosition("");
    setGoals("");
    setAssists("");
    setMatchesPlayed("");
    setMinutesPlayed("");
    setRating("");

    setShowPlayerPopup(false);
  }

  return (
    <div className="settings-page">
      <h1>⚙️ Instellingen</h1>

      <div className="settings-list">

        <label className="setting-row">
          <span>
            <strong>Favoriet team</strong>
            <small>
              Gebruik dit team in je dashboard.
            </small>
          </span>

          <select
            value={favoriteTeam}
            onChange={(event) =>
              setFavoriteTeam(event.target.value)
            }
          >
            <option>Feyenoord</option>
            <option>Ajax</option>
            <option>PSV</option>
            <option>AZ</option>
          </select>
        </label>

        <div className="settings-action-section">
          <div>
            <strong>Spelers</strong>
            <small>
              Voeg een nieuwe speler toe aan je tracker.
            </small>
          </div>

          <button
            type="button"
            onClick={() => setShowPlayerPopup(true)}
          >
            + Speler toevoegen
          </button>
        </div>

        <div className="settings-action-section">
          <div>
            <strong>Wedstrijden</strong>
            <small>
              Voeg een nieuwe wedstrijd toe aan je tracker.
            </small>
          </div>

          <button
            type="button"
            onClick={() => setShowMatchPopup(true)}
          >
            + Wedstrijd toevoegen
          </button>
        </div>

      </div>

      {showPlayerPopup && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <div>
                <span>Spelerbeheer</span>
                <h2>Speler toevoegen</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowPlayerPopup(false)}
                aria-label="Sluit popup"
              >
                ×
              </button>
            </div>

            <div className="form-grid">

              <input
                type="text"
                placeholder="Naam speler"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

              <input
                list="player-teams"
                type="text"
                placeholder="Team"
                value={team}
                onChange={(event) =>
                  setTeam(event.target.value)
                }
              />

              <datalist id="player-teams">
                <option value="Feyenoord" />
                <option value="Ajax" />
                <option value="PSV" />
                <option value="AZ" />
                <option value="FC Twente" />
                <option value="FC Utrecht" />
              </datalist>

              <input
                list="player-positions"
                type="text"
                placeholder="Positie"
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value)
                }
              />

              <datalist id="player-positions">
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
                onChange={(event) =>
                  setGoals(event.target.value)
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Assists"
                value={assists}
                onChange={(event) =>
                  setAssists(event.target.value)
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Wedstrijden"
                value={matchesPlayed}
                onChange={(event) =>
                  setMatchesPlayed(event.target.value)
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Gespeelde minuten"
                value={minutesPlayed}
                onChange={(event) =>
                  setMinutesPlayed(event.target.value)
                }
              />

              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="Rating"
                value={rating}
                onChange={(event) =>
                  setRating(event.target.value)
                }
              />

            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowPlayerPopup(false)}
              >
                Annuleren
              </button>

              <button
                type="button"
                onClick={addPlayer}
              >
                Speler toevoegen
              </button>
            </div>

          </div>
        </div>
      )}

      {showMatchPopup && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <div>
                <span>Wedstrijdbeheer</span>
                <h2>Wedstrijd toevoegen</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowMatchPopup(false)}
                aria-label="Sluit popup"
              >
                ×
              </button>
            </div>

            <p>
              Hier komt straks het formulier om een
              wedstrijd toe te voegen.
            </p>

          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;