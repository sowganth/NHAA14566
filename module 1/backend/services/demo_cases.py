DEMO_CASES = [
    {
        "case_id": "DEMO-14566-001",
        "language": "Tamil",
        "title": "Intimidation & Threat Narrative (Tamil)",
        "input_type": "Text",
        "narrative": "அவர் என்னை தினமும் மிரட்டுகிறார். நான் காவல் நிலையத்திற்கு புகார் அளிக்கச் சென்றால் என்னை கொன்றுவிடுவதாகப் பயமுறுத்துகிறார். வீட்டை விட்டு வெளியே செல்லவும் பயமாக இருக்கிறது. கத்தியைக் காட்டி அச்சுறுத்தினார். தயவுசெய்து எனக்கு உடனடி உதவி தேவை.",
        "label": "FICTIONAL DEMONSTRATION DATA"
    },
    {
        "case_id": "DEMO-14566-002",
        "language": "English",
        "title": "Domestic Intimidation & Isolation (English)",
        "input_type": "Text",
        "narrative": "My neighbor has been repeatedly threatening my family and following me whenever I go out. He warned that if I inform the police, he will attack my children. I feel completely trapped inside my house with no support system nearby.",
        "label": "FICTIONAL DEMONSTRATION DATA"
    },
    {
        "case_id": "DEMO-14566-003",
        "language": "Hindi",
        "title": "Severe Threat & Panic Narrative (Hindi)",
        "input_type": "Voice",
        "narrative": "वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है। मुझे अपने और अपने बच्चों के लिए बहुत डर लग रहा है। तुरंत मदद चाहिए।",
        "label": "FICTIONAL DEMONSTRATION DATA"
    }
]

def get_demo_cases():
    return DEMO_CASES

def get_demo_case_by_id(case_id: str):
    for c in DEMO_CASES:
        if c["case_id"] == case_id:
            return c
    return DEMO_CASES[0]
