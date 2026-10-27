"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { WorkspaceSummary } from "./workspace-shell";
import styles from "./workspace-settings.module.css";

type WorkspaceSettingsData = WorkspaceSummary & {
  practiceAreas: string[];
  officeLocation: string;
  deadlinePaddingDays: number;
  firmContext: string;
};

type Member = { email: string; role: string; joinedAt: string };
type AuditEvent = {
  eventType: string;
  actorEmail: string;
  changedFields: string[];
  occurredAt: string;
};

const tabs = [
  { id: "profile", label: "Firm profile" },
  { id: "team", label: "Team & roles" },
  { id: "context", label: "Firm context" },
  { id: "security", label: "Audit & security" },
] as const;

const roleLabels: Record<string, string> = {
  owner: "Workspace owner",
  admin: "Workspace admin",
  member: "Team member",
  superadmin: "MatterZero superadmin",
};

export function WorkspaceSettings({
  workspace,
  members,
  events,
  role,
  initialTab,
}: {
  workspace: WorkspaceSettingsData;
  members: Member[];
  events: AuditEvent[];
  role: string;
  initialTab: string;
}) {
  const base = `/dashboard/${workspace.id}/settings`;
  const activeTab = tabs.some((tab) => tab.id === initialTab) ? initialTab : "profile";
  const canManage = role === "owner" || role === "admin" || role === "superadmin";
  const [name, setName] = useState(workspace.name);
  const [organizationType, setOrganizationType] = useState(workspace.organizationType);
  const [market, setMarket] = useState(workspace.market);
  const [teamSize, setTeamSize] = useState(workspace.teamSize);
  const [primaryFocus, setPrimaryFocus] = useState(workspace.primaryFocus);
  const [practiceAreas, setPracticeAreas] = useState(workspace.practiceAreas.join(", "));
  const [officeLocation, setOfficeLocation] = useState(workspace.officeLocation);
  const [deadlinePaddingDays, setDeadlinePaddingDays] = useState(workspace.deadlinePaddingDays);
  const [firmContext, setFirmContext] = useState(workspace.firmContext);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function save(event: FormEvent<HTMLFormElement>, payload: Record<string, unknown>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Settings could not be saved.");
      setNotice("Changes saved.");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>ORGANIZATION MANAGEMENT</p>
          <h1>Firm profile & settings</h1>
        </div>
        <span className={styles.workspaceTag}>{workspace.name}</span>
      </header>

      <nav className={styles.tabs} aria-label="Firm settings">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`${base}?tab=${tab.id}`}
            className={activeTab === tab.id ? styles.tabActive : styles.tab}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {notice ? (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {activeTab === "profile" ? (
        <section className={styles.panel} aria-labelledby="profile-heading">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>FIRM PROFILE & PREFERENCES</p>
              <h2 id="profile-heading">Your organization</h2>
              <p>These settings help shape how the workspace is organized.</p>
            </div>
            <span className={styles.roleBadge}>{roleLabels[role] ?? "Team member"}</span>
          </div>
          <form
            className={styles.form}
            onSubmit={(event) =>
              void save(event, {
                name,
                organizationType,
                market,
                teamSize,
                primaryFocus,
                practiceAreas: practiceAreas
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean),
                officeLocation,
                deadlinePaddingDays,
              })
            }
          >
            <label>
              Firm or team name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={120}
                required
                disabled={!canManage}
              />
            </label>
            <div className={styles.fieldGrid}>
              <label>
                Organization type
                <select
                  value={organizationType}
                  onChange={(event) => setOrganizationType(event.target.value)}
                  disabled={!canManage}
                >
                  <option value="consultancy">Immigration consultancy</option>
                  <option value="law_firm">Law firm</option>
                  <option value="in_house">In-house immigration team</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Primary market
                <select
                  value={market}
                  onChange={(event) => setMarket(event.target.value)}
                  disabled={!canManage}
                >
                  <option value="india">India</option>
                  <option value="united_states">United States</option>
                  <option value="other">Other / multiple markets</option>
                </select>
              </label>
              <label>
                Team size
                <select
                  value={teamSize}
                  onChange={(event) => setTeamSize(event.target.value)}
                  disabled={!canManage}
                >
                  <option value="1">Just me</option>
                  <option value="2-5">2–5 people</option>
                  <option value="6-15">6–15 people</option>
                  <option value="16+">16 or more people</option>
                </select>
              </label>
              <label>
                Main workflow
                <select
                  value={primaryFocus}
                  onChange={(event) => setPrimaryFocus(event.target.value)}
                  disabled={!canManage}
                >
                  <option value="business">Business / employment immigration</option>
                  <option value="student">Student immigration</option>
                  <option value="family">Family immigration</option>
                  <option value="other">Other / mixed workflows</option>
                </select>
              </label>
            </div>
            <label>
              Practice areas
              <input
                value={practiceAreas}
                onChange={(event) => setPracticeAreas(event.target.value)}
                maxLength={720}
                placeholder="O-1, EB-1, student visas"
                disabled={!canManage}
              />
            </label>
            <div className={styles.fieldGrid}>
              <label>
                Primary office location
                <input
                  value={officeLocation}
                  onChange={(event) => setOfficeLocation(event.target.value)}
                  maxLength={160}
                  placeholder="Mumbai, India"
                  disabled={!canManage}
                />
              </label>
              <label>
                Internal deadline buffer
                <span className={styles.inputWithUnit}>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={deadlinePaddingDays}
                    onChange={(event) => setDeadlinePaddingDays(Number(event.target.value))}
                    disabled={!canManage}
                  />
                  <span>days</span>
                </span>
              </label>
            </div>
            <p className={styles.helpText}>
              Bar registration numbers are not collected in this pilot settings screen.
            </p>
            {canManage ? (
              <button className={styles.primaryButton} type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save firm profile"}
              </button>
            ) : null}
          </form>
        </section>
      ) : null}

      {activeTab === "team" ? (
        <section className={styles.panel} aria-labelledby="team-heading">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>TEAM MEMBERS & ROLES</p>
              <h2 id="team-heading">People in this workspace</h2>
              <p>Membership is checked before workspace routes and APIs return data.</p>
            </div>
            <span className={styles.countBadge}>
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>
          </div>
          <div className={styles.memberList}>
            {members.map((member) => (
              <div className={styles.memberRow} key={member.email}>
                <span className={styles.memberAvatar}>
                  {member.email.slice(0, 1).toUpperCase()}
                </span>
                <span className={styles.memberInfo}>
                  <strong>{member.email}</strong>
                  <small>Joined {new Date(member.joinedAt).toLocaleDateString()}</small>
                </span>
                <span className={styles.roleBadge}>{roleLabels[member.role] ?? member.role}</span>
              </div>
            ))}
          </div>
          <div className={styles.callout}>
            <strong>Invites are managed by the MatterZero admin during this pilot.</strong>
            <p>
              New members need an access grant before their sign-in link is sent. Workspace-specific
              invitation management is not enabled yet.
            </p>
            {role === "superadmin" ? <Link href="/admin">Open pilot invitations →</Link> : null}
          </div>
          <div className={styles.permissionMatrix}>
            <h3>Current pilot permissions</h3>
            <div>
              <span>Workspace owner / admin</span>
              <strong>Manage workspace profile and firm context</strong>
            </div>
            <div>
              <span>Team member</span>
              <strong>Read workspace settings</strong>
            </div>
            <div>
              <span>MatterZero superadmin</span>
              <strong>Review fictional sample approval</strong>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "context" ? (
        <section className={styles.panel} aria-labelledby="context-heading">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>FIRM CONTEXT</p>
              <h2 id="context-heading">Working preferences</h2>
              <p>Capture formatting and review preferences for this workspace.</p>
            </div>
            <span className={styles.roleBadge}>Private to workspace</span>
          </div>
          <form className={styles.form} onSubmit={(event) => void save(event, { firmContext })}>
            <label>
              Firm working preferences
              <textarea
                value={firmContext}
                onChange={(event) => setFirmContext(event.target.value)}
                rows={9}
                maxLength={4000}
                placeholder={
                  "Example: Use neutral, factual language. Name exhibits in chronological order. Flag uncertain dates for human review."
                }
                disabled={!canManage}
              />
            </label>
            <div className={styles.contextBoundary}>
              <strong>Not connected to an AI agent yet</strong>
              <p>
                These preferences are stored with the workspace. They are not currently sent to a
                model or used to make legal assessments. Treat this as configuration, not a place
                for client or case information.
              </p>
            </div>
            <div className={styles.formFooter}>
              <small>{firmContext.length} / 4,000 characters</small>
              {canManage ? (
                <button className={styles.primaryButton} type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save firm context"}
                </button>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}

      {activeTab === "security" ? (
        <section className={styles.panel} aria-labelledby="security-heading">
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>AUDIT & SECURITY</p>
              <h2 id="security-heading">Workspace activity</h2>
              <p>Profile and firm-context changes recorded by this pilot build.</p>
            </div>
            <span className={styles.countBadge}>{events.length} recent</span>
          </div>
          <div className={styles.securitySummary}>
            <div>
              <span className={styles.statusDot} />
              <span>
                <strong>Workspace membership checks</strong>
                <small>Verified on server for dashboard pages and settings API</small>
              </span>
            </div>
            <div>
              <span className={styles.statusDot} />
              <span>
                <strong>Postgres RLS</strong>
                <small>
                  Enabled on workspaces, memberships, and audit events; the app also performs
                  server-side membership checks
                </small>
              </span>
            </div>
            <div>
              <span className={styles.statusDotMuted} />
              <span>
                <strong>Case data encryption and tenant-scoped case policies</strong>
                <small>
                  Case records are not enabled in this pilot build, so this status is not yet
                  applicable
                </small>
              </span>
            </div>
          </div>
          {events.length ? (
            <ol className={styles.auditList}>
              {events.map((event, index) => (
                <li key={`${event.eventType}-${event.occurredAt}-${index}`}>
                  <span className={styles.auditMarker} />
                  <span className={styles.auditCopy}>
                    <strong>
                      {event.eventType === "workspace.profile_updated"
                        ? "Firm profile updated"
                        : "Firm context updated"}
                    </strong>
                    <small>
                      {event.actorEmail} · {event.changedFields.join(", ")}
                    </small>
                    <time dateTime={event.occurredAt}>
                      {new Date(event.occurredAt).toLocaleString()}
                    </time>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className={styles.emptyAudit}>
              <strong>No settings activity yet</strong>
              <p>Changes to firm profile and context will appear here.</p>
            </div>
          )}
          <p className={styles.helpText}>
            This is not a complete case audit log. Uploads, matter approvals, and team-role changes
            are not recorded here yet.
          </p>
        </section>
      ) : null}
    </div>
  );
}
