import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import "./App.css";
import players from "./players.tsx";
import PlayersPage from "./PlayersPage.tsx";
import Dashboard from "./Dashboard.tsx";
import MatchesPage from "./MatchesPage.tsx";
import SettingsPage from "./SettingsPage.tsx";

export type Player = {
  name: string;
  team: string;
  position: string;
  number: number;
  goals: number;
  assists: number;
  matches: number;
  minutesplayed: number;
  rating: number;
};

export type Match = {
  id: number;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  date: string;
};

export type Team = {
  id: number;
  name: string;
};

function App() {
  const team = "Feyenoord";

  const [playerList, setPlayerList] = useState<Player[]>(
    () => {
      const savedPlayers =
        localStorage.getItem("players");

      return savedPlayers
        ? JSON.parse(savedPlayers)
        : players;
    }
  );

  const [matches, setMatches] = useState<Match[]>(
    () => {
      const savedMatches =
        localStorage.getItem("matches");

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
          date: "2026-09-06"
        },
        {
          id: 2,
          home: "Ajax",
          away: "Feyenoord",
          homeGoals: 2,
          awayGoals: 2,
          date: "2026-09-03"
        },
        {
          id: 3,
          home: "Feyenoord",
          away: "PSV",
          homeGoals: 4,
          awayGoals: 1,
          date: "2026-08-30"
        }
      ];
    }
  );

  const [teams, setTeams] = useState<Team[]>(
    () => {
      const savedTeams =
        localStorage.getItem("teams");

      return savedTeams
        ? JSON.parse(savedTeams)
        : [
            {
              id: 1,
              name: "Ajax"
            },
            {
              id: 2,
              name: "PSV"
            },
            {
              id: 3,
              name: "Feyenoord"
            },
            {
              id: 4,
              name: "AZ"
            },
            {
              id: 5,
              name: "FC Twente"
            },
            {
              id: 6,
              name: "FC Utrecht"
            }
          ];
    }
  );

  useEffect(() => {
    localStorage.setItem(
      "players",
      JSON.stringify(playerList)
    );
  }, [playerList]);

  useEffect(() => {
    localStorage.setItem(
      "matches",
      JSON.stringify(matches)
    );
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(
      "teams",
      JSON.stringify(teams)
    );
  }, [teams]);

  return (
    <BrowserRouter>
      <nav className="nav">
        <NavLink to="/">
          Dashboard
        </NavLink>

        <NavLink to="/wedstrijden">
          Wedstrijden
        </NavLink>

        <NavLink to="/spelers">
          Spelers
        </NavLink>

        <NavLink to="/instellingen">
          Instellingen
        </NavLink>
      </nav>

      <Routes>
        <Route
          path="/"
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
            />
          }
        />

        <Route
          path="/spelers"
          element={
            <PlayersPage
              playerList={playerList}
              setPlayerList={setPlayerList}
            />
          }
        />

        <Route
          path="/instellingen"
          element={
            <SettingsPage
              setMatches={setMatches}
              setPlayerList={setPlayerList}
              teams={teams}
              setTeams={setTeams}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;