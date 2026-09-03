import type { DryRunResult } from "./dryRun.js";

export function formatDryRunSummary(result: DryRunResult): string {
  return `Dry run: ${result.sourceCount} sources, ${result.fetchedCount} fetched items, ${result.relevantCount} market-relevant items, ${result.errors.length} errors`;
}

export function formatDryRunLiveSim(result: DryRunResult): string[] {
  const header = [
    "**[DRY RUN / LIVE FORMAT SIM]**",
    `${result.sourceCount} sources • ${result.fetchedCount} fetched • ${result.relevantCount} relevant • ${result.errors.length} errors`,
    "No DB write. No Discord post.",
  ].join("\n");

  return [header, ...result.markdownItems];
}

