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
import MatchCard from "./MatchCard.tsx";


export type Player = {
  name: string;
  team: string;
  goals: number;
  assists: number;
  matches: number;
  rating: number;
};

type Match = {
  id: number;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
};

function App() {
  const [team, setTeam] = useState("Feyenoord");

  const [playerList, setPlayerList] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem("players");

    return savedPlayers
      ? JSON.parse(savedPlayers)
      : players;
  });

  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      home: "Ajax",
      away: "PSV",
      homeGoals: 3,
      awayGoals: 1
    },
    {
      id: 2,
      home: "Ajax",
      away: "Feyenoord",
      homeGoals: 2,
      awayGoals: 2
    },
    {
      id: 3,
      home: "Feyenoord",
      away: "PSV",
      homeGoals: 4,
      awayGoals: 1
    }
  ]);

  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  useEffect(() => {
    localStorage.setItem(
      "players",
      JSON.stringify(playerList)
    );
  }, [playerList]);

 function addMatch() {
  if (home.trim() === "" || away.trim() === "") {
    return;
  }

  const newMatch: Match = {
    id: editingMatch ? editingMatch.id : Date.now(),
    home,
    away,
    homeGoals,
    awayGoals
  };

  if (editingMatch) {
    setMatches(
      matches.map((match) =>
        match.id === editingMatch.id
          ? newMatch
          : match
      )
    );
  } else {
    setMatches([...matches, newMatch]);
  }

  setHome("");
  setAway("");
  setHomeGoals(0);
  setAwayGoals(0);
  setEditingMatch(null);
}

  function deleteMatch(id: number) {
    setMatches(
      matches.filter((match) => match.id !== id)
    );
  }
 function editMatch(match: Match) { 
  setEditingMatch(match); 
  
  setHome(match.home);
  setAway(match.away); 
  setHomeGoals(match.homeGoals);
  setAwayGoals(match.awayGoals);
 }

  return (
    <BrowserRouter>
      <nav className="nav">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/spelers">
          Spelers
        </NavLink>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>⚽ Voetbaltracker</h1>

              <h2 className="favoriet">
                Favoriete team
              </h2>

              <h2>{team}</h2>

              <button
                onClick={() => setTeam("PSV")}
              >
                Kies PSV
              </button>

              <button
                onClick={() => setTeam("Ajax")}
              >
                Kies Ajax
              </button>

              <button
                onClick={() => setTeam("Feyenoord")}
              >
                Kies Feyenoord
              </button>

              <h2>Wedstrijden</h2>

              <input
                placeholder="Thuisteam"
                value={home}
                onChange={(e) =>
                  setHome(e.target.value)
                }
              />

              <input
                placeholder="Uitteam"
                value={away}
                onChange={(e) =>
                  setAway(e.target.value)
                }
              />

              <input
                type="number"
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
                placeholder="Goals uit"
                value={awayGoals}
                onChange={(e) =>
                  setAwayGoals(
                    Number(e.target.value)
                  )
                }
              />

              <button onClick={addMatch}>
                {editingMatch ? "Wijzigingen opslaan" : "Wedstrijden toevoegen"}
              </button>

              {matches.map((match) => (
  <MatchCard
    key={match.id}
    match={match}
    onDelete={deleteMatch}
    onEdit= {editMatch}
  />
))}
            </div>
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