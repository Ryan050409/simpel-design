import { useState } from "react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

import type { UserRole, Permission } from "./permissions";
import {
  ROLE_PERMISSIONS,
  hasPermission,
  canAccessAdminPage,
} from "./permissions";

import type { Player, Match, Team } from "./types";
import PlayerForm from "./PlayerForm";
import MatchForm from "./MatchForm";

type AdminPageProps = {
  role: UserRole;
  playersCount: number;
  matchesCount: number;
  teamsCount: number;
  playerList: Player[];
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
};

type TeamSection = "players" | "matches" | null;

const PERMISSION_LABELS: Record<Permission, string> = {
  "players.manage": "Spelers beheren",
  "matches.manage": "Wedstrijden beheren",
  "teams.manage": "Teams beheren",
  "users.manage": "Gebruikers en rechten beheren",
};

const allPermissions: Permission[] = [
  "players.manage",
  "matches.manage",
  "teams.manage",
  "users.manage",
];

export default function AdminPage({
  role,
  playersCount,
  matchesCount,
  teamsCount,
  playerList,
  setPlayerList,
  matches,
  setMatches,
  teams,
  setTeams,
}: AdminPageProps) {
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

  const permissions = ROLE_PERMISSIONS[role];

  const canManagePlayers = hasPermission(role, "players.manage");
  const canManageMatches = hasPermission(role, "matches.manage");
  const canManageTeams = hasPermission(role, "teams.manage");
  const canManageUsers = hasPermission(role, "users.manage");

  if (!canAccessAdminPage(role)) {
    return (
      <main className="admin-page">
        <section className="admin-panel">
          <h1>Geen toegang</h1>
          <p>Je hebt geen toestemming om deze pagina te bekijken.</p>
        </section>
      </main>
    );
  }

  const sortedTeams = [...teams].sort((a, b) =>
    a.name.localeCompare(b.name, "nl"),
  );

  const filteredTeams = sortedTeams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.trim().toLowerCase()),
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
            "nl",
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

  function closePlayerForm() {
    setShowPlayerForm(false);
    setEditingPlayer(null);
  }

  function deletePlayer(player: Player) {
    if (!canManagePlayers) return;

    const confirmed = window.confirm(
      `Weet je zeker dat je ${player.firstname} ${player.lastname} wilt verwijderen?`,
    );

    if (!confirmed) return;

    setPlayerList((currentPlayers) =>
      currentPlayers.filter((item) => item.id !== player.id),
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

  function closeMatchForm() {
    setShowMatchForm(false);
    setEditingMatch(null);
  }

  function deleteMatch(match: Match) {
    if (!canManageMatches) return;
    const confirmed = window.confirm(
      `Weet je zeker dat je de wedstrijd ${match.home} ${match.homeGoals} - ${match.awayGoals} ${match.away} wilt verwijderen?`,
    );

    if (!confirmed) return;

    setMatches((currentMatches) =>
      currentMatches.filter((item) => item.id !== match.id),
    );
  }

  function addTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManageTeams) return;
    const name = newTeamName.trim();

    if (!name) {
      setTeamError("Vul een teamnaam in.");
      return;
    }

    const alreadyExists = teams.some(
      (team) => team.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      setTeamError("Dit team bestaat al.");
      return;
    }

    const newId =
      teams.length > 0 ? Math.max(...teams.map((team) => team.id)) + 1 : 1;

    setTeams((currentTeams) => [...currentTeams, { id: newId, name }]);
    setNewTeamName("");
    setTeamError("");
    setShowTeamForm(false);
    setTeamSearch("");
  }

  function deleteTeam(team: Team) {
    if (!canManageTeams) return;
    const playersInTeam = playerList.filter(
      (player) => player.team === team.name,
    );

    const matchesForTeam = matches.filter(
      (match) => match.home === team.name || match.away === team.name,
    );

    if (playersInTeam.length > 0 || matchesForTeam.length > 0) {
      const reasons: string[] = [];

      if (playersInTeam.length > 0) {
        reasons.push(
          `${playersInTeam.length} speler(s) aan dit team gekoppeld`,
        );
      }

      if (matchesForTeam.length > 0) {
        reasons.push(
          `${matchesForTeam.length} wedstrijd(en) aan dit team gekoppeld`,
        );
      }

      window.alert(
        `Je kunt ${team.name} nog niet verwijderen.\n\n${reasons.join(
          "\n",
        )}.\n\nVerwijder of wijzig eerst de gekoppelde gegevens.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Weet je zeker dat je team "${team.name}" wilt verwijderen?`,
    );

    if (!confirmed) return;

    setTeams((currentTeams) =>
      currentTeams.filter((item) => item.id !== team.id),
    );

    if (selectedTeam === team.name) {
      returnToTeams();
    }
  }

  function returnToTeams() {
    setSelectedTeam(null);
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

  function changeSelectedTeam(teamName: string) {
    setSelectedTeam(teamName);
    setActiveTeamSection(null);
    setPlayerSearch("");
    setMatchSearch("");
    closePlayerForm();
    closeMatchForm();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">EREDIVISIE-VOETBALTRACKER</p>
          <h1>Beheeromgeving</h1>
          <p>
            Beheer teams, spelers en wedstrijden op één overzichtelijke plek.
          </p>
        </div>

        <span className="admin-role-badge">Beheerder</span>
      </header>

      <section
        className="admin-overview"
        aria-labelledby="admin-overview-title"
      >
        <h2 id="admin-overview-title">Overzicht</h2>

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              👥
            </span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Spelers</span>
              <strong>{playersCount}</strong>
              <span className="admin-stat-description">In de tracker</span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              ⚽
            </span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Wedstrijden</span>
              <strong>{matchesCount}</strong>
              <span className="admin-stat-description">
                Opgeslagen wedstrijden
              </span>
            </div>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              🛡️
            </span>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Teams</span>
              <strong>{teamsCount}</strong>
              <span className="admin-stat-description">
                Clubs in de tracker
              </span>
            </div>
          </article>
        </div>
      </section>

      {!selectedTeam ? (
        <section className="admin-panel" aria-labelledby="admin-teams-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="admin-teams-title">Teams beheren</h2>
              <p>Kies een club om de spelers en wedstrijden te beheren.</p>
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
                {showTeamForm ? "Annuleren" : "+ Team toevoegen"}
              </button>
            )}
          </div>

          {showTeamForm && (
            <form className="admin-team-form" onSubmit={addTeam}>
              <label htmlFor="admin-new-team-name">
                Naam van het nieuwe team
              </label>

              <div className="admin-team-form-fields">
                <input
                  id="admin-new-team-name"
                  type="text"
                  value={newTeamName}
                  onChange={(event) => {
                    setNewTeamName(event.target.value);
                    setTeamError("");
                  }}
                  placeholder="Bijvoorbeeld: Ajax"
                  maxLength={80}
                  required
                />

                <button type="submit" className="admin-primary-button">
                  Team opslaan
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
              Zoek een team
              <input
                id="admin-team-search"
                type="search"
                value={teamSearch}
                onChange={(event) => setTeamSearch(event.target.value)}
                placeholder="Zoek op clubnaam..."
              />
            </label>

            <span className="admin-player-count" aria-live="polite">
              {filteredTeams.length} van {teams.length} teams
            </span>
          </div>

          {filteredTeams.length > 0 ? (
            <div className="admin-team-grid">
              {filteredTeams.map((team) => {
                const playerCount = playerList.filter(
                  (player) => player.team === team.name,
                ).length;

                const matchCount = matches.filter(
                  (match) =>
                    match.home === team.name || match.away === team.name,
                ).length;

                return (
                  <article className="admin-team-card" key={team.id}>
                    <button
                      type="button"
                      className="admin-team-select"
                      onClick={() => changeSelectedTeam(team.name)}
                      aria-label={`Beheer spelers en wedstrijden van ${team.name}`}
                    >
                      <span className="admin-team-icon" aria-hidden="true">
                        ⚽
                      </span>

                      <span className="admin-team-card-content">
                        <strong>{team.name}</strong>
                        <span>
                          {playerCount}{" "}
                          {playerCount === 1 ? "speler" : "spelers"} ·{" "}
                          {matchCount}{" "}
                          {matchCount === 1 ? "wedstrijd" : "wedstrijden"}
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
                        onClick={() => deleteTeam(team)}
                        aria-label={`Verwijder team ${team.name}`}
                      >
                        Verwijderen
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="admin-empty-state">
              <strong>
                {teams.length === 0
                  ? "Er zijn nog geen teams"
                  : "Geen teams gevonden"}
              </strong>
              <p>
                {teams.length === 0
                  ? "Voeg een team toe om te beginnen."
                  : "Probeer een andere zoekterm."}
              </p>
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
            ← Terug naar teams
          </button>

          <div className="admin-panel-heading admin-selected-team-heading">
            <div className="admin-team-header">
              <span className="admin-team-eyebrow">TEAMBEHEER</span>

              <h2 id="admin-selected-team-title" className="admin-team-title">
                <select
                  className="admin-team-dropdown"
                  value={selectedTeam}
                  onChange={(event) => changeSelectedTeam(event.target.value)}
                  aria-label="Kies een team om te beheren"
                >
                  {sortedTeams.map((team) => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </h2>

              <p>Kies welk onderdeel je van dit team wilt beheren.</p>
            </div>
          </div>

          <div
            className="admin-team-section-switch"
            role="group"
            aria-label="Kies wat je wilt beheren"
          >
            <button
              type="button"
              className={`admin-section-button ${
                activeTeamSection === "players" ? "active" : ""
              }`}
              aria-pressed={activeTeamSection === "players"}
              onClick={() => selectTeamSection("players")}
            >
              👥 Spelers
            </button>

            <button
              type="button"
              className={`admin-section-button ${
                activeTeamSection === "matches" ? "active" : ""
              }`}
              aria-pressed={activeTeamSection === "matches"}
              onClick={() => selectTeamSection("matches")}
            >
              ⚽ Wedstrijden
            </button>
          </div>

          {activeTeamSection === null && (
            <div className="admin-empty-state">
              <span className="admin-empty-icon" aria-hidden="true">
                ⚽
              </span>
              <strong>Wat wil je beheren?</strong>
              <p>
                Kies hierboven voor spelers of wedstrijden van {selectedTeam}.
              </p>
            </div>
          )}

          {activeTeamSection === "players" && (
            <>
              <div className="admin-panel-heading">
                <div>
                  <h3>Spelers beheren</h3>
                  <p>Voeg spelers toe, bewerk hun gegevens of verwijder ze.</p>
                </div>

                {canManagePlayers && (
                  <button
                    type="button"
                    className="admin-primary-button"
                    onClick={openAddPlayerForm}
                  >
                    + Speler toevoegen
                  </button>
                )}
              </div>

              <div className="admin-player-toolbar">
                <label htmlFor="admin-player-search">
                  Zoek een speler
                  <input
                    id="admin-player-search"
                    type="search"
                    value={playerSearch}
                    onChange={(event) => setPlayerSearch(event.target.value)}
                    placeholder="Naam of positie..."
                  />
                </label>

                <span className="admin-player-count" aria-live="polite">
                  {teamPlayers.length} spelers weergegeven
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
                          <button
                            type="button"
                            className="admin-edit-button"
                            onClick={() => openEditPlayerForm(player)}
                            aria-label={`Bewerk ${player.firstname} ${player.lastname}`}
                          >
                            Bewerken
                          </button>
                        )}

                        {canManagePlayers && (
                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() => deletePlayer(player)}
                            aria-label={`Verwijder ${player.firstname} ${player.lastname}`}
                          >
                            Verwijderen
                          </button>
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
                      ? "Geen spelers gevonden"
                      : "Nog geen spelers bij dit team"}
                  </strong>
                  <p>
                    {playerList.some((player) => player.team === selectedTeam)
                      ? "Probeer een andere zoekterm."
                      : "Voeg de eerste speler aan deze club toe."}
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
                        Speler toevoegen
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
                  <h3>Wedstrijden beheren</h3>
                  <p>
                    Bekijk alle thuis- en uitwedstrijden van {selectedTeam}.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={openAddMatchForm}
                >
                  + Wedstrijd toevoegen
                </button>
              </div>

              <div className="admin-player-toolbar">
                <label htmlFor="admin-match-search">
                  Zoek een wedstrijd
                  <input
                    id="admin-match-search"
                    type="search"
                    value={matchSearch}
                    onChange={(event) => setMatchSearch(event.target.value)}
                    placeholder="Team, datum of uitslag..."
                  />
                </label>

                <span className="admin-player-count" aria-live="polite">
                  {teamMatches.length} wedstrijden weergegeven
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
                              ? "Thuiswedstrijd"
                              : "Uitwedstrijd"}
                          </span>
                        </div>
                      </div>

                      <div className="admin-player-actions">
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() => openEditMatchForm(match)}
                          aria-label={`Bewerk ${match.home} tegen ${match.away}`}
                        >
                          Bewerken
                        </button>

                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() => deleteMatch(match)}
                          aria-label={`Verwijder ${match.home} tegen ${match.away}`}
                        >
                          Verwijderen
                        </button>
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
                      ? "Geen wedstrijden gevonden"
                      : "Nog geen wedstrijden voor dit team"}
                  </strong>
                  <p>
                    {matches.some(
                      (match) =>
                        match.home === selectedTeam ||
                        match.away === selectedTeam,
                    )
                      ? "Probeer een andere zoekterm."
                      : "Voeg de eerste wedstrijd toe voor dit team."}
                  </p>

                  {!matches.some(
                    (match) =>
                      match.home === selectedTeam ||
                      match.away === selectedTeam,
                  ) && (
                    <button
                      type="button"
                      className="admin-primary-button"
                      onClick={openAddMatchForm}
                    >
                      Wedstrijd toevoegen
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      )}

      <ul className="admin-permissions-list">
        {allPermissions.map((permission) => (
          <li key={permission}>
            <span className="admin-permission-check" aria-hidden="true">
              {hasPermission(role, permission) ? "✓" : "—"}
            </span>
            {PERMISSION_LABELS[permission]}
            {" — "}
            {hasPermission(role, permission) ? "Toegestaan" : "Geen toegang"}
          </li>
        ))}
      </ul>

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
