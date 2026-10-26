
import type { UserRole, Permission } from "./permissions";
import {
  ROLE_PERMISSIONS,
  canAccessAdminPage,
} from "./permissions";
import { Link } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Match, Team } from "./types";
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
}: AdminPageProps) {
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

  const permissions = ROLE_PERMISSIONS[role];

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">EREDIVISIE-VOETBALTRACKER</p>
          <h1>Beheeromgeving</h1>
          <p>
            Beheer het overzicht van spelers, wedstrijden en clubs
            binnen je voetbaltracker.
          </p>
        </div>

        <span className="admin-role-badge">Beheerder</span>
      </header>

      <section
        className="admin-overview"
        aria-labelledby="admin-overview-title"
      >
              <section
        className="admin-panel admin-quick-actions"
        aria-labelledby="admin-quick-actions-title"
      >
        <div className="admin-panel-heading">
          <div>
            <h2 id="admin-quick-actions-title">Snelle acties</h2>
            <p>Ga direct naar het onderdeel dat je wilt beheren.</p>
          </div>
        </div>

        <div className="admin-actions-grid">
          <Link to="/spelers" className="admin-action-card">
            <span className="admin-action-icon" aria-hidden="true">
              👥
            </span>
            <span className="admin-action-content">
              <strong>Spelers beheren</strong>
              <span>Spelers toevoegen, bekijken en bewerken.</span>
            </span>
            <span className="admin-action-arrow" aria-hidden="true">
              →
            </span>
          </Link>

          <Link to="/wedstrijden" className="admin-action-card">
            <span className="admin-action-icon" aria-hidden="true">
              ⚽
            </span>
            <span className="admin-action-content">
              <strong>Wedstrijden beheren</strong>
              <span>Wedstrijden bekijken en uitslagen aanpassen.</span>
            </span>
            <span className="admin-action-arrow" aria-hidden="true">
              →
            </span>
          </Link>

          <Link to="/instellingen" className="admin-action-card">
            <span className="admin-action-icon" aria-hidden="true">
              🛡️
            </span>
            <span className="admin-action-content">
              <strong>Clubs beheren</strong>
              <span>De bestaande clubinstellingen openen.</span>
            </span>
            <span className="admin-action-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>
        <h2 id="admin-overview-title">Overzicht</h2>

        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              👥
            </span>
            <p>Spelers</p>
            <strong>{playersCount}</strong>
            <span className="admin-stat-description">
              Spelers in de tracker
            </span>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              ⚽
            </span>
            <p>Wedstrijden</p>
            <strong>{matchesCount}</strong>
            <span className="admin-stat-description">
              Wedstrijden opgeslagen
            </span>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon" aria-hidden="true">
              🛡️
            </span>
            <p>Clubs</p>
            <strong>{teamsCount}</strong>
            <span className="admin-stat-description">
              Clubs in het overzicht
            </span>
          </article>
        </div>
      </section>

      <section
        className="admin-panel"
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
    </main>
  );
}
