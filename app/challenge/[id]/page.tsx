import type { Metadata } from "next";
import { Suspense } from "react";
import { GameLauncher } from "@/components/game/GameLauncher";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({
    title: "Wordle Unlimited challenge",
    description: "A private word puzzle challenge.",
    path: `/challenge/${id}`,
    index: false,
  });
}

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="site-container py-20 text-center">Loading the challenge…</p>}>
      <ChallengeLoader params={params} />
    </Suspense>
  );
}

async function ChallengeLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1 className="site-container pt-6 text-2xl font-semibold">Wordle Unlimited challenge</h1>
      <GameLauncher challengeId={id} />
    </>
  );
}
