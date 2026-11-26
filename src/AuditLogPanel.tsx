import { useEffect, useRef, useState } from "react";
import { getAuditLogs } from "./api";
import type { AuditLog } from "./types";
import { translations, type Language } from "./translations";

const PAGE_SIZE = 15;

const locales: Record<Language, string> = {
  nl: "nl-NL",
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  sp: "es-ES",
  pt: "pt-PT",
};

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

function formatValue(value: unknown, language: Language): string {
  const t = translations[language];

  if (value === null || value === undefined) return "—";
  if (value === "") return `(${t.auditLogEmpty})`;
  if (typeof value === "boolean") {
    return value ? t.auditLogYes : t.auditLogNo;
  }
  if (typeof value === "object") return JSON.stringify(value);

  return String(value);
}

function formatDate(value: string, language: Language) {
  const utcValue = /Z$|[+-]\d{2}:\d{2}$/.test(value)
    ? value
    : `${value}Z`;

  const date = new Date(utcValue);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(locales[language]);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getEntityName(log: AuditLog): string {
  const values = parseValues(log.newValues ?? log.oldValues);

  switch (log.entityType) {
    case "Team":
      return String(values.Name ?? `#${log.entityId}`);

    case "Player":
      return (
        `${values.Firstname ?? ""} ${values.Lastname ?? ""}`.trim() ||
        `#${log.entityId}`
      );

    case "Match":
      return `${values.Home ?? "?"} - ${values.Away ?? "?"}`;

    default:
      return `#${log.entityId}`;
  }
}

function getChanges(log: AuditLog, language: Language) {
  const t = translations[language];

  const fieldLabels: Record<string, string> = {
    Id: "ID",
    Name: t.auditLogName,
    Firstname: t.playerFirstName,
    Lastname: t.playerLastName,
    Team: t.rankingClubLabel,
    Position: t.playerPosition,
    Number: t.playerNumber,
    Home: t.matchHomeTeam,
    Away: t.matchAwayTeam,
    HomeGoals: t.homeGoals,
    AwayGoals: t.awayGoals,
    Date: t.dateLabel,
    Matchday: t.matchdayLabel,
    Goals: t.goalsStat,
    Assists: t.assistsStat,
    Matches: t.matchesStat,
    MinutesPlayed: t.minutesStat,
    Tackles: t.tacklesStat,
    Interceptions: t.interceptionsStat,
    Blocks: t.blocksStat,
    Clearances: t.clearancesStat,
    DuelsWon: t.duelsWonStat,
    Fouls: t.foulsStat,
    CleanSheets: t.cleanSheetsStat,
    Saves: t.savesStat,
    OneVSOneSaves: t.oneVsOneSavesStat,
    PenaltySaves: t.penaltySavesStat,
    GoalsConceded: t.goalsConcededStat,
    Venue: t.auditLogVenue,
    City: t.auditLogCity,
    Attendance: t.auditLogAttendance,
    LogoPath: t.auditLogLogo,
    ExternalGameId: t.auditLogExternalId,
    HomeLineup: t.auditLogHomeLineup,
    AwayLineup: t.auditLogAwayLineup,
    Gegevens: t.auditLogData,
  };

  const oldValues = parseValues(log.oldValues);
  const newValues = parseValues(log.newValues);

  const keys = [
    ...new Set([
      ...Object.keys(oldValues),
      ...Object.keys(newValues),
    ]),
  ];

  return keys
    .filter(
      (key) =>
        JSON.stringify(oldValues[key]) !==
        JSON.stringify(newValues[key]),
    )
    .map((key) => ({
      key,
      label: fieldLabels[key] ?? key,
      oldValue: formatValue(oldValues[key], language),
      newValue: formatValue(newValues[key], language),
    }));
}

type AuditLogPanelProps = {
  refreshKey: number;
  language: Language;
};

export default function AuditLogPanel({
  refreshKey,
  language,
}: AuditLogPanelProps) {
  const t = translations[language];

  const actionLabels: Record<string, string> = {
    Create: t.auditLogCreated,
    Update: t.auditLogUpdated,
    Delete: t.auditLogDeleted,
    BulkCreate: t.auditLogBulkCreated,
    BulkUpdate: t.auditLogBulkUpdated,
    Sync: t.auditLogSynced,
    Rollback: t.auditLogRestored,
  };

  const entityLabels: Record<string, string> = {
    Match: capitalize(t.dashboardMatchSingular),
    Player: capitalize(t.player),
    Team: t.rankingClubLabel,
  };

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [page, setPage] = useState(1);

  const dialogRef = useRef<HTMLDialogElement>(null);

  async function loadAuditLogs() {
    setLoading(true);
    setError(false);

    try {
      const data = await getAuditLogs();
      setLogs(data);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(true);
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

  const changes = selectedLog
    ? getChanges(selectedLog, language)
    : [];

  return (
    <section className="audit-log-panel">
      <div className="audit-log-header">
        <div>
          <h2>{t.auditLogTitle}</h2>
          <p>{t.auditLogDescription}</p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={loadAuditLogs}
          disabled={loading}
        >
          {t.auditLogRefresh}
        </button>
      </div>

      <div className="audit-log-filters">
        <label>
          {t.search}
          <input
            type="search"
            placeholder={t.auditLogSearchPlaceholder}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </label>

        <label>
          {t.auditLogAction}
          <select
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">{t.auditLogAllActions}</option>

            {Object.entries(actionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.auditLogEntity}
          <select
            value={entityFilter}
            onChange={(event) => {
              setEntityFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">{t.auditLogAllEntities}</option>

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
          {t.auditLogClearFilters}
        </button>
      </div>

      {loading && <p role="status">{t.auditLogLoading}</p>}
      {error && <p role="alert">{t.auditLogError}</p>}

      {!loading && !error && (
        <>
          <p className="audit-log-count" aria-live="polite">
            {filteredLogs.length} {t.ofMatches} {logs.length}{" "}
            {t.auditLogActivities}
          </p>

          {filteredLogs.length === 0 ? (
            <div className="admin-empty-state">
              <strong>{t.auditLogNoResults}</strong>
              <p>{t.auditLogNoResultsDescription}</p>
            </div>
          ) : (
            <>
              <div className="audit-log-table-wrapper">
                <table className="audit-log-table">
                  <thead>
                    <tr>
                      <th scope="col">{t.auditLogDateTime}</th>
                      <th scope="col">{t.auditLogUser}</th>
                      <th scope="col">{t.auditLogAction}</th>
                      <th scope="col">{t.auditLogEntity}</th>
                      <th scope="col">{t.auditLogName}</th>
                      <th scope="col">{t.auditLogDetails}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{formatDate(log.createdAt, language)}</td>
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
                            aria-label={`${t.auditLogViewChange} ${getEntityName(log)}`}
                            onClick={() => setSelectedLog(log)}
                          >
                            {t.auditLogView}
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
                  {t.previous}
                </button>

                <span>
                  {t.auditLogPage} {currentPage} {t.ofMatches}{" "}
                  {totalPages}
                </span>

                <button
                  type="button"
                  className="audit-log-button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  {t.next}
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
                  {t.auditLogChangeDetails}
                </h2>
                <p>{getEntityName(selectedLog)}</p>
              </div>

              <button
                type="button"
                className="audit-log-modal-close"
                aria-label={t.close}
                onClick={() => dialogRef.current?.close()}
              >
                ×
              </button>
            </div>

            <div className="audit-log-modal-info">
              <p>
                <strong>{t.auditLogUser}:</strong>{" "}
                {selectedLog.userEmail || selectedLog.userId || "—"}
              </p>

              <p>
                <strong>{t.dateLabel}:</strong>{" "}
                {formatDate(selectedLog.createdAt, language)}
              </p>

              <p>
                <strong>{t.auditLogAction}:</strong>{" "}
                {actionLabels[selectedLog.action] ?? selectedLog.action}
              </p>

              <p>
                <strong>ID:</strong> {selectedLog.entityId}
              </p>
            </div>

            <h3>
              {t.auditLogChangedFields} ({changes.length})
            </h3>

            <div className="audit-log-table-wrapper">
              <table className="audit-log-table audit-changes-table">
                <thead>
                  <tr>
                    <th scope="col">{t.auditLogField}</th>
                    <th scope="col">{t.auditLogOldValue}</th>
                    <th scope="col">{t.auditLogNewValue}</th>
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