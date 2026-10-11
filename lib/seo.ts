import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: "/wordle-unlimited.webp", width: 1280, height: 720, alt: "Wordle Unlimited" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/wordle-unlimited.webp"],
    },
  };
}

