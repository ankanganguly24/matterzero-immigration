import "server-only";
import { createHash } from "node:crypto";
import { demoMatter, sources, timeline } from "@/features/evidence-workspace/demo-fixture";

export const DEMO_MATTER_ID = demoMatter.id;

export function getDemoMatterVersionHash() {
  return createHash("sha256")
    .update(JSON.stringify({ matter: demoMatter, sources, timeline }))
    .digest("hex");
}

export function getDemoMatterExport() {
  return {
    matterId: DEMO_MATTER_ID,
    title: demoMatter.title,
    applicant: demoMatter.applicant,
    versionHash: getDemoMatterVersionHash(),
    note: "Fictional product demonstration data. Not a legal filing.",
    chronology: timeline.map((event) => ({
      event: event.title,
      eventDate: event.date,
      reviewStatus: event.status,
      citations: event.citations.map((citation) => ({
        source: sources[citation.source].title,
        quote: citation.quote,
        location: citation.location,
      })),
    })),
  };
}
