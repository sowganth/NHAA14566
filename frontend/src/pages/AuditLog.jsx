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
      <div className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-purple-800 p-6 rounded-2xl border border-violet-400/30 shadow-[0_18px_45px_rgba(168,85,247,0.18)] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-200/20 text-violet-100 rounded-xl border border-violet-200/30 shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Immutable System Audit Trail</h1>
            <p className="text-xs text-violet-100/80 font-medium">PII-free action logs for governance and accountability</p>
          </div>
        </div>

        <button onClick={loadData} className="p-2.5 border border-violet-200/30 rounded-xl text-white hover:bg-white/10 cursor-pointer transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-violet-100 text-xs flex items-center justify-center space-x-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
            <span>Fetching audit logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-300 font-bold border-b border-violet-500/20">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">User ID & Role</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-500/10 bg-slate-900/60 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-violet-500/5 transition-colors">
                    <td className="p-3.5 text-slate-400 font-semibold">#{log.id}</td>
                    <td className="p-3.5 text-slate-300">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-bold text-slate-100">
                      {log.user_id} <span className="text-[10px] text-violet-200 font-bold">({log.role})</span>
                    </td>
                    <td className="p-3.5 font-extrabold text-violet-200">{log.action}</td>
                    <td className="p-3.5 text-violet-100 font-bold">{log.case_id || '-'}</td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate text-[11px] font-sans">
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
