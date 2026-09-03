import { describe, expect, it } from "vitest";
import { clusterFingerprint, contentHash, normalizeText } from "../src/dedupe/fingerprint.js";

describe("fingerprints", () => {
  it("normalizes punctuation and casing", () => {
    expect(normalizeText(" Hormuz: CLOSURE reports!!! ")).toBe("hormuz closure reports");
  });

  it("creates stable content hashes", () => {
    expect(contentHash("Fed says rates unchanged")).toBe(contentHash("fed says rates unchanged"));
  });

  it("keeps cluster fingerprints category-aware", () => {
    expect(clusterFingerprint("Energy", "Oil jumps after supply shock")).not.toBe(
      clusterFingerprint("US", "Oil jumps after supply shock"),
    );
  });

  it("clusters source-overlap headlines for the same troop deployment", () => {
    expect(clusterFingerprint("US", "US to send 5,000 additional troops to Poland – Trump")).toBe(
      clusterFingerprint("US", "Trump to deploy 5,000 US troops to Poland after earlier plan was canceled"),
    );
  });

  it("clusters NATO Poland troop headlines with different source framing", () => {
    expect(clusterFingerprint("US", "NATO chief welcomes Trump decision to send troops to Poland")).toBe(
      clusterFingerprint("US", "Nato chief welcomes US sending 5,000 troops to Poland"),
    );
  });

  it("does not cluster NATO summit commentary without the troop deployment terms", () => {
    expect(clusterFingerprint("US", "NATO chief welcomes Trump decision to send troops to Poland")).not.toBe(
      clusterFingerprint("US", "Trump disappointment with Nato lays groundwork for important summit, Rubio says"),
    );
  });
});
