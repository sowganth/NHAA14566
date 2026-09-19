import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { module3Api } from '../services/module3Api';
import RiskBadge from '../components/RiskBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, ShieldAlert, Clock, UserCheck, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function Dashboard() {
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
        module3Api.getDashboard(),
        module3Api.getCases({ human_review_required: true, limit: 10 }),
        module3Api.getCases({ limit: 100 })
      ]);
      setSummary(sumData);
      setHumanReviewCases(reviewCasesData);
      setAllCases(casesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleRoleChange = () => loadData();
    window.addEventListener('nhaa_role_changed', handleRoleChange);
    return () => window.removeEventListener('nhaa_role_changed', handleRoleChange);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-slate-500 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
          <span>Loading NHAA Dashboard metrics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-800 text-sm">
        <h3 className="font-bold text-red-900 mb-1">Dashboard Load Error</h3>
        <p>{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Chart data calculations
  const riskCounts = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
  const statusCounts = {};

  allCases.forEach((c) => {
    if (riskCounts[c.risk_category] !== undefined) riskCounts[c.risk_category]++;
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });

  const riskChartData = [
    { name: 'Critical', count: riskCounts.Critical, fill: '#dc2626' },
    { name: 'High', count: riskCounts.High, fill: '#ea580c' },
    { name: 'Moderate', count: riskCounts.Moderate, fill: '#d97706' },
    { name: 'Low', count: riskCounts.Low, fill: '#16a34a' },
  ];

  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace(/_/g, ' '),
    count
  }));

  return (
    <div className="space-y-6">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">NHAA Authority Dashboard</h1>
            <span className="bg-amber-100 text-amber-800 font-semibold text-xs px-2 py-0.5 rounded border border-amber-300">
              Module 3 Decision-Support
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-Time Stress & Vulnerability Assessment Case Management System (Helpline 14566)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to="/new-assessment"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            + Run New Assessment
          </Link>
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Cases</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{summary?.total_cases || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">New Cases</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{summary?.new_cases || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">Under Review</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{summary?.under_review || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-purple-600 uppercase">Follow-up Req.</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{summary?.follow_up_required || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-orange-600 uppercase">High Priority</span>
          <div className="text-2xl font-black text-orange-700 mt-1">{summary?.high_priority || 0}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
          <span className="text-[11px] font-bold text-red-700 uppercase">Human Review</span>
          <div className="text-2xl font-black text-red-800 mt-1">{summary?.human_review_required || 0}</div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Risk Category Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value} Cases`, 'Count']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Decision-support risk category counts based on Module 2 SVI output
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Case Status Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value} Cases`, 'Count']} />
                <Bar dataKey="count" fill="#0f3c5c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Active workflow statuses across helpline officer queues
          </p>
        </div>
      </div>

      {/* Cases Requiring Human Review Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-sm font-bold text-slate-900">Cases Requiring Human Review</h2>
          </div>
          <Link to="/cases?human_review_required=true" className="text-xs text-amber-600 font-semibold hover:underline flex items-center gap-1">
            View All Pending Reviews <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Case ID</th>
                <th className="p-3">Language / State</th>
                <th className="p-3">Risk Category & SVI</th>
                <th className="p-3">Urgent Safety</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {humanReviewCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-500">
                    No active cases requiring human review.
                  </td>
                </tr>
              ) : (
                humanReviewCases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{c.case_id}</td>
                    <td className="p-3 text-slate-700">
                      <div>{c.language}</div>
                      <div className="text-[10px] text-slate-400">{c.district}, {c.state}</div>
                    </td>
                    <td className="p-3">
                      <RiskBadge category={c.risk_category} svi={c.svi} />
                    </td>
                    <td className="p-3">
                      {c.urgent_safety_indicator ? (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded border border-red-300">
                          ⚡ URGENT SAFETY
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard Review</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-medium text-[11px]">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {c.assigned_to ? (
                        <span className="font-mono text-slate-800">{c.assigned_to}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/cases/${c.case_id}`}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-[11px] inline-block"
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
