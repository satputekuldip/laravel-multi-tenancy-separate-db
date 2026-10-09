# Implementation Plan: Initial Project Setup

**Branch**: `001-initial-project-setup` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-initial-project-setup/spec.md`

**Planning constraints (user)**: Maintain changelogs; maintain Scribe API docs in detail; keep architecture clean.

## Summary

Deliver the initial project setup feature: role-permission management (admin UI + client API), audit/activity logs (admin view), user CRUD, admin dashboard, settings (user/group/site) with facade and default site-settings layout, and translation/i18n with facade and language management. The codebase already uses Laravel 12, Inertia 2, Spatie Permission, and Spatie Activity Log; this plan aligns implementation with the spec, fills gaps (settings facade, site settings UI, activity log admin UI, dashboard widgets, translation facade, Scribe docs, changelog), and enforces clean architecture and documentation.

## Technical Context

**Language/Version**: PHP 8.2+  
**Primary Dependencies**: Laravel 12, Inertia.js 2, React 19, TypeScript 5.7, Tailwind CSS 4, Spatie Laravel Permission, Spatie Laravel Activity Log  
**Storage**: PostgreSQL (production), SQLite/PostgreSQL (dev); Eloquent ORM  
**Testing**: PHPUnit 11 (Feature tests preferred)  
**Target Platform**: Web (server-rendered + SPA via Inertia)  
**Project Type**: Web application (single codebase: Laravel backend + Inertia/React frontend)  
**Performance Goals**: &lt;200 ms p95 server response (Constitution); permission API &lt;2 s; settings/translation resolution &lt;500 ms (spec)  
**Constraints**: Zero N+1; Form Requests for validation; business logic in Services/Actions; Scribe for all API controllers; CHANGELOG.md updated per user story  
**Scale/Scope**: Multi-tenant-ready roles/permissions; activity log filterable/paginated; settings and translations key-value at user/group/site and language level

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Plan compliance |
|-----------|-------------|-----------------|
| **I. Code Quality & Standards** | PSR-12/Pint, strict typing, Eloquent over raw SQL, logic in Services/Actions, Form Requests | Controllers thin; validation via Form Requests; Services/Actions for role, user, settings, translation, activity log logic. |
| **II. Testing Standards** | Feature tests, factories/seeders, tests before merge | Feature tests for each user story; use existing factories/seeders; red-green-refactor. |
| **III. User Experience** | Tailwind theme, feedback per action, Link, empty states | Dashboard and admin lists use design system; toasts/messages; empty states for dashboard, logs, settings. |
| **IV. Performance** | &lt;200 ms p95, no N+1, eager load | Eager load on index/list actions; activity log and settings queries optimized. |
| **V. Documentation & Transparency** | CHANGELOG per story; Scribe for all API; non-empty response examples | CHANGELOG updated after each story; all API endpoints documented with Scribe (@group, @bodyParam/@queryParam/@urlParam, @response with concrete examples). |
| **VI. Development Hygiene** | Pint after PHP edits; scribe:generate after API changes | Scripts/documentation remind Pint and scribe:generate. |

**Gates**: Pass. No violations. Changelog and Scribe are explicitly in scope; architecture kept clean via Services/Actions and thin controllers.

## Project Structure

### Documentation (this feature)

```text
specs/001-initial-project-setup/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (API contracts / Scribe alignment)
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit.tasks – not created by plan)
```

### Source Code (repository root)

Existing Laravel 12 + Inertia layout; no new top-level apps. All work under `app/`, `routes/`, `resources/`, `config/`, `database/`.

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/           # UserController (exists), RoleController, PermissionController (admin), ActivityLogController, DashboardController
│   │   ├── Api/             # PermissionController, LanguageController (exists); add Settings API if needed
│   │   └── Settings/        # Profile, Password, 2FA (exists); SiteSettingsController for admin site settings
│   ├── Requests/
│   │   ├── Admin/           # User (exists), Role, ActivityLog filters
│   │   └── Settings/        # Profile (exists), SiteSettings
│   └── Middleware/
├── Models/                  # User (exists), Language, Translation (exists); add Role/Permission usage via Spatie; ActivityLog (Spatie); Setting (new)
├── Services/                 # Optional: RoleService, SettingService, TranslationService to keep controllers thin
├── Actions/                  # Fortify (exists); optional: LogActivity, ResolveSetting, ResolveTranslation
Support/
├── Facades/                  # Settings (new), Translation (new) – or helpers only per convention
app/Providers/
config/
database/
├── migrations/
├── seeders/                  # PermissionSeeder, RoleSeeder (exists)
resources/
├── js/
│   ├── pages/
│   │   ├── admin/           # users (exists), permissions, activity-log, dashboard (enhance), site-settings
│   │   └── settings/        # profile, password, appearance, two-factor (exists)
│   └── layouts/
│       └── settings/        # layout (exists); reuse for admin site settings or extend
routes/
├── web.php
├── api.php
└── settings.php
tests/
├── Feature/
└── Unit/
```

**Structure decision**: Single Laravel application. Admin and API live in `app/Http/Controllers/Admin` and `app/Http/Controllers/Api`. Settings facade/helper and Translation facade/helper live in `app/` (Facades + service binding or helper only). Site-wide settings UI reuses the settings layout pattern (sidebar + content) under admin or a dedicated settings module. Clean architecture: controllers delegate to Services/Actions; Form Requests for validation; Scribe and CHANGELOG maintained as specified.

## Complexity Tracking

No constitution violations. No entries required.
