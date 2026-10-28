
import { useState } from "react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

import type { UserRole, Permission } from "./permissions";
import { hasPermission, canAccessAdminPage } from "./permissions";

import type { Player, Match, Team } from "./types";
import PlayerForm from "./PlayerForm";
import MatchForm from "./MatchForm";
import type { Language } from "./translations";

type AdminPageProps = {
  role: UserRole;
  language: Language;
  playersCount: number;
  matchesCount: number;
  teamsCount: number;
  team: string;
  playerList: Player[];
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
};

type TeamSection = "players" | "matches" | null;

export default function AdminPage({
  role,
  language,
  playersCount,
  matchesCount,
  teamsCount,
  team,
  playerList,
  setPlayerList,
  matches,
  setMatches,
  teams,
  setTeams,
}: AdminPageProps) {
  const isDutch = language === "nl";

  const t = {
    title: isDutch ? "Beheercentrum" : "Admin center",
    description: isDutch
      ? "Beheer teams, spelers en wedstrijden op één overzichtelijke plek."
      : "Manage teams, players and matches in one convenient place.",
    administrator: isDutch ? "Beheerder" : "Administrator",
    player: isDutch ? "Speler" : "Player",
    noAccess: isDutch ? "Geen toegang" : "Access denied",
    noAccessDescription: isDutch
      ? "Je hebt geen toestemming om deze pagina te bekijken."
      : "You do not have permission to view this page.",
    overview: isDutch ? "Overzicht" : "Overview",
    players: isDutch ? "Spelers" : "Players",
    matches: isDutch ? "Wedstrijden" : "Matches",
    teams: isDutch ? "Teams" : "Teams",
    inTracker: isDutch ? "In de tracker" : "In the tracker",
    savedMatches: isDutch ? "Opgeslagen wedstrijden" : "Saved matches",
    clubsInTracker: isDutch ? "Clubs in de tracker" : "Clubs in the tracker",
    exportData: isDutch ? "Gegevens exporteren" : "Export data",
    backupDescription: isDutch
      ? "Download een back-up van je spelers, wedstrijden en teams."
      : "Download a backup of your players, matches and teams.",
    downloadBackup: isDutch ? "Back-up downloaden" : "Download backup",
    manageTeams: isDutch ? "Teams beheren" : "Manage teams",
    chooseTeamDescription: isDutch
      ? "Kies een club om de spelers en wedstrijden te beheren."
      : "Choose a club to manage its players and matches.",
    cancel: isDutch ? "Annuleren" : "Cancel",
    addTeam: isDutch ? "Team toevoegen" : "Add team",
    newTeamName: isDutch ? "Naam van het nieuwe team" : "New team name",
    teamPlaceholder: isDutch ? "Bijvoorbeeld: Ajax" : "For example: Ajax",
    saveTeam: isDutch ? "Team opslaan" : "Save team",
    enterTeamName: isDutch
      ? "Vul een teamnaam in."
      : "Enter a team name.",
    teamExists: isDutch
      ? "Dit team bestaat al."
      : "This team already exists.",
    searchTeam: isDutch ? "Zoek een team" : "Search teams",
    searchTeamPlaceholder: isDutch
      ? "Zoek op clubnaam..."
      : "Search by club name...",
    of: isDutch ? "van" : "of",
    teamCount: isDutch ? "teams" : "teams",
    backToTeams: isDutch ? "Terug naar teams" : "Back to teams",
    teamManagement: isDutch ? "TEAMBEHEER" : "TEAM MANAGEMENT",
    chooseTeam: isDutch
      ? "Kies een team om te beheren"
      : "Choose a team to manage",
    chooseSection: isDutch
      ? "Kies wat je wilt beheren"
      : "Choose what you want to manage",
    chooseWhat: isDutch
      ? "Wat wil je beheren?"
      : "What would you like to manage?",
    chooseSectionDescription: isDutch
      ? "Kies hierboven voor spelers of wedstrijden van"
      : "Choose players or matches for",
    managePlayers: isDutch ? "Spelers beheren" : "Manage players",
    manageMatches: isDutch ? "Wedstrijden beheren" : "Manage matches",
    playersDescription: isDutch
      ? "Voeg spelers toe, bewerk hun gegevens of verwijder ze."
      : "Add players, edit their details or delete them.",
    matchesDescription: isDutch
      ? "Bekijk alle thuis- en uitwedstrijden van"
      : "View all home and away matches for",
    addPlayer: isDutch ? "Speler toevoegen" : "Add player",
    addMatch: isDutch ? "Wedstrijd toevoegen" : "Add match",
    searchPlayer: isDutch ? "Zoek een speler" : "Search players",
    searchPlayerPlaceholder: isDutch
      ? "Naam of positie..."
      : "Name or position...",
    searchMatch: isDutch ? "Zoek een wedstrijd" : "Search matches",
    searchMatchPlaceholder: isDutch
      ? "Team, datum of uitslag..."
      : "Team, date or score...",
    playersDisplayed: isDutch
      ? "spelers weergegeven"
      : "players displayed",
    matchesDisplayed: isDutch
      ? "wedstrijden weergegeven"
      : "matches displayed",
    edit: isDutch ? "Bewerken" : "Edit",
    delete: isDutch ? "Verwijderen" : "Delete",
    noTeams: isDutch ? "Er zijn nog geen teams" : "There are no teams yet",
    noTeamsFound: isDutch ? "Geen teams gevonden" : "No teams found",
    addTeamToStart: isDutch
      ? "Voeg een team toe om te beginnen."
      : "Add a team to get started.",
    trySearch: isDutch
      ? "Probeer een andere zoekterm."
      : "Try another search term.",
    noPlayers: isDutch
      ? "Nog geen spelers bij dit team"
      : "No players for this team yet",
    noPlayersFound: isDutch ? "Geen spelers gevonden" : "No players found",
    addFirstPlayer: isDutch
      ? "Voeg de eerste speler aan deze club toe."
      : "Add the first player to this club.",
    noMatches: isDutch
      ? "Nog geen wedstrijden voor dit team"
      : "No matches for this team yet",
    noMatchesFound: isDutch
      ? "Geen wedstrijden gevonden"
      : "No matches found",
    addFirstMatch: isDutch
      ? "Voeg de eerste wedstrijd toe voor dit team."
      : "Add the first match for this team.",
    homeMatch: isDutch ? "Thuiswedstrijd" : "Home match",
    awayMatch: isDutch ? "Uitwedstrijd" : "Away match",
    permissions: isDutch ? "Toegangsrechten" : "Access permissions",
    permissionsDescription: isDutch
      ? "Overzicht van de rechten voor jouw huidige rol."
      : "Overview of the permissions for your current role.",
    allowed: isDutch ? "Toegestaan" : "Allowed",
    denied: isDutch ? "Geen toegang" : "No access",
    playersPermission: isDutch ? "Spelers beheren" : "Manage players",
    matchesPermission: isDutch ? "Wedstrijden beheren" : "Manage matches",
    teamsPermission: isDutch ? "Teams beheren" : "Manage teams",
    usersPermission: isDutch
      ? "Gebruikers en rechten beheren"
      : "Manage users and permissions",
    linkedDataWarning: isDutch
      ? "Verwijder of wijzig eerst de gekoppelde gegevens."
      : "Remove or update the linked data first.",
    deleteTeamConfirm: isDutch
      ? "Weet je zeker dat je team wilt verwijderen?"
      : "Are you sure you want to delete this team?",
    deletePlayerConfirm: isDutch
      ? "Weet je zeker dat je deze speler wilt verwijderen?"
      : "Are you sure you want to delete this player?",
    deleteMatchConfirm: isDutch
      ? "Weet je zeker dat je deze wedstrijd wilt verwijderen?"
      : "Are you sure you want to delete this match?",
    playedMatchWarning: isDutch
      ? "LET OP: deze wedstrijd heeft al een uitslag."
      : "WARNING: this match already has a result.",
    deletePlayedMatchConfirm: isDutch
      ? "Weet je zeker dat je deze gespeelde wedstrijd definitief wilt verwijderen?"
      : "Are you sure you want to permanently delete this played match?",
    linkedPlayers: isDutch
      ? "speler(s) aan dit team gekoppeld"
      : "player(s) linked to this team",
    linkedMatches: isDutch
      ? "wedstrijd(en) aan dit team gekoppeld"
      : "match(es) linked to this team",
    playerSingular: isDutch ? "speler" : "player",
    playerPlural: isDutch ? "spelers" : "players",
    matchSingular: isDutch ? "wedstrijd" : "match",
    matchPlural: isDutch ? "wedstrijden" : "matches",
  };

  const permissionLabels: Record<Permission, string> = {
    "players.manage": t.playersPermission,
    "matches.manage": t.matchesPermission,
    "teams.manage": t.teamsPermission,
    "users.manage": t.usersPermission,
  };

  const allPermissions: Permission[] = [
    "players.manage",
    "matches.manage",
    "teams.manage",
    "users.manage",
  ];

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeTeamSection, setActiveTeamSection] =
    useState<TeamSection>(null);

  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerSearch, setPlayerSearch] = useState("");

  const [showMatchForm, setShowMatchForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [matchSearch, setMatchSearch] = useState("");

  const [teamSearch, setTeamSearch] = useState("");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [teamError, setTeamError] = useState("");

  const canManagePlayers = hasPermission(role, "players.manage");
  const canManageMatches = hasPermission(role, "matches.manage");
  const canManageTeams = hasPermission(role, "teams.manage");

  function closePlayerForm() {
    setShowPlayerForm(false);
    setEditingPlayer(null);
  }

  function closeMatchForm() {
    setShowMatchForm(false);
    setEditingMatch(null);
  }

  function returnToTeams() {
    setSelectedTeam(null);
    setActiveTeamSection(null);
    setPlayerSearch("");
    setMatchSearch("");
    setTeamSearch("");
    setShowTeamForm(false);
    setTeamError("");
    closePlayerForm();
    closeMatchForm();
  }

  function changeSelectedTeam(teamName: string) {
    setSelectedTeam(teamName);
    setActiveTeamSection(null);
    setPlayerSearch("");
    setMatchSearch("");
    closePlayerForm();
    closeMatchForm();
  }

  function selectTeamSection(section: Exclude<TeamSection, null>) {
    setActiveTeamSection(section);
    setPlayerSearch("");
    setMatchSearch("");
    closePlayerForm();
    closeMatchForm();
  }

  function exportData() {
    const data = {
      players: playerList,
      matches,
      teams,
      favoriteTeam: team,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "voetbaltracker-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function openAddPlayerForm() {
    if (!canManagePlayers) return;
    setEditingPlayer(null);
    setShowPlayerForm(true);
  }

  function openEditPlayerForm(player: Player) {
    if (!canManagePlayers) return;
    setEditingPlayer(player);
    setShowPlayerForm(true);
  }

  function deletePlayer(player: Player) {
    if (!canManagePlayers) return;

    const confirmed = window.confirm(
      `${t.deletePlayerConfirm}\n\n${player.firstname} ${player.lastname}`,
    );

    if (!confirmed) return;

    setPlayerList((current) =>
      current.filter((item) => item.id !== player.id),
    );
  }

  function openAddMatchForm() {
    if (!canManageMatches) return;
    setEditingMatch(null);
    setShowMatchForm(true);
  }

  function openEditMatchForm(match: Match) {
    if (!canManageMatches) return;
    setEditingMatch(match);
    setShowMatchForm(true);
  }

  function deleteMatch(match: Match) {
    if (!canManageMatches) return;

    const hasResult =
      typeof match.homeGoals === "number" &&
      typeof match.awayGoals === "number";

    const message = hasResult
      ? `${t.playedMatchWarning}\n\n${match.home} ${match.homeGoals} - ${match.awayGoals} ${match.away}\n\n${t.deletePlayedMatchConfirm}`
      : `${t.deleteMatchConfirm}\n\n${match.home} - ${match.away}`;

    if (!window.confirm(message)) return;

    setMatches((current) =>
      current.filter((item) => item.id !== match.id),
    );
  }

  function addTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManageTeams) return;

    const name = newTeamName.trim();

    if (!name) {
      setTeamError(t.enterTeamName);
      return;
    }

    if (teams.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setTeamError(t.teamExists);
      return;
    }

    const newId =
      teams.length > 0
        ? Math.max(...teams.map((item) => item.id)) + 1
        : 1;

    setTeams((current) => [...current, { id: newId, name }]);
    setNewTeamName("");
    setTeamError("");
    setShowTeamForm(false);
    setTeamSearch("");
  }

  function deleteTeam(teamToDelete: Team) {
    if (!canManageTeams) return;

    const playersInTeam = playerList.filter(
      (player) => player.team === teamToDelete.name,
    );
    const matchesForTeam = matches.filter(
      (match) =>
        match.home === teamToDelete.name || match.away === teamToDelete.name,
    );

    if (playersInTeam.length > 0 || matchesForTeam.length > 0) {
      const reasons: string[] = [];

      if (playersInTeam.length > 0) {
        reasons.push(
          `${playersInTeam.length} ${t.linkedPlayers}`,
        );
      }

      if (matchesForTeam.length > 0) {
        reasons.push(
          `${matchesForTeam.length} ${t.linkedMatches}`,
        );
      }

      window.alert(
        `${teamToDelete.name}\n\n${reasons.join("\n")}\n\n${t.linkedDataWarning}`,
      );
      return;
    }

    if (
      !window.confirm(
        `${t.deleteTeamConfirm}\n\n${teamToDelete.name}`,
      )
    ) {
      return;
    }

    setTeams((current) =>
      current.filter((item) => item.id !== teamToDelete.id),
    );

    if (selectedTeam === teamToDelete.name) {
      returnToTeams();
    }
  }

  if (!canAccessAdminPage(role)) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <h1>{t.noAccess}</h1>
          <p>{t.noAccessDescription}</p>
        </section>
      </main>
    );
  }

  const sortedTeams = [...teams].sort((a, b) =>
    a.name.localeCompare(b.name, language === "nl" ? "nl" : "en"),
  );

  const filteredTeams = sortedTeams.filter((item) =>
    item.name.toLowerCase().includes(teamSearch.trim().toLowerCase()),
  );

  const teamPlayers = selectedTeam
    ? playerList
        .filter((player) => player.team === selectedTeam)
        .filter((player) => {
          const search = playerSearch.trim().toLowerCase();
          const fullName =
            `${player.firstname} ${player.lastname}`.toLowerCase();

          return (
            fullName.includes(search) ||
            player.position.toLowerCase().includes(search)
          );
        })
        .sort((a, b) =>
          `${a.lastname} ${a.firstname}`.localeCompare(
            `${b.lastname} ${b.firstname}`,
            language === "nl" ? "nl" : "en",
          ),
        )
    : [];

  const teamMatches = selectedTeam
    ? matches
        .filter(
          (match) => match.home === selectedTeam || match.away === selectedTeam,
        )
        .filter((match) => {
          const search = matchSearch.trim().toLowerCase();

          return (
            match.home.toLowerCase().includes(search) ||
            match.away.toLowerCase().includes(search) ||
            match.date.toLowerCase().includes(search) ||
            `${match.homeGoals}-${match.awayGoals}`.includes(search)
          );
        })
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
    : [];

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div className="admin-header-content">
          <div className="admin-header-title">
            <span className="admin-header-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>

            <div>
              <p className="admin-eyebrow">EREDIVISIE-VOETBALTRACKER</p>
              <h1>{t.title}</h1>
            </div>
          </div>

          <p className="admin-header-description">{t.description}</p>
        </div>

        <span className="admin-role-badge">
          <span aria-hidden="true">✓</span>
          {role === "admin" ? t.administrator : t.player}
        </span>
      </header>

      <section className="admin-overview" aria-labelledby="admin-overview-title">
        <h2 id="admin-overview-title">{t.overview}</h2>

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">👥</span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{t.players}</span>
              <strong>{playersCount}</strong>
              <span className="admin-stat-description">{t.inTracker}</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">⚽</span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{t.matches}</span>
              <strong>{matchesCount}</strong>
              <span className="admin-stat-description">{t.savedMatches}</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">🛡️</span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{t.teams}</span>
              <strong>{teamsCount}</strong>
              <span className="admin-stat-description">{t.clubsInTracker}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="admin-panel admin-export-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>{t.exportData}</h2>
            <p>{t.backupDescription}</p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={exportData}
          >
            {t.downloadBackup}
          </button>
        </div>
      </section>

      {!selectedTeam ? (
        <section className="admin-panel" aria-labelledby="admin-teams-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="admin-teams-title">{t.manageTeams}</h2>
              <p>{t.chooseTeamDescription}</p>
            </div>

            {canManageTeams && (
              <button
                type="button"
                className="admin-primary-button"
                onClick={() => {
                  setTeamError("");
                  setShowTeamForm((current) => !current);
                }}
              >
                {showTeamForm ? t.cancel : `+ ${t.addTeam}`}
              </button>
            )}
          </div>

          {canManageTeams && showTeamForm && (
            <form className="admin-team-form" onSubmit={addTeam}>
              <label htmlFor="admin-new-team-name">{t.newTeamName}</label>

              <div className="admin-team-form-fields">
                <input
                  id="admin-new-team-name"
                  type="text"
                  value={newTeamName}
                  onChange={(event) => {
                    setNewTeamName(event.target.value);
                    setTeamError("");
                  }}
                  placeholder={t.teamPlaceholder}
                  maxLength={80}
                  required
                />

                <button type="submit" className="admin-primary-button">
                  {t.saveTeam}
                </button>
              </div>

              {teamError && (
                <p className="admin-form-error" role="alert">
                  {teamError}
                </p>
              )}
            </form>
          )}

          <div className="admin-team-toolbar">
            <label htmlFor="admin-team-search">
              {t.searchTeam}
              <input
                id="admin-team-search"
                type="search"
                value={teamSearch}
                onChange={(event) => setTeamSearch(event.target.value)}
                placeholder={t.searchTeamPlaceholder}
              />
            </label>

            <span className="admin-player-count" aria-live="polite">
              {filteredTeams.length} {t.of} {teams.length} {t.teamCount}
            </span>
          </div>

          {filteredTeams.length > 0 ? (
            <div className="admin-team-grid">
              {filteredTeams.map((item) => {
                const playerCount = playerList.filter(
                  (player) => player.team === item.name,
                ).length;

                const matchCount = matches.filter(
                  (match) =>
                    match.home === item.name || match.away === item.name,
                ).length;

                return (
                  <article className="admin-team-card" key={item.id}>
                    <button
                      type="button"
                      className="admin-team-select"
                      onClick={() => changeSelectedTeam(item.name)}
                      aria-label={`${t.manageTeams}: ${item.name}`}
                    >
                      <span className="admin-team-icon" aria-hidden="true">
                        ⚽
                      </span>

                      <span className="admin-team-card-content">
                        <strong>{item.name}</strong>
                        <span>
                          {playerCount}{" "}
                          {playerCount === 1 ? t.playerSingular : t.playerPlural}
                          {" · "}
                          {matchCount}{" "}
                          {matchCount === 1 ? t.matchSingular : t.matchPlural}
                        </span>
                      </span>

                      <span className="admin-team-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>

                    {canManageTeams && (
                      <button
                        type="button"
                        className="admin-team-delete"
                        onClick={() => deleteTeam(item)}
                        aria-label={`${t.delete} ${item.name}`}
                      >
                        {t.delete}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty-state">
              <strong>
                {teams.length === 0 ? t.noTeams : t.noTeamsFound}
              </strong>
              <p>{teams.length === 0 ? t.addTeamToStart : t.trySearch}</p>
            </div>
          )}
        </section>
      ) : (
        <section className="admin-panel" aria-labelledby="admin-selected-team-title">
          <button
            type="button"
            className="admin-back-button"
            onClick={returnToTeams}
          >
            ← {t.backToTeams}
          </button>

          <div className="admin-panel-heading admin-selected-team-heading">
            <div className="admin-team-header">
              <span className="admin-team-eyebrow">{t.teamManagement}</span>

              <h2 id="admin-selected-team-title" className="admin-team-title">
                <select
                  className="admin-team-dropdown"
                  value={selectedTeam}
                  onChange={(event) => changeSelectedTeam(event.target.value)}
                  aria-label={t.chooseTeam}
                >
                  {sortedTeams.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </h2>

              <p>{t.chooseTeamDescription}</p>
            </div>
          </div>

          <div
            className="admin-team-section-switch"
            role="group"
            aria-label={t.chooseSection}
          >
            <button
              type="button"
              className={`admin-section-button ${
                activeTeamSection === "players" ? "active" : ""
              }`}
              aria-pressed={activeTeamSection === "players"}
              onClick={() => selectTeamSection("players")}
            >
              👥 {t.players}
            </button>

            <button
              type="button"
              className={`admin-section-button ${
                activeTeamSection === "matches" ? "active" : ""
              }`}
              aria-pressed={activeTeamSection === "matches"}
              onClick={() => selectTeamSection("matches")}
            >
              ⚽ {t.matches}
            </button>
          </div>

          {activeTeamSection === null && (
            <div className="admin-empty-state">
              <span className="admin-empty-icon" aria-hidden="true">⚽</span>
              <strong>{t.chooseWhat}</strong>
              <p>
                {t.chooseSectionDescription} {selectedTeam}.
              </p>
            </div>
          )}

          {activeTeamSection === "players" && (
            <>
              <div className="admin-panel-heading">
                <div>
                  <h3>{t.managePlayers}</h3>
                  <p>{t.playersDescription}</p>
                </div>

                {canManagePlayers && (
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={openAddPlayerForm}
                  >
                    + {t.addPlayer}
                  </button>
                )}
              </div>

              <div className="admin-player-toolbar">
                <label htmlFor="admin-player-search">
                  {t.searchPlayer}
                  <input
                    id="admin-player-search"
                    type="search"
                    value={playerSearch}
                    onChange={(event) => setPlayerSearch(event.target.value)}
                    placeholder={t.searchPlayerPlaceholder}
                  />
                </label>

                <span className="admin-player-count" aria-live="polite">
                  {teamPlayers.length} {t.playersDisplayed}
                </span>
              </div>

              {teamPlayers.length > 0 ? (
                <div className="admin-player-list">
                  {teamPlayers.map((player) => (
                    <article className="admin-player-row" key={player.id}>
                      <div className="admin-player-info">
                        <strong>
                          {player.firstname} {player.lastname}
                        </strong>

                        <div className="admin-player-meta">
                          <span>{player.position}</span>
                          <span className="admin-player-number">
                            #{player.number}
                          </span>
                        </div>
                      </div>

                      <div className="admin-player-actions">
                        {canManagePlayers && (
                          <>
                            <button
                              type="button"
                              className="admin-edit-button"
                              onClick={() => openEditPlayerForm(player)}
                              aria-label={`${t.edit}: ${player.firstname} ${player.lastname}`}
                            >
                              {t.edit}
                            </button>

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() => deletePlayer(player)}
                              aria-label={`${t.delete}: ${player.firstname} ${player.lastname}`}
                            >
                              {t.delete}
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="admin-empty-state">
                  <span className="admin-empty-icon" aria-hidden="true">👥</span>
                  <strong>
                    {playerList.some((player) => player.team === selectedTeam)
                      ? t.noPlayersFound
                      : t.noPlayers}
                  </strong>
                  <p>
                    {playerList.some((player) => player.team === selectedTeam)
                      ? t.trySearch
                      : t.addFirstPlayer}
                  </p>

                  {canManagePlayers &&
                    !playerList.some((player) => player.team === selectedTeam) && (
                      <button
                        type="button"
                        className="admin-primary-button"
                        onClick={openAddPlayerForm}
                      >
                        {t.addPlayer}
                      </button>
                    )}
                </div>
              )}
            </>
          )}

          {activeTeamSection === "matches" && (
            <>
              <div className="admin-panel-heading">
                <div>
                  <h3>{t.manageMatches}</h3>
                  <p>
                    {t.matchesDescription} {selectedTeam}.
                  </p>
                </div>

                {canManageMatches && (
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={openAddMatchForm}
                  >
                    + {t.addMatch}
                  </button>
                )}
              </div>

              <div className="admin-player-toolbar">
                <label htmlFor="admin-match-search">
                  {t.searchMatch}
                  <input
                    id="admin-match-search"
                    type="search"
                    value={matchSearch}
                    onChange={(event) => setMatchSearch(event.target.value)}
                    placeholder={t.searchMatchPlaceholder}
                  />
                </label>

                <span className="admin-player-count" aria-live="polite">
                  {teamMatches.length} {t.matchesDisplayed}
                </span>
              </div>

              {teamMatches.length > 0 ? (
                <div className="admin-player-list">
                  {teamMatches.map((match) => (
                    <article className="admin-player-row" key={match.id}>
                      <div className="admin-player-info">
                        <strong>
                          {match.home} {match.homeGoals} – {match.awayGoals}{" "}
                          {match.away}
                        </strong>

                        <div className="admin-player-meta">
                          <span>{match.date}</span>
                          <span>
                            {match.home === selectedTeam
                              ? t.homeMatch
                              : t.awayMatch}
                          </span>
                        </div>
                      </div>

                      <div className="admin-player-actions">
                        {canManageMatches && (
                          <>
                            <button
                              type="button"
                              className="admin-edit-button"
                              onClick={() => openEditMatchForm(match)}
                              aria-label={`${t.edit}: ${match.home} - ${match.away}`}
                            >
                              {t.edit}
                            </button>

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() => deleteMatch(match)}
                              aria-label={`${t.delete}: ${match.home} - ${match.away}`}
                            >
                              {t.delete}
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="admin-empty-state">
                  <span className="admin-empty-icon" aria-hidden="true">⚽</span>
                  <strong>
                    {matches.some(
                      (match) =>
                        match.home === selectedTeam || match.away === selectedTeam,
                    )
                      ? t.noMatchesFound
                      : t.noMatches}
                  </strong>
                  <p>
                    {matches.some(
                      (match) =>
                        match.home === selectedTeam || match.away === selectedTeam,
                    )
                      ? t.trySearch
                      : t.addFirstMatch}
                  </p>

                  {canManageMatches &&
                    !matches.some(
                      (match) =>
                        match.home === selectedTeam || match.away === selectedTeam,
                    ) && (
                      <button
                        type="button"
                        className="admin-primary-button"
                        onClick={openAddMatchForm}
                      >
                        {t.addMatch}
                      </button>
                    )}
                </div>
              )}
            </>
          )}
        </section>
      )}

      <section
        className="admin-panel admin-permissions-panel"
        aria-labelledby="admin-permissions-title"
      >
        <div className="admin-panel-heading">
          <div>
            <h2 id="admin-permissions-title">{t.permissions}</h2>
            <p>{t.permissionsDescription}</p>
          </div>
        </div>

        <ul className="admin-permissions-list" aria-label={t.permissions}>
          {allPermissions.map((permission) => {
            const allowed = hasPermission(role, permission);

            return (
              <li key={permission}>
                <span className="admin-permission-check" aria-hidden="true">
                  {allowed ? "✓" : "—"}
                </span>
                <span>
                  {permissionLabels[permission]} —{" "}
                  {allowed ? t.allowed : t.denied}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {canManagePlayers && showPlayerForm && (
        <PlayerForm
          editingPlayer={editingPlayer}
          setEditingPlayer={setEditingPlayer}
          setPlayerList={setPlayerList}
          closeModal={closePlayerForm}
          teams={teams}
        />
      )}

      {canManageMatches && showMatchForm && (
        <MatchForm
          editingMatch={editingMatch}
          setEditingMatch={setEditingMatch}
          setMatches={setMatches}
          closeModal={closeMatchForm}
          teams={teams}
        />
      )}
    </main>
  );
}
