export type Player = {
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