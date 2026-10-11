import type { Metadata } from "next";
import { BenefitsBar } from "@/components/home/BenefitsBar";
import { BenefitsStories } from "@/components/home/BenefitsStories";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { FinalCTA } from "@/components/home/FinalCTA";
import { GameModesPreview } from "@/components/home/GameModesPreview";
import { HeroSection } from "@/components/home/HeroSection";
import { HomepageContent } from "@/components/home/HomepageContent";
import { HowToPlay } from "@/components/home/HowToPlay";
import { InteractiveDemo } from "@/components/home/InteractiveDemo";
import { WhyPlay } from "@/components/home/WhyPlay";
import { StructuredData } from "@/components/seo/StructuredData";
import { faqSchema, schemaGraph, videoGameSchema, webPageSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};

const schema = schemaGraph([
  webPageSchema({
    name: siteConfig.title,
    description: siteConfig.description,
    path: "/",
  }),
  videoGameSchema(),
  faqSchema(),
]);

export default function HomePage() {
  return (
    <>
      <StructuredData data={schema} />
      <HeroSection />
      <BenefitsBar />
      <HomepageContent />
      <FeaturesGrid />
      <HowToPlay />
      <GameModesPreview />
      <InteractiveDemo />
      <WhyPlay />
      <BenefitsStories />
      <FAQAccordion />
      <FinalCTA />
    </>
  );
}
