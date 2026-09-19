import React from 'react';
import { ShieldAlert, AlertTriangle, HeartPulse, UserX, FileWarning, CheckCircle2 } from 'lucide-react';

export default function IndicatorCard({ indicators = [], traumaIndicators = [], vulnerabilityIndicators = [], urgentSafetyIndicators = [], urgentReview = false }) {
  return (
    <div className="space-y-6">
      {urgentReview && (
        <div className="bg-gradient-to-r from-red-500 via-rose-600 to-red-600 text-white rounded-2xl p-5 shadow-lg warm-card-hover animate-pulse-glow">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white shadow shrink-0 mt-0.5">
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
        {/* Emotional Indicators */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm warm-card-hover space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Emotional Indicators</h4>
          </div>

          {indicators.length > 0 ? (
            <ul className="space-y-2">
              {indicators.map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No significant emotional distress indicators detected.</p>
          )}
        </div>

        {/* Trauma & Isolation */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-sm warm-card-hover space-y-3">
          <div className="flex items-center space-x-2 border-b border-amber-100 pb-3">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <UserX className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Trauma & Isolation</h4>
          </div>

          {[...traumaIndicators, ...vulnerabilityIndicators].length > 0 ? (
            <ul className="space-y-2">
              {[...traumaIndicators, ...vulnerabilityIndicators].map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No trauma or social isolation indicators detected.</p>
          )}
        </div>

        {/* Urgent Safety Indicators */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-5 shadow-sm warm-card-hover space-y-3">
          <div className="flex items-center space-x-2 border-b border-rose-100 pb-3">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <FileWarning className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900">Urgent Safety Indicators</h4>
          </div>

          {urgentSafetyIndicators.length > 0 ? (
            <ul className="space-y-2">
              {urgentSafetyIndicators.map((ind, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-rose-900 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center space-x-2.5 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No immediate physical safety threats detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
