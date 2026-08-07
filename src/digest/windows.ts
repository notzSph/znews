export type DigestType = "daily" | "weekly";

export interface DigestWindow {
  start: Date;
  end: Date;
}

export function getDigestWindow(type: DigestType, now: Date, timeZone: string): DigestWindow {
  const local = getLocalDate(now, timeZone);
  const end = zonedMidnightUtc(local, timeZone);
  const startDate = new Date(Date.UTC(local.year, local.month - 1, local.day - (type === "daily" ? 1 : 7)));
  const start = zonedMidnightUtc({ year: startDate.getUTCFullYear(), month: startDate.getUTCMonth() + 1, day: startDate.getUTCDate() }, timeZone);
  return { start, end };
}

function getLocalDate(value: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

function zonedMidnightUtc(local: { year: number; month: number; day: number }, timeZone: string): Date {
  const guess = Date.UTC(local.year, local.month - 1, local.day);
  const offset = offsetMinutes(new Date(guess), timeZone);
  return new Date(guess - offset * 60_000);
}

function offsetMinutes(value: Date, timeZone: string): number {
  const zone = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" }).formatToParts(value).find((part) => part.type === "timeZoneName")?.value;
  const match = zone?.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "+" ? minutes : -minutes;
}
