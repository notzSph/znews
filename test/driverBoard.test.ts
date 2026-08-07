import { describe, expect, it } from "vitest";
import { formatDriverBoard, positionEvent } from "../src/domain/driverBoard.js";
import type { NewsEvent } from "../src/domain/types.js";

const event: NewsEvent = {
  id: "hormuz-1",
  publishedAt: new Date("2026-07-17T12:00:00Z"),
  category: "Hormuz War",
  drivers: ["Hormuz/Red Sea", "Geopolitics"],
  transmissionChannels: ["Energy", "LNG", "Shipping"],
  headline: "Hormuz closure risk disrupts tanker traffic",
  status: "developing",
  impact: { direct: ["CL", "BRN", "NG"], secondary: ["GC"] },
  macroLabels: ["geopolitical risk", "energy shock"],
  source: { id: "test", name: "Test", url: "https://example.com/rss" },
  url: "https://example.com/hormuz",
};

describe("driver board", () => {
  it("positions multi-driver events in their most specific board", () => {
    expect(positionEvent(event)).toBe("Hormuz & Red Sea");
  });

  it("formats a fixed board post with the latest events", () => {
    const board = formatDriverBoard("Hormuz & Red Sea", [event]);

    expect(board).toContain("**zNews • Hormuz & Red Sea**");
    expect(board).toContain("Hormuz closure risk disrupts tanker traffic");
    expect(board).toContain("**CL BRN NG**");
  });
});
