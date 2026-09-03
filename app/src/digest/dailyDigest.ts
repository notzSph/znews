import type { Category, MacroLabel, NewsEvent, Ticker } from "../domain/types.js";
import { formatTapeMarkdown, formatTicker } from "../format/eventTape.js";

// Discord bots are limited to 2,000 characters per message.
const DISCORD_MAX_CONTENT_LENGTH = 2_000;

export interface DigestSummary {
  eventCount: number;
  categories: Array<{ category: Category; count: number }>;
  tickers: Array<{ ticker: Ticker; count: number }>;
  macroLabels: Array<{ label: MacroLabel; count: number }>;
  topEvents: NewsEvent[];
  markdown: string;
}

export function createDigest(
  events: NewsEvent[],
  limit = 5,
  type: "daily" | "weekly" | "overnight" | "session" = "daily",
  scope?: string,
): DigestSummary {
  const sortedEvents = [...events].sort((left, right) => eventImportance(right) - eventImportance(left) || right.publishedAt.getTime() - left.publishedAt.getTime());
  const topEvents = sortedEvents.slice(0, limit);

  const summary = {
    eventCount: events.length,
    categories: countCategories(events.map((event) => event.category)),
    tickers: countTickers(events.flatMap((event) => [...event.impact.direct, ...event.impact.secondary])),
    macroLabels: countMacroLabels(events.flatMap((event) => event.macroLabels)),
    topEvents,
  };

  return {
    ...summary,
    markdown: formatDigestMarkdown(summary, type, scope),
  };
}

function formatDigestMarkdown(
  summary: Omit<DigestSummary, "markdown">,
  type: "daily" | "weekly" | "overnight" | "session",
  scope?: string,
): string {
  const lines = [
    `**zNews ${digestLabel(type)} Market Recap${scope ? ` • ${scope}` : ""}**`,
    `Coverage: **${summary.eventCount}** material events`,
    `**Markets requiring attention:** ${formatTickerCounts(summary.tickers)}`,
    `**Main risks:** ${formatCounts(summary.macroLabels)}`,
    "",
    "**What matters before the session**",
  ];

  let markdown = lines.join("\n");
  for (const event of summary.topEvents) {
    const card = `\n\n${formatTapeMarkdown(event)}`;
    if (markdown.length + card.length > DISCORD_MAX_CONTENT_LENGTH) break;
    markdown += card;
  }
  return markdown;
}

function digestLabel(type: "daily" | "weekly" | "overnight" | "session"): string {
  if (type === "weekly") return "Weekly";
  if (type === "overnight") return "Overnight";
  if (type === "session") return "Session";
  return "Daily";
}

function eventImportance(event: NewsEvent): number {
  const riskLabels = new Set(["war escalation", "energy shock", "supply shock", "financial risk", "fiscal risk", "banking risk", "currency intervention"]);
  return event.impact.direct.length * 4 + event.impact.secondary.length + event.macroLabels.filter((label) => riskLabels.has(label)).length * 3;
}

function countCategories(values: Category[]): Array<{ category: Category; count: number }> {
  return countValues(values).map(({ value, count }) => ({ category: value, count }));
}

function countTickers(values: Ticker[]): Array<{ ticker: Ticker; count: number }> {
  return countValues(values).map(({ value, count }) => ({ ticker: value, count }));
}

function countMacroLabels(values: MacroLabel[]): Array<{ label: MacroLabel; count: number }> {
  return countValues(values).map(({ value, count }) => ({ label: value, count }));
}

function countValues<T extends string>(values: T[]): Array<{ value: T; count: number }> {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([value, count]) => ({ value, count }));
}

function formatCounts<T extends { count: number }>(items: T[]): string {
  if (items.length === 0) return "**none**";

  return items
    .slice(0, 6)
    .map((item) => {
      const [label] = Object.entries(item).find(([key]) => key !== "count") ?? ["", ""];
      const value = item[label as keyof T];
      return `**${String(value)}** (${item.count})`;
    })
    .join(", ");
}

function formatTickerCounts(items: Array<{ ticker: Ticker; count: number }>): string {
  if (items.length === 0) return "**none**";
  return items
    .slice(0, 6)
    .map(({ ticker, count }) => `${formatTicker(ticker)} (${count})`)
    .join(", ");
}
