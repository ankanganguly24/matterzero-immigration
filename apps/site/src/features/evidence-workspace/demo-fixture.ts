export type SourceId = "intake" | "invitation" | "employer-letter";

export type SourceCitation = {
  source: SourceId;
  quote: string;
  location: string;
  detail: string;
};

export const demoMatter = {
  id: "demo-matter-2048",
  title: "Research profile preparation",
  applicant: "Ria Sen",
  caseType: "Illustrative extraordinary ability matter",
} as const;

export const sources: Record<
  SourceId,
  { title: string; kind: string; date: string; page: string }
> = {
  intake: {
    title: "Client intake notes",
    kind: "Intake · v1",
    date: "Received 12 May 2026",
    page: "Page 2",
  },
  invitation: {
    title: "Conference invitation",
    kind: "PDF · v1",
    date: "Received 14 May 2026",
    page: "Page 1",
  },
  "employer-letter": {
    title: "Employer confirmation",
    kind: "PDF · v1",
    date: "Received 15 May 2026",
    page: "Page 1",
  },
};

export const timeline: {
  id: string;
  date: string;
  title: string;
  status: string;
  citations: SourceCitation[];
}[] = [
  {
    id: "event-date",
    date: "May–June 2024",
    title: "Invited to present at a research conference",
    status: "Conflicting dates",
    citations: [
      {
        source: "intake",
        quote: "I presented the work at the annual research meeting in May 2024.",
        location: "Page 2 · paragraph 4",
        detail: "The applicant's intake statement places the presentation in May 2024.",
      },
      {
        source: "invitation",
        quote: "The annual research meeting will take place on 14 June 2024.",
        location: "Page 1 · paragraph 2",
        detail:
          "The invitation gives 14 June 2024. The date differs from the intake statement and remains unresolved.",
      },
    ],
  },
  {
    id: "role-start",
    date: "August 2021",
    title: "Started a research role",
    status: "Source linked",
    citations: [
      {
        source: "employer-letter",
        quote: "Ria Sen joined the Applied Research group in August 2021.",
        location: "Page 1 · employment history",
        detail:
          "The employer letter identifies the role and start month. This is a source statement, not a legal finding.",
      },
    ],
  },
  {
    id: "project-launch",
    date: "March 2023",
    title: "Research project released",
    status: "Needs review",
    citations: [
      {
        source: "employer-letter",
        quote: "The project was made available to customers in March 2023.",
        location: "Page 1 · project summary",
        detail:
          "A candidate event from the employer letter. The source excerpt and event date need reviewer confirmation.",
      },
    ],
  },
];
