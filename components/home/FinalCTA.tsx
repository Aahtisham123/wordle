import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="site-container py-8">
      <div className="cta-panel overflow-hidden rounded-[2rem] px-6 py-12 text-white sm:px-12">
        <h2 className="display text-4xl font-semibold text-balance">Ready to Test Your Word Skills?</h2>
        <p className="mt-3 max-w-xl text-lg text-white/90">
          Choose your challenge, sharpen your vocabulary, and enjoy unlimited word puzzles.
        </p>
        <Link href="/wordle-unlimited" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950">
          Start Playing Now
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
