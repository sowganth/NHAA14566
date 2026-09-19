"""
NHAA 14566 - Module 2: SVI Assessment Engine
Interactive Demonstration Script
Runs 5 benchmark scenarios and prints explainable vulnerability assessments.
"""

import json
import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

import httpx
from app.main import app
from app.models.database import init_db
from app.schemas.input import AssessmentInput
from app.services import AssessmentCoordinator


def run_demo():
    print("=" * 75)
    print("  NATIONAL HELPLINE AGAINST ATROCITIES (NHAA 14566)")
    print("  MODULE 2: STRESS VULNERABILITY ASSESSMENT ENGINE (SVI ENGINE)")
    print("  DECISION SUPPORT SYSTEM (NON-CLINICAL)")
    print("=" * 75)
    print()

    # Load demo cases
    cases_path = Path(__file__).resolve().parent / "demo_cases.json"
    if not cases_path.exists():
        print(f"Error: Demo cases file not found at {cases_path}")
        return

    with open(cases_path, "r", encoding="utf-8") as f:
        demo_cases = json.load(f)

    # Initialize coordinator directly
    init_db()
    coordinator = AssessmentCoordinator()

    for idx, case in enumerate(demo_cases, 1):
        case_id = case.get("case_id")
        desc = case.get("description", "")
        print(f"[{idx}/5] Evaluating {case_id}")
        print(f"Scenario: {desc}")
        print("-" * 50)

        case_clean = dict(case)
        case_clean.pop("description", None)
        input_data = AssessmentInput(**case_clean)
        result = coordinator.process_assessment(input_data)

        # Output format matching Section 20 requirements
        print(f"Case: {result.case_id}")
        print()
        print(f"SVI: {result.assessment.svi_score:.0f}")
        print(f"Risk: {result.assessment.risk_category}")
        print(f"Confidence: {result.assessment.confidence:.2f}")
        print()
        print("Top Indicators:")
        for ind in result.indicators[:3]:
            print(f"- {ind.name.replace('_', ' ').title()}: {ind.score:.0f} ({ind.severity.upper()})")

        print()
        review_status = "REQUIRED" if result.assessment.human_review_required else "NOT_REQUIRED"
        print(f"Human Review: {review_status}")
        print(f"Priority: {result.recommended_priority}")

        if result.risk_flags:
            print(f"Active Flags: {', '.join(result.risk_flags)}")

        if result.contributing_factors:
            print("Contributing Factors:")
            for factor in result.contributing_factors[:4]:
                print(f"  * {factor}")

        print(f"Suggested Supports:")
        for s in result.suggested_support[:3]:
            print(f"  -> {s}")

        print()
        print("=" * 75)
        print()


if __name__ == "__main__":
    run_demo()
