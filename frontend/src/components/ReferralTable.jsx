import React from 'react';

export default function ReferralTable({ referrals = [] }) {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-6 bg-slate-950/60 rounded-xl border border-dashed border-violet-500/30 text-xs text-slate-400">
        No active service referrals created for this case.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-violet-500/20 rounded-xl shadow-sm bg-slate-900/70">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/70 text-slate-300 font-bold border-b border-violet-500/20">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Referral Type</th>
            <th className="p-3">Destination Service</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created Date</th>
            <th className="p-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-violet-500/10 bg-slate-900/60">
          {referrals.map((r) => (
            <tr key={r.id} className="hover:bg-violet-500/5 transition-colors">
              <td className="p-3 font-mono text-slate-300 font-semibold">REF-{r.id}</td>
              <td className="p-3 font-bold text-violet-100">{r.referral_type}</td>
              <td className="p-3 text-slate-300 font-medium">{r.destination}</td>
              <td className="p-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-violet-500/10 text-violet-100 font-bold border border-violet-400/30">
                  {r.status}
                </span>
              </td>
              <td className="p-3 text-slate-400 font-mono">
                {new Date(r.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td className="p-3 text-slate-300 max-w-xs truncate">{r.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
