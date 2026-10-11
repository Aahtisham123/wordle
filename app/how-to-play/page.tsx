import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";
import { howToSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "How to Play Wordle Unlimited",
  description: "Learn the rules for Wordle Unlimited, including tile colors, repeated letters, difficulty modes, and hints.",
  path: "/how-to-play",
});

export default function HowToPlayPage() {
  return (
    <InfoPage
      title="How to Play Wordle Unlimited"
      description="Guess the hidden word. Each guess has to be a real word of the length you chose."
      path="/how-to-play"
      extra={[howToSchema()]}
    >
      <h2>The goal</h2>
      <p>
        You have a limited number of guesses in <Link href="/">Wordle Unlimited</Link>. Easy mode allows eight. Medium, hard, and the daily puzzle allow six unless a custom challenge sets a different limit. Practice always allows eight and does not change your streak.
      </p>
      <h2>What the tiles mean</h2>
      <ul>
        <li>Green, with a filled circle: the letter is correct and in the right position.</li>
        <li>Yellow, with a half circle: the letter is in the word, but not in that position.</li>
        <li>Gray, with an open circle: that copy of the letter is not available.</li>
      </ul>
      <p>
        If the answer contains one L and your guess contains two, only one L can turn green or yellow. The extra L turns gray. That same counting rule is what hard mode enforces on the next guess.
      </p>
      <h2>Making a guess</h2>
      <p>
        Use the on-screen keyboard or your physical keyboard. Enter submits the row. Backspace deletes the last letter you typed, but it will not remove a letter a hint has locked. Guesses are checked against the US or UK word list. In a custom challenge, any letters of the right length are accepted so a name or personal word can be the answer.
      </p>
      <h2>Hints and hard mode</h2>
      <p>
        A hint can show a short clue, remove a letter that is not in the word, reveal one correct position, or remind you of the theme. It will not fill in the last unknown letter. Wins that used a hint are labeled assisted. Hard mode rejects a guess that ignores a confirmed position or a confirmed letter count.
      </p>
      <p>
        When you are ready, play a puzzle or read the tips.
      </p>
    </InfoPage>
  );
}
