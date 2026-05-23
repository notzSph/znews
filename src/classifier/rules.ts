import type { Category, MacroLabel, MarketImpact, RawNewsItem, StatusLabel, Ticker } from "../domain/types.js";

interface Rule {
  name: string;
  patterns: RegExp[];
  requiredPatterns?: RegExp[];
  requiredAnyPatterns?: RegExp[];
  minMatches?: number;
  priority?: number;
  category: Category;
  direct: Ticker[];
  secondary: Ticker[];
  macroLabels: MacroLabel[];
}

const rules: Rule[] = [
  {
    name: "middle-east-energy-risk",
    requiredAnyPatterns: [/iran/i, /tehran/i, /khamenei/i, /uranium/i, /hormuz/i, /red sea/i, /houthis?/i],
    patterns: [/iran/i, /tehran/i, /khamenei/i, /uranium/i, /israel/i, /hormuz/i, /red sea/i, /houthis?/i, /missile/i, /strike/i, /attack/i],
    category: "Middle East",
    direct: ["CL", "BRN", "RB", "NG"],
    secondary: ["GC", "DXY", "ES", "NQ"],
    macroLabels: ["geopolitical risk", "energy shock", "supply shock", "risk-off"],
  },
  {
    name: "russia-ukraine",
    requiredAnyPatterns: [/russia/i, /russian/i, /russo/i, /russa/i, /ukraine/i, /ucraina/i, /moscow/i, /kyiv/i, /kherson/i, /zelensky/i, /\bfsb\b/i, /putin/i],
    patterns: [
      /russia/i,
      /russian/i,
      /russo/i,
      /russa/i,
      /ukraine/i,
      /ucraina/i,
      /moscow/i,
      /kyiv/i,
      /kherson/i,
      /zelensky/i,
      /\bfsb\b/i,
      /putin/i,
      /nato/i,
      /war/i,
      /military/i,
      /missile/i,
      /drone/i,
      /intercept/i,
      /\braf\b/i,
      /spy/i,
      /spying/i,
      /pipeline/i,
    ],
    minMatches: 2,
    category: "Russia/Ukraine",
    direct: ["FGBL", "FESX", "FDAX", "GC"],
    secondary: ["CL", "BRN", "DXY", "ES", "NQ"],
    macroLabels: ["geopolitical risk", "war escalation", "risk-off"],
  },
  {
    name: "us-foreign-policy",
    requiredAnyPatterns: [/\bus\b/i, /united states/i, /trump/i, /white house/i, /washington/i, /rubio/i],
    patterns: [
      /\bus\b/i,
      /united states/i,
      /trump/i,
      /white house/i,
      /washington/i,
      /rubio/i,
      /nato/i,
      /cuba/i,
      /taiwan/i,
      /china/i,
      /russia/i,
      /iran/i,
      /sanctions?/i,
      /tariffs?/i,
      /dazi/i,
      /trade/i,
      /military/i,
      /carrier/i,
      /portaerei/i,
    ],
    minMatches: 2,
    category: "US",
    direct: ["ES", "NQ", "YM", "DXY", "ZN", "GC"],
    secondary: ["EU", "CL", "BRN"],
    macroLabels: ["geopolitical risk", "risk-off"],
  },
  {
    name: "china-asia-geopolitics",
    priority: 10,
    requiredAnyPatterns: [/china/i, /chinese/i, /\bxi\b/i, /taiwan/i, /beijing/i],
    patterns: [/china/i, /chinese/i, /\bxi\b/i, /taiwan/i, /beijing/i, /\bus\b/i, /united states/i, /trade/i, /tariffs?/i, /sanctions?/i, /military/i],
    minMatches: 2,
    category: "China/Asia",
    direct: ["ES", "NQ", "YM", "DXY", "GC"],
    secondary: ["EU", "CL", "BRN"],
    macroLabels: ["geopolitical risk", "trade war", "risk-off"],
  },
  {
    name: "us-macro",
    patterns: [/\bfed\b/i, /fomc/i, /\bcpi\b/i, /inflation/i, /payrolls/i, /jobless/i],
    category: "Macro/Central Banks",
    direct: ["ZN", "DXY", "ES", "NQ", "YM", "GC"],
    secondary: ["EU", "GU", "UJ"],
    macroLabels: ["rates", "inflation", "central bank"],
  },
  {
    name: "uk-macro",
    priority: 15,
    requiredAnyPatterns: [/\buk\b/i, /britain/i, /british/i, /sterling/i, /gilts?/i, /\bboe\b/i, /bank of england/i],
    patterns: [
      /\buk\b/i,
      /britain/i,
      /british/i,
      /sterling/i,
      /gilts?/i,
      /\bboe\b/i,
      /bank of england/i,
      /inflation/i,
      /rates?/i,
      /borrowing/i,
      /borrowed/i,
      /deficit/i,
      /budget/i,
      /growth/i,
      /\bgdp\b/i,
    ],
    minMatches: 2,
    category: "Macro/Central Banks",
    direct: ["GU", "FGBL", "FESX", "FDAX", "DXY", "ZN"],
    secondary: ["ES", "NQ", "GC"],
    macroLabels: ["rates", "inflation", "fiscal risk"],
  },
  {
    name: "europe-policy",
    patterns: [/\becb\b/i, /eurozone/i, /european union/i, /\beu\b/i, /brussels/i],
    category: "EU",
    direct: ["FGBL", "FESX", "FDAX", "EU"],
    secondary: ["DXY", "ES", "NQ"],
    macroLabels: ["rates", "central bank", "fiscal risk"],
  },
  {
    name: "meloni-foreign-affairs",
    priority: 20,
    requiredPatterns: [/meloni/i],
    patterns: [
      /trump/i,
      /white house/i,
      /washington/i,
      /kallas/i,
      /von der leyen/i,
      /\beu\b/i,
      /european union/i,
      /brussels/i,
      /nato/i,
      /zelensky/i,
      /ukraine/i,
      /ucraina/i,
      /russia/i,
      /putin/i,
      /israel/i,
      /iran/i,
      /gaza/i,
      /hamas/i,
      /ben-gvir/i,
      /sanctions?/i,
      /sanzioni/i,
      /tariffs?/i,
      /dazi/i,
      /trade/i,
      /china/i,
      /xi\b/i,
    ],
    minMatches: 1,
    category: "Italy",
    direct: ["FESX", "FDAX", "FGBL", "EU"],
    secondary: ["DXY", "ES"],
    macroLabels: ["geopolitical risk", "fiscal risk"],
  },
  {
    name: "italy-risk",
    patterns: [
      /\bbtp\b/i,
      /\bspread\b/i,
      /\bbudget\b/i,
      /\bdeficit\b/i,
      /\bdebt\b/i,
      /\bdebito\b/i,
      /\bmanovra\b/i,
      /\brating\b/i,
      /\bdowngrade\b/i,
      /government crisis/i,
      /crisi di governo/i,
    ],
    category: "Italy",
    direct: ["FESX", "FDAX", "FGBL", "EU"],
    secondary: ["DXY", "ES"],
    macroLabels: ["fiscal risk", "election risk"],
  },
  {
    name: "energy",
    patterns: [
      /oil/i,
      /crude/i,
      /brent/i,
      /\bwti\b/i,
      /gasoline/i,
      /natural gas/i,
      /\blng\b/i,
      /opec/i,
      /price/i,
      /prices/i,
      /supply/i,
      /demand/i,
      /inventor/i,
      /stockpile/i,
      /output/i,
      /production/i,
      /shipping/i,
    ],
    minMatches: 2,
    category: "Energy",
    direct: ["CL", "BRN", "NG", "RB"],
    secondary: ["GC", "DXY", "ES", "NQ"],
    macroLabels: ["energy shock", "supply shock", "inflation"],
  },
];

export function classifyNewsItem(item: RawNewsItem): {
  category: Category;
  impact: MarketImpact;
  macroLabels: MacroLabel[];
  status: StatusLabel;
} {
  const text = item.title;
  const matches = rules
    .filter((rule) => countRuleMatches(rule, text) >= (rule.minMatches ?? 1))
    .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0));
  const primary = matches[0];

  if (!primary) {
    return {
      category: "Market Structure",
      impact: { direct: [], secondary: [] },
      macroLabels: [],
      status: "single-source",
    };
  }

  return {
    category: primary.category,
    impact: {
      direct: unique(primary.direct),
      secondary: unique([...primary.secondary, ...matches.filter((rule) => rule !== primary).flatMap((rule) => [...rule.direct, ...rule.secondary])]).filter(
        (ticker) => !primary.direct.includes(ticker),
      ),
    },
    macroLabels: unique(matches.flatMap((rule) => rule.macroLabels)),
    status: inferStatus(item),
  };
}

function countRuleMatches(rule: Rule, text: string): number {
  if (rule.requiredPatterns?.some((pattern) => !pattern.test(text))) {
    return 0;
  }

  if (rule.requiredAnyPatterns && !rule.requiredAnyPatterns.some((pattern) => pattern.test(text))) {
    return 0;
  }

  return rule.patterns.filter((pattern) => pattern.test(text)).length;
}

function inferStatus(item: RawNewsItem): StatusLabel {
  const text = `${item.title} ${item.summary ?? ""}`;
  if (/\b(corrects|correction|revises|revised)\b/i.test(text)) return "correction";
  if (isOfficialSource(item.source.id)) return "official";
  if (/\b(announces|statement|press release)\b/i.test(text)) return "official";
  if (/\b(reports|according to|sources say)\b/i.test(text)) return "developing";
  return "single-source";
}

function isOfficialSource(sourceId: string): boolean {
  return ["ecb-press", "ec-press", "federal-reserve", "boe-news", "eia-energy", "un-news"].includes(sourceId);
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}
