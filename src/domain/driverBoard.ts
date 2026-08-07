import type { BoardThread, NewsDriver, NewsEvent, Ticker } from "./types.js";

export const boardDriverOrder: NewsDriver[] = [
  "Hormuz/Red Sea",
  "Russia/Ukraine",
  "European Sovereign Risk",
  "Monetary/Fiscal",
  "Global Macro/Central Banks",
  "US Policy/Politics",
  "China/Asia",
  "Energy/LNG",
  "Agriculture/Supply",
  "Weather/Climate",
  "Shipping/Choke Point",
  "Trade Policy/Sanctions",
  "Resources/EM",
  "Cyber/Security",
  "Geopolitics",
];

export const boardThreads: BoardThread[] = [
  "Hormuz & Red Sea",
  "Russia & Ukraine",
  "Geopolitics & Conflict",
  "Macro, Rates & FX",
  "Energy, LNG & Shipping",
  "Agriculture & Weather",
  "China & Asia",
  "Trade Policy & Sanctions",
  "Resources & Emerging Markets",
  "Cyber & Market Structure",
];

const driverThreads: Record<NewsDriver, BoardThread> = {
  "Hormuz/Red Sea": "Hormuz & Red Sea",
  "Russia/Ukraine": "Russia & Ukraine",
  "European Sovereign Risk": "Macro, Rates & FX",
  "Monetary/Fiscal": "Macro, Rates & FX",
  "Global Macro/Central Banks": "Macro, Rates & FX",
  "US Policy/Politics": "Geopolitics & Conflict",
  "China/Asia": "China & Asia",
  "Energy/LNG": "Energy, LNG & Shipping",
  "Agriculture/Supply": "Agriculture & Weather",
  "Weather/Climate": "Agriculture & Weather",
  "Shipping/Choke Point": "Energy, LNG & Shipping",
  "Trade Policy/Sanctions": "Trade Policy & Sanctions",
  "Resources/EM": "Resources & Emerging Markets",
  "Cyber/Security": "Cyber & Market Structure",
  Geopolitics: "Geopolitics & Conflict",
};

export function positionEvent(event: NewsEvent): BoardThread | undefined {
  const driver = boardDriverOrder.find((candidate) => event.drivers.includes(candidate));
  return driver ? driverThreads[driver] : undefined;
}

export function formatDriverBoard(thread: BoardThread, events: NewsEvent[]): string {
  const lines = events.slice(0, 10).map(formatEventLine);
  return [`**zNews • ${thread}**`, "Latest relevant events", "", ...(lines.length ? lines : ["_No events yet._"])].join("\n").slice(0, 1_900);
}

function formatEventLine(event: NewsEvent): string {
  const direct = event.impact.direct.length ? ` • **${formatTickers(event.impact.direct)}**` : "";
  const headline = event.headline.length > 220 ? `${event.headline.slice(0, 217)}...` : event.headline;
  return `• [${escapeMarkdown(headline)}](${event.url})${direct}`;
}

function formatTickers(tickers: Ticker[]): string {
  return tickers.join(" ");
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
}
