import React from 'react';
import { HelpCircle, Info, ShieldCheck, Sparkles } from 'lucide-react';

export default function ExplainabilityCard({ explainability = [], confidence = 85 }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-md">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Why was this detected? (Model Explainability)</h3>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Overall AI Confidence:</span>
          <span className="font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 font-mono">
            {confidence}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {explainability.map((item, idx) => (
          <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-white flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                <span>Detected Indicator: </span>
                <span className="ml-1 text-blue-300">{item.indicator}</span>
              </span>

              <div className="flex items-center space-x-2 text-[11px]">
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Category: {item.category}
                </span>
                <span className="bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-800">
                  Confidence: {item.confidence}%
                </span>
              </div>
            </div>

            {item.matched_term && (
              <div className="text-xs text-slate-300 font-mono bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800/80">
                <span className="text-slate-400 font-sans">Matched Key Snippet / Metric: </span>
                <span className="text-amber-300 font-semibold">{item.matched_term}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300 font-semibold">Evidence Rationale: </strong>
              {item.rationale}
            </p>
          </div>
        ))}
      </div>

      {/* Mandatory Probabilistic Disclaimer Notice */}
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Probabilistic System Notice: </strong>
          AI indicators are probabilistic models based on linguistic & acoustic patterns and should be reviewed by an authorized human professional prior to taking formal administrative or legal actions.
        </p>
      </div>
    </div>
  );
}
