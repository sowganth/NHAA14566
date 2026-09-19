import React from 'react';
import { ShieldAlert, AlertTriangle, HeartPulse, UserX, FileWarning, CheckCircle2 } from 'lucide-react';

export default function IndicatorCard({ indicators = [], traumaIndicators = [], vulnerabilityIndicators = [], urgentSafetyIndicators = [], urgentReview = false }) {
  return (
    <div className="space-y-6">
      {/* Prominent Urgent Review Callout Banner if Triggered */}
      {urgentReview && (
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-2 border-red-600 rounded-xl p-5 shadow-xl text-white animate-pulse">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold tracking-wide uppercase text-white flex items-center">
                  <span>URGENT HUMAN REVIEW REQUIRED</span>
                </h3>
                <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                  Priority 1 Alert
                </span>
              </div>
              <p className="text-xs font-semibold text-red-100 mt-1.5 leading-relaxed">
                An AI indicator suggests that this interaction may require immediate attention. Please follow the approved emergency and professional-support protocol.
              </p>
              <div className="mt-3 bg-red-950/80 border border-red-800 rounded-lg p-2.5 text-[11px] text-red-200">
                <strong>Protocol Action:</strong> Immediately route case narrative to an authorized duty counselor or crisis response officer. Do not close intake session without verification.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* A. Emotional Indicators */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <HeartPulse className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">A. Emotional Indicators</h4>
          </div>

          {indicators.length > 0 ? (
            <ul className="space-y-2">
              {indicators.map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No significant emotional distress indicators detected.</p>
          )}
        </div>

        {/* B. Trauma & Vulnerability Indicators */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <UserX className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">B. Trauma & Isolation</h4>
          </div>

          {[...traumaIndicators, ...vulnerabilityIndicators].length > 0 ? (
            <ul className="space-y-2">
              {[...traumaIndicators, ...vulnerabilityIndicators].map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-amber-200 bg-slate-950 p-2 rounded border border-amber-950/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No trauma or social isolation indicators detected.</p>
          )}
        </div>

        {/* C. Urgent Safety Indicators */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <FileWarning className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">C. Urgent Safety Indicators</h4>
          </div>

          {urgentSafetyIndicators.length > 0 ? (
            <ul className="space-y-2">
              {urgentSafetyIndicators.map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-red-200 font-semibold bg-red-950/50 p-2 rounded border border-red-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center space-x-2 p-3 bg-slate-950 rounded border border-slate-800 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No immediate self-harm or weapon safety threats detected in text.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
