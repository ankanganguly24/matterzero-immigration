"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const navigation = [
  { href: "/admin", label: "Overview", marker: "O" },
  { href: "/admin/pilot", label: "Pilot", marker: "P" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ adminEmail, children }: { adminEmail: string; children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activePage = navigation.find((item) => isActive(pathname, item.href))?.label ?? "Admin";
  const displayName =
    adminEmail
      .split("@")[0]
      ?.replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Admin";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.dashboard}>
      <header className={styles.mobileBar}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={drawerOpen ? "Close admin navigation" : "Open admin navigation"}
          aria-expanded={drawerOpen}
          aria-controls="admin-sidebar"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span aria-hidden="true">{drawerOpen ? "×" : "☰"}</span>
        </button>
        <Link href="/admin" className={styles.mobileBrand} aria-label="MatterZero admin overview">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-word">
            matter<span>zero</span>
          </span>
        </Link>
        <span className={styles.mobilePage}>{activePage}</span>
        <span className={styles.mobileAvatar} aria-hidden="true">
          {initials}
        </span>
      </header>

      {drawerOpen ? (
        <button
          type="button"
          className={styles.drawerBackdrop}
          aria-label="Close admin navigation"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside
        id="admin-sidebar"
        className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}
        aria-label="Admin workspace"
      >
        <div className={styles.adminBrand}>
          <div className={styles.brandHeader}>
            <Link
              href="/admin"
              className={styles.brandLockup}
              onClick={() => setDrawerOpen(false)}
              aria-label="MatterZero admin overview"
            >
              <span className="brand-mark" aria-hidden="true">
                <span />
              </span>
              <span className="brand-word">
                matter<span>zero</span>
              </span>
            </Link>
            <button
              type="button"
              className={styles.drawerCloseButton}
              aria-label="Close admin navigation"
              onClick={() => setDrawerOpen(false)}
            >
              ×
            </button>
          </div>
          <span className={styles.workspaceLabel}>ADMIN WORKSPACE</span>
        </div>

        <div className={styles.navSection}>
          <p className={styles.navCaption}>WORKSPACE</p>
          <nav aria-label="Admin navigation" className={styles.adminNav}>
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.navLinkActive : styles.navLink}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className={styles.navMarker} aria-hidden="true">
                    {item.marker}
                  </span>
                  {item.label}
                  {active ? <span className={styles.activeIndicator} aria-hidden="true" /> : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminIdentity}>
              <span className={styles.adminAvatar} aria-hidden="true">
                {initials}
              </span>
            <span className={styles.adminDetails}>
              <span className={styles.adminName}>{displayName}</span>
              <span className={styles.adminEmail} title={adminEmail}>
                {adminEmail}
              </span>
            </span>
          </div>
          <form action="/auth/signout" method="post" className={styles.signout}>
            <button type="submit" className={styles.signoutButton}>
              <span aria-hidden="true">↪</span> Sign out
            </button>
          </form>
        </div>
      </aside>

      <main id="main-content" className={styles.dashboardContent}>
        <div className={styles.contentInner}>{children}</div>
      </main>
    </div>
  );
}
