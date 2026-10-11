import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enable = fs
  .readFileSync(path.join(root, "data/raw/enable1.txt"), "utf8")
  .split(/\s+/)
  .map((word) => word.trim().toLowerCase())
  .filter((word) => /^[a-z]{3,10}$/.test(word));
const google = fs
  .readFileSync(path.join(root, "data/raw/google-10000.txt"), "utf8")
  .split(/\s+/)
  .map((word) => word.trim().toLowerCase())
  .filter((word) => /^[a-z]{3,10}$/.test(word));
const variants = JSON.parse(
  fs.readFileSync(path.join(root, "data/variants.json"), "utf8"),
);

const enableSet = new Set(enable);
const usToUk = new Map(variants);

const byLength = new Map();
for (let length = 3; length <= 10; length += 1) byLength.set(length, []);
for (const word of google) {
  if (enableSet.has(word)) byLength.get(word.length).push(word);
}

function unique(words) {
  return [...new Set(words)].sort();
}

function emptyFiles() {
  const files = {};
  for (let length = 3; length <= 10; length += 1) {
    files[length] = { easy: [], medium: [], hard: [], allowed: [] };
  }
  return files;
}

function buildUs() {
  const files = emptyFiles();
  for (let length = 3; length <= 10; length += 1) {
    const ranked = byLength.get(length);
    const easyCut = Math.max(40, Math.round(ranked.length * 0.35));
    const hardStart = Math.max(easyCut, Math.round(ranked.length * 0.62));
    const easy = ranked.slice(0, easyCut);
    const medium = ranked.slice();
    let hard = ranked.slice(hardStart).filter((word) => !easy.includes(word));
    if (hard.length < 25) hard = medium.slice(Math.floor(medium.length / 2));
    const allowed = new Set(enable.filter((word) => word.length === length));
    for (const [usWord, ukWord] of variants) {
      if (usWord.length === length) allowed.add(usWord);
      if (ukWord.length === length) allowed.add(ukWord);
    }
    files[length] = {
      easy: unique(easy),
      medium: unique(medium),
      hard: unique(hard),
      allowed: [...allowed].sort(),
    };
  }
  return files;
}

function buildUk(usFiles) {
  const files = emptyFiles();
  for (let length = 3; length <= 10; length += 1) {
    files[length].allowed = new Set();
  }
  for (let length = 3; length <= 10; length += 1) {
    const source = usFiles[length];
    for (const bucket of ["easy", "medium", "hard"]) {
      for (const word of source[bucket]) {
        const next = usToUk.get(word) ?? word;
        if (next.length < 3 || next.length > 10) continue;
        files[next.length][bucket].push(next);
      }
    }
    for (const word of source.allowed) {
      files[word.length].allowed.add(word);
      const ukWord = usToUk.get(word);
      if (ukWord && ukWord.length >= 3 && ukWord.length <= 10) {
        files[ukWord.length].allowed.add(ukWord);
      }
    }
  }
  for (let length = 3; length <= 10; length += 1) {
    const easy = unique(files[length].easy);
    const medium = unique(files[length].medium);
    let hard = unique(files[length].hard).filter((word) => !easy.includes(word));
    if (hard.length < 25) hard = medium.slice(Math.floor(medium.length / 2));
    files[length] = {
      easy,
      medium,
      hard: unique(hard),
      allowed: [...files[length].allowed].sort(),
    };
  }
  return files;
}

const us = buildUs();
const uk = buildUk(us);
const out = path.join(root, "public/dictionaries");
fs.mkdirSync(path.join(out, "us"), { recursive: true });
fs.mkdirSync(path.join(out, "uk"), { recursive: true });

const manifest = { us: {}, uk: {} };
for (const [locale, files] of [
  ["us", us],
  ["uk", uk],
]) {
  for (const [length, file] of Object.entries(files)) {
    fs.writeFileSync(
      path.join(out, locale, `${length}.json`),
      JSON.stringify(file),
    );
    manifest[locale][length] = {
      easy: file.easy.length,
      medium: file.medium.length,
      hard: file.hard.length,
      allowed: file.allowed.length,
    };
  }
}

fs.writeFileSync(
  path.join(root, "data/dictionary-manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(JSON.stringify(manifest, null, 2));
