import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";

const POINTS = [
  "Change the length when a five-letter puzzle starts to feel familiar.",
  "Use practice mode when you want the clues without touching your streak.",
  "Turn on high contrast or colorblind patterns if the default tiles are hard to tell apart.",
  "Share a result grid that shows the path, not the answer.",
];

export function WhyPlay() {
  return (
    <section className="site-container grid items-center gap-8 py-8 lg:grid-cols-2">
      <div>
        <SectionHeading
          align="left"
          eyebrow="Why play here"
          title="A Wordle Unlimited Game board you can shape, then play again"
          text="The point of the Wordle Unlimited Game is a clean puzzle you can repeat, tighten, or hand to a friend. The extra settings are there when you want them and stay out of the way when you do not."
        />
        <ul className="mt-6 grid gap-3">
          {POINTS.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-6 text-muted">
              <Check className="mt-0.5 shrink-0 text-accent" size={18} aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-6 text-muted">
          New to the feedback colors? Read <Link className="font-semibold text-accent" href="/how-to-play">how to play</Link> or skim the <Link className="font-semibold text-accent" href="/wordle-tips">strategy notes</Link>.
        </p>
      </div>
      <div className="glass rounded-[2rem] p-6" aria-hidden="true">
        <div className="grid grid-cols-5 gap-2">
          {["S", "T", "A", "R", "E"].map((letter) => (
            <div key={letter} className="tile tile-filled text-lg">{letter}</div>
          ))}
          {["C", "R", "A", "N", "E"].map((letter, index) => (
            <div key={letter} className={`tile text-lg ${index === 2 || index === 4 ? "tile-correct" : index === 1 ? "tile-present" : "tile-absent"}`}>{letter}</div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">A sample board: green locks a position, yellow asks you to move the letter, and gray takes it off the keyboard.</p>
      </div>
    </section>
  );
}
