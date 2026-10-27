"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./workspace-shell.module.css";

const navigation = [
  { suffix: "", label: "Matter overview", icon: "▦" },
  { suffix: "/matters", label: "Matters", icon: "▤" },
  { suffix: "/collector", label: "Collector", icon: "⇣" },
  { suffix: "/chronology", label: "Chronology", icon: "◷" },
  { suffix: "/review", label: "Review queue", icon: "✓" },
];

export type WorkspaceSummary = {
  id: string;
  name: string;
  organizationType: string;
  market: string;
  teamSize: string;
  primaryFocus: string;
};

function initials(email: string) {
  return email.split("@")[0]?.slice(0, 2).toUpperCase() || "MZ";
}

export function WorkspaceShell({
  workspace,
  email,
  children,
}: {
  workspace: WorkspaceSummary;
  email: string;
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
          <Link className={styles.workspaceSelect} href="/dashboard" title="Switch workspace">
            <small>WORKSPACE</small>
            <strong>{workspace.name}</strong>
            <span aria-hidden="true">⌄</span>
          </Link>
        </div>

        <p className={styles.navLabel}>OPERATIONS</p>
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
          <div className={styles.identity}>
            <span className={styles.avatar}>{initials(email)}</span>
            <span className={styles.identityText}>
              <strong>{email.split("@")[0]?.replace(/[._-]+/g, " ") || "Team member"}</strong>
              <small>{email}</small>
            </span>
          </div>
          <form action="/auth/signout" method="post">
            <button className={styles.signOut} type="submit">
              <span aria-hidden="true">↪</span> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.topbar}>
          <div>
            <span className={styles.breadcrumb}>Workspace</span>
            <span className={styles.separator}>/</span>
            <strong>{workspace.name}</strong>
          </div>
          <span className={styles.accessBadge}>
            <i /> Private workspace
          </span>
        </header>
        <main id="main-content" className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
