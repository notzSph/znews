import { describe, expect, it } from "vitest";
import { formatTapeLine, formatTapeMarkdown } from "../src/format/eventTape.js";
import type { NewsEvent } from "../src/domain/types.js";

describe("formatTapeLine", () => {
  it("formats compact market event lines", () => {
    const event: NewsEvent = {
      id: "event-1",
      publishedAt: new Date("2026-05-21T17:30:00Z"),
      category: "Hormuz War",
      drivers: ["Hormuz/Red Sea", "Geopolitics"],
      transmissionChannels: ["Energy", "LNG", "Shipping"],
      headline: "Hormuz closure reports resurface",
      status: "developing",
      impact: {
        direct: ["CL", "BRN", "RB"],
        secondary: ["GC", "ES", "NQ"],
      },
      macroLabels: ["supply shock", "risk-off"],
      source: {
        id: "test",
        name: "Test Source",
        url: "https://example.com",
      },
      url: "https://example.com/hormuz",
    };

    expect(formatTapeLine(event)).toBe(
      "21/05/2026 13:30 ET - Hormuz War - Hormuz closure reports resurface - direct: CL, BRN, RB - secondary: GC, ES, NQ - developing - supply shock, risk-off - https://example.com/hormuz",
    );
  });

  it("formats Discord-friendly markdown event cards", () => {
    const event: NewsEvent = {
      id: "event-1",
      publishedAt: new Date("2026-05-21T17:30:00Z"),
      category: "Hormuz War",
      drivers: ["Hormuz/Red Sea", "Geopolitics"],
      transmissionChannels: ["Energy", "LNG", "Shipping"],
      headline: "Hormuz closure reports resurface",
      status: "developing",
      impact: {
        direct: ["CL", "BRN", "RB"],
        secondary: ["GC", "ES", "NQ"],
      },
      macroLabels: ["supply shock", "risk-off"],
      source: {
        id: "test",
        name: "Test Source",
        url: "https://example.com",
      },
      url: "https://example.com/hormuz",
    };

    expect(formatTapeMarkdown(event)).toBe(
      [
        "**Hormuz closure reports resurface**",
        "⏰ • `21/05/2026 13:30 ET`",
        "📚 • **Hormuz War**",
        "🚨 • **Direct:** <:crudeoil:1294743881434533898> **CL** <:crudeoil:1294743881434533898> **BRN** <:crudeoil:1294743881434533898> **RB**",
        "🔔 • **Secondary:** <:gold:1294720270199951444> **GC** <:es:1294720279192535090> **ES** <:nq:1294720287262244904> **NQ**",
        "🟡 • `developing`",
        "🌍 • **Macro:** **supply shock** **risk-off**",
        "🗞️ • **Source:** [Test Source](https://example.com/hormuz)",
      ].join("\n"),
    );
  });

  it("formats none without code styling", () => {
    const event: NewsEvent = {
      id: "event-2",
      publishedAt: new Date("2026-05-21T17:30:00Z"),
      category: "Market Structure",
      drivers: [],
      transmissionChannels: [],
      headline: "Unclassified headline",
      status: "single-source",
      impact: {
        direct: [],
        secondary: [],
      },
      macroLabels: [],
      source: {
        id: "test",
        name: "Test Source",
        url: "https://example.com",
      },
      url: "https://example.com/no-impact",
    };

    expect(formatTapeMarkdown(event)).toContain("🚨 • **Direct:** **none**");
    expect(formatTapeMarkdown(event)).toContain("🔔 • **Secondary:** **none**");
    expect(formatTapeMarkdown(event)).toContain("⚠️ • `single-source`");
    expect(formatTapeMarkdown(event)).toContain("🌍 • **Macro:** **none**");
  });
});
