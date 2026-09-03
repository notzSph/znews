# Security Policy

## Reporting a vulnerability

Do not report security vulnerabilities in public issues.

Please contact the maintainer privately with a concise description, affected component, reproduction steps, and likely impact. Do not include live credentials or tokens in a report. Revoke any credential that may have been exposed before reporting it.

## Deployment basics

- Keep `infra/.env` outside Git and restrict its permissions.
- Never commit Discord tokens, database passwords, or production channel IDs.
- Use a strong database password outside local development.
- Keep Postgres bound to localhost or a private network.
