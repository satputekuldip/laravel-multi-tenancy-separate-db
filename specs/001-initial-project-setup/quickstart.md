# Quickstart: Initial Project Setup

**Feature**: 001-initial-project-setup  
**Date**: 2026-03-02

Short guide for developers to run, test, and extend this feature.

---

## Prerequisites

- PHP 8.2+, Composer, Node/npm
- Laravel 12, Inertia 2, React 19, Tailwind 4
- Spatie Laravel Permission, Spatie Laravel Activity Log (already in use)
- Database: SQLite (dev) or PostgreSQL (production)

---

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed   # PermissionSeeder, RoleSeeder, etc.
npm install && npm run build
```

---

## Run

```bash
php artisan serve
# Or full stack: composer run dev (server + queue + pail + vite)
```

- **Web**: http://localhost:8000  
- **Login**: Use a user with `super-admin` or `admin` role (seeded).  
- **Admin**: `/admin/users`, `/admin/permissions`; after implementation: `/admin/activity-log`, `/admin/dashboard` (or dashboard with widgets), site settings under settings module.

---

## Key routes

| Area | Path | Notes |
|------|------|--------|
| Dashboard | /dashboard | Inertia; enhance with summary widgets. |
| Admin users | /admin/users | Resource CRUD. |
| Admin permissions | /admin/permissions | List roles/permissions; extend for full CRUD if needed. |
| API permissions | GET /api/permissions, /api/permissions/roles, /api/permissions/user | Add /api/permissions/check for single-permission check. |
| API languages | GET /api/languages, /api/languages/{code}/translations, /api/languages/translations/all | |
| Settings (user) | /settings/profile, /settings/password, etc. | Existing. |
| Settings (admin) | /settings/site-settings, /settings/permissions | Site settings and permissions (settings layout); require admin. |

---

## Testing

```bash
php artisan test
# Or filter: php artisan test --filter=PermissionApiTest
```

- **Feature tests**: Prefer for HTTP/Inertia flows (permission API, user CRUD, activity log, settings, translation).  
- **Factories**: User, Language, Translation; use in tests.  
- **Seeders**: PermissionSeeder, RoleSeeder ensure roles/permissions exist.

---

## Documentation and hygiene

- **CHANGELOG.md**: Update after each completed user story or significant change; add `## [x.y.z] - YYYY-MM-DD` on release.  
- **Scribe**: Install if missing (`composer require knuckleswtf/scribe`). Add annotations to all API controllers; run `php artisan scribe:generate` after changes.  
- **Wayfinder**: After adding or changing routes, run `php artisan wayfinder:generate` so frontend route helpers stay in sync.  
- **Pint**: Run `vendor/bin/pint --dirty` after editing PHP.

---

## Architecture reminders

- **Controllers**: Thin; delegate to Services/Actions.  
- **Validation**: Form Request classes for every request that has rules.  
- **API**: Eloquent resources or consistent JSON shape; document with Scribe and non-empty examples.  
- **Settings**: New Setting model; **Settings facade** (`App\Facades\Settings`) with user > group > site precedence. Use `Settings::get('key', $default, $user, $groupIds)`, `Settings::set('key', $value, 'site'|'group'|'user', $scopeId)`, `Settings::getSiteSettings()`, `Settings::setSiteSettings([...])`. Injected as `SettingService` when type-hinted.  
- **Translation**: Translation facade/helper using Language/Translation models; fallback to default locale then key.

---

## Spec and plan

- **Spec**: [spec.md](./spec.md)  
- **Plan**: [plan.md](./plan.md)  
- **Data model**: [data-model.md](./data-model.md)  
- **API contract**: [contracts/api-endpoints.md](./contracts/api-endpoints.md)  
- **Tasks**: Create via `/speckit.tasks` (tasks.md).
