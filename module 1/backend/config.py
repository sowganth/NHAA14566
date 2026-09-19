import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'assessment_audit.db')}")

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
