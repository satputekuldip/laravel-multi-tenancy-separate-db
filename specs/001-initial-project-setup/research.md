# Research: Initial Project Setup

**Feature**: 001-initial-project-setup  
**Date**: 2026-03-02

Resolves technical choices for the initial project setup spec. No NEEDS CLARIFICATION remained in the plan; this document records decisions and alternatives.

---

## 1. Role and permission management

**Decision**: Use existing **Spatie Laravel Permission** (already in use). Admin UI for CRUD on roles and permissions; client permission checks via existing API (`/api/permissions`, `/api/permissions/roles`, `/api/permissions/user`).

**Rationale**: Package is already integrated (User has `HasRoles`, seeders and migrations exist). Extending admin UI and ensuring API is complete and documented (Scribe) is sufficient.

**Alternatives considered**: Custom RBAC (rejected: duplicate effort); Gate/Policy-only (rejected: spec requires assignable roles and client API).

---

## 2. Activity / audit logs

**Decision**: Use existing **Spatie Laravel Activity Log**. Add admin UI to list, filter (actor, action type, date range), and paginate activity; ensure critical actions (login, user/role changes, settings changes) are logged.

**Rationale**: User model already uses `LogsActivity` and `LogOptions`. Adding an ActivityLogController and Inertia page for admins satisfies FR-004 and FR-005.

**Alternatives considered**: Custom audit table (rejected: Spatie already in place); log to external service only (rejected: spec requires admin view).

---

## 3. Settings (user, group, site)

**Decision**: Introduce a **Setting** model (key, value, scope, scope_id) with scopes: `site` (scope_id null), `group` (e.g. role_id or team_id), `user` (user_id). Provide a **Settings facade** (or helper) that resolves with precedence: user > group > site. Admin site-settings UI uses a default layout (sidebar + form) under the settings module pattern.

**Rationale**: Spec requires key-value at three levels and a facade/helper. Config/files alone do not support per-user or per-group overrides. A single table with scope columns keeps the model simple and queryable.

**Alternatives considered**: JSON column on users/roles (rejected: harder to query and to share group defaults); config-only (rejected: no user/group scope).

---

## 4. Translation and i18n

**Decision**: Keep existing **Language** and **Translation** models (with `group` for namespacing). Add a **Translation facade** (or helper) that resolves by key (and optional group) for the current locale, with fallback to default language then key. Admin UI to manage languages and translations (CRUD); locale stored in session or user preference.

**Rationale**: Models already exist; adding a facade and admin UI completes FR-010–FR-012 without replacing the current schema.

**Alternatives considered**: Laravel’s built-in `lang/` files only (rejected: spec requires admin-managed translations); separate package (rejected: existing DB structure is sufficient).

---

## 5. API documentation (Scribe)

**Decision**: Add **knuckleswtf/scribe** if not present. Document **all** API controllers (Admin-facing APIs that are consumed by the SPA and any external API routes) with Scribe: `@group`, `@bodyParam`/`@queryParam`/`@urlParam`, success and error `@response` with non-empty examples. Run `php artisan scribe:generate` after API or annotation changes.

**Rationale**: Constitution and user constraint require detailed, maintained API docs. Scribe is the standard for Laravel; “maintain in details” implies full annotations and realistic examples.

**Alternatives considered**: OpenAPI-only by hand (rejected: Scribe keeps docs next to code); no API docs (rejected: constitution requirement).

---

## 6. Changelog and architecture

**Decision**: **CHANGELOG.md** updated after every completed user story or significant change; on release, add `## [x.y.z] - YYYY-MM-DD` with Added/Changed/Fixed and keep comparison links at bottom. **Architecture**: thin controllers; validation via Form Requests; business logic in Services or Actions; no business logic in controllers; Scribe and changelog as part of Definition of Done.

**Rationale**: User constraints: “maintain changelogs” and “keep Architecture clean.” Aligns with constitution (documentation, code quality).

**Alternatives considered**: Changelog only on release (rejected: user said “maintain”); logic in controllers (rejected: constitution and “clean architecture”).

---

## 7. Dashboard and admin layout

**Decision**: Single **dashboard** Inertia page with at least two summary widgets (e.g. user count, recent activity). Widgets link to admin list views (users, activity log). Use existing Tailwind/design system; empty states when no data. Admin area remains under `routes/web.php` with `admin` prefix and existing middleware.

**Rationale**: Spec FR-006 and success criteria SC-004; existing dashboard route and admin routes provide the base.

**Alternatives considered**: Multiple dashboard pages (rejected: spec says “single dashboard”); no empty states (rejected: constitution UX).

---

## Summary table

| Area              | Decision                         | Key artifact / package        |
|-------------------|----------------------------------|--------------------------------|
| Roles/permissions | Spatie Permission + admin + API | Existing; extend admin UI, Scribe |
| Activity log      | Spatie Activity Log + admin UI  | ActivityLogController, Inertia page |
| Settings          | Setting model + facade          | Migration, Settings facade, site settings UI |
| i18n              | Language/Translation + facade   | Translation facade, admin languages/translations UI |
| API docs          | Scribe for all API controllers  | knuckleswtf/scribe, annotations |
| Changelog/arch    | CHANGELOG + thin controllers    | Process + Form Requests, Services/Actions |
