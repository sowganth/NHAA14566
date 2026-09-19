from fastapi import Header, HTTPException, status
from typing import Set, Optional


class AuthContext:
    def __init__(self, user_id: str, role: str):
        self.user_id = user_id
        self.role = role


def get_current_user(
    x_user_id: Optional[str] = Header(default="OFFICER-001"),
    x_user_role: Optional[str] = Header(default="SUPERVISOR")
) -> AuthContext:
    valid_roles = {"ADMIN", "SUPERVISOR", "CASE_OFFICER", "COUNSELLOR", "LEGAL_SUPPORT", "READ_ONLY"}
    role = (x_user_role or "SUPERVISOR").upper()
    if role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Invalid user role. Allowed: {sorted(valid_roles)}"
        )
    return AuthContext(user_id=x_user_id or "OFFICER-001", role=role)


def check_permission(auth: AuthContext, allowed_roles: Set[str]):
    if auth.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied for role '{auth.role}'. Required one of: {sorted(allowed_roles)}"
        )
