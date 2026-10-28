import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Team } from "./types.ts";
import { translations, type Language } from "./translations.ts";

type PlayerFormProps = {
  editingPlayer?: Player | null;
  setEditingPlayer?: Dispatch<SetStateAction<Player | null>>;
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
  closeModal: () => void;
  teams: Team[];
  language: Language;
};

function PlayerForm({
  editingPlayer,
  setEditingPlayer,
  setPlayerList,
  closeModal,
  teams,
  language,
}: PlayerFormProps) {
  const t = translations[language];
  const [formStep, setFormStep] = useState(1);

  const [newPlayerFirstName, setNewPlayerFirstName] = useState(
    editingPlayer?.firstname ?? "",
  );

  const [newPlayerLastName, setNewPlayerLastName] = useState(
    editingPlayer?.lastname ?? "",
  );

  const [newPlayerTeam, setNewPlayerTeam] = useState(editingPlayer?.team ?? "");

  const [newPlayerPosition, setNewPlayerPosition] = useState(
    editingPlayer?.position ?? "",
  );

  const [newPlayerNumber, setNewPlayerNumber] = useState(
    editingPlayer?.number?.toString() ?? "",
  );

  const [newPlayerGoals, setNewPlayerGoals] = useState(
    editingPlayer ? String(editingPlayer.goals) : "",
  );

  const [newPlayerAssists, setNewPlayerAssists] = useState(
    editingPlayer ? String(editingPlayer.assists) : "",
  );

  const [newPlayerMatches, setNewPlayerMatches] = useState(
    editingPlayer ? String(editingPlayer.matches) : "",
  );

  const [newPlayerMinutesPlayed, setNewPlayerMinutesPlayed] = useState(
    editingPlayer ? String(editingPlayer.minutesplayed) : "",
  );

  const [newPlayerTackle, setNewPlayerTackle] = useState(
    editingPlayer ? String(editingPlayer.tackles ?? "") : "",
  );

  const [newPlayerInterceptions, setNewPlayerInterceptions] = useState(
    editingPlayer ? String(editingPlayer.interceptions ?? "") : "",
  );

  const [newPlayerBlocks, setNewPlayerBlocks] = useState(
    editingPlayer ? String(editingPlayer.blocks ?? "") : "",
  );

  const [newPlayerClearances, setNewPlayerClearances] = useState(
    editingPlayer ? String(editingPlayer.clearances ?? "") : "",
  );

  const [newPlayerDuelsWon, setNewPlayerDuelsWon] = useState(
    editingPlayer ? String(editingPlayer.duelsWon ?? "") : "",
  );

  const [newPlayerFouls, setNewPlayerFouls] = useState(
    editingPlayer ? String(editingPlayer.fouls ?? "") : "",
  );

  const [newPlayerCleanSheets, setNewPlayerCleanSheets] = useState(
    editingPlayer ? String(editingPlayer.cleanSheets ?? "") : "",
  );

  const [newPlayerSaves, setNewPlayerSaves] = useState(
    editingPlayer ? String(editingPlayer.saves ?? "") : "",
  );

  const [newPlayerOneVsOneSaves, setNewPlayerOneVsOneSaves] = useState(
    editingPlayer ? String(editingPlayer.oneVSOneSaves ?? "") : "",
  );

  const [newPlayerPenaltySaves, setNewPlayerPenaltySaves] = useState(
    editingPlayer ? String(editingPlayer.penaltySaves ?? "") : "",
  );

  const [newPlayerGoalsConceded, setNewPlayerGoalsConceded] = useState(
    editingPlayer ? String(editingPlayer.goalsConceded ?? "") : "",
  );

  const [newPlayerRating, setNewPlayerRating] = useState(
    editingPlayer ? String(editingPlayer.rating) : "",
  );

  const [warning, setWarning] = useState("");

  function goToNextStep() {
    if (
      newPlayerFirstName.trim() === "" ||
      newPlayerLastName.trim() === "" ||
      newPlayerNumber.trim() === "" ||
      newPlayerPosition.trim() === ""
    ) {
      setWarning(t.playerRequiredBasicFields);
      return;
    }

    setWarning("");
    setFormStep(2);
  }

  function savePlayer() {
    if (
      newPlayerFirstName.trim() === "" ||
      newPlayerLastName.trim() === "" ||
      newPlayerTeam.trim() === "" ||
      newPlayerPosition.trim() === "" ||
      newPlayerNumber.trim() === "" ||
      newPlayerMatches.trim() === "" ||
      newPlayerMinutesPlayed.trim() === "" ||
      newPlayerRating.trim() === ""
    ) {
      setWarning(t.playerRequiredFields);
      return;
    }

    const numericValues = [
      newPlayerNumber,
      newPlayerGoals,
      newPlayerAssists,
      newPlayerMatches,
      newPlayerMinutesPlayed,
      newPlayerTackle,
      newPlayerInterceptions,
      newPlayerBlocks,
      newPlayerClearances,
      newPlayerDuelsWon,
      newPlayerFouls,
      newPlayerCleanSheets,
      newPlayerSaves,
      newPlayerOneVsOneSaves,
      newPlayerPenaltySaves,
      newPlayerGoalsConceded,
      newPlayerRating,
    ];

    if (numericValues.some((value) => Number(value) < 0)) {
      setWarning(t.playerNegativeNumbers);
      return;
    }

    if (Number(newPlayerRating) > 10) {
      setWarning(t.playerRatingMax);
      return;
    }

    const newPlayer: Player = {
      id: editingPlayer ? editingPlayer.id : Date.now(),

      firstname: newPlayerFirstName.trim(),
      lastname: newPlayerLastName.trim(),
      team: newPlayerTeam.trim(),
      position: newPlayerPosition.trim(),
      number: Number(newPlayerNumber),

      goals: Number(newPlayerGoals),
      assists: Number(newPlayerAssists),
      matches: Number(newPlayerMatches),
      minutesplayed: Number(newPlayerMinutesPlayed),

      tackles: Number(newPlayerTackle),
      interceptions: Number(newPlayerInterceptions),
      blocks: Number(newPlayerBlocks),
      clearances: Number(newPlayerClearances),
      duelsWon: Number(newPlayerDuelsWon),
      fouls: Number(newPlayerFouls),

      cleanSheets: Number(newPlayerCleanSheets),
      saves: Number(newPlayerSaves),
      oneVSOneSaves: Number(newPlayerOneVsOneSaves),
      penaltySaves: Number(newPlayerPenaltySaves),
      goalsConceded: Number(newPlayerGoalsConceded),

      rating: Number(newPlayerRating),
    };

    if (editingPlayer) {
      setPlayerList((currentPlayers) =>
        currentPlayers.map((player) =>
          player.id === editingPlayer.id ? newPlayer : player,
        ),
      );
    } else {
      setPlayerList((currentPlayers) => [...currentPlayers, newPlayer]);
    }

    setEditingPlayer?.(null);
    closeModal();
  }

  function goBack() {
    setWarning("");
    setFormStep(1);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close"
          type="button"
          aria-label={t.closeDialog}
          onClick={closeModal}
        >
          ×
        </button>

        <h2 className="h2-player">
          {editingPlayer ? t.playerFormEditTitle : t.playerFormAddTitle}
        </h2>

        {warning && <p className="warning">{warning}</p>}

        {formStep === 1 && (
          <>
            <div className="form-grid">
              <h3 className="form-section-title">{t.playerFormGeneralSection}</h3>

              <div className="form-field">
                <label htmlFor="player-firstname">{t.playerFirstName}</label>
                <input
                  id="player-firstname"
                  type="text"
                  placeholder={t.playerFirstNamePlaceholder}
                  value={newPlayerFirstName}
                  onChange={(e) => setNewPlayerFirstName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-lastname">{t.playerLastName}</label>
                <input
                  id="player-lastname"
                  type="text"
                  placeholder={t.playerLastNamePlaceholder}
                  value={newPlayerLastName}
                  onChange={(e) => setNewPlayerLastName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-number">{t.playerNumber}</label>
                <input
                  id="player-number"
                  type="number"
                  min="0"
                  placeholder={t.playerNumberPlaceholder}
                  value={newPlayerNumber}
                  onChange={(e) => setNewPlayerNumber(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-position">{t.playerPosition}</label>
                <select
                  id="player-position"
                  value={newPlayerPosition}
                  onChange={(e) => setNewPlayerPosition(e.target.value)}
                >
                  <option value="">{t.playerChoosePosition}</option>
                  <option value="Keeper">{t.goalkeeperPosition}</option>
                  <option value="Verdediger">{t.defenderPosition}</option>
                  <option value="Middenvelder">{t.midfielderPosition}</option>
                  <option value="Aanvaller">{t.forwardPosition}</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="save-player-button"
              onClick={goToNextStep}
            >
              {t.playerNext}
            </button>
          </>
        )}

        {formStep === 2 && (
          <>
            <div className="form-grid">
              <h3 className="form-section-title">{t.playerFormGeneralSection}</h3>

              <div className="form-field">
                <label htmlFor="player-team">{t.playerTeam}</label>
                <select
                  id="player-team"
                  value={newPlayerTeam}
                  onChange={(e) => setNewPlayerTeam(e.target.value)}
                >
                  <option value="">{t.playerChooseTeam}</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="player-matches">{t.playerMatchesPlayed}</label>
                <input
                  id="player-matches"
                  type="number"
                  min="0"
                  value={newPlayerMatches}
                  onChange={(e) => setNewPlayerMatches(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-minutes">{t.playerMinutesPlayed}</label>
                <input
                  id="player-minutes"
                  type="number"
                  min="0"
                  value={newPlayerMinutesPlayed}
                  onChange={(e) => setNewPlayerMinutesPlayed(e.target.value)}
                />
              </div>

              <h3 className="form-section-title">{t.playerAttackingSection}</h3>

              <div className="form-field">
                <label htmlFor="player-goals">{t.playerGoals}</label>
                <input
                  id="player-goals"
                  type="number"
                  min="0"
                  value={newPlayerGoals}
                  onChange={(e) => setNewPlayerGoals(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-assists">{t.playerAssists}</label>
                <input
                  id="player-assists"
                  type="number"
                  min="0"
                  value={newPlayerAssists}
                  onChange={(e) => setNewPlayerAssists(e.target.value)}
                />
              </div>

              <h3 className="form-section-title">{t.playerDefendingSection}</h3>

              <div className="form-field">
                <label htmlFor="player-tackles">{t.playerTackles}</label>
                <input
                  id="player-tackles"
                  type="number"
                  min="0"
                  value={newPlayerTackle}
                  onChange={(e) => setNewPlayerTackle(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-interceptions">{t.playerInterceptions}</label>
                <input
                  id="player-interceptions"
                  type="number"
                  min="0"
                  value={newPlayerInterceptions}
                  onChange={(e) => setNewPlayerInterceptions(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-blocks">{t.playerBlocks}</label>
                <input
                  id="player-blocks"
                  type="number"
                  min="0"
                  value={newPlayerBlocks}
                  onChange={(e) => setNewPlayerBlocks(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-clearances">{t.playerClearances}</label>
                <input
                  id="player-clearances"
                  type="number"
                  min="0"
                  value={newPlayerClearances}
                  onChange={(e) => setNewPlayerClearances(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-duels">{t.playerDuelsWon}</label>
                <input
                  id="player-duels"
                  type="number"
                  min="0"
                  value={newPlayerDuelsWon}
                  onChange={(e) => setNewPlayerDuelsWon(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-fouls">{t.playerFouls}</label>
                <input
                  id="player-fouls"
                  type="number"
                  min="0"
                  value={newPlayerFouls}
                  onChange={(e) => setNewPlayerFouls(e.target.value)}
                />
              </div>

              <h3 className="form-section-title">{t.playerGoalkeeperSection}</h3>

              <div className="form-field">
                <label htmlFor="player-saves">{t.playerSaves}</label>
                <input
                  id="player-saves"
                  type="number"
                  min="0"
                  value={newPlayerSaves}
                  onChange={(e) => setNewPlayerSaves(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-one-v-one-saves">{t.playerOneVsOneSaves}</label>
                <input
                  id="player-one-v-one-saves"
                  type="number"
                  min="0"
                  value={newPlayerOneVsOneSaves}
                  onChange={(e) => setNewPlayerOneVsOneSaves(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-clean-sheets">{t.playerCleanSheets}</label>
                <input
                  id="player-clean-sheets"
                  type="number"
                  min="0"
                  value={newPlayerCleanSheets}
                  onChange={(e) => setNewPlayerCleanSheets(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-penalty-saves">{t.playerPenaltySaves}</label>
                <input
                  id="player-penalty-saves"
                  type="number"
                  min="0"
                  value={newPlayerPenaltySaves}
                  onChange={(e) => setNewPlayerPenaltySaves(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="player-goals-conceded">{t.playerGoalsConceded}</label>
                <input
                  id="player-goals-conceded"
                  type="number"
                  min="0"
                  value={newPlayerGoalsConceded}
                  onChange={(e) => setNewPlayerGoalsConceded(e.target.value)}
                />
              </div>

              <h3 className="form-section-title">{t.playerRatingSection}</h3>

              <div className="form-field">
                <label htmlFor="player-rating">{t.playerRating}</label>
                <input
                  id="player-rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={newPlayerRating}
                  onChange={(e) => setNewPlayerRating(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="back-player-button"
                onClick={goBack}
              >
                {t.back}
              </button>

              <button
                type="button"
                className="save-player-button"
                onClick={savePlayer}
              >
                {editingPlayer ? t.save : t.playerSave}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerForm;
