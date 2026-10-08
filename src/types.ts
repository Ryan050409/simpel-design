export type Player = {
    id: number;
    firstname: string;
    lastname: string;
    team: string;
    position: string;
    number: number;

    goals: number;
    assists: number;
    matches: number;
    minutesplayed: number;
    rating: number;

    tackles: number; 
    interceptions:number;
    blocks: number;
    clearances: number;
    duelsWon: number;
    fouls: number;

    cleanSheets?: number;
    saves?: number;
    oneVSOneSaves?: number;
    penaltySaves?: number;
    goalsConceded?: number;
};

export type Match = {
    id: number;
    home: string;
    away: string;
    homeGoals: number;
    awayGoals: number;
    date: string;
};

export type Team = {
    id: number;
    name: string;
};