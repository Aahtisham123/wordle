import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { categoryHasLength, wordsForCategory } from "@/lib/game/categories";
import { applyHint, commitGuess, createGame, typeLetter } from "@/lib/game/engine";
import { evaluateSubmission } from "@/lib/game/evaluate";
import { hardModeViolation, constraintsFromPlay } from "@/lib/game/hard-mode";
import { nextHint } from "@/lib/game/hints";
import { keyboardMarks } from "@/lib/game/keyboard";
import { scoreGuess } from "@/lib/game/score";
import { answerPool, pickAnswer } from "@/lib/game/selection";
import { emptyStats, recordGame } from "@/lib/game/stats";
import { dictionaryFromFile } from "@/lib/game/dictionary";
import type { DictionaryFile, GameConfig, GameResult } from "@/lib/game/types";
import { isAlphabeticWord } from "@/lib/game/validation";
import { dailyWord } from "@/lib/server/daily";
import { createChallenge, getChallenge, submitSessionGuess, toPublicChallenge } from "@/lib/server/puzzles";
import { createSession } from "@/lib/server/puzzles";
import { recordCommunityEvent, publicCommunity } from "@/lib/server/community";
import { resetRateLimits } from "@/lib/server/rate-limit";

function loadFile(locale: "us" | "uk", length: number) {
  const file = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/dictionaries", locale, `${length}.json`), "utf8"),
  ) as DictionaryFile;
  return dictionaryFromFile(file, locale, length as 5);
}

function config(partial: Partial<GameConfig> = {}): GameConfig {
  return {
    id: "game-1",
    length: 5,
    difficulty: "medium",
    category: "random",
    locale: "us",
    mode: "unlimited",
    maxGuesses: 6,
    hintBudget: 2,
    hintsEnabled: true,
    hardMode: false,
    answer: "apple",
    clue: null,
    remote: false,
    countdownMs: null,
    custom: false,
    ...partial,
  };
}

function result(partial: Partial<GameResult> = {}): GameResult {
  return {
    id: "result-1",
    won: true,
    mode: "unlimited",
    difficulty: "medium",
    length: 5,
    category: "random",
    attempts: 3,
    hintsUsed: 0,
    durationMs: 15000,
    perfect: false,
    ...partial,
  };
}

describe("repeated-letter scoring", () => {
  it("marks only the available copies of a letter", () => {
    expect(scoreGuess("bobby", "books")).toEqual([
      "correct",
      "correct",
      "absent",
      "absent",
      "absent",
    ]);
    expect(scoreGuess("papal", "apple")).toEqual([
      "present",
      "present",
      "correct",
      "absent",
      "present",
    ]);
    expect(scoreGuess("babes", "abbey")).toEqual([
      "present",
      "present",
      "correct",
      "correct",
      "absent",
    ]);
    expect(scoreGuess("erase", "speed")).toEqual([
      "present",
      "absent",
      "absent",
      "present",
      "present",
    ]);
  });

  it("accepts an exact guess", () => {
    expect(scoreGuess("books", "books").every((mark) => mark === "correct")).toBe(true);
  });
});

describe("hard mode", () => {
  it("requires fixed positions and confirmed letter counts", () => {
    const first = scoreGuess("hello", "shell");
    expect(first).toEqual(["present", "present", "present", "correct", "absent"]);
    const constraints = constraintsFromPlay(["hello"], [first], Array(5).fill(null), []);
    expect(hardModeViolation("lshle", constraints)).toBeNull();
    expect(hardModeViolation("hells", constraints)).toMatch(/hard mode/i);
    expect(hardModeViolation("llhhe", constraints)).toMatch(/position 4/i);
    expect(hardModeViolation("hels", constraints)).toBeTruthy();
  });

  it("keeps a revealed hint letter locked", () => {
    const constraints = constraintsFromPlay([], [], ["s", null, null, null, null], []);
    expect(evaluateSubmission({
      guess: "stone",
      answer: "shell",
      previousGuesses: [],
      previousMarks: [],
      revealed: ["s", null, null, null, null],
      eliminated: [],
      hardMode: true,
    }).ok).toBe(true);
    expect(hardModeViolation("apple", constraints)).toMatch(/S/i);
  });
});

describe("hints", () => {
  it("does not reveal the final unknown letter", () => {
    const hint = nextHint({
      answer: "apple",
      guesses: ["apply"],
      evaluations: [scoreGuess("apply", "apple")],
      revealed: [null, null, null, null, null],
      eliminated: [],
      definitionShown: true,
      categoryHintShown: false,
      definition: "A fruit.",
      categoryText: "Food",
    });
    expect("hint" in hint).toBe(true);
    if ("hint" in hint) expect(hint.hint.type).not.toBe("reveal");
  });

  it("stops after the budget is spent", () => {
    let state = createGame(config({ hintBudget: 1 }));
    state = applyHint(state, { type: "eliminate", letter: "z" });
    expect(state.hintsUsed).toBe(1);
    expect(state.config.hintBudget - state.hintsUsed).toBe(0);
  });
});

describe("dictionaries and categories", () => {
  it("keeps answers inside the allowed list and the right length", () => {
    for (const length of [3, 4, 5, 6, 7, 8, 9, 10]) {
      const dictionary = loadFile("us", length);
      for (const word of dictionary.pools.medium) {
        expect(word).toHaveLength(length);
        expect(dictionary.allowed.has(word)).toBe(true);
      }
    }
  });

  it("uses US and UK spellings in the matching lists", () => {
    const us = loadFile("us", 5);
    const ukFive = loadFile("uk", 5);
    const ukSix = loadFile("uk", 6);
    expect(us.pools.medium).toContain("color");
    expect(ukFive.pools.medium).not.toContain("color");
    expect(ukSix.allowed.has("colour")).toBe(true);
    expect(ukSix.pools.medium.includes("colour") || ukSix.pools.easy.includes("colour")).toBe(true);
    expect(ukFive.allowed.has("color")).toBe(true);
  });

  it("disables empty category and length combinations", () => {
    expect(categoryHasLength("countries", 2, "us")).toBe(false);
    expect(wordsForCategory("birds", 3, "us").length).toBeGreaterThan(0);
    const dictionary = loadFile("us", 5);
    expect(answerPool(dictionary, "random", "hard", "us").length).toBeGreaterThan(20);
    expect(() => pickAnswer([])).toThrow(/no valid answer/i);
  });
});

describe("custom words and statistics", () => {
  it("validates custom word length and letters", () => {
    expect(isAlphabeticWord("puzzle")).toBe(true);
    expect(isAlphabeticWord("hi")).toBe(false);
    expect(isAlphabeticWord("abc1")).toBe(false);
    expect(isAlphabeticWord("puz zle")).toBe(false);
    expect(isAlphabeticWord("a".repeat(10))).toBe(true);
    expect(isAlphabeticWord("a".repeat(11))).toBe(false);
  });

  it("counts a completed game once and keeps practice off the streak", () => {
    let stats = emptyStats();
    stats = recordGame(stats, result({ id: "a", attempts: 1, perfect: true, durationMs: 4000 }));
    stats = recordGame(stats, result({ id: "a", attempts: 1, perfect: true }));
    stats = recordGame(stats, result({ id: "b", won: false, attempts: 6 }));
    stats = recordGame(stats, result({ id: "c", mode: "practice", won: true, attempts: 2 }));
    expect(stats.played).toBe(3);
    expect(stats.won).toBe(2);
    expect(stats.lost).toBe(1);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(1);
    expect(stats.perfectGames).toBe(1);
    expect(stats.practicePlayed).toBe(1);
    expect(stats.unassistedWins).toBe(2);
  });

  it("labels assisted wins separately", () => {
    const stats = recordGame(emptyStats(), result({ hintsUsed: 2, id: "hinted" }));
    expect(stats.assistedWins).toBe(1);
    expect(stats.unassistedWins).toBe(0);
    expect(stats.hintsUsed).toBe(2);
  });
});

describe("keyboard priority", () => {
  it("does not let a later gray overwrite green", () => {
    const marks = keyboardMarks(
      ["books", "bland"],
      [
        ["correct", "correct", "correct", "absent", "absent"],
        ["correct", "absent", "absent", "absent", "absent"],
      ],
      [],
      [],
    );
    expect(marks.get("b")).toBe("correct");
    expect(marks.get("o")).toBe("correct");
    expect(marks.get("l")).toBe("absent");
  });
});

describe("daily puzzles", () => {
  it("returns the same word for the same date, length, and language", () => {
    const first = dailyWord("2026-10-12", 5, "us");
    const second = dailyWord("2026-10-12", 5, "us");
    expect(first).toBe(second);
    expect(first).toHaveLength(5);
    expect(dailyWord("2026-10-12", 5, "uk")).toHaveLength(5);
  });
});

describe("saved game transitions", () => {
  it("restores a typed row and records a win only after a solved guess", () => {
    let state = createGame(config({ answer: "apple", id: "restore-me" }));
    state = typeLetter(state, "a");
    const restored = structuredClone(state);
    expect(restored.slots[0]).toBe("a");
    expect(restored.statsRecorded).toBe(false);
    const marks = scoreGuess("apple", "apple");
    state.slots = ["a", "p", "p", "l", "e"];
    state = commitGuess(state, marks, 5_000);
    expect(state.status).toBe("won");
    expect(state.guesses).toEqual(["apple"]);
  });
});

describe("server challenges", () => {
  let directory = "";

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "wordle-"));
    process.env.WORDLE_DATA_DIR = directory;
    resetRateLimits();
  });

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it("keeps the answer out of the public challenge payload", async () => {
    const challenge = await createChallenge({
      source: "custom",
      word: "puzzle",
      length: 6,
      difficulty: "medium",
      locale: "us",
      category: "random",
      clue: "A game of pieces",
      maxGuesses: 6,
    });
    const payload = JSON.stringify(toPublicChallenge(challenge));
    expect(payload).not.toContain("puzzle");
    expect(getChallenge(challenge.id)?.word).toBe("puzzle");
    const session = await createSession({ kind: "challenge", challengeId: challenge.id });
    const wrong = await submitSessionGuess(session.id, "zzzzzz");
    expect(wrong.ok).toBe(true);
    if (wrong.ok) {
      expect(wrong.answer).toBeUndefined();
      expect(wrong.status).toBe("playing");
      expect(wrong.marks?.filter((mark) => mark === "correct")).toHaveLength(2);
    }
    const right = await submitSessionGuess(session.id, "puzzle");
    expect(right.ok).toBe(true);
    if (right.ok) expect(right.status).toBe("won");
  });

  it("rejects an invalid shared guess without using an attempt", async () => {
    const challenge = await createChallenge({
      source: "shared",
      length: 5,
      difficulty: "easy",
      locale: "us",
      category: "random",
      maxGuesses: 6,
    });
    const session = await createSession({ kind: "challenge", challengeId: challenge.id });
    const rejected = await submitSessionGuess(session.id, "qqqqq");
    expect(rejected.ok).toBe(false);
    if (!rejected.ok) expect(rejected.session.guesses).toHaveLength(0);
  });

  it("records a community event once", async () => {
    await recordCommunityEvent({
      id: "game-12345678",
      won: true,
      difficulty: "medium",
      length: 5,
      category: "random",
      mode: "unlimited",
      hints: 0,
      attempts: 4,
      durationMs: 20000,
    });
    await recordCommunityEvent({
      id: "game-12345678",
      won: true,
      difficulty: "medium",
      length: 5,
      category: "random",
      mode: "unlimited",
      hints: 0,
      attempts: 4,
      durationMs: 20000,
    });
    expect(publicCommunity().played).toBe(1);
    expect(publicCommunity().won).toBe(1);
  });
});
