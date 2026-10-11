import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  id,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="display text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </h2>
      {text ? <p className="mt-3 text-base leading-7 text-muted sm:text-lg">{text}</p> : null}
    </div>
  );
}
