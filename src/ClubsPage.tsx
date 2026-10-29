
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Team } from "./types";
import { translations, type Language } from "./translations";

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
          <p>Ontdek alle clubs in jouw Football Tracker.</p>
        </div>

        <span className="clubs-count">
          {filteredTeams.length} clubs
        </span>
      </header>

      <div className="clubs-search">
        <label htmlFor="clubs-search-input">Zoek een club</label>
        <input
          id="clubs-search-input"
          type="search"
          placeholder="Typ een clubnaam..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {filteredTeams.length === 0 ? (
        <p className="clubs-empty">
          Geen clubs gevonden. Probeer een andere zoekterm.
        </p>
      ) : (
        <div className="clubs-grid">
          {filteredTeams.map((team) => {
            const isFavorite = favoriteTeam === team.name;

            return (
              <article className="club-card" key={team.id}>
                <button
                  type="button"
                  className={`club-favorite ${
                    isFavorite ? "is-favorite" : ""
                  }`}
                  aria-label={
                    isFavorite
                      ? `${team.name} is je favoriete club`
                      : `${team.name} als favoriete club instellen`
                  }
                  aria-pressed={isFavorite}
                  onClick={() => onSetFavorite(team.name)}
                >
                  {isFavorite ? "★" : "☆"}
                </button>

                <Link
                  className="club-card-link"
                  to={`/competitie/clubs/${team.id}`}
                  aria-label={`Bekijk informatie over ${team.name}`}
                >
                  <div className="club-logo-placeholder" aria-hidden="true">
                    {team.name.slice(0, 3).toUpperCase()}
                  </div>

                  <h2>{team.name}</h2>
                  <span className="club-card-detail">
                    Bekijk clubinformatie →
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
