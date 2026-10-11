import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function GradientButton({
  href,
  children,
  className,
  onClick,
  type = "button",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classNames = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_var(--glow)] transition hover:-translate-y-0.5",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classNames}>
      {children}
    </button>
  );
}
