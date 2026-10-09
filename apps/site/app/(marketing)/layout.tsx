import type { ReactNode } from "react";
import { SiteFooter } from "@/features/shell/site-footer";
import { SiteHeader } from "@/features/shell/site-header";
import { JsonLd } from "@/features/seo/json-ld";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
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
        }}
      />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
