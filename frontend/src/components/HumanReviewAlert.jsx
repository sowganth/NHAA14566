import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function HumanReviewAlert({ humanReviewRequired, urgentSafetyIndicator }) {
  if (!humanReviewRequired && !urgentSafetyIndicator) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {urgentSafetyIndicator && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-2xl shadow-sm border-y border-r border-rose-200 text-rose-950 animate-pulse-glow">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
              <ShieldAlert className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-900">
                URGENT SAFETY REVIEW REQUIRED
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed font-medium">
                Elevated distress or safety factors identified in interaction narrative. Review available information and follow authorized organizational safety protocol immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {humanReviewRequired && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm border-y border-r border-amber-200 text-amber-950">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
              <AlertTriangle className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                HUMAN REVIEW REQUIRED
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed font-medium">
                This assessment is an AI decision-support result. It is NOT a clinical medical diagnosis, legal determination, or police order. An authorized professional officer must review the case before taking official action.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
