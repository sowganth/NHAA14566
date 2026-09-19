import React from 'react';

export default function ReferralTable({ referrals = [] }) {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-xs text-slate-400">
        No active service referrals created for this case.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-stone-50 text-slate-700 font-bold border-b border-slate-200/80">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Referral Type</th>
            <th className="p-3">Destination Service</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created Date</th>
            <th className="p-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {referrals.map((r) => (
            <tr key={r.id} className="hover:bg-amber-50/40 transition-colors">
              <td className="p-3 font-mono text-slate-400 font-semibold">REF-{r.id}</td>
              <td className="p-3 font-bold text-slate-800">{r.referral_type}</td>
              <td className="p-3 text-slate-600 font-medium">{r.destination}</td>
              <td className="p-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-900 font-bold border border-amber-200">
                  {r.status}
                </span>
              </td>
              <td className="p-3 text-slate-500 font-mono">
                {new Date(r.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td className="p-3 text-slate-500 max-w-xs truncate">{r.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
