import type { NewsEvent, Ticker } from "../domain/types.js";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/New_York",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const timeZoneLabel = "ET";

export function formatTapeLine(event: NewsEvent): string {
  const timestamp = `${dateFormatter.format(event.publishedAt).replace(",", "")} ${timeZoneLabel}`;
  const direct = formatList(event.impact.direct);
  const secondary = formatList(event.impact.secondary);
  const macro = formatList(event.macroLabels);

  return [
    timestamp,
    event.category,
    event.headline,
    `direct: ${direct}`,
    `secondary: ${secondary}`,
    event.status,
    macro,
    event.url,
  ].join(" - ");
}

export function formatTapeMarkdown(event: NewsEvent): string {
  const timestamp = `${dateFormatter.format(event.publishedAt).replace(",", "")} ${timeZoneLabel}`;
  const direct = formatInlineCodeList(event.impact.direct);
  const secondary = formatInlineCodeList(event.impact.secondary);
  const macro = formatInlineCodeList(event.macroLabels);

  return [
    `**${escapeMarkdown(event.headline)}**`,
    `⏰ • \`${timestamp}\``,
    `📚 • **${event.category}**`,
    `🚨 • **Direct:** ${direct}`,
    `🔔 • **Secondary:** ${secondary}`,
    `⚠️ • \`${event.status}\``,
    `🌍 • **Macro:** ${macro}`,
    `🗞️ • **Source:** [${escapeMarkdown(event.source.name)}](${event.url})`,
  ].join("\n");
}

const tickerEmoji: Partial<Record<Ticker, string>> = {
  BRN: "<:crudeoil:1294743881434533898>",
  CL: "<:crudeoil:1294743881434533898>",
  DXY: "<:dxy:1294755822290731019>",
  ES: "<:es:1294720279192535090>",
  FDAX: "<:dax:1294743837092352022>",
  FESX: "<:exy:1294755823893086279>",
  FGBL: "<:bxy:1294755820864667688>",
  GC: "<:gold:1294720270199951444>",
  NQ: "<:nq:1294720287262244904>",
  RB: "<:crudeoil:1294743881434533898>",
  YM: "<:ym:1294743731643351212>",
};

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(", ") : "none";
}

function formatInlineCodeList(values: string[]): string {
  return values.length > 0 ? values.map(formatTickerOrValue).join(" ") : "**none**";
}

function formatTickerOrValue(value: string): string {
  const emoji = tickerEmoji[value as Ticker];
  return emoji ? `${emoji} **${value}**` : `**${value}**`;
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("*", "\\*").replaceAll("_", "\\_").replaceAll("`", "\\`");
}
