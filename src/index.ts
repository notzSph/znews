import "dotenv/config";
import { readEnv } from "./config/env.js";
import { createDbPool } from "./db/client.js";
import { NewsRepository } from "./db/repository.js";
import { DiscordPresenceClient } from "./discord/presence.js";
import { DiscordPoster } from "./discord/poster.js";
import { createDigest } from "./digest/dailyDigest.js";
import { getDigestWindow } from "./digest/windows.js";
import { boardThreads, formatDriverBoard } from "./domain/driverBoard.js";
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
} else if (command === "digest:overnight" || command === "digest:session" || command === "digest:daily" || command === "digest:weekly") {
  const forceDigest = process.argv.slice(3).includes("--force");
  const env = readEnv();
  const pool = createDbPool(env.databaseUrl);
  const digestType = command.replace("digest:", "") as "overnight" | "session" | "daily" | "weekly";
  const window = getDigestWindow(digestType, new Date(), env.timezone);
  const digestId = `${digestType}:${window.start.toISOString()}`;
  const repository = new NewsRepository(pool);
  const poster = new DiscordPoster({ token: env.discordToken });
  try {
    const configuredBoards = boardThreads
      .map((thread) => ({ thread, threadId: env.discordDriverBoardThreadIds[thread] }))
      .filter((board): board is { thread: typeof board.thread; threadId: string } => Boolean(board.threadId));
    if (configuredBoards.length === 0) throw new Error("No driver-board thread IDs configured for digest delivery");

    const posted: string[] = [];
    for (const board of configuredBoards) {
      const boardDigestId = `${digestId}:${board.thread}`;
      if (!forceDigest && (await repository.hasDigestRun(boardDigestId))) continue;
      const events = await repository.getBoardEventsInWindow(board.thread, window.start, window.end);
      if (events.length === 0) continue;
      const postResult = await poster.postDigest(createDigest(events, 5, digestType, board.thread).markdown, board.threadId);
      if (!postResult.posted) throw new Error(`Digest not posted for ${board.thread}: ${postResult.reason}`);
      await repository.saveDigestRun(boardDigestId, digestType, window.start, window.end, postResult.messageId);
      posted.push(`${board.thread}:${postResult.messageId}`);
    }
    console.log(posted.length ? `${digestType} board digests posted: ${posted.join(", ")}` : `${digestType} board digests: no new events`);
  } finally {
    await pool.end();
  }
} else if (command === "boards:setup") {
  const env = readEnv();
  const pool = createDbPool(env.databaseUrl);
  const repository = new NewsRepository(pool);
  const poster = new DiscordPoster({ token: env.discordToken, driverBoardChannelId: env.discordDriverBoardChannelId });
  try {
    for (const thread of boardThreads) {
      const [board, events] = await Promise.all([repository.getDriverBoard(thread), repository.getDriverBoardEvents(thread)]);
      const result = await poster.syncDriverBoard(
        thread,
        formatDriverBoard(thread, events),
        env.discordDriverBoardThreadIds[thread] ?? board.threadId,
        board.messageId,
      );
      if (!result.posted || !result.threadId || !result.messageId) throw new Error(`Board setup failed for ${thread}: ${result.reason ?? "unknown error"}`);
      await repository.saveDriverBoard(thread, result.threadId, result.messageId);
    }
    console.log(`Driver-board threads ready: ${boardThreads.length}`);
  } finally {
    await pool.end();
  }
} else if (command === "poll-once" || command === "poll") {
  const env = readEnv();
  const pool = createDbPool(env.databaseUrl);
  const poster = new DiscordPoster({
    token: env.discordToken,
    tapeChannelId: env.discordTapeChannelId,
    driverBoardChannelId: env.discordDriverBoardChannelId,
    digestChannelId: env.discordDigestChannelId,
  });
  const presence = new DiscordPresenceClient({ token: env.discordToken });

  try {
    if (command === "poll") {
      await presence.start();
      await pollLoop(pool, poster);
    } else {
      const result = await pollOnce({ pool, poster });
      console.log(`Poll complete: ${JSON.stringify(result)}`);
    }
  } finally {
    await presence.stop();
    await pool.end();
  }
} else {
  console.log("zNews commands:");
  console.log("  npm run migrate");
  console.log("  npm run dry-run -- 10");
  console.log("  npm run dry-run:live -- 10");
  console.log("  npm run digest:dry-run -- 10");
  console.log("  npm run digest:daily [--force]");
  console.log("  npm run digest:overnight [--force]");
  console.log("  npm run digest:session [--force]");
  console.log("  npm run digest:weekly [--force]");
  console.log("  npm run boards:setup");
  console.log("  npm run sources:check");
  console.log("  npm run poll:once");
  console.log("  npm run poll");
}
