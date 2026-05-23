import type pg from "pg";
import { readEnv } from "../config/env.js";
import type { DiscordPoster } from "../discord/poster.js";
import { pollOnce } from "./pollOnce.js";

export async function pollLoop(pool: pg.Pool, poster: DiscordPoster): Promise<never> {
  const env = readEnv();

  for (;;) {
    const startedAt = Date.now();
    const result = await pollOnce({ pool, poster });
    console.log(`Poll complete: ${JSON.stringify(result)}`);

    const elapsed = Date.now() - startedAt;
    const delay = Math.max(1_000, env.pollIntervalMs - elapsed);
    await sleep(delay);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
