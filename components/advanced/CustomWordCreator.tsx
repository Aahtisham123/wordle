"use client";

import { useState } from "react";
import { copyText, nativeShare } from "@/lib/game/share";
import { isAlphabeticWord } from "@/lib/game/validation";
import type { Difficulty, Locale } from "@/lib/game/types";

export function CustomWordCreator({
  locale,
  difficulty,
  onPlay,
}: {
  locale: Locale;
  difficulty: Difficulty;
  onPlay: (word: string, clue: string | null, maxGuesses: number) => void;
}) {
  const [word, setWord] = useState("");
  const [clue, setClue] = useState("");
  const [attempts, setAttempts] = useState(6);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function create() {
    const normalized = word.trim().toLowerCase();
    if (!isAlphabeticWord(normalized)) {
      setError("Use 3 to 10 letters, with no spaces or numbers.");
      return;
    }
    setError("");
    const response = await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "custom",
        word: normalized,
        length: normalized.length,
        difficulty,
        locale,
        category: "random",
        clue,
        maxGuesses: attempts,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not create the challenge.");
      return;
    }
    setLink(payload.url);
    setNotice("Challenge created. The answer is stored on the server, not in the link.");
  }

  return (
    <form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); void create(); }}>
      <label className="grid gap-1 text-sm">
        Custom word
        <input value={word} onChange={(event) => setWord(event.target.value)} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" autoComplete="off" spellCheck={false} />
      </label>
      <label className="grid gap-1 text-sm">
        Optional clue
        <input value={clue} onChange={(event) => setClue(event.target.value)} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" maxLength={140} />
      </label>
      <label className="grid gap-1 text-sm">
        Allowed attempts
        <input type="number" min={4} max={8} value={attempts} onChange={(event) => setAttempts(Number(event.target.value))} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" />
      </label>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {notice ? <p className="text-sm text-muted">{notice}</p> : null}
      <button type="submit" className="h-11 rounded-full bg-accent text-sm font-semibold text-white">Create Challenge</button>
      {link ? (
        <div className="grid gap-2">
          <input readOnly value={link} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" aria-label="Challenge link" />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => void copyText(link).then(() => setNotice("Link copied."))}>Copy link</button>
            <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => void nativeShare({ title: "Wordle Unlimited challenge", text: "Can you solve this word?", url: link })}>Share</button>
            <button type="button" className="rounded-full border border-[var(--line)] px-3 py-2 text-sm" onClick={() => onPlay(word.trim().toLowerCase(), clue.trim() || null, attempts)}>Play here</button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
