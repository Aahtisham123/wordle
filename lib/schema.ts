import { faqs } from "@/content/faq";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Crumb = { name: string; href: string };

const publisher = {
  "@type": "Organization",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon.svg"),
};

const gameOffer = {
  "@type": "Offer",
  price: "0",
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
};

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: ["en-US", "en-GB"],
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function organizationSchema() {
  return {
    ...publisher,
    "@id": `${siteConfig.url}/#organization`,
  };
}

export function videoGameSchema() {
  return {
    "@type": ["VideoGame", "SoftwareApplication"],
    "@id": `${siteConfig.url}/wordle-unlimited#game`,
    name: "Wordle Unlimited",
    url: absoluteUrl("/wordle-unlimited"),
    description: siteConfig.gameDescription,
    genre: "Word puzzle",
    playMode: "SinglePlayer",
    gamePlatform: "Web browser",
    operatingSystem: "Web",
    applicationCategory: "Game",
    isAccessibleForFree: true,
    inLanguage: ["en-US", "en-GB"],
    offers: gameOffer,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    image: absoluteUrl("/wordle-unlimited.webp"),
  };
}

export function webPageSchema({
  name,
  description,
  path,
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage";
}) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/wordle-unlimited#game` },
    inLanguage: "en",
    primaryImageOfPage: absoluteUrl("/wordle-unlimited.webp"),
  };
}

export function breadcrumbGraph(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema() {
  return {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function howToSchema() {
  return {
    "@type": "HowTo",
    name: "How to play Wordle Unlimited",
    description: "Guess the hidden word. Each guess has to be a real word of the length you chose.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose a length and difficulty",
        text: "Easy mode allows eight guesses. Medium, hard, and the daily puzzle allow six unless a custom challenge sets a different limit.",
      },
      {
        "@type": "HowToStep",
        name: "Read the tiles",
        text: "Green means the letter is correct and in the right position. Yellow means the letter is in the word but not in that position. Gray means that copy of the letter is not available.",
      },
      {
        "@type": "HowToStep",
        name: "Submit a real word",
        text: "Use the on-screen keyboard or a physical keyboard. Enter submits the row. Guesses are checked against the US or UK word list.",
      },
      {
        "@type": "HowToStep",
        name: "Use hints carefully",
        text: "A hint can show a clue, remove a letter, or reveal one correct position. It will not fill in the last unknown letter. Hard mode rejects a guess that ignores a confirmed clue.",
      },
    ],
  };
}

export function schemaGraph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), websiteSchema(), ...nodes],
  };
}
