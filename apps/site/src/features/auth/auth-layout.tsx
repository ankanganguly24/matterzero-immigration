import type { ReactNode } from "react";
import styles from "./auth.module.css";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.content}>{children}</div>
      <p className={styles.legal}>
        MatterZero organizes information for professional review. It does not provide legal advice.
      </p>
    </main>
  );
}
