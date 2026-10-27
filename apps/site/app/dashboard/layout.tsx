import type { ReactNode } from "react";
import styles from "@/features/evidence-workspace/workspace.module.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className={styles.dashboardFrame}>{children}</div>;
}
