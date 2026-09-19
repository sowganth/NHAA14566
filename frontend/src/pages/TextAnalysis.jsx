import React, { useState } from 'react';
import { api } from '../services/api';
import EmotionChart from '../components/EmotionChart';
import IndicatorCard from '../components/IndicatorCard';
import ExplainabilityCard from '../components/ExplainabilityCard';
import { FileText, Sparkles, AlertCircle, Play } from 'lucide-react';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Kannada", 
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
];

const TEXT_DEMOS = [
  {
    label: "Tamil Threat & Intimidation",
    lang: "Tamil",
    text: "அவர் என்னை தினமும் மிரட்டுகிறார். நான் காவல் நிலையத்திற்கு புகார் அளிக்கச் சென்றால் என்னை கொன்றுவிடுவதாகப் பயமுறுத்துகிறார். வீட்டை விட்டு வெளியே செல்லவும் பயமாக இருக்கிறது. கத்தியைக் காட்டி அச்சுறுத்தினார்."
  },
  {
    label: "Hindi Distress & Harassment",
    lang: "Hindi",
    text: "वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है। मुझे अपने और अपने बच्चों के लिए बहुत डर लग रहा है।"
  },
  {
    label: "English Traumatic Stress Statement",
    lang: "English",
    text: "He threatens me every day and told me he will hurt my family if I report to police. I am terrified to leave my house and have nowhere to go."
  }
];

export default function TextAnalysis({ selectedLanguage = 'English', setSelectedLanguage }) {
  const currentLang = selectedLanguage || 'English';
  const [text, setText] = useState('');
  const [caseId, setCaseId] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleLangChange = (lang) => {
    if (setSelectedLanguage) setSelectedLanguage(lang);
  };

  const loadDemo = (demo) => {
    handleLangChange(demo.lang);
    setText(demo.text);
    setCaseId(`DEMO-TEXT-${demo.lang.toUpperCase()}`);
    setError(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!consent) {
      setError("User consent is required before interaction processing.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeText(text, currentLang, caseId || null, consent);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error analyzing text interaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Module 1 — Text Narrative Interaction Analysis</h1>
            <p className="text-xs text-slate-400">Multi-lingual NLP psychological distress, trauma, & emotion indicator extraction</p>
          </div>
        </div>

        {/* Demo buttons */}
        <div className="flex flex-wrap gap-2">
          {TEXT_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadDemo(demo)}
              className="px-2.5 py-1.5 bg-slate-950 hover:bg-blue-950 border border-slate-800 hover:border-blue-500/50 text-blue-300 rounded text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{demo.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Interaction Language</label>
            <select
              value={currentLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Case / Reference ID (Optional)</label>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g. DEMO-14566-TEXT"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Victim / Complainant Narrative Text ({currentLang})</label>
          <textarea
            rows="5"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Enter intake narrative in ${currentLang}...`}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="text-consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="rounded bg-slate-950 border-slate-700 text-blue-600 cursor-pointer"
          />
          <label htmlFor="text-consent" className="text-xs text-slate-300 cursor-pointer select-none">
            I consent to the confidential processing of this interaction for psychological distress assessment.
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Text NLP ({currentLang})...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Analyze Text Interaction ({currentLang})</span>
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <IndicatorCard
            indicators={result.indicators}
            traumaIndicators={result.trauma_indicators}
            vulnerabilityIndicators={result.vulnerability_indicators}
            urgentSafetyIndicators={result.urgent_safety_indicators}
            urgentReview={result.urgent_review}
          />
          <EmotionChart emotionScores={result.emotion_scores} />
          <ExplainabilityCard explainability={result.explainability} confidence={result.confidence} />
        </div>
      )}
    </div>
  );
}
