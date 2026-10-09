# API Contracts: Initial Project Setup

**Feature**: 001-initial-project-setup  
**Date**: 2026-03-02

Contract for API endpoints used by the SPA or external clients. All must be documented with Scribe: `@group`, `@urlParam`/`@queryParam`/`@bodyParam`, `@response` (success and errors) with **non-empty** example arrays/objects.

---

## Authentication

All listed routes assume `auth` (and optionally `verified`) middleware unless noted. Document 401/403 where applicable.

---

## Permissions (API)

**Base path**: `/api` (prefix), under `web` + `auth`.

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | /api/permissions | PermissionController@index | List all permissions (id, name, guard_name, timestamps). |
| GET | /api/permissions/roles | PermissionController@roles | List all roles with permission names. |
| GET | /api/permissions/user | PermissionController@userPermissions | Current user's permissions, roles, direct_permissions. |
| GET | /api/permissions/check | PermissionController@check (new) | Check if current user has permission. Query: `permission` (required). Response: `{ "allowed": true \| false }`. 403 if unauthenticated. |

**Scribe alignment**:  
- `@group` Permissions  
- Index: no params; response 200 with `permissions` array (at least one object with id, name, guard_name, created_at, updated_at).  
- Roles: no params; response 200 with `roles` array (each role has id, name, guard_name, permissions array of strings, created_at, updated_at).  
- User: no params; response 200 with `permissions`, `roles`, `direct_permissions` (arrays of strings).  
- Check: `@queryParam permission string required`; response 200 `{ "allowed": true }` or `{ "allowed": false }`; 401/403 as applicable.

---

## Languages & Translations (API)

**Base path**: `/api`.

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | /api/languages | LanguageController@index | Active languages (id, code, name, native_name, is_default, is_active, sort_order, timestamps). |
| GET | /api/languages/{languageCode}/translations | LanguageController@translations | Translations for one language by code; response grouped by `group`. |
| GET | /api/languages/translations/all | LanguageController@allTranslations | All active languages with their translations (grouped). |

**Scribe alignment**:  
- `@group` Languages  
- Index: response 200 `languages` array (at least one full language object).  
- Translations: `@urlParam languageCode string required`; response 200 `language` object + `translations` (object keyed by group, each group keyed by key with value).  
- All: response 200 `languages` array; each item has code, name, native_name, translations (nested by group).  
- Document 404 when language not found (e.g. translations by code).

---

## Settings (API) – optional

If settings are exposed via API (e.g. for client to read user/site settings):

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | /api/settings | SettingsController@index | Current user effective settings (merged user > group > site). Query: optional `keys[]`. |
| PATCH | /api/settings | SettingsController@update | Set user-level settings. Body: `{ "key": "value", ... }`. |

**Scribe alignment**:  
- `@group` Settings  
- Index: `@queryParam keys[]` optional array; response 200 object of key-value.  
- Update: `@bodyParam` key-value pairs; response 200 updated user settings or 422 validation.

---

## Admin (Inertia / web)

Admin routes are Inertia-rendered pages, not REST JSON API. If any admin actions are exposed as API (e.g. for future mobile or external tools), add them here and document with Scribe.  
Current scope: admin uses web routes; API contracts above cover client-facing permission and language/translation APIs.

---

## Error responses (standard)

Document for all endpoints where applicable:

- **401 Unauthorized**: Missing or invalid auth.
- **403 Forbidden**: Authenticated but not allowed (e.g. missing permission).
- **404 Not Found**: Resource missing (e.g. language code, user id).
- **422 Unprocessable Entity**: Validation errors; body with `message`, `errors` (field => messages).
- **500**: Generic server error (optional in Scribe).

---

## Changelog / Scribe maintenance

- After adding or changing any API controller or route: run `php artisan scribe:generate`.
- Keep this contract in sync with actual routes and Scribe annotations; use it as the single source for “what to document in detail.”
