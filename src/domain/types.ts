export type Category =
  | "Middle East"
  | "Russia/Ukraine"
  | "Italy"
  | "EU"
  | "US"
  | "China/Asia"
  | "Macro/Central Banks"
  | "Energy"
  | "Resources/EM"
  | "Market Structure"
  | "Cyber/Security"
  | "Weather/Supply Shock";

export type StatusLabel =
  | "official"
  | "confirmed"
  | "developing"
  | "single-source"
  | "claim"
  | "correction";

export type Ticker =
  | "ES"
  | "NQ"
  | "YM"
  | "FDAX"
  | "FESX"
  | "EU"
  | "GU"
  | "UJ"
  | "DXY"
  | "GC"
  | "SI"
  | "HG"
  | "CL"
  | "BRN"
  | "NG"
  | "RB"
  | "ZW"
  | "ZC"
  | "ZS"
  | "CC"
  | "KC"
  | "SB"
  | "FGBL"
  | "ZN";

export type MacroLabel =
  | "risk-on"
  | "risk-off"
  | "rates"
  | "inflation"
  | "growth"
  | "recession"
  | "supply shock"
  | "energy shock"
  | "geopolitical risk"
  | "central bank"
  | "fiscal risk"
  | "sanctions"
  | "trade war"
  | "election risk"
  | "credit risk"
  | "banking risk"
  | "liquidity"
  | "currency intervention"
  | "safe haven"
  | "war escalation"
  | "ceasefire / de-escalation"
  | "weather / infrastructure"
  | "cyber / security";

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  translate?: {
    from?: string;
    to: string;
  };
}

export interface RawNewsItem {
  id: string;
  source: NewsSource;
  title: string;
  url: string;
  publishedAt: Date;
  summary?: string;
}

export interface MarketImpact {
  direct: Ticker[];
  secondary: Ticker[];
}

export interface NewsEvent {
  id: string;
  publishedAt: Date;
  category: Category;
  headline: string;
  status: StatusLabel;
  impact: MarketImpact;
  macroLabels: MacroLabel[];
  source: NewsSource;
  url: string;
  summary?: string;
}
