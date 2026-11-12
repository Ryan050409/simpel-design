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
import PlayersRankingPage from "./PlayersRankingPage.tsx";
import PlayersCompare from "./PlayersCompare";
import Dashboard from "./Dashboard.tsx";
import MatchesPage from "./MatchesPage.tsx";
import StandingsPage from "./StandingsPage";
import HomePage from "./HomePage";
import HelpPage from "./HelpPage";
import AdminPage from "./AdminPage";
import { DEMO_USER } from "./demoUser";
import { translations, type Language } from "./translations.ts";
import type { Player, Match, Team } from "./types.ts";
import { getTeams, getPlayers, getMatches } from "./api";
import ClubsPage from "./ClubsPage.tsx";
import ClubDetailPage from "./ClubDetailPage";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  const [playerList, setPlayerList] = useState<Player[]>([]);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await getPlayers();
        setPlayerList(data);
      } catch (error) {
        console.error("Fout bij ophalen van spelers:", error);
      }
    }

    loadPlayers();
  }, []);

  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error("Fout bij ophalen van wedstrijden", error);
      }
    }

    loadMatches();
  }, []);
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error("Fout bij ophalen van teams", error);
      }
    }
    loadTeams();
  }, []);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(playerList));
  }, [playerList]);

  useEffect(() => {
    localStorage.setItem("favoriteTeam", team);
  }, [team]);

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

  const closeNavigationMenus = () => {
    setShowMobileMenu(false);
    setShowProfileMenu(false);
    setShowCompetitieMenu(false);
    setShowSpelersMenu(false);
  };

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
  useEffect(() => {
    if (!showSpelersMenu) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        spelersMenuRef.current &&
        !spelersMenuRef.current.contains(event.target as Node)
      ) {
        setShowSpelersMenu(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSpelersMenu]);
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

      if (spelersMenuRef.current && !spelersMenuRef.current.contains(target)) {
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
      <header className="mobile-header">
        <div className="mobile-header-logo">
          <span className="mobile-header-logo-icon" aria-hidden="true">
            ⚽
          </span>
          <span className="mobile-header-logo-text">Football Tracker</span>
        </div>

        <button
          type="button"
          className="mobile-header-favorite"
          aria-label={t.favoriteClub}
          onClick={() => {
            setShowProfileMenu(true);
            setShowCompetitieMenu(false);
            setShowSpelersMenu(false);
            setShowMobileMenu(true);
          }}
        >
          ★
        </button>

        <button
          type="button"
          className="mobile-header-login"
          onClick={() => {
            setShowProfileMenu(true);
            setShowCompetitieMenu(false);
            setShowSpelersMenu(false);
            setShowMobileMenu(true);
          }}
        >
          {isLoggedIn ? t.profile : t.signIn}
        </button>

        <button
          type="button"
          className="mobile-header-toggle"
          aria-label={showMobileMenu ? t.closeButton : t.openButton}
          aria-controls="primary-navigation"
          aria-expanded={showMobileMenu}
          onClick={() => {
            if (showMobileMenu) {
              closeNavigationMenus();
            } else {
              setShowMobileMenu(true);
              setShowProfileMenu(false);
              setShowCompetitieMenu(false);
              setShowSpelersMenu(false);
            }
          }}
        >
          {showMobileMenu ? "✕" : "☰"}
        </button>
      </header>
      <nav
        id="primary-navigation"
        className={`nav ${showMobileMenu ? "mobile-menu-open" : ""}`}
        aria-label={t.mainNavigationLabel}
      >
        <NavLink
          to="/"
          aria-label={t.homeAriaLabel}
          onClick={closeNavigationMenus}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            🏠
          </span>
          <span className="mobile-nav-label">{t.home}</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          aria-label={t.statsAriaLabel}
          onClick={closeNavigationMenus}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            📊
          </span>
          <span className="mobile-nav-label">{t.stats}</span>
        </NavLink>

        <div className="nav-dropdown" ref={competitieMenuRef}>
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
              Competitie <span aria-hidden="true">⌄</span>
            </span>
          </button>

          {showCompetitieMenu && (
            <div className="nav-dropdown-content">
              <NavLink to="/wedstrijden" onClick={closeNavigationMenus}>
                ⚽ Wedstrijden
              </NavLink>

              <NavLink to="/stand" onClick={closeNavigationMenus}>
                🏆 Competitiestand
              </NavLink>

              <NavLink to="/competitie/clubs" onClick={closeNavigationMenus}>
                🛡️ Clubs
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-dropdown" ref={spelersMenuRef}>
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
              Spelers <span aria-hidden="true">⌄</span>
            </span>
          </button>

          {showSpelersMenu && (
            <div className="nav-dropdown-content">
              <NavLink to="/spelers" onClick={closeNavigationMenus}>
                👤 Spelerstatistieken
              </NavLink>

              <NavLink to="/spelersranglijst" onClick={closeNavigationMenus}>
                📊 Spelersranglijst
              </NavLink>
              <NavLink to="/spelers-vergelijken" onClick={closeNavigationMenus}>
                ⚖️ Spelers vergelijken
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          className="mobile-menu-help"
          to="/help"
          onClick={closeNavigationMenus}
        >
          {t.help}
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            aria-label={t.adminAriaLabel}
            onClick={closeNavigationMenus}
          >
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

                {[...teams]
                  .sort((a, b) => a.name.localeCompare(b.name, "nl"))
                  .map((club) => (
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
          path="/spelersranglijst"
          element={
            <PlayersRankingPage
              playerList={playerList}
              teams={teams}
              language={language}
            />
          }
        />
        <Route
          path="/spelers-vergelijken"
          element={
            <PlayersCompare
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
