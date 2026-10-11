import Link from "next/link";
import { HeroGameVisual } from "@/components/home/HeroGameVisual";
import { GradientButton } from "@/components/layout/GradientButton";

export function HeroSection() {
  return (
    <section className="site-container grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
      <div>
        <p className="inline-flex rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-sm text-muted">
          Unlimited Word Puzzle Fun
        </p>
        <h1 className="display mt-5 text-4xl font-semibold text-balance sm:text-6xl">
          Wordle Unlimited — Play Word Games Without Limits
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
          <Link href="/" className="font-semibold text-accent">Wordle Unlimited</Link> lets you jump into fresh word puzzles the moment you finish one. You type a guess, watch the tiles turn green, yellow, or gray, and use those clues to zero in on the hidden word. A new challenge loads instantly, so you decide when the session ends. This open format turns a short daily habit into something you can enjoy for as long as you like.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <GradientButton href="/wordle-unlimited">Play Wordle Now</GradientButton>
          <Link
            href="/how-to-play"
            className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--line)] px-5 text-sm font-semibold"
          >
            How to Play
          </Link>
        </div>
      </div>
      <HeroGameVisual />
    </section>
  );
}
