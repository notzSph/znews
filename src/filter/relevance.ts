import type { NewsEvent } from "../domain/types.js";

export interface RelevanceOptions {
  now?: Date;
  maxAgeHours?: number;
}

export function isMarketRelevant(event: NewsEvent, options: RelevanceOptions = {}): boolean {
  if (isOutsideTimeWindow(event, options)) return false;
  if (isLowSignal(event)) return false;
  if (!hasStrongMarketSignal(event)) return false;
  if (event.impact.direct.length > 0) return true;
  if (event.impact.secondary.length > 0) return true;
  if (event.macroLabels.length > 0) return true;

  return false;
}

function isOutsideTimeWindow(event: NewsEvent, options: RelevanceOptions): boolean {
  if (!options.maxAgeHours) return false;

  const now = options.now ?? new Date();
  const maxAgeMs = options.maxAgeHours * 60 * 60 * 1000;
  const futureToleranceMs = 60 * 60 * 1000;

  return now.getTime() - event.publishedAt.getTime() > maxAgeMs || event.publishedAt.getTime() - now.getTime() > futureToleranceMs;
}

function isLowSignal(event: NewsEvent): boolean {
  return lowSignalPatterns.some((pattern) => pattern.test(readEventText(event)));
}

function hasStrongMarketSignal(event: NewsEvent): boolean {
  const text = readEventText(event);

  if (event.category === "US") {
    return usHighImpactPatterns.some((pattern) => pattern.test(text));
  }

  if (event.category === "EU") {
    return euHighImpactPatterns.some((pattern) => pattern.test(text));
  }

  return event.category !== "Market Structure";
}

function readEventText(event: NewsEvent): string {
  return `${event.headline} ${event.summary ?? ""}`;
}

const lowSignalPatterns = [
  /world cup/i,
  /football/i,
  /soccer/i,
  /ballroom/i,
  /\bice funding\b/i,
  /roundtable discussion/i,
  /video message/i,
  /walmart/i,
  /celebrity/i,
  /manslaughter/i,
  /rights activists?/i,
  /anti-weaponisation/i,
  /outside new us consulate/i,
  /greenlanders protest/i,
  /national intelligence director/i,
  /\bdni\b/i,
  /acting dni chief/i,
  /^borsa:/i,
  /\bstocks (?:open|opened|close|closed|rise|rose|fall|fell)\b/i,
  /\bshares (?:open|opened|close|closed|rise|rose|fall|fell)\b/i,
];

const usHighImpactPatterns = [
  /military action/i,
  /military strikes?/i,
  /deploy/i,
  /troops?/i,
  /carrier/i,
  /portaerei/i,
  /war powers?/i,
  /war in iran/i,
  /nato/i,
  /taiwan/i,
  /china/i,
  /russia/i,
  /ukraine/i,
  /iran/i,
  /cuba crisis/i,
  /cuba.*(?:military|strike|threat|sanctions?)/i,
  /sanctions?.*(?:iran|russia|china|hezbollah|cuba|north korea|venezuela)/i,
  /(?:iran|russia|china|hezbollah|cuba|north korea|venezuela).*sanctions?/i,
  /tariffs?/i,
  /trade war/i,
];

const euHighImpactPatterns = [
  /\becb\b/i,
  /rates?/i,
  /inflation/i,
  /eurozone/i,
  /budget/i,
  /deficit/i,
  /debt/i,
  /sanctions?/i,
  /tariffs?/i,
  /trade/i,
  /nato/i,
  /ukraine/i,
  /russia/i,
  /iran/i,
];
