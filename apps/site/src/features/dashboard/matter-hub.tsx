"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { VoiceIntakePreview } from "./voice-intake-preview";
import styles from "./matter-hub.module.css";

export type MatterListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  petitionType: string;
  status: "intake" | "parsing" | "conflict_flagged" | "ready_for_export";
  updatedAt: string;
  assignedAttorney: string | null;
};

type PreviewRow = {
  row_id: string;
  row_number: number;
  data: Record<string, string>;
  errors: string[];
  is_duplicate: boolean;
  action: "create" | "skip" | "invalid";
};

type Preview = {
  batch_id: string;
  expires_in_seconds: number;
  total_rows: number;
  valid_count: number;
  duplicate_count: number;
  invalid_count: number;
  rows: PreviewRow[];
};

const statusLabels: Record<MatterListItem["status"], string> = {
  intake: "Intake",
  parsing: "Parsing",
  conflict_flagged: "Conflict flagged",
  ready_for_export: "Ready for export",
};

function safeCsvCell(value: string) {
  const safe = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

function downloadErrors(rows: PreviewRow[]) {
  const invalidRows = rows.filter((row) => row.errors.length > 0);
  const content = [
    ["row", "first_name", "last_name", "email", "errors"].map(safeCsvCell).join(","),
    ...invalidRows.map((row) =>
      [
        String(row.row_number),
        row.data.first_name ?? "",
        row.data.last_name ?? "",
        row.data.email ?? "",
        row.errors.join("; "),
      ]
        .map(safeCsvCell)
        .join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "errors.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function MatterCreateDialog({
  workspaceId,
  onClose,
}: {
  workspaceId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(`/api/matters?workspace_id=${encodeURIComponent(workspaceId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(result.error ?? "The matter could not be created.");
      setSaving(false);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-matter-title"
      >
        <button type="button" className={styles.modalClose} aria-label="Close" onClick={onClose}>
          ×
        </button>
        <p className={styles.eyebrow}>NEW MATTER</p>
        <h2 id="new-matter-title">Add an applicant matter</h2>
        <p>
          Start a matter record. Documents and case details can be added in later workflow steps.
        </p>
        <form className={styles.createForm} onSubmit={submit}>
          <label>
            First name
            <input name="first_name" required maxLength={100} />
          </label>
          <label>
            Last name
            <input name="last_name" required maxLength={100} />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={254} />
          </label>
          <label>
            Petition type
            <input name="petition_type" required maxLength={40} placeholder="O-1A" />
          </label>
          <label>
            Sponsor / employer
            <input name="sponsor_employer" maxLength={160} />
          </label>
          <label>
            Field of endeavor
            <input name="field_of_endeavor" maxLength={240} />
          </label>
          {error ? (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          ) : null}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton} disabled={saving}>
              {saving ? "Creating…" : "Create matter"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function MatterImportDialog({
  workspaceId,
  onClose,
  onComplete,
}: {
  workspaceId: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setError("");
    setSuccess("");
    setBusy(true);
    const form = new FormData();
    form.set("file", file);
    const response = await fetch(
      `/api/matters/import/preview?workspace_id=${encodeURIComponent(workspaceId)}`,
      { method: "POST", body: form },
    );
    const result = (await response.json().catch(() => ({}))) as Preview & { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(result.error ?? "The CSV could not be previewed.");
      setPreview(null);
      return;
    }
    setPreview(result);
  }

  async function setRowAction(row: PreviewRow, action: "create" | "skip") {
    if (!preview) return;
    setBusy(true);
    setError("");
    const response = await fetch(
      `/api/matters/import/batches/${preview.batch_id}/rows/${row.row_id}?workspace_id=${encodeURIComponent(workspaceId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      },
    );
    const result = (await response.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(result.error ?? "The duplicate choice could not be saved.");
      return;
    }
    setPreview({
      ...preview,
      rows: preview.rows.map((item) => (item.row_id === row.row_id ? { ...item, action } : item)),
    });
  }

  async function confirm() {
    if (!preview) return;
    setBusy(true);
    setError("");
    const response = await fetch(
      `/api/matters/import/confirm?workspace_id=${encodeURIComponent(workspaceId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_id: preview.batch_id }),
      },
    );
    const result = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    setBusy(false);
    if (!response.ok) {
      setError(result.error ?? "The import could not be confirmed.");
      return;
    }
    setSuccess(result.message ?? "Import complete.");
    onComplete();
  }

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        className={`${styles.modal} ${styles.importModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-title"
      >
        <button
          type="button"
          className={styles.modalClose}
          aria-label="Close"
          disabled={busy}
          onClick={onClose}
        >
          ×
        </button>
        <p className={styles.eyebrow}>BULK INGESTION</p>
        <h2 id="import-title">Import matters from CSV</h2>
        <p>Preview and resolve row issues before any matter records are created.</p>
        {!preview && !success ? (
          <div className={styles.uploadArea}>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className={styles.fileInput}
              onChange={(event) => upload(event.currentTarget.files?.[0])}
            />
            <span aria-hidden="true">⇧</span>
            <strong>{busy ? "Validating and staging…" : "Choose a CSV file"}</strong>
            <small>Up to 5 MB and 500 applicant rows</small>
            <button
              type="button"
              className={styles.secondaryButton}
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              Browse files
            </button>
            <a
              className={styles.templateLink}
              href={`data:text/csv;charset=utf-8,${encodeURIComponent("first_name,last_name,email,petition_type,sponsor_employer,field_of_endeavor\n")}`}
              download="matter-import-template.csv"
            >
              Download CSV template
            </a>
          </div>
        ) : null}
        {preview ? (
          <>
            <div className={styles.importSummary}>
              <span>
                <strong>{preview.valid_count}</strong> valid rows
              </span>
              <span>
                <strong>{preview.duplicate_count}</strong> duplicate warnings
              </span>
              <span>
                <strong>{preview.invalid_count}</strong> invalid rows
              </span>
            </div>
            {preview.invalid_count ? (
              <button
                type="button"
                className={styles.downloadErrors}
                onClick={() => downloadErrors(preview.rows)}
              >
                Download errors.csv
              </button>
            ) : null}
            <div className={styles.previewTableWrap}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Applicant</th>
                    <th>Petition</th>
                    <th>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row) => (
                    <tr key={row.row_id}>
                      <td>{row.row_number}</td>
                      <td>
                        <strong>
                          {row.data.first_name} {row.data.last_name}
                        </strong>
                        <small>{row.data.email}</small>
                      </td>
                      <td>{row.data.petition_type}</td>
                      <td>
                        {row.errors.length ? (
                          <span className={styles.invalidLabel}>{row.errors.join(" ")}</span>
                        ) : row.is_duplicate ? (
                          <div className={styles.duplicateAction}>
                            <span>
                              {row.action === "create"
                                ? "Duplicate · include"
                                : "Duplicate · skipped"}
                            </span>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                setRowAction(row, row.action === "create" ? "skip" : "create")
                              }
                            >
                              {row.action === "create" ? "Skip" : "Create anyway"}
                            </button>
                          </div>
                        ) : (
                          <span className={styles.validLabel}>Ready to create</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.expiryNote}>
              This preview and its applicant data expire after 15 minutes.
            </p>
          </>
        ) : null}
        {success ? (
          <p className={styles.successMessage} role="status">
            {success}
          </p>
        ) : null}
        {error ? (
          <p className={styles.formError} role="alert">
            {error}
          </p>
        ) : null}
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={busy}
            onClick={onClose}
          >
            {success ? "Done" : "Cancel"}
          </button>
          {preview && !success ? (
            <button
              type="button"
              className={styles.primaryButton}
              disabled={busy}
              onClick={confirm}
            >
              {busy ? "Importing…" : "Confirm import"}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function MatterHub({
  workspaceId,
  matters,
  canManage,
  initialCreateOpen = false,
  initialImportOpen = false,
}: {
  workspaceId: string;
  matters: MatterListItem[];
  canManage: boolean;
  initialCreateOpen?: boolean;
  initialImportOpen?: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(initialCreateOpen);
  const [importOpen, setImportOpen] = useState(initialImportOpen);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return matters.filter((matter) => {
      const matchesText =
        !query ||
        `${matter.firstName} ${matter.lastName} ${matter.email} ${matter.petitionType}`
          .toLowerCase()
          .includes(query);
      return matchesText && (status === "all" || matter.status === status);
    });
  }, [matters, search, status]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>CASE RECORDS</p>
          <h1>Matters</h1>
          <p>Find and route applicant work across this workspace.</p>
        </div>
        <span className={styles.countTag}>
          {matters.length} {matters.length === 1 ? "matter" : "matters"}
        </span>
      </header>
      <section className={styles.voiceBanner}>
        <div>
          <span className={styles.voiceIcon}>◖</span>
          <div>
            <p className={styles.eyebrow}>AUTOMATED FOLLOW-UPS · COMING SOON</p>
            <h2>AI Voice Assistant Intake</h2>
            <p>Automate phone calls to applicants to resolve missing FactGraph gaps.</p>
          </div>
        </div>
        <VoiceIntakePreview />
      </section>
      <section className={styles.tableCard} aria-label="Matter list">
        <div className={styles.tableToolbar}>
          <div>
            <h2>All matters</h2>
            <p>Workspace records are visible only to authorized team members.</p>
          </div>
          {canManage ? (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setImportOpen(true)}
              >
                Import via CSV
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setCreateOpen(true)}
              >
                ＋ New Matter
              </button>
            </div>
          ) : null}
        </div>
        <div className={styles.filters}>
          <label className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search matters"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Search name, email, or petition"
            />
          </label>
          <label className={styles.statusFilter}>
            Status
            <select value={status} onChange={(event) => setStatus(event.currentTarget.value)}>
              <option value="all">All statuses</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.matterTable}>
              <thead>
                <tr>
                  <th>Applicant name &amp; email</th>
                  <th>Petition</th>
                  <th>Status</th>
                  <th>FactGraph</th>
                  <th>Last updated</th>
                  <th>Assigned attorney</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((matter) => (
                  <tr
                    key={matter.id}
                    className={styles.clickableRow}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open ${matter.firstName} ${matter.lastName} matter command center`}
                    onClick={() =>
                      router.push(
                        `/dashboard/${workspaceId}/matters/${encodeURIComponent(matter.id)}`,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(
                          `/dashboard/${workspaceId}/matters/${encodeURIComponent(matter.id)}`,
                        );
                      }
                    }}
                  >
                    <td>
                      <strong>
                        {matter.firstName} {matter.lastName}
                      </strong>
                      <small>{matter.email}</small>
                    </td>
                    <td>{matter.petitionType}</td>
                    <td>
                      <span className={`${styles.statusPill} ${styles[`status_${matter.status}`]}`}>
                        {statusLabels[matter.status]}
                      </span>
                    </td>
                    <td className={styles.mutedValue}>—</td>
                    <td>
                      {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                        new Date(matter.updatedAt),
                      )}
                    </td>
                    <td>
                      {matter.assignedAttorney ?? (
                        <span className={styles.mutedValue}>Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyTable}>
            <span>▤</span>
            <h3>{matters.length ? "No matching matters" : "No matters yet"}</h3>
            <p>
              {matters.length
                ? "Try another search or status filter."
                : "Create a matter or import a CSV to begin organizing workspace records."}
            </p>
            {!matters.length && canManage ? (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setCreateOpen(true)}
              >
                Create the first matter
              </button>
            ) : null}
          </div>
        )}
      </section>
      {createOpen ? (
        <MatterCreateDialog workspaceId={workspaceId} onClose={() => setCreateOpen(false)} />
      ) : null}
      {importOpen ? (
        <MatterImportDialog
          workspaceId={workspaceId}
          onClose={() => setImportOpen(false)}
          onComplete={() => router.refresh()}
        />
      ) : null}
    </div>
  );
}
