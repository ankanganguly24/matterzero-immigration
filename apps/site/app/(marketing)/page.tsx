import type { Metadata } from "next";
import { ButtonLink, Container, SectionHeading } from "@matterzero/ui";
import { HomePage } from "@/features/home/home-page";
import { homeFaqs } from "@/features/home/home-content";
import { JsonLd } from "@/features/seo/json-ld";

export const metadata: Metadata = {
  title: "One clear case record for immigration teams",
  description:
    "Keep immigration case details traceable across intake and documents. Surface gaps and conflicts for staff review with a focused, one-workflow pilot.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />
      <HomePage ButtonLink={ButtonLink} Container={Container} SectionHeading={SectionHeading} />
    </>
  );
}
