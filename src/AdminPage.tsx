
import { useState } from "react";
import type { Dispatch, SetStateAction, FormEvent } from "react";

import type { UserRole, Permission } from "./permissions";
import { ROLE_PERMISSIONS, canAccessAdminPage } from "./permissions";

import type { Player, Match, Team } from "./types";
import PlayerForm from "./PlayerForm";

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

const PERMISSION_LABELS: Record<Permission, string> = {
  "players.manage": "Spelers beheren",
  "matches.manage": "Wedstrijden beheren",
  "teams.manage": "Teams beheren",
  "users.manage": "Gebruikers en rechten beheren",
};

export default function AdminPage({
  role,
  playersCount,
  matchesCount,
  teamsCount,
  playerList,
  setPlayerList,
  matches,
  teams,
  setTeams,
}: AdminPageProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerSearch, setPlayerSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [teamError, setTeamError] = useState("");

  const permissions = ROLE_PERMISSIONS[role];

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

  const selectedTeamData =
    teams.find((team) => team.name === selectedTeam) ?? null;

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

  function openAddPlayerForm() {
    setEditingPlayer(null);
    setShowPlayerForm(true);
  }

  function openEditPlayerForm(player: Player) {
    setEditingPlayer(player);
    setShowPlayerForm(true);
  }

  function closePlayerForm() {
    setShowPlayerForm(false);
    setEditingPlayer(null);
  }

  function deletePlayer(player: Player) {
    const confirmed = window.confirm(
      `Weet je zeker dat je ${player.firstname} ${player.lastname} wilt verwijderen?`,
    );

    if (!confirmed) return;

    setPlayerList((currentPlayers) =>
      currentPlayers.filter((item) => item.id !== player.id),
    );
  }

  function addTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    const playersInTeam = playerList.filter(
      (player) => player.team === team.name,
    );

    const matchesForTeam = matches.filter(
      (match) => match.home === team.name || match.away === team.name,
    );

    if (playersInTeam.length > 0 || matchesForTeam.length > 0) {
      const reasons = [];

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
      setSelectedTeam(null);
      setPlayerSearch("");
    }
  }

  function returnToTeams() {
    setSelectedTeam(null);
    setPlayerSearch("");
    setShowPlayerForm(false);
    setEditingPlayer(null);
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">EREDIVISIE-VOETBALTRACKER</p>
          <h1>Beheeromgeving</h1>
          <p>Beheer clubs en hun spelers op één overzichtelijke plek.</p>
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
              <span className="admin-stat-description">
                In de tracker
              </span>
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
        <section
          className="admin-panel"
          aria-labelledby="admin-teams-title"
        >
          <div className="admin-panel-heading">
            <div>
              <h2 id="admin-teams-title">Teams beheren</h2>
              <p>
                Kies een club om de spelers te bekijken en te beheren.
              </p>
            </div>

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

            <span className="admin-player-count">
              {filteredTeams.length} van {teams.length} teams
            </span>
          </div>

          {filteredTeams.length > 0 ? (
            <div className="admin-team-grid">
              {filteredTeams.map((team) => {
                const count = playerList.filter(
                  (player) => player.team === team.name,
                ).length;

                return (
                  <article className="admin-team-card" key={team.id}>
                    <button
                      type="button"
                      className="admin-team-select"
                      onClick={() => {
                        setSelectedTeam(team.name);
                        setPlayerSearch("");
                      }}
                      aria-label={`Bekijk spelers van ${team.name}`}
                    >
                      <span className="admin-team-icon" aria-hidden="true">
                        ⚽
                      </span>

                      <span className="admin-team-card-content">
                        <strong>{team.name}</strong>
                        <span>
                          {count} {count === 1 ? "speler" : "spelers"}
                        </span>
                      </span>

                      <span
                        className="admin-team-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      className="admin-team-delete"
                      onClick={() => deleteTeam(team)}
                      aria-label={`Verwijder team ${team.name}`}
                    >
                      Verwijderen
                    </button>
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
          aria-labelledby="admin-team-players-title"
        >
          <button
            type="button"
            className="admin-back-button"
            onClick={returnToTeams}
          >
            ← Terug naar teams
          </button>

          <div className="admin-panel-heading admin-selected-team-heading">
            <div>
              <p className="admin-eyebrow">TEAMBEHEER</p>
              <h2 id="admin-team-players-title">{selectedTeam}</h2>
              <p>
                {playerList.filter(
                  (player) => player.team === selectedTeam,
                ).length}{" "}
                spelers gekoppeld aan dit team.
              </p>
            </div>

            <button
              type="button"
              className="admin-primary-button"
              onClick={openAddPlayerForm}
            >
              + Speler toevoegen
            </button>
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
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() => openEditPlayerForm(player)}
                      aria-label={`Bewerk ${player.firstname} ${player.lastname}`}
                    >
                      Bewerken
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => deletePlayer(player)}
                      aria-label={`Verwijder ${player.firstname} ${player.lastname}`}
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

              {!playerList.some(
                (player) => player.team === selectedTeam,
              ) && (
                <button
                  type="button"
                  onClick={openAddPlayerForm}
                >
                  Speler toevoegen
                </button>
              )}
            </div>
          )}
        </section>
      )}

      <section
        className="admin-panel admin-permissions-panel"
        aria-labelledby="admin-permissions-title"
      >
        <div className="admin-panel-heading">
          <div>
            <h2 id="admin-permissions-title">Beheerrechten</h2>
            <p>Rechten die bij jouw huidige rol horen.</p>
          </div>

          <span className="admin-permission-count">
            {permissions.length} rechten
          </span>
        </div>

        {permissions.length > 0 ? (
          <ul className="admin-permissions-list">
            {permissions.map((permission) => (
              <li key={permission}>
                <span className="admin-permission-check" aria-hidden="true">
                  ✓
                </span>
                {PERMISSION_LABELS[permission]}
              </li>
            ))}
          </ul>
        ) : (
          <p>Deze gebruiker heeft geen beheerrechten.</p>
        )}
      </section>

      {showPlayerForm && (
        <PlayerForm
          editingPlayer={editingPlayer}
          setEditingPlayer={setEditingPlayer}
          setPlayerList={setPlayerList}
          closeModal={closePlayerForm}
          teams={teams}
        />
      )}
    </main>
  );
}
