import type { Team, Player, Match } from "./types";

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
  player: Omit<Player, "id">,
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
//Spelers updaten //
export async function updatePlayerRequest(
  id: number,
  player: Omit<Player, "id">,
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
// Wedstrijden ophalen uit database
export async function getMatches(): Promise<Match[]> {
  const response = await fetch(`${API_URL}/Matches`);

  if (!response.ok) {
    throw new Error("Wedstrijden ophalen is mislukt.");
  }

  return response.json();
}
//Wedstrijd aanmaken //
export async function createMatchRequest(
  match: Omit<Match, "id">,
): Promise<Match> {
  const response = await fetch(`${API_URL}/Matches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(match),
  });

  if (!response.ok) {
    throw new Error("Wedstrijd toevoegen is mislukt.");
  }

  return response.json();
}
// Wedstrijd updaten //
export async function updateMatchRequest(
  id: number,
  match: Omit<Match, "id">,
): Promise<void> {
  const response = await fetch(`${API_URL}/Matches/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      ...match,
    }),
  });

  if (!response.ok) {
    throw new Error("Wedstrijd aanpassen is mislukt.");
  }
}
// Wedstrijd verwijderen //
export async function deleteMatchRequest(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/Matches/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Wedstrijd verwijderen is mislukt.");
  }
}