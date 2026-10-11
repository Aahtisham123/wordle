export const WORD_LENGTHS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export type WordLength = (typeof WORD_LENGTHS)[number];

export type Difficulty = "easy" | "medium" | "hard";

export type Locale = "us" | "uk";

export type GameMode =
  | "unlimited"
  | "daily"
  | "practice"
  | "timed"
  | "countdown"
  | "challenge";

export type TileMark = "correct" | "present" | "absent";

export type CategoryId =
  | "random"
  | "nature"
  | "animals"
  | "birds"
  | "technology"
  | "science"
  | "food"
  | "sports"
  | "countries"
  | "geography"
  | "movies"
  | "education"
  | "music"
  | "space"
  | "plants"
  | "objects";

export type DictionaryFile = {
  easy: string[];
  medium: string[];
  hard: string[];
  allowed: string[];
};

export type LoadedDictionary = {
  locale: Locale;
  length: WordLength;
  pools: Record<Difficulty, string[]>;
  allowed: Set<string>;
};

export type GameConfig = {
  id: string;
  length: WordLength;
  difficulty: Difficulty;
  category: CategoryId;
  locale: Locale;
  mode: GameMode;
  maxGuesses: number;
  hintBudget: number;
  hintsEnabled: boolean;
  hardMode: boolean;
  answer: string | null;
  clue: string | null;
  challengeId?: string;
  sessionId?: string;
  remote: boolean;
  countdownMs: number | null;
  custom: boolean;
};

export type GameState = {
  config: GameConfig;
  slots: Array<string | null>;
  guesses: string[];
  evaluations: TileMark[][];
  revealed: Array<string | null>;
  eliminated: string[];
  hintsUsed: number;
  hintNotes: string[];
  definitionShown: boolean;
  categoryHintShown: boolean;
  status: "playing" | "won" | "lost";
  startedAt: number;
  endedAt: number | null;
  message: string | null;
  shake: boolean;
  statsRecorded: boolean;
};

export type HintResult =
  | { type: "definition"; text: string }
  | { type: "reveal"; index: number; letter: string }
  | { type: "eliminate"; letter: string }
  | { type: "category"; text: string };

export type GameResult = {
  id: string;
  won: boolean;
  mode: GameMode;
  difficulty: Difficulty;
  length: WordLength;
  category: CategoryId;
  attempts: number;
  hintsUsed: number;
  durationMs: number;
  perfect: boolean;
};

export type ModeCount = {
  played: number;
  won: number;
};

export type PlayerStats = {
  version: 1;
  played: number;
  won: number;
  lost: number;
  assistedWins: number;
  unassistedWins: number;
  currentStreak: number;
  bestStreak: number;
  guessTotals: number;
  winsForAverage: number;
  distribution: number[];
  hintsUsed: number;
  fastestMs: number | null;
  totalWinMs: number;
  practicePlayed: number;
  practiceWon: number;
  perfectGames: number;
  byDifficulty: Record<Difficulty, ModeCount>;
  byLength: Record<string, ModeCount>;
  byCategory: Record<string, ModeCount>;
  recordedIds: string[];
};

export type PublicChallenge = {
  id: string;
  length: WordLength;
  difficulty: Difficulty;
  maxGuesses: number;
  hintBudget: number;
  hardMode: boolean;
  clue: string | null;
  category: CategoryId;
  locale: Locale;
  source: "custom" | "shared";
  countdownMs: number | null;
  createdAt: string;
};
