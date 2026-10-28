
import { useMemo, useState } from "react";
import type { Language } from "./translations";

type FAQ = {
  question: string;
  answer: string;
  adminOnly?: boolean;
};

type FAQCategory = {
  title: string;
  questions: FAQ[];
};

type HelpPageProps = {
  isAdmin: boolean;
  language: Language;
};

function getFaqCategories(language: Language): FAQCategory[] {
  const nl = language === "nl";

  return [
    {
      title: nl ? "Teams en spelers" : "Teams and players",
      questions: [
        {
          question: nl ? "Hoe voeg ik een speler toe?" : "How do I add a player?",
          answer: nl
            ? "Ga naar de Adminpagina, kies een team en open Spelers beheren. Daar kun je een speler toevoegen."
            : "Open the Admin page, select a team and choose Manage players. You can add a player there.",
          adminOnly: true,
        },
        {
          question: nl ? "Hoe pas ik een speler aan?" : "How do I edit a player?",
          answer: nl
            ? "Ga naar Spelers beheren op de Adminpagina en kies de speler die je wilt aanpassen."
            : "Open Manage players on the Admin page and select the player you want to edit.",
          adminOnly: true,
        },
        {
          question: nl ? "Hoe verwijder ik een speler?" : "How do I delete a player?",
          answer: nl
            ? "Open Spelers beheren op de Adminpagina en gebruik de verwijderoptie bij de juiste speler. Controleer of je de juiste speler hebt geselecteerd."
            : "Open Manage players on the Admin page and use the delete option for the correct player. Make sure you selected the right player.",
          adminOnly: true,
        },
        {
          question: nl ? "Hoe voeg ik een team toe?" : "How do I add a team?",
          answer: nl
            ? "Ga naar de Adminpagina en open Teams beheren. Daar kun je een team toevoegen."
            : "Open the Admin page and choose Manage teams. You can add a team there.",
          adminOnly: true,
        },
        {
          question: nl ? "Kan ik een team verwijderen?" : "Can I delete a team?",
          answer: nl
            ? "Ga naar Teams beheren op de Adminpagina. Een team kan niet worden verwijderd zolang er spelers of wedstrijden aan gekoppeld zijn."
            : "Open Manage teams on the Admin page. A team cannot be deleted while players or matches are linked to it.",
          adminOnly: true,
        },
        {
          question: nl ? "Kan ik zelf een teamnaam typen?" : "Can I enter a team name?",
          answer: nl
            ? "Je kunt een team toevoegen via Teams beheren. Bij het toevoegen van spelers en wedstrijden kun je een beschikbaar team selecteren."
            : "You can add a team through Manage teams. When adding players or matches, you can select an available team.",
          adminOnly: true,
        },
      ],
    },
    {
      title: nl ? "Wedstrijden en resultaten" : "Matches and results",
      questions: [
        {
          question: nl ? "Hoe voeg ik een wedstrijd toe?" : "How do I add a match?",
          answer: nl
            ? "Ga naar de Adminpagina, kies een team en open Wedstrijden beheren. Gebruik de knop om een wedstrijd toe te voegen."
            : "Open the Admin page, select a team and choose Manage matches. Use the button to add a match.",
          adminOnly: true,
        },
        {
          question: nl ? "Hoe pas ik een wedstrijd aan?" : "How do I edit a match?",
          answer: nl
            ? "Open Wedstrijden beheren op de Adminpagina en kies de wedstrijd die je wilt aanpassen."
            : "Open Manage matches on the Admin page and select the match you want to edit.",
          adminOnly: true,
        },
        {
          question: nl ? "Kan ik een wedstrijd verwijderen?" : "Can I delete a match?",
          answer: nl
            ? "Ja. Ga naar Wedstrijden beheren op de Adminpagina en gebruik de verwijderoptie bij de juiste wedstrijd. Je krijgt een bevestiging voordat de wedstrijd wordt verwijderd."
            : "Yes. Open Manage matches on the Admin page and use the delete option for the match. You will be asked to confirm before it is deleted.",
          adminOnly: true,
        },
        {
          question: nl ? "Wat betekent de uitslag van een wedstrijd?" : "What does a match score mean?",
          answer: nl
            ? "De uitslag toont het aantal doelpunten van het thuisteam en het uitteam. Het team met de meeste doelpunten wint; bij een gelijke stand eindigt de wedstrijd in een gelijkspel."
            : "The score shows the goals scored by the home and away teams. The team with the most goals wins; equal scores mean a draw.",
        },
        {
          question: nl ? "Waarom zie ik een wedstrijd niet?" : "Why can't I see a match?",
          answer: nl
            ? "Controleer of de wedstrijd is toegevoegd en of eventuele zoektermen of filters de wedstrijd verbergen."
            : "Check whether the match has been added and whether search terms or filters are hiding it.",
        },
      ],
    },
    {
      title: nl ? "Statistieken en dashboard" : "Statistics and dashboard",
      questions: [
        {
          question: nl ? "Wat kan ik op het dashboard zien?" : "What can I see on the dashboard?",
          answer: nl
            ? "Het dashboard geeft een overzicht van beschikbare wedstrijden en voetbalstatistieken in de applicatie."
            : "The dashboard provides an overview of available matches and football statistics in the application.",
        },
        {
          question: nl ? "Welke statistieken kan ik van spelers bekijken?" : "Which player statistics can I view?",
          answer: nl
            ? "Afhankelijk van de beschikbare gegevens kun je onder andere doelpunten, assists, gespeelde wedstrijden en beoordelingen bekijken."
            : "Depending on the available data, you can view goals, assists, appearances and ratings, among other statistics.",
        },
        {
          question: nl ? "Wat betekenen doelpunten en assists?" : "What do goals and assists mean?",
          answer: nl
            ? "Doelpunten zijn goals die een speler heeft gemaakt. Een assist is een beslissende pass die voorafgaat aan een doelpunt."
            : "Goals are scored by a player. An assist is a pass that directly contributes to a goal.",
        },
        {
          question: nl ? "Waarom ontbreken bepaalde statistieken?" : "Why are some statistics missing?",
          answer: nl
            ? "Niet alle statistieken zijn altijd ingevuld. Ontbrekende informatie kan worden aangevuld door een gebruiker met de juiste beheerrechten."
            : "Not all statistics may have been entered. Missing information can be added by a user with the appropriate management permissions.",
        },
        {
          question: nl ? "Hoe vind ik een bepaalde speler?" : "How do I find a player?",
          answer: nl
            ? "Ga naar de spelerspagina en gebruik het zoekveld om een speler op naam of positie te zoeken."
            : "Open the Players page and use the search field to find a player by name or position.",
        },
      ],
    },
    {
      title: nl ? "Account en beheerdersrechten" : "Account and administrator permissions",
      questions: [
        {
          question: nl ? "Wat kan ik op de Adminpagina doen?" : "What can I do on the Admin page?",
          answer: nl
            ? "De Adminpagina bevat beheerfuncties voor onderdelen waarvoor jouw gebruikersrol rechten heeft, zoals het beheren van teams, spelers en wedstrijden."
            : "The Admin page contains management features allowed by your user role, such as managing teams, players and matches.",
          adminOnly: true,
        },
        {
          question: nl ? "Waarom kan ik de Adminpagina niet openen?" : "Why can't I open the Admin page?",
          answer: nl
            ? "De Adminpagina is bedoeld voor gebruikers met de juiste rechten. Controleer of je met de juiste gebruiker bent ingelogd."
            : "The Admin page is restricted to users with the appropriate permissions. Check that you are logged in with the correct user.",
          adminOnly: true,
        },
        {
          question: nl ? "Hoe log ik uit?" : "How do I log out?",
          answer: nl
            ? "Open het profielmenu en gebruik de uitlogoptie."
            : "Open the profile menu and select the logout option.",
        },
        {
          question: nl ? "Waarom zie ik bepaalde beheeropties niet?" : "Why are some management options missing?",
          answer: nl
            ? "Welke opties zichtbaar zijn, hangt af van de rechten die aan de gebruiker zijn toegekend."
            : "The available options depend on the permissions assigned to the user.",
          adminOnly: true,
        },
        {
          question: nl ? "Is de demo-login een beveiligd accountsysteem?" : "Is the demo login a secure account system?",
          answer: nl
            ? "De demo-login is bedoeld om gebruikers en rechten tijdens de demonstratie te simuleren. Het is geen vervanging voor een volledig beveiligd accountsysteem."
            : "The demo login simulates users and permissions for demonstration purposes. It is not a replacement for a fully secure account system.",
        },
      ],
    },
    {
      title: nl ? "Gegevens en back-ups" : "Data and backups",
      questions: [
        {
          question: nl ? "Waar worden mijn gegevens opgeslagen?" : "Where is my data stored?",
          answer: nl
            ? "De applicatie gebruikt lokale browseropslag voor gegevens die lokaal worden bewaard. Daardoor kunnen gegevens aan je browserprofiel gekoppeld zijn."
            : "The application uses local browser storage for data kept locally. This means the data may be tied to your browser profile.",
        },
        {
          question: nl ? "Hoe download ik een back-up?" : "How do I download a backup?",
          answer: nl
            ? "Open de Adminpagina en zoek Gegevens exporteren. Gebruik Back-up downloaden om het JSON-bestand op te slaan."
            : "Open the Admin page and find Export data. Select Download backup to save the JSON file.",
          adminOnly: true,
        },
        {
          question: nl ? "Waarom zijn mijn gegevens verdwenen?" : "Why has my data disappeared?",
          answer: nl
            ? "Controleer of je dezelfde browser en hetzelfde browserprofiel gebruikt. Gewiste browsergegevens of een andere browser kunnen ervoor zorgen dat lokaal opgeslagen gegevens niet beschikbaar zijn."
            : "Check that you are using the same browser and browser profile. Cleared browser data or a different browser may mean locally stored data is no longer available.",
        },
        {
          question: nl ? "Worden mijn gegevens automatisch online opgeslagen?" : "Is my data automatically saved online?",
          answer: nl
            ? "Ga er niet van uit dat gegevens automatisch online worden opgeslagen. De applicatie gebruikt lokale opslag voor gegevens die lokaal worden bewaard."
            : "Do not assume that data is automatically saved online. The application uses local storage for data kept locally.",
        },
      ],
    },
    {
      title: nl ? "Problemen oplossen" : "Troubleshooting",
      questions: [
        {
          question: nl ? "Waarom vindt de zoekfunctie geen resultaat?" : "Why does search return no results?",
          answer: nl
            ? "Controleer de spelling en probeer een kortere zoekterm. Als er geen overeenkomst is, verschijnt er een melding dat er geen vragen zijn gevonden."
            : "Check the spelling and try a shorter search term. If nothing matches, a message will tell you that no questions were found.",
        },
        {
          question: nl ? "Wat kan ik doen als een knop niet werkt?" : "What should I do if a button doesn't work?",
          answer: nl
            ? "Ververs de pagina en probeer het opnieuw. Blijft het probleem bestaan, controleer dan of er een foutmelding verschijnt."
            : "Refresh the page and try again. If the problem persists, check whether an error message appears.",
        },
        {
          question: nl ? "Kan ik de Voetbaltracker op mijn telefoon gebruiken?" : "Can I use the Football Tracker on my phone?",
          answer: nl
            ? "De pagina's zijn ontworpen om op verschillende schermformaten te werken. De weergave kan afhankelijk zijn van de schermgrootte."
            : "The pages are designed to work across different screen sizes. The layout may vary depending on your screen size.",
        },
        {
          question: nl ? "Hoe verander ik de lichte of donkere modus?" : "How do I switch between light and dark mode?",
          answer: nl
            ? "Open het profiel- of instellingenmenu en gebruik de themaoptie om de weergave te veranderen."
            : "Open the profile or settings menu and use the theme option to change the appearance.",
        },
        {
          question: nl ? "Waar kan ik terecht als mijn vraag niet wordt beantwoord?" : "What if my question isn't answered here?",
          answer: nl
            ? "Controleer eerst de relevante categorie en probeer andere zoekwoorden. Je kunt ook de beheerder om hulp vragen."
            : "Check the relevant category and try different search terms. You can also ask the administrator for help.",
        },
      ],
    },
  ];
}

export default function HelpPage({ isAdmin, language }: HelpPageProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isDutch = language === "nl";

  const text = {
    title: isDutch ? "Hulp & veelgestelde vragen" : "Help & frequently asked questions",
    description: isDutch
      ? "Antwoorden op veelgestelde vragen over het gebruik van de Voetbaltracker."
      : "Answers to frequently asked questions about using the Football Tracker.",
    faqTitle: isDutch ? "Veelgestelde vragen" : "Frequently asked questions",
    searchLabel: isDutch ? "Zoek een vraag" : "Search questions",
    searchPlaceholder: isDutch
      ? "Bijv. speler, team of wedstrijd..."
      : "E.g. player, team or match...",
    noResults: isDutch
      ? "Geen vragen gevonden. Probeer een andere zoekterm."
      : "No questions found. Try another search term.",
  };

  const faqCategories = useMemo(
    () => getFaqCategories(language),
    [language],
  );

  const search = searchTerm.toLocaleLowerCase(
    isDutch ? "nl" : "en",
  ).trim();

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((faq) => {
        if (faq.adminOnly && !isAdmin) {
          return false;
        }

        return (
          faq.question.toLocaleLowerCase().includes(search) ||
          faq.answer.toLocaleLowerCase().includes(search)
        );
      }),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <main className="help-page">
      <header className="help-page-header">
        <h1>❓ {text.title}</h1>
        <p>{text.description}</p>
      </header>

      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title">{text.faqTitle}</h2>

        <label htmlFor="faq-search">{text.searchLabel}</label>
        <input
          id="faq-search"
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setOpenCategory(null);
            setOpenQuestion(null);
          }}
          placeholder={text.searchPlaceholder}
        />

        <div className="faq-list">
          {filteredCategories.length === 0 && (
            <p role="status">{text.noResults}</p>
          )}

          {filteredCategories.map((category) => {
            const isCategoryOpen =
              searchTerm.trim() !== "" || openCategory === category.title;

            const categoryId = `category-${category.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`;

            return (
              <div className="faq-item" key={category.title}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isCategoryOpen}
                  aria-controls={categoryId}
                  onClick={() =>
                    setOpenCategory(
                      isCategoryOpen ? null : category.title,
                    )
                  }
                >
                  <span>{category.title}</span>
                  <span className="faq-toggle-icon" aria-hidden="true">
                    {isCategoryOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className="faq-category-content"
                  id={categoryId}
                  hidden={!isCategoryOpen}
                >
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
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
