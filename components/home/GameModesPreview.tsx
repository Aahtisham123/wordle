import { Leaf, Scale, Flame } from "lucide-react";
import { GradientButton } from "@/components/layout/GradientButton";
import { SectionHeading } from "@/components/layout/SectionHeading";

const MODES = [
  {
    icon: Leaf,
    title: "Easy Mode",
    text: "A relaxed round with eight guesses, up to three hints, and more common words.",
    href: "/wordle-unlimited?difficulty=easy",
    cta: "Play easy",
  },
  {
    icon: Scale,
    title: "Medium Mode",
    text: "Six guesses, two hints, and the standard word list for a regular puzzle.",
    href: "/wordle-unlimited?difficulty=medium",
    cta: "Play medium",
  },
  {
    icon: Flame,
    title: "Hard Mode",
    text: "Harder words, one optional hint, and a rule that later guesses must use every clue.",
    href: "/wordle-unlimited?difficulty=hard",
    cta: "Play hard",
  },
];

export function GameModesPreview() {
  return (
    <section className="site-container py-8">
      <SectionHeading
        eyebrow="Modes"
        title="Pick the pressure you want in the Wordle Unlimited Game"
        text="Opening a mode starts the game with that difficulty already selected."
      />
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {MODES.map((mode) => (
          <li key={mode.title} className="glass flex flex-col rounded-3xl p-6">
            <mode.icon className="text-accent" aria-hidden="true" />
            <h3 className="mt-4 display text-2xl font-semibold">{mode.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted">{mode.text}</p>
            <GradientButton href={mode.href} className="mt-6 w-fit">
              {mode.cta}
            </GradientButton>
          </li>
        ))}
      </ul>
    </section>
  );
}
