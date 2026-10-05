import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Player, Team } from "./types.ts";

type PlayerFormProps = {
  editingPlayer: Player | null;
  setEditingPlayer: Dispatch<SetStateAction<Player | null>>;
  setPlayerList: Dispatch<SetStateAction<Player[]>>;
  closeModal: () => void;
  teams: Team[];
};

function PlayerForm({
  editingPlayer,
  setEditingPlayer,
  setPlayerList,
  closeModal,
  teams,
}: PlayerFormProps) {
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

  const [newPlayerClearences, setNewPlayerClearences] = useState(
    editingPlayer ? String(editingPlayer.clearences ?? "") : "",
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
      setWarning("Vul eerst alle basisgegevens in!");
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
      setWarning("Vul alle verplichte velden in!");
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
      newPlayerClearences,
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
      setWarning("Getallen kunnen niet negatief zijn!");
      return;
    }
      if (Number(newPlayerRating) > 10) {
        setWarning("De rating kan maximaal 10 zijn!");
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
      clearences: Number(newPlayerClearences),
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

    setEditingPlayer(null);
    closeModal();
  }

  function goBack() {
    setWarning("");
    setFormStep(1);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={closeModal}>
          ×
        </button>

        <h2 className="h2-player">
          {editingPlayer ? "Speler bewerken" : "Speler toevoegen"}
        </h2>

        {warning && <p className="warning">{warning}</p>}

        {formStep === 1 && (
          <>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Voornaam speler"
                value={newPlayerFirstName}
                onChange={(e) => setNewPlayerFirstName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Achternaam speler"
                value={newPlayerLastName}
                onChange={(e) => setNewPlayerLastName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Rugnummer"
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(e.target.value)}
              />

              <input
                list="player-positions"
                type="text"
                placeholder="Positie"
                value={newPlayerPosition}
                onChange={(e) => setNewPlayerPosition(e.target.value)}
              />

              <datalist id="player-positions">
                <option value="Keeper" />
                <option value="Verdediger" />
                <option value="Middenvelder" />
                <option value="Aanvaller" />
              </datalist>
            </div>

            <button className="save-player-button" onClick={goToNextStep}>
              Doorgaan
            </button>
          </>
        )}

        {formStep === 2 && (
          <>
            <div className="form-grid">
              <div className="form-field">
                <label>Team</label>
                <input
                  list="player-teams"
                  type="text"
                  value={newPlayerTeam}
                  onChange={(e) => setNewPlayerTeam(e.target.value)}
                />

                <datalist id="player-teams">
                  {teams.map((team) => (
                    <option key={team.id} value={team.name} />
                  ))}
                </datalist>
              </div>

              <div className="form-field">
                <label>Goals</label>
                <input
                  type="number"
                  value={newPlayerGoals}
                  onChange={(e) => setNewPlayerGoals(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Assists</label>
                <input
                  type="number"
                  value={newPlayerAssists}
                  onChange={(e) => setNewPlayerAssists(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Wedstrijden</label>
                <input
                  type="number"
                  value={newPlayerMatches}
                  onChange={(e) => setNewPlayerMatches(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Minuten gespeeld</label>
                <input
                  type="number"
                  value={newPlayerMinutesPlayed}
                  onChange={(e) => setNewPlayerMinutesPlayed(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Tackles</label>
                <input
                  type="number"
                  value={newPlayerTackle}
                  onChange={(e) => setNewPlayerTackle(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Interceptions</label>
                <input
                  type="number"
                  value={newPlayerInterceptions}
                  onChange={(e) => setNewPlayerInterceptions(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Blocks</label>
                <input
                  type="number"
                  value={newPlayerBlocks}
                  onChange={(e) => setNewPlayerBlocks(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Clearences</label>
                <input
                  type="number"
                  value={newPlayerClearences}
                  onChange={(e) => setNewPlayerClearences(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Gewonnen duels</label>
                <input
                  type="number"
                  value={newPlayerDuelsWon}
                  onChange={(e) => setNewPlayerDuelsWon(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Overtredingen</label>
                <input
                  type="number"
                  value={newPlayerFouls}
                  onChange={(e) => setNewPlayerFouls(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Reddingen</label>
                <input
                  type="number"
                  value={newPlayerSaves}
                  onChange={(e) => setNewPlayerSaves(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>1-op-1 reddingen</label>
                <input
                  type="number"
                  value={newPlayerOneVsOneSaves}
                  onChange={(e) => setNewPlayerOneVsOneSaves(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Clean Sheets</label>
                <input
                  type="number"
                  value={newPlayerCleanSheets}
                  onChange={(e) => setNewPlayerCleanSheets(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Penalty's gehouden</label>
                <input
                  type="number"
                  value={newPlayerPenaltySaves}
                  onChange={(e) => setNewPlayerPenaltySaves(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Tegengoals</label>
                <input
                  type="number"
                  value={newPlayerGoalsConceded}
                  onChange={(e) => setNewPlayerGoalsConceded(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={newPlayerRating}
                  onChange={(e) => setNewPlayerRating(e.target.value)}
                />
              </div>
            </div>

            <button className="save-player-button" onClick={goBack}>
              Terug
            </button>

            <button className="save-player-button" onClick={savePlayer}>
              {editingPlayer ? "Wijzigingen opslaan" : "Speler opslaan"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerForm;
