import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { LandingPage } from "@/components/landing/landing-page";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  breadcrumbJsonLd,
  createMetadata,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <LandingPage />
    </>
  );
}
