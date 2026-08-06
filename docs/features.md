# Features

## Public / marketing site

The landing page (`app/app/page.tsx`) is composed of section components under `app/app/components/public/`: Hero, Features, HowItWorks, Pricing, PropertyOverview, PropertyTypes, Technicians, Video, CTA — plus `LandingHeader`/`LandingFooter`. A standalone `/terms` page holds the terms of service that sign-up links to.

## Auth

Pages under `app/app/(pages)/auth/`, backed by `api/apps/auth/` and `api/apps/users/`.

- **Sign up** — collects first name, last name, birthdate, email, password/confirm, and a required "accept terms" checkbox (links to `/terms`).
- **Sign in** — JWT login (`djangorestframework_simplejwt`). After 3 failed attempts for a user, further logins return a "Too many attempts" error instead of validating credentials (`api/apps/auth/views.py`, `MyTokenObtainPairSerializer`, backed by the `LoginAttempts` model).
- **Email verification** — `/auth/verify`, backed by `verifyEmail`/`resendVerification` endpoints; verification tokens expire after 24h (`VerifyRequests` model).
- **Forgot / reset password** — `/auth/forgot-password`; reset tokens also expire after 24h (`ResetPassword` model).

## Dashboard

Pages under `app/app/(pages)/dashboard/`.

- **Residences** — list (card/list view), create, view, edit. `ResidenceForm` (`components/residence/`) handles type selection, address/location (via the Leaflet-based `LocationPicker` map component), and energy/utilities fields (energy class, power/gas/water supply numbers). A residence page also surfaces its contracts and repairs.
- **Rentals** — contracts linking a residence and a tenant, with rent amount, start/end date (duration auto-computed), and declaration number.
- **Tenants** — tenant records (name, AFM tax number, phone) owned by the logged-in user.
- **Technicians** — contact records (name, phone numbers, type, description) a landlord keeps on hand for repairs.
- **Maintenances / Repairs** — recurring maintenance items per residence (`components/maintenances/`: overview panel, history table/modal, new-maintenance modal) plus one-off repairs (`components/layout/NewRepairModal.tsx`).
- **Account** — profile details, plan, linked residences, security (password change).

## Background jobs

Scheduled via `django-crontab` (`CRONJOBS` in `api/core/settings.py`), each running a Django management command:

- `check_expiring_rentals` (`api/apps/rentals/management/commands/`) — emails the residence owner when a rental's `end_date` is 7 days away (`rental_expiring_soon.html`) or 1 day away (`rental_expiring_tomorrow.html`).
- `send_inactivity_reminders` (`api/apps/users/management/commands/`) — the "6-month reminder": finds users whose `last_login` date is exactly 180 days ago and emails them `users/inactivity_reminder.html` with a sign-in link.
- `scrape_gov_announcements` (`api/apps/scraper/`) — scrapes government announcements into `GovAnnouncement` records (not an email job).

All three currently run on the `* * * * *` schedule in `settings.py` — worth tightening before/if this runs in production, since that's a once-a-minute cadence.

## Email delivery

`api/infra/EmailService.py` renders an HTML template (`api/templates/{auth,rentals,users}/`) and sends it via `EmailMultiAlternatives`. Sending is gated by the `MAILS_ENABLED` env var. Transactional emails (welcome, verify email, verify success, reset password, reset success, password changed) are triggered directly from `api/apps/auth/views.py`; the reminder emails above are triggered from cron commands.
