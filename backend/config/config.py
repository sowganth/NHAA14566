import os
from pathlib import Path
from typing import Any, Dict
import yaml

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

SUPPORTED_LANGUAGES = [
    "English",
    "Tamil",
    "Hindi",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Bengali",
    "Gujarati",
    "Punjabi",
    "Urdu"
]

DIALECT_EXPANSION_NOTICE = (
    "Language support can be expanded to additional Indian languages and regional dialects "
    "using specialized multilingual speech-to-text and NLP models."
)

NON_CLINICAL_DISCLAIMER = (
    "This system is an AI decision-support prototype for victim assistance intake. "
    "It provides supportive risk indicators and does NOT produce clinical medical diagnoses "
    "or make autonomous police/legal decisions. High-risk cases require immediate human review."
)


def load_scoring_config() -> Dict[str, Any]:
    """Load SVI scoring configuration from YAML."""
    yaml_path = os.path.join(BASE_DIR, "svi_config.yaml")
    if not os.path.exists(yaml_path):
        # Fallback candidate check
        alt_path = os.path.join(os.path.dirname(BASE_DIR), "config", "svi_config.yaml")
        if os.path.exists(alt_path):
            yaml_path = alt_path

    with open(yaml_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


scoring_config = load_scoring_config()
