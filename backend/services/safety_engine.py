from typing import Any, Dict, List, Optional
from backend.config.config import scoring_config
from backend.schemas.module2_schema import ContextFactors, PsychologicalFeatures


class SafetyEngineResult:
    def __init__(
        self,
        is_critical_override: bool,
        override_category: Optional[str],
        human_review_required: bool,
        priority_override: Optional[str],
        safety_flags: List[str],
        trigger_reasons: List[str],
    ):
        self.is_critical_override = is_critical_override
        self.override_category = override_category
        self.human_review_required = human_review_required
        self.priority_override = priority_override
        self.safety_flags = safety_flags
        self.trigger_reasons = trigger_reasons


class SafetyEngine:
    """
    Critical Safety Flag Engine for NHAA 14566.
    Evaluates acute safety overrides that cannot be diluted by weighted averaging.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or scoring_config
        self.rules = self.config.get("safety_rules", {})

    def evaluate_safety(
        self, features: PsychologicalFeatures, context: Optional[ContextFactors]
    ) -> SafetyEngineResult:
        safety_flags: List[str] = []
        trigger_reasons: List[str] = []
        is_critical = False
        human_review_required = False
        priority_override: Optional[str] = None

        feat_dict = features.model_dump()
        ctx_dict = context.model_dump() if context else {}

        # 1. Immediate Danger Check
        imm_rule = self.rules.get("immediate_danger", {})
        if imm_rule.get("enabled", True):
            imm_val = feat_dict.get("immediate_danger")
            if imm_val is not None and imm_val >= 1.0:
                is_critical = True
                human_review_required = True
                priority_override = imm_rule.get("priority", "URGENT_HUMAN_REVIEW")
                safety_flags.append(imm_rule.get("flag", "IMMEDIATE_DANGER"))
                trigger_reasons.append(imm_rule.get("reason", "Immediate physical danger indicated"))

        # 2. Suicidal Ideation Check
        suicide_rule = self.rules.get("suicidal_ideation", {})
        if suicide_rule.get("enabled", True):
            si_val = feat_dict.get("suicidal_ideation")
            si_threshold = suicide_rule.get("threshold", 40.0)
            if si_val is not None and si_val >= si_threshold:
                is_critical = True
                human_review_required = True
                priority_override = suicide_rule.get("priority", "URGENT_HUMAN_REVIEW")
                safety_flags.append(suicide_rule.get("flag", "SUICIDAL_IDEATION_DETECTED"))
                trigger_reasons.append(
                    f"{suicide_rule.get('reason')} (indicator score: {si_val:.0f} >= {si_threshold:.0f})"
                )

        # 3. Self-Harm Indicator Check
        sh_rule = self.rules.get("self_harm_indicator", {})
        if sh_rule.get("enabled", True):
            sh_val = feat_dict.get("self_harm_indicator")
            sh_threshold = sh_rule.get("threshold", 40.0)
            if sh_val is not None and sh_val >= sh_threshold:
                is_critical = True
                human_review_required = True
                priority_override = sh_rule.get("priority", "URGENT_HUMAN_REVIEW")
                safety_flags.append(sh_rule.get("flag", "SELF_HARM_RISK_DETECTED"))
                trigger_reasons.append(
                    f"{sh_rule.get('reason')} (indicator score: {sh_val:.0f} >= {sh_threshold:.0f})"
                )

        # 4. Severe Threat Check
        threat_rule = self.rules.get("severe_threat", {})
        if threat_rule.get("enabled", True):
            threat_val = feat_dict.get("threat")
            threat_threshold = threat_rule.get("threshold", 85.0)
            if threat_val is not None and threat_val >= threat_threshold:
                human_review_required = True
                if not priority_override:
                    priority_override = threat_rule.get("priority", "URGENT_HUMAN_REVIEW")
                safety_flags.append(threat_rule.get("flag", "SEVERE_THREAT_PRESENT"))
                trigger_reasons.append(
                    f"{threat_rule.get('reason')} (perceived threat: {threat_val:.0f} >= {threat_threshold:.0f})"
                )

        # 5. Contextual Overrides: Murder of Family Member
        murder_rule = self.rules.get("atrocity_murder", {})
        if murder_rule.get("enabled", True) and ctx_dict.get("murder_of_family_member"):
            is_critical = True
            human_review_required = True
            priority_override = murder_rule.get("priority", "URGENT_HUMAN_REVIEW")
            safety_flags.append(murder_rule.get("flag", "ATROCITY_MURDER_REPORTED"))
            trigger_reasons.append(murder_rule.get("reason", "Homicide reported"))

        # 6. Contextual Overrides: Sexual Violence
        sv_rule = self.rules.get("sexual_violence", {})
        if sv_rule.get("enabled", True) and ctx_dict.get("sexual_violence_reported"):
            is_critical = True
            human_review_required = True
            priority_override = sv_rule.get("priority", "URGENT_HUMAN_REVIEW")
            safety_flags.append(sv_rule.get("flag", "SEXUAL_VIOLENCE_REPORTED"))
            trigger_reasons.append(sv_rule.get("reason", "Sexual violence reported"))

        return SafetyEngineResult(
            is_critical_override=is_critical,
            override_category="CRITICAL" if is_critical else None,
            human_review_required=human_review_required,
            priority_override=priority_override,
            safety_flags=safety_flags,
            trigger_reasons=trigger_reasons,
        )
