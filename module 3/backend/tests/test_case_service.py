import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database.connection import Base
from backend.services.case_service import CaseService
from backend.services.referral_service import ReferralService


@pytest.fixture
def db():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


def test_create_and_get_case(db):
    case = CaseService.create_case(
        db=db,
        case_id="TEST-001",
        svi=75,
        risk_category="Critical",
        risk_factors=["high fear indicator"],
        human_review_required=True,
        urgent_safety_indicator=True,
        state="Tamil Nadu",
        district="Chennai",
        language="Tamil"
    )
    assert case.case_id == "TEST-001"
    assert case.status == "NEW"

    detail = CaseService.get_case(db, "TEST-001")
    assert detail is not None
    assert detail["svi"] == 75
    assert len(detail["recommendations"]) > 0


def test_assign_case(db):
    CaseService.create_case(
        db=db, case_id="TEST-002", svi=50, risk_category="Moderate", risk_factors=[]
    )
    assigned = CaseService.assign_case(db, "TEST-002", "OFFICER-99", "SUPERVISOR-1", "SUPERVISOR")
    assert assigned.assigned_to == "OFFICER-99"
    assert assigned.status == "ASSIGNED"


def test_change_status(db):
    CaseService.create_case(
        db=db, case_id="TEST-003", svi=50, risk_category="Moderate", risk_factors=[]
    )
    updated = CaseService.update_status(db, "TEST-003", "UNDER_REVIEW", "Officer started review", "OFFICER-1", "CASE_OFFICER")
    assert updated.status == "UNDER_REVIEW"

    detail = CaseService.get_case(db, "TEST-003")
    assert len(detail["audit_history"]) >= 2


def test_add_note(db):
    CaseService.create_case(
        db=db, case_id="TEST-004", svi=50, risk_category="Moderate", risk_factors=[]
    )
    note = CaseService.add_note(db, "TEST-004", "Initial review completed", "AUTHORIZED_STAFF", "OFFICER-1", "CASE_OFFICER")
    assert note.note == "Initial review completed"


def test_create_referral(db):
    CaseService.create_case(
        db=db, case_id="TEST-005", svi=50, risk_category="Moderate", risk_factors=[]
    )
    ref = ReferralService.create_referral(db, "TEST-005", "COUNSELLING", "District Hospital", "Notes")
    assert ref.referral_type == "COUNSELLING"
    assert ref.destination == "District Hospital"
