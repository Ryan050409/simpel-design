import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import "./App.css";
import PlayersPage from "./PlayersPage.tsx";
import Dashboard from "./Dashboard.tsx";
import MatchesPage from "./MatchesPage.tsx";
import SettingsPage from "./SettingsPage.tsx";
import HomePage from "./HomePage";

import type { Player, Match, Team } from "./types.ts";

/*
  TIJDELIJKE SEEDDATA
  Deze data wordt één keer gebruikt om localStorage te vullen.
  Nadat alles goed werkt, kunnen we deze data weer uit App.tsx halen.
*/

const seedTeams: Team[] = [
  { id: 1, name: "ADO Den Haag" },
  { id: 2, name: "Ajax" },
  { id: 3, name: "AZ" },
  { id: 4, name: "Excelsior Rotterdam" },
  { id: 5, name: "FC Groningen" },
  { id: 6, name: "FC Twente" },
  { id: 7, name: "FC Utrecht" },
  { id: 8, name: "Feyenoord" },
  { id: 9, name: "Fortuna Sittard" },
  { id: 10, name: "Go Ahead Eagles" },
  { id: 11, name: "N.E.C. Nijmegen" },
  { id: 12, name: "PEC Zwolle" },
  { id: 13, name: "PSV" },
  { id: 14, name: "SC Cambuur" },
  { id: 15, name: "sc Heerenveen" },
  { id: 16, name: "Sparta Rotterdam" },
  { id: 17, name: "Telstar" },
  { id: 18, name: "Willem II" },
];

const firstNames = [
  "Lucas"
];

const lastNames = [
  "Jansen"
];

const positions = [
  "Keeper",
  "Verdediger",
  "Verdediger",
  "Middenvelder",
  "Aanvaller",
];

function createSeedPlayers(): Player[] {
  const players: Player[] = [];

  seedTeams.forEach((team, teamIndex) => {
    for (let i = 0; i < 5; i++) {
      const playerIndex = teamIndex * 5 + i;

const firstname = firstNames[playerIndex];
const lastname = lastNames[playerIndex];

      const matches = 10 + ((teamIndex * 3 + i * 2) % 17);

      let goals = 0;
      let assists = 0;
      let tackles = 0;
      let interceptions = 0;
      let blocks = 0;
      let clearances = 0;
      let duelsWon = 0;
      let fouls = 0;
      let rating = 6.5;

      if (positions[i] === "Keeper") {
        rating = 6.8 + ((teamIndex + i) % 12) / 10;
        tackles = 4 + teamIndex % 5;
        interceptions = 3 + teamIndex % 4;
        blocks = 2 + teamIndex % 3;
        clearances = 8 + teamIndex % 7;
        duelsWon = 5 + teamIndex % 6;
        fouls = 1 + teamIndex % 3;
      }

      if (positions[i] === "Verdediger") {
        goals = 1 + ((teamIndex + i) % 5);
        assists = 1 + ((teamIndex + i * 2) % 5);
        tackles = 15 + ((teamIndex * 2 + i) % 16);
        interceptions = 10 + ((teamIndex + i * 3) % 18);
        blocks = 4 + ((teamIndex + i) % 8);
        clearances = 15 + ((teamIndex * 2 + i) % 25);
        duelsWon = 20 + ((teamIndex + i * 2) % 25);
        fouls = 3 + ((teamIndex + i) % 7);
        rating = 6.7 + ((teamIndex + i) % 12) / 10;
      }

      if (positions[i] === "Middenvelder") {
        goals = 3 + ((teamIndex * 2 + i) % 8);
        assists = 3 + ((teamIndex + i * 2) % 8);
        tackles = 12 + ((teamIndex + i) % 18);
        interceptions = 8 + ((teamIndex * 2 + i) % 15);
        blocks = 2 + ((teamIndex + i) % 6);
        clearances = 5 + ((teamIndex + i) % 10);
        duelsWon = 20 + ((teamIndex * 2 + i) % 30);
        fouls = 4 + ((teamIndex + i) % 8);
        rating = 6.9 + ((teamIndex + i) % 12) / 10;
      }

      if (positions[i] === "Aanvaller") {
        goals = 5 + ((teamIndex * 2 + i) % 12);
        assists = 3 + ((teamIndex + i * 3) % 9);
        tackles = 5 + ((teamIndex + i) % 10);
        interceptions = 2 + ((teamIndex + i) % 7);
        blocks = 1 + ((teamIndex + i) % 4);
        clearances = 2 + ((teamIndex + i) % 6);
        duelsWon = 15 + ((teamIndex * 2 + i) % 25);
        fouls = 2 + ((teamIndex + i) % 6);
        rating = 7.0 + ((teamIndex + i) % 12) / 10;
      }

      const minutesplayed = matches * 60 + ((teamIndex + i) * 13);

      players.push({
        id: 1000 + team.id * 10 + i,
        firstname,
        lastname,
        team: team.name,
        position: positions[i],
        number:
  positions[i] === "Keeper"
    ? 1
    : positions[i] === "Verdediger"
      ? i === 1
        ? 2
        : 4
      : positions[i] === "Middenvelder"
        ? 8
        : 9,
        goals,
        assists,
        matches,
        minutesplayed,
        rating: Number(rating.toFixed(1)),
        tackles,
        interceptions,
        blocks,
        clearances,
        duelsWon,
        fouls,
        ...(positions[i] === "Keeper"
          ? {
              cleanSheets: 2 + ((teamIndex + 2) % 7),
              saves: 15 + ((teamIndex * 3) % 30),
              oneVSOneSaves: 2 + (teamIndex % 5),
              penaltySaves: teamIndex % 3,
              goalsConceded: 8 + ((teamIndex * 2) % 15),
            }
          : {}),
      });
    }
  });

  return players;
}

const seedPlayers = createSeedPlayers();

const seedMatches: Match[] = [
];

function App() {
  const [team, setTeam] = useState(() => {
    return localStorage.getItem("favoriteTeam") || "Feyenoord";
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  const [playerList, setPlayerList] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");

    if (savedPlayers) {
      try {
        const parsedPlayers: Player[] = JSON.parse(savedPlayers);

        return parsedPlayers.map((player, index) => ({
          ...player,
          id: player.id ?? Date.now() + index,
        }));
      } catch {
        return seedPlayers;
      }
    }

    return seedPlayers;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const savedMatches = localStorage.getItem("matches");

    if (savedMatches) {
      try {
        return JSON.parse(savedMatches);
      } catch {
        return seedMatches;
      }
    }

    return seedMatches;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const savedTeams = localStorage.getItem("teams");

    if (savedTeams) {
      try {
        return JSON.parse(savedTeams);
      } catch {
        return seedTeams;
      }
    }

    return seedTeams;
  });

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(playerList));
  }, [playerList]);

  useEffect(() => {
    localStorage.setItem("favoriteTeam", team);
  }, [team]);

  useEffect(() => {
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className={`app ${theme}`}>
        <nav className="nav">
          <NavLink to="/">🏠 Home</NavLink>

          <NavLink to="/dashboard">📊 Statistieken</NavLink>

          <NavLink to="/wedstrijden">⚽ Wedstrijden</NavLink>

          <NavLink to="/spelers">👥 Spelers</NavLink>

          <NavLink to="/instellingen">⚙️ Instellingen</NavLink>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                matches={matches}
                playerList={playerList}
                team={team}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                matches={matches}
                playerList={playerList}
                team={team}
              />
            }
          />

          <Route
            path="/wedstrijden"
            element={
              <MatchesPage
                matches={matches}
                setMatches={setMatches}
                team={team}
                teams={teams}
              />
            }
          />

          <Route
            path="/spelers"
            element={
              <PlayersPage
                playerList={playerList}
                setPlayerList={setPlayerList}
                teams={teams}
              />
            }
          />

          <Route
            path="/instellingen"
            element={
              <SettingsPage
                setTeams={setTeams}
                teams={teams}
                team={team}
                setTeam={setTeam}
                players={playerList}
                matches={matches}
                theme={theme}
                setTheme={setTheme}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;