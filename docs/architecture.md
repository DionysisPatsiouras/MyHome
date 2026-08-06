# Architecture

## Monorepo layout

```
app/      Next.js frontend
api/      Django REST backend
docker/   Dockerfile + docker-compose.yml (backend + Postgres)
postman/  Postman collection for the API
```

## Frontend (`app/`)

- **Routing** — App Router, route groups under `app/app/(pages)/`: `auth/{sign-in,sign-up,forgot-password,verify}`, `dashboard/{account,rentals,residences,technicians,tenants}`, and `terms`.
- **Components** — organized by domain under `app/app/components/`: `residence/`, `rentals/`, `tenants/`, `technician/`, `maintenances/`, `account/`, plus `public/` (landing page sections), `forms/` (reusable controlled inputs), `layout/`, and `map/`.
- **Data fetching** — two hooks in `app/app/lib/hooks/`:
  - `useFetch.ts` — GET-on-mount, attaches the bearer token from cookies.
  - `useCRUD.ts` — GET/POST/PATCH/DELETE with Mantine notification toasts (Greek-language messages) on success/error.
  - Both call endpoints built by `app/app/lib/Routes.ts`, a factory: `Routes(resourceName)` returns `{ id, list, add, patch, delete, overview, filters }` URL builders against `NEXT_PUBLIC_API_ENDPOINT`; `AuthRoutes` covers sign-in/forgot-password/verification endpoints separately.
- **Auth token** — stored in cookies (`app/app/lib/utils/cookies.ts`), read in `app/app/lib/utils/auth.ts`, attached manually as `Authorization: Bearer <token>` in the fetch hooks (no cookie-based session auth on the Django side).
- **Forms** — `react-hook-form` + `zod`, resolved via `@hookform/resolvers/zod`. All schemas live in one place: `app/app/lib/utils/formSchemas.ts` (e.g. `SignUpFormSchema`, `NewResidenceSchema`, `NewRentalSchema`, ...). Each form field is a reusable wrapper around a Mantine input driven by RHF's `Controller`, in `app/app/components/forms/`: `ControlledTextfield`, `ControlledDatePicker`, `ControlledCheckbox`, `ControlledSelect`, `ControlledTextarea`.
- **Global state** — no Redux/Zustand; just two React Contexts, `MaintenanceContext` and `ResidenceContext` (`app/app/contexts/`), for state shared within those feature areas.

### Adding a new frontend section

1. Add a route under `app/app/(pages)/dashboard/<name>/`.
2. Add a components folder under `app/app/components/<name>/`.
3. Add a zod schema to `formSchemas.ts` and build the form with the `Controlled*` inputs.
4. Call the API via `Routes("<name>")` and `useCRUD`/`useFetch`.

## Backend (`api/`)

- **Project core** — `api/core/`: settings, URL root, ASGI/WSGI, `exception_handlers.py` for standardized error responses (paired with `infra/Responses.py`, e.g. `Forbidden_403`).
- **URL routing is auto-discovered** — `core/urls.py` scans every directory under `api/apps/` and mounts it at `/<app_name>/` via that app's own `urls.py`. There's no central route registry to edit when adding an app.
- **Domain apps** — one Django app per domain under `api/apps/`: `auth`, `users`, `residences`, `rentals`, `tenants`, `technicians`, `repairs`, `maintenances`, `scraper`. Each app's `urls.py` conventionally exposes:
  - `path("", list)` — GET (list, with filters) / POST (create)
  - `path("<int:id>", record)` — GET (one) / PATCH (update) / DELETE (soft delete)
- **Generic CRUD generator** — `api/infra/GenericViews.py`'s `generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field="user")` returns ready-made `list`/`record` view functions. `record` enforces ownership by walking the dotted `auth_field` path (e.g. `"user"` for models with a direct owner FK, or `"residence.user"` for models — rentals, maintenances — owned indirectly through their residence) and comparing to `request.user.id`, returning `Forbidden_403()` on mismatch; DELETE goes through `softDelete` rather than removing the row. Most domain apps' `views.py` is just a call to this factory — custom logic (auth, scraper) is written by hand instead.
- **Shared infra** (`api/infra/`) — `Helpers.py` (retrieve/insert/update/soft-delete helpers used by `GenericViews`), `Validators.py`, `EmailService.py` (renders Django templates and sends via `EmailMultiAlternatives`, gated by `MAILS_ENABLED`).
- **Scheduled jobs** — `django-crontab`, registered in `CRONJOBS` in `api/core/settings.py`, each running a Django management command. See [`docs/features.md`](features.md#background-jobs) for what they do.

### Adding a new backend domain

1. Create a Django app under `api/apps/<name>/` with a model (following the soft-delete field convention — see [`docs/data-model.md`](data-model.md)).
2. Add a serializer.
3. Wire up `list, record = generateGenericViews(Model, ModelSerializer, auth_field="user")` in `views.py`, and reference them from `urls.py` using the `path("", list)` / `path("<int:id>", record)` convention. It's auto-mounted at `/<name>/` — no central registration needed.
