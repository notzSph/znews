import type { RawNewsItem } from "../domain/types.js";

const translationCache = new Map<string, string>();
const cyrillicPattern = /[\u0400-\u04FF]/;

export async function translateRawItems(items: RawNewsItem[]): Promise<RawNewsItem[]> {
  const translated: RawNewsItem[] = [];

  for (let index = 0; index < items.length; index += 4) {
    translated.push(...(await Promise.all(items.slice(index, index + 4).map(translateRawItem))));
  }

  return translated;
}

async function translateRawItem(item: RawNewsItem): Promise<RawNewsItem> {
  const translate = item.source.translate;
  if (!translate) return item;

  const translatedTitle = await translateIfNeeded(item.title, translate.from ?? "auto", translate.to);

  return {
    ...item,
    title: translatedTitle,
  };
}

async function translateIfNeeded(value: string, from: string, to: string): Promise<string> {
  if (!cyrillicPattern.test(value)) return value;

  const key = `${from}:${to}:${value}`;
  const cached = translationCache.get(key);
  if (cached) return cached;

  try {
    const translated = await translateWithGoogle(value, from, to);
    const normalized = translated.trim() || value;
    translationCache.set(key, normalized);
    return normalized;
  } catch {
    return value;
  }
}

async function translateWithGoogle(value: string, from: string, to: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", from);
    url.searchParams.set("tl", to);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", value);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "zNews/0.1 (+headline translation)",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as GoogleTranslatePayload;
    return payload[0]?.map((segment) => segment[0]).join("") ?? value;
  } finally {
    clearTimeout(timeout);
  }
}

type GoogleTranslatePayload = Array<Array<[string, string]>>;
