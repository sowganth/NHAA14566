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

  const distressScore = result?.emotion_scores?.distress ?? 0;
  const summaryTone = distressScore >= 75 ? 'Urgent Intervention Required' : distressScore >= 50 ? 'Moderate Concern' : 'Low to Moderate Concern';

  return (
    <div className="space-y-6 p-1 sm:p-2">
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-700 p-6 rounded-2xl border border-violet-300/30 shadow-[0_18px_45px_rgba(168,85,247,0.35)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-200/20 text-violet-100 rounded-xl border border-violet-200/30 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Module 1 — Text Narrative Interaction Analysis</h1>
            <p className="text-xs text-violet-100/80">Multi-lingual NLP psychological distress, trauma, and emotion indicator extraction</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {TEXT_DEMOS.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadDemo(demo)}
              className="px-2.5 py-1.5 bg-slate-950/70 hover:bg-violet-900/90 border border-violet-300/30 hover:border-violet-200/70 text-violet-100 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{demo.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="bg-gradient-to-br from-slate-900/90 via-slate-900 to-violet-950/70 p-6 rounded-2xl border border-violet-500/25 shadow-[0_18px_45px_rgba(15,23,42,0.4)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Interaction Language</label>
            <select
              value={currentLang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="w-full bg-slate-950 border border-violet-500/35 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-violet-400 cursor-pointer"
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
              className="w-full bg-slate-950 border border-violet-500/35 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-400"
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
            className="w-full bg-slate-950 border border-violet-500/35 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="text-consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="rounded bg-slate-950 border-violet-500/35 text-violet-500 cursor-pointer"
          />
          <label htmlFor="text-consent" className="text-xs text-slate-300 cursor-pointer select-none">
            I consent to the confidential processing of this interaction for psychological distress assessment.
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-600 hover:from-violet-400 hover:via-fuchsia-400 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="space-y-6 pt-4 border-t border-slate-700">
          <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 rounded-2xl border border-violet-500/30 p-5 shadow-[0_18px_45px_rgba(91,33,182,0.22)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200 font-semibold">Assessment summary</p>
                <h2 className="mt-1 text-xl font-bold text-white">{summaryTone}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-violet-500/30">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Distress</div>
                  <div className="mt-1 text-lg font-black text-violet-200">{distressScore}%</div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-violet-500/30">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Urgent review</div>
                  <div className={`mt-1 text-sm font-bold ${result.urgent_review ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {result.urgent_review ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
