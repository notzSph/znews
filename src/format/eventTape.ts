import type { NewsEvent, StatusLabel, Ticker } from "../domain/types.js";

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
    `${formatStatusPrefix(event.status)} \`${event.status}\``,
    `🌍 • **Macro:** ${macro}`,
    `🗞️ • **Source:** [${escapeMarkdown(event.source.name)}](${event.url})`,
  ].join("\n");
}

const tickerEmoji: Partial<Record<Ticker, string>> = {
  AU: "<:axy:1535238529255350345>",
  BRN: "<:crudeoil:1294743881434533898>",
  CAD: "<:cxy:1535631926809989120>",
  CC: "<:cc:1535238531021013032>",
  CL: "<:crudeoil:1294743881434533898>",
  CHF: "<:sxy:1535238586184503336>",
  CT: "<:ct:1535238533269422080>",
  DXY: "<:dxy:1294755822290731019>",
  ES: "<:es:1294720279192535090>",
  EU: "<:exy:1294755823893086279>",
  FDAX: "<:dax:1294743837092352022>",
  FESX: "<:fesx:1531340165195235328>",
  FGBL: "<:bxy:1294755820864667688>",
  FIB: "<:fib:1531340167569477662>",
  GC: "<:gold:1294720270199951444>",
  HE: "<:he:1535238535399874652>",
  HG: "<:hg:1535238536855556196>",
  KC: "<:kc:1535238538705244271>",
  LE: "<:le:1535238582590115870>",
  NG: "<:ng:1531340171214196786>",
  NQ: "<:nq:1531340173395234856>",
  NZD: "<:zxy:1535630504483754055>",
  RB: "<:rb:1535238584372690944>",
  RTY: "<:rty:1531340177190948934>",
  SI: "<:si:1531340179108008177>",
  UJ: "<:jxy:1531572491439571278>",
  US: "<:us:1531341929311244419>",
  YM: "<:ym:1294743731643351212>",
  ZC: "<:zc:1535238587497451540>",
  ZL: "<:zl:1535238588797685801>",
  ZM: "<:zm:1535238589930274840>",
  ZN: "<:us:1531341929311244419>",
  ZS: "<:zs:1535238592140542034>",
  ZW: "<:zw:1535238594040696932>",
};

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(", ") : "none";
}

function formatInlineCodeList(values: string[]): string {
  return values.length > 0 ? values.map(formatTicker).join(" ") : "**none**";
}

export function formatTicker(value: string): string {
  const emoji = tickerEmoji[value as Ticker];
  return emoji ? `${emoji} **${value}**` : `**${value}**`;
}

function formatStatusPrefix(status: StatusLabel): string {
  switch (status) {
    case "single-source":
      return "⚠️ •";
    case "confirmed":
      return "✅ •";
    case "official":
      return "🏛️ •";
    case "developing":
      return "🟡 •";
    case "claim":
      return "❗ •";
    case "correction":
      return "🔁 •";
  }
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("*", "\\*").replaceAll("_", "\\_").replaceAll("`", "\\`");
}
