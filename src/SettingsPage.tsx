import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Match, Team } from "./types.ts";

type SettingsPageProps = {
  teams: Team[];
  team: string;
  setTeam: Dispatch<SetStateAction<string>>;
  players: Player[];
  matches: Match[];
  theme: "dark" | "light";
  setTheme: Dispatch<SetStateAction<"dark" | "light">>;
};

function SettingsPage({
  players,
  matches,
  teams,
  team,
  setTeam,
  theme,
  setTheme,
}: SettingsPageProps) {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: "Hoe voeg ik een speler toe?",
      answer:
        "Ga naar de Adminpagina, kies een team en open Spelers beheren. Daar kun je spelers toevoegen, aanpassen en verwijderen.",
    },
    {
      question: "Hoe voeg ik een team toe?",
      answer:
        "Ga naar de Adminpagina en open Teams beheren. Daar kun je teams toevoegen en verwijderen.",
    },
    {
      question: "Waar worden mijn gegevens opgeslagen?",
      answer:
        "Je gegevens worden lokaal in je browser opgeslagen. Daardoor blijven je spelers, wedstrijden en teams bewaard wanneer je de pagina opnieuw opent.",
    },
    {
      question: "Kan ik een speler aanpassen?",
      answer:
        "Ja. Ga naar de Adminpagina, kies het juiste team en open Spelers beheren.",
    },
    {
      question: "Kan ik een wedstrijd verwijderen?",
      answer:
        "Ja. Ga naar de Adminpagina, kies het juiste team en open Wedstrijden beheren.",
    },
    {
      question: "Kan ik zelf een teamnaam typen?",
      answer:
        "Teams voeg je toe via Teams beheren op de Adminpagina. Bij het toevoegen van spelers en wedstrijden kun je een team selecteren uit de beschikbare teams.",
    },
  ];

  function exportData() {
    const data = {
      players,
      matches,
      teams,
      favoriteTeam: team,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "voetbaltracker-backup.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <h1>⚙️ Instellingen</h1>
      </div>

      <div className="settings-list">
        <div className="favorite-team-setting">
          <div className="favorite-team-setting-header">
            <div>
              <strong>⭐ Favoriete team</strong>
              <small>
                Kies het team waarvoor je de statistieken wilt bekijken.
              </small>
            </div>
          </div>

          <div className="favorite-team-options">
            {teams.map((teamOption) => (
              <button
                key={teamOption.id}
                type="button"
                className={
                  teamOption.name === team
                    ? "favorite-team-option selected"
                    : "favorite-team-option"
                }
                onClick={() => setTeam(teamOption.name)}
                aria-pressed={teamOption.name === team}
              >
                {teamOption.name}
                {teamOption.name === team && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Thema</strong>
            <small>Kies tussen een licht of donker thema.</small>
          </div>

          <select
            aria-label="Kies een thema"
            value={theme}
            onChange={(event) =>
              setTheme(event.target.value as "dark" | "light")
            }
          >
            <option value="dark">Donker</option>
            <option value="light">Licht</option>
          </select>
        </div>
      </div>

      <div className="data-settings">
        <h2>Gegevens</h2>
        <p>Maak een back-up van je spelers, wedstrijden en teams.</p>

        <button type="button" onClick={exportData}>
          Gegevens exporteren
        </button>
      </div>

      <div className="faq-section">
        <h2>❓ Veelgestelde vragen</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openQuestion === index;
            const answerId = `faq-answer-${index}`;

            return (
              <div className="faq-item" key={faq.question}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    setOpenQuestion(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="faq-answer" id={answerId}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
