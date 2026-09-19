import React from 'react';
import { HelpCircle, Info, Sparkles } from 'lucide-react';

export default function ExplainabilityCard({ explainability = [], confidence = 85 }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm warm-card-hover space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3.5 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Why was this detected? (Model Explainability)</h3>
            <p className="text-[11px] text-slate-500">Transparent AI feature attribution & confidence metrics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Overall AI Confidence:</span>
          <span className="font-extrabold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-mono">
            {confidence}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {explainability.map((item, idx) => (
          <div key={idx} className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                <span>Detected Indicator: </span>
                <span className="ml-1.5 text-amber-800">{item.indicator}</span>
              </span>

              <div className="flex items-center space-x-2 text-[11px]">
                <span className="bg-slate-200/60 text-slate-700 font-medium px-2.5 py-0.5 rounded-full">
                  Category: {item.category}
                </span>
                <span className="bg-emerald-100/80 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Confidence: {item.confidence}%
                </span>
              </div>
            </div>

            {item.matched_term && (
              <div className="text-xs text-slate-700 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200/70">
                <span className="text-slate-400 font-sans font-medium">Matched Key Snippet / Metric: </span>
                <span className="text-amber-800 font-bold">{item.matched_term}</span>
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-700 font-semibold">Evidence Rationale: </strong>
              {item.rationale}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">Human Decision Support Disclaimer: </strong>
          AI indicators are decision-support tools based on linguistic & acoustic patterns and must be reviewed by an authorized human professional prior to taking formal actions.
        </p>
      </div>
    </div>
  );
}
