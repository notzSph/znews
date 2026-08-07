import { describe, expect, it } from "vitest";
import { readEnv } from "../src/config/env.js";

describe("readEnv", () => {
  it("reads required and optional environment values", () => {
    expect(
      readEnv({
        DATABASE_URL: "postgres://example",
        DISCORD_TOKEN: " token ",
      }),
    ).toMatchObject({
      databaseUrl: "postgres://example",
      discordToken: "token",
      pollIntervalMs: 60_000,
      timezone: "UTC",
      maxItemAgeHours: 48,
    });
  });

  it("throws when DATABASE_URL is missing", () => {
    expect(() => readEnv({})).toThrow("Missing required environment variable: DATABASE_URL");
  });

  it("can read non-database runtime settings for dry runs", () => {
    expect(readEnv({ ZN_MAX_ITEM_AGE_HOURS: "24" }, { requireDatabaseUrl: false })).toMatchObject({
      databaseUrl: "",
      maxItemAgeHours: 24,
    });
  });

  it("reads an optional driver-board channel", () => {
    expect(readEnv({ DATABASE_URL: "postgres://example", DISCORD_DRIVER_BOARD_CHANNEL_ID: "1507678196496203858" })).toMatchObject({
      discordDriverBoardChannelId: "1507678196496203858",
    });
  });

  it("rejects invalid poll intervals", () => {
    expect(() =>
      readEnv({
        DATABASE_URL: "postgres://example",
        ZN_POLL_INTERVAL_MS: "nope",
      }),
    ).toThrow("Invalid positive integer environment variable: ZN_POLL_INTERVAL_MS");
  });
});
