import React from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';

export default function CaseTimeline({ status, history = [] }) {
  const steps = [
    { key: 'CREATED', label: 'Case Created' },
    { key: 'M1', label: 'AI Interaction Analysis' },
    { key: 'M2', label: 'SVI Assessment' },
    { key: 'REVIEW', label: 'Human Review' },
    { key: 'REFERRAL', label: 'Referral Initiated' },
    { key: 'FOLLOWUP', label: 'Follow-up' },
    { key: 'CLOSED', label: 'Resolved / Closed' },
  ];

  const getStepStatus = (stepKey) => {
    if (stepKey === 'CREATED' || stepKey === 'M1' || stepKey === 'M2') return 'completed';
    if (stepKey === 'REVIEW') {
      return status !== 'NEW' ? 'completed' : 'active';
    }
    if (stepKey === 'REFERRAL') {
      return ['COUNSELLING_REFERRED', 'LEGAL_AID_REFERRED', 'MEDICAL_REVIEW', 'POLICE_REVIEW', 'PROTECTION_REVIEW', 'RESOLVED', 'CLOSED'].includes(status) ? 'completed' : 'pending';
    }
    if (stepKey === 'FOLLOWUP') {
      return status === 'FOLLOW_UP_REQUIRED' ? 'active' : (['RESOLVED', 'CLOSED'].includes(status) ? 'completed' : 'pending');
    }
    if (stepKey === 'CLOSED') {
      return ['RESOLVED', 'CLOSED'].includes(status) ? 'completed' : 'pending';
    }
    return 'pending';
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Case Lifecycle Timeline</h3>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 relative">
        {steps.map((step) => {
          const st = getStepStatus(step.key);
          return (
            <div key={step.key} className="flex md:flex-col items-center gap-2 flex-1 relative z-10">
              {st === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-600 bg-white shrink-0" />}
              {st === 'active' && <Clock className="w-5 h-5 text-amber-600 animate-pulse bg-white shrink-0" />}
              {st === 'pending' && <Circle className="w-5 h-5 text-slate-300 bg-white shrink-0" />}

              <span className={`text-xs font-medium text-center ${st === 'completed' ? 'text-slate-800 font-bold' : st === 'active' ? 'text-amber-800 font-bold' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
