import { describe, expect, it } from "vitest";
import { escalateStatusForSourceCount } from "../src/domain/status.js";

describe("status escalation", () => {
  it("keeps single-source status when only one source reports a cluster", () => {
    expect(escalateStatusForSourceCount("single-source", 1)).toBe("single-source");
  });

  it("marks non-official multi-source clusters as confirmed", () => {
    expect(escalateStatusForSourceCount("single-source", 2)).toBe("confirmed");
    expect(escalateStatusForSourceCount("developing", 3)).toBe("confirmed");
  });

  it("preserves official and correction statuses", () => {
    expect(escalateStatusForSourceCount("official", 2)).toBe("official");
    expect(escalateStatusForSourceCount("correction", 2)).toBe("correction");
  });
});

