import { createHash } from "node:crypto";

const stopWords = new Set([
  "after",
  "amid",
  "and",
  "are",
  "against",
  "additional",
  "chief",
  "from",
  "has",
  "have",
  "into",
  "its",
  "more",
  "new",
  "not",
  "over",
  "plan",
  "plans",
  "rubio",
  "say",
  "says",
  "send",
  "sending",
  "sends",
  "sent",
  "deploy",
  "deployed",
  "deploys",
  "the",
  "their",
  "this",
  "to",
  "trump",
  "u",
  "us",
  "was",
  "welcome",
  "welcomes",
  "with",
  "earlier",
  "canceled",
  "cancelled",
  "decision",
  "decisions",
]);

export function contentHash(title: string): string {
  return sha256(normalizeText(title));
}

export function clusterFingerprint(category: string, headline: string): string {
  const terms = normalizeText(headline)
    .split(" ")
    .filter((term) => term.length > 2 && !stopWords.has(term) && !/^\d+$/.test(term))
    .slice(0, 10)
    .sort();

  return sha256(`${category}:${terms.join(" ")}`);
}

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
