# Contributing

## Development setup

```bash
npm --prefix app ci
cp infra/.env.example infra/.env
```

Run the checks:

```bash
npm --prefix app test
npm --prefix app run typecheck
npm --prefix app run build
```

## Pull requests

- Keep changes focused and explain operational impact.
- Add or update tests for behavioural changes.
- Do not commit `infra/.env`, credentials, database dumps, or build output.
- Review `git diff --check` before submitting.
