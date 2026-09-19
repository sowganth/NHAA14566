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
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Support Actions & Interventions Directory</h1>
            <p className="text-xs text-slate-500 font-medium">Recommended non-clinical support pathways for caseworkers</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden warm-card-hover">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
            <span>Loading support actions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-700 font-bold border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Risk Tier</th>
                  <th className="p-3.5">Human Review</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {cases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-amber-800">{c.case_id}</td>
                    <td className="p-3.5 text-slate-800 font-bold">{c.risk_category} ({c.svi})</td>
                    <td className="p-3.5">
                      {c.human_review_required ? (
                        <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">⚠️ Required</span>
                      ) : (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">✓ Routine</span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{c.status}</td>
                    <td className="p-3.5">
                      <Link to={`/cases/${c.case_id}`} className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] inline-block shadow-sm transition-all">
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
