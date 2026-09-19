import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import yaml
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "NHAA-SVI-Engine"
    APP_ENV: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Security
    API_KEY_REQUIRED: bool = False
    API_KEYS: List[str] = [
        "demo-team1-key-14566",
        "demo-team3-key-14566",
        "admin-key-secure",
    ]

    # Database: SQLite fallback if postgres not configured
    DATABASE_URL: str = "sqlite:///./svi_assessment.db"

    # Configuration file path
    SCORING_CONFIG_PATH: str = "config/scoring.yaml"

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()


def find_scoring_config_path(path_str: str) -> Path:
    """Resolve scoring.yaml path considering various working directories."""
    path = Path(path_str)
    if path.is_file():
        return path

    # Check relative to app directory
    base_dir = Path(__file__).resolve().parent.parent.parent
    candidate = base_dir / path_str
    if candidate.is_file():
        return candidate

    # Check directly inside config/
    candidate2 = base_dir / "config" / "scoring.yaml"
    if candidate2.is_file():
        return candidate2

    raise FileNotFoundError(f"Scoring config file not found at {path_str} or {candidate}")


def load_scoring_config() -> Dict[str, Any]:
    """Load scoring configuration from YAML."""
    config_path = find_scoring_config_path(settings.SCORING_CONFIG_PATH)
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


# Cached configuration
scoring_config = load_scoring_config()
