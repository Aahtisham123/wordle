import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "DMCA",
  description: "How to send a copyright notice about material on Wordle Unlimited.",
  path: "/dmca",
});

export default function DmcaPage() {
  return (
    <InfoPage
      title="DMCA"
      description="Use this page if you believe material on the site infringes a copyright you own."
      path="/dmca"
    >
      <p>
        <Link href="/">Wordle Unlimited</Link> is an independent browser word puzzle. It is not affiliated with The New York Times. Puzzle words come from dictionary lists and from words a player chooses for a custom challenge.
      </p>
      <h2>Sending a notice</h2>
      <p>
        If you are the copyright owner, or authorized to act for the owner, send a notice through the <Link href="/contact-us">contact form</Link>. Include:
      </p>
      <ul>
        <li>Your name and a way to reach you.</li>
        <li>The work you believe is infringed.</li>
        <li>The page or puzzle on this site where the material appears.</li>
        <li>A statement that you have a good-faith belief the use is not authorized.</li>
        <li>A statement that the information is accurate and that you are the owner or authorized to act for the owner.</li>
        <li>Your physical or electronic signature.</li>
      </ul>
      <p>
        Do not include passwords or other secrets in the message. A notice that does not identify the material and where it appears cannot be acted on.
      </p>
      <h2>Custom words</h2>
      <p>
        Players who create a custom word are responsible for the text they submit. If a challenge link contains material that should come down, include the link in the notice.
      </p>
    </InfoPage>
  );
}
