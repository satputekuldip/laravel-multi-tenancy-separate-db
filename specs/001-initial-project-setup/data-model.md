# Data Model: Initial Project Setup

**Feature**: 001-initial-project-setup  
**Date**: 2026-03-02

Entities and validation rules derived from the spec and existing codebase. Spatie Permission and Activity Log tables are assumed to exist.

---

## Existing entities (reference)

### User

- **Source**: `app/Models/User.php` (Laravel + Fortify + Spatie)
- **Attributes**: id, name, email, email_verified_at, password, two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at, remember_token, created_at, updated_at
- **Relationships**: roles (Spatie many-to-many), activity as causer (Spatie Activity Log)
- **Validation (from spec)**: Required identity fields on create/update (e.g. name, email); password rules on create/update

### Role (Spatie)

- **Source**: `config/permission.php` → Spatie\Permission\Models\Role
- **Attributes**: id, name, guard_name, created_at, updated_at
- **Relationships**: permissions (many-to-many), users (many-to-many via model_has_roles)

### Permission (Spatie)

- **Source**: Spatie\Permission\Models\Permission
- **Attributes**: id, name, guard_name, created_at, updated_at
- **Relationships**: roles (many-to-many)

### Language

- **Source**: `app/Models/Language.php`
- **Attributes**: id, code, name, native_name, is_default, is_active, sort_order, created_at, updated_at
- **Relationships**: translations (hasMany)
- **Validation**: code unique; at most one is_default = true; is_active boolean

### Translation

- **Source**: `app/Models/Translation.php`
- **Attributes**: id, language_id, group, key, value, created_at, updated_at
- **Relationships**: language (belongsTo)
- **Validation**: (language_id, group, key) unique per language; value required for storage

### Activity log (Spatie)

- **Source**: Spatie\Activitylog\Models\Activity
- **Attributes**: id, log_name, description, subject_type, subject_id, event, causer_type, causer_id, properties (JSON), batch_uuid, created_at
- **Relationships**: causer (User or null), subject (polymorphic)
- **Usage**: Store actor (causer), action (description/event), timestamp, and optional resource (subject) and properties (before/after or context)

---

## New entity: Setting

- **Purpose**: Key-value settings at site, group, or user scope with precedence user > group > site.
- **Attributes**:
  - id (bigInteger, primary key)
  - key (string, index)
  - value (text or JSON for structured)
  - scope (enum or string: `site` | `group` | `user`)
  - scope_id (nullable bigInteger; null for site; role_id or user_id or team_id for group/user)
  - created_at, updated_at
- **Indexes**: (scope, scope_id, key) unique so one value per key per scope/scope_id.
- **Validation**: key required, non-empty; scope in [site, group, user]; scope_id required when scope is group or user (and references existing role/user/team as chosen).
- **Relationships**: Optional belongsTo scope (e.g. User, Role) when scope_id set.

---

## State and validation summary

| Entity        | Key validation / rules |
|---------------|-------------------------|
| User          | name required; email required, unique; password on create/update per policy |
| Role          | name required, unique per guard (Spatie) |
| Permission    | name required, unique per guard (Spatie) |
| Language      | code unique; is_default boolean; is_active boolean |
| Translation   | language_id + group + key unique; value present |
| Setting       | key required; scope in site|group|user; scope_id when not site |
| Activity      | description, causer_type, causer_id; properties optional (Spatie) |

---

## Migration checklist (new only)

- [ ] **settings** table: key, value, scope, scope_id, timestamps; unique (scope, scope_id, key). Decide whether value is string or JSON and whether group scope uses role_id or a future team_id.

Existing: users, languages, translations, Spatie permission tables, activity_log (Spatie).
