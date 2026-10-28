
import { useState } from "react";
import { translations, type Language } from "./translations.ts";

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
  const t = translations[language];

  return [
    {
      title: t.faqTeamsTitle,
      questions: [
        { question: t.faqTeamSelectionQuestion, answer: t.faqTeamSelectionAnswer },
        { question: t.faqAddPlayerQuestion, answer: t.faqAddPlayerAnswer, adminOnly: true },
        { question: t.faqEditPlayerQuestion, answer: t.faqEditPlayerAnswer, adminOnly: true },
        { question: t.faqDeletePlayerQuestion, answer: t.faqDeletePlayerAnswer, adminOnly: true },
        { question: t.faqAddTeamQuestion, answer: t.faqAddTeamAnswer, adminOnly: true },
        { question: t.faqDeleteTeamQuestion, answer: t.faqDeleteTeamAnswer, adminOnly: true },
        { question: t.faqTypeTeamNameQuestion, answer: t.faqTypeTeamNameAnswer, adminOnly: true },
      ],
    },
    {
      title: t.faqMatchesTitle,
      questions: [
        { question: t.faqAddMatchQuestion, answer: t.faqAddMatchAnswer, adminOnly: true },
        { question: t.faqEditMatchQuestion, answer: t.faqEditMatchAnswer, adminOnly: true },
        { question: t.faqDeleteMatchQuestion, answer: t.faqDeleteMatchAnswer, adminOnly: true },
        { question: t.faqMatchScoreQuestion, answer: t.faqMatchScoreAnswer },
        { question: t.faqNoMatchQuestion, answer: t.faqNoMatchAnswer },
      ],
    },
    {
      title: t.faqStatsTitle,
      questions: [
        { question: t.faqStatsQuestion, answer: t.faqStatsAnswer },
        { question: t.faqPlayerStatsQuestion, answer: t.faqPlayerStatsAnswer },
        { question: t.faqGoalsAssistsQuestion, answer: t.faqGoalsAssistsAnswer },
        { question: t.faqNoStatsQuestion, answer: t.faqNoStatsAnswer },
        { question: t.faqFindPlayerQuestion, answer: t.faqFindPlayerAnswer },
      ],
    },
    {
      title: t.faqAccountTitle,
      questions: [
        { question: t.faqAdminQuestion, answer: t.faqAdminAnswer, adminOnly: true },
        { question: t.faqPermissionsQuestion, answer: t.faqPermissionsAnswer, adminOnly: true },
        { question: t.faqLogoutQuestion, answer: t.faqLogoutAnswer },
        { question: t.faqMissingAdminOptionsQuestion, answer: t.faqMissingAdminOptionsAnswer, adminOnly: true },
        { question: t.faqDemoSecurityQuestion, answer: t.faqDemoSecurityAnswer },
        { question: t.faqRolesQuestion, answer: t.faqRolesAnswer },
      ],
    },
    {
      title: t.faqDataTitle,
      questions: [
        { question: t.faqStorageQuestion, answer: t.faqStorageAnswer },
        { question: t.faqBackupQuestion, answer: t.faqBackupAnswer, adminOnly: true },
        { question: t.faqDataMissingQuestion, answer: t.faqDataMissingAnswer },
        { question: t.faqDataOnlineQuestion, answer: t.faqDataOnlineAnswer },
        { question: t.faqLocalDataQuestion, answer: t.faqLocalDataAnswer },
        { question: t.faqExportQuestion, answer: t.faqExportAnswer, adminOnly: true },
        { question: t.faqLanguageQuestion, answer: t.faqLanguageAnswer },
      ],
    },
    {
      title: t.faqTroubleshootingTitle,
      questions: [
        { question: t.faqSearchNoResultsQuestion, answer: t.faqSearchNoResultsAnswer },
        { question: t.faqButtonIssueQuestion, answer: t.faqButtonIssueAnswer },
        { question: t.faqMobileQuestion, answer: t.faqMobileAnswer },
        { question: t.faqThemeQuestion, answer: t.faqThemeAnswer },
        { question: t.faqMoreHelpQuestion, answer: t.faqMoreHelpAnswer },
        { question: t.faqRefreshQuestion, answer: t.faqRefreshAnswer },
      ],
    },
  ];
}

export default function HelpPage({ isAdmin, language }: HelpPageProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const t = translations[language];
  const faqCategories = getFaqCategories(language);

  const search = searchTerm.toLocaleLowerCase(
    language === "nl" ? "nl" : "en",
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
        <h1>❓ {t.helpTitle}</h1>
        <p>{t.helpDescription}</p>
      </header>

      <section className="faq-section" aria-labelledby="faq-title">
        <h2 id="faq-title">{t.faqPageHeading}</h2>

        <label htmlFor="faq-search">{t.faqSearchLabel}</label>
        <input
          id="faq-search"
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setOpenCategory(null);
            setOpenQuestion(null);
          }}
          placeholder={t.faqSearchPlaceholder}
        />

        <div className="faq-list">
          {filteredCategories.length === 0 && (
            <p role="status">
              {t.noQuestionsFound}. {t.noQuestionsDescription}
            </p>
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
