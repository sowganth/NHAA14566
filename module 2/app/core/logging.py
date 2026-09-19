import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Dict


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for privacy-conscious structured audit logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "module": record.module,
            "message": record.getMessage(),
        }

        # Include custom audit attributes if present
        if hasattr(record, "case_id"):
            # Anonymize or mask case_id if needed, preserve prefix
            raw_case = getattr(record, "case_id")
            if raw_case and len(str(raw_case)) > 8:
                log_obj["case_id_masked"] = str(raw_case)[:5] + "***" + str(raw_case)[-4:]
            else:
                log_obj["case_id_masked"] = str(raw_case)

        if hasattr(record, "event_type"):
            log_obj["event_type"] = getattr(record, "event_type")

        if hasattr(record, "risk_category"):
            log_obj["risk_category"] = getattr(record, "risk_category")

        if hasattr(record, "human_review_required"):
            log_obj["human_review_required"] = getattr(record, "human_review_required")

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Configure privacy-conscious structured logger."""
    logger = logging.getLogger("svi_engine")
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    # Prevent duplicate handlers if re-initialized
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)

    return logger


logger = setup_logging()
