"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { WorkspaceSummary } from "./workspace-shell";
import styles from "./workspace-shell.module.css";

const roleLabels: Record<string, string> = {
  superadmin: "MatterZero superadmin",
  owner: "Workspace owner",
  admin: "Workspace admin",
  member: "Team member",
};

export function WorkspaceContextMenu({
  workspace,
  workspaces,
  email,
  role,
}: {
  workspace: WorkspaceSummary;
  workspaces: Pick<WorkspaceSummary, "id" | "name">[];
  email: string;
  role: string;
}) {
  const base = `/dashboard/${workspace.id}`;
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const menu = menuRef.current;
      if (menu && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <details className={styles.contextMenu} ref={menuRef}>
      <summary className={styles.contextTrigger} aria-label="Workspace and account menu">
        <span className={styles.contextIcon} aria-hidden="true">
          ▦
        </span>
        <span className={styles.contextOrgName}>Workspace &amp; account</span>
        <span className={styles.contextChevron} aria-hidden="true">
          ⌄
        </span>
      </summary>
      <div className={styles.contextPanel}>
        <section className={styles.contextIdentity}>
          <small>LOGGED IN AS</small>
          <strong>{email}</strong>
          <span>{roleLabels[role] ?? "Team member"}</span>
        </section>

        <section className={styles.contextSection}>
          <small>ORGANIZATION</small>
          {workspaces.map((item) => (
            <Link
              className={item.id === workspace.id ? styles.contextCurrent : styles.contextLink}
              href={`/dashboard/${item.id}`}
              key={item.id}
              aria-current={item.id === workspace.id ? "page" : undefined}
            >
              <span>{item.id === workspace.id ? "✓" : "▦"}</span>
              {item.name}
            </Link>
          ))}
          <Link className={styles.contextSecondaryLink} href="/dashboard">
            Manage workspaces
          </Link>
        </section>

        <nav className={styles.contextActions} aria-label="Organization and account settings">
          <small>WORKSPACE SETTINGS</small>
          <Link href={`${base}/settings?tab=profile`}>Firm profile & settings</Link>
        </nav>
        <div className={styles.contextSignOut}>
          <form action="/auth/signout" method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </details>
  );
}
