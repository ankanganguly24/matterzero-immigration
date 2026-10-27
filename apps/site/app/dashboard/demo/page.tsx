import type { Metadata } from "next";
import { EvidenceWorkspace } from "@/features/evidence-workspace/evidence-workspace";
import { getDemoMatterVersionHash } from "@/lib/demo/matter";
import styles from "@/features/evidence-workspace/workspace.module.css";

export const metadata: Metadata = {
  title: "Evidence workspace demo",
  robots: { index: false, follow: false },
};

export default function DemoWorkspacePage() {
  const versionHash = getDemoMatterVersionHash();

  return (
    <main id="main-content" className={styles.workspaceMain}>
      <EvidenceWorkspace versionHash={versionHash} />
    </main>
  );
}
