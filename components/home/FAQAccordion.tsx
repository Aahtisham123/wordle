"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/faq";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { cn } from "@/lib/cn";

export function FAQAccordion({ embedded = false }: { embedded?: boolean }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className={cn("site-container scroll-mt-24 py-16", embedded && "py-0")}>
      {embedded ? null : (
        <SectionHeading eyebrow="FAQ" title="Questions players actually ask" text="These answers match the way the game works today." />
      )}
      <div className={cn("grid gap-3", embedded ? "" : "mx-auto mt-8 max-w-3xl")}>
        {faqs.map((item, index) => {
          const expanded = open === index;
          const panelId = `faq-panel-${index}`;
          return (
            <div key={item.question} className="glass rounded-3xl">
              <h3>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? -1 : index)}
                >
                  <span className="font-semibold">{item.question}</span>
                  <ChevronDown className={cn("shrink-0 transition", expanded && "rotate-180")} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} role="region" hidden={!expanded} className="px-5 pb-5 text-sm leading-6 text-muted">
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
