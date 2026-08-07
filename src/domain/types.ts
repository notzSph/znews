export type Category =
  | "Hormuz War"
  | "Russia/Ukraine"
  | "Italy"
  | "EU"
  | "US"
  | "China/Asia"
  | "Forex/Sovereign"
  | "Macro/Central Banks"
  | "Energy"
  | "Resources/EM"
  | "Policy/IR"
  | "Market Structure"
  | "Cyber/Security"
  | "Weather/Agri Supply";

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
  | "CAD"
  | "CHF"
  | "AU"
  | "NZD"
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
  | "ZM"
  | "ZL"
  | "ZO"
  | "ZR"
  | "CC"
  | "KC"
  | "SB"
  | "CT"
  | "OJ"
  | "LE"
  | "GF"
  | "HE"
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

export type NewsDriver =
  | "Hormuz/Red Sea"
  | "Russia/Ukraine"
  | "Monetary/Fiscal"
  | "Global Macro/Central Banks"
  | "European Sovereign Risk"
  | "US Policy/Politics"
  | "China/Asia"
  | "Energy/LNG"
  | "Agriculture/Supply"
  | "Weather/Climate"
  | "Shipping/Choke Point"
  | "Trade Policy/Sanctions"
  | "Geopolitics"
  | "Resources/EM"
  | "Cyber/Security";

export type TransmissionChannel =
  | "Energy"
  | "LNG"
  | "Shipping"
  | "FX"
  | "Rates"
  | "Grains"
  | "Oilseeds"
  | "Livestock"
  | "Soft Commodities"
  | "Metals"
  | "Equities"
  | "Cyber";

export type BoardThread =
  | "Hormuz & Red Sea"
  | "Russia & Ukraine"
  | "Geopolitics & Conflict"
  | "Macro, Rates & FX"
  | "Energy, LNG & Shipping"
  | "Agriculture & Weather"
  | "China & Asia"
  | "Trade Policy & Sanctions"
  | "Resources & Emerging Markets"
  | "Cyber & Market Structure";

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
  drivers: NewsDriver[];
  transmissionChannels: TransmissionChannel[];
  boardDriver?: BoardThread;
  headline: string;
  status: StatusLabel;
  impact: MarketImpact;
  macroLabels: MacroLabel[];
  source: NewsSource;
  url: string;
  summary?: string;
}
