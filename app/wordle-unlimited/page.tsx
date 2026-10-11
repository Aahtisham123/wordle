import { Suspense } from "react";
import { PlayerActivity } from "@/components/advanced/PlayerActivity";
import { GameLauncher } from "@/components/game/GameLauncher";
import { GameSeoContent } from "@/components/game/GameSeoContent";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { StructuredData } from "@/components/seo/StructuredData";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbGraph, schemaGraph, videoGameSchema, webPageSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: siteConfig.gameTitle,
  description: siteConfig.gameDescription,
  path: "/wordle-unlimited",
});

export default function WordleUnlimitedPage() {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Play Wordle Unlimited", href: "/wordle-unlimited" },
  ];
  return (
    <>
      <StructuredData
        data={schemaGraph([
          webPageSchema({
            name: siteConfig.gameTitle,
            description: siteConfig.gameDescription,
            path: "/wordle-unlimited",
          }),
          breadcrumbGraph(crumbs),
          videoGameSchema(),
        ])}
      />
      <section className="site-container pt-6">
        <Breadcrumbs items={crumbs} />
        <h1 className="display mt-4 text-3xl font-semibold text-balance sm:text-4xl">Play Wordle Unlimited</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Free online word puzzles with no daily limit. Choose 3–10 letters, switch difficulty, and start another round when you finish.
        </p>
      </section>
      <Suspense fallback={<p className="site-container py-20 text-center">Loading the puzzle…</p>}>
        <GameLauncher />
      </Suspense>
      <PlayerActivity />
      <GameSeoContent />
    </>
  );
}
