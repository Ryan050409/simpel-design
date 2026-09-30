import type { Player } from "./types.ts";

const players: Player[] = [
    {
        id: 1,
        firstname: "Ryan",
        lastname: "Koster",
        team: "Feyenoord",
        position: "Middenvelder",
        number: 7,
        goals: 8,
        assists: 6,
        matches: 12,
        minutesplayed: 900,
        tackles: 3,
        interceptions:4 ,
        blocks: 1,
        clearences:1 ,
        duelsWon:4,
        fouls: 2,
        rating: 7.6
    },
    {
        id: 2,
        firstname: "Sam",
        lastname: "Oudewater",
        team: "Ajax",
        position: "Aanvaller",
        number: 8,
        goals: 6,
        assists: 8,
        matches: 12,
        minutesplayed: 850,
        tackles: 3,
        interceptions:4 ,
        blocks: 1,
        clearences:1 ,
        duelsWon:4,
        fouls:2,
        rating: 6.9
    },
    {
        id: 3,
        firstname: "Kevin",
        lastname: "de Jong",
        team: "PSV",
        position: "Middenvelder",
        number: 11,
        goals: 7,
        assists: 4,
        matches: 12,
        minutesplayed: 780,
        tackles: 3,
        interceptions:4 ,
        blocks: 1,
        clearences:1 ,
        duelsWon:4,
        fouls:2,
        rating: 6.8
    }
];

export default players;