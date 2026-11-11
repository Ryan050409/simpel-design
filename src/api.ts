
import type { Team, Player } from "./types";

const API_URL = "http://localhost:5001/api";
//Teams ophalen uit database //
export async function getTeams(): Promise<Team[]> {
  const response = await fetch(`${API_URL}/Teams`);

  if (!response.ok) {
    throw new Error("Teams ophalen is mislukt");
  }

  return response.json();
}
//Team aanmaken //
export async function createTeamRequest(name: string): Promise<Team> {
  const response = await fetch(`${API_URL}/Teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Team toevoegen is mislukt.");
  }

  return response.json();
}
//Teams verwijderen //
export async function deleteTeamRequest(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/Teams/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Team verwijderen is mislukt.");
  }
}
//Spelers ophalen uit database //
export async function getPlayers(): Promise<Player[]> {
  const response = await fetch(`${API_URL}/Players`);

  if (!response.ok) {
    throw new Error("Spelers ophalen is mislukt.");
  }

  return response.json();
}
//Spelers aanmaken //
export async function createPlayerRequest(
  player: Omit<Player, "id">
): Promise<Player> {
  const response = await fetch(`${API_URL}/Players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!response.ok) {
    throw new Error("Speler toevoegen is mislukt.");
  }

  return response.json();
}
//Spelers verwijderen //
export async function deletePlayerRequest(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/Players/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Speler verwijderen is mislukt.");
  }
}
export async function updatePlayerRequest(
  id: number,
  player: Omit<Player, "id">
): Promise<Player> {
  const response = await fetch(`${API_URL}/Players/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!response.ok) {
    throw new Error("Speler aanpassen is mislukt.");
  }

  return response.json();
}