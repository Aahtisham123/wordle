import Link from "next/link";

export function GameSeoContent() {
  return (
    <section className="site-container pb-8">
      <div className="prose-content">
        <h2>How to Play Wordle Unlimited</h2>
        <p>
          Choose a word length, type a guess, and read the tiles in <Link href="/">Wordle Unlimited</Link>. You can play another round immediately, switch to the daily word, or open a friend challenge.
        </p>
        <h2>Understanding Wordle Colors</h2>
        <p>
          A green tile, marked with a filled circle, is the correct letter in the correct position. A yellow tile, marked with a half circle, is in the word but not in that position. A gray tile, marked with an open circle, is not available. Extra copies of a letter turn gray once every copy in the answer has been accounted for.
        </p>
        <h2>Choosing the Right Difficulty</h2>
        <p>
          Easy is the roomiest: eight guesses, three hints, and more common words. Medium is the regular six-guess game. Hard keeps six guesses, uses less common words, and later guesses have to respect letters and positions you have already found. You can turn the single hard-mode hint off in settings.
        </p>
        <h2>Custom Word Challenges</h2>
        <p>
          Create a word of 3 to 10 letters, add a clue if you want one, and share the generated link. Friends who open it play that word. The link contains a random id, and the answer stays on the server. There is no live match lobby.
        </p>
        <h2>Word Length Options</h2>
        <p>
          Lengths run from 3 through 10. The board uses smaller tiles for the longer words so a phone can show the whole row. If a category has no answers at that length, the theme is disabled instead of being filled with a made-up word.
        </p>
        <h2>Tips to Improve Your Word Skills</h2>
        <p>
          Start with a guess that uses common vowels, then spend the next guess on new letters. In hard mode, lock the greens before you chase a new idea.
        </p>
        <h2>Common Questions</h2>
        <p>
          The game is free and does not need an account. Statistics on this page’s device cards stay in the browser. Server totals only appear after completed games are recorded.
        </p>
      </div>
    </section>
  );
}
