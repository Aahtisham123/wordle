import { GameTile } from "@/components/game/GameTile";
import { GradientButton } from "@/components/layout/GradientButton";
import { SectionHeading } from "@/components/layout/SectionHeading";

const STEPS = [
  {
    title: "Choose your desired word length.",
    text: "Start at five letters, or switch to anything from three to ten.",
    tiles: [
      { letter: "W", mark: null },
      { letter: "O", mark: null },
      { letter: "R", mark: null },
      { letter: "D", mark: null },
      { letter: "S", mark: null },
    ],
  },
  {
    title: "Type a valid word to make a guess.",
    text: "The guess has to be in the dictionary for that language, unless you are solving a custom word.",
    tiles: [
      { letter: "C", mark: null },
      { letter: "R", mark: null },
      { letter: "A", mark: null },
      { letter: "N", mark: null },
      { letter: "E", mark: null },
    ],
  },
  {
    title: "Observe the tile colors for clues.",
    text: "Green is the right spot, yellow is in the word elsewhere, and gray is not available.",
    tiles: [
      { letter: "C", mark: "correct" as const },
      { letter: "R", mark: "present" as const },
      { letter: "A", mark: "absent" as const },
      { letter: "N", mark: "present" as const },
      { letter: "E", mark: "correct" as const },
    ],
  },
  {
    title: "Solve the word and start another challenge.",
    text: "A finished puzzle can be shared, saved in your stats, or replaced immediately.",
    tiles: [
      { letter: "C", mark: "correct" as const },
      { letter: "R", mark: "correct" as const },
      { letter: "E", mark: "correct" as const },
      { letter: "S", mark: "correct" as const },
      { letter: "T", mark: "correct" as const },
    ],
  },
];

export function HowToPlay() {
  return (
    <section className="site-container py-16">
      <SectionHeading
        eyebrow="How to play"
        title="Four steps to a solved board"
        text="The colors are paired with symbols, so the clue is not carried by color alone."
      />
      <ol className="mt-10 grid gap-4 md:grid-cols-2">
        {STEPS.map((step, index) => (
          <li key={step.title} className="glass rounded-3xl p-5">
            <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
            <h3 className="mt-2 display text-2xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
            <div className="mt-4 grid max-w-xs grid-cols-5 gap-1.5">
              {step.tiles.map((tile, tileIndex) => (
                <GameTile key={tileIndex} letter={tile.letter} mark={tile.mark} small />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex justify-center">
        <GradientButton href="/wordle-unlimited">Play Wordle Now</GradientButton>
      </div>
    </section>
  );
}
