import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { module3Api } from '../services/module3Api';
import { Play, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

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
    label: 'Tamil High Fear Complaint (Critical SVI 78)',
    state: 'Tamil Nadu',
    district: 'Chennai',
    language: 'Tamil',
    input_type: 'voice/text',
    narrative: 'I am receiving continuous threats and fear in my village locality. I am scared for my family safety and need immediate help.'
  },
  {
    label: 'Hindi Intimidation & Legal Aid Request (High SVI 65)',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    language: 'Hindi',
    input_type: 'text',
    narrative: 'Ongoing harassment and intimidation regarding land dispute. Requesting legal protection and counselling assistance.'
  },
  {
    label: 'Kannada Helpline Inquiry (Low SVI 22)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    language: 'Kannada',
    input_type: 'text',
    narrative: 'Seeking information on helpline support services and welfare schemes available under NHAA.'
  }
];

export default function NewAssessment() {
  const navigate = useNavigate();

  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Chennai');
  const [language, setLanguage] = useState('Tamil');
  const [inputType, setInputType] = useState('text');
  const [narrative, setNarrative] = useState('');

  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0); // 0: idle, 1: M1, 2: M2, 3: M3
  const [result, setResult] = useState(null);

  const applyPreset = (p) => {
    setState(p.state);
    setDistrict(p.district);
    setLanguage(p.language);
    setInputType(p.input_type);
    setNarrative(p.narrative);
  };

  const handleRunAssessment = async (e) => {
    e.preventDefault();
    if (!narrative.trim()) return;

    setRunning(true);
    setStep(1);
    setResult(null);

    try {
      // Simulate step visual sequence
      await new Promise(r => setTimeout(r, 600));
      setStep(2);

      await new Promise(r => setTimeout(r, 600));
      setStep(3);

      const res = await module3Api.runFullAssessment({
        state,
        district,
        language,
        input_type: inputType,
        narrative
      });

      setResult(res);
      setRunning(false);

      // Auto redirect to case detail after 1.5 seconds
      setTimeout(() => {
        navigate(`/cases/${res.case_id}`);
      }, 1800);
    } catch (err) {
      alert(`Pipeline error: ${err.message}`);
      setRunning(false);
      setStep(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Run End-to-End Assessment Pipeline</h1>
            <p className="text-xs text-slate-500">
              Module 1 (Interaction) → Module 2 (SVI Assessment) → Module 3 (Support Recommendations & Case)
            </p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <span className="text-xs font-semibold text-slate-700 block">Quick Demo Presets:</span>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:border-amber-300 border border-slate-200 text-slate-800 rounded text-xs font-medium transition-all"
            >
              ⚡ {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRunAssessment} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            >
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Input Type</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            >
              <option value="text">Text Narrative</option>
              <option value="voice/text">Voice Transcribed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Complainant Interaction Narrative (Fictional Demo Complaint)
          </label>
          <textarea
            rows="4"
            placeholder="Enter complaint text or voice transcript..."
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            required
            className="w-full p-3 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={running}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-lg shadow transition-all flex items-center justify-center gap-2"
        >
          {running ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Executing Pipeline (Module 1 → 2 → 3)...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Execute Pipeline & Generate Case
            </>
          )}
        </button>
      </form>

      {/* Progress Execution Steps */}
      {step > 0 && (
        <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4 shadow-lg border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Execution Status</h3>

          <div className="space-y-3 text-xs">
            <div className={`flex items-center justify-between p-3 rounded border ${step >= 1 ? 'bg-slate-800 border-slate-700 text-slate-100' : 'opacity-40'}`}>
              <span className="font-semibold">MODULE 1: Interaction Analysis</span>
              {step > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />}
            </div>

            <div className={`flex items-center justify-between p-3 rounded border ${step >= 2 ? 'bg-slate-800 border-slate-700 text-slate-100' : 'opacity-40'}`}>
              <span className="font-semibold">MODULE 2: Stress & Vulnerability Index (SVI)</span>
              {step > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step === 2 ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : null}
            </div>

            <div className={`flex items-center justify-between p-3 rounded border ${step >= 3 ? 'bg-slate-800 border-slate-700 text-slate-100' : 'opacity-40'}`}>
              <span className="font-semibold">MODULE 3: Support Recommendation & Case Creation</span>
              {result ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step === 3 ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : null}
            </div>
          </div>

          {result && (
            <div className="pt-4 border-t border-slate-800 bg-slate-950 p-4 rounded-lg space-y-2 text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Case Created Successfully: {result.case_id}
              </div>
              <div className="text-slate-300">
                SVI Score: <span className="font-bold text-amber-400">{result.module2.svi}</span> | Risk Category: <span className="font-bold text-red-400">{result.module2.risk_category}</span>
              </div>
              <p className="text-slate-400">Redirecting to Case Detail page...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
