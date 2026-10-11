import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Wordle Unlimited stores statistics, preferences, challenge words, and contact messages.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy policy"
      description="This page describes the data the game actually stores. It is not a promise of a legal review."
      path="/privacy-policy"
    >
      <h2>What stays on your device</h2>
      <p>
        Theme, sound, contrast, language, and other preferences are saved in local storage. Game statistics are saved there too. An unfinished unlimited puzzle, including its answer, is saved so it can resume after a refresh. Clearing the site data in your browser removes these items. They are not attached to an account because the site does not have accounts.
      </p>
      <h2>What is stored on the server</h2>
      <ul>
        <li>Custom and shared challenges: the secret word, clue, length, difficulty, language, and a random id.</li>
        <li>Puzzle sessions: guesses and hint state for a daily puzzle or a challenge, so the answer does not have to be sent to the browser before the round ends.</li>
        <li>Community events: the outcome of a completed game, without a name or email. A random game id is kept so the same result is not counted twice.</li>
        <li>Contact messages: the name, email, and message you submit.</li>
      </ul>
      <h2>What is not collected</h2>
      <p>
        The app does not run an advertising network, sell personal information, or build a marketing profile. Rate limits may hash an IP address in server memory so the API cannot be flooded. Those hashes are not written into the community statistics.
      </p>
      <h2>How long it is kept</h2>
      <p>
        Challenge and session files are capped and older entries drop off. Contact messages are capped as well. You can reset the statistics on your own device from the statistics panel. To ask about a contact message or a challenge stored on the server, use the contact form. The public site is <a href="https://wordleunlimitedd.com/">https://wordleunlimitedd.com/</a>.
      </p>
    </InfoPage>
  );
}
