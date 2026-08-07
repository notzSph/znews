import { describe, expect, it } from "vitest";
import { classifyNewsItem } from "../src/classifier/rules.js";
import type { RawNewsItem } from "../src/domain/types.js";

const baseItem: Omit<RawNewsItem, "id" | "title" | "publishedAt" | "url"> = {
  source: {
    id: "test",
    name: "Test Source",
    url: "https://example.com",
  },
};

describe("classifyNewsItem", () => {
  it("covers livestock and soy-complex supply shocks", () => {
    const result = classifyNewsItem({
      id: "agri-livestock",
      title: "Drought cuts feed supply as feeder cattle and soybean meal prices surge",
      url: "https://example.com/agri-livestock",
      publishedAt: new Date(),
      source: { id: "test", name: "Test", url: "https://example.com" },
    });

    expect(result.impact.direct).toEqual(expect.arrayContaining(["GF", "LE", "HE", "ZM", "ZL"]));
    expect(result.transmissionChannels).toEqual(expect.arrayContaining(["Oilseeds", "Livestock"]));
  });
  it("tags Hormuz escalation with direct energy impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "1",
      title: "Reports say Hormuz closure risk resurfaces after Iran-Israel escalation",
      url: "https://example.com/1",
      publishedAt: new Date("2026-05-21T17:30:00Z"),
    });

    expect(result.category).toBe("Hormuz War");
    expect(result.drivers).toEqual(expect.arrayContaining(["Hormuz/Red Sea", "Geopolitics"]));
    expect(result.transmissionChannels).toEqual(expect.arrayContaining(["Energy", "LNG", "Shipping"]));
    expect(result.impact.direct).toEqual(expect.arrayContaining(["CL", "BRN", "RB", "NG"]));
    expect(result.impact.secondary).toEqual(expect.arrayContaining(["GC", "DXY", "ES", "NQ"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["geopolitical risk", "energy shock", "risk-off"]));
    expect(result.status).toBe("developing");
  });

  it("does not tag isolated Israel/Gaza headlines as energy risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "middle-east-noise",
      title: "Gaza flotilla activists deported from Israel",
      url: "https://example.com/noise",
      publishedAt: new Date("2026-05-21T16:08:00Z"),
    });

    expect(result.category).toBe("Market Structure");
    expect(result.impact.direct).toEqual([]);
  });

  it("tags NATO headlines involving US officials as US foreign policy", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "nato-noise",
      title: "Rubio says US disappointed by NATO",
      url: "https://example.com/nato-noise",
      publishedAt: new Date("2026-05-21T17:00:00Z"),
    });

    expect(result.category).toBe("US");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ES", "NQ", "YM", "DXY"]));
  });

  it("tags broad US foreign-policy headlines as US, not Russia/Ukraine", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "us-foreign",
      title: "Trump punta su Cuba, la portaerei Nimitz ai Caraibi",
      url: "https://example.com/us-foreign",
      publishedAt: new Date("2026-05-21T18:08:00Z"),
    });

    expect(result.category).toBe("US");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ES", "NQ", "YM", "DXY"]));
  });

  it("tags US-China headlines as China/Asia when China is central", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "china-asia",
      title: "China condemns US sanctions over Taiwan",
      url: "https://example.com/china-asia",
      publishedAt: new Date("2026-05-21T18:08:00Z"),
    });

    expect(result.category).toBe("China/Asia");
    expect(result.macroLabels).toEqual(expect.arrayContaining(["trade war", "risk-off"]));
  });

  it("tags policy and international-relations analysis as broad market risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "policy-ir",
      title: "Foreign policy summit weighs sanctions and export controls for strategic supply chains",
      url: "https://example.com/policy-ir",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Policy/IR");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ES", "NQ", "DXY", "GC", "ZN"]));
    expect(result.impact.secondary).toEqual(expect.arrayContaining(["CL", "BRN", "EU"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["geopolitical risk", "risk-off", "sanctions", "trade war"]));
  });

  it("tags Fed and CPI headlines as macro/rates impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "2",
      title: "Fed officials react after CPI inflation surprise",
      url: "https://example.com/2",
      publishedAt: new Date("2026-05-21T12:30:00Z"),
    });

    expect(result.category).toBe("Macro/Central Banks");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ZN", "DXY", "ES", "NQ", "YM", "GC"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["rates", "inflation", "central bank"]));
  });

  it("tags UK macro headlines with sterling and European rates impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "uk-macro",
      title: "UK borrowed bigger than forecast in April as inflation adds to benefits bill",
      url: "https://example.com/uk-macro",
      publishedAt: new Date("2026-05-22T07:05:00Z"),
    });

    expect(result.category).toBe("Macro/Central Banks");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["GU", "FGBL", "FESX", "FDAX", "DXY", "ZN"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["fiscal risk", "inflation"]));
  });

  it("marks configured official feeds as official", () => {
    const result = classifyNewsItem({
      id: "official-ecb",
      source: {
        id: "ecb-press",
        name: "ECB Press Releases",
        url: "https://example.com/rss",
      },
      title: "ECB publishes wage tracker update",
      url: "https://example.com/ecb",
      publishedAt: new Date("2026-05-21T12:30:00Z"),
    });

    expect(result.status).toBe("official");
  });

  it("marks Bank of England feed as official", () => {
    const result = classifyNewsItem({
      id: "official-boe",
      source: {
        id: "boe-news",
        name: "Bank of England",
        url: "https://example.com/rss",
      },
      title: "Bank of England says UK inflation remains above target",
      url: "https://example.com/boe",
      publishedAt: new Date("2026-05-21T12:30:00Z"),
    });

    expect(result.status).toBe("official");
  });

  it("does not tag ordinary Iran diplomatic headlines as Hormuz risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "media-says",
      title: "Pakistan army chief in Iran as US Rubio says slight progress in talks",
      url: "https://example.com/media-says",
      publishedAt: new Date("2026-05-22T19:11:00Z"),
    });

    expect(result.category).toBe("US");
    expect(result.status).toBe("single-source");
  });

  it("does not tag ordinary Italy political-adjacent headlines as fiscal risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "italy-noise",
      title: "Alunna di 10 anni di Filicudi scrive a Meloni, la scuola non è un lusso",
      url: "https://example.com/italy-noise",
      publishedAt: new Date("2026-05-21T12:58:00Z"),
    });

    expect(result.category).toBe("Market Structure");
    expect(result.impact.direct).toEqual([]);
  });

  it("tags Meloni foreign affairs headlines", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "meloni-foreign",
      title: "Meloni presses Kallas on EU sanctions against Ben-Gvir",
      url: "https://example.com/meloni-foreign",
      publishedAt: new Date("2026-05-21T14:00:00Z"),
    });

    expect(result.category).toBe("Italy");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["FESX", "FDAX", "FGBL", "EU"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["geopolitical risk"]));
  });

  it("does not tag ordinary Italian nationality headlines as fiscal risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "italians-noise",
      title: "Final two bodies of missing Italians recovered from inside Maldives cave",
      url: "https://example.com/italians-noise",
      publishedAt: new Date("2026-05-20T17:33:00Z"),
    });

    expect(result.category).toBe("Market Structure");
    expect(result.impact.direct).toEqual([]);
  });

  it("does not tag ordinary local Italy headlines as fiscal risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "anas-noise",
      title: "Solo il 42% usa correttamente il cellulare alla guida, l'indagine Anas",
      summary: "L'indagine descrive abitudini di guida in Italia.",
      url: "https://example.com/anas-noise",
      publishedAt: new Date("2026-05-21T11:47:00Z"),
    });

    expect(result.category).toBe("Market Structure");
    expect(result.impact.direct).toEqual([]);
  });

  it("classifies US military headlines from headline text only", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "summary-only-noise",
      title: "Trump punta su Cuba, la portaerei Nimitz ai Caraibi",
      summary: "Russia and China reacted to the announcement.",
      url: "https://example.com/summary-only-noise",
      publishedAt: new Date("2026-05-21T18:08:00Z"),
    });

    expect(result.category).toBe("US");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ES", "NQ", "YM", "DXY"]));
  });

  it("does not match rating inside unrelated words", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "rating-substring-noise",
      title: "Christine Lagarde: Stablecoins and the future of money: separating functions from instruments",
      url: "https://example.com/rating-substring-noise",
      publishedAt: new Date("2026-05-08T07:00:00Z"),
    });

    expect(result.category).toBe("Market Structure");
    expect(result.impact.direct).toEqual([]);
  });

  it("tags Italy sovereign risk headlines", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "italy-risk",
      title: "Italy BTP spread widens after budget deficit warning",
      url: "https://example.com/italy-risk",
      publishedAt: new Date("2026-05-21T12:58:00Z"),
    });

    expect(result.category).toBe("Italy");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["FESX", "FDAX", "FGBL", "EU"]));
  });

  it("tags El Nino and Super Nino headlines as weather supply-shock risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "enso-super-nino",
      title: "NOAA warns Super El Nino could intensify drought and crop risks across Asia",
      url: "https://example.com/enso-super-nino",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Weather/Agri Supply");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ZW", "ZC", "ZS", "CC", "KC", "SB"]));
    expect(result.impact.direct).not.toEqual(expect.arrayContaining(["CL", "BRN", "NG", "RB"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["weather / infrastructure", "supply shock", "inflation", "risk-off"]));
  });

  it("tags agricultural commodity shocks with direct softs and grains impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "agri-shock",
      title: "Drought threatens cocoa, coffee and wheat harvest as food prices rise",
      url: "https://example.com/agri-shock",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Weather/Agri Supply");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["ZW", "CC", "KC"]));
    expect(result.impact.secondary).toEqual(expect.arrayContaining(["DXY", "GC", "ES", "NQ"]));
  });

  it("tags weather-driven natural-gas shocks without assigning oil", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "weather-natural-gas",
      title: "Arctic freeze lifts natural gas heating demand and disrupts LNG exports",
      url: "https://example.com/weather-natural-gas",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Weather/Agri Supply");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["NG"]));
    expect(result.impact.direct).not.toEqual(expect.arrayContaining(["CL", "BRN", "RB"]));
  });

  it("tags Africa and LatAm resource extraction risk with direct metals and energy impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "resources-em",
      title: "Peru copper mine strike threatens exports as gold output falls in Ghana",
      url: "https://example.com/resources-em",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Resources/EM");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["GC", "SI", "HG", "CL", "BRN"]));
    expect(result.impact.secondary).toEqual(expect.arrayContaining(["DXY", "ES", "NQ"]));
  });

  it("tags shipping disruption with direct energy impact and broad risk spillover", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "shipping-shock",
      title: "Red Sea shipping disruption forces tankers to reroute, lifting freight delays",
      url: "https://example.com/shipping-shock",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Hormuz War");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["CL", "BRN", "RB", "NG"]));
    expect(result.impact.secondary).toEqual(expect.arrayContaining(["ES", "NQ", "DXY", "GC"]));
  });

  it("tags cyber incidents with direct tech/equity impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "cyber-risk",
      title: "CISA warns ransomware exploit is disrupting cloud payment infrastructure",
      url: "https://example.com/cyber-risk",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Cyber/Security");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["NQ", "ES"]));
    expect(result.macroLabels).toEqual(expect.arrayContaining(["cyber / security", "risk-off"]));
  });

  it("tags Japan macro headlines with direct yen and rates impact", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "japan-macro",
      title: "Bank of Japan weighs rate hike as yen intervention risk returns",
      url: "https://example.com/japan-macro",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Macro/Central Banks");
    expect(result.impact.direct).toEqual(expect.arrayContaining(["UJ", "ZN", "DXY", "GC"]));
    expect(result.impact.secondary).toEqual(expect.arrayContaining(["NQ", "ES", "FESX", "FDAX"]));
  });

  it("tags sovereign and monetary crisis news as forex risk", () => {
    const result = classifyNewsItem({
      ...baseItem,
      id: "forex-sovereign",
      title: "Japan weighs currency intervention after fiscal crisis drives yen devaluation fears",
      url: "https://example.com/forex-sovereign",
      publishedAt: new Date("2026-06-29T12:00:00Z"),
    });

    expect(result.category).toBe("Forex/Sovereign");
    expect(result.drivers).toEqual(expect.arrayContaining(["Monetary/Fiscal"]));
    expect(result.transmissionChannels).toEqual(expect.arrayContaining(["FX", "Rates"]));
    expect(result.impact.direct).toEqual(expect.arrayContaining(["EU", "GU", "UJ", "CAD", "CHF", "AU", "NZD", "DXY"]));
  });
});
