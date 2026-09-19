import random
from typing import Dict, Any, Optional
from services.text_analyzer import analyze_text_interaction
from config import NON_CLINICAL_DISCLAIMER

def analyze_voice_interaction(
    audio_filename: Optional[str] = None,
    transcript_text: Optional[str] = None,
    language: str = "Tamil",
    case_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Extracts acoustic voice features and performs speech emotion + transcript distress analysis.
    In hackathon demo mode, if live ML acoustic model is not attached, realistic mock features 
    are generated alongside transcript NLP and labeled with a clear demo notice.
    """
    
    # Standard demo transcript if none supplied
    if not transcript_text or len(transcript_text.strip()) == 0:
        if language == "Tamil":
            transcript_text = "அவர் என்னை தினமும் மிரட்டுகிறார். நான் வெளியே செல்லக்கூட பயப்படுகிறேன். எனக்கு வேறு வழி தெரியவில்லை, தயவுசெய்து உதவுங்கள்."
        elif language == "Hindi":
            transcript_text = "वह मुझे रोज धमकी देता है। मैं घर से बाहर निकलने में भी डरती हूँ। मेरे पास कोई सहारा नहीं है।"
        else:
            transcript_text = "He threatens me every day. I am terrified to leave my house. I have nowhere to go and no one to turn to for help."

    # Extract NLP results from transcript
    text_results = analyze_text_interaction(transcript_text, language=language, case_id=case_id)
    
    # Calculate or simulate speech features based on distress level
    distress_level = text_results["emotion_scores"]["distress"]
    
    # Acoustic modulation based on distress
    speech_rate = max(80, 160 - int(distress_level * 0.6))  # Distress often lowers WPM due to pauses
    pause_freq = max(2, int(distress_level * 0.08) + 2)    # More frequent pauses
    pitch_var = max(15, int(distress_level * 0.45) + 18)   # Higher pitch instability
    intensity = max(45, int(distress_level * 0.3) + 52)    # Voice intensity index
    hesitation = min(98, max(25, int(distress_level * 0.85) + 10)) # Hesitation index
    
    speech_features = {
        "speech_rate": speech_rate,
        "pause_frequency": pause_freq,
        "pitch_variation": pitch_var,
        "intensity": intensity,
        "hesitation": hesitation
    }

    # Add vocal indicators to indicators list
    indicators = list(text_results["indicators"])
    if hesitation > 60:
        indicators.append("Speech hesitation & vocal tremor indicator")
    if pause_freq > 5:
        indicators.append("Frequent speech interruption & vocal pauses")
    if pitch_var > 45:
        indicators.append("Elevated pitch variation & acoustic stress")

    # Add vocal explainability item
    explainability = list(text_results["explainability"])
    explainability.append({
        "indicator": "Acoustic Vocal Tremor & Pitch Instability",
        "category": "Voice Acoustic Feature Analysis",
        "confidence": min(92, 75 + int(hesitation * 0.2)),
        "matched_term": f"Pitch Var: {pitch_var}Hz, Hesitation: {hesitation}%",
        "rationale": "Acoustic prosody analysis indicates voice tremor, long pauses, and frequency modulation characteristic of emotional stress."
    })

    return {
        "case_id": case_id or text_results.get("case_id"),
        "language": language,
        "analysis_type": "Voice",
        "transcript": transcript_text,
        "speech_features": speech_features,
        "emotion_scores": text_results["emotion_scores"],
        "indicators": list(set(indicators)),
        "trauma_indicators": text_results["trauma_indicators"],
        "vulnerability_indicators": text_results["vulnerability_indicators"],
        "urgent_safety_indicators": text_results["urgent_safety_indicators"],
        "urgent_review": text_results["urgent_review"],
        "confidence": text_results["confidence"],
        "explainability": explainability,
        "demo_notice": "DEMO ANALYSIS — Replace with validated speech/emotion model.",
        "disclaimer": NON_CLINICAL_DISCLAIMER
    }
