import type { NewsSource } from "../domain/types.js";

export const rssSources: NewsSource[] = [
  {
    id: "bbc-world",
    name: "BBC News",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
  },
  {
    id: "nyt-world",
    name: "New York Times World",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  },
  {
    id: "nyt-business",
    name: "New York Times Business",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
  },
  {
    id: "npr-world",
    name: "NPR World",
    url: "https://feeds.npr.org/1004/rss.xml",
  },
  {
    id: "npr-business",
    name: "NPR Business",
    url: "https://feeds.npr.org/1006/rss.xml",
  },
  {
    id: "cbs-world",
    name: "CBS News World",
    url: "https://www.cbsnews.com/latest/rss/world",
  },
  {
    id: "abc-international",
    name: "ABC News International",
    url: "https://abcnews.go.com/abcnews/internationalheadlines",
  },
  {
    id: "sky-world",
    name: "Sky News World",
    url: "https://feeds.skynews.com/feeds/rss/world.xml",
  },
  {
    id: "scmp-world",
    name: "South China Morning Post World",
    url: "https://www.scmp.com/rss/4/feed",
  },
  {
    id: "scmp-china",
    name: "South China Morning Post China",
    url: "https://www.scmp.com/rss/2/feed",
  },
  {
    id: "moscow-times",
    name: "The Moscow Times",
    url: "https://www.themoscowtimes.com/rss/news",
  },
  {
    id: "meduza-en",
    name: "Meduza English",
    url: "https://meduza.io/rss2/en/all",
  },
  {
    id: "tass-en",
    name: "TASS English",
    url: "https://tass.com/rss/v2.xml",
  },
  {
    id: "interfax-ru",
    name: "Interfax Russia",
    url: "https://www.interfax.ru/rss.asp",
    translate: {
      from: "ru",
      to: "en",
    },
  },
  {
    id: "kommersant-ru",
    name: "Kommersant",
    url: "https://www.kommersant.ru/RSS/news.xml",
    translate: {
      from: "ru",
      to: "en",
    },
  },
  {
    id: "kyiv-independent",
    name: "The Kyiv Independent",
    url: "https://kyivindependent.com/news-archive/rss/",
  },
  {
    id: "ukrainska-pravda-en",
    name: "Ukrainska Pravda English",
    url: "https://www.pravda.com.ua/eng/rss/",
  },
  {
    id: "balkan-insight",
    name: "Balkan Insight",
    url: "https://balkaninsight.com/feed/",
  },
  {
    id: "notes-from-poland",
    name: "Notes from Poland",
    url: "https://notesfrompoland.com/feed/",
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
    id: "middle-east-eye",
    name: "Middle East Eye",
    url: "https://www.middleeasteye.net/rss",
  },
  {
    id: "newarab",
    name: "The New Arab",
    url: "https://www.newarab.com/rss",
  },
  {
    id: "times-of-israel",
    name: "The Times of Israel",
    url: "https://www.timesofisrael.com/feed/",
  },
  {
    id: "al-monitor",
    name: "Al-Monitor",
    url: "https://www.al-monitor.com/rss",
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
    id: "africanews",
    name: "Africanews",
    url: "https://www.africanews.com/feed/rss",
  },
  {
    id: "allafrica",
    name: "AllAfrica",
    url: "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf",
  },
  {
    id: "resource-world",
    name: "Resource World",
    url: "https://resourceworld.com/feed/",
  },
  {
    id: "buenos-aires-times",
    name: "Buenos Aires Times",
    url: "https://www.batimes.com.ar/feed",
  },
  {
    id: "brazil-reports",
    name: "Brazil Reports",
    url: "https://brazilreports.com/feed/",
  },
  {
    id: "rio-times",
    name: "The Rio Times",
    url: "https://www.riotimesonline.com/feed/",
  },
  {
    id: "mercopress",
    name: "MercoPress",
    url: "https://en.mercopress.com/rss",
  },
  {
    id: "latin-america-reports",
    name: "Latin America Reports",
    url: "https://latinamericareports.com/feed/",
  },
  {
    id: "gdacs-alerts",
    name: "GDACS Alerts",
    url: "https://www.gdacs.org/xml/rss.xml",
  },
  {
    id: "usgs-significant-earthquakes",
    name: "USGS Significant Earthquakes",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.atom",
  },
  {
    id: "nasa-earth-observatory",
    name: "NASA Earth Observatory",
    url: "https://earthobservatory.nasa.gov/feeds/earth-observatory.rss",
  },
  {
    id: "noaa-news",
    name: "NOAA News",
    url: "https://www.noaa.gov/rss.xml",
  },
  {
    id: "noaa-climate",
    name: "NOAA Climate.gov",
    url: "https://www.climate.gov/news-features/feed.xml",
  },
  {
    id: "noaa-ncei",
    name: "NOAA NCEI News",
    url: "https://www.ncei.noaa.gov/news.xml",
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
    id: "fed-speeches",
    name: "Federal Reserve Speeches",
    url: "https://www.federalreserve.gov/feeds/speeches.xml",
  },
  {
    id: "fed-testimony",
    name: "Federal Reserve Testimony",
    url: "https://www.federalreserve.gov/feeds/testimony.xml",
  },
  {
    id: "ecb-blog",
    name: "ECB Blog",
    url: "https://www.ecb.europa.eu/rss/blog.html",
  },
  {
    id: "census-economic-indicators",
    name: "US Census Economic Indicators",
    url: "https://www.census.gov/economic-indicators/indicator.xml",
  },
  {
    id: "boe-news",
    name: "Bank of England",
    url: "https://www.bankofengland.co.uk/rss/news",
  },
  {
    id: "boj-news",
    name: "Bank of Japan",
    url: "https://www.boj.or.jp/en/rss/whatsnew.xml",
  },
  {
    id: "eia-energy",
    name: "EIA Energy",
    url: "https://www.eia.gov/rss/todayinenergy.xml",
  },
  {
    id: "grain-central",
    name: "Grain Central",
    url: "https://www.graincentral.com/feed/",
  },
  {
    id: "hellenic-shipping-news",
    name: "Hellenic Shipping News",
    url: "https://www.hellenicshippingnews.com/feed/",
  },
  {
    id: "splash247",
    name: "Splash247",
    url: "https://splash247.com/feed/",
  },
  {
    id: "gcaptain",
    name: "gCaptain",
    url: "https://gcaptain.com/feed/",
  },
  {
    id: "bloomberg-markets",
    name: "Bloomberg Markets",
    url: "https://feeds.bloomberg.com/markets/news.rss",
  },
  {
    id: "marketwatch-topstories",
    name: "MarketWatch Top Stories",
    url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  },
  {
    id: "oilprice-main",
    name: "OilPrice.com",
    url: "https://oilprice.com/rss/main",
  },
  {
    id: "cisa-news",
    name: "CISA News",
    url: "https://www.cisa.gov/news.xml",
  },
  {
    id: "cisa-advisories",
    name: "CISA Advisories",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
  },
  {
    id: "bleepingcomputer",
    name: "BleepingComputer",
    url: "https://www.bleepingcomputer.com/feed/",
  },
  {
    id: "the-record",
    name: "The Record",
    url: "https://therecord.media/feed",
  },
  {
    id: "japan-times-business",
    name: "The Japan Times Business",
    url: "https://www.japantimes.co.jp/business/feed/",
  },
  {
    id: "defense-news",
    name: "Defense News",
    url: "https://www.defensenews.com/arc/outboundfeeds/rss/",
  },
  {
    id: "breaking-defense",
    name: "Breaking Defense",
    url: "https://breakingdefense.com/feed/",
  },
];
