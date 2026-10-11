import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Wordle Unlimited",
  description: "Wordle Unlimited is an independent word puzzle with unlimited rounds, adjustable length, and friend challenges.",
  path: "/about-us",
});

export default function AboutPage() {
  return (
    <InfoPage
      title="About Wordle Unlimited"
      description="An independent word puzzle for people who want another round when the last one ends."
      path="/about-us"
      pageType="AboutPage"
    >
      <p>
        <Link href="/">Wordle Unlimited</Link> is a browser game. You can play a general English word, pick a theme, change the length from 3 to 10 letters, and send a friend the same puzzle. It does not require an account.
      </p>
      <p>
        The project is not affiliated with The New York Times or the official Wordle. The tile feedback follows the familiar correct, present, and absent pattern, including a count for repeated letters, and the surrounding modes are specific to this site.
      </p>
      <p>
        Personal statistics stay in your browser. Challenge words are stored on the server so a link can load the same puzzle on another device. Community totals count completed games that reach the server, and they are not filled in with estimated traffic.
      </p>
      <p>
        Questions about the site can go through the <Link href="/contact-us">contact form</Link>. The rules are on <Link href="/how-to-play">how to play</Link>.
      </p>
    </InfoPage>
  );
}
