import React, { useState, useEffect } from 'react';
import { setActiveRole } from '../services/api';
import { UserCheck } from 'lucide-react';

const ROLES = [
  { id: 'ADMIN', label: 'Admin (Full System Access)' },
  { id: 'SUPERVISOR', label: 'Supervisor (Dashboard, Assignment & Audit)' },
  { id: 'CASE_OFFICER', label: 'Case Officer (Case Actions & Referrals)' },
  { id: 'COUNSELLOR', label: 'Counsellor (Counselling Cases)' },
  { id: 'LEGAL_SUPPORT', label: 'Legal Support (Legal Aid Cases)' },
  { id: 'READ_ONLY', label: 'Read-Only Officer (View Only)' },
];

export default function RoleSelector() {
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('nhaa_role') || 'SUPERVISOR');

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setCurrentRole(newRole);
    setActiveRole(newRole);
  };

  return (
    <div className="flex items-center space-x-2 bg-slate-800 text-xs px-3 py-1.5 rounded-md text-slate-200 border border-slate-700">
      <UserCheck className="w-4 h-4 text-amber-400" />
      <span className="font-medium text-slate-300 hidden sm:inline">Active Role:</span>
      <select
        value={currentRole}
        onChange={handleRoleChange}
        className="bg-slate-900 text-amber-300 font-semibold border border-slate-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
      >
        {ROLES.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
