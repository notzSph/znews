import type { NewsSource } from "../domain/types.js";

export const rssSources: NewsSource[] = [
  {
    id: "bbc-world",
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
  },
  {
    id: "ansa-topnews",
    name: "ANSA Top News",
    url: "https://www.ansa.it/sito/ansait_rss.xml",
  },
  {
    id: "ansa-world",
    name: "ANSA World",
    url: "https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml",
  },
  {
    id: "ansa-economy",
    name: "ANSA Economy",
    url: "https://www.ansa.it/sito/notizie/economia/economia_rss.xml",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
  },
  {
    id: "france24",
    name: "France 24",
    url: "https://www.france24.com/en/rss",
  },
  {
    id: "guardian-world",
    name: "The Guardian World",
    url: "https://www.theguardian.com/world/rss",
  },
  {
    id: "dw-news",
    name: "Deutsche Welle",
    url: "https://rss.dw.com/rdf/rss-en-all",
  },
  {
    id: "politico-eu",
    name: "Politico Europe",
    url: "https://www.politico.eu/feed/",
  },
  {
    id: "un-news",
    name: "UN News",
    url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
  },
  {
    id: "ecb-press",
    name: "ECB Press Releases",
    url: "https://www.ecb.europa.eu/rss/press.html",
  },
  {
    id: "ec-press",
    name: "European Commission",
    url: "https://ec.europa.eu/commission/presscorner/api/rss?language=en",
  },
  {
    id: "federal-reserve",
    name: "Federal Reserve Press Releases",
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
  },
  {
    id: "boe-news",
    name: "Bank of England",
    url: "https://www.bankofengland.co.uk/rss/news",
  },
  {
    id: "eia-energy",
    name: "EIA Energy",
    url: "https://www.eia.gov/rss/todayinenergy.xml",
  },
];
