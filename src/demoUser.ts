
import type { UserRole } from "./permissions";

export type DemoUser = {
  id: string;
  displayName: string;
  role: UserRole;
};

export const DEMO_USER: DemoUser = {
  id: "demo-admin",
  displayName: "Demo Admin",
  role: "admin",
};
