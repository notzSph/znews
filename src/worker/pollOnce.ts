import type pg from "pg";
import { readEnv } from "../config/env.js";
import { rssSources } from "../config/sources.js";
import { NewsRepository } from "../db/repository.js";
import { createEventFromRawItem } from "../event/createEvent.js";
import { fetchRssSource } from "../feeds/rss.js";
import { isMarketRelevant } from "../filter/relevance.js";
import { formatTapeMarkdown } from "../format/eventTape.js";
import { DiscordPoster } from "../discord/poster.js";
import { formatDriverBoard } from "../domain/driverBoard.js";
import type { BoardThread } from "../domain/types.js";

export interface PollOnceOptions {
  pool: pg.Pool;
  poster: DiscordPoster;
}

export interface PollOnceResult {
  sources: number;
  fetched: number;
  relevant: number;
  inserted: number;
  duplicates: number;
  posted: number;
  errors: number;
}

export async function pollOnce({ pool, poster }: PollOnceOptions): Promise<PollOnceResult> {
  const env = readEnv();
  const repository = new NewsRepository(pool);
  const result: PollOnceResult = {
    sources: rssSources.length,
    fetched: 0,
    relevant: 0,
    inserted: 0,
    duplicates: 0,
    posted: 0,
    errors: 0,
  };

  for (const source of rssSources) {
    try {
      await repository.upsertSource(source);
      const items = await fetchRssSource(source);
      result.fetched += items.length;

      for (const item of items) {
        const event = createEventFromRawItem(item);
        if (!isMarketRelevant(event, { maxAgeHours: env.maxItemAgeHours })) continue;
        result.relevant += 1;
        const stored = await repository.storeEvent(item, event);

        if (!stored.inserted) {
          result.duplicates += 1;
          continue;
        }

        result.inserted += 1;

        // The tape is the immutable live feed. Boards are a secondary, in-place view.
        const postResult = await poster.postTapeLine(formatTapeMarkdown(event));
        if (postResult.posted && postResult.messageId) {
          await repository.markEventPosted(event.id, postResult.messageId);
          result.posted += 1;
        }

        if (event.boardDriver && env.discordDriverBoardChannelId) {
          await syncDriverBoard(repository, poster, event.boardDriver);
        }
      }

      await repository.markSourceFetched(source.id);
    } catch (error) {
      result.errors += 1;
      console.error(`Failed polling source ${source.name}`, error);
    }
  }

  return result;
}

async function syncDriverBoard(repository: NewsRepository, poster: DiscordPoster, thread: BoardThread) {
  const [board, events] = await Promise.all([
    repository.getDriverBoard(thread),
    repository.getDriverBoardEvents(thread),
  ]);
  const result = await poster.syncDriverBoard(thread, formatDriverBoard(thread, events), board.threadId, board.messageId);
  if (result.posted && result.threadId && result.messageId) {
    await repository.saveDriverBoard(thread, result.threadId, result.messageId);
  }
  return result;
}
