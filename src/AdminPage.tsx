
import type { UserRole, Permission } from "./permissions";
import {
  ROLE_PERMISSIONS,
  canAccessAdminPage,
} from "./permissions";

type AdminPageProps = {
  role: UserRole;
  playersCount: number;
  matchesCount: number;
  teamsCount: number;
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
