"""Role-based permissions for professional CMS operations."""

from enum import StrEnum

from app.infrastructure.database.models.user_admin import AdminRole


class AdminPermission(StrEnum):
    CONTENT_CREATE = "CONTENT_CREATE"
    CONTENT_READ = "CONTENT_READ"
    CONTENT_UPDATE = "CONTENT_UPDATE"
    CONTENT_DELETE = "CONTENT_DELETE"
    USER_MANAGE = "USER_MANAGE"
    DOCUMENT_MANAGE = "DOCUMENT_MANAGE"
    STATISTICS_VIEW = "STATISTICS_VIEW"
    SETTINGS_MANAGE = "SETTINGS_MANAGE"


ROLE_PERMISSIONS: dict[AdminRole, frozenset[AdminPermission]] = {
    AdminRole.ADMIN: frozenset(AdminPermission),
    AdminRole.EDITOR: frozenset(
        {
            AdminPermission.CONTENT_CREATE,
            AdminPermission.CONTENT_READ,
            AdminPermission.CONTENT_UPDATE,
        }
    ),
}


def has_admin_permission(role: AdminRole, permission: AdminPermission) -> bool:
    return permission in ROLE_PERMISSIONS[role]
