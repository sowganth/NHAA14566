import React, { useEffect, useState } from 'react';
import { PlusCircle, FileText, Mic, History, Shield, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import PrivacyNotice from '../components/PrivacyNotice';
import { fetchAssessmentsHistory, fetchDemoCases } from '../services/api';
import { t } from '../utils/translations';

export default function Dashboard({ onNavigate, onSelectAssessment, onLoadDemoCase, selectedLanguage = 'English' }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoadingHistory(true);
      try {
        const data = await fetchAssessmentsHistory();
        setHistory(data || []);
      } catch (err) {
        console.warn('Could not load history list:', err);
      } finally {
        setLoadingHistory(false);
      }
    }
    loadData();
  }, []);

  const totalAssessments = history.length;
  const urgentCount = history.filter((r) => r.urgent_review).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Privacy Disclaimer */}
      <PrivacyNotice selectedLanguage={selectedLanguage} />

      {/* Main 4 Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Assessment */}
        <div
          onClick={() => onNavigate('new-assessment')}
          className="bg-gradient-to-br from-blue-900/60 to-slate-900 border border-blue-700/50 hover:border-blue-500 rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md group-hover:bg-blue-500 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              Start
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors">
              1. {t('nav_new_assessment', selectedLanguage)}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Launch new victim narrative intake session with multi-tab text or voice support.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300">
            <span>Begin Intake</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Text Analysis */}
        <div
          onClick={() => onNavigate('text-analysis')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-slate-400">NLP Engine</span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
              2. {t('nav_text_analysis', selectedLanguage)}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Analyze written complainant narrative for fear, threat & trauma expressions.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400">
            <span>Open Text Intake</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Voice Analysis */}
        <div
          onClick={() => onNavigate('voice-analysis')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              Acoustics
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
              3. {t('nav_voice_analysis', selectedLanguage)}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Extract vocal tremor, speech rate, pause frequency & speech emotion indicators.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-purple-400">
            <span>Open Voice Console</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Previous Assessments */}
        <div
          onClick={() => {
            const el = document.getElementById('history-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
              <History className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold font-mono text-amber-300">{totalAssessments} Logs</span>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
              4. Audit Log History
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Review saved intake assessments, urgent flags, and explainability audit logs.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-400">
            <span>View Audit Logs</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Prominent Demo Case Launcher Box */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-600/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center">
              <span>Quick Hackathon Demonstration Case ({selectedLanguage})</span>
              <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 uppercase font-mono font-bold">
                FICTIONAL DEMONSTRATION DATA
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Instantly load a pre-configured fictional victim narrative case in {selectedLanguage} to test the end-to-end analysis pipeline.
            </p>
          </div>
        </div>
        <button
          onClick={onLoadDemoCase}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all shrink-0 cursor-pointer flex items-center space-x-1.5"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{t('btn_load_demo', selectedLanguage)} ({selectedLanguage})</span>
        </button>
      </div>

      {/* System Statistics Counter Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex items-center space-x-3">
          <div className="p-2 bg-blue-950 text-blue-400 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">{totalAssessments}</div>
            <div className="text-[11px] text-slate-400">Total Assessments</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex items-center space-x-3">
          <div className="p-2 bg-red-950 text-red-400 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-red-400 font-mono">{urgentCount}</div>
            <div className="text-[11px] text-slate-400">Urgent Review Flags</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex items-center space-x-3">
          <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-white font-mono">11</div>
            <div className="text-[11px] text-slate-400">Supported Indian Languages</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex items-center space-x-3">
          <div className="p-2 bg-purple-950 text-purple-400 rounded-lg">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-400 font-mono">Active</div>
            <div className="text-[11px] text-slate-400">Data Minimization Engine</div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div id="history-section" className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center">
            <History className="w-4 h-4 mr-2 text-blue-400" />
            <span>Recent Assessment Audit Log</span>
          </h3>
          <span className="text-xs text-slate-400">Stored in SQLite Audit Database</span>
        </div>

        {loadingHistory ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading audit records...</div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 italic bg-slate-950 rounded-lg border border-slate-800">
            No assessment records logged yet. Run a text or voice analysis to generate an audit log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Case ID</th>
                  <th className="px-3 py-2.5">Date & Time</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Language</th>
                  <th className="px-3 py-2.5">Distress Score</th>
                  <th className="px-3 py-2.5">Human Review</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-850 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-semibold text-white">{rec.case_id}</td>
                    <td className="px-3 py-2.5 text-slate-400 font-mono text-[11px]">
                      {rec.created_at ? rec.created_at.replace('T', ' ').substring(0, 16) : 'Just now'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rec.analysis_type === 'Voice' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {rec.analysis_type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{rec.language}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-white">
                      {rec.emotion_scores?.distress || 0}%
                    </td>
                    <td className="px-3 py-2.5">
                      {rec.urgent_review ? (
                        <span className="bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800 text-[10px]">
                          URGENT REQUIRED
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                          Standard Intake
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => onSelectAssessment(rec)}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-xs underline cursor-pointer"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
