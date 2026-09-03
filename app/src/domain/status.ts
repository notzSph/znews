import type { StatusLabel } from "./types.js";

export function escalateStatusForSourceCount(status: StatusLabel, sourceCount: number): StatusLabel {
  if (sourceCount < 2) return status;
  if (status === "correction" || status === "official") return status;
  return "confirmed";
}

