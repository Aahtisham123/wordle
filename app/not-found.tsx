import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found · Wordle Unlimited" },
  description: "That page is not on the Wordle Unlimited site.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="site-container py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">404</p>
      <h1 className="display mt-3 text-4xl font-semibold">That page is not on the board</h1>
      <p className="mt-3 max-w-lg text-muted">The link may be mistyped. You can go home or start a puzzle.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">Home</Link>
        <Link href="/wordle-unlimited" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">Play</Link>
      </div>
    </section>
  );
}
