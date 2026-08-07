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

  it("does not sync driver boards without Discord config", async () => {
    const poster = new DiscordPoster({});

    await expect(poster.syncDriverBoard("Test", "test")).resolves.toEqual({
      posted: false,
      reason: "missing-config",
    });
  });
});
