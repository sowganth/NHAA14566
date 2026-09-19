import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';

export default function HumanReviewAlert({ humanReviewRequired, urgentSafetyIndicator }) {
  if (!humanReviewRequired && !urgentSafetyIndicator) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {urgentSafetyIndicator && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-md shadow-sm">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900 tracking-wide">
                URGENT SAFETY REVIEW REQUIRED
              </h3>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                Review the available information and follow the authorized organizational safety protocol immediately. 
                This alert indicates elevated distress or safety factors identified in the initial assessment.
              </p>
            </div>
          </div>
        </div>
      )}

      {humanReviewRequired && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 tracking-wide">
                HUMAN REVIEW REQUIRED
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                This assessment is an AI-generated decision-support result. It is not a medical diagnosis, legal determination, or autonomous police order. 
                An authorized professional officer or counsellor must review the case before taking official action.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
