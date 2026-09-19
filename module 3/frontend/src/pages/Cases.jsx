import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { module3Api } from '../services/module3Api';
import RiskBadge from '../components/RiskBadge';
import { Search, Filter, RefreshCw, X } from 'lucide-react';

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
      const data = await module3Api.getCases({
        search: searchId || undefined,
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
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Case Management Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Searchable & Filterable Case Records across Indian Helpline 14566 Operations
          </p>
        </div>
        <button
          onClick={clearFilters}
          className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1 self-start sm:self-auto"
        >
          <X className="w-3.5 h-3.5" /> Clear All Filters
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Search Case ID</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. DEMO-14566-001"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Risk Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Risk Category</label>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full py-1.5 px-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {RISK_CATEGORIES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Case Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-1.5 px-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Language</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full py-1.5 px-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Toggle Toggles */}
        <div className="flex flex-col justify-end space-y-1">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={humanReviewOnly}
              onChange={(e) => setHumanReviewOnly(e.target.checked)}
              className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-[11px] text-slate-700 font-medium">Human Review Required</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={urgentSafetyOnly}
              onChange={(e) => setUrgentSafetyOnly(e.target.checked)}
              className="rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-[11px] text-slate-700 font-medium text-red-700">Urgent Safety Only</span>
          </label>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>Fetching case records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Risk & SVI</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">State & District</th>
                  <th className="p-3">Assigned Officer</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500">
                      No cases match the specified filters.
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.case_id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{c.case_id}</td>
                      <td className="p-3">
                        <RiskBadge category={c.risk_category} svi={c.svi} />
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-medium text-[11px] border border-slate-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{c.language}</td>
                      <td className="p-3 text-slate-600">
                        {c.district}, {c.state}
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {c.assigned_to || <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="p-3 text-slate-500">
                        {new Date(c.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="p-3">
                        <Link
                          to={`/cases/${c.case_id}`}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-[11px] inline-block"
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
