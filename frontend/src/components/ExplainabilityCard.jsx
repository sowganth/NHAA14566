import React from 'react';
import { HelpCircle, Info, Sparkles } from 'lucide-react';

export default function ExplainabilityCard({ explainability = [], confidence = 85 }) {
  return (
    <div className="bg-slate-900/80 border border-violet-500/20 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-violet-500/20 pb-3.5 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-violet-500/15 text-violet-200 rounded-xl border border-violet-400/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Why was this detected? (Model Explainability)</h3>
            <p className="text-[11px] text-violet-100/80">Transparent AI feature attribution & confidence metrics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-violet-100/80 font-medium">Overall AI Confidence:</span>
          <span className="font-extrabold text-violet-100 bg-violet-500/15 px-2.5 py-1 rounded-lg border border-violet-400/30 font-mono">
            {confidence}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {explainability.map((item, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-violet-500/20 rounded-xl p-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-violet-100 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-violet-300" />
                <span>Detected Indicator: </span>
                <span className="ml-1.5 text-violet-200">{item.indicator}</span>
              </span>

              <div className="flex items-center space-x-2 text-[11px]">
                <span className="bg-slate-800 text-violet-100 font-medium px-2.5 py-0.5 rounded-full border border-violet-500/20">
                  Category: {item.category}
                </span>
                <span className="bg-emerald-500/10 text-emerald-200 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Confidence: {item.confidence}%
                </span>
              </div>
            </div>

            {item.matched_term && (
              <div className="text-xs text-violet-100 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-violet-500/20">
                <span className="text-violet-200 font-sans font-medium">Matched Key Snippet / Metric: </span>
                <span className="text-violet-100 font-bold">{item.matched_term}</span>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-violet-100 font-semibold">Evidence Rationale: </strong>
              {item.rationale}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-violet-500/10 rounded-xl border border-violet-400/30 text-xs text-violet-100 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-violet-300 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">Human Decision Support Disclaimer: </strong>
          AI indicators are decision-support tools based on linguistic & acoustic patterns and must be reviewed by an authorized human professional prior to taking formal actions.
        </p>
      </div>
    </div>
  );
}
