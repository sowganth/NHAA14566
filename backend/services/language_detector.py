SCRIPT_RANGES = {
    "Tamil": (0x0B80, 0x0BFF),
    "Hindi": (0x0900, 0x097F),  # Devanagari (Hindi, Marathi)
    "Marathi": (0x0900, 0x097F),
    "Telugu": (0x0C00, 0x0C7F),
    "Kannada": (0x0C80, 0x0CFF),
    "Malayalam": (0x0D00, 0x0D7F),
    "Bengali": (0x0980, 0x09FF),
    "Gujarati": (0x0A80, 0x0AFF),
    "Punjabi": (0x0A00, 0x0A7F),  # Gurmukhi
    "Urdu": (0x0600, 0x06FF)      # Arabic script
}


def detect_language(text: str, fallback_language: str = "English") -> str:
    """Detect language based on primary script characters in text."""
    if not text:
        return fallback_language

    counts = {lang: 0 for lang in SCRIPT_RANGES}

    for char in text:
        cp = ord(char)
        for lang, (start, end) in SCRIPT_RANGES.items():
            if start <= cp <= end:
                counts[lang] += 1

    max_lang = max(counts, key=counts.get)
    if counts[max_lang] > 2:
        return max_lang

    return fallback_language
