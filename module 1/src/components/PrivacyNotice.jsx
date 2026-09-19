import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { t } from '../utils/translations';

export default function PrivacyNotice({ compact = false, selectedLanguage = 'English' }) {
  if (compact) {
    return (
      <div className="bg-blue-950/40 border border-blue-800/60 rounded-lg p-3 text-xs text-blue-200 flex items-start space-x-2.5">
        <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-100">Confidential Processing Notice: </span>
          <span>{t('privacy_notice', selectedLanguage)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800/60 rounded-xl p-4.5 shadow-sm mb-6">
      <div className="flex items-start space-x-3.5">
        <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-700/50 shrink-0 text-blue-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white flex items-center">
            <span>Confidentiality & Non-Clinical Disclaimer</span>
            <span className="ml-2 text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
              Decision Support Prototype
            </span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {t('privacy_notice', selectedLanguage)} AI analysis provides supportive distress indicators for intake assessment and <strong className="text-white">does not replace clinical medical diagnosis</strong>.
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
              Zero Aadhaar / Identity Collection
            </span>
            <span className="flex items-center text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
              Encryption-Ready Intake Architecture
            </span>
            <span className="flex items-center text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
              Human Review Routing Enforced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
