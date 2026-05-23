import { describe, expect, it } from "vitest";
import { formatDryRunLiveSim, formatDryRunSummary } from "../src/worker/dryRunReport.js";
import type { DryRunResult } from "../src/worker/dryRun.js";

const baseResult: DryRunResult = {
  sourceCount: 2,
  fetchedCount: 12,
  relevantCount: 3,
  lines: ["plain line"],
  markdownItems: ["**Headline**\n⏰ • `22/05/2026 15:40 ET`"],
  events: [],
  errors: [],
};

describe("dry run reports", () => {
  it("formats the compact dry-run summary", () => {
    expect(formatDryRunSummary(baseResult)).toBe("Dry run: 2 sources, 12 fetched items, 3 market-relevant items, 0 errors");
  });

  it("formats Discord-ready live simulation blocks", () => {
    expect(formatDryRunLiveSim(baseResult)).toEqual([
      "**[DRY RUN / LIVE FORMAT SIM]**\n2 sources • 12 fetched • 3 relevant • 0 errors\nNo DB write. No Discord post.",
      "**Headline**\n⏰ • `22/05/2026 15:40 ET`",
    ]);
  });
});

