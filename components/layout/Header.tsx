"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { GradientButton } from "@/components/layout/GradientButton";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/wordle-unlimited", label: "Play Wordle" },
  { href: "/how-to-play", label: "How to Play" },
  { href: "/#features", label: "Features" },
  { href: "/wordle-tips", label: "Tips & Tricks" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--background)_78%,transparent)] backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((link) => {
            const active = link.href === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm text-muted hover:bg-white/10 hover:text-foreground",
                  active && "bg-white/10 text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <GradientButton href="/wordle-unlimited" className="hidden h-11 px-4 sm:inline-flex">
            Play Now
          </GradientButton>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="site-container grid gap-1 pb-4 lg:hidden" aria-label="Mobile">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl px-3 py-3 text-sm hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <GradientButton href="/wordle-unlimited" className="mt-2 sm:hidden">
            Play Now
          </GradientButton>
        </nav>
      ) : null}
    </header>
  );
}
