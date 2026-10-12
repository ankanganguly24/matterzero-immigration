export const currentCapabilities = [
  {
    title: "Pilot requests and invitations",
    status: "Available",
    detail:
      "Request a pilot, receive an invitation after approval, and sign in. An invitation does not yet open an applicant workspace.",
    responsibility: "Ankan reviews requests and discusses fit with the team.",
  },
  {
    title: "Workflow and pilot scoping",
    status: "Discussed with your team",
    detail:
      "Choose one workflow and agree how information would enter and leave MatterZero. This is a conversation, not an automated onboarding service.",
    responsibility:
      "Your team explains its current process; we agree responsibilities before starting.",
  },
  {
    title: "Applicant intake and document uploads",
    status: "Planned",
    detail:
      "The case workspace, intake forms, uploads, and document checklist are not available yet. No voice intake or language support is currently released.",
    responsibility: "Continue using your existing intake and document process.",
  },
  {
    title: "Source comparison and review queues",
    status: "Planned",
    detail:
      "Linking facts to document pages or intake answers, flagging disagreements, and recording reviewer decisions are product designs under development.",
    responsibility: "Counsellors and authorized professionals remain responsible for review.",
  },
  {
    title: "Reminders and channel connections",
    status: "Planned",
    detail:
      "MatterZero does not currently send applicant reminders or sync WhatsApp, email, or a CRM. Channels and supported languages must be agreed and demonstrated before use.",
    responsibility: "Your team continues sending follow-ups through its existing channels.",
  },
  {
    title: "Readiness, ownership, and handoff",
    status: "Planned",
    detail:
      "Case readiness, task owners, overdue work, workload views, and export/import are not released. Tracking after file preparation is outside the current proposed scope.",
    responsibility:
      "Agree an export and exit arrangement before starting a pilot; no export feature is promised today.",
  },
] as const;

export const sampleWorkflow = [
  {
    title: "Capture the starting information",
    situation:
      "A fictional student applicant has supplied an intake answer and an academic transcript through the consultancy’s existing process.",
    action:
      "The proposed case record would keep each fact linked to the answer or document it came from. Staff would confirm uncertain details.",
  },
  {
    title: "Follow a team-approved checklist",
    situation:
      "For this example, the team wants an academic transcript and an offer letter. The offer letter has not arrived.",
    action:
      "The proposed checklist would show the transcript as received and the offer letter as missing. Received would stay separate from reviewed.",
  },
  {
    title: "Ask for a clearer copy",
    situation: "The transcript image is too blurred to read the completion date reliably.",
    action:
      "A counsellor would mark it as needing a clearer copy and send a follow-up through the team’s agreed channel. Automated reminders are planned.",
  },
  {
    title: "Resolve a conflicting detail",
    situation:
      "The intake answer says the course ended in June; the replacement transcript says July.",
    action:
      "The proposed review queue would retain both sources. A counsellor would confirm the date and record the reason for the accepted value.",
  },
  {
    title: "Review the handoff",
    situation: "The clearer transcript is reviewed, but the offer letter is still missing.",
    action:
      "The proposed readiness view would explain what is outstanding, who owns the next step, and why the file is not ready for professional review.",
  },
] as const;
