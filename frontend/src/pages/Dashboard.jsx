import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ShieldAlert, AlertTriangle, ArrowRight, RefreshCw, PlusCircle, Sparkles, Layers } from 'lucide-react';

export default function Dashboard({ selectedLanguage }) {
  const [summary, setSummary] = useState(null);
  const [humanReviewCases, setHumanReviewCases] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumData, reviewCasesData, casesData] = await Promise.all([
        api.getDashboardSummary(),
        api.getCases({ human_review_required: true, limit: 10 }),
        api.getCases({ limit: 100 })
      ]);
      setSummary(sumData);
      setHumanReviewCases(reviewCasesData);
      setAllCases(casesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-violet-100 text-sm font-semibold bg-slate-900/80 border border-violet-500/20 rounded-2xl px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
          <RefreshCw className="w-5 h-5 animate-spin text-violet-300" />
          <span>Loading NHAA Dashboard metrics...</span>
        </div>
      </div>
    );
  }

  const riskCounts = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
  const statusCounts = {};

  allCases.forEach((c) => {
    if (riskCounts[c.risk_category] !== undefined) riskCounts[c.risk_category]++;
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });

  const riskChartData = [
    { name: 'Critical', count: riskCounts.Critical, fill: '#f43f5e' },
    { name: 'High', count: riskCounts.High, fill: '#f59e0b' },
    { name: 'Moderate', count: riskCounts.Moderate, fill: '#fbbf24' },
    { name: 'Low', count: riskCounts.Low, fill: '#10b981' },
  ];

  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, ' '),
    count
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-purple-800 p-6 rounded-2xl border border-violet-400/30 shadow-[0_18px_45px_rgba(168,85,247,0.18)]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">NHAA Authority & Assessment Dashboard</h1>
            <span className="bg-white/10 text-violet-50 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-violet-200/30">
              Full-Stack Integrated
            </span>
          </div>
          <p className="text-xs text-violet-100/80 mt-1 font-medium">
            Real-Time Stress & Vulnerability Assessment System — National Helpline Against Atrocities (14566)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/new-assessment"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 border border-white/20"
          >
            <PlusCircle className="w-4 h-4" /> Run New Assessment
          </Link>
          <button
            onClick={loadData}
            className="p-2.5 border border-violet-200/30 rounded-xl text-violet-50 hover:bg-white/10 transition-colors cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-400/30 p-4 rounded-2xl text-rose-100 text-xs flex items-center justify-between font-medium">
          <span>{error}</span>
          <button onClick={loadData} className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white rounded-lg font-bold">
            Retry Connection
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Total Cases</span>
          <div className="text-2xl font-black text-white mt-1">{summary?.total_cases || 0}</div>
        </div>
        <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">New Cases</span>
          <div className="text-2xl font-black text-blue-200 mt-1">{summary?.new_cases || 0}</div>
        </div>
        <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider">Under Review</span>
          <div className="text-2xl font-black text-violet-200 mt-1">{summary?.under_review || 0}</div>
        </div>
        <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider">Follow-up Req.</span>
          <div className="text-2xl font-black text-fuchsia-200 mt-1">{summary?.follow_up_required || 0}</div>
        </div>
        <div className="bg-slate-900/80 p-4.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider">High Priority</span>
          <div className="text-2xl font-black text-orange-200 mt-1">{summary?.high_priority || 0}</div>
        </div>
        <div className="bg-rose-900/40 p-4.5 rounded-2xl border border-rose-400/30 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider">Human Review</span>
          <div className="text-2xl font-black text-rose-100 mt-1">{summary?.human_review_required || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 p-5.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <h3 className="text-xs font-bold text-violet-200 uppercase tracking-wider mb-4">Risk Category Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fontSize: 11, fill: '#e2e8f0' }} />
                <YAxis allowDecimals={false} stroke="#cbd5e1" tick={{ fontSize: 11, fill: '#e2e8f0' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#7c3aed', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center font-medium">
            Categorical breakdown computed by SVI Rule Engine (Module 2)
          </p>
        </div>

        <div className="bg-slate-900/80 p-5.5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
          <h3 className="text-xs font-bold text-violet-200 uppercase tracking-wider mb-4">Case Workflow Statuses</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fontSize: 10, fill: '#e2e8f0' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} stroke="#cbd5e1" tick={{ fontSize: 11, fill: '#e2e8f0' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#7c3aed', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center font-medium">
            Active case status distribution across helpline officer queues (Module 3)
          </p>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)] overflow-hidden">
        <div className="p-5 border-b border-violet-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/10 text-rose-300 rounded-xl border border-rose-400/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">Cases Requiring Mandatory Human Review</h2>
          </div>
          <Link to="/cases?human_review_required=true" className="text-xs text-violet-200 font-bold hover:underline flex items-center gap-1">
            View All Pending Reviews <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-300 font-bold border-b border-violet-500/20">
              <tr>
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Language / Location</th>
                <th className="p-3.5">Risk Category & SVI</th>
                <th className="p-3.5">Urgent Safety</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned To</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/10 bg-slate-900/60">
              {humanReviewCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400 font-medium">
                    No active cases requiring human review.
                  </td>
                </tr>
              ) : (
                humanReviewCases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-violet-500/5 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-violet-200">{c.case_id}</td>
                    <td className="p-3.5 text-slate-200 font-medium">
                      <div>{c.language}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{c.district}, {c.state}</div>
                    </td>
                    <td className="p-3.5">
                      <RiskBadge category={c.risk_category} svi={c.svi} />
                    </td>
                    <td className="p-3.5">
                      {c.urgent_safety_indicator ? (
                        <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-200 font-bold text-[10px] rounded-full border border-rose-400/30">
                          ⚡ URGENT SAFETY
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">Standard Review</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 font-mono text-[11px] font-semibold border border-violet-500/20">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">
                      {c.assigned_to ? (
                        <span className="font-mono text-violet-100 font-semibold">{c.assigned_to}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Link
                        to={`/cases/${c.case_id}`}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white rounded-xl font-bold text-[11px] inline-block shadow-sm transition-all"
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
      </div>
    </div>
  );
}
