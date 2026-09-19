import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Shield, RefreshCw } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Immutable System Audit Trail</h1>
            <p className="text-xs text-slate-500 font-medium">PII-free action logs for governance and accountability</p>
          </div>
        </div>

        <button onClick={loadData} className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-stone-50 cursor-pointer transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden warm-card-hover">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
            <span>Fetching audit logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-700 font-bold border-b border-slate-200/80">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User ID & Role</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 text-slate-400 font-semibold">#{log.id}</td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {log.user_id} <span className="text-[10px] text-amber-800 font-bold">({log.role})</span>
                    </td>
                    <td className="p-3.5 font-extrabold text-blue-700">{log.action}</td>
                    <td className="p-3.5 text-amber-800 font-bold">{log.case_id || '-'}</td>
                    <td className="p-3.5 text-slate-500 max-w-xs truncate text-[11px] font-sans">
                      {JSON.stringify(log.metadata_json || {})}
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
