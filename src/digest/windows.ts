export type DigestType = "overnight" | "session" | "daily" | "weekly";

export interface DigestWindow {
  start: Date;
  end: Date;
}

export function getDigestWindow(type: DigestType, now: Date, timeZone: string): DigestWindow {
  const local = getLocalDate(now, timeZone);
  if (type === "overnight") {
    const priorDate = shiftLocalDate(local, -1);
    return {
      start: zonedLocalTimeUtc(priorDate, 15, timeZone),
      end: zonedLocalTimeUtc(local, 1, timeZone),
    };
  }
  if (type === "session") {
    return {
      start: zonedLocalTimeUtc(local, 1, timeZone),
      end: zonedLocalTimeUtc(local, 15, timeZone),
    };
  }
  const end = zonedMidnightUtc(local, timeZone);
  const start = zonedMidnightUtc(shiftLocalDate(local, type === "daily" ? -1 : -7), timeZone);
  return { start, end };
}

function shiftLocalDate(local: { year: number; month: number; day: number }, days: number): { year: number; month: number; day: number } {
  const value = new Date(Date.UTC(local.year, local.month - 1, local.day + days));
  return { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() };
}

function getLocalDate(value: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
}

function zonedMidnightUtc(local: { year: number; month: number; day: number }, timeZone: string): Date {
  return zonedLocalTimeUtc(local, 0, timeZone);
}

function zonedLocalTimeUtc(local: { year: number; month: number; day: number }, hour: number, timeZone: string): Date {
  const guess = Date.UTC(local.year, local.month - 1, local.day, hour);
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
