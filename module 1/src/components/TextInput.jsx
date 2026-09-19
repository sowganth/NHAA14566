import React, { useState } from 'react';
import { FileText, Send, RotateCcw, Sparkles, CheckSquare, Square, AlertCircle, Languages } from 'lucide-react';
import { analyzeText } from '../services/api';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Kannada", 
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
];

const SAMPLE_NARRATIVES = {
  English: "My neighbor has been repeatedly threatening my family and following me whenever I go out. He warned that if I inform the police, he will attack my children. I feel completely trapped inside my house with no support system nearby.",
  Tamil: "அவர் என்னை தினமும் மிரட்டுகிறார். நான் காவல் நிலையத்திற்கு புகார் அளிக்கச் சென்றால் என்னை கொன்றுவிடுவதாகப் பயமுறுத்துகிறார். வீட்டை விட்டு வெளியே செல்லவும் பயமாக இருக்கிறது. கத்தியைக் காட்டி அச்சுறுத்தினார். தயவுசெய்து எனக்கு உடனடி உதவி தேவை.",
  Hindi: "वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है। मुझे अपने और अपने बच्चों के लिए बहुत डर लग रहा है। तुरंत मदद चाहिए।",
  Telugu: "అతను నన్ను ప్రతిరోజూ బెదిరిస్తున్నాడు. నేను పోలీసులకు ఫిర్యాదు చేస్తే నన్ను చంపేస్తానని భయపెడుతున్నాడు. అతని వద్ద ఆయుధం కూడా ఉంది. నాకు చాలా భయంగా ఉంది.",
  Kannada: "ಅವನು ನನ್ನನ್ನು ಪ್ರತಿದಿನ ಬೆದರಿಸುತ್ತಿದ್ದಾನೆ. ನಾನು ಪೊಲೀಸ್‌ಗೆ ದೂರು ನೀಡಿದರೆ ನನ್ನನ್ನು ಕೊಲ್ಲುವುದಾಗಿ ಬೆದರಿಕೆ ಹಾಕುತ್ತಿದ್ದಾನೆ. ಅವನ ಬಳಿ ಆಯುಧವೂ ಇದೆ. ನನಗೆ ತುಂಬಾ ಭಯವಾಗುತ್ತಿದೆ.",
  Malayalam: "അവൻ എന്നെ ദിവസവും ഭീഷണിപ്പെടുത്തുന്നു. പോലീസിൽ പരാതി നൽകിയാൽ എന്നെ കൊല്ലുമെന്ന് ഭയപ്പെടുത്തുന്നു. അവന്റെ കയ്യിൽ ആയുധവുമുണ്ട്. എനിക്ക് വളരെ പേടിയാണ്.",
  Marathi: "तो मला रोज धमकी देत आहे. मी पोलिसांत तक्रार केली तर मला मारून टाकण्याची धमकी देत आहे. त्याच्याकडे शस्त्रही आहे. मला खूप भीती वाटत आहे.",
  Bengali: "সে আমাকে প্রতিদিন হুমকি দিচ্ছে। আমি পুলিশে অভিযোগ করলে আমাকে মেরে ফেলার ভয় দেখাচ্ছে। তার কাছে অস্ত্রও আছে। আমার খুব ভয় করছে।",
  Gujarati: "તે મને રોજ ધમકી આપી રહ્યો છે. જો હું પોલીસમાં ફરિયાદ કરીશ તો મને મારી નાખવાની ધમકી આપી રહ્યો છે. તેની પાસે હથિયાર પણ છે. મને ખૂબ ડર લાગે છે.",
  Punjabi: "ਉਹ ਮੈਨੂੰ ਰੋਜ਼ਾਨਾ ਧਮਕਾ ਰਿਹਾ ਹੈ। ਜੇਕਰ ਮੈਂ ਪੁਲਿਸ ਨੂੰ ਸ਼ਿਕਾਇਤ ਕਰਾਂਗਾ ਤਾਂ ਉਹ ਮੈਨੂੰ ਮਾਰਨ ਦੀ ਧਮਕੀ ਦੇ ਰਿਹਾ ਹੈ। ਉਸ ਕੋਲ ਹਥਿਆਰ ਵੀ ਹੈ। ਮੈਨੂੰ ਬਹੁਤ ਡਰ ਲੱਗ ਰਿਹਾ ਹੈ।",
  Urdu: "وہ مجھے روزانہ دھمکی دے رہا ہے۔ اگر میں پولیس میں شکایت کروں گا تو وہ مجھے جان سے مارنے کی دھمکی دے رہا ہے۔ اس کے پاس ہتھیار بھی ہے۔ مجھے بہت خوف محسوس ہو رہا ہے۔"
};

export default function TextInput({ onAnalysisComplete, selectedLanguage, setSelectedLanguage, onError }) {
  const [narrative, setNarrative] = useState('');
  const [caseId, setCaseId] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setValidationError('');
    // Auto populate sample if narrative is empty or already contains demo text
    if (!narrative.trim() || Object.values(SAMPLE_NARRATIVES).includes(narrative.trim())) {
      setNarrative(SAMPLE_NARRATIVES[lang] || SAMPLE_NARRATIVES.English);
      setCaseId(`DEMO-14566-${lang.toUpperCase()}`);
    }
  };

  const handleAnalyze = async () => {
    setValidationError('');

    if (!narrative.trim()) {
      setValidationError('Please enter a victim narrative or click "Load Demo Narrative" to proceed.');
      return;
    }

    if (!consent) {
      setValidationError('User consent is required before processing interaction for assessment.');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeText(narrative, selectedLanguage, caseId, consent);
      onAnalysisComplete(result);
    } catch (err) {
      console.error(err);
      if (onError) onError(err.message || 'Error executing text analysis backend service.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNarrative('');
    setCaseId('');
    setValidationError('');
  };

  const handleLoadDemo = () => {
    const text = SAMPLE_NARRATIVES[selectedLanguage] || SAMPLE_NARRATIVES.English;
    setCaseId(`DEMO-14566-${selectedLanguage.toUpperCase()}`);
    setNarrative(text);
    setConsent(true);
    setValidationError('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Text Narrative Input</h2>
            <p className="text-xs text-slate-400">Analyze written victim interaction for psychological indicators</p>
          </div>
        </div>

        {/* Load Demo Narrative Button */}
        <button
          onClick={handleLoadDemo}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Demo Case ({selectedLanguage})</span>
        </button>
      </div>

      {validationError && (
        <div className="mt-4 p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {/* Row 1: Language Selector & Optional Case ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
              <Languages className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Select Interaction Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer shadow-inner"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white font-medium py-1">
                  {lang}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Language support can be expanded to additional Indian languages and dialects.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Case / Reference ID <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g. NHAA-2026-881"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Narrative Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Victim / Complainant Narrative ({selectedLanguage}) <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={6}
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder={`Please describe what happened in ${selectedLanguage} and how you are feeling...`}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500 placeholder-slate-600 leading-relaxed font-sans"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start space-x-2.5 pt-1">
          <button
            type="button"
            onClick={() => setConsent(!consent)}
            className="mt-0.5 text-blue-400 focus:outline-none cursor-pointer"
          >
            {consent ? (
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
          </button>
          <label className="text-xs text-slate-300 leading-normal cursor-pointer select-none" onClick={() => setConsent(!consent)}>
            I consent to the confidential processing of this narrative interaction for psychological distress and trauma support assessment.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Input</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing NLP Indicators ({selectedLanguage})...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze Text Interaction ({selectedLanguage})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
