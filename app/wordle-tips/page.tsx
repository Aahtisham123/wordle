import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Wordle Tips and Strategies",
  description: "Practical Wordle Unlimited strategies for openings, repeated letters, hard mode, and longer words.",
  path: "/wordle-tips",
});

export default function TipsPage() {
  return (
    <InfoPage
      title="Wordle Tips and Strategies"
      description="A short set of habits that help on a five-letter board and still apply when the word gets longer."
      path="/wordle-tips"
    >
      <h2>Open with information</h2>
      <p>
        The first guess in the <Link href="/">Wordle Unlimited Game</Link> is most useful when it tests common letters rather than trying to be the answer. A mix of vowels and frequent consonants tells you more than a guess that repeats a letter you have not confirmed.
      </p>
      <h2>Spend a turn on new letters</h2>
      <p>
        If the first guess produces only grays, use the second guess to test a fresh set. Once you have two or three yellows, then start placing them. Chasing a pattern too early burns a guess you may need later.
      </p>
      <h2>Respect duplicates</h2>
      <p>
        A gray letter is not always absent from the word. It can mean you already matched every copy. Before you ban a letter forever, check whether another tile of the same letter turned green or yellow.
      </p>
      <h3>Hard mode</h3>
      <p>
        Keep green letters where they are. Include every yellow letter, and include a repeated letter as many times as the board has confirmed. If hard mode rejects the row, it is telling you which clue the new guess dropped.
      </p>
      <h2>Longer words</h2>
      <p>
        On eight-, nine-, and ten-letter puzzles, anchors matter. A green near the start or end splits the word into smaller pieces. Categories such as animals or countries shrink the list, but only when that theme actually has words of the length you picked.
      </p>
      <p>
        Practice mode is the place to try these ideas without a streak on the line. Then take them into <Link href="/wordle-unlimited">unlimited play</Link>.
      </p>
    </InfoPage>
  );
}
