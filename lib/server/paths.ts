import fs from "node:fs";
import path from "node:path";

export function dataDir() {
  return process.env.WORDLE_DATA_DIR || path.join(process.cwd(), ".data");
}

export function ensureDataDir() {
  fs.mkdirSync(dataDir(), { recursive: true });
}

let queue = Promise.resolve();

export function withLock<T>(task: () => Promise<T> | T) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
