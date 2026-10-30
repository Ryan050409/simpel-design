import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Team } from "./types";
import { translations, type Language } from "./translations";
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
type ClubsPageProps = {
  teams: Team[];
  favoriteTeam: string;
  onSetFavorite: (teamName: string) => void;
  language: Language;
};

function ClubsPage({
  teams,
  favoriteTeam,
  onSetFavorite,
  language,
}: ClubsPageProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = useMemo(() => {
    return [...teams]
      .filter((team) =>
        team.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [teams, searchTerm]);

  return (
    <main className="clubs-page">
      <header className="clubs-page-header">
        <div>
          <h1>{t.clubsLabel}</h1>
          <p>{t.clubsPageDescription}</p>
        </div>

        <span className="clubs-count">
          {filteredTeams.length} {t.clubsCountLabel}
        </span>
      </header>

      <div className="clubs-search">
        <label htmlFor="clubs-search-input">{t.clubsSearchLabel}</label>
        <input
          id="clubs-search-input"
          type="search"
          placeholder={t.clubsSearchPlaceholder}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {filteredTeams.length === 0 ? (
        <p className="clubs-empty">{t.clubsNoResults}</p>
      ) : (
        <div className="clubs-grid">
          {filteredTeams.map((team) => {
            const isFavorite = favoriteTeam === team.name;

            return (
              <article className="club-card" key={team.id}>
                <button
                  type="button"
                  className={`club-favorite ${isFavorite ? "is-favorite" : ""}`}
                  aria-label={
                    isFavorite
                      ? `${team.name} ${t.clubIsFavorite}`
                      : `${team.name}: ${t.setAsFavoriteClub}`
                  }
                  aria-pressed={isFavorite}
                  onClick={() => onSetFavorite(team.name)}
                >
                  {isFavorite ? "★" : "☆"}
                </button>

                <Link
                  className="club-card-link"
                  to={`/competitie/clubs/${team.id}`}
                  aria-label={`${t.viewClubInformation} ${team.name}`}
                >
                  {teamLogos[team.name] ? (
                    <img
                      className="club-logo-image"
                      src={teamLogos[team.name]}
                      alt={`${t.clubLogoAlt} ${team.name}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="club-logo-fallback" aria-hidden="true">
                      {team.name.slice(0, 3).toUpperCase()}
                    </div>
                  )}
                  <h2>{team.name}</h2>
                  <span className="club-card-detail">
                    {t.viewClubInformation} →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default ClubsPage;
