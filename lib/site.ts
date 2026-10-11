/**
 * Central site configuration.
 * Set NEXT_PUBLIC_SITE_URL to the production origin, including https,
 * so canonical URLs, Open Graph tags, sitemap, and robots all match.
 */
export const siteConfig = {
  name: "Wordle Unlimited",
  shortName: "Wordle Unlimited",
  description:
    "Play Wordle Unlimited online for free. Enjoy endless word puzzles, choose 3–10 letter words, explore game modes, use hints, and challenge your friends.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://wordleunlimitedd.com").replace(
    /\/$/,
    "",
  ),
  locale: "en_US",
  title: "Wordle Unlimited — Play Free Unlimited Word Games Online",
  gameTitle: "Play Wordle Unlimited — Free Online Word Puzzle Game",
  gameDescription:
    "Play Wordle Unlimited with no daily limits. Choose 3–10 letter puzzles, switch difficulty modes, track stats, get hints, and challenge friends.",
} as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  if (path === "/") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
