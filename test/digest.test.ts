import { describe, expect, it } from "vitest";
import { createDigest } from "../src/digest/dailyDigest.js";
import type { NewsEvent } from "../src/domain/types.js";

describe("createDigest", () => {
  it("summarizes events by category, ticker, and macro label", () => {
    const events: NewsEvent[] = [
      {
        id: "1",
        publishedAt: new Date("2026-05-21T16:30:00Z"),
        category: "Russia/Ukraine",
        drivers: ["Russia/Ukraine", "Geopolitics"],
        transmissionChannels: ["Energy", "Grains", "Equities", "Rates"],
        headline: "Zelensky says FSB site hit in Kherson",
        status: "single-source",
        impact: {
          direct: ["FGBL", "FESX"],
          secondary: ["CL", "DXY"],
        },
        macroLabels: ["geopolitical risk", "risk-off"],
        source: {
          id: "ansa",
          name: "ANSA Top News",
          url: "https://example.com",
        },
        url: "https://example.com/zelensky",
      },
    ];

    const digest = createDigest(events);

    expect(digest.eventCount).toBe(1);
    expect(digest.categories).toEqual([{ category: "Russia/Ukraine", count: 1 }]);
    expect(digest.tickers).toEqual(
      expect.arrayContaining([
        { ticker: "CL", count: 1 },
        { ticker: "DXY", count: 1 },
        { ticker: "FESX", count: 1 },
        { ticker: "FGBL", count: 1 },
      ]),
    );
    expect(digest.markdown).toContain("**zNews Daily Market Recap**");
    expect(digest.markdown).toContain("<:crudeoil:1294743881434533898> **CL** (1)");
    expect(digest.markdown).toContain("<:dxy:1294755822290731019> **DXY** (1)");
    expect(digest.markdown).toContain("<:fesx:1531340165195235328> **FESX** (1)");
    expect(digest.markdown).toContain("<:bxy:1294755820864667688> **FGBL** (1)");
    expect(digest.markdown).toContain("Zelensky says FSB site hit in Kherson");
  });

  it("labels session-specific digest recaps", () => {
    expect(createDigest([], 5, "overnight").markdown).toContain("**zNews Overnight Market Recap**");
    expect(createDigest([], 5, "session").markdown).toContain("**zNews Session Market Recap**");
    expect(createDigest([], 5, "session", "Macro, Rates & FX").markdown).toContain("**zNews Session Market Recap • Macro, Rates & FX**");
  });

  it("keeps board digests within Discord's content limit without splitting event cards", () => {
    const event: NewsEvent = {
      id: "large",
      publishedAt: new Date("2026-05-21T16:30:00Z"),
      category: "Hormuz War",
      drivers: ["Hormuz/Red Sea"],
      transmissionChannels: ["Energy", "LNG", "Shipping"],
      headline: "Long-form event with a wide transmission footprint",
      status: "developing",
      impact: { direct: ["CL", "BRN", "NG", "RB"], secondary: ["GC", "DXY", "ES", "NQ", "YM", "ZN", "EU", "FESX", "FDAX", "ZW", "ZC", "ZS", "ZM", "ZL", "CC", "KC", "CT", "LE", "HE"] },
      macroLabels: ["energy shock", "geopolitical risk", "supply shock", "risk-off"],
      source: { id: "test", name: "Test", url: "https://example.com" },
      url: "https://example.com/large",
    };

    const digest = createDigest(Array.from({ length: 10 }, (_, index) => ({ ...event, id: String(index) })), 10, "overnight", "Hormuz & Red Sea");
    expect(digest.markdown.length).toBeLessThanOrEqual(2_000);
    expect(digest.markdown).toContain("**Long-form event with a wide transmission footprint**");
  });
});
