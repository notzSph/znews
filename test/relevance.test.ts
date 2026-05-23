import { describe, expect, it } from "vitest";
import { createEventFromRawItem } from "../src/event/createEvent.js";
import { isMarketRelevant } from "../src/filter/relevance.js";
import type { RawNewsItem } from "../src/domain/types.js";

const baseItem: Omit<RawNewsItem, "id" | "title" | "url" | "publishedAt"> = {
  source: {
    id: "test",
    name: "Test Source",
    url: "https://example.com",
  },
};

describe("isMarketRelevant", () => {
  it("keeps geopolitical market-risk headlines", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "1",
      title: "Zelensky says FSB site hit in Kherson",
      url: "https://example.com/1",
      publishedAt: new Date("2026-05-21T15:40:00Z"),
    });

    expect(event.category).toBe("Russia/Ukraine");
    expect(isMarketRelevant(event)).toBe(true);
  });

  it("drops ordinary non-market noise", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "2",
      title: "Charges dismissed against official at school where 6-year-old shot teacher",
      url: "https://example.com/2",
      publishedAt: new Date("2026-05-21T16:20:00Z"),
    });

    expect(isMarketRelevant(event)).toBe(false);
  });

  it("drops stale items when max age is configured", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "3",
      title: "Iran steps up claim to control Strait of Hormuz",
      url: "https://example.com/3",
      publishedAt: new Date("2026-05-18T12:00:00Z"),
    });

    expect(isMarketRelevant(event, { now: new Date("2026-05-21T12:00:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("drops future-dated feed items", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "4",
      title: "Oil supply disruption hits crude prices",
      url: "https://example.com/4",
      publishedAt: new Date("2026-05-27T12:00:00Z"),
    });

    expect(isMarketRelevant(event, { now: new Date("2026-05-21T12:00:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("drops low-signal sports and domestic political noise even when keywords match", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "5",
      title: "Iran’s World Cup hopes hit US visa hurdles",
      url: "https://example.com/5",
      publishedAt: new Date("2026-05-21T18:19:00Z"),
    });

    expect(isMarketRelevant(event, { now: new Date("2026-05-21T18:30:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("drops ordinary company retail noise even when it mentions fuel prices", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "6",
      title: "Walmart warns US shoppers are cutting spending as higher petrol prices bite",
      url: "https://example.com/6",
      publishedAt: new Date("2026-05-21T18:08:00Z"),
    });

    expect(isMarketRelevant(event, { now: new Date("2026-05-21T18:30:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("drops minor US sanctions without a strategic market channel", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "7",
      title: "US sanctions Tanzanian police official over torture of rights activists",
      url: "https://example.com/7",
      publishedAt: new Date("2026-05-22T06:40:00Z"),
    });

    expect(event.category).toBe("US");
    expect(isMarketRelevant(event, { now: new Date("2026-05-22T07:00:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("keeps US military threats that can move geopolitical risk", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "8",
      title: "US raises threat of military action against Cuba",
      url: "https://example.com/8",
      publishedAt: new Date("2026-05-22T07:22:00Z"),
    });

    expect(event.category).toBe("US");
    expect(isMarketRelevant(event, { now: new Date("2026-05-22T07:30:00Z"), maxAgeHours: 48 })).toBe(true);
  });

  it("drops US political budget noise with no market channel", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "9",
      title: "US Senate pushes back against Trump’s $1.8bn anti-weaponisation fund",
      url: "https://example.com/9",
      publishedAt: new Date("2026-05-22T00:26:00Z"),
    });

    expect(event.category).toBe("US");
    expect(isMarketRelevant(event, { now: new Date("2026-05-22T07:30:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("drops US personnel churn from liveblogs even when the summary has market keywords", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "personnel-liveblog",
      title: "Tulsi Gabbard resigns as national intelligence director, with Trump naming Aaron Lukas as acting DNI chief – US politics live",
      summary: "The liveblog also covered China, Iran war powers and Nato.",
      url: "https://example.com/personnel-liveblog",
      publishedAt: new Date("2026-05-22T19:17:00Z"),
    });

    expect(event.category).toBe("US");
    expect(isMarketRelevant(event, { now: new Date("2026-05-22T19:30:00Z"), maxAgeHours: 48 })).toBe(false);
  });

  it("drops market recap headlines that are not original catalysts", () => {
    const event = createEventFromRawItem({
      ...baseItem,
      id: "10",
      title: "Borsa: L'Europa apre positiva con i tecnologici, resta lente su Usa-Iran",
      url: "https://example.com/10",
      publishedAt: new Date("2026-05-22T07:30:00Z"),
    });

    expect(event.category).toBe("Middle East");
    expect(isMarketRelevant(event, { now: new Date("2026-05-22T07:35:00Z"), maxAgeHours: 48 })).toBe(false);
  });
});
