import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import "./App.css";
import players from "./players.tsx";
import PlayersPage from "./PlayersPage.tsx";
import Dashboard from "./Dashboard.tsx";
import MatchesPage from "./MatchesPage.tsx";
import SettingsPage from "./SettingsPage.tsx";

import type { Player, Match, Team } from "./types.ts";

function App() {
  const [team, setTeam] = useState(() => {
    return localStorage.getItem("favoriteTeam") || "Feyenoord";
  });

  const [playerList, setPlayerList] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");

    if (!savedPlayers) {
      return players;
    }

    try {
      const parsedPlayers = JSON.parse(savedPlayers);

      return parsedPlayers.map((player: Player, index: number) => ({
        ...player,
        id: player.id ?? Date.now() + index,
      }));
    } catch {
      return players;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const savedMatches = localStorage.getItem("matches");

    if (savedMatches) {
      return JSON.parse(savedMatches);
    }

    return [
      {
        id: 1,
        home: "Ajax",
        away: "PSV",
        homeGoals: 3,
        awayGoals: 1,
        date: "2026-09-06",
      },
      {
        id: 2,
        home: "Ajax",
        away: "Feyenoord",
        homeGoals: 2,
        awayGoals: 2,
        date: "2026-09-03",
      },
      {
        id: 3,
        home: "Feyenoord",
        away: "PSV",
        homeGoals: 4,
        awayGoals: 1,
        date: "2026-08-30",
      },
      {
        id: 4,
        home: "AZ",
        away: "Ajax",
        homeGoals: 1,
        awayGoals: 2,
        date: "2026-08-27",
      },
      {
        id: 5,
        home: "PSV",
        away: "AZ",
        homeGoals: 3,
        awayGoals: 0,
        date: "2026-08-24",
      },
      {
        id: 6,
        home: "Feyenoord",
        away: "AZ",
        homeGoals: 1,
        awayGoals: 1,
        date: "2026-08-21",
      },
      {
        id: 7,
        home: "FC Twente",
        away: "Ajax",
        homeGoals: 0,
        awayGoals: 2,
        date: "2026-08-18",
      },
      {
        id: 8,
        home: "FC Utrecht",
        away: "Feyenoord",
        homeGoals: 1,
        awayGoals: 3,
        date: "2026-08-15",
      },
      {
        id: 9,
        home: "PSV",
        away: "FC Utrecht",
        homeGoals: 2,
        awayGoals: 2,
        date: "2026-08-12",
      },
      {
        id: 10,
        home: "AZ",
        away: "FC Twente",
        homeGoals: 2,
        awayGoals: 1,
        date: "2026-08-09",
      },
      {
        id: 11,
        home: "FC Twente",
        away: "PSV",
        homeGoals: 1,
        awayGoals: 3,
        date: "2026-08-06",
      },
      {
        id: 12,
        home: "FC Utrecht",
        away: "AZ",
        homeGoals: 0,
        awayGoals: 0,
        date: "2026-08-03",
      },
    ];
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const savedTeams = localStorage.getItem("teams");

    return savedTeams
      ? JSON.parse(savedTeams)
      : [
          {
            id: 1,
            name: "Ajax",
          },
          {
            id: 2,
            name: "PSV",
          },
          {
            id: 3,
            name: "Feyenoord",
          },
          {
            id: 4,
            name: "AZ",
          },
          {
            id: 5,
            name: "FC Twente",
          },
          {
            id: 6,
            name: "FC Utrecht",
          },
        ];
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

  return (
    <BrowserRouter>
      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/wedstrijden">Wedstrijden</NavLink>

        <NavLink to="/spelers">Spelers</NavLink>

        <NavLink to="/instellingen">Instellingen</NavLink>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard matches={matches} playerList={playerList} team={team} />
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
              setMatches={setMatches}
              setPlayerList={setPlayerList}
              setTeams={setTeams}
              teams={teams}
              team={team}
              setTeam={setTeam}
              players={playerList}
              matches={matches}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
