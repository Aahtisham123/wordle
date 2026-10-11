"use client";

import {
  Infinity,
  CaseSensitive,
  Languages,
  Gauge,
  ChartColumn,
  Smartphone,
  SlidersHorizontal,
  Share2,
  PenLine,
  Shapes,
  LayoutGrid,
  Lightbulb,
  Maximize,
  SunMoon,
  Keyboard,
  Download,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/layout/SectionHeading";

const FEATURES = [
  {
    icon: Infinity,
    title: "Unlimited rounds",
    text: "Finish one word and the next appears immediately, so you never hit a hard stop. This setup works well for a quick extra challenge after your usual daily puzzle or for a longer stretch when you have free time. The lack of any daily quota keeps the mood easy while still giving your mind steady work.",
  },
  {
    icon: CaseSensitive,
    title: "Adjustable word lengths",
    text: "Switch between four-letter words for a fast round or longer targets when you want more to track. Shorter puzzles move quickly and feel lighter, while six- or seven-letter ones require tighter attention to every clue. You pick the length before you start, so the challenge matches the minutes you actually have.",
  },
  {
    icon: Languages,
    title: "Regional dictionaries",
    text: "Choose US English or UK English. Everyday words appear more often, and odd or rare terms show up less. The change makes rounds feel fairer and more natural if you prefer familiar vocabulary.",
  },
  {
    icon: Gauge,
    title: "Game Modes (Easy, Medium, Hard)",
    text: "Easy mode offers more guesses, more hints, and more common words so newer players can learn the logic without stress. Medium keeps the classic balance of six guesses and standard clues. Hard mode requires you to use every revealed letter in later guesses, which sharpens your reasoning over time.",
  },
  {
    icon: ChartColumn,
    title: "Statistics",
    text: "A simple panel tracks wins, average guesses, current streaks, and overall progress. Seeing the numbers shift gives a clear picture of improvement across many rounds. Stats stay in your browser, so your history stays private and ready the next time you return.",
  },
  {
    icon: Smartphone,
    title: "Mobile support",
    text: "The same clean board works smoothly on phones and tablets. Touch input replaces typing without slowing you down, and the tiles resize to stay readable on smaller screens. You can open a quick round during a break or commute without needing a computer.",
  },
  {
    icon: SlidersHorizontal,
    title: "Custom challenges",
    text: "Build a puzzle by choosing the word length, guess limit, or even the secret word itself. This turns the game into a personal practice tool or a way to set up a friendly match. Creating one takes only a few clicks and adds a creative step to the usual guessing.",
  },
  {
    icon: Share2,
    title: "Share Challenge with Friends",
    text: "After you design a custom round you get a link that others can open instantly. Everyone solves the exact same word under the same rules, which sparks easy conversation and light competition. The link works across devices so sharing stays simple.",
  },
  {
    icon: PenLine,
    title: "Make your own Words",
    text: "Type any valid word you want to use as the hidden answer and then invite someone to guess it. The color feedback system stays identical, so the solving process feels familiar. This works well for teaching new words, testing a friend’s vocabulary, or just surprising them with a clever choice.",
  },
  {
    icon: Shapes,
    title: "Select Word Categories",
    text: "Filter the possible answers by themes such as animals, food, places, or sports. A narrower list makes early guesses more informed and introduces vocabulary tied to a subject you enjoy. Themed rounds keep the logic the same while changing the flavor of each puzzle.",
  },
  {
    icon: LayoutGrid,
    title: "Multiple Game Options",
    text: "Ready-made presets combine several settings into one-click experiences. You might start a timed race, a hard-mode series, or a category round without adjusting every detail yourself. These shortcuts save time and still deliver variety during longer play.",
  },
  {
    icon: Lightbulb,
    title: "Hints Available",
    text: "When a puzzle stalls you can request a gentle assist, such as revealing one correct letter or removing a letter that is not in the word. Using a hint does not end the round, so you stay in control of how much help you take. The option helps newer players learn the deduction process without frustration.",
  },
  {
    icon: Maximize,
    title: "Fullscreen Experience",
    text: "Fullscreen expands the board to the space available on your screen. The keyboard, hints, and other controls stay within reach while the rest of the page steps aside. You can leave fullscreen at any time without losing the puzzle you are playing.",
  },
  {
    icon: SunMoon,
    title: "Light & Dark Themes",
    text: "The site follows your system theme the first time you open it. A toggle in the navigation switches between light and dark, and that choice is remembered on this device. Tile colors stay recognizable in both themes.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Controls",
    text: "Guesses can be typed on a physical keyboard or tapped on the on-screen keys. Enter submits the word and Backspace removes the last letter. Keys pick up the same green, yellow, and gray feedback as the tiles. Shortcuts stay out of the way while you are typing in a form or a dialog.",
  },
  {
    icon: Download,
    title: "Downloadable Results",
    text: "Finished games can be saved as a branded stats card. You can also export the numbers as JSON or copy a short text summary. The secret word stays out of the shared result.",
  },
];

export function FeaturesGrid() {
  const reduce = useReducedMotion();
  return (
    <section id="features" className="site-container scroll-mt-24 py-16">
      <SectionHeading
        eyebrow="Features"
        title="Features of Wordle Unlimited Game"
        text="Each part of the Wordle Unlimited Game is wired up, from hints and hard mode to sharing and saved statistics."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.li
            key={feature.title}
            className="glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-accent/50"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: reduce ? 0 : index * 0.03, duration: 0.35 }}
          >
            <feature.icon className="text-accent" aria-hidden="true" />
            <h3 className="mt-4 display text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
