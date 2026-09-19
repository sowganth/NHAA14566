import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Shield } from 'lucide-react';

export default function RecommendationCard({ recommendation }) {
  const { type, priority, label, requires_human_approval, suggested_action } = recommendation;

  let priorityBadge = "bg-slate-100 text-slate-700";
  if (priority === 'URGENT') priorityBadge = "bg-red-100 text-red-800 font-bold border border-red-300";
  else if (priority === 'HIGH') priorityBadge = "bg-orange-100 text-orange-800 font-semibold border border-orange-200";
  else if (priority === 'MODERATE') priorityBadge = "bg-amber-100 text-amber-800 border border-amber-200";
  else if (priority === 'LOW') priorityBadge = "bg-blue-100 text-blue-800 border border-blue-200";

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            {requires_human_approval ? (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{suggested_action}</p>
          </div>
        </div>
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full flex-shrink-0 ${priorityBadge}`}>
          {priority}
        </span>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-mono text-slate-400">CATEGORY: {type}</span>
        <span className="flex items-center gap-1 font-medium text-slate-600">
          {requires_human_approval ? (
            <span className="text-amber-700 font-medium">⚠️ Human Approval Required</span>
          ) : (
            <span className="text-emerald-700 font-medium">✓ System Informational</span>
          )}
        </span>
      </div>
    </div>
  );
}
