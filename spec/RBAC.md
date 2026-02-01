# Role-Based Access Control (RBAC) Specification

## 1. Philosophy
Access is granted based on **Permissions**, not Roles. Roles are simply collections of permissions.
Code checks `hasPermission('module.action')`, never `isRole('ADMIN')`.

## 2. System Roles (Immutable)
These roles are seeded and cannot be deleted, but their permissions can be adjusted (except Super Admin if applicable, though here SCHOOL_ADMIN is the top).
- **SCHOOL_ADMIN**: Full access to all `*.*` permissions initially.
- **TEACHER**: Standard academic permissions.
- **STUDENT**: Read-only access to their own data.
- **GUARDIAN**: Read-only access to their wards' data.

## 3. Custom Roles
- Admin can create new roles (e.g., "Accountant", "Librarian").
- Admin assigns specific permissions to these roles.

## 4. Permission Model
Format: `resource.action`

### defined Permissions
| Module       | Permissions |
|--------------|-------------|
| **Students** | `students.view`, `students.create`, `students.edit`, `students.delete` |
| **Attendance**| `attendance.take`, `attendance.report` |
| **Exams**    | `exams.manage`, `results.publish` |
| **CMS**      | `cms.edit`, `settings.branding` |
| **Users**    | `users.manage`, `roles.manage` |
| **Export**   | `export.csv`, `export.pdf` |

## 5. Enforcement Layers
1.  **Frontend**:
    - `VerifiedRoute` wrapper or Middleware checks perms.
    - Sidebar items hidden if permission missing.
    - Buttons disabled/hidden.
2.  **Backend (API/Server Actions)**:
    - Guards at top of every sensitive function.
    - `if (!hasPermission(user, 'students.create')) throw new Error('Unauthorized')`

## 6. Schema Implications
- `Role` table.
- `Permission` table (seeded list).
- `RolePermission` join table.
- `UserRole` join table (Users can have multiple roles, permissions are union).
