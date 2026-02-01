# UI Customization Specification

## Overview
The School Management System implements a controlled customization layer that allows administrators to tailor the user experience per Role. This is NOT a CMS builder; it is a scaffolding for managing navigation visibility and dashboard layouts in a safe, versionable, and auditable way.

## Rules
- **No Arbitrary Scripting**: Customization is defined via structured data (JSON/Relational), never raw JavaScript or CSS injection.
- **RBAC Strictness**: UI customization cannot bypass RBAC. If a user lacks permission for a route, the menu item remains inaccessible even if marked "visible".
- **Auditability**: Every change to UI configuration must be logged in the `audit_logs` table with previous/new state details.
- **Fail-Safe Defaults**: The system must provide hardcoded defaults in `src/lib/customization/defaults.ts` that activate if the database is empty or unreachable.

## Data Model

### `ui_menu_items`
Stores the master navigation structure.
| Field | Type | Description |
|-------|------|-------------|
| `key` | String | Unique identifier for the menu item. |
| `labelKey` | String | i18n key for the label. |
| `route` | String | Destination path. |
| `iconKey` | String | Key mapping to `ICON_MAP` in `defaults.ts`. |
| `permissionRequired`| String | (Optional) Permission slug required to see this item. |
| `order` | Int | Default display order. |

### `ui_role_menu_overrides`
Role-specific visibility and sorting.
| Field | Type | Description |
|-------|------|-------------|
| `roleId` | UUID | Target role. |
| `menuItemId` | UUID | Targeted menu item. |
| `isVisible` | Boolean | Whether the role should see this item. |

### `ui_dashboard_layouts`
| Field | Type | Description |
|-------|------|-------------|
| `roleId` | UUID | Target role. |
| `layout` | JSON | Array of widget configs: `[{ widget: string, order: number, enabled: boolean }]`. |

## Implementation Details

### Icon Rendering
Icons are resolved from `ICON_MAP` using the `iconKey`. This ensures that only authorized Lucide icons are used, preventing malicious assets.

### Navigation Resolution
The `getResolvedNavigation` helper:
1. Identifies user roles from session.
2. Fetches menu items + role overrides.
3. Merges overrides with master items.
4. Filters out items where user lacks `permissionRequired`.
5. Filters out items explicitly hidden for ALL user roles.

## Configuration Versioning

### Snapshot Lifecycle
All customizations (Menus, Dashboards, Branding) logic flows through the `ConfigSnapshot` system:

1.  **DRAFT**: Initial state of any change. Not visible to end-users.
2.  **PUBLISHED**: The single active version returned by resolvers. Promoting a Draft to Published automatically archives the previous Published version.
3.  **ARCHIVED**: Historical versions. Immutable.

### Rollback Mechanism
Rollbacks are non-destructive. Reverting to Version v1 does not "reactivate" v1. Instead, it creates a new Version v(N+1) with v1's data. This ensures a linear, audit-safe history.

### Data Model: `system_config_snapshots`
- `key`: Unique identifier (e.g., `dashboard_layout_ADMIN`)
- `version`: Sequential integer
- `status`: `DRAFT` | `PUBLISHED` | `ARCHIVED`
- `data`: JSON payload
