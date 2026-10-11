import { BadgeCheck, BookOpen, Brain, Clock, Infinity, Shuffle, Sparkles, TrendingUp, Users } from "lucide-react";
import { SectionHeading } from "@/components/layout/SectionHeading";

const BENEFITS = [
  { icon: Brain, text: "Sharpens step-by-step reasoning as you eliminate wrong letters with each guess." },
  { icon: BookOpen, text: "Grows everyday vocabulary through steady contact with common words." },
  { icon: Clock, text: "Fits short breaks or longer free periods without forcing a fixed session length." },
  { icon: TrendingUp, text: "Builds quiet confidence when statistics show fewer guesses over time." },
  { icon: Sparkles, text: "Offers a calm screen activity that needs almost no setup." },
  { icon: Users, text: "Creates easy shared moments through custom challenges sent to others." },
  { icon: Shuffle, text: "Lets you test different starting words and see which ones work best." },
  { icon: Infinity, text: "Keeps the mind active without the pressure of a strict daily limit." },
];

const STORIES = [
  { quote: "Three extra rounds after the daily one became my favorite quick mental break.", name: "Sarah", role: "teacher" },
  { quote: "Six-letter words gave me a fresh stretch without learning any new rules.", name: "James", role: "student" },
  { quote: "Sending a custom word to my sister turned into a fun weekly ritual.", name: "Priya", role: "designer" },
  { quote: "The stats page shows clear improvement and keeps me coming back.", name: "Mark", role: "engineer" },
  { quote: "It opens instantly on my phone and works perfectly during the commute.", name: "Elena", role: "nurse" },
  { quote: "Themed categories helped me pick up food and animal words I rarely use.", name: "David", role: "writer" },
];

export function BenefitsStories() {
  return (
    <section className="site-container py-16">
      <SectionHeading title="Benefits of Playing Wordle Unlimited Game" />
      <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <li key={benefit.text} className="glass flex gap-3 rounded-2xl p-4 text-sm leading-6 text-muted">
            <benefit.icon className="mt-0.5 shrink-0 text-accent" size={18} aria-hidden="true" />
            <span>{benefit.text}</span>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="display text-3xl font-semibold text-balance sm:text-4xl">Personal and User Experience</h2>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          After finishing the official daily puzzle I often wanted a few more rounds, so I tried an unlimited version and liked how quickly a new word appeared. Switching lengths on busier days kept the sessions short and useful, and I noticed my average guesses improve after regular practice. The whole thing stayed private, light, and easy to pick up again later.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STORIES.map((story) => (
          <li key={story.name} className="glass flex flex-col rounded-3xl p-5">
            <p className="text-base leading-7">“{story.quote}”</p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <span className="font-semibold">{story.name}</span>
              <span className="text-muted">{story.role}</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                <BadgeCheck size={14} aria-hidden="true" />
                Verified
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
