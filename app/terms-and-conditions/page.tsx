import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "Terms for using the Wordle Unlimited word puzzle.",
  path: "/terms-and-conditions",
});

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms and conditions"
      description="By using the site you agree to these terms. They describe a free browser game, not a paid service."
      path="/terms-and-conditions"
    >
      <h2>The game</h2>
      <p>
        Wordle Unlimited is an independent word puzzle provided as-is for personal entertainment at <a href="https://wordleunlimitedd.com/">https://wordleunlimitedd.com/</a>. It is not affiliated with The New York Times. There is no payment, no account, and no guarantee that the service will be available without interruption.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use the challenge tools to harass someone, and do not send custom words that are meant to threaten or abuse. Do not flood the API. The site may rate-limit requests and drop stored challenges when the local store reaches its cap.
      </p>
      <h2>Your content</h2>
      <p>
        If you create a custom word or send a contact message, you are responsible for what you submit. Do not include information you are not willing to store on the server. See the <Link href="/privacy-policy">privacy policy</Link> for what is saved.
      </p>
      <h2>No warranty</h2>
      <p>
        The puzzles, statistics, and challenge links are provided without a warranty of accuracy, fitness for a particular purpose, or uninterrupted access. To the extent the law allows, the operator is not liable for losses that come from using the site.
      </p>
    </InfoPage>
  );
}
