
import type { UserRole, Permission } from "./permissions";
import {
  ROLE_PERMISSIONS,
  canAccessAdminPage,
} from "./permissions";

type AdminPageProps = {
  role: UserRole;
};

const PERMISSION_LABELS: Record<Permission, string> = {
  "players.manage": "Spelers beheren",
  "matches.manage": "Wedstrijden beheren",
  "teams.manage": "Teams beheren",
  "users.manage": "Gebruikers en rechten beheren",
};

export default function AdminPage({ role }: AdminPageProps) {
  if (!canAccessAdminPage(role)) {
    return (
      <main className="page-container">
        <h1>Geen toegang</h1>
        <p>Je hebt geen toestemming om deze pagina te bekijken.</p>
      </main>
    );
  }

  const permissions = ROLE_PERMISSIONS[role];

  return (
    <main className="page-container">
      <h1>Adminpagina</h1>
      <p>Beheeromgeving voor beheerders.</p>

      <section aria-labelledby="admin-permissions-title">
        <h2 id="admin-permissions-title">Beheerrechten</h2>

        {permissions.length > 0 ? (
          <ul>
            {permissions.map((permission) => (
              <li key={permission}>
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
