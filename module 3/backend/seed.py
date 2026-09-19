from backend.database.connection import engine, Base, SessionLocal
from backend.services.case_service import CaseService
from backend.services.referral_service import ReferralService

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_demo = CaseService.get_case(db, "DEMO-14566-001")
        if existing_demo:
            print("Database already seeded with demo data.")
            return

        print("Seeding NHAA Module 3 Demo Cases...")

        # 1. DEMO-14566-001 (Critical - Tamil)
        CaseService.create_case(
            db=db,
            case_id="DEMO-14566-001",
            svi=78,
            risk_category="Critical",
            risk_factors=["high fear indicator", "possible intimidation", "high distress indicator"],
            human_review_required=True,
            urgent_safety_indicator=True,
            state="Tamil Nadu",
            district="Chennai",
            language="Tamil",
            input_type="voice/text",
            assessment_mode="demo",
            narrative_summary="DEMO DATA — Complainant reports recurring threats and intimidation in village locality. Expressing high fear.",
            user_id="SYSTEM",
            user_role="SYSTEM"
        )

        # 2. DEMO-14566-002 (High - Hindi)
        CaseService.create_case(
            db=db,
            case_id="DEMO-14566-002",
            svi=65,
            risk_category="High",
            risk_factors=["high distress indicator", "atrocity vulnerability indicator"],
            human_review_required=True,
            urgent_safety_indicator=True,
            state="Uttar Pradesh",
            district="Varanasi",
            language="Hindi",
            input_type="text",
            assessment_mode="demo",
            narrative_summary="DEMO DATA — Complainant seeking legal protection and counselling support following ongoing dispute.",
            user_id="SYSTEM",
            user_role="SYSTEM"
        )
        CaseService.assign_case(db, "DEMO-14566-002", "OFFICER-002", "SUPERVISOR-01", "SUPERVISOR")
        CaseService.update_status(db, "DEMO-14566-002", "UNDER_REVIEW", "Officer began risk review", "OFFICER-002", "CASE_OFFICER")

        # 3. DEMO-14566-003 (Moderate - Telugu)
        CaseService.create_case(
            db=db,
            case_id="DEMO-14566-003",
            svi=45,
            risk_category="Moderate",
            risk_factors=["possible intimidation"],
            human_review_required=True,
            urgent_safety_indicator=False,
            state="Andhra Pradesh",
            district="Visakhapatnam",
            language="Telugu",
            input_type="voice",
            assessment_mode="demo",
            narrative_summary="DEMO DATA — Inquiry regarding legal aid entitlement and local officer contact.",
            user_id="SYSTEM",
            user_role="SYSTEM"
        )
        ReferralService.create_referral(
            db, "DEMO-14566-003", "LEGAL_AID", "District Legal Services Authority", "Referred for legal guidance."
        )
        CaseService.update_status(db, "DEMO-14566-003", "LEGAL_AID_REFERRED", "Referred to DLSA Visakhapatnam", "OFFICER-001", "CASE_OFFICER")

        # 4. DEMO-14566-004 (Low - Kannada)
        CaseService.create_case(
            db=db,
            case_id="DEMO-14566-004",
            svi=22,
            risk_category="Low",
            risk_factors=["general inquiry indicator"],
            human_review_required=False,
            urgent_safety_indicator=False,
            state="Karnataka",
            district="Bengaluru Urban",
            language="Kannada",
            input_type="text",
            assessment_mode="demo",
            narrative_summary="DEMO DATA — Information request on helpline operations and support schemes.",
            user_id="SYSTEM",
            user_role="SYSTEM"
        )

        # 5. DEMO-14566-005 (Critical - Malayalam)
        CaseService.create_case(
            db=db,
            case_id="DEMO-14566-005",
            svi=85,
            risk_category="Critical",
            risk_factors=["high fear indicator", "physical injury indicator", "high distress indicator"],
            human_review_required=True,
            urgent_safety_indicator=True,
            state="Kerala",
            district="Thiruvananthapuram",
            language="Malayalam",
            input_type="voice",
            assessment_mode="demo",
            narrative_summary="DEMO DATA — Urgent safety alert. Complainant reports physical safety threat.",
            user_id="SYSTEM",
            user_role="SYSTEM"
        )
        ReferralService.create_referral(
            db, "DEMO-14566-005", "EMERGENCY_HUMAN_REVIEW", "District Magistrate Safety Officer", "Urgent safety review initiated."
        )

        # 6. DEMO-14566-006 (High - Marathi)
        CaseService.create_case(
            db=db,
            case_id="DEMO-14566-006",
            svi=60,
            risk_category="High",
            risk_factors=["atrocity vulnerability indicator", "possible intimidation"],
            human_review_required=True,
            urgent_safety_indicator=False,
            state="Maharashtra",
            district="Pune",
            language="Marathi",
            input_type="text",
            assessment_mode="demo",
            narrative_summary="DEMO DATA — Support request regarding community social protection.",
            user_id="SYSTEM",
            user_role="SYSTEM"
        )
        CaseService.update_status(db, "DEMO-14566-006", "FOLLOW_UP_REQUIRED", "Scheduled 48hr follow-up", "OFFICER-003", "CASE_OFFICER")

        print("Successfully seeded 6 demo cases for NHAA Module 3!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
