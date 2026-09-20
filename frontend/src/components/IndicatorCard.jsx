import React from 'react';
import { ShieldAlert, AlertTriangle, HeartPulse, UserX, FileWarning, CheckCircle2 } from 'lucide-react';

export default function IndicatorCard({ indicators = [], traumaIndicators = [], vulnerabilityIndicators = [], urgentSafetyIndicators = [], urgentReview = false }) {
  return (
    <div className="space-y-6">
      {urgentReview && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white rounded-2xl p-5 shadow-lg border border-red-400/30">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-xl text-white shadow shrink-0 mt-0.5 border border-white/20">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold tracking-wide uppercase text-white flex items-center gap-2">
                  <span>URGENT HUMAN REVIEW REQUIRED</span>
                </h3>
                <span className="bg-white text-red-700 text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-sm">
                  Priority Alert
                </span>
              </div>
              <p className="text-xs font-semibold text-red-50 mt-1.5 leading-relaxed">
                An AI indicator suggests that this interaction requires immediate human attention. Please follow approved emergency and professional-support protocols.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-violet-500/20 rounded-2xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.3)] space-y-3">
          <div className="flex items-center space-x-2 border-b border-violet-500/20 pb-3">
            <div className="p-1.5 bg-violet-500/15 text-violet-200 rounded-lg border border-violet-400/30">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-100">Emotional Indicators</h4>
          </div>

          {indicators.length > 0 ? (
            <ul className="space-y-2">
              {indicators.map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-violet-100 bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 font-medium">
                  <span className="w-2 h-2 rounded-full bg-violet-400 mt-1 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No significant emotional distress indicators detected.</p>
          )}
        </div>

        <div className="bg-slate-900/80 border border-violet-500/20 rounded-2xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.3)] space-y-3">
          <div className="flex items-center space-x-2 border-b border-violet-500/20 pb-3">
            <div className="p-1.5 bg-violet-500/15 text-violet-200 rounded-lg border border-violet-400/30">
              <UserX className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-100">Trauma & Isolation</h4>
          </div>

          {[...traumaIndicators, ...vulnerabilityIndicators].length > 0 ? (
            <ul className="space-y-2">
              {[...traumaIndicators, ...vulnerabilityIndicators].map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-violet-100 bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 font-medium">
                  <span className="w-2 h-2 rounded-full bg-violet-400 mt-1 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No trauma or social isolation indicators detected.</p>
          )}
        </div>

        <div className="bg-slate-900/80 border border-violet-500/20 rounded-2xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.3)] space-y-3">
          <div className="flex items-center space-x-2 border-b border-violet-500/20 pb-3">
            <div className="p-1.5 bg-violet-500/15 text-violet-200 rounded-lg border border-violet-400/30">
              <FileWarning className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-100">Urgent Safety Indicators</h4>
          </div>

          {urgentSafetyIndicators.length > 0 ? (
            <ul className="space-y-2">
              {urgentSafetyIndicators.map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-rose-100 font-bold bg-rose-500/10 p-2.5 rounded-xl border border-rose-400/30">
                  <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center space-x-2.5 p-3 bg-emerald-500/10 rounded-xl border border-emerald-400/30 text-xs text-emerald-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>No immediate physical safety threats detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
