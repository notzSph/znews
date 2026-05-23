import { describe, expect, it } from "vitest";
import { DiscordPoster } from "../src/discord/poster.js";

describe("DiscordPoster", () => {
  it("does not post without Discord config", async () => {
    const poster = new DiscordPoster({});

    await expect(poster.postTapeLine("test")).resolves.toEqual({
      posted: false,
      reason: "missing-config",
    });
  });
});
