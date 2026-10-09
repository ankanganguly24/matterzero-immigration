import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@matterzero/design-tokens/theme.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const sans = localFont({
  src: "../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-sans",
  weight: "100 1000",
});
const heading = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-heading",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MatterZero | One clear case record for immigration teams",
    template: "%s | MatterZero",
  },
  description:
    "Keep immigration case details traceable across intake and documents. Surface gaps and conflicts for staff review.",
  applicationName: "MatterZero",
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "MatterZero",
    title: "One clear case record for immigration teams | MatterZero",
    description:
      "Keep applicant details traceable across intake and documents, with gaps and conflicts surfaced for staff review.",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Less chasing. Clearer case files. Applicant readiness for immigration teams.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One clear case record | MatterZero",
    description: "Source-linked case details and clear review steps for immigration teams.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = { themeColor: "#f8f7f2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${heading.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
