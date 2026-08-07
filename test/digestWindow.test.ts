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
});
