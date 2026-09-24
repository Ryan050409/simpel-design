import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import players from "./players.tsx";
import Dashboard from "./Dashboard.tsx";
import MatchesPage from "./MatchesPage.tsx";
import PlayersPage from "./PlayersPage.tsx";

export type Position = "Keeper" | "Verdediger" | "Middenvelder" | "Aanvaller";

export type Player = {
  name: string;
  team: string;
  number: number;
  position: Position;
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

const defaultMatches: Match[] = [
  { id: 1, home: "Ajax", away: "PSV", homeGoals: 3, awayGoals: 1, date: "2026-09-06" },
  { id: 2, home: "Ajax", away: "Feyenoord", homeGoals: 2, awayGoals: 2, date: "2026-09-03" },
  { id: 3, home: "Feyenoord", away: "PSV", homeGoals: 4, awayGoals: 1, date: "2026-08-30" }
];

function App() {
  const [team, setTeam] = useState(() => localStorage.getItem("favoriteTeam") ?? "Feyenoord");

  const [playerList, setPlayerList] = useState<Player[]>(() => {
    const saved = localStorage.getItem("players");
    if (!saved) return players;
    try {
      const parsed = JSON.parse(saved) as Partial<Player>[];
      return parsed.map((player) => ({
        ...player,
        number: player.number ?? 0,
        position: player.position ?? "Middenvelder"
      })) as Player[];
    } catch {
      return players;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem("matches");
    if (!saved) return defaultMatches;
    try {
      return (JSON.parse(saved) as Match[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch {
      return defaultMatches;
    }
  });

  useEffect(() => localStorage.setItem("players", JSON.stringify(playerList)), [playerList]);
  useEffect(() => localStorage.setItem("matches", JSON.stringify(matches)), [matches]);
  useEffect(() => localStorage.setItem("favoriteTeam", team), [team]);

  return (
    <BrowserRouter>
      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/wedstrijden">Wedstrijden</NavLink>
        <NavLink to="/spelers">Spelers</NavLink>
      </nav>

      <main className="page">
        <Routes>
          <Route
            path="/"
            element={<Dashboard matches={matches} playerList={playerList} team={team} setTeam={setTeam} />}
          />
          <Route
            path="/wedstrijden"
            element={<MatchesPage matches={matches} setMatches={setMatches} team={team} />}
          />
          <Route
            path="/spelers"
            element={<PlayersPage playerList={playerList} setPlayerList={setPlayerList} />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
