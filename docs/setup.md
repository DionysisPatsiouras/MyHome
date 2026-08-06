# Local setup

## Prerequisites

- Docker (for Postgres + the Django API)
- Node.js (for the Next.js frontend)

## Backend + database

The backend and database run via Docker Compose:

```bash
cd docker
docker compose -f docker-compose.yml up --build
```

This starts:
- `db` — Postgres 16, exposed on host port `5433` (container port `5432`)
- `api` — the Django app, built from `docker/Dockerfile`, exposed on port `8000`. On startup it runs `manage.py migrate`, loads fixture data (`apps/{users,technicians,residences,tenants}/fixtures/data.json`), then starts `runserver`.

The `api` service reads its environment from `api/.env` (see below); `DB_HOST`/`DB_PORT` are overridden by the compose file to point at the `db` service.

Alternatively, run Django directly (e.g. for debugging) with a local Python environment and `pip install -r api/requirements.txt`, then the usual `python manage.py migrate` / `python manage.py runserver` from `api/`.

## Frontend

```bash
cd app
npm install
npm run dev      # dev server, http://localhost:3000
npm run build     # production build
npm run start     # serve a production build
npm run lint
```

## Environment variables

### `app/.env.development`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_ENDPOINT` | Base URL of the Django API the frontend calls |
| `NEXT_PUBLIC_PASSWORD_LENGTH` | Minimum password length enforced client-side |
| `SECRET_KEY` | Frontend-side secret (JWT-related usage) |

### `api/.env`

| Variable | Purpose |
|---|---|
| `DEBUG_STATUS` | Django debug mode toggle |
| `MAILS_ENABLED` | Turns real email sending on/off (see [`docs/features.md`](features.md#email-delivery)) |
| `STRICT_PASSWORD` | Enables stricter password validation rules |
| `FRONTEND_URL` | Base URL of the frontend, used in generated links |
| `FRONTEND_LOGIN_URL` | Login page URL, used in email templates (e.g. inactivity reminder) |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Postgres connection |
| `SECRET_KEY` | Django secret key |
| `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL` | SMTP configuration for outgoing email |

Generate a new Django secret key with:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

## Seed data / logging in

There's no single documented login — the Docker Compose flow loads fixture data (`apps/users/fixtures/data.json` etc.) on startup, so create/inspect a user from those fixtures rather than relying on a hardcoded account. Alternatively, sign up through the frontend's `/auth/sign-up` flow against your local API.

## Exploring the API

A Postman collection and environment are available under `/postman` for exercising the API endpoints directly, independent of the frontend.
