import { useMemo, useState } from "react";
import { translations, type Language } from "./translations";
import type { Player, Team } from "./types";

type PlayersRankingPageProps = {
  playerList: Player[];
  teams: Team[];
  language: Language;
};

type RankingCategory = "general" | "attack" | "defense" | "keepers";
type RankingTranslationKey = keyof typeof translations.nl;

const categories: {
  id: RankingCategory;
  labelKey: RankingTranslationKey;
}[] = [
  { id: "general", labelKey: "rankingCategoryGeneral" },
  { id: "attack", labelKey: "playerAttackingSection" },
  { id: "defense", labelKey: "playerDefendingSection" },
  { id: "keepers", labelKey: "playerGoalkeeperSection" },
];

const rankingOptions: Record<
  RankingCategory,
  {
    key: keyof Player;
    labelKey: RankingTranslationKey;
    suffixKey?: RankingTranslationKey;
  }[]
> = {
  general: [
    { key: "rating", labelKey: "averageRating" },
    { key: "matches", labelKey: "matchesStat" },
    {
      key: "minutesplayed",
      labelKey: "minutesStat",
      suffixKey: "rankingMinutesSuffix",
    },
  ],
  attack: [
    { key: "goals", labelKey: "goalsStat" },
    { key: "assists", labelKey: "assistsStat" },
  ],
  defense: [
    { key: "tackles", labelKey: "tacklesStat" },
    { key: "interceptions", labelKey: "interceptionsStat" },
    { key: "blocks", labelKey: "blocksStat" },
    { key: "clearances", labelKey: "clearancesStat" },
    { key: "duelsWon", labelKey: "duelsWonStat" },
  ],
  keepers: [
    { key: "saves", labelKey: "savesStat" },
    { key: "cleanSheets", labelKey: "cleanSheetsStat" },
    { key: "penaltySaves", labelKey: "penaltySavesStat" },
    { key: "goalsConceded", labelKey: "goalsConcededStat" },
  ],
};
function getRatingClass(rating: number) {
  if (rating >= 9) return "rating-excellent";
  if (rating >= 8) return "rating-very-good";
  if (rating >= 7) return "rating-good";
  if (rating >= 6) return "rating-average";
  return "rating-low";
}
export default function PlayersRankingPage({
  playerList,
  teams,
  language,
}: PlayersRankingPageProps) {
  const t = translations[language];
  const [category, setCategory] = useState<RankingCategory>("general");
  const [statistic, setStatistic] = useState<keyof Player>("rating");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [search, setSearch] = useState("");

  const availableOptions = rankingOptions[category];

  const activeStatistic = availableOptions.some(
    (option) => option.key === statistic,
  )
    ? statistic
    : availableOptions[0].key;

  const rankedPlayers = useMemo(() => {
    return playerList
      .filter((player) => {
        const fullName = `${player.firstname} ${player.lastname}`;

        const matchesSearch = fullName
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesTeam =
          selectedTeam === "all" || player.team === selectedTeam;

        const matchesPosition =
          selectedPosition === "all" || player.position === selectedPosition;

        return matchesSearch && matchesTeam && matchesPosition;
      })
      .filter((player) => {
        const value = player[activeStatistic];
        return typeof value === "number";
      })
      .sort((a, b) => {
        const aValue = Number(a[activeStatistic] ?? 0);
        const bValue = Number(b[activeStatistic] ?? 0);

        if (activeStatistic === "goalsConceded") {
          return aValue - bValue;
        }

        return bValue - aValue;
      });
  }, [playerList, activeStatistic, selectedTeam, selectedPosition, search]);

  return (
    <main className="players-ranking-page">
      <header className="players-ranking-header">
        <h1>{t.playersRankingTitle}</h1>
        <p>{t.playersRankingDescription}</p>
      </header>

      <div className="ranking-categories" role="tablist">
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={category === item.id}
            className={category === item.id ? "active" : ""}
            onClick={() => {
              setCategory(item.id);
              setStatistic(rankingOptions[item.id][0].key);
            }}
          >
            {t[item.labelKey]}
          </button>
        ))}
      </div>

      <section className="ranking-filters">
        <label>
          {t.rankingStatisticLabel}
          <select
            value={activeStatistic}
            onChange={(event) =>
              setStatistic(event.target.value as keyof Player)
            }
          >
            {availableOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {t[option.labelKey]}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.rankingClubLabel}
          <select
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
          >
            <option value="all">{t.allTeams}</option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.positionLabel}
          <select
            value={selectedPosition}
            onChange={(event) => setSelectedPosition(event.target.value)}
          >
            <option value="all">{t.allPositions}</option>
            <option value="Keeper">{t.goalkeeperPosition}</option>
            <option value="Verdediger">{t.defenderPosition}</option>
            <option value="Middenvelder">{t.midfielderPosition}</option>
            <option value="Aanvaller">{t.forwardPosition}</option>
          </select>
        </label>

        <label>
          {t.searchPlayerLabel}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.searchPlayerPlaceholderPage}
          />
        </label>
      </section>

      <section className="ranking-table-section">
        <h2>
          {availableOptions.find((option) => option.key === activeStatistic) &&
            t[
              availableOptions.find((option) => option.key === activeStatistic)!
                .labelKey
            ]}
        </h2>

        <div className="ranking-table-wrapper">
          <table className="ranking-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t.player}</th>
                <th scope="col">{t.rankingClubLabel}</th>
                <th scope="col">{t.positionLabel}</th>
                <th scope="col">{t.rankingStatisticColumn}</th>
              </tr>
            </thead>

            <tbody>
              {rankedPlayers.length > 0 ? (
                rankedPlayers.map((player, index) => {
                  const option = availableOptions.find(
                    (item) => item.key === activeStatistic,
                  );

                  return (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>
                        {player.firstname} {player.lastname}
                      </td>
                      <td>{player.team}</td>
                      <td>{player.position}</td>
                      <td>
                        {activeStatistic === "rating" ? (
                          <span
                            className={getRatingClass(
                              Number(player[activeStatistic]),
                            )}
                          >
                            {player[activeStatistic]}
                          </span>
                        ) : (
                          <>
                            {player[activeStatistic]}
                            {option?.suffixKey ? t[option.suffixKey] : ""}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>{t.noPlayersFoundMessage}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
