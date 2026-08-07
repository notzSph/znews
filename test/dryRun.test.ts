import { describe, expect, it } from "vitest";
import { dryRun, selectDryRunEvents } from "../src/worker/dryRun.js";
import type { NewsEvent } from "../src/domain/types.js";

describe("dryRun", () => {
  it("exposes a runtime test entrypoint", async () => {
    expect(typeof dryRun).toBe("function");
  });

  it("dedupes source-overlap clusters and escalates multi-source status", () => {
    const events: NewsEvent[] = [
      createEvent({
        id: "dw",
        headline: "NATO chief welcomes Trump decision to send troops to Poland",
        sourceId: "dw",
        publishedAt: new Date("2026-05-22T08:59:00Z"),
      }),
      createEvent({
        id: "bbc",
        headline: "Nato chief welcomes US sending 5,000 troops to Poland",
        sourceId: "bbc",
        publishedAt: new Date("2026-05-22T08:41:00Z"),
      }),
    ];

    expect(selectDryRunEvents(events)).toMatchObject([
      {
        id: "dw",
        status: "confirmed",
      },
    ]);
  });
});

function createEvent(overrides: { id: string; headline: string; sourceId: string; publishedAt: Date }): NewsEvent {
  return {
    id: overrides.id,
    publishedAt: overrides.publishedAt,
    category: "US",
    drivers: ["Geopolitics"],
    transmissionChannels: ["FX", "Rates", "Equities"],
    headline: overrides.headline,
    status: "single-source",
    impact: {
      direct: ["ES", "NQ"],
      secondary: ["DXY"],
    },
    macroLabels: ["geopolitical risk"],
    source: {
      id: overrides.sourceId,
      name: overrides.sourceId,
      url: "https://example.com/rss",
    },
    url: `https://example.com/${overrides.id}`,
  };
}
