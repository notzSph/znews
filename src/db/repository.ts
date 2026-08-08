import type pg from "pg";
import { contentHash, clusterFingerprint } from "../dedupe/fingerprint.js";
import type { BoardThread, NewsDriver, NewsEvent, NewsSource, RawNewsItem } from "../domain/types.js";

export interface StoredCluster {
  id: string;
  fingerprint: string;
  title: string;
  eventCount: number;
}

export interface StoredEvent {
  event: NewsEvent;
  inserted: boolean;
  duplicateReason?: "raw-url" | "content-hash" | "cluster" | "event";
  cluster: StoredCluster;
}

export interface DriverBoardEvent {
  id: string;
  headline: string;
  url: string;
  publishedAt: Date;
  impact: NewsEvent["impact"];
  category: NewsEvent["category"];
  drivers: NewsDriver[];
  transmissionChannels: NewsEvent["transmissionChannels"];
  status: NewsEvent["status"];
  source: NewsSource;
}

export interface StoredDriverBoard {
  threadId?: string;
  messageId?: string;
}

export class NewsRepository {
  constructor(private readonly pool: pg.Pool) {}

  async upsertSource(source: NewsSource): Promise<void> {
    await this.pool.query(
      `
        insert into sources (id, name, url, updated_at)
        values ($1, $2, $3, now())
        on conflict (id) do update
        set name = excluded.name,
            url = excluded.url,
            updated_at = now()
      `,
      [source.id, source.name, source.url],
    );
  }

  async markSourceFetched(sourceId: string): Promise<void> {
    await this.pool.query("update sources set last_fetched_at = now(), updated_at = now() where id = $1", [sourceId]);
  }

  async storeEvent(rawItem: RawNewsItem, event: NewsEvent): Promise<StoredEvent> {
    const hash = contentHash(rawItem.title);

    const recentDuplicate = await this.pool.query<{ id: string }>(
      `
        select id
        from raw_news_items
        where content_hash = $1
          and published_at > now() - interval '24 hours'
        limit 1
      `,
      [hash],
    );

    if (recentDuplicate.rowCount) {
      const cluster = await this.upsertCluster(event);
      return { event, inserted: false, duplicateReason: "content-hash", cluster };
    }

    const rawInsert = await this.pool.query(
      `
        insert into raw_news_items (id, source_id, title, url, summary, published_at, content_hash)
        values ($1, $2, $3, $4, $5, $6, $7)
        on conflict (source_id, url) do nothing
      `,
      [rawItem.id, rawItem.source.id, rawItem.title, rawItem.url, rawItem.summary ?? null, rawItem.publishedAt, hash],
    );

    if (!rawInsert.rowCount) {
      const cluster = await this.upsertCluster(event);
      return { event, inserted: false, duplicateReason: "raw-url", cluster };
    }

    const cluster = await this.upsertCluster(event);
    if (cluster.eventCount > 0) {
      return { event, inserted: false, duplicateReason: "cluster", cluster };
    }

    const eventInsert = await this.pool.query(
      `
        insert into news_events (
          id,
          raw_item_id,
          cluster_id,
          category,
          headline,
          status,
          direct_tickers,
          secondary_tickers,
          macro_labels,
          drivers,
          transmission_channels,
          board_driver,
          source_url,
          published_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        on conflict (id) do nothing
      `,
      [
        event.id,
        rawItem.id,
        cluster.id,
        event.category,
        event.headline,
        event.status,
        event.impact.direct,
        event.impact.secondary,
        event.macroLabels,
        event.drivers,
        event.transmissionChannels,
        event.boardDriver ?? null,
        event.url,
        event.publishedAt,
      ],
    );

    return {
      event,
      inserted: Boolean(eventInsert.rowCount),
      duplicateReason: eventInsert.rowCount ? undefined : "event",
      cluster,
    };
  }

  async markEventPosted(eventId: string, discordMessageId: string): Promise<void> {
    await this.pool.query("update news_events set discord_message_id = $1 where id = $2", [discordMessageId, eventId]);
  }

  async getEventsInWindow(windowStart: Date, windowEnd: Date): Promise<NewsEvent[]> {
    const result = await this.pool.query<{
      id: string; category: NewsEvent["category"]; headline: string; status: NewsEvent["status"]; direct_tickers: NewsEvent["impact"]["direct"]; secondary_tickers: NewsEvent["impact"]["secondary"];
      macro_labels: NewsEvent["macroLabels"]; drivers: NewsDriver[]; transmission_channels: NewsEvent["transmissionChannels"]; source_url: string; published_at: Date;
    }>(
      `select id, category, headline, status, direct_tickers, secondary_tickers, macro_labels, drivers, transmission_channels, source_url, published_at
       from news_events where published_at >= $1 and published_at < $2 order by published_at desc`,
      [windowStart, windowEnd],
    );
    return result.rows.map((row) => ({
      id: row.id, category: row.category, headline: row.headline, status: row.status, drivers: row.drivers,
      transmissionChannels: row.transmission_channels, impact: { direct: row.direct_tickers, secondary: row.secondary_tickers }, macroLabels: row.macro_labels,
      source: { id: "stored", name: "Stored event", url: row.source_url }, url: row.source_url, publishedAt: row.published_at,
    }));
  }

  async hasDigestRun(id: string): Promise<boolean> {
    const result = await this.pool.query("select 1 from digest_runs where id = $1", [id]);
    return Boolean(result.rowCount);
  }

  async saveDigestRun(id: string, digestType: "daily" | "weekly" | "overnight" | "session", windowStart: Date, windowEnd: Date, messageId?: string): Promise<void> {
    await this.pool.query(
      `insert into digest_runs (id, digest_type, window_start, window_end, discord_message_id)
       values ($1, $2, $3, $4, $5) on conflict (id) do nothing`,
      [id, digestType, windowStart, windowEnd, messageId ?? null],
    );
  }

  async getDriverBoard(thread: BoardThread): Promise<StoredDriverBoard> {
    const result = await this.pool.query<{ discord_thread_id: string | null; discord_message_id: string | null }>(
      "select discord_thread_id, discord_message_id from driver_boards where driver = $1",
      [thread],
    );
    return { threadId: result.rows[0]?.discord_thread_id ?? undefined, messageId: result.rows[0]?.discord_message_id ?? undefined };
  }

  async saveDriverBoard(thread: BoardThread, threadId: string, messageId: string): Promise<void> {
    await this.pool.query(
      `insert into driver_boards (driver, discord_thread_id, discord_message_id, updated_at) values ($1, $2, $3, now())
       on conflict (driver) do update set discord_thread_id = excluded.discord_thread_id, discord_message_id = excluded.discord_message_id, updated_at = now()`,
      [thread, threadId, messageId],
    );
  }

  async getDriverBoardEvents(thread: BoardThread, limit = 10): Promise<NewsEvent[]> {
    const result = await this.pool.query<{
      id: string; headline: string; status: NewsEvent["status"]; direct_tickers: NewsEvent["impact"]["direct"]; secondary_tickers: NewsEvent["impact"]["secondary"];
      macro_labels: NewsEvent["macroLabels"]; drivers: NewsDriver[]; transmission_channels: NewsEvent["transmissionChannels"]; source_url: string; published_at: Date;
    }>(
      `select id, headline, status, direct_tickers, secondary_tickers, macro_labels, drivers, transmission_channels, source_url, published_at
       from news_events where board_driver = $1 order by published_at desc limit $2`,
      [thread, limit],
    );
    return result.rows.map((row) => ({
      id: row.id, headline: row.headline, status: row.status, category: "Market Structure", drivers: row.drivers,
      transmissionChannels: row.transmission_channels, impact: { direct: row.direct_tickers, secondary: row.secondary_tickers }, macroLabels: row.macro_labels,
      source: { id: "stored", name: "Stored event", url: row.source_url }, url: row.source_url, publishedAt: row.published_at,
    }));
  }

  private async upsertCluster(event: NewsEvent): Promise<StoredCluster> {
    const fingerprint = clusterFingerprint(event.category, event.headline);
    const id = `cluster:${fingerprint.slice(0, 24)}`;

    await this.pool.query(
      `
        insert into event_clusters (
          id,
          fingerprint,
          title,
          category,
          status,
          first_seen_at,
          last_seen_at
        )
        values ($1, $2, $3, $4, $5, $6, $6)
        on conflict (fingerprint) do update
        set last_seen_at = greatest(event_clusters.last_seen_at, excluded.last_seen_at),
            status = case
              when event_clusters.status in ('official', 'correction') then event_clusters.status
              when excluded.status in ('official', 'correction') then excluded.status
              else 'confirmed'
            end,
            updated_at = now()
      `,
      [id, fingerprint, event.headline, event.category, event.status, event.publishedAt],
    );

    const result = await this.pool.query<StoredCluster & { event_count: string }>(
      `
        select c.id,
               c.fingerprint,
               c.title,
               count(e.id)::text as event_count
        from event_clusters c
        left join news_events e on e.cluster_id = c.id
        where c.fingerprint = $1
        group by c.id
      `,
      [fingerprint],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      fingerprint: row.fingerprint,
      title: row.title,
      eventCount: Number.parseInt(row.event_count, 10),
    };
  }
}
