import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import PlayersPage from "./PlayersPage.tsx";
import Dashboard from "./Dashboard.tsx";
import MatchesPage from "./MatchesPage.tsx";
import StandingsPage from "./StandingsPage";
import HomePage from "./HomePage";
import HelpPage from "./HelpPage";
import AdminPage from "./AdminPage";
import { DEMO_USER } from "./demoUser";
import { translations, type Language } from "./translations.ts";
import type { Player, Match, Team } from "./types.ts";
import ClubsPage from "./ClubsPage.tsx";
import ClubDetailPage from "./ClubDetailPage";
/*
  TIJDELIJKE SEEDDATA
  Deze data wordt gebruikt wanneer er nog geen gegevens
  in localStorage zijn opgeslagen.
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

const firstNames = ["Lucas"];
const lastNames = ["Jansen"];

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
        tackles = 4 + (teamIndex % 5);
        interceptions = 3 + (teamIndex % 4);
        blocks = 2 + (teamIndex % 3);
        clearances = 8 + (teamIndex % 7);
        duelsWon = 5 + (teamIndex % 6);
        fouls = 1 + (teamIndex % 3);
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

      const minutesplayed = matches * 60 + (teamIndex + i) * 13;

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
const seedMatches: Match[] = [];

/*
  Interne component om te controleren of een gebruiker
  nog toegang heeft tot de huidige route.
*/
function AppContent() {
  const location = useLocation();

  const [team, setTeam] = useState(() => {
    return localStorage.getItem("favoriteTeam") || "Feyenoord";
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCompetitieMenu, setShowCompetitieMenu] = useState(false);
  const [showSpelersMenu, setShowSpelersMenu] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");

    const supportedLanguages: Language[] = ["nl", "en", "de", "fr", "sp", "pt"];

    return supportedLanguages.includes(savedLanguage as Language)
      ? (savedLanguage as Language)
      : "nl";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("demoLoggedIn") === "true";
  });

  
const profileMenuRef = useRef<HTMLDivElement>(null);
const competitieMenuRef = useRef<HTMLDivElement>(null);
const spelersMenuRef = useRef<HTMLDivElement>(null);


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

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("demoLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (!showProfileMenu) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showProfileMenu]);

  // Sluit de navigatiedropdowns bij het wisselen van pagina.
 // Sluit de navigatiedropdowns bij een klik buiten het menu.
useEffect(() => {
  if (!showCompetitieMenu && !showSpelersMenu) return;

  function handleNavigationOutsideClick(event: MouseEvent) {
    const target = event.target as Node;

    if (
      competitieMenuRef.current &&
      !competitieMenuRef.current.contains(target)
    ) {
      setShowCompetitieMenu(false);
    }

    if (
      spelersMenuRef.current &&
      !spelersMenuRef.current.contains(target)
    ) {
      setShowSpelersMenu(false);
    }
  }

  document.addEventListener("mousedown", handleNavigationOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleNavigationOutsideClick);
  };
}, [showCompetitieMenu, showSpelersMenu]);
  /*
    Als de gebruiker uitlogt terwijl de adminpagina openstaat,
    sturen we hem terug naar Home.
  */
  useEffect(() => {
    if (
      location.pathname === "/admin" &&
      (!isLoggedIn || DEMO_USER.role !== "admin")
    ) {
      window.history.replaceState(null, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [isLoggedIn, location.pathname]);

  const isAdmin = isLoggedIn && DEMO_USER.role === "admin";
  const t = translations[language];

  return (
    <div className={`app ${theme}`}>
      <nav className="nav" aria-label={t.mainNavigationLabel}>
        <NavLink to="/" aria-label={t.homeAriaLabel}>
          <span className="mobile-nav-icon" aria-hidden="true">
            🏠
          </span>
          <span className="mobile-nav-label">{t.home}</span>
        </NavLink>

        <NavLink to="/dashboard" aria-label={t.statsAriaLabel}>
          <span className="mobile-nav-icon" aria-hidden="true">
            📊
          </span>
          <span className="mobile-nav-label">{t.stats}</span>
        </NavLink>

        <div className="nav-dropdown" ref={spelersMenuRef}>
          <button
            type="button"
            className="nav-dropdown-trigger"
            aria-expanded={showCompetitieMenu}
            aria-haspopup="true"
            onClick={() => {
              setShowCompetitieMenu((open) => !open);
              setShowSpelersMenu(false);
              setShowProfileMenu(false);
            }}
          >
            <span className="mobile-nav-icon" aria-hidden="true">
              🏆
            </span>
            <span className="mobile-nav-label">
              Competitie <span aria-hidden="true">▾</span>
            </span>
          </button>

          {showCompetitieMenu && (
            <div className="nav-dropdown-content" ref={competitieMenuRef}>
              <NavLink
                to="/wedstrijden"
                onClick={() => setShowCompetitieMenu(false)}
              >
                ⚽ Wedstrijden
              </NavLink>

              <NavLink to="/stand" onClick={() => setShowCompetitieMenu(false)}>
                🏆 Competitiestand
              </NavLink>

              <NavLink
                to="/competitie/clubs"
                onClick={() => setShowCompetitieMenu(false)}
              >
                🛡️ Clubs
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-dropdown">
          <button
            type="button"
            className="nav-dropdown-trigger"
            aria-expanded={showSpelersMenu}
            aria-haspopup="true"
            onClick={() => {
              setShowSpelersMenu((open) => !open);
              setShowCompetitieMenu(false);
              setShowProfileMenu(false);
            }}
          >
            <span className="mobile-nav-icon" aria-hidden="true">
              👥
            </span>
            <span className="mobile-nav-label">
              Spelers <span aria-hidden="true">▾</span>
            </span>
          </button>

          {showSpelersMenu && (
            <div className="nav-dropdown-content">
              <NavLink to="/spelers" onClick={() => setShowSpelersMenu(false)}>
                👤 Spelerstatistieken
              </NavLink>

              <span
                className="nav-dropdown-disabled"
                aria-disabled="true"
                title="Deze pagina wordt later toegevoegd"
              >
                📊 Spelersranglijst
                <small>Binnenkort</small>
              </span>
            </div>
          )}
        </div>

        {isAdmin && (
          <NavLink to="/admin" aria-label={t.adminAriaLabel}>
            <span className="mobile-nav-icon" aria-hidden="true">
              🛡️
            </span>
            <span className="mobile-nav-label">{t.admin}</span>
          </NavLink>
        )}

        <div className="profile-menu" ref={profileMenuRef}>
          <button
            type="button"
            className="profile-menu-trigger"
            aria-label={t.profileMenuAriaLabel}
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
            onClick={() => setShowProfileMenu((open) => !open)}
          >
            <span className="mobile-nav-icon" aria-hidden="true">
              ⚙️
            </span>
            <span className="mobile-nav-label">{t.settings}</span>
          </button>

          {showProfileMenu && (
            <div className="profile-menu-dropdown">
              <h3>{t.profileSettings}</h3>

              <div className="profile-menu-section">
                <strong>{t.profile}</strong>

                {isLoggedIn ? (
                  <>
                    <span>{t.demoUserName}</span>
                    <small>
                      {t.role}: {isAdmin ? t.administrator : t.playerRole}
                    </small>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setShowProfileMenu(false);
                      }}
                    >
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <span>{t.notLoggedIn}</span>

                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setShowProfileMenu(false);
                      }}
                    >
                      {t.demoLogin}
                    </button>
                  </>
                )}
              </div>
              <div className="profile-menu-section">
                <label htmlFor="profile-language">{t.language}</label>

                <select
                  id="profile-language"
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value as Language)
                  }
                >
                  <option value="nl">🇳🇱 {t.languageDutch}</option>
                  <option value="en">🇬🇧 {t.languageEnglish}</option>
                  <option value="de">🇩🇪 {t.languageGerman}</option>
                  <option value="fr">🇫🇷{t.languageFrench}</option>
                  <option value="sp">🇪🇸{t.languageSpanish}</option>
                  <option value="pt">🇵🇹{t.languagesPortuguese}</option>
                </select>
                <div className="profile-menu-section"></div>
                <label htmlFor="profile-theme">{t.theme}</label>

                <select
                  id="profile-theme"
                  value={theme}
                  onChange={(event) =>
                    setTheme(event.target.value as "dark" | "light")
                  }
                >
                  <option value="dark">{t.dark}</option>
                  <option value="light">{t.light}</option>
                </select>
              </div>

              <div className="profile-menu-section">
                <strong>{t.favoriteClub}</strong>

                {teams.map((club) => (
                  <button
                    type="button"
                    key={club.id}
                    className="profile-team-option"
                    aria-pressed={team === club.name}
                    onClick={() => {
                      setTeam(club.name);
                      setShowProfileMenu(false);
                    }}
                  >
                    {club.name}
                    {team === club.name ? " ★" : ""}
                  </button>
                ))}
              </div>

              <NavLink to="/help" onClick={() => setShowProfileMenu(false)}>
                {t.help}
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              matches={matches}
              playerList={playerList}
              team={team}
              language={language}
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
              language={language}
            />
          }
        />
        <Route
          path="/wedstrijden"
          element={
            <MatchesPage matches={matches} team={team} language={language} />
          }
        />
        <Route
          path="/stand"
          element={
            <StandingsPage
              teams={teams}
              matches={matches}
              team={team}
              language={language}
            />
          }
        />
        <Route
          path="/spelers"
          element={
            <PlayersPage
              playerList={playerList}
              teams={teams}
              language={language}
            />
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminPage
                role={DEMO_USER.role}
                language={language}
                playersCount={playerList.length}
                matchesCount={matches.length}
                teamsCount={teams.length}
                playerList={playerList}
                setPlayerList={setPlayerList}
                matches={matches}
                setMatches={setMatches}
                team={team}
                teams={teams}
                setTeams={setTeams}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/help"
          element={<HelpPage isAdmin={isAdmin} language={language} />}
        />
        <Route
          path="/competitie/clubs"
          element={
            <ClubsPage
              teams={teams}
              favoriteTeam={team}
              onSetFavorite={setTeam}
              language={language}
            />
          }
        />
        <Route
          path="/competitie/clubs/:clubId"
          element={
            <ClubDetailPage
              teams={teams}
              matches={matches}
              favoriteTeam={team}
              onSetFavorite={setTeam}
              language={language}
            />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
