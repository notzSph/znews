# Contributing

## Development setup

```bash
npm ci
cp infra/.env.example infra/.env
```

Run the checks:

```bash
npm test
npm run typecheck
npm run build
```

## Pull requests

- Keep changes focused and explain operational impact.
- Add or update tests for behavioural changes.
- Do not commit `infra/.env`, credentials, database dumps, or build output.
- Review `git diff --check` before submitting.
