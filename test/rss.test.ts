import { describe, expect, it } from "vitest";
import { parseRss } from "../src/feeds/rss.js";
import type { NewsSource } from "../src/domain/types.js";

const source: NewsSource = {
  id: "fixture",
  name: "Fixture Feed",
  url: "https://example.com/rss.xml",
};

describe("parseRss", () => {
  it("normalizes RSS items into raw news items", () => {
    const items = parseRss(
      `<?xml version="1.0"?>
      <rss version="2.0">
        <channel>
          <item>
            <title>Fed says policy remains data dependent</title>
            <link>https://example.com/fed</link>
            <description>Officials discuss rates and inflation.</description>
            <pubDate>Thu, 21 May 2026 12:30:00 GMT</pubDate>
          </item>
        </channel>
      </rss>`,
      source,
    );

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "fixture:https://example.com/fed",
      title: "Fed says policy remains data dependent",
      url: "https://example.com/fed",
      summary: "Officials discuss rates and inflation.",
    });
  });

  it("normalizes Atom entries", () => {
    const items = parseRss(
      `<?xml version="1.0"?>
      <feed>
        <entry>
          <title>ECB announces policy decision</title>
          <link href="https://example.com/ecb" rel="alternate" />
          <summary>Rates decision published.</summary>
          <updated>2026-05-21T12:45:00Z</updated>
        </entry>
      </feed>`,
      source,
    );

    expect(items).toHaveLength(1);
    expect(items[0].url).toBe("https://example.com/ecb");
  });

  it("normalizes RDF items", () => {
    const items = parseRss(
      `<?xml version="1.0"?>
      <rdf:RDF>
        <item>
          <title>Russia and Ukraine talks continue</title>
          <link>https://example.com/rdf</link>
          <description>Diplomatic update.</description>
          <pubDate>Thu, 21 May 2026 18:30:00 GMT</pubDate>
        </item>
      </rdf:RDF>`,
      source,
    );

    expect(items).toHaveLength(1);
    expect(items[0].url).toBe("https://example.com/rdf");
  });

  it("normalizes RDF items with Dublin Core dates", () => {
    const items = parseRss(
      `<?xml version="1.0"?>
      <rdf:RDF xmlns:dc="http://purl.org/dc/elements/1.1/">
        <item>
          <title>US to send troops to Poland</title>
          <link>https://example.com/dc-rdf</link>
          <description>NATO deployment update.</description>
          <dc:date>2026-05-22T07:32:20Z</dc:date>
        </item>
      </rdf:RDF>`,
      source,
    );

    expect(items).toHaveLength(1);
    expect(items[0].publishedAt.toISOString()).toBe("2026-05-22T07:32:20.000Z");
  });
});
