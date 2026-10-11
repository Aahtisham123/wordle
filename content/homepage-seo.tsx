import Link from "next/link";
import { BarChart3, CalendarDays, Infinity, Link2, RefreshCw, Sparkles, Timer } from "lucide-react";

/**
 * Homepage SEO content.
 * Edit this file to change the main homepage copy. The surrounding page
 * layout stays the same. Keep this section at H2 and below — the hero owns
 * the only H1.
 */
export function HomepageSeoContent() {
  return (
    <>
    <div className="intro-split">
      <div className="prose-content">
      <h2>What is Wordle Unlimited?</h2>
      <p>
        The basic idea of the <Link href="/">Wordle Unlimited Game</Link> stays easy to grasp. You face a hidden word, in the tradition of a classic <a href="https://en.wikipedia.org/wiki/Word_game" rel="noopener noreferrer">word game</a>, and try to uncover it within a set number of guesses. After each try the tiles change color to show what works and what does not. Green confirms both the letter and its exact spot, yellow shows the letter belongs somewhere else, and gray tells you to drop that letter entirely. You blend these signals to narrow the possibilities step by step.
      </p>
      <p>
        Once a round finishes, the next one begins right away. You submit a valid word, study the feedback, and adjust your next attempt until you solve it or use your remaining guesses. A completely new secret word appears the instant you choose to continue. No midnight reset interrupts the flow, and nothing forces you to stop after a single success.
      </p>
      </div>
      <WordleIntroArt />
    </div>
    <div className="prose-content">
      <h2>Choose the Kind of Challenge you Want in Wordle Unlimited</h2>
      <p>
        The same board supports several ways to play the Wordle Unlimited Game. You can change mode before a puzzle starts, or confirm a change if a round is already underway.
      </p>
      <ul className="icon-list">
        <li>
          <Infinity size={18} aria-hidden="true" />
          <span>
            <Link href="/wordle-unlimited">Unlimited play</Link> draws a new answer whenever you start another round.
          </span>
        </li>
        <li>
          <CalendarDays size={18} aria-hidden="true" />
          <span>
            <Link href="/wordle-unlimited?mode=daily">The daily puzzle</Link> is the same word for everyone using that length and language on that UTC date.
          </span>
        </li>
        <li>
          <Sparkles size={18} aria-hidden="true" />
          <span>
            <Link href="/wordle-unlimited?mode=practice">Practice</Link> gives you eight guesses and three hints, and it does not change your win streak.
          </span>
        </li>
        <li>
          <Timer size={18} aria-hidden="true" />
          <span>
            <Link href="/wordle-unlimited?mode=timed">Timed play</Link> adds a stopwatch, or a countdown if you want a limit.
          </span>
        </li>
      </ul>
      <h3>Difficulty changes the rules, not just the label</h3>
      <table style={{ tableLayout: "fixed", width: "100%" }}>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Guesses</th>
            <th>Hints</th>
            <th>What else changes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Easy</td>
            <td>8</td>
            <td>Up to 3</td>
            <td>More common words</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>6</td>
            <td>Up to 2</td>
            <td>Standard vocabulary</td>
          </tr>
          <tr>
            <td>Hard</td>
            <td>6</td>
            <td>1, or none</td>
            <td>Less common words, and later guesses must honor revealed clues</td>
          </tr>
        </tbody>
      </table>
      <div className="note">
        <p>
          Hard mode remembers green positions and how many times a letter has been confirmed. If a repeated letter was marked absent, you cannot keep playing extra copies of it.
        </p>
      </div>
      <h2>Wordle Unlimited Themes, Categories, and Languages</h2>
      <p>
        Random puzzles in the Wordle Unlimited Game use a general English list. Themed puzzles use curated answers such as animals, food, countries, or space. If a theme has no words at the length you picked, that combination is disabled and the game explains why instead of inventing a word.
      </p>
      <p>
        US English is the default. UK English uses British spellings such as colour and centre for answers, while still accepting the other regional spelling as a guess so a real word is not rejected as nonsense. Read the <Link href="/how-to-play">how to play guide</Link> or the <Link href="/wordle-tips">tips</Link> before a longer session.
      </p>
      <h3>What stays on your device</h3>
      <ul className="icon-list">
        <li>
          <RefreshCw size={18} aria-hidden="true" />
          <span>Unfinished unlimited puzzles resume after a refresh.</span>
        </li>
        <li>
          <BarChart3 size={18} aria-hidden="true" />
          <span>Wins, losses, streaks, hints, and times are stored in this browser.</span>
        </li>
        <li>
          <Sparkles size={18} aria-hidden="true" />
          <span>Assisted wins are counted apart from wins you solved with no hints.</span>
        </li>
        <li>
          <Link2 size={18} aria-hidden="true" />
          <span>Challenge answers are stored on the server under a random id, not in the link you send.</span>
        </li>
      </ul>
    </div>
    </>
  );
}

function WordleIntroArt() {
  return (
    <div className="intro-graphic" aria-hidden="true">
      <svg viewBox="0 0 420 360" className="h-auto w-full" role="presentation">
        <defs>
          <linearGradient id="intro-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="55%" stopColor="var(--accent-2)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="intro-tile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="210" cy="180" rx="150" ry="120" fill="url(#intro-glow)" />
        <g>
          <rect x="78" y="78" width="264" height="204" rx="28" fill="var(--card-solid)" stroke="var(--line)" />
          <rect x="78" y="78" width="264" height="204" rx="28" fill="url(#intro-tile)" />
          {[
            ["W", 98, 104, "absent"],
            ["O", 164, 104, "present"],
            ["R", 230, 104, "absent"],
            ["D", 296, 104, "correct"],
            ["G", 98, 176, "correct"],
            ["A", 164, 176, "present"],
            ["M", 230, 176, "absent"],
            ["E", 296, 176, "correct"],
          ].map(([letter, x, y, tone]) => (
            <g key={`${letter}-${x}`}>
              <rect
                x={x}
                y={y}
                width="52"
                height="52"
                rx="12"
                fill={tone === "correct" ? "var(--tile-correct)" : tone === "present" ? "var(--tile-present)" : "var(--tile-absent)"}
              />
              <text
                x={Number(x) + 26}
                y={Number(y) + 34}
                textAnchor="middle"
                fontFamily="var(--font-display), sans-serif"
                fontSize="22"
                fontWeight="700"
                fill={tone === "present" ? "var(--tile-present-text)" : tone === "correct" ? "var(--tile-correct-text)" : "var(--tile-absent-text)"}
              >
                {letter}
              </text>
            </g>
          ))}
        </g>
        <g>
          <rect x="28" y="46" width="46" height="46" rx="12" fill="var(--accent)" opacity="0.9" />
          <text x="51" y="76" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontSize="20" fontWeight="700" fill="white">A</text>
          <rect x="342" y="58" width="46" height="46" rx="12" fill="var(--tile-present)" />
          <text x="365" y="88" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontSize="20" fontWeight="700" fill="var(--tile-present-text)">R</text>
          <rect x="318" y="250" width="46" height="46" rx="12" fill="var(--accent-2)" />
          <text x="341" y="280" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontSize="20" fontWeight="700" fill="#042f2e">E</text>
        </g>
      </svg>
    </div>
  );
}
