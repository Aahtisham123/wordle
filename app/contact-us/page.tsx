import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { InfoPage } from "@/components/layout/InfoPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Wordle Unlimited",
  description: "Send a message to the Wordle Unlimited site operator.",
  path: "/contact-us",
});

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact us"
      description="Use this form for questions about the site. Messages are stored for the operator."
      path="/contact-us"
      pageType="ContactPage"
    >
      <p>
        There is no public support inbox connected to this form for <Link href="/">Wordle Unlimited</Link>. Submissions are saved on the server that hosts the site, along with the name, email, and message you enter. Do not include passwords or other secrets.
      </p>
      <ContactForm />
    </InfoPage>
  );
}
