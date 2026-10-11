import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, wordsForCategory } from "@/lib/game/categories";
import { clueFor } from "@/lib/game/clues";
import { evaluateSubmission } from "@/lib/game/evaluate";
import { categoryHintText, nextHint } from "@/lib/game/hints";
import { guessError, isAlphabeticWord, normalizeWord } from "@/lib/game/validation";
import { answerPool, pickAnswer } from "@/lib/game/selection";
import type {
  CategoryId,
  Difficulty,
  HintResult,
  Locale,
  PublicChallenge,
  TileMark,
  WordLength,
} from "@/lib/game/types";
import { WORD_LENGTHS } from "@/lib/game/types";
import { dailyWord, utcDate } from "@/lib/server/daily";
import { readCollection, updateCollection } from "@/lib/server/json-store";
import { dataDir, ensureDataDir } from "@/lib/server/paths";
import { readDictionary } from "@/lib/server/words";

const CHALLENGES = "challenges.json";
const SESSIONS = "sessions.json";

export type StoredChallenge = PublicChallenge & {
  word: string;
};

export type PuzzleSession = {
  id: string;
  kind: "daily" | "challenge";
  challengeId?: string;
  date?: string;
  length: WordLength;
  locale: Locale;
  difficulty: Difficulty;
  category: CategoryId;
  clue: string | null;
  custom: boolean;
  hardMode: boolean;
  maxGuesses: number;
  hintBudget: number;
  guesses: string[];
  evaluations: TileMark[][];
  revealed: Array<string | null>;
  eliminated: string[];
  hintsUsed: number;
  definitionShown: boolean;
  categoryHintShown: boolean;
  createdAt: number;
  status: "playing" | "won" | "lost";
};

function id() {
  return crypto.randomBytes(16).toString("hex");
}

export function toPublicChallenge(challenge: StoredChallenge): PublicChallenge {
  return {
    id: challenge.id,
    length: challenge.length,
    difficulty: challenge.difficulty,
    maxGuesses: challenge.maxGuesses,
    hintBudget: challenge.hintBudget,
    hardMode: challenge.hardMode,
    clue: challenge.clue,
    category: challenge.category,
    locale: challenge.locale,
    source: challenge.source,
    countdownMs: challenge.countdownMs,
    createdAt: challenge.createdAt,
  };
}

export function getChallenge(challengeId: string) {
  return readCollection<StoredChallenge>(CHALLENGES).find((item) => item.id === challengeId) ?? null;
}

export async function createChallenge(input: {
  source: "custom" | "shared";
  word?: string;
  length: WordLength;
  difficulty: Difficulty;
  locale: Locale;
  category: CategoryId;
  clue?: string;
  maxGuesses: number;
  countdownMs?: number | null;
}) {
  if (!WORD_LENGTHS.includes(input.length)) {
    throw new Error("Choose a word length from 3 to 10.");
  }
  const clue = input.clue?.trim().slice(0, 140) || null;
  let word = "";
  let length = input.length;
  let category = input.category;

  if (input.word) {
    word = normalizeWord(input.word);
    if (!isAlphabeticWord(word)) {
      throw new Error("Use 3 to 10 letters, with no spaces or numbers.");
    }
    length = word.length as WordLength;
    category = input.category;
  } else if (input.source === "shared") {
    const dictionary = readDictionary(input.locale, input.length);
    const pool = answerPool(dictionary, input.category, input.difficulty, input.locale);
    word = pickAnswer(pool);
  } else {
    throw new Error("Enter a custom word.");
  }

  const challenge: StoredChallenge = {
    id: id(),
    word,
    length,
    difficulty: input.difficulty,
    maxGuesses: clampGuesses(input.maxGuesses),
    hintBudget: input.difficulty === "easy" ? 3 : input.difficulty === "medium" ? 2 : 1,
    hardMode: input.difficulty === "hard",
    clue,
    category,
    locale: input.locale,
    source: input.source,
    countdownMs: input.countdownMs ?? null,
    createdAt: new Date().toISOString(),
  };

  await updateCollection<StoredChallenge>(CHALLENGES, (items) => [challenge, ...items].slice(0, 2000));
  return challenge;
}

function clampGuesses(value: number) {
  if (!Number.isFinite(value)) return 6;
  return Math.min(8, Math.max(4, Math.round(value)));
}

export async function createSession(input: {
  kind: "daily" | "challenge";
  challengeId?: string;
  length?: WordLength;
  locale?: Locale;
  difficulty?: Difficulty;
}) {
  let session: PuzzleSession;
  if (input.kind === "challenge") {
    const challenge = input.challengeId ? getChallenge(input.challengeId) : null;
    if (!challenge) throw new Error("This challenge link is unavailable.");
    session = blankSession({
      kind: "challenge",
      challengeId: challenge.id,
      length: challenge.length,
      locale: challenge.locale,
      difficulty: challenge.difficulty,
      category: challenge.category,
      clue: challenge.clue,
      custom: challenge.source === "custom",
      hardMode: challenge.hardMode,
      maxGuesses: challenge.maxGuesses,
      hintBudget: challenge.hintBudget,
    });
  } else {
    const length = input.length ?? 5;
    const locale = input.locale ?? "us";
    const difficulty = input.difficulty ?? "medium";
    if (!WORD_LENGTHS.includes(length)) throw new Error("Choose a word length from 3 to 10.");
    session = blankSession({
      kind: "daily",
      date: utcDate(),
      length,
      locale,
      difficulty,
      category: "random",
      clue: null,
      custom: false,
      hardMode: difficulty === "hard",
      maxGuesses: difficulty === "easy" ? 8 : 6,
      hintBudget: difficulty === "easy" ? 3 : difficulty === "medium" ? 2 : 1,
    });
  }
  await updateCollection<PuzzleSession>(SESSIONS, (items) => [session, ...items].slice(0, 2000));
  return publicSession(session);
}

function blankSession(seed: Omit<PuzzleSession, "id" | "guesses" | "evaluations" | "revealed" | "eliminated" | "hintsUsed" | "definitionShown" | "categoryHintShown" | "createdAt" | "status">): PuzzleSession {
  return {
    ...seed,
    id: id(),
    guesses: [],
    evaluations: [],
    revealed: Array.from({ length: seed.length }, () => null),
    eliminated: [],
    hintsUsed: 0,
    definitionShown: false,
    categoryHintShown: false,
    createdAt: Date.now(),
    status: "playing",
  };
}

export function getSession(sessionId: string) {
  return readCollection<PuzzleSession>(SESSIONS).find((item) => item.id === sessionId) ?? null;
}

function answerFor(session: PuzzleSession) {
  if (session.kind === "daily") {
    return dailyWord(session.date ?? utcDate(), session.length, session.locale);
  }
  const challenge = session.challengeId ? getChallenge(session.challengeId) : null;
  if (!challenge) throw new Error("This challenge link is unavailable.");
  return challenge.word;
}

function replaceSession(next: PuzzleSession) {
  return updateCollection<PuzzleSession>(SESSIONS, (items) =>
    items.map((item) => (item.id === next.id ? next : item)),
  );
}

export async function submitSessionGuess(sessionId: string, guessInput: string) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Start a new puzzle session and try again.");
  if (session.status !== "playing") {
    return responseFor(session, answerFor(session), null);
  }
  const guess = normalizeWord(guessInput);
  const answer = answerFor(session);
  const dictionary = session.custom ? null : readDictionary(session.locale, session.length);
  const invalid = guessError({
    guess,
    length: session.length,
    dictionary,
    category: session.category,
    locale: session.locale,
    custom: session.custom,
  });
  if (invalid) return { ok: false as const, message: invalid, session: publicSession(session) };

  const themed = wordsForCategory(session.category, session.length, session.locale);
  if (!session.custom && !dictionary?.allowed.has(guess) && !themed.includes(guess)) {
    return { ok: false as const, message: "That is not in the word list.", session: publicSession(session) };
  }

  const evaluated = evaluateSubmission({
    guess,
    answer,
    previousGuesses: session.guesses,
    previousMarks: session.evaluations,
    revealed: session.revealed,
    eliminated: session.eliminated,
    hardMode: session.hardMode,
  });
  if (!evaluated.ok) {
    return { ok: false as const, message: evaluated.message, session: publicSession(session) };
  }

  const guesses = [...session.guesses, guess];
  const won = evaluated.marks.every((mark) => mark === "correct");
  const lost = !won && guesses.length >= session.maxGuesses;
  const next: PuzzleSession = {
    ...session,
    guesses,
    evaluations: [...session.evaluations, evaluated.marks],
    status: won ? "won" : lost ? "lost" : "playing",
  };
  await replaceSession(next);
  return responseFor(next, answer, evaluated.marks);
}

export async function shareSession(sessionId: string) {
  const session = getSession(sessionId);
  if (!session) throw new Error("This puzzle session is unavailable.");
  return createChallenge({
    source: "shared",
    word: answerFor(session),
    length: session.length,
    difficulty: session.difficulty,
    locale: session.locale,
    category: session.category,
    clue: session.clue ?? undefined,
    maxGuesses: session.maxGuesses,
  });
}

export async function forfeitSession(sessionId: string) {
  const session = getSession(sessionId);
  if (!session) throw new Error("This puzzle session is unavailable.");
  if (session.status === "playing") {
    const next: PuzzleSession = { ...session, status: "lost" };
    await replaceSession(next);
    return responseFor(next, answerFor(next), null);
  }
  return responseFor(session, answerFor(session), null);
}

export async function submitSessionHint(sessionId: string) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Start a new puzzle session and try again.");
  if (session.status !== "playing") throw new Error("This puzzle is already finished.");
  if (session.hintsUsed >= session.hintBudget) {
    throw new Error("No hints remaining.");
  }
  const answer = answerFor(session);
  const hint = nextHint({
    answer,
    guesses: session.guesses,
    evaluations: session.evaluations,
    revealed: session.revealed,
    eliminated: session.eliminated,
    definitionShown: session.definitionShown,
    categoryHintShown: session.categoryHintShown,
    definition: session.clue ?? clueFor(answer),
    categoryText: categoryHintText(session.category, CATEGORIES[session.category].hint),
  });
  if ("error" in hint) throw new Error(hint.error);
  const next = applyServerHint(session, hint.hint);
  await replaceSession(next);
  return { hint: hint.hint, session: publicSession(next) };
}

function applyServerHint(session: PuzzleSession, hint: HintResult): PuzzleSession {
  const revealed = session.revealed.slice();
  const eliminated = session.eliminated.slice();
  if (hint.type === "reveal") revealed[hint.index] = hint.letter;
  if (hint.type === "eliminate") eliminated.push(hint.letter);
  return {
    ...session,
    revealed,
    eliminated,
    hintsUsed: session.hintsUsed + 1,
    definitionShown: session.definitionShown || hint.type === "definition",
    categoryHintShown: session.categoryHintShown || hint.type === "category",
  };
}

function responseFor(session: PuzzleSession, answer: string, marks: TileMark[] | null) {
  const finished = session.status !== "playing";
  return {
    ok: true as const,
    marks,
    status: session.status,
    attempts: session.guesses.length,
    maxGuesses: session.maxGuesses,
    answer: finished ? answer : undefined,
    clue: finished ? session.clue ?? clueFor(answer) : session.clue,
    session: publicSession(session),
  };
}

export function publicSession(session: PuzzleSession) {
  return {
    id: session.id,
    kind: session.kind,
    length: session.length,
    locale: session.locale,
    difficulty: session.difficulty,
    category: session.category,
    clue: session.clue,
    custom: session.custom,
    hardMode: session.hardMode,
    maxGuesses: session.maxGuesses,
    hintBudget: session.hintBudget,
    guesses: session.guesses,
    evaluations: session.evaluations,
    revealed: session.revealed,
    eliminated: session.eliminated,
    hintsUsed: session.hintsUsed,
    status: session.status,
    countdownMs: session.kind === "challenge" ? getChallenge(session.challengeId ?? "")?.countdownMs ?? null : null,
  };
}

export function serverSalt() {
  ensureDataDir();
  const file = path.join(dataDir(), "salt");
  if (!fs.existsSync(file)) fs.writeFileSync(file, crypto.randomBytes(32).toString("hex"));
  return fs.readFileSync(file, "utf8");
}

export function hashIp(ip: string) {
  return crypto.createHash("sha256").update(`${serverSalt()}:${ip}`).digest("hex").slice(0, 24);
}
