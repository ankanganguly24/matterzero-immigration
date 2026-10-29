"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkspaceContextMenu } from "./workspace-context-menu";
import { WorkspaceMatterContext } from "./workspace-matter-context";
import { WorkspaceIcon } from "./workspace-icon";
import styles from "./workspace-shell.module.css";

const navigation = [
  { suffix: "", label: "Overview", icon: "overview" },
  { suffix: "/matters", label: "Matters", icon: "matters" },
] as const;

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
  const isSampleRoute = pathname === `${base}/sample` || pathname.startsWith(`${base}/sample/`);
  const [sampleOverride, setSampleOverride] = useState<{
    pathname: string;
    included: boolean;
  } | null>(null);
  const sampleDataIncluded = isSampleRoute
    ? sampleOverride?.pathname === pathname
      ? sampleOverride.included
      : true
    : false;
  const setSampleDataIncluded = (included: boolean) => {
    setSampleOverride({ pathname, included });
  };
  const showFictionalContext = isSampleRoute && sampleDataIncluded;
  const isNavigationActive = (suffix: string) =>
    suffix
      ? pathname === `${base}${suffix}` || pathname.startsWith(`${base}${suffix}/`)
      : pathname === base || isSampleRoute;
  const active = navigation.find((item) => isNavigationActive(item.suffix));
  const mobileActiveLabel = pathname.startsWith(`${base}/settings`)
    ? "Settings"
    : (active?.label ?? "Workspace");

  return (
    <WorkspaceMatterContext.Provider value={{ sampleDataIncluded, setSampleDataIncluded }}>
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
            <span className={styles.brandMark}>
              <WorkspaceIcon name="overview" size={14} />
            </span>
            <span>MatterZero</span>
          </Link>
          {isSampleRoute ? (
            <span className={styles.mobileSampleBadge}>
              {showFictionalContext ? "Fictional Sample Context" : "Live Workspace · Empty Matter"}
            </span>
          ) : (
            <span className={styles.mobileActive}>{mobileActiveLabel}</span>
          )}
          <WorkspaceContextMenu
            workspace={workspace}
            workspaces={workspaces}
            email={email}
            role={role}
            isSample={showFictionalContext}
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
              <span className={styles.brandMark}>
                <WorkspaceIcon name="overview" size={15} />
              </span>
              <span>MatterZero</span>
            </Link>
          </div>

          <p className={styles.navLabel}>WORKSPACE</p>
          <nav className={styles.navigation} aria-label="Workspace navigation">
            {navigation.map((item) => {
              const href = `${base}${item.suffix}`;
              const selected = isNavigationActive(item.suffix);
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={selected ? styles.navActive : styles.navLink}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className={styles.navIcon}>
                    <WorkspaceIcon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <span className={styles.sidebarNote}>Matter records are scoped to this workspace</span>
          </div>
        </aside>

        <div className={styles.mainColumn}>
          <header className={styles.topbar}>
            <div className={styles.contextBreadcrumbs}>
              <Link href={base}>Workspace</Link>
              <span className={styles.separator}>/</span>
              <strong>{workspace.name}</strong>
              {isSampleRoute ? (
                <>
                  <span className={styles.separator}>/</span>
                  <span className={styles.sampleContext}>
                    {showFictionalContext ? "Pevatron (O-1A)" : "Empty Matter"}
                  </span>
                  <span className={styles.sampleBadge}>
                    {showFictionalContext
                      ? "Fictional Sample Context"
                      : "Live Workspace · Empty Matter"}
                  </span>
                </>
              ) : null}
            </div>
            <WorkspaceContextMenu
              workspace={workspace}
              workspaces={workspaces}
              email={email}
              role={role}
              isSample={showFictionalContext}
            />
          </header>
          <main id="main-content" className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </WorkspaceMatterContext.Provider>
  );
}
