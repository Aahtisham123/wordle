"use client";

import { useState } from "react";
import { copyText, nativeShare } from "@/lib/game/share";
import type { Setup } from "@/components/game/useWordleGame";

export function ChallengeFriendModal({
  setup,
  answer,
  sessionId,
}: {
  setup: Setup;
  answer: string | null;
  sessionId?: string;
}) {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  async function create(source: "current" | "new") {
    setError("");
    try {
      const response = source === "current" && sessionId
        ? await fetch(`/api/sessions/${sessionId}/challenge`, { method: "POST" })
        : await fetch("/api/challenges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: source === "current" ? "shared" : "shared",
              word: source === "current" ? answer ?? undefined : undefined,
              length: setup.length,
              difficulty: setup.difficulty,
              locale: setup.locale,
              category: setup.category,
              maxGuesses: setup.difficulty === "easy" || setup.mode === "practice" ? 8 : 6,
            }),
          });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not create a link.");
      setLink(payload.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create a link.");
    }
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm leading-6 text-muted">
        Both players receive the same secret word. This is a shared puzzle, not a live match. The answer is not placed in the link.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white" onClick={() => void create("current")} disabled={!answer && !sessionId}>
          Share this puzzle
        </button>
        <button type="button" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold" onClick={() => void create("new")}>
          New shared puzzle
        </button>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {link ? (
        <div className="grid gap-2">
          <input readOnly value={link} aria-label="Challenge link" className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" />
          <div className="flex gap-2">
            <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => void copyText(link)}>Copy link</button>
            <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => void nativeShare({ title: "Wordle Unlimited", text: "I challenged you to the same word puzzle.", url: link })}>Share</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
