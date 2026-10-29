import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  overview: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  matters: (
    <>
      <path d="M7 4.5h8l3 3V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V6a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M15 4.5V8h3M9 12h6M9 15.5h6" />
    </>
  ),
  ingestion: (
    <>
      <path d="M12 15V3.5M7.5 8 12 3.5 16.5 8" />
      <path d="M4 14.5v3A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-3" />
    </>
  ),
  settings: (
    <>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path
        d="m19.4 13.5 1.1.8-1.4 2.4-1.3-.5a7 7 0 0 1-1.4.8l-.2 1.4h-2.8l-.3-1.4a7 7 0 0 1-1.4-.8l-1.3.5-1.4-2.4 1.1-.8a7 7 0 0 1 0-1.6l-1.1-.8 1.4-2.4 1.3.5a7 7 0 0 1 1.4-.8l.3-1.4h2.8l.2 1.4a7 7 0 0 1 1.4.8l1.3-.5 1.4 2.4-1.1.8a7 7 0 0 1 0 1.6Z"
        transform="translate(-1 -1)"
      />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  file: (
    <>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M14 3.5V8h4M9 12h6M9 15.5h4" />
    </>
  ),
};

export function WorkspaceIcon({ name, size = 18 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
