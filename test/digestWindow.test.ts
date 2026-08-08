import { describe, expect, it } from "vitest";
import { getDigestWindow } from "../src/digest/windows.js";

describe("getDigestWindow", () => {
  it("uses the previous local calendar day", () => {
    const window = getDigestWindow("daily", new Date("2026-07-23T13:30:00Z"), "America/New_York");
    expect(window.start.toISOString()).toBe("2026-07-22T04:00:00.000Z");
    expect(window.end.toISOString()).toBe("2026-07-23T04:00:00.000Z");
  });

  it("uses the previous seven local calendar days for weekly recaps", () => {
    const window = getDigestWindow("weekly", new Date("2026-07-23T13:30:00Z"), "America/New_York");
    expect(window.start.toISOString()).toBe("2026-07-16T04:00:00.000Z");
    expect(window.end.toISOString()).toBe("2026-07-23T04:00:00.000Z");
  });

  it("creates non-overlapping overnight and session windows in New York time", () => {
    const now = new Date("2026-07-23T19:00:00Z");
    const overnight = getDigestWindow("overnight", now, "America/New_York");
    const session = getDigestWindow("session", now, "America/New_York");

    expect(overnight.start.toISOString()).toBe("2026-07-22T19:00:00.000Z");
    expect(overnight.end.toISOString()).toBe("2026-07-23T05:00:00.000Z");
    expect(session.start.toISOString()).toBe("2026-07-23T05:00:00.000Z");
    expect(session.end.toISOString()).toBe("2026-07-23T19:00:00.000Z");
  });
});
