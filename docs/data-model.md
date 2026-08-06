# Data model

All models live under `api/apps/<app>/models.py`. Most business models share the same soft-delete convention: `is_deleted` (bool) + `deleted_at` (nullable datetime), set instead of actually removing the row (see `softDelete` in `api/infra/GenericViews.py`). Most also have `created_at`/`updated_at`.

## Users (`api/apps/users/`)

- **CustomUser** — custom auth model (`AbstractBaseUser` + `PermissionsMixin`, UUID pk, `email` as the username field). Fields: `first_name`, `last_name`, `birthdate`, `password`, `is_verified`, plus the standard soft-delete/timestamp fields.
- **LoginAttempts** — `user` FK, `ip_address`, `date_attempted`. One row per failed login attempt; used to lock out a user after 3 attempts.
- **ResetPassword** — `user` FK, `token` (UUID), `expires_at` (24h from creation), `used_at`.
- **VerifyRequests** — `user` FK, `token` (UUID), `expires_at` (24h), `date_verified`.

## Residences (`api/apps/residences/`)

- **Prefecture** — `name`, `genitive_name` (Greek grammatical form used in generated text).
- **City** — `name`, `prefecture` FK.
- **ResidenceType** — `name` (e.g. apartment, house).
- **Residence** — UUID pk. `address`, `road_number`, `floor`, `flat_number`, `square_meters`, `energy_class`, `power_supply_number`, `gas_supply_number`, `water_supply_number`, `zip_code`, `latitude`/`longitude`, `construction_year`. FKs: `residenceType`, `city`, `user` (owner).
- **ResidenceFile** — `name`, `description`, `residence` FK. Attachment metadata (no actual file field wired up yet).

## Rentals (`api/apps/rentals/`)

- **Rental** — `residence` FK, `tenant` FK, `rent_amount`, `start_date`, `end_date` (nullable), `duration` (auto-computed in `save()` from start/end date), `declaration_number`. Ownership for auth checks is indirect: `residence.user`.

## Tenants (`api/apps/tenants/`)

- **Tenant** — `first_name`, `last_name`, `afm` (Greek tax ID), `phone`, `user` FK (owner).

## Technicians (`api/apps/technicians/`)

- **TechnicianType** — `avatar`, `name`.
- **Technician** — `full_name`, `phone_1`, `phone_2`, `description`, `technicianType` FK, `user` FK (owner).

## Maintenances (`api/apps/maintenances/`)

- **Maintenance** — `title`, `residence` FK, `recurrence` (interval). Ownership is indirect: `residence.user`.
- **MaintenanceHistory** — `maintenanceId` FK (to `Maintenance`), `comments`, `date`, `cost`.

## Repairs (`api/apps/repairs/`)

- **Repair** — `description`, `cost`, `date`, `user` FK (owner).

## Scraper (`api/apps/scraper/`)

- **GovAnnouncement** — `title`, `summary`, `category`, `organization`, `published_at`, `announcement_url` (unique), `created_at`, `scraped_at`. Not user-owned — populated by the `scrape_gov_announcements` cron job.

## Relationships at a glance

```
CustomUser (owner) ──< Residence ──< Rental >── Tenant
                 │           │
                 │           └──< Maintenance ──< MaintenanceHistory
                 │           └──< ResidenceFile
                 ├──< Technician >── TechnicianType
                 └──< Repair

Residence >── ResidenceType
Residence >── City >── Prefecture
```
