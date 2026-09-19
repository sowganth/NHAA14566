from typing import List, Dict, Any


class SupportRecommendationService:
    """
    Transparent rule-based recommendation engine for Module 3.
    This service maps SVI scores, risk categories, risk factors, and safety indicators
    into recommended support pathways for authorized human officer review.
    
    IMPORTANT: This system is a decision-support prototype and does NOT replace
    human officers, counsellors, lawyers, or medical professionals.
    """

    @staticmethod
    def generate_recommendations(
        svi: int,
        risk_category: str,
        risk_factors: List[str],
        human_review_required: bool = True,
        urgent_safety_indicator: bool = False
    ) -> List[Dict[str, Any]]:
        recommendations = []

        # Urgent / Emergency Safety Review
        if urgent_safety_indicator or risk_category == "Critical":
            recommendations.append({
                "type": "EMERGENCY_HUMAN_REVIEW",
                "priority": "URGENT",
                "label": "Urgent human safety review required",
                "requires_human_approval": True,
                "suggested_action": "Priority human review required — evaluation by authorized helpline officer under safety protocols."
            })

        # Category based logic
        if risk_category == "Critical":
            recommendations.append({
                "type": "COUNSELLING",
                "priority": "HIGH",
                "label": "Counselling & trauma professional referral review",
                "requires_human_approval": True,
                "suggested_action": "Recommended for review: immediate trauma counselling referral by accredited specialist."
            })
            recommendations.append({
                "type": "LEGAL_AID",
                "priority": "HIGH",
                "label": "Legal aid & assistance review",
                "requires_human_approval": True,
                "suggested_action": "Consider referral: connect with District Legal Services Authority (DLSA) support officer."
            })
            recommendations.append({
                "type": "WITNESS_PROTECTION_REVIEW",
                "priority": "HIGH",
                "label": "Protection-related review where applicable",
                "requires_human_approval": True,
                "suggested_action": "Subject to authorized protocol: evaluate witness/victim protection measures."
            })
            recommendations.append({
                "type": "DISTRICT_AUTHORITY_REVIEW",
                "priority": "HIGH",
                "label": "District authority notification review",
                "requires_human_approval": True,
                "suggested_action": "Recommended for review: notify district magistrate/authority officer."
            })
            recommendations.append({
                "type": "FOLLOW_UP",
                "priority": "URGENT",
                "label": "Priority 24-hour follow-up schedule",
                "requires_human_approval": True,
                "suggested_action": "Priority follow-up: schedule mandatory check-in within 24 hours."
            })

        elif risk_category == "High":
            recommendations.append({
                "type": "EMERGENCY_HUMAN_REVIEW",
                "priority": "HIGH",
                "label": "Priority human officer review",
                "requires_human_approval": True,
                "suggested_action": "Priority human review required: verify risk factors and assign case officer."
            })
            recommendations.append({
                "type": "COUNSELLING",
                "priority": "HIGH",
                "label": "Psychosocial counselling referral review",
                "requires_human_approval": True,
                "suggested_action": "Recommended for review: schedule counselling session with qualified counsellor."
            })
            recommendations.append({
                "type": "LEGAL_AID",
                "priority": "HIGH",
                "label": "Legal assistance referral review",
                "requires_human_approval": True,
                "suggested_action": "Consider referral: evaluate legal aid eligibility and advice."
            })
            recommendations.append({
                "type": "DISTRICT_AUTHORITY_REVIEW",
                "priority": "MODERATE",
                "label": "Appropriate district authority review",
                "requires_human_approval": True,
                "suggested_action": "Recommended for review: forward assessment to district nodal officer."
            })
            recommendations.append({
                "type": "FOLLOW_UP",
                "priority": "HIGH",
                "label": "Schedule follow-up review",
                "requires_human_approval": True,
                "suggested_action": "Priority follow-up: schedule review within 48 hours."
            })

        elif risk_category == "Moderate":
            recommendations.append({
                "type": "COUNSELLING",
                "priority": "MODERATE",
                "label": "Counselling service review",
                "requires_human_approval": True,
                "suggested_action": "Consider referral: offer supportive counselling options."
            })
            recommendations.append({
                "type": "LEGAL_AID",
                "priority": "MODERATE",
                "label": "Legal-aid information review",
                "requires_human_approval": True,
                "suggested_action": "Provide legal rights information and DLSA helpline details."
            })
            recommendations.append({
                "type": "SOCIAL_SUPPORT",
                "priority": "MODERATE",
                "label": "Community & social support pathway",
                "requires_human_approval": True,
                "suggested_action": "Consider referral: connect with local welfare officers or authorized social support."
            })
            recommendations.append({
                "type": "FOLLOW_UP",
                "priority": "MODERATE",
                "label": "Routine follow-up schedule",
                "requires_human_approval": True,
                "suggested_action": "Schedule routine follow-up check-in within 7 days."
            })

        else:  # Low risk
            recommendations.append({
                "type": "SOCIAL_SUPPORT",
                "priority": "LOW",
                "label": "General helpline information",
                "requires_human_approval": False,
                "suggested_action": "Provide general NHAA helpline guidance and resource brochure."
            })
            recommendations.append({
                "type": "COUNSELLING",
                "priority": "LOW",
                "label": "Optional counselling information",
                "requires_human_approval": False,
                "suggested_action": "Optional counselling available upon victim request."
            })
            recommendations.append({
                "type": "FOLLOW_UP",
                "priority": "LOW",
                "label": "Optional follow-up",
                "requires_human_approval": False,
                "suggested_action": "Follow-up if requested by complainant or required by protocol."
            })

        # Specific risk factors additions
        rf_lower = [rf.lower() for rf in risk_factors]
        if any("medical" in rf or "injury" in rf or "physical distress" in rf for rf in rf_lower):
            if not any(r["type"] == "MEDICAL_SUPPORT" for r in recommendations):
                recommendations.append({
                    "type": "MEDICAL_SUPPORT",
                    "priority": "HIGH" if svi > 60 else "MODERATE",
                    "label": "Medical support evaluation review",
                    "requires_human_approval": True,
                    "suggested_action": "Recommended for review: medical assessment by authorized medical team."
                })

        if any("police" in rf or "intimidation" in rf or "threat" in rf for rf in rf_lower):
            if not any(r["type"] == "POLICE_ASSISTANCE" for r in recommendations):
                recommendations.append({
                    "type": "POLICE_ASSISTANCE",
                    "priority": "HIGH" if svi > 70 else "MODERATE",
                    "label": "Police liaison / protection review",
                    "requires_human_approval": True,
                    "suggested_action": "Subject to authorized protocol: review by police liaison officer."
                })

        return recommendations
