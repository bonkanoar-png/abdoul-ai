"""Framework-independent RBAC vocabulary for future authenticated APIs."""

from enum import StrEnum


class Permission(StrEnum):
    """Stable permission identifiers; additions must remain backward compatible."""

    ADMIN_PROJECTS_READ = "admin.projects.read"
    ADMIN_PROJECTS_WRITE = "admin.projects.write"
    ADMIN_MEMBERS_READ = "admin.members.read"
    ADMIN_MEMBERS_WRITE = "admin.members.write"
    API_KEYS_READ = "api_keys.read"
    API_KEYS_WRITE = "api_keys.write"
    BILLING_READ = "billing.read"


class Role(StrEnum):
    """Tenant-scoped roles planned for organization memberships."""

    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"


_ROLE_PERMISSIONS: dict[Role, frozenset[Permission]] = {
    Role.OWNER: frozenset(Permission),
    Role.ADMIN: frozenset(
        {
            Permission.ADMIN_PROJECTS_READ,
            Permission.ADMIN_PROJECTS_WRITE,
            Permission.ADMIN_MEMBERS_READ,
            Permission.ADMIN_MEMBERS_WRITE,
            Permission.API_KEYS_READ,
            Permission.API_KEYS_WRITE,
            Permission.BILLING_READ,
        }
    ),
    Role.MEMBER: frozenset(
        {
            Permission.ADMIN_PROJECTS_READ,
            Permission.ADMIN_PROJECTS_WRITE,
            Permission.ADMIN_MEMBERS_READ,
            Permission.API_KEYS_READ,
        }
    ),
    Role.VIEWER: frozenset(
        {
            Permission.ADMIN_PROJECTS_READ,
            Permission.ADMIN_MEMBERS_READ,
        }
    ),
}


def permissions_for(role: Role) -> frozenset[Permission]:
    """Return the immutable permission set assigned to a tenant role."""
    return _ROLE_PERMISSIONS[role]


def has_permission(role: Role, permission: Permission) -> bool:
    """Evaluate one role without authentication or framework side effects."""
    return permission in permissions_for(role)
