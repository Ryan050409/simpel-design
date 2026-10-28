import { useState } from "react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

import type { UserRole, Permission } from "./permissions";
import { hasPermission, canAccessAdminPage } from "./permissions";

import type { Player, Match, Team } from "./types";
import PlayerForm from "./PlayerForm";
import MatchForm from "./MatchForm";
import type { Language } from "./translations";
import { translations } from "./translations.ts";

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
  const locale = translations[language];
  const t = {
    title: locale.adminCenter,
    description: locale.adminDescription,
    administrator: locale.administrator,
    player: locale.playerRole,
    noAccess: locale.noAccess,
    noAccessDescription: locale.noAccessDescription,
    overview: locale.adminOverview,
    players: locale.players,
    matches: locale.matches,
    teams: locale.teams,
    inTracker: locale.adminInTracker,
    savedMatches: locale.savedMatches,
    clubsInTracker: locale.clubsInTracker,
    exportData: locale.exportData,
    backupDescription: locale.adminBackupDescription,
    downloadBackup: locale.downloadBackup,
    manageTeams: locale.manageTeams,
    chooseTeamDescription: locale.chooseTeamDescription,
    cancel: locale.cancel,
    addTeam: locale.addTeam,
    newTeamName: locale.newTeamName,
    teamPlaceholder: locale.adminTeamPlaceholder,
    saveTeam: locale.saveTeam,
    enterTeamName: locale.enterTeamName,
    teamExists: locale.adminTeamExists,
    searchTeam: locale.adminSearchTeam,
    searchTeamPlaceholder: locale.adminTeamSearchPlaceholder,
    of: locale.teamsOf,
    teamCount: locale.teamCount,
    backToTeams: locale.backToTeams,
    teamManagement: locale.teamManagement,
    chooseTeam: locale.adminChooseTeam,
    chooseSection: locale.adminChooseSection,
    chooseWhat: locale.adminChooseWhat,
    chooseSectionDescription: locale.choosePlayersOrMatches,
    managePlayers: locale.managePlayers,
    manageMatches: locale.manageMatches,
    playersDescription: locale.managePlayersDescription,
    matchesDescription: locale.manageMatchesDescription,
    addPlayer: locale.addPlayer,
    addMatch: locale.addMatch,
    searchPlayer: locale.adminSearchPlayer,
    searchPlayerPlaceholder: locale.searchPlayerPlaceholder,
    searchMatch: locale.adminSearchMatch,
    searchMatchPlaceholder: locale.searchMatchPlaceholder,
    playersDisplayed: locale.adminPlayersDisplayed,
    matchesDisplayed: locale.adminMatchesDisplayed,
    edit: locale.edit,
    delete: locale.delete,
    noTeams: locale.adminNoTeams,
    noTeamsFound: locale.noTeamsFound,
    addTeamToStart: locale.addTeamToStart,
    trySearch: locale.adminTrySearch,
    noPlayers: locale.noPlayersForTeam,
    noPlayersFound: locale.noPlayersFound,
    addFirstPlayer: locale.addFirstPlayerToTeam,
    noMatches: locale.adminNoMatchesForTeam,
    noMatchesFound: locale.noMatchesFound,
    addFirstMatch: locale.addFirstMatchToTeam,
    homeMatch: locale.homeMatch,
    awayMatch: locale.awayMatch,
    permissions: locale.generalPermissions,
    permissionsDescription: locale.permissionsDescription,
    allowed: locale.allowed,
    denied: locale.noPermission,
    playersPermission: locale.managePlayersPermission,
    matchesPermission: locale.manageMatchesPermission,
    teamsPermission: locale.manageTeamsPermission,
    usersPermission: locale.manageUsersPermission,
    linkedDataWarning: locale.linkedDataWarning,
    deleteTeamConfirm: locale.adminDeleteTeamConfirm,
    deletePlayerConfirm: locale.adminDeletePlayerConfirm,
    deleteMatchConfirm: locale.adminDeleteMatchConfirm,
    playedMatchWarning: locale.playedMatchWarning,
    deletePlayedMatchConfirm: locale.adminDeletePlayedMatchConfirm,
    linkedPlayers: locale.adminLinkedPlayers,
    linkedMatches: locale.adminLinkedMatches,
    playerSingular: locale.adminPlayerSingular,
    playerPlural: locale.adminPlayerPlural,
    matchSingular: locale.adminMatchSingular,
    matchPlural: locale.adminMatchPlural,
  };

  const positionLabels: Record<string, string> = {
    Keeper: locale.goalkeeperPosition,
    Verdediger: locale.defenderPosition,
    Middenvelder: locale.midfielderPosition,
    Aanvaller: locale.forwardPosition,
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
  const [activeTeamSection, setActiveTeamSection] = useState<TeamSection>(null);

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

    setPlayerList((current) => current.filter((item) => item.id !== player.id));
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

    setMatches((current) => current.filter((item) => item.id !== match.id));
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
      teams.length > 0 ? Math.max(...teams.map((item) => item.id)) + 1 : 1;

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
        reasons.push(`${playersInTeam.length} ${t.linkedPlayers}`);
      }

      if (matchesForTeam.length > 0) {
        reasons.push(`${matchesForTeam.length} ${t.linkedMatches}`);
      }

      window.alert(
        `${teamToDelete.name}\n\n${reasons.join("\n")}\n\n${t.linkedDataWarning}`,
      );
      return;
    }

    if (!window.confirm(`${t.deleteTeamConfirm}\n\n${teamToDelete.name}`)) {
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
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

      <section
        className="admin-overview"
        aria-labelledby="admin-overview-title"
      >
        <h2 id="admin-overview-title">{t.overview}</h2>

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              👥
            </span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{t.players}</span>
              <strong>{playersCount}</strong>
              <span className="admin-stat-description">{t.inTracker}</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              ⚽
            </span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">{t.matches}</span>
              <strong>{matchesCount}</strong>
              <span className="admin-stat-description">{t.savedMatches}</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              🛡️
            </span>
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
                          {playerCount === 1
                            ? t.playerSingular
                            : t.playerPlural}
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
              <strong>{teams.length === 0 ? t.noTeams : t.noTeamsFound}</strong>
              <p>{teams.length === 0 ? t.addTeamToStart : t.trySearch}</p>
            </div>
          )}
        </section>
      ) : (
        <section
          className="admin-panel"
          aria-labelledby="admin-selected-team-title"
        >
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
              <span className="admin-empty-icon" aria-hidden="true">
                ⚽
              </span>
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
                          <span>
                            {positionLabels[player.position] ?? player.position}
                          </span>
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
                  <span className="admin-empty-icon" aria-hidden="true">
                    👥
                  </span>
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
                    !playerList.some(
                      (player) => player.team === selectedTeam,
                    ) && (
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
                  <span className="admin-empty-icon" aria-hidden="true">
                    ⚽
                  </span>
                  <strong>
                    {matches.some(
                      (match) =>
                        match.home === selectedTeam ||
                        match.away === selectedTeam,
                    )
                      ? t.noMatchesFound
                      : t.noMatches}
                  </strong>
                  <p>
                    {matches.some(
                      (match) =>
                        match.home === selectedTeam ||
                        match.away === selectedTeam,
                    )
                      ? t.trySearch
                      : t.addFirstMatch}
                  </p>

                  {canManageMatches &&
                    !matches.some(
                      (match) =>
                        match.home === selectedTeam ||
                        match.away === selectedTeam,
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
          language={language}
        />
      )}

      {canManageMatches && showMatchForm && (
        <MatchForm
          editingMatch={editingMatch}
          setEditingMatch={setEditingMatch}
          setMatches={setMatches}
          closeModal={closeMatchForm}
          teams={teams}
          language={language}
        />
      )}
    </main>
  );
}
