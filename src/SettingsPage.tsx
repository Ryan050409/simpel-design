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
  function addMatch() {
    const home = (
      document.getElementById("settings-home") as HTMLInputElement
    ).value;

    const away = (
      document.getElementById("settings-away") as HTMLInputElement
    ).value;

    const homeGoals = Number(
      (document.getElementById("settings-home-goals") as HTMLInputElement)
        .value
    );

    const awayGoals = Number(
      (document.getElementById("settings-away-goals") as HTMLInputElement)
        .value
    );

    const date = (
      document.getElementById("settings-date") as HTMLInputElement
    ).value;

    if (!home || !away || !date) {
      return;
    }

    const newMatch: Match = {
      id: Date.now(),
      home,
      away,
      homeGoals,
      awayGoals,
      date
    };

    setMatches([...matches, newMatch]);
  }

  function addPlayer() {
    const name = (
      document.getElementById("settings-player-name") as HTMLInputElement
    ).value;

    const team = (
      document.getElementById("settings-player-team") as HTMLInputElement
    ).value;

    const position = (
      document.getElementById("settings-player-position") as HTMLInputElement
    ).value;

    const goals = Number(
      (document.getElementById("settings-player-goals") as HTMLInputElement)
        .value
    );

    const assists = Number(
      (
        document.getElementById(
          "settings-player-assists"
        ) as HTMLInputElement
      ).value
    );

    const playerMatches = Number(
      (
        document.getElementById(
          "settings-player-matches"
        ) as HTMLInputElement
      ).value
    );

    const minutesplayed = Number(
      (
        document.getElementById(
          "settings-player-minutes"
        ) as HTMLInputElement
      ).value
    );

    const rating = Number(
      (
        document.getElementById(
          "settings-player-rating"
        ) as HTMLInputElement
      ).value
    );

    if (!name || !team || !position) {
      return;
    }

    const newPlayer: Player = {
      name,
      team,
      position,
      goals,
      assists,
      matches: playerMatches,
      minutesplayed,
      rating
    };

    setPlayerList([...playerList, newPlayer]);
  }

  return (
    <div className="settings-page">
      <h1>⚙️ Instellingen</h1>

      <section>
        <h2>Wedstrijd toevoegen</h2>

        <div className="match-form">
          <input
            id="settings-home"
            list="settings-teams"
            type="text"
            placeholder="Thuisteam"
          />

          <input
            id="settings-away"
            list="settings-teams"
            type="text"
            placeholder="Uitteam"
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
            id="settings-home-goals"
            type="number"
            min="0"
            placeholder="Goals thuis"
          />

          <input
            id="settings-away-goals"
            type="number"
            min="0"
            placeholder="Goals uit"
          />

          <input
            id="settings-date"
            type="date"
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
            id="settings-player-name"
            type="text"
            placeholder="Naam speler"
          />

          <input
            id="settings-player-team"
            list="settings-player-teams"
            type="text"
            placeholder="Team"
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
            id="settings-player-position"
            list="settings-positions"
            type="text"
            placeholder="Positie"
          />

          <datalist id="settings-positions">
            <option value="Keeper" />
            <option value="Verdediger" />
            <option value="Middenvelder" />
            <option value="Aanvaller" />
          </datalist>

          <input
            id="settings-player-goals"
            type="number"
            min="0"
            placeholder="Goals"
          />

          <input
            id="settings-player-assists"
            type="number"
            min="0"
            placeholder="Assists"
          />

          <input
            id="settings-player-matches"
            type="number"
            min="0"
            placeholder="Wedstrijden"
          />

          <input
            id="settings-player-minutes"
            type="number"
            min="0"
            placeholder="Gespeelde minuten"
          />

          <input
            id="settings-player-rating"
            type="number"
            min="0"
            step="0.1"
            placeholder="Rating"
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