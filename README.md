# zNews

![Version](https://img.shields.io/badge/Version-2.0-blue.svg)
![Build](https://img.shields.io/badge/Build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/License-Proprietary-red.svg)
![Runtime](https://img.shields.io/badge/Runtime-Node.js%2024-339933.svg)
![Language](https://img.shields.io/badge/Language-TypeScript-3178C6.svg)
![Database](https://img.shields.io/badge/Database-Postgres-4169E1.svg)
![Output](https://img.shields.io/badge/Output-Discord-5865F2.svg)

zNews is an event tape for market-aware headline collection, filtering, deduplication, classification, and Discord delivery.

The goal is not to replace a paid news terminal. zNews is designed to collect major headlines from free RSS/Atom/RDF sources, remove duplicate or low-signal items, tag likely market impact, and post compact Discord updates that are fast to scan during trading.

The system is focused on:

- fast intraday headline scanning
- macro-sensitive relevance filtering
- event deduplication and clustering
- compact Discord event-tape formatting
- daily digest generation
- source health checks
- explicit status labeling
- Postgres persistence from day one

---

## Version

```text
2.0
```

---

## Status

```text
Build: Passing
License: Proprietary
Runtime: Node.js 24
Language: TypeScript
Database: Postgres
```

---

## Core Features

- Live event tape for fast intraday scanning.
- Topic-aware filtering for bigger-picture context.
- Ticker impact tags for index, FX, rates, energy, and metals monitoring.
- Macro labels such as `risk-off`, `rates`, `inflation`, `supply shock`, and `geopolitical risk`.
- Strict status labels: `official`, `confirmed`, `developing`, `single-source`, `claim`, `correction`.
- Postgres-backed source state, deduplication, event clusters, and Discord message/thread references.
- Dry-run workers for no-secrets development.
- Source health reporting.
- Daily digest generation.
- Test coverage for classifier, digest, Discord posting, dry-run output, environment config, event formatting, relevance, RSS parsing, source health, and status handling.

---

## Repository Structure

```text
.
├── README.md
├── docker-compose.yml
├── docs
│   └── roadmap.md
├── package-lock.json
├── package.json
├── src
│   ├── classifier
│   │   └── rules.ts
│   ├── config
│   │   ├── env.ts
│   │   └── sources.ts
│   ├── db
│   │   ├── client.ts
│   │   ├── migrate.ts
│   │   ├── migrations
│   │   │   └── 001_initial.sql
│   │   └── repository.ts
│   ├── dedupe
│   │   └── fingerprint.ts
│   ├── digest
│   │   └── dailyDigest.ts
│   ├── discord
│   │   └── poster.ts
│   ├── domain
│   │   ├── status.ts
│   │   ├── taxonomy.ts
│   │   └── types.ts
│   ├── event
│   │   └── createEvent.ts
│   ├── feeds
│   │   └── rss.ts
│   ├── filter
│   │   └── relevance.ts
│   ├── format
│   │   └── eventTape.ts
│   ├── index.ts
│   └── worker
│       ├── dryRun.ts
│       ├── dryRunReport.ts
│       ├── pollLoop.ts
│       ├── pollOnce.ts
│       └── sourceHealth.ts
├── test
│   ├── classifier.test.ts
│   ├── digest.test.ts
│   ├── discordPoster.test.ts
│   ├── dryRun.test.ts
│   ├── dryRunReport.test.ts
│   ├── env.test.ts
│   ├── eventTape.test.ts
│   ├── fingerprint.test.ts
│   ├── relevance.test.ts
│   ├── rss.test.ts
│   ├── sourceHealth.test.ts
│   └── status.test.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## Architecture

### `src/classifier/`

Rule-based market classification.

This layer maps headlines and source context into market-relevant labels, ticker impact tags, macro themes, and status information.

### `src/config/`

Runtime configuration and source registry.

- `env.ts` handles explicit environment parsing.
- `sources.ts` defines the active RSS/Atom/RDF source set.

### `src/db/`

Postgres persistence layer.

Includes:

- database client setup
- migration runner
- SQL migrations
- repository functions for persistence and state access

### `src/dedupe/`

Headline fingerprinting and deduplication logic.

Used to reduce exact headline overlap and obvious same-event duplication across sources.

### `src/digest/`

Daily digest generation.

Builds higher-level summaries from collected events.

### `src/discord/`

Discord posting layer.

Formats and sends event tape updates into configured Discord channels.

### `src/domain/`

Shared domain types, taxonomy definitions, and status labels.

### `src/event/`

Event creation logic.

Converts normalized feed items into internal event objects.

### `src/feeds/`

RSS/Atom/RDF parsing.

Uses `fast-xml-parser` for feed ingestion.

### `src/filter/`

Market relevance filtering.

Drops low-signal headlines and keeps macro-sensitive, rates-sensitive, energy-sensitive, geopolitical, central-bank, and market-moving news.

### `src/format/`

Event tape formatting.

Responsible for compact, Discord-friendly event messages.

### `src/worker/`

Executable worker flows.

Includes:

- one-shot polling
- continuous polling
- dry-run preview
- dry-run reporting
- source health checks

---

## Current Sources

Free RSS/Atom/RDF sources currently wired:

- BBC News
- New York Times World
- New York Times Business
- NPR World
- NPR Business
- CBS News World
- ABC News International
- Sky News World
- South China Morning Post World
- South China Morning Post China
- The Moscow Times
- Meduza English
- TASS English
- Interfax Russia
- Kommersant
- The Kyiv Independent
- Ukrainska Pravda English
- Balkan Insight
- Notes from Poland
- ANSA Top News
- ANSA World
- ANSA Economy
- Al Jazeera
- Middle East Eye
- The New Arab
- The Times of Israel
- Al-Monitor
- France 24
- The Guardian World
- Deutsche Welle
- Politico Europe
- UN News
- Africanews
- AllAfrica
- Resource World
- Buenos Aires Times
- Brazil Reports
- The Rio Times
- MercoPress
- Latin America Reports
- GDACS Alerts
- USGS Significant Earthquakes
- NASA Earth Observatory
- NOAA News
- NOAA Climate.gov
- NOAA NCEI News
- ECB Press Releases
- European Commission
- Federal Reserve Press Releases
- Federal Reserve Speeches
- Federal Reserve Testimony
- ECB Blog
- US Census Economic Indicators
- Bank of England
- Bank of Japan
- EIA Energy
- Grain Central
- Hellenic Shipping News
- Splash247
- gCaptain
- Bloomberg Markets
- MarketWatch Top Stories
- OilPrice.com
- CISA News
- CISA Advisories
- BleepingComputer
- The Record
- The Japan Times Business
- Defense News
- Breaking Defense

Known skipped candidates for now:

- AP: blocked by edge protection from this runtime.
- CNBC: blocked by edge protection from this runtime.
- IMF: tested endpoint returned HTML rather than a clean feed.
- FAO/WFP/WMO: candidate URLs tested from this runtime did not return clean RSS XML yet; keep as future source work unless a stable feed endpoint is confirmed.
- Several official candidates, including US Treasury, OFAC, Council of the EU, WTO, OPEC, BIS, USTR, USDA, and PBOC, were skipped because candidate feed URLs returned HTML, 403/404/503 responses, or non-feed payloads from this runtime.
- Bank of Canada, Reserve Bank of India, and Investing.com feeds were reachable but skipped because their parsed item dates were future-dated during validation.
- KrebsOnSecurity was skipped because it intermittently returned 403 from this runtime. Nikkei Asia was skipped because the feed parsed to zero usable items.
- bne IntelliNews, Iran International, Mining Weekly, MINING.com, Africa Energy, BNamericas, teleSUR English, AgWeb, and selected Reuters feeds were skipped because candidate URLs returned blocking pages, HTML, 4xx/5xx responses, payload-size errors, or fetch failures from this runtime.

Cyrillic feeds configured with `translate` are translated to English before classification and posting. If translation fails, zNews keeps the original headline instead of dropping the item.

---

## Filtering Rules

The relevance gate is intentionally stricter than a normal news aggregator.

zNews keeps:

- direct macro headlines
- rates and central-bank headlines
- inflation-sensitive headlines
- energy and commodity shock headlines
- Africa and Latin America resource extraction, mining, export, nationalization, and security-risk headlines
- agri/food commodity shock headlines with direct grain and soft-commodity impact
- shipping, port, canal, tanker, and supply-chain disruption headlines
- cyber/security incidents with infrastructure, cloud, exploit, payment, or market disruption channels
- ENSO / El Nino / La Nina climate shock headlines with crop, food-price, drought, flood, monsoon, or infrastructure channels
- geopolitical escalation headlines
- Italy spread / fiscal-risk headlines
- official institutional updates
- military, sanctions, trade-war, tariff, and strategic-risk headlines

zNews drops:

- ordinary domestic politics
- crime
- human-interest stories
- sports
- celebrity news
- company noise
- generic market-wrap headlines
- weakly connected political commentary

Special rules:

- Meloni headlines are kept only when foreign affairs, EU/NATO, sanctions, trade, Ukraine/Russia, Middle East, China, or US-facing context is present.
- US foreign-policy headlines need a strong market channel: military action, troops, NATO, Taiwan/China, Russia/Ukraine, Iran, Cuba crisis, strategic sanctions, tariffs, or trade war.
- Dry-run output deduplicates exact headline overlap and obvious same-event source overlap before printing previews.

---

## Ticker Impact Tags

Starting basket:

```text
ES
NQ
YM
FDAX
FESX
EU
GU
UJ
DXY
GC
SI
HG
CL
BRN
NG
RB
ZW
ZC
ZS
CC
KC
SB
FGBL
ZN
```

---

## Macro Labels

Common macro labels include:

```text
risk-off
rates
inflation
supply shock
geopolitical risk
central bank
energy
fiscal risk
sanctions
trade war
```

---

## Status Labels

zNews uses strict event status labels:

```text
official
confirmed
developing
single-source
claim
correction
```

These labels are intended to make uncertainty visible during fast-moving news cycles.

---

## Stack

- Node.js 24
- TypeScript
- npm
- Postgres
- Low-level `pg` driver
- Vitest
- fast-xml-parser
- Discord REST API libraries
- Docker Compose for local Postgres

No ORM is used in the core persistence path.

No runtime schema library is used in the core config path. Configuration validation is explicit and intentionally small.

---

## Local Commands

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npm run migrate
```

Run one polling pass:

```bash
npm run poll:once
```

Run the polling worker continuously:

```bash
npm run poll
```

Dry-run latest feed output:

```bash
npm run dry-run -- 10
```

Dry-run live output:

```bash
npm run dry-run:live -- 10
```

Dry-run daily digest:

```bash
npm run digest:dry-run -- 10
```

Check source health:

```bash
npm run sources:check
```

Run tests:

```bash
npm test
```

Run typecheck:

```bash
npm run typecheck
```

Run production build:

```bash
npm run build
```

---

## Environment

Copy the example environment file and fill the values needed by the worker:

```bash
cp .env.example .env
```

Required once persistence is enabled:

```bash
DATABASE_URL=postgres://znews:znews@localhost:5432/znews
```

For Discord posting:

```bash
DISCORD_TOKEN=your_bot_token
DISCORD_TAPE_CHANNEL_ID=target_channel_id
```

Do not paste bot secrets into Discord or commit them into Git.

Keep local secrets in `.env`.

---

## Local Postgres

Start the optional local database:

```bash
docker compose up -d postgres
```

Run migrations:

```bash
npm run migrate
```

Test a single polling pass:

```bash
npm run poll:once
```

Run continuously:

```bash
npm run poll
```

If Discord environment variables are missing, the worker still fetches, filters, deduplicates, clusters, and stores events, but skips posting.

---

## No-Secrets Development

These commands do not require Postgres, Docker, Discord bot tokens, or VPS access:

```bash
npm run dry-run -- 10
npm run dry-run:live -- 10
npm run digest:dry-run -- 10
npm run sources:check
npm test
npm run typecheck
npm run build
```

Use these while tuning:

- feed sources
- classification rules
- formatting
- relevance filters
- digest output
- event tape previews
- source health reporting

---

## Testing

The repository includes Vitest coverage for the main internal modules:

```text
test/
├── classifier.test.ts
├── digest.test.ts
├── discordPoster.test.ts
├── dryRun.test.ts
├── dryRunReport.test.ts
├── env.test.ts
├── eventTape.test.ts
├── fingerprint.test.ts
├── relevance.test.ts
├── rss.test.ts
├── sourceHealth.test.ts
└── status.test.ts
```

Run the test suite:

```bash
npm test
```

Run static type checks:

```bash
npm run typecheck
```

Run the build:

```bash
npm run build
```

---

## Roadmap

See:

```text
docs/roadmap.md
```

---

## Security

Do not commit:

- `.env`
- Discord bot tokens
- database URLs containing passwords
- production channel IDs if they are considered private
- VPS credentials
- SSH keys
- API keys

Recommended local check before committing:

```bash
git status
git diff --staged
```

---

## License

```text
Proprietary
```

All rights reserved.

This repository and its contents are private intellectual property unless explicitly stated otherwise.

Unauthorized copying, redistribution, modification, publication, or commercial use is not permitted.

---

## Maintainer

```text
zSph
```
