"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "The message could not be saved.");
      return;
    }
    setStatus("sent");
    setMessage("Message saved. It is stored for the site operator and is not sent to a third-party inbox.");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-3">
      <label className="grid gap-1 text-sm">
        Name
        <input name="name" required minLength={2} className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input name="email" type="email" required className="h-11 rounded-xl border border-[var(--line)] bg-transparent px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        Message
        <textarea name="message" required minLength={10} rows={6} className="rounded-xl border border-[var(--line)] bg-transparent px-3 py-2" />
      </label>
      <button type="submit" disabled={status === "sending"} className="h-11 rounded-full bg-accent text-sm font-semibold text-white disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
