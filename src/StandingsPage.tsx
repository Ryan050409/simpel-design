import type { Match, Team } from "./types";
import type { Language } from "./translations";

type StandingsPageProps = {
  teams: Team[];
  matches: Match[];
  team: string;
  language: Language;
};

type Standing = {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

const labels = {
  nl: {
    title: "Eredivisie stand",
    subtitle: "Stand op basis van toegevoegde wedstrijden",
    empty: "Er zijn nog geen wedstrijden met een geldige uitslag.",
    demo: "Gebaseerd op je eigen wedstrijdgegevens",
    position: "Pos.",
    club: "Club",
    played: "GS",
    won: "W",
    drawn: "G",
    lost: "V",
    goalsFor: "DV",
    goalsAgainst: "DT",
    difference: "Ds",
    points: "P",
    favorite: "Favoriete club",
    matchesLabel: "Wedstrijden",
    goalsLabel: "Doelpunten",
    clubsLabel: "Clubs",
    note: "Alleen wedstrijden met een geldige uitslag tellen mee.",
  },
  en: {
    title: "Eredivisie standings",
    subtitle: "Based on added matches",
    empty: "There are no matches with a valid score yet.",
    demo: "Based on your own match data",
    position: "Pos.",
    club: "Club",
    played: "P",
    won: "W",
    drawn: "D",
    lost: "L",
    goalsFor: "GF",
    goalsAgainst: "GA",
    difference: "+/-",
    points: "Pts",
    favorite: "Favorite club",
    matchesLabel: "Matches",
    goalsLabel: "Goals",
    clubsLabel: "Clubs",
    note: "Only matches with a valid score are included.",
  },
  de: {
    title: "Eredivisie-Tabelle",
    subtitle: "Basierend auf hinzugefügten Spielen",
    empty: "Es gibt noch keine Spiele mit einem gültigen Ergebnis.",
    demo: "Basierend auf deinen Spieldaten",
    position: "Pl.",
    club: "Verein",
    played: "Sp.",
    won: "S",
    drawn: "U",
    lost: "N",
    goalsFor: "Tore",
    goalsAgainst: "GT",
    difference: "+/-",
    points: "Pkt.",
    favorite: "Lieblingsverein",
    matchesLabel: "Spiele",
    goalsLabel: "Tore",
    clubsLabel: "Vereine",
    note: "Nur Spiele mit einem gültigen Ergebnis werden berücksichtigt.",
  },
  fr: {
    title: "Classement de l'Eredivisie",
    subtitle: "Basé sur les matchs ajoutés",
    empty: "Aucun match avec un score valide pour le moment.",
    demo: "Basé sur tes données de match",
    position: "Pos.",
    club: "Club",
    played: "MJ",
    won: "V",
    drawn: "N",
    lost: "D",
    goalsFor: "BP",
    goalsAgainst: "BC",
    difference: "+/-",
    points: "Pts",
    favorite: "Club favori",
    matchesLabel: "Matchs",
    goalsLabel: "Buts",
    clubsLabel: "Clubs",

    note: "Seuls les matchs avec un score valide sont pris en compte.",
  },
  sp: {
    title: "Clasificación de la Eredivisie",
    subtitle: "Basada en los partidos añadidos",
    empty: "Todavía no hay partidos con un resultado válido.",
    demo: "Basado en tus datos de partidos",
    position: "Pos.",
    club: "Club",
    played: "PJ",
    won: "G",
    drawn: "E",
    lost: "P",
    goalsFor: "GF",
    goalsAgainst: "GC",
    difference: "+/-",
    points: "Pts",
    favorite: "Club favorito",
    matchesLabel: "Partidos",
    goalsLabel: "Goles",
    clubsLabel: "Clubes",

    note: "Solo se cuentan los partidos con un resultado válido.",
  },
  pt: {
    title: "Classificação da Eredivisie",
    subtitle: "Baseada nos jogos adicionados",
    empty: "Ainda não existem jogos com um resultado válido.",
    demo: "Baseado nos teus dados de jogos",
    position: "Pos.",
    club: "Clube",
    played: "J",
    won: "V",
    drawn: "E",
    lost: "D",
    goalsFor: "GM",
    goalsAgainst: "GS",
    difference: "+/-",
    points: "Pts",
    favorite: "Clube favorito",
    matchesLabel: "Jogos",
    goalsLabel: "Golos",
    clubsLabel: "Clubes",
    note: "Só são contabilizados jogos com um resultado válido.",
  },
};

function hasValidScore(match: Match): boolean {
  return (
    Number.isInteger(match.homeGoals) &&
    Number.isInteger(match.awayGoals) &&
    match.homeGoals >= 0 &&
    match.awayGoals >= 0
  );
}

const teamLogos: Record<string, string> = {
  "ADO Den Haag": "/ADODenHaag_Logo.png",
  Ajax: "/Ajax_Logo.png",
  AZ: "/AZ_Logo.png",
  "Excelsior Rotterdam": "/ExcelsiorRotterdam_Logo.png",
  "FC Groningen": "/fc_groningen_logo_2026.png",
  "FC Twente": "/FCTwente_Logo.png",
  "FC Utrecht": "/FCUtrecht_Logo.png",
  Feyenoord: "/Feyenoord_Logo.png",
  "Fortuna Sittard": "/FortunaSittard_Logo.png",
  "Go Ahead Eagles": "/GoAheadEagles_Logo.png",
  "N.E.C. Nijmegen": "/NEC_Nijmegen_Logo.png",
  "PEC Zwolle": "/PECZwolle_Logo.png",
  PSV: "/PSV_Logo.png",
  "SC Cambuur": "/SCCambuur_Logo.png",
  "sc Heerenveen": "/scHeerenveen_Logo.png",
  "Sparta Rotterdam": "/SpartaRotterdam_Logo.png",
  Telstar: "/Telstar_Logo.png",
  "Willem II": "/WillemII_Logo.png",
};

function createStandings(teams: Team[], matches: Match[]): Standing[] {
  const standings = new Map<string, Standing>();

  // Start every club at zero, including clubs without matches.
  teams.forEach((team) => {
    standings.set(team.name, {
      name: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  // Count only matches with a valid score.
  matches.filter(hasValidScore).forEach((match) => {
    const home = standings.get(match.home);
    const away = standings.get(match.away);

    // Ignore matches for clubs that are not in the team list.
    if (!home || !away || home.name === away.name) return;

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;

    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (match.homeGoals < match.awayGoals) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  return Array.from(standings.values())
    .map((club) => ({
      ...club,
      goalDifference: club.goalsFor - club.goalsAgainst,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.name.localeCompare(b.name),
    );
}

export default function StandingsPage({
  teams,
  matches,
  team,
  language,
}: StandingsPageProps) {
  const t = labels[language] ?? labels.nl;

  const standings = createStandings(teams, matches);
  const validMatches = matches.filter(hasValidScore);
  const countedMatches = validMatches.length;

  const totalGoals = validMatches.reduce(
    (total, match) => total + match.homeGoals + match.awayGoals,
    0,
  );

  const favoriteStanding = standings.find((club) => club.name === team);

  const podium = standings.slice(0, 3);

  return (
    <main className="standings-page">
      <header className="standings-header">
        <div>
          <h1>🏆 {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <span className="standings-demo-label">{t.demo}</span>
      </header>

      <section className="standings-favorite-card">
        <div className="standings-favorite-info">
          <span className="standings-eyebrow">{t.favorite}</span>
          <div className="standings-favorite-name">
            {teamLogos[team] && (
              <img
                src={teamLogos[team]}
                alt=""
                className="standings-featured-logo"
              />
            )}
            <h2>{team}</h2>
            <span className="standings-star" aria-hidden="true">
              ★
            </span>
          </div>
        </div>

        <div className="standings-favorite-numbers">
          <div>
            <span>{t.position}</span>
            <strong>
              {favoriteStanding
                ? `#${standings.findIndex((club) => club.name === team) + 1}`
                : "—"}
            </strong>
          </div>
          <div>
            <span>{t.difference}</span>
            <strong>
              {favoriteStanding
                ? `${favoriteStanding.goalDifference > 0 ? "+" : ""}${favoriteStanding.goalDifference}`
                : "—"}
            </strong>
          </div>
          <div>
            <span>{t.points}</span>
            <strong>{favoriteStanding?.points ?? "—"}</strong>
          </div>
        </div>
      </section>

      {countedMatches === 0 && <p role="status">{t.empty}</p>}

      <section className="standings-stats" aria-label="Competitiestatistieken">
        <article className="standings-stat-card">
          <span className="standings-stat-icon" aria-hidden="true">
            ⚽
          </span>
          <span className="standings-stat-label">{t.matchesLabel}</span>
          <strong>{countedMatches}</strong>
        </article>

        <article className="standings-stat-card">
          <span className="standings-stat-icon" aria-hidden="true">
            🥅
          </span>
          <span className="standings-stat-label">{t.goalsLabel}</span>
          <strong>{totalGoals}</strong>
        </article>

        <article className="standings-stat-card">
          <span className="standings-stat-icon" aria-hidden="true">
            🛡️
          </span>
          <span className="standings-stat-label">{t.clubsLabel}</span>
          <strong>{teams.length}</strong>
        </article>
      </section>

      {countedMatches > 0 && (
        <section className="standings-podium-section">
          <div className="standings-section-heading">
            <div>
              <h2>🏆 {t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
          </div>

          <div className="standings-podium">
            {podium.map((club, index) => (
              <article
                key={club.name}
                className={`standings-podium-card standings-podium-${index + 1}`}
              >
                <span className="standings-podium-rank">{index + 1}</span>

                {teamLogos[club.name] && (
                  <img
                    src={teamLogos[club.name]}
                    alt=""
                    className="standings-podium-logo"
                  />
                )}

                <strong className="standings-podium-name">{club.name}</strong>

                <span className="standings-podium-points">
                  {club.points} {t.points}
                </span>

                <span className="standings-podium-played">
                  {club.played} {t.played}
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="standings-table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th scope="col">{t.position}</th>
              <th scope="col" className="standings-club-heading">
                {t.club}
              </th>
              <th scope="col">{t.played}</th>
              <th className="standings-mobile-hide" scope="col">
                {t.won}
              </th>
              <th className="standings-mobile-hide" scope="col">
                {t.drawn}
              </th>
              <th className="standings-mobile-hide" scope="col">
                {t.lost}
              </th>
              <th className="standings-mobile-hide" scope="col">
                {t.goalsFor}
              </th>
              <th className="standings-mobile-hide" scope="col">
                {t.goalsAgainst}
              </th>
              <th scope="col">{t.difference}</th>
              <th scope="col">{t.points}</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((club, index) => {
              const isFavorite = club.name === team;

              return (
                <tr
                  key={club.name}
                  className={isFavorite ? "standings-row-favorite" : undefined}
                >
                  <td>{index + 1}</td>
                  <th scope="row" className="standings-club-name">
                    {teamLogos[club.name] && (
                      <img
                        src={teamLogos[club.name]}
                        alt=""
                        className="standings-team-logo"
                      />
                    )}

                    {isFavorite && (
                      <span
                        className="standings-star"
                        title={t.favorite}
                        aria-label={t.favorite}
                        role="img"
                      >
                        ★
                      </span>
                    )}

                    {club.name}
                  </th>

                  <td>{club.played}</td>
                  <td className="standings-mobile-hide">{club.won}</td>
                  <td className="standings-mobile-hide">{club.drawn}</td>
                  <td className="standings-mobile-hide">{club.lost}</td>
                  <td className="standings-mobile-hide">{club.goalsFor}</td>
                  <td className="standings-mobile-hide">{club.goalsAgainst}</td>
                  <td>
                    {club.goalDifference > 0 ? "+" : ""}
                    {club.goalDifference}
                  </td>
                  <td className="standings-points">{club.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="standings-footnote">{t.note}</p>
    </main>
  );
}
