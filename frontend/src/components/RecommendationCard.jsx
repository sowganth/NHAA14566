import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  const { type, priority, label, requires_human_approval, suggested_action } = recommendation || {};

  let priorityBadge = "bg-stone-100 text-stone-700 font-bold border border-stone-200";
  if (priority === 'URGENT') priorityBadge = "bg-rose-100 text-rose-900 font-black border border-rose-200";
  else if (priority === 'HIGH') priorityBadge = "bg-amber-100 text-amber-900 font-bold border border-amber-200";
  else if (priority === 'MODERATE') priorityBadge = "bg-amber-50 text-amber-800 font-bold border border-amber-200/60";
  else if (priority === 'LOW') priorityBadge = "bg-blue-50 text-blue-800 font-bold border border-blue-200";

  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 shrink-0">
            {requires_human_approval ? (
              <div className="p-1.5 bg-amber-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            ) : (
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">{label}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{suggested_action}</p>
          </div>
        </div>
        <span className={`text-[11px] px-3 py-1 rounded-full shrink-0 ${priorityBadge}`}>
          {priority}
        </span>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="font-mono text-slate-400 font-semibold">TYPE: {type}</span>
        <span className="font-bold">
          {requires_human_approval ? (
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">⚠️ Approval Required</span>
          ) : (
            <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">✓ Auto Pathway</span>
          )}
        </span>
      </div>
    </div>
  );
}
