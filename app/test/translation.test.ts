import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchRssSource } from "../src/feeds/rss.js";
import type { NewsSource } from "../src/domain/types.js";

const source: NewsSource = {
  id: "ru-fixture",
  name: "Russian Fixture",
  url: "https://example.com/rss.xml",
  translate: {
    from: "ru",
    to: "en",
  },
};

describe("headline translation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("translates Cyrillic RSS titles before returning raw items", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.startsWith("https://translate.googleapis.com/translate_a/single")) {
        return new Response(JSON.stringify([[["Gold mining output rises in Russia", "Добыча золота в России выросла"]]]), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      return new Response(
        `<?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <item>
              <title>Добыча золота в России выросла</title>
              <link>https://example.com/gold</link>
              <pubDate>Mon, 29 Jun 2026 12:30:00 GMT</pubDate>
            </item>
          </channel>
        </rss>`,
        {
          status: 200,
          headers: { "content-type": "application/xml" },
        },
      );
    });

    const items = await fetchRssSource(source);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(items[0].title).toBe("Gold mining output rises in Russia");
  });

  it("keeps original Cyrillic text if translation fails", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.startsWith("https://translate.googleapis.com/translate_a/single")) {
        return new Response("blocked", { status: 403 });
      }

      return new Response(
        `<?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <item>
              <title>Российский экспорт нефти вырос</title>
              <link>https://example.com/oil</link>
              <pubDate>Mon, 29 Jun 2026 12:30:00 GMT</pubDate>
            </item>
          </channel>
        </rss>`,
        {
          status: 200,
          headers: { "content-type": "application/xml" },
        },
      );
    });

    const items = await fetchRssSource(source);

    expect(items[0].title).toBe("Российский экспорт нефти вырос");
  });
});
