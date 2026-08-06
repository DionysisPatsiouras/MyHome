# MyHome

MyHome is a property-management web app for landlords: manage residences, rental contracts, tenants, and technicians, track recurring maintenance and repairs, and get automatic email reminders for expiring rentals and inactive accounts. The UI is Greek-language-facing.

## Tech stack

- **Frontend** (`app/`) — Next.js (App Router) + TypeScript, Mantine UI, Tailwind CSS, `react-hook-form` + `zod` for forms, Leaflet for maps.
- **Backend** (`api/`) — Django REST Framework, JWT auth (`djangorestframework_simplejwt`), PostgreSQL, `django-crontab` for scheduled jobs.
- **Infra** — Docker Compose (Postgres + API), a Postman collection for exercising the API manually.

## Repo layout

| Path | Contents |
|---|---|
| `app/` | Next.js frontend |
| `api/` | Django REST backend |
| `docker/` | `Dockerfile` + `docker-compose.yml` for the backend and database |
| `postman/` | Postman collection/environment for the API |

## Quick start

```bash
# Backend + database
cd docker && docker compose -f docker-compose.yml up --build

# Frontend
cd app && npm install && npm run dev
```

See [`docs/setup.md`](docs/setup.md) for environment variables and details.

## Documentation

- [`docs/setup.md`](docs/setup.md) — running the app locally, environment variables
- [`docs/architecture.md`](docs/architecture.md) — how the codebase is organized, conventions for adding new features
- [`docs/features.md`](docs/features.md) — product feature overview (auth, residences, rentals, tenants, technicians, maintenance, scheduled emails)
- [`docs/data-model.md`](docs/data-model.md) — backend entities and their relationships
