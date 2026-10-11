import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

const pages = [
  ["app/page.tsx", ""],
  ["app/wordle-unlimited/page.tsx", "/wordle-unlimited"],
  ["app/how-to-play/page.tsx", "/how-to-play"],
  ["app/wordle-tips/page.tsx", "/wordle-tips"],
  ["app/about-us/page.tsx", "/about-us"],
  ["app/dmca/page.tsx", "/dmca"],
  ["app/contact-us/page.tsx", "/contact-us"],
  ["app/privacy-policy/page.tsx", "/privacy-policy"],
  ["app/terms-and-conditions/page.tsx", "/terms-and-conditions"],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(([file, route]) => ({
    url: route ? `${siteConfig.url}${route}` : absoluteUrl("/"),
    lastModified: fs.statSync(path.join(/*turbopackIgnore: true*/ process.cwd(), file)).mtime,
  }));
}
