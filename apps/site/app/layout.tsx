import type { Metadata, Viewport } from "next";
import "@matterzero/design-tokens/theme.css";
import "./globals.css";
import { SiteFooter } from "@/features/shell/site-footer";
import { SiteHeader } from "@/features/shell/site-header";
import { JsonLd } from "@/features/seo/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MatterZero | Applicant readiness for immigration teams",
    template: "%s | MatterZero",
  },
  description:
    "Move immigration files from first conversation to human review with multilingual intake, document follow-up, and source-linked case context.",
  applicationName: "MatterZero",
  openGraph: {
    type: "website",
    siteName: "MatterZero",
    title: "MatterZero | Applicant readiness for immigration teams",
    description: "A clearer path from applicant intake to a case your team can review.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatterZero",
    description: "Applicant readiness for immigration teams.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = { themeColor: "#f8f7f2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MatterZero",
    url: siteUrl,
    description: "Applicant readiness workflows for immigration teams.",
    founder: {
      "@type": "Person",
      name: "Ankan Ganguly",
      sameAs: "https://www.linkedin.com/in/ankanganguly/",
    },
  };

  return (
    <html lang="en">
      <body>
        <JsonLd data={organization} />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
