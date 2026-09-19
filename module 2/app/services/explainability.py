from typing import Dict, List, Optional, Tuple
from app.schemas.input import ContextFactors, PsychologicalFeatures
from app.schemas.output import FeatureContribution
from app.services.safety_engine import SafetyEngineResult


class ExplainabilityService:
    """
    Explainability Service for SVI Assessment Engine.
    Produces rank-ordered contributing factors, transparent weight breakdowns, and contextual flags.
    """

    HUMAN_READABLE_NAMES: Dict[str, str] = {
        "fear": "Reported fear",
        "threat": "Perceived threat",
        "trauma": "Trauma indicators",
        "anxiety": "Anxiety indicators",
        "stress": "Stress indicators",
        "intimidation": "Intimidation indicators",
        "social_isolation": "Social isolation",
        "helplessness": "Helplessness indicators",
        "speech_distress": "Speech acoustic distress",
        "speech_hesitation": "Speech hesitation",
        "speech_instability": "Speech tremor/instability",
        "sadness": "Sadness indicators",
        "anger": "Anger indicators",
        "displacement": "Displacement from home/village",
        "ongoing_threat": "Active ongoing perpetrator threat",
        "contextual_risk": "Incident contextual atrocity factors",
    }

    def generate_explanations(
        self,
        features: PsychologicalFeatures,
        context: Optional[ContextFactors],
        contributions: List[FeatureContribution],
        safety_result: SafetyEngineResult,
    ) -> Tuple[List[str], List[str]]:
        """
        Generate (contributing_factors, risk_flags)
        """
        contributing_factors: List[str] = []
        risk_flags: List[str] = []

        # 1. Include safety trigger reasons first if any
        for reason in safety_result.trigger_reasons:
            contributing_factors.append(f"CRITICAL SAFETY OVERRIDE: {reason}")

        for flag in safety_result.safety_flags:
            if flag not in risk_flags:
                risk_flags.append(flag)

        # 2. Add flags based on context
        if context:
            if context.ongoing_threat and "ONGOING_THREAT" not in risk_flags:
                risk_flags.append("ONGOING_THREAT")
                if "Active ongoing perpetrator threat" not in contributing_factors:
                    contributing_factors.append("Active ongoing perpetrator threat")
            if context.displacement and "DISPLACEMENT_REPORTED" not in risk_flags:
                risk_flags.append("DISPLACEMENT_REPORTED")
                contributing_factors.append("Displacement or eviction from residence")
            if context.social_boycott and "SOCIAL_BOYCOTT" not in risk_flags:
                risk_flags.append("SOCIAL_BOYCOTT")
                contributing_factors.append("Community/social boycott imposed on victim")
            if context.legal_delay and "LEGAL_DELAY_REPORTED" not in risk_flags:
                risk_flags.append("LEGAL_DELAY_REPORTED")
                contributing_factors.append("Reported denial or delay in legal/police protection")

        # 3. Sort feature contributions by weighted contribution descending
        valid_contribs = [c for c in contributions if c.raw_score is not None]
        valid_contribs.sort(key=lambda x: x.weighted_contribution, reverse=True)

        # 4. Generate top drivers from weighted contributions
        for c in valid_contribs[:5]:
            label = self.HUMAN_READABLE_NAMES.get(c.feature, c.feature.replace("_", " ").title())
            if c.raw_score >= 75:
                phrase = f"High {label.lower()} ({c.raw_score:.0f}/100)"
                flag_name = f"HIGH_{c.feature.upper()}"
            elif c.raw_score >= 50:
                phrase = f"Elevated {label.lower()} ({c.raw_score:.0f}/100)"
                flag_name = f"ELEVATED_{c.feature.upper()}"
            elif c.raw_score >= 30:
                phrase = f"Moderate {label.lower()} ({c.raw_score:.0f}/100)"
                flag_name = None
            else:
                phrase = f"Mild {label.lower()} ({c.raw_score:.0f}/100)"
                flag_name = None

            if phrase not in contributing_factors:
                contributing_factors.append(phrase)

            if flag_name and flag_name not in risk_flags and c.raw_score >= 65:
                risk_flags.append(flag_name)

        return contributing_factors, risk_flags
