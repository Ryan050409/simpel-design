
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

export type Player = {
  name: string;
  team: string;
  goals: number;
  assists: number;
  matches: number;
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

function App() {
  const [team, setTeam] = useState("Feyenoord");

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

