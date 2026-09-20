import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== language) {
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage, language]);

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
    <div className="max-w-5xl mx-auto space-y-6 pb-4">
      <div className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-purple-800 p-6 rounded-2xl border border-violet-400/30 shadow-[0_20px_50px_rgba(168,85,247,0.2)]">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-md shrink-0 backdrop-blur-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">New Assessment — End-to-End Assessment</h1>
            <p className="text-xs text-violet-100/80 mt-0.5 font-medium">
              Module 1 (NLP) → Module 2 (SVI Engine) → Module 3 (Support & Case Management)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 p-5 rounded-2xl border border-violet-500/25 shadow-[0_18px_45px_rgba(15,23,42,0.35)] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-violet-100">
          <Sparkles className="w-4 h-4 text-violet-300" />
          <span>Quick Fictional Demo Presets</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3.5 py-2 bg-slate-950/70 hover:bg-violet-950/80 border border-violet-400/30 text-violet-100 rounded-xl text-[11px] font-semibold transition-all cursor-pointer hover:scale-[1.02] hover:border-violet-300/70"
            >
              <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-violet-300" /> {p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 border border-violet-500/25 rounded-2xl p-1.5 flex space-x-2 shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md'
              : 'text-slate-300 hover:text-violet-100 hover:bg-slate-800/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>TEXT NARRATIVE INPUT</span>
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md'
              : 'text-slate-300 hover:text-violet-100 hover:bg-slate-800/80'
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

      <form onSubmit={handleRunAssessment} className="bg-slate-900/80 p-6 rounded-2xl border border-violet-500/25 shadow-[0_18px_45px_rgba(15,23,42,0.3)] space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-3 bg-slate-950/80 border border-violet-500/30 rounded-xl text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400/40 cursor-pointer"
            >
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 bg-slate-950/80 border border-violet-500/30 rounded-xl text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                if (setSelectedLanguage) setSelectedLanguage(e.target.value);
              }}
              className="w-full p-3 bg-slate-950/80 border border-violet-500/30 rounded-xl text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400/40 cursor-pointer"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Complainant Interaction Narrative ({language})
          </label>
          <textarea
            rows="5"
            placeholder="Enter complaint narrative or voice transcript text..."
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            required
            className="w-full p-3.5 bg-slate-950/80 border border-violet-500/30 rounded-xl text-xs text-slate-100 font-medium focus:ring-2 focus:ring-violet-400/40 focus:outline-none placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            id="consent-check"
            checked={true}
            readOnly
            className="rounded border-violet-400/50 bg-slate-950 text-violet-500 focus:ring-violet-400/40"
          />
          <label htmlFor="consent-check" className="cursor-pointer select-none">
            I consent to the confidential processing of this interaction for psychological distress assessment.
          </label>
        </div>

        <button
          type="submit"
          disabled={running}
          className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 disabled:from-slate-700 disabled:to-slate-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
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

      {step > 0 && (
        <div className="bg-slate-950/90 text-white p-6 rounded-2xl space-y-4 shadow-[0_18px_45px_rgba(15,23,42,0.45)] border border-violet-500/25 animate-fade-in">
          <h3 className="text-xs font-bold text-violet-300 uppercase tracking-wider">Pipeline Execution Progress</h3>

          <div className="space-y-3 text-xs">
            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${step >= 1 ? 'bg-slate-900 border-violet-500/30 text-slate-100' : 'opacity-40 border-slate-700'}`}>
              <span className="font-bold">MODULE 1: Interaction Analysis (NLP Emotion & Indicators)</span>
              {step > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />}
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${step >= 2 ? 'bg-slate-900 border-violet-500/30 text-slate-100' : 'opacity-40 border-slate-700'}`}>
              <span className="font-bold">MODULE 2: Stress & Vulnerability Index (SVI Calculation & Safety Overrides)</span>
              {step > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step === 2 ? <RefreshCw className="w-4 h-4 animate-spin text-violet-300" /> : null}
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-xl border ${step >= 3 ? 'bg-slate-900 border-violet-500/30 text-slate-100' : 'opacity-40 border-slate-700'}`}>
              <span className="font-bold">MODULE 3: Support Recommendation Pathways & Case Persistence (app.db)</span>
              {result ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step === 3 ? <RefreshCw className="w-4 h-4 animate-spin text-violet-300" /> : null}
            </div>
          </div>

          {result && (
            <div className="pt-4 border-t border-violet-500/20 bg-slate-900 p-4 rounded-xl space-y-2 text-xs">
              <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Case Created & Saved: {result.case_id}
              </div>
              <div className="text-slate-300 font-medium">
                SVI Score: <span className="font-bold text-violet-300">{result.module2.svi}</span> | Risk Category: <span className="font-bold text-rose-400">{result.module2.risk_category}</span>
              </div>
              <p className="text-slate-400 font-medium">Redirecting to Case Details page...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
