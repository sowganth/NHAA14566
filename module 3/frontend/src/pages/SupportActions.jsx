import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { module3Api } from '../services/module3Api';
import { FileCheck, Filter, RefreshCw } from 'lucide-react';

export default function SupportActions() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('');

  const loadActions = async () => {
    setLoading(true);
    try {
      const data = await module3Api.getCases({ limit: 100 });
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  // Aggregate support actions across cases
  const allActions = [];
  cases.forEach((c) => {
    if (c.support_actions) {
      c.support_actions.forEach((sa) => {
        allActions.push({ ...sa, case_status: c.status, risk_category: c.risk_category });
      });
    }
  });

  const filtered = allActions.filter((a) => {
    if (filterPriority && a.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">Support Actions Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking Recommended Pathways & Assigned Support Operations
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <label className="font-semibold text-slate-600">Filter Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-1.5 border border-slate-300 rounded bg-white"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MODERATE">MODERATE</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading support actions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Suggested Pathway</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No support actions match criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{a.case_id}</td>
                      <td className="p-3 font-semibold text-slate-800">{a.action_type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                          a.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          a.priority === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {a.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-sm truncate">{a.notes}</td>
                      <td className="p-3">
                        <Link
                          to={`/cases/${a.case_id}`}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold"
                        >
                          Review Case
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
