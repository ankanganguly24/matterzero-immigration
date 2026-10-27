"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkspaceContextMenu } from "./workspace-context-menu";
import styles from "./workspace-shell.module.css";

const navigation = [
  { suffix: "", label: "Matter dashboard", icon: "▦" },
  { suffix: "/sample", label: "Petition & Evidence Builder", icon: "▤" },
  { suffix: "/rfe-defense", label: "RFE Defense Engine", icon: "↗" },
  { suffix: "/employer-compliance", label: "Employer Compliance", icon: "▣" },
];

export type WorkspaceSummary = {
  id: string;
  name: string;
  organizationType: string;
  market: string;
  teamSize: string;
  primaryFocus: string;
  practiceAreas?: string[];
  officeLocation?: string;
  deadlinePaddingDays?: number;
  firmContext?: string;
};

export function WorkspaceShell({
  workspace,
  workspaces,
  email,
  role,
  children,
}: {
  workspace: WorkspaceSummary;
  workspaces: Pick<WorkspaceSummary, "id" | "name">[];
  email: string;
  role: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const base = `/dashboard/${workspace.id}`;
  const active = navigation.find((item) =>
    item.suffix ? pathname.startsWith(`${base}${item.suffix}`) : pathname === base,
  );

  return (
    <div className={styles.app}>
      <header className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={drawerOpen ? "Close workspace navigation" : "Open workspace navigation"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((open) => !open)}
        >
          {drawerOpen ? "×" : "☰"}
        </button>
        <Link href={base} className={styles.brand}>
          <span className={styles.brandMark}>M</span>
          <span>MatterZero</span>
        </Link>
        <span className={styles.mobileActive}>{active?.label ?? "Workspace"}</span>
        <WorkspaceContextMenu
          workspace={workspace}
          workspaces={workspaces}
          email={email}
          role={role}
          isSample={pathname.endsWith("/sample")}
        />
      </header>

      {drawerOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close workspace navigation"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href={base} className={styles.brand} aria-label="MatterZero workspace overview">
            <span className={styles.brandMark}>M</span>
            <span>MatterZero</span>
          </Link>
        </div>

        <p className={styles.navLabel}>WORKFLOWS</p>
        <nav className={styles.navigation} aria-label="Workspace navigation">
          {navigation.map((item) => {
            const href = `${base}${item.suffix}`;
            const selected = item.suffix
              ? pathname === href || pathname.startsWith(`${href}/`)
              : pathname === base;
            return (
              <Link
                key={item.label}
                href={href}
                className={selected ? styles.navActive : styles.navLink}
                aria-current={selected ? "page" : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.sidebarNote}>Pilot workspace · no live case data yet</span>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <div className={styles.contextBreadcrumbs}>
            <Link href={base}>MatterZero</Link>
            <span className={styles.separator}>/</span>
            <strong>{workspace.name}</strong>
            {pathname.endsWith("/sample") ? (
              <>
                <span className={styles.separator}>/</span>
                <span className={styles.sampleContext}>Ria Sen · fictional sample</span>
              </>
            ) : null}
          </div>
          <WorkspaceContextMenu
            workspace={workspace}
            workspaces={workspaces}
            email={email}
            role={role}
            isSample={pathname.endsWith("/sample")}
          />
        </header>
        <main id="main-content" className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
