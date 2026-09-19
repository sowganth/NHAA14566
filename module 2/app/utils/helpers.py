"""Utility helper functions for SVI Engine"""
from typing import Any, Dict


def sanitize_audit_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Strip any inadvertent PII fields before logging or exporting."""
    sensitive_keys = {"victim_name", "caller_name", "phone", "aadhaar", "address", "transcript"}
    return {k: v for k, v in payload.items() if k.lower() not in sensitive_keys}
