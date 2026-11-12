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
};

export type Team = {
    id: number;
    name: string;
};