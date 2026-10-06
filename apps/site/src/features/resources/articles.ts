export type Article = {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  author: { name: string; role: string; url: string; bio: string };
};

const author = {
  name: "Ankan Ganguly",
  role: "Building MatterZero",
  url: "https://www.linkedin.com/in/ankanganguly/",
  bio: "Ankan is building MatterZero, a workflow product for immigration teams. He writes about applicant intake, document operations, and human-led case review.",
};

export const articles: Article[] = [
  {
    slug: "organize-before-o1a-consultation",
    shortTitle: "O-1A evidence prep",
    title: "Before an O-1A consultation, organize the evidence story",
    description:
      "A practical way to gather work history and source material before a conversation with immigration counsel—without trying to decide the legal case yourself.",
    category: "Case preparation",
    readTime: "6 min read",
    date: "2026-10-06",
    author,
  },
  {
    slug: "document-requests-applicants-can-follow",
    shortTitle: "Document requests",
    title: "Write document requests applicants can actually follow",
    description:
      "Make each request specific, easy to answer, and easy for your team to track across email, calls, and messaging.",
    category: "Team operations",
    readTime: "5 min read",
    date: "2026-10-06",
    author,
  },
  {
    slug: "build-a-clear-employment-timeline",
    shortTitle: "Employment timeline",
    title: "Build a clear employment timeline from mixed records",
    description:
      "A simple review method for comparing an applicant’s account, CV, and employer documents while preserving where each date came from.",
    category: "Evidence organization",
    readTime: "5 min read",
    date: "2026-10-06",
    author,
  },
];
