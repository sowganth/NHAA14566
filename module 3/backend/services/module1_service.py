from typing import List, Dict, Any


class Module1Service:
    """
    Module 1 — Interaction Analysis Service
    Analyzes victim/complainant interaction narrative, language, and distress cues.
    """

    @staticmethod
    def analyze_interaction(
        state: str,
        district: str,
        language: str,
        input_type: str,
        narrative: str
    ) -> Dict[str, Any]:
        narrative_lower = narrative.lower()
        detected_indicators = []

        if any(w in narrative_lower for w in ["threat", "kill", "harm", "weapon", "fear", "afraid"]):
            detected_indicators.append("high fear indicator")
        if any(w in narrative_lower for w in ["follow", "stalk", "harass", "pressure", "force", "intimidation"]):
            detected_indicators.append("possible intimidation")
        if any(w in narrative_lower for w in ["crying", "scared", "help", "panic", "distress", "trauma"]):
            detected_indicators.append("high distress indicator")
        if any(w in narrative_lower for w in ["injured", "blood", "beaten", "hospital", "pain"]):
            detected_indicators.append("physical injury indicator")
        if any(w in narrative_lower for w in ["caste", "atrocity", "discriminate", "slur", "violence"]):
            detected_indicators.append("atrocity vulnerability indicator")

        if not detected_indicators:
            detected_indicators.append("general inquiry indicator")

        count = len(detected_indicators)
        if count >= 3 or "high fear indicator" in detected_indicators:
            distress_level = "CRITICAL"
        elif count == 2:
            distress_level = "HIGH"
        elif count == 1 and "general inquiry indicator" not in detected_indicators:
            distress_level = "MODERATE"
        else:
            distress_level = "LOW"

        return {
            "language": language,
            "input_type": input_type,
            "state": state,
            "district": district,
            "detected_indicators": detected_indicators,
            "distress_level": distress_level
        }
