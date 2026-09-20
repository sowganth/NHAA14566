import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import { Search, RefreshCw, X } from 'lucide-react';

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada',
  'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu'
];

const RISK_CATEGORIES = ['Critical', 'High', 'Moderate', 'Low'];

const STATUSES = [
  'NEW', 'UNDER_REVIEW', 'ASSIGNED', 'COUNSELLING_REFERRED',
  'LEGAL_AID_REFERRED', 'MEDICAL_REVIEW', 'POLICE_REVIEW',
  'PROTECTION_REVIEW', 'FOLLOW_UP_REQUIRED', 'RESOLVED', 'CLOSED'
];

export default function Cases() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchId, setSearchId] = useState(searchParams.get('search') || '');
  const [selectedRisk, setSelectedRisk] = useState(searchParams.get('risk_category') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedLang, setSelectedLang] = useState(searchParams.get('language') || '');
  const [humanReviewOnly, setHumanReviewOnly] = useState(searchParams.get('human_review_required') === 'true');
  const [urgentSafetyOnly, setUrgentSafetyOnly] = useState(searchParams.get('urgent_safety_indicator') === 'true');

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await api.getCases({
        search_case_id: searchId || undefined,
        risk_category: selectedRisk || undefined,
        status: selectedStatus || undefined,
        language: selectedLang || undefined,
        human_review_required: humanReviewOnly ? true : undefined,
        urgent_safety_indicator: urgentSafetyOnly ? true : undefined,
      });
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [searchId, selectedRisk, selectedStatus, selectedLang, humanReviewOnly, urgentSafetyOnly]);

  const clearFilters = () => {
    setSearchId('');
    setSelectedRisk('');
    setSelectedStatus('');
    setSelectedLang('');
    setHumanReviewOnly(false);
    setUrgentSafetyOnly(false);
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-purple-800 p-6 rounded-2xl border border-violet-400/30 shadow-[0_18px_45px_rgba(168,85,247,0.18)]">
        <div>
          <h1 className="text-xl font-bold text-white">Case Management Directory</h1>
          <p className="text-xs text-violet-100/80 mt-1 font-medium">
            Searchable & Filterable Case Records across Indian Helpline 14566 Operations
          </p>
        </div>
        <button
          onClick={clearFilters}
          className="px-3.5 py-2 border border-violet-200/30 rounded-xl text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-1 self-start sm:self-auto cursor-pointer transition-all"
        >
          <X className="w-3.5 h-3.5" /> Clear Filters
        </button>
      </div>

      <div className="bg-slate-900/80 p-5 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 text-xs">
        <div className="lg:col-span-2 relative">
          <label className="block text-[11px] font-bold text-violet-200 mb-1">Search Case ID</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. DEMO-14566-001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2 bg-slate-950 border border-violet-500/30 rounded-xl text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
            <Search className="w-4 h-4 text-violet-200 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-violet-200 mb-1">Risk Category</label>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-violet-500/30 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
          >
            <option value="">All Categories</option>
            {RISK_CATEGORIES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-violet-200 mb-1">Case Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-violet-500/30 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-violet-200 mb-1">Language</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-violet-500/30 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 cursor-pointer"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end space-y-1.5">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={humanReviewOnly}
              onChange={(e) => setHumanReviewOnly(e.target.checked)}
              className="rounded border-violet-400 text-violet-500 focus:ring-violet-500 cursor-pointer"
            />
            <span className="text-[11px] text-violet-100 font-semibold">Human Review Only</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={urgentSafetyOnly}
              onChange={(e) => setUrgentSafetyOnly(e.target.checked)}
              className="rounded border-rose-400 text-rose-500 focus:ring-rose-500 cursor-pointer"
            />
            <span className="text-[11px] text-rose-200 font-bold">Urgent Safety Only</span>
          </label>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-violet-100 text-xs flex items-center justify-center space-x-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
            <span>Fetching case records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-300 font-bold border-b border-violet-500/20">
                <tr>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Risk & SVI</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Language</th>
                  <th className="p-3.5">State & District</th>
                  <th className="p-3.5">Assigned Officer</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-500/10 bg-slate-900/60">
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                      No cases match the specified filters.
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.case_id} className="hover:bg-violet-500/5 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-violet-200">{c.case_id}</td>
                      <td className="p-3.5">
                        <RiskBadge category={c.risk_category} svi={c.svi} />
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 font-mono text-[11px] font-semibold border border-violet-500/20">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-200 font-medium">{c.language}</td>
                      <td className="p-3.5 text-slate-400 font-medium">
                        {c.district}, {c.state}
                      </td>
                      <td className="p-3.5 font-mono text-slate-200 font-semibold">
                        {c.assigned_to || <span className="text-slate-400 italic font-normal">Unassigned</span>}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">
                        {new Date(c.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="p-3.5">
                        <Link
                          to={`/cases/${c.case_id}`}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white rounded-xl font-bold text-[11px] inline-block shadow-sm transition-all"
                        >
                          View Detail
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
