import { useState } from "react";


const faqCategories = [
  {
    title: "Teams en spelers",
    questions: [
      {
        question: "Hoe voeg ik een speler toe?",
        answer:
          "Ga naar de Adminpagina, kies een team en open Spelers beheren. Daar kun je een speler toevoegen.",
      },
      {
        question: "Hoe pas ik een speler aan?",
        answer:
          "Ga naar Spelers beheren op de Adminpagina en kies de speler die je wilt aanpassen.",
      },
      {
        question: "Hoe verwijder ik een speler?",
        answer:
          "Open Spelers beheren op de Adminpagina en gebruik de verwijderoptie bij de juiste speler. Controleer altijd of je de juiste speler hebt geselecteerd.",
      },
      {
        question: "Hoe voeg ik een team toe?",
        answer:
          "Ga naar de Adminpagina en open Teams beheren. Daar kun je een team toevoegen.",
      },
      {
        question: "Kan ik een team verwijderen?",
        answer:
          "Ga naar Teams beheren op de Adminpagina en gebruik de verwijderoptie bij het juiste team. Controleer eerst of je het juiste team hebt geselecteerd.",
      },
      {
        question: "Kan ik zelf een teamnaam typen?",
        answer:
          "Je kunt teams beheren via Teams beheren op de Adminpagina. Bij het toevoegen van spelers en wedstrijden kun je een beschikbaar team selecteren.",
      },
    ],
  },
  {
    title: "Wedstrijden en resultaten",
    questions: [
      {
        question: "Hoe voeg ik een wedstrijd toe?",
        answer:
          "Ga naar de Adminpagina en open Wedstrijden beheren. Gebruik daar de beschikbare opties om een wedstrijd toe te voegen.",
      },
      {
        question: "Hoe pas ik een wedstrijd aan?",
        answer:
          "Open Wedstrijden beheren op de Adminpagina en kies de wedstrijd die je wilt aanpassen.",
      },
      {
        question: "Kan ik een wedstrijd verwijderen?",
        answer:
          "Ja. Ga naar Wedstrijden beheren op de Adminpagina en gebruik de verwijderoptie bij de juiste wedstrijd.",
      },
      {
        question: "Wat betekent de uitslag van een wedstrijd?",
        answer:
          "De uitslag toont het aantal doelpunten van het thuisteam en het uitteam. Het team met de meeste doelpunten wint; bij een gelijke stand eindigt de wedstrijd in een gelijkspel.",
      },
      {
        question: "Waarom zie ik een wedstrijd niet?",
        answer:
          "Controleer of de wedstrijd in de applicatie is toegevoegd en of eventuele filters de wedstrijd verbergen.",
      },
    ],
  },
  {
    title: "Statistieken en dashboard",
    questions: [
      {
        question: "Wat kan ik op het dashboard zien?",
        answer:
          "Het dashboard geeft een overzicht van beschikbare wedstrijden en voetbalstatistieken in de applicatie.",
      },
      {
        question: "Welke statistieken kan ik van spelers bekijken?",
        answer:
          "Afhankelijk van de beschikbare gegevens kun je onder andere doelpunten, assists, gespeelde wedstrijden en beoordelingen bekijken.",
      },
      {
        question: "Wat betekenen doelpunten en assists?",
        answer:
          "Doelpunten zijn goals die een speler heeft gemaakt. Een assist is een beslissende pass die voorafgaat aan een doelpunt.",
      },
      {
        question: "Waarom ontbreken bepaalde statistieken?",
        answer:
          "Niet alle statistieken zijn altijd ingevuld. Controleer de gegevens van de speler en vul ontbrekende informatie aan als je daarvoor rechten hebt.",
      },
      {
        question: "Hoe vind ik een bepaalde speler?",
        answer:
          "Ga naar de spelerspagina en gebruik het zoekveld om een speler op naam te zoeken, als deze functie beschikbaar is op die pagina.",
      },
    ],
  },
  {
    title: "Account en beheerdersrechten",
    questions: [
      {
        question: "Wat kan ik op de Adminpagina doen?",
        answer:
          "De Adminpagina bevat beheerfuncties voor de onderdelen die jouw gebruikersrechten toestaan, zoals het beheren van teams, spelers en wedstrijden.",
      },
      {
        question: "Waarom kan ik de Adminpagina niet openen?",
        answer:
          "De Adminpagina is bedoeld voor gebruikers met de juiste rechten. Controleer of je met de juiste demo-gebruiker bent ingelogd.",
      },
      {
        question: "Hoe log ik uit?",
        answer:
          "Open het profielmenu en gebruik de uitlogoptie als die voor jouw gebruiker beschikbaar is.",
      },
      {
        question: "Waarom zie ik bepaalde beheeropties niet?",
        answer:
          "Welke opties zichtbaar zijn, kan afhangen van de rechten die aan de gebruiker zijn toegekend.",
      },
      {
        question: "Is de demo-login een beveiligd accountsysteem?",
        answer:
          "De huidige demo-login is bedoeld om gebruikers en rechten tijdens de demonstratie te simuleren. Gebruik deze niet als vervanging voor een beveiligd accountsysteem.",
      },
    ],
  },
  {
    title: "Gegevens en back-ups",
    questions: [
      {
        question: "Waar worden mijn gegevens opgeslagen?",
        answer:
          "De applicatie gebruikt lokale browseropslag voor gegevens die lokaal worden bewaard. De precieze opslag kan per onderdeel verschillen.",
      },
      {
        question: "Hoe download ik een back-up?",
        answer:
          "Open de Adminpagina en zoek de sectie Gegevens exporteren. Gebruik Back-up downloaden om het JSON-bestand op te slaan, als deze optie beschikbaar is.",
      },
      {
        question: "Waarom zijn mijn gegevens verdwenen?",
        answer:
          "Controleer of je dezelfde browser en hetzelfde browserprofiel gebruikt. Gewiste browsergegevens of een andere browser kunnen ervoor zorgen dat lokaal opgeslagen gegevens niet beschikbaar zijn.",
      },
      {
        question: "Worden mijn gegevens automatisch online opgeslagen?",
        answer:
          "Ga er niet van uit dat gegevens automatisch online worden opgeslagen. De huidige applicatie gebruikt lokale opslag voor gegevens die lokaal worden bewaard.",
      },
    ],
  },
  {
    title: "Problemen oplossen",
    questions: [
      {
        question: "Waarom vindt de zoekfunctie geen resultaat?",
        answer:
          "Controleer de spelling en probeer een kortere zoekterm. Als er geen overeenkomst is, verschijnt er een melding dat er geen vragen zijn gevonden.",
      },
      {
        question: "Wat kan ik doen als een knop niet werkt?",
        answer:
          "Ververs de pagina en probeer het opnieuw. Blijft het probleem bestaan, controleer dan of er een foutmelding verschijnt.",
      },
      {
        question: "Kan ik de Voetbaltracker op mijn telefoon gebruiken?",
        answer:
          "De pagina's zijn bedoeld om bruikbaar te zijn op verschillende schermformaten. De precieze weergave hangt af van de huidige mobiele vormgeving.",
      },
      {
        question: "Hoe verander ik de lichte of donkere modus?",
        answer:
          "Open het profiel- of instellingenmenu en gebruik de themaoptie als die beschikbaar is.",
      },
      {
        question: "Waar kan ik terecht als mijn vraag niet wordt beantwoord?",
        answer:
          "Controleer eerst de relevante categorie en probeer andere zoekwoorden. Je kunt ook de beheerder vragen om hulp bij problemen met de applicatie.",
      },
    ],
  },
];


function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((faq) => {
        const search = searchTerm.toLowerCase().trim();

        return (
          faq.question.toLowerCase().includes(search) ||
          faq.answer.toLowerCase().includes(search)
        );
      }),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <main className="help-page">
      <header className="help-page-header">
        <h1>❓ Hulp & veelgestelde vragen</h1>
        <p>
          Antwoorden op veelgestelde vragen over het gebruik van de
          Voetbaltracker.
        </p>
      </header>

      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title">Veelgestelde vragen</h2>
        <label htmlFor="faq-search">Zoek een vraag</label>
        <input
          id="faq-search"
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setOpenQuestion(null);
          }}
          placeholder="Bijv. speler, team of wedstrijd..."
        />

        <div className="faq-list">
          {filteredCategories.length === 0 && (
            <p role="status">
              Geen vragen gevonden. Probeer een andere zoekterm.
            </p>
          )}

          {filteredCategories.map((category) => {
            const isCategoryOpen =
              searchTerm.trim() !== "" || openCategory === category.title;

            return (
              <div className="faq-item" key={category.title}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => {
                    setOpenCategory(
                      openCategory === category.title ? null : category.title,
                    );
                    setOpenQuestion(null);
                  }}
                  aria-expanded={isCategoryOpen}
                >
                  <span>{category.title}</span>
                  <span aria-hidden="true">{isCategoryOpen ? "−" : "+"}</span>
                </button>

                {isCategoryOpen && (
                  <div className="faq-category-content">
                    {category.questions.map((faq) => {
                      const questionId = `${category.title}-${faq.question}`;
                      const isQuestionOpen = openQuestion === questionId;
                      const answerId = `answer-${questionId
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")}`;

                      return (
                        <div className="faq-item" key={faq.question}>
                          <button
                            type="button"
                            className="faq-question"
                            onClick={() =>
                              setOpenQuestion(
                                isQuestionOpen ? null : questionId,
                              )
                            }
                            aria-expanded={isQuestionOpen}
                            aria-controls={answerId}
                          >
                            <span>{faq.question}</span>
                            <span aria-hidden="true">
                              {isQuestionOpen ? "−" : "+"}
                            </span>
                          </button>

                          <div
                            className="faq-answer"
                            id={answerId}
                            hidden={!isQuestionOpen}
                          >
                            {faq.answer}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default HelpPage;
