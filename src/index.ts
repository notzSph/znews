import "dotenv/config";
import { readEnv } from "./config/env.js";
import { createDbPool } from "./db/client.js";
import { DiscordPoster } from "./discord/poster.js";
import { createDigest } from "./digest/dailyDigest.js";
import { dryRun } from "./worker/dryRun.js";
import { formatDryRunLiveSim, formatDryRunSummary } from "./worker/dryRunReport.js";
import { pollLoop } from "./worker/pollLoop.js";
import { pollOnce } from "./worker/pollOnce.js";
import { checkSources, formatSourceHealth } from "./worker/sourceHealth.js";

const command = process.argv[2] ?? "help";

if (command === "dry-run" || command === "digest:dry-run" || command === "dry-run:live") {
  const limit = Number.parseInt(process.argv[3] ?? "10", 10);
  const result = await dryRun(Number.isFinite(limit) ? limit : 10);

  if (command === "dry-run:live") {
    for (const item of formatDryRunLiveSim(result)) {
      console.log(item);
      console.log("");
    }
    process.exit(0);
  }

  console.log(formatDryRunSummary(result));
  for (const error of result.errors) {
    console.log(`ERROR ${error}`);
  }
  for (const line of result.lines) {
    console.log(line);
  }
  console.log("");
  console.log("Markdown preview:");
  for (const item of result.markdownItems) {
    console.log(item);
    console.log("");
  }

  if (command === "digest:dry-run") {
    console.log("Digest preview:");
    console.log(createDigest(result.events).markdown);
  }
} else if (command === "sources:check") {
  console.log(formatSourceHealth(await checkSources()));
} else if (command === "poll-once" || command === "poll") {
  const env = readEnv();
  const pool = createDbPool(env.databaseUrl);
  const poster = new DiscordPoster({
    token: env.discordToken,
    tapeChannelId: env.discordTapeChannelId,
  });

  try {
    if (command === "poll") {
      await pollLoop(pool, poster);
    } else {
      const result = await pollOnce({ pool, poster });
      console.log(`Poll complete: ${JSON.stringify(result)}`);
    }
  } finally {
    await pool.end();
  }
} else {
  console.log("zNews commands:");
  console.log("  npm run migrate");
  console.log("  npm run dry-run -- 10");
  console.log("  npm run dry-run:live -- 10");
  console.log("  npm run digest:dry-run -- 10");
  console.log("  npm run sources:check");
  console.log("  npm run poll:once");
  console.log("  npm run poll");
}
