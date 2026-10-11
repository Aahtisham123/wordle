import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const GROUPS = [
  {
    title: "Play",
    links: [
      ["Play Wordle", "/wordle-unlimited"],
      ["Daily puzzle", "/wordle-unlimited?mode=daily"],
      ["Practice", "/wordle-unlimited?mode=practice"],
      ["Custom word", "/wordle-unlimited?mode=custom"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["How to play", "/how-to-play"],
      ["Tips and tricks", "/wordle-tips"],
      ["About", "/about-us"],
    ],
  },
  {
    title: "Information",
    links: [
      ["Contact", "/contact-us"],
      ["Privacy policy", "/privacy-policy"],
      ["Terms and conditions", "/terms-and-conditions"],
      ["DMCA", "/dmca"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line)]">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Unlimited word puzzles with adjustable length, difficulty, hints, and friend challenges. Saved statistics stay on this device.
          </p>
        </div>
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--line)]">
        <p className="site-container py-4 text-xs leading-5 text-muted">
          Wordle Unlimited is an independent puzzle game and is not affiliated with The New York Times.
        </p>
      </div>
    </footer>
  );
}
