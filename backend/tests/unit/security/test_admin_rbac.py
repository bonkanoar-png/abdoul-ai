"""Permission matrix tests for ADMIN and EDITOR."""

from app.infrastructure.database.models import AdminRole
from app.security.admin_rbac import AdminPermission, has_admin_permission


def test_admin_has_every_permission() -> None:
    assert all(
        has_admin_permission(AdminRole.ADMIN, permission)
        for permission in AdminPermission
    )


def test_editor_can_edit_but_cannot_delete_or_manage_documents() -> None:
    assert has_admin_permission(AdminRole.EDITOR, AdminPermission.CONTENT_CREATE)
    assert has_admin_permission(AdminRole.EDITOR, AdminPermission.CONTENT_UPDATE)
    assert not has_admin_permission(AdminRole.EDITOR, AdminPermission.CONTENT_DELETE)
    assert not has_admin_permission(AdminRole.EDITOR, AdminPermission.DOCUMENT_MANAGE)
