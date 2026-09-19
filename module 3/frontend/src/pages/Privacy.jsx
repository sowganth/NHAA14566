import React from 'react';
import { Lock, Shield, CheckCircle, AlertTriangle, EyeOff, Server, FileText } from 'lucide-react';

export default function Privacy() {
  const roles = [
    {
      role: 'ADMIN',
      desc: 'Full system administration and system configuration access.',
      perms: ['Full System Admin', 'User Role Assignment', 'All Case Actions', 'Full Audit Log View', 'Configuration Management']
    },
    {
      role: 'SUPERVISOR',
      desc: 'Helpline supervisory oversight, case assignment, review approval & audit viewing.',
      perms: ['Authority Dashboard', 'Case Assignment', 'Human Review Approval', 'Status Updates', 'Full Audit Log']
    },
    {
      role: 'CASE_OFFICER',
      desc: 'Frontline helpline officer assigned to victim case support and referral creation.',
      perms: ['Assigned Cases View', 'Add Case Notes', 'Update Status', 'Create Referrals', 'View Recommendations']
    },
    {
      role: 'COUNSELLOR',
      desc: 'Qualified mental health specialist evaluating psychosocial support pathways.',
      perms: ['Authorized Counselling Cases', 'Add Counselling Notes', 'View Risk Assessment', 'Referral Updates']
    },
    {
      role: 'LEGAL_SUPPORT',
      desc: 'District Legal Services Authority (DLSA) officer handling legal aid pathways.',
      perms: ['Authorized Legal Aid Cases', 'Add Legal Notes', 'DLSA Referral Status Updates']
    },
    {
      role: 'READ_ONLY',
      desc: 'Auditor or read-only public service inspector with restricted view access.',
      perms: ['View Non-Sensitive Aggregates', 'Read-Only Case Index']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Privacy Policy & Role-Based Access Control (RBAC)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Data protection safeguards, role permissions matrix, and ethical AI design guidelines for NHAA 14566
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Neutrality Principles Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" /> Non-Autonomous Ethical AI Design Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg space-y-1">
            <span className="font-bold text-emerald-900 block flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Neutral Assistant Indicators
            </span>
            <p className="text-emerald-800 leading-relaxed">
              The engine produces neutral decision-support indicators such as "High distress indicator detected" or "Potential safety concern identified". It NEVER outputs diagnostic or accusatory assertions.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1">
              <EyeOff className="w-4 h-4 text-slate-600" /> Data Minimization & PII Protection
            </span>
            <p className="text-slate-700 leading-relaxed">
              Complete complaint narratives are restricted to authorized officer case detail views. Dashboard metric endpoints return strictly non-PII aggregate figures. No Aadhaar numbers are collected.
            </p>
          </div>
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => (
            <div key={r.role} className="border border-slate-200 p-4 rounded-lg bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                  {r.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">{r.desc}</p>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Permissions:</span>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  {r.perms.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="text-emerald-600 font-bold">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indian Context & Technical Security */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900">Indian Helpline (NHAA 14566) Safeguards</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-700">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold block text-slate-900 mb-1">11 Indian Languages</span>
            English, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Urdu.
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold block text-slate-900 mb-1">Controlled Geographical Scope</span>
            State and District fields are strictly validated controlled values. Demo data explicitly labeled DEMO DATA.
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold block text-slate-900 mb-1">Immutable Audit Logging</span>
            Every login, view, status change, note, referral, and case assignment generates an audit log record.
          </div>
        </div>
      </div>
    </div>
  );
}
