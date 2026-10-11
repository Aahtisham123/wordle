import Image from "next/image";

export function HeroGameVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -left-3 top-8 float-slow rounded-2xl bg-[var(--tile-correct)] px-3 py-2 text-sm font-bold text-[var(--tile-correct-text)] shadow-lg" aria-hidden="true">
        A
      </div>
      <div className="absolute -right-2 top-16 float-delayed rounded-2xl bg-[var(--tile-present)] px-3 py-2 text-sm font-bold text-[var(--tile-present-text)] shadow-lg" aria-hidden="true">
        R
      </div>
      <div className="absolute bottom-10 -left-2 float-delayed rounded-2xl bg-accent px-3 py-2 text-sm font-bold text-white shadow-lg" aria-hidden="true">
        E
      </div>
      <div className="glass gradient-border overflow-hidden rounded-[2rem] p-3">
        <Image
          src="/wordle-unlimited.webp"
          alt="Wordle Unlimited"
          title="Wordle Unlimited"
          width={1280}
          height={720}
          priority
          className="h-auto w-full rounded-[1.4rem]"
        />
      </div>
    </div>
  );
}
