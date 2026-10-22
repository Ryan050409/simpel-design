
export type UserRole = "admin" | "player";

export type Permission =
  | "players.manage"
  | "matches.manage"
  | "teams.manage"
  | "users.manage";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "players.manage",
    "matches.manage",
    "teams.manage",
    "users.manage",
  ],
  player: [],
};

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAccessAdminPage(role: UserRole): boolean {
  return role === "admin";
}
