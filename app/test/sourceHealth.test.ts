import { describe, expect, it } from "vitest";
import { formatSourceHealth } from "../src/worker/sourceHealth.js";

describe("formatSourceHealth", () => {
  it("formats healthy and failed sources", () => {
    const output = formatSourceHealth([
      {
        id: "bbc-world",
        name: "BBC News",
        url: "https://example.com/rss",
        ok: true,
        fetched: 10,
        relevant: 2,
        futureDated: 0,
        latestPublishedAt: new Date("2026-05-21T18:00:00Z"),
      },
      {
        id: "broken",
        name: "Broken",
        url: "https://example.com/broken",
        ok: false,
        fetched: 0,
        relevant: 0,
        futureDated: 0,
        error: "404 Not Found",
      },
    ]);

    expect(output).toContain("OK bbc-world - BBC News - fetched=10 relevant48h=2 future=0 latest=2026-05-21T18:00:00.000Z");
    expect(output).toContain("FAIL broken - Broken - 404 Not Found");
  });
});
