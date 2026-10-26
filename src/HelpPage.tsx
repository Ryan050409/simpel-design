import { useState } from "react";

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

function HelpPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

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

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openQuestion === index;
            const answerId = `faq-answer-${index}`;

            return (
              <div className="faq-item" key={faq.question}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenQuestion(isOpen ? null : index)}
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
      </section>
    </main>
  );
}

export default HelpPage;
