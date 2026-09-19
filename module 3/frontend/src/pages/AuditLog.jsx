import React, { useState, useEffect } from 'react';
import { module3Api } from '../services/module3Api';
import { Shield, RefreshCw } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await module3Api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900">System Audit Trail Log</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable Chronological Audit Trail of User Operations, Status Modifications & Access Events
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>Loading audit log entries...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 font-sans">
                      No audit log entries recorded.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400">#{l.id}</td>
                      <td className="p-3 text-slate-600">
                        {new Date(l.timestamp).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{l.user_id}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {l.role}
                        </span>
                      </td>
                      <td className="p-3 text-amber-700 font-bold">{l.case_id || '-'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200">
                          {l.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">
                        {l.metadata_json ? JSON.stringify(l.metadata_json) : '-'}
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
