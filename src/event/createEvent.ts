import { classifyNewsItem } from "../classifier/rules.js";
import type { NewsEvent, RawNewsItem } from "../domain/types.js";

export function createEventFromRawItem(item: RawNewsItem): NewsEvent {
  const classification = classifyNewsItem(item);

  const event: NewsEvent = {
    id: item.id,
    publishedAt: item.publishedAt,
    category: classification.category,
    drivers: classification.drivers,
    transmissionChannels: classification.transmissionChannels,
    headline: item.title,
    status: classification.status,
    impact: classification.impact,
    macroLabels: classification.macroLabels,
    source: item.source,
    url: item.url,
    summary: item.summary,
  };

  return { ...event, boardDriver: positionEvent(event) };
}
import { positionEvent } from "../domain/driverBoard.js";
