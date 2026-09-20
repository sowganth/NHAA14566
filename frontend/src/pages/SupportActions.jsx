import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SupportActions() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getCases({ limit: 50 });
        setCases(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-purple-800 p-6 rounded-2xl border border-violet-400/30 shadow-[0_18px_45px_rgba(168,85,247,0.18)] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-200/20 text-violet-100 rounded-xl border border-violet-200/30 shadow-inner">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Support Actions & Interventions Directory</h1>
            <p className="text-xs text-violet-100/80 font-medium">Recommended non-clinical support pathways for caseworkers</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-violet-100 text-xs flex items-center justify-center space-x-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
            <span>Loading support actions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-300 font-bold border-b border-violet-500/20">
                <tr>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Risk Tier</th>
                  <th className="p-3.5">Human Review</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-500/10 bg-slate-900/60">
                {cases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-violet-500/5 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-violet-200">{c.case_id}</td>
                    <td className="p-3.5 text-slate-200 font-bold">{c.risk_category} ({c.svi})</td>
                    <td className="p-3.5">
                      {c.human_review_required ? (
                        <span className="text-amber-200 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">⚠️ Required</span>
                      ) : (
                        <span className="text-emerald-200 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">✓ Routine</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">{c.status}</td>
                    <td className="p-3.5">
                      <Link to={`/cases/${c.case_id}`} className="px-3.5 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white rounded-xl font-bold text-[11px] inline-block shadow-sm transition-all">
                        Review Support
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
