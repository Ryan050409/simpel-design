import { useEffect, useRef, useState } from "react";
import { getAuditLogs } from "./api";
import type { AuditLog } from "./types";

const actionLabels: Record<string, string> = {
  Create: "Toegevoegd",
  Update: "Gewijzigd",
  Delete: "Verwijderd",
  BulkCreate: "Bulkimport",
  BulkUpdate: "Bulkwijziging",
  Sync: "Gesynchroniseerd",
  Rollback: "Hersteld",
};

const entityLabels: Record<string, string> = {
  Match: "Wedstrijd",
  Player: "Speler",
  Team: "Club",
};

const fieldLabels: Record<string, string> = {
  Id: "ID",
  Name: "Naam",
  Firstname: "Voornaam",
  Lastname: "Achternaam",
  Team: "Club",
  Position: "Positie",
  Number: "Rugnummer",
  Home: "Thuisclub",
  Away: "Uitclub",
  HomeGoals: "Doelpunten thuis",
  AwayGoals: "Doelpunten uit",
  Date: "Wedstrijddatum",
  Matchday: "Speelronde",
  Goals: "Doelpunten",
  Assists: "Assists",
  Matches: "Wedstrijden",
  MinutesPlayed: "Speelminuten",
  Tackles: "Tackles",
  Interceptions: "Onderscheppingen",
  Blocks: "Blocks",
  Clearances: "Weggewerkte ballen",
  DuelsWon: "Gewonnen duels",
  Fouls: "Overtredingen",
  CleanSheets: "Clean sheets",
  Saves: "Reddingen",
  OneVSOneSaves: "Eén-tegen-één-reddingen",
  PenaltySaves: "Gestopte strafschoppen",
  GoalsConceded: "Tegendoelpunten",
  Venue: "Stadion",
  City: "Stad",
  Attendance: "Toeschouwers",
  LogoPath: "Clublogo",
  ExternalGameId: "Extern wedstrijd-ID",
  HomeLineup: "Thuisopstelling",
  AwayLineup: "Uitopstelling",
};

const PAGE_SIZE = 15;

function parseValues(value: string | null): Record<string, unknown> {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);

    return parsed && typeof parsed === "object"
      ? parsed
      : { Gegevens: parsed };
  } catch {
    return { Gegevens: value };
  }
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (value === "") return "(Leeg)";
  if (typeof value === "boolean") return value ? "Ja" : "Nee";
  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

function formatDate(value: string) {
  const utcValue = /Z$|[+-]\d{2}:\d{2}$/.test(value)
    ? value
    : `${value}Z`;

  const date = new Date(utcValue);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("nl-NL");
}

function getEntityName(log: AuditLog): string {
  const values = parseValues(log.newValues ?? log.oldValues);

  switch (log.entityType) {
    case "Team":
      return String(values.Name ?? `#${log.entityId}`);

    case "Player":
      return `${values.Firstname ?? ""} ${values.Lastname ?? ""}`.trim()
        || `#${log.entityId}`;

    case "Match":
      return `${values.Home ?? "?"} - ${values.Away ?? "?"}`;

    default:
      return `#${log.entityId}`;
  }
}

function getChanges(log: AuditLog) {
  const oldValues = parseValues(log.oldValues);
  const newValues = parseValues(log.newValues);

  const keys = [...new Set([
    ...Object.keys(oldValues),
    ...Object.keys(newValues),
  ])];

  return keys
    .filter(
      (key) =>
        JSON.stringify(oldValues[key]) !==
        JSON.stringify(newValues[key]),
    )
    .map((key) => ({
      key,
      label: fieldLabels[key] ?? key,
      oldValue: formatValue(oldValues[key]),
      newValue: formatValue(newValues[key]),
    }));
}

type AuditLogPanelProps = {
  refreshKey: number;
};

export default function AuditLogPanel({
  refreshKey,
}: AuditLogPanelProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [page, setPage] = useState(1);

  const dialogRef = useRef<HTMLDialogElement>(null);

  async function loadAuditLogs() {
    setLoading(true);
    setError("");

    try {
      const data = await getAuditLogs();
      setLogs(data);
      setPage(1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Er is een fout opgetreden.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAuditLogs();
  }, [refreshKey]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (selectedLog && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [selectedLog]);

  const filteredLogs = logs.filter((log) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      log.userEmail,
      log.action,
      actionLabels[log.action],
      log.entityType,
      entityLabels[log.entityType],
      String(log.entityId),
      getEntityName(log),
    ].some((value) => value?.toLowerCase().includes(query));

    return (
      matchesSearch &&
      (!actionFilter || log.action === actionFilter) &&
      (!entityFilter || log.entityType === entityFilter)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changes = selectedLog ? getChanges(selectedLog) : [];

  return (
    <section className="audit-log-panel">
      <div className="audit-log-header">
        <div>
          <h2>Activiteitenlogboek</h2>
          <p>Bekijk wijzigingen binnen de Football Tracker.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={loadAuditLogs}
          disabled={loading}
        >
          Vernieuwen
        </button>
      </div>

      <div className="audit-log-filters">
        <label>
          Zoeken
          <input
            type="search"
            placeholder="Zoek gebruiker, club of speler..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <label>
          Actie
          <select
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Alle acties</option>

            {Object.entries(actionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Onderdeel
          <select
            value={entityFilter}
            onChange={(event) => {
              setEntityFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Alle onderdelen</option>

            {Object.entries(entityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="audit-log-button"
          onClick={() => {
            setSearch("");
            setActionFilter("");
            setEntityFilter("");
            setPage(1);
          }}
        >
          Filters wissen
        </button>
      </div>

      {loading && <p role="status">Activiteiten laden...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <p className="audit-log-count" aria-live="polite">
            {filteredLogs.length} van {logs.length} activiteiten
          </p>

          {filteredLogs.length === 0 ? (
            <div className="admin-empty-state">
              <strong>Geen activiteiten gevonden</strong>
              <p>Er zijn geen activiteiten die aan de filters voldoen.</p>
            </div>
          ) : (
            <>
              <div className="audit-log-table-wrapper">
                <table className="audit-log-table">
                  <thead>
                    <tr>
                      <th scope="col">Datum en tijd</th>
                      <th scope="col">Gebruiker</th>
                      <th scope="col">Actie</th>
                      <th scope="col">Onderdeel</th>
                      <th scope="col">Naam</th>
                      <th scope="col">Details</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{formatDate(log.createdAt)}</td>
                        <td>{log.userEmail || log.userId || "—"}</td>

                        <td>
                          <span
                            className={`audit-action audit-action-${log.action.toLowerCase()}`}
                          >
                            {actionLabels[log.action] ?? log.action}
                          </span>
                        </td>

                        <td>
                          {entityLabels[log.entityType] ?? log.entityType}
                        </td>

                        <td>{getEntityName(log)}</td>

                        <td>
                          <button
                            type="button"
                            className="audit-log-button"
                            aria-label={`Bekijk wijziging van ${getEntityName(log)}`}
                            onClick={() => setSelectedLog(log)}
                          >
                            Bekijken
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="audit-log-pagination">
                <button
                  type="button"
                  className="audit-log-button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Vorige
                </button>

                <span>
                  Pagina {currentPage} van {totalPages}
                </span>

                <button
                  type="button"
                  className="audit-log-button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Volgende
                </button>
              </div>
            </>
          )}
        </>
      )}

      <dialog
        ref={dialogRef}
        className="audit-log-modal"
        aria-labelledby="audit-log-modal-title"
        onClose={() => setSelectedLog(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialogRef.current?.close();
          }
        }}
      >
        {selectedLog && (
          <div className="audit-log-modal-content">
            <div className="audit-log-modal-header">
              <div>
                <h2 id="audit-log-modal-title">
                  Wijzigingsdetails
                </h2>
                <p>{getEntityName(selectedLog)}</p>
              </div>

              <button
                type="button"
                className="audit-log-modal-close"
                aria-label="Sluiten"
                onClick={() => dialogRef.current?.close()}
              >
                ×
              </button>
            </div>

            <div className="audit-log-modal-info">
              <p>
                <strong>Gebruiker:</strong>{" "}
                {selectedLog.userEmail || selectedLog.userId || "—"}
              </p>

              <p>
                <strong>Datum:</strong>{" "}
                {formatDate(selectedLog.createdAt)}
              </p>

              <p>
                <strong>Actie:</strong>{" "}
                {actionLabels[selectedLog.action] ?? selectedLog.action}
              </p>

              <p>
                <strong>ID:</strong> {selectedLog.entityId}
              </p>
            </div>

            <h3>Gewijzigde gegevens ({changes.length})</h3>

            <div className="audit-log-table-wrapper">
              <table className="audit-log-table audit-changes-table">
                <thead>
                  <tr>
                    <th scope="col">Veld</th>
                    <th scope="col">Oude waarde</th>
                    <th scope="col">Nieuwe waarde</th>
                  </tr>
                </thead>

                <tbody>
                  {changes.map((change) => (
                    <tr key={change.key}>
                      <th scope="row">{change.label}</th>
                      <td className="audit-old-value">
                        {change.oldValue}
                      </td>
                      <td className="audit-new-value">
                        {change.newValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}