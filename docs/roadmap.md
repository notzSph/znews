# Roadmap

## Current

- RSS/Atom/RDF collection and source-health reporting
- market-aware filtering, classification, and status labels
- event deduplication and clustering
- Discord event tape, driver boards, and daily digests
- Postgres persistence and dry-run workflows

## Next

- Improve source-quality scoring and failure visibility.
- Expand test fixtures for malformed and conflicting feed data.
- Add operator documentation for production deployment and rollback.
- Keep Discord delivery and database access independently observable.

## Principles

- Prefer transparent rules over opaque scoring.
- Preserve source attribution and uncertainty labels.
- Keep no-secrets development paths usable.
- Treat external delivery as optional and failure-tolerant.
