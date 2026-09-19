import React from 'react';
import { Shield, Lock, EyeOff, FileCheck, Server, UserCheck, AlertCircle, Database } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Privacy, Consent & Data Governance Architecture</h2>
            <p className="text-xs text-slate-400">NHAA 14566 Module 1 Institutional Security Compliance</p>
          </div>
        </div>
      </div>

      {/* Grid of Security Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Principle 1: Data Minimization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2.5 text-blue-400">
            <EyeOff className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">1. Data Minimization & Zero Aadhaar Policy</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The system strictly enforces data minimization. <strong className="text-white">No Aadhaar numbers</strong>, personal identification numbers, or unnecessary identity documents are collected or required. Narrative interactions are analyzed purely for distress indicators.
          </p>
        </div>

        {/* Principle 2: Encryption-Ready Architecture */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <Lock className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">2. Encryption-Ready Intake Architecture</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All text narratives and voice recordings are processed in-memory or over encrypted TLS connections. Database audit logs utilize anonymized case identifier tokens to prevent personal tracking.
          </p>
        </div>

        {/* Principle 3: Role-Based Access Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2.5 text-purple-400">
            <UserCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">3. Role-Based Access Control (RBAC)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Access to detailed interaction transcripts and indicator explainability is restricted to authorized duty counselors, response officers, and verified professional staff.
          </p>
        </div>

        {/* Principle 4: Audit Logging & Secure Retention */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <Database className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">4. Immutable Audit Logging & Secure Deletion</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All intake analysis requests are logged into an SQLite audit table for institutional accountability. Configurable automated retention policies purge temporary audio files upon analysis completion.
          </p>
        </div>
      </div>

      {/* Non-clinical Disclaimer Banner */}
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-5 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <AlertCircle className="w-5 h-5" />
          <span>Non-Clinical Decision Support Compliance Statement</span>
        </div>
        <p className="text-xs text-amber-200 leading-relaxed">
          NHAA 14566 Module 1 is designed exclusively as an <strong>AI Decision-Support Prototype</strong> for victim assistance intake. It provides probabilistic indicators to assist human counselors and <strong>does not claim to diagnose clinical depression, PTSD, or any medical condition</strong>. Automated legal or law enforcement decisions are never made without human review.
        </p>
      </div>
    </div>
  );
}
