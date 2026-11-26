export type PlayerPosition =
  | "GK"
  | "CB"
  | "LB"
  | "RB"
  | "LWB"
  | "RWB"
  | "CDM"
  | "CM"
  | "CAM"
  | "LM"
  | "RM"
  | "LW"
  | "RW"
  | "CF"
  | "ST";
export type Player = {
  id: number;
  firstname: string;
  lastname: string;
  team: string;
  position: PlayerPosition;
  number: number;

  goals: number | null;
  assists: number | null;
  matches: number | null;
  minutesPlayed: number | null;

  tackles: number | null;
  interceptions: number | null;
  blocks: number | null;
  clearances: number | null;
  duelsWon: number | null;
  fouls: number | null;

  cleanSheets: number | null;
  saves: number | null;
  oneVSOneSaves: number | null;
  penaltySaves: number | null;
  goalsConceded: number | null;
};

export type Match = {
  id: number;
  home: string;
  away: string;
  homeGoals: number | null;
  awayGoals: number | null;
  date: string;
  matchday: number;
  venue?: string | null;
  city?: string | null;
  attendance?: number | null;
  homeLineup: string | null;
  awayLineup: string | null;
};

export type Team = {
  id: number;
  name: string;
};
export type LineupPlayer = {
  player_id: string;
  name: string;
  jersey: number | null;
  position?: string | null;
  formation_place?: number | null;
  minute_on?: number | null;
  minute_off?: number | null;
  goals?: number;
  assists?: number;
  yellow_cards?: number;
  red_cards?: number;
};

export type TeamLineup = {
  team_id: string;
  abbrev: string;
  formation: string;
  starting_xi: LineupPlayer[];
  substitutes_used: LineupPlayer[];
  unused_substitutes: LineupPlayer[];
};