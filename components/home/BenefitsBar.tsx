import { Infinity, Hash, Gauge, Share2, BadgeCheck } from "lucide-react";

const BENEFITS = [
  { icon: Infinity, title: "Unlimited Puzzles", text: "Start another round as soon as you finish." },
  { icon: Hash, title: "3–10 Letter Words", text: "The board resizes for short or long answers." },
  { icon: Gauge, title: "Multiple Difficulty Levels", text: "Easy, medium, and hard change real rules." },
  { icon: Share2, title: "Custom Word Challenges", text: "Send a link without putting the answer in it." },
  { icon: BadgeCheck, title: "Free to Play", text: "No account and no payment required." },
];

export function BenefitsBar() {
  return (
    <section className="site-container" aria-label="Highlights">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="glass rounded-3xl p-4">
            <benefit.icon className="text-accent" size={20} aria-hidden="true" />
            <h2 className="mt-3 text-sm font-semibold">{benefit.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{benefit.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
