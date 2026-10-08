import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Match, Team } from "./types.ts";

export type SettingsPageProps = {
  setMatches: Dispatch<SetStateAction<Match[]>>;
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
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
  setTeams,
  team,
  setTeam,
  theme,
  setTheme
}: SettingsPageProps) {
  const [newTeam, setNewTeam] = useState("");
  const [teamWarning, setTeamWarning] = useState("");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: "Hoe voeg ik een speler toe?",
      answer:
        "Ga naar Spelers en klik op '+ Speler toevoegen'. Vul de gegevens in en sla de speler op.",
    },
    {
      question: "Hoe voeg ik een team toe?",
      answer:
        "Ga naar Instellingen en gebruik het onderdeel Teams. Vul de naam van het team in en klik op '+ Team toevoegen'.",
    },
    {
      question: "Waar worden mijn gegevens opgeslagen?",
      answer:
        "Je gegevens worden lokaal in je browser opgeslagen. Daardoor blijven je spelers, wedstrijden en teams bewaard wanneer je de pagina opnieuw opent.",
    },
    {
      question: "Kan ik een speler aanpassen?",
      answer:
        "Ja. Ga naar Spelers en klik bij de gewenste speler op 'Bewerken'.",
    },
    {
      question: "Kan ik een wedstrijd verwijderen?",
      answer:
        "Ja. Ga naar Wedstrijden en klik bij de gewenste wedstrijd op 'Verwijderen'.",
    },
    {
      question: "Kan ik zelf een teamnaam typen?",
      answer:
        "Ja. Bij het toevoegen van spelers en wedstrijden kun je een bestaand team kiezen of zelf een teamnaam invoeren.",
    },
  ];

  function addTeam() {
    const teamName = newTeam.trim();

    if (teamName === "") {
      setTeamWarning("Vul een teamnaam in.");
      return;
    }

    const teamExists = teams.some(
      (team) => team.name.toLowerCase() === teamName.toLowerCase(),
    );

    if (teamExists) {
      setTeamWarning("Dit team bestaat al.");
      return;
    }

    setTeams((currentTeams) => [
      ...currentTeams,
      {
        id: Date.now(),
        name: teamName,
      },
    ]);

    setNewTeam("");
    setTeamWarning("");
  }

  function deleteTeam(id: number) {
    const teamToDelete = teams.find((team) => team.id === id);

    if (!teamToDelete) {
      return;
    }

    const teamIsUsedByPlayer = players.some(
      (player) => player.team === teamToDelete.name,
    );

    const teamIsUsedInMatch = matches.some(
      (match) =>
        match.home === teamToDelete.name || match.away === teamToDelete.name,
    );

    if (teamIsUsedByPlayer || teamIsUsedInMatch) {
      window.alert(
        `Je kunt ${teamToDelete.name} niet verwijderen omdat dit team nog wordt gebruikt bij spelers of wedstrijden.`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Weet je zeker dat je ${teamToDelete.name} wilt verwijderen?`,
    );

    if (!confirmed) {
      return;
    }

    const remainingTeams = teams.filter((team) => team.id !== id);

    setTeams(remainingTeams);

    if (teamToDelete.name === team) {
      if (remainingTeams.length > 0) {
        setTeam(remainingTeams[0].name);
      } else {
        setTeam("");
        window.alert(
          "Je hebt geen teams meer. Voeg eerst een nieuw team toe voordat je een favoriet team kunt kiezen.",
        );
      }
    }
  }
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
        <div className="setting-row">
          <div>
            <strong>Favoriete team</strong>

            <small>
              Kies het team waarvoor je de statistieken wilt bekijken.
            </small>
          </div>

          <select
            value={team}
            onChange={(event) => setTeam(event.target.value)}
          >
            {teams.map((teamOption) => (
              <option key={teamOption.id} value={teamOption.name}>
                {teamOption.name}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-row">
          <div>
            <strong>Teams</strong>

            <small>
              Voeg teams toe die je in je voetbaltracker wilt gebruiken.
            </small>
          </div>

          <div className="team-setting-form">
            <input
              type="text"
              placeholder="Nieuwe teamnaam"
              value={newTeam}
              onChange={(e) => {
                setNewTeam(e.target.value);
                setTeamWarning("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTeam();
                }
              }}
            />
            <button type="button" onClick={addTeam}>
              + Team toevoegen
            </button>

            {teamWarning && (
              <small className="team-warning">{teamWarning}</small>
            )}
          </div>
        </div>
        <div className="setting-row">
  <div>
    <strong>Thema</strong>

    <small>
      Kies tussen een licht of donker thema.
    </small>
  </div>

  <select
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

      <div className="teams-list">
        <h2>Teams</h2>

        {teams.map((team) => (
          <div className="team-item" key={team.id}>
            <span>{team.name}</span>

            <button type="button" onClick={() => deleteTeam(team.id)}>
              Verwijderen
            </button>
          </div>
        ))}
      </div>
      <div className="data-settings">
        <h2>Gegevens</h2>

        <p>Maak een back-up van je spelers, wedstrijden en teams.</p>

        <button type="button" onClick={exportData}>
          Gegevens exporteren
        </button>
      </div>
      <div className="faq-section">
        <h2>❓Veelgestelde vragen</h2>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={faq.question}>
              <button
                type="button"
                className="faq-question"
                onClick={() =>
                  setOpenQuestion(openQuestion === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <span>{openQuestion === index ? "−" : "+"}</span>
              </button>

              {openQuestion === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
