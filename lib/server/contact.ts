import { updateCollection } from "@/lib/server/json-store";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export async function saveContactMessage(input: { name: string; email: string; message: string }) {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (name.length < 2 || name.length > 80) throw new Error("Enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    throw new Error("Enter a valid email address.");
  }
  if (message.length < 10 || message.length > 2000) {
    throw new Error("Write a message between 10 and 2000 characters.");
  }
  const entry: ContactMessage = {
    id: crypto.randomUUID(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };
  await updateCollection<ContactMessage>("contact.json", (items) => [entry, ...items].slice(0, 500));
  return { ok: true as const };
}
