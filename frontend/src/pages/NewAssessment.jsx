import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import VoiceRecorder from '../components/VoiceRecorder';
import { Play, CheckCircle2, Sparkles, RefreshCw, FileText, Mic } from 'lucide-react';

const INDIAN_STATES = [
  'Tamil Nadu', 'Uttar Pradesh', 'Andhra Pradesh', 'Karnataka',
  'Kerala', 'Maharashtra', 'West Bengal', 'Gujarat', 'Punjab', 'Delhi'
];

const LANGUAGES = [
  'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam',
  'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'English'
];

const DEMO_PRESETS = [
  {
    label: 'Tamil High Fear Threat Complaint (Critical SVI ~78)',
    state: 'Tamil Nadu',
    district: 'Chennai',
    language: 'Tamil',
    input_type: 'text',
    narrative: 'அவர் என்னை தினமும் மிரட்டுகிறார். நான் காவல் நிலையத்திற்கு புகார் அளிக்கச் சென்றால் என்னை கொன்றுவிடுவதாகப் பயமுறுத்துகிறார். வீட்டை விட்டு வெளியே செல்லவும் பயமாக இருக்கிறது. கத்தியைக் காட்டி அச்சுறுத்தினார்.'
  },
  {
    label: 'Hindi Intimidation & Legal Delay Complaint (High SVI ~65)',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    language: 'Hindi',
    input_type: 'text',
    narrative: 'वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है। मुझे अपने और अपने बच्चों के लिए बहुत डर लग रहा है।'
  },
  {
    label: 'English Helpline General Inquiry (Low SVI ~20)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    language: 'English',
    input_type: 'text',
    narrative: 'I am requesting information regarding welfare schemes and legal assistance helpline services under NHAA 14566.'
  }
];

export default function NewAssessment({ selectedLanguage = 'English', setSelectedLanguage }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'voice'
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Chennai');
  const [language, setLanguage] = useState(selectedLanguage || 'Tamil');
  const [narrative, setNarrative] = useState('');

  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0); // 0: idle, 1: M1, 2: M2, 3: M3
  const [result, setResult] = useState(null);

  const applyPreset = (p) => {
    setState(p.state);
    setDistrict(p.district);
    setLanguage(p.language);
    if (setSelectedLanguage) setSelectedLanguage(p.language);
    setNarrative(p.narrative);
  };

  const handleVoiceAnalysisComplete = (voiceResult) => {
    setNarrative(voiceResult.transcript || '');
    if (voiceResult.language && setSelectedLanguage) {
      setSelectedLanguage(voiceResult.language);
    }
  };

  const handleRunAssessment = async (e) => {
    e.preventDefault();
    if (!narrative.trim()) return;

    setRunning(true);
    setStep(1);
    setResult(null);

    try {
      await new Promise(r => setTimeout(r, 400));
      setStep(2);

      await new Promise(r => setTimeout(r, 400));
      setStep(3);

      const res = await api.runFullAssessment({
        state,
        district,
        language,
        input_type: activeTab === 'voice' ? 'voice/text' : 'text',
        narrative
      });

      setResult(res);
      setRunning(false);

      setTimeout(() => {
        navigate(`/cases/${res.case_id}`);
      }, 1500);
    } catch (err) {
      alert(`Pipeline execution error: ${err.message}`);
      setRunning(false);
      setStep(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200/70 shadow-sm warm-card-hover">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Run End-to-End Assessment Pipeline</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Module 1 (Interaction NLP) → Module 2 (SVI Engine) → Module 3 (Support & Case Management)
            </p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5 warm-card-hover">
        <span className="text-xs font-bold text-slate-700 block flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
          Quick Fictional Demo Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3.5 py-2 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 text-amber-900 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105"
            >
              ⚡ {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 flex space-x-2 shadow-sm">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>TEXT NARRATIVE INPUT</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-stone-50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>VOICE & SPEECH INPUT</span>
        </button>
      </div>

      {activeTab === 'voice' && (
        <VoiceRecorder
          onAnalysisComplete={handleVoiceAnalysisComplete}
          selectedLanguage={language}
          setSelectedLanguage={(lang) => {
            setLanguage(lang);
            if (setSelectedLanguage) setSelectedLanguage(lang);
          }}
        />
      )}

      {/* Input Form */}
      <form onSubmit={handleRunAssessment} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5 warm-card-hover">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                if (setSelectedLanguage) setSelectedLanguage(e.target.value);
              }}
              className="w-full p-3 bg-stone-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Complainant Interaction Narrative ({language})
          </label>
          <textarea
            rows="5"
            placeholder="Enter complaint narrative or voice transcript text..."
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            required
            className="w-full p-3.5 bg-stone-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/30 focus:outline-none placeholder-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={running}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
        >
          {running ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              Executing Automated Pipeline (Module 1 → 2 → 3)...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Execute Complete Assessment & Save Case
            </>
          )}
        </button>
      </form>

      {/* Progress Execution Steps */}
      {step > 0 && (
        <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-4 shadow-xl border border-stone-800 animate-fade-in">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pipeline Execution Progress</h3>

          <div className="space-y-3 text-xs">
            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${step >= 1 ? 'bg-stone-800 border-stone-700 text-stone-100' : 'opacity-40'}`}>
              <span className="font-bold">MODULE 1: Interaction Analysis (NLP Emotion & Indicators)</span>
              {step > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />}
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${step >= 2 ? 'bg-stone-800 border-stone-700 text-stone-100' : 'opacity-40'}`}>
              <span className="font-bold">MODULE 2: Stress & Vulnerability Index (SVI Calculation & Safety Overrides)</span>
              {step > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step === 2 ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : null}
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${step >= 3 ? 'bg-stone-800 border-stone-700 text-stone-100' : 'opacity-40'}`}>
              <span className="font-bold">MODULE 3: Support Recommendation Pathways & Case Persistence (app.db)</span>
              {result ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step === 3 ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : null}
            </div>
          </div>

          {result && (
            <div className="pt-4 border-t border-stone-800 bg-stone-950 p-4 rounded-xl space-y-2 text-xs">
              <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Case Created & Saved: {result.case_id}
              </div>
              <div className="text-stone-300 font-medium">
                SVI Score: <span className="font-bold text-amber-400">{result.module2.svi}</span> | Risk Category: <span className="font-bold text-rose-400">{result.module2.risk_category}</span>
              </div>
              <p className="text-stone-400 font-medium">Redirecting to Case Details page...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
