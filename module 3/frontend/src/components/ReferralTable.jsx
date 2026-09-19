import React from 'react';

export default function ReferralTable({ referrals = [] }) {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
        No active service referrals created for this case.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="p-2.5">ID</th>
            <th className="p-2.5">Referral Type</th>
            <th className="p-2.5">Destination Service</th>
            <th className="p-2.5">Status</th>
            <th className="p-2.5">Created Date</th>
            <th className="p-2.5">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {referrals.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50">
              <td className="p-2.5 font-mono text-slate-500">REF-{r.id}</td>
              <td className="p-2.5 font-medium text-slate-900">{r.referral_type}</td>
              <td className="p-2.5 text-slate-700">{r.destination}</td>
              <td className="p-2.5">
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-50 text-blue-700 font-medium border border-blue-200">
                  {r.status}
                </span>
              </td>
              <td className="p-2.5 text-slate-500">
                {new Date(r.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td className="p-2.5 text-slate-600 max-w-xs truncate">{r.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
