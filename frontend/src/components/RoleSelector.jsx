import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';

const ROLES = [
  { id: 'SUPERVISOR', label: 'Supervisor (Full Access)' },
  { id: 'CASE_OFFICER', label: 'Case Officer (Actions)' },
  { id: 'ADMIN', label: 'Admin (System Config)' },
  { id: 'COUNSELLOR', label: 'Counsellor' },
  { id: 'LEGAL_SUPPORT', label: 'Legal Support' },
  { id: 'READ_ONLY', label: 'Read-Only' }
];

export default function RoleSelector() {
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('nhaa_role') || 'SUPERVISOR');

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setCurrentRole(newRole);
    localStorage.setItem('nhaa_role', newRole);
  };

  return (
    <div className="flex items-center space-x-1.5 bg-amber-50/80 text-xs px-3 py-1.5 rounded-xl text-slate-800 border border-amber-200/80 shadow-sm hover:border-amber-300 transition-all">
      <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <select
        value={currentRole}
        onChange={handleRoleChange}
        className="bg-transparent text-amber-900 font-bold border-none focus:outline-none cursor-pointer text-xs"
      >
        {ROLES.map((r) => (
          <option key={r.id} value={r.id} className="bg-white text-slate-800 font-medium">
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
