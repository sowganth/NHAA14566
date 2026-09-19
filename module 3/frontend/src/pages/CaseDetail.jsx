import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { module3Api } from '../services/module3Api';
import HumanReviewAlert from '../components/HumanReviewAlert';
import RiskBadge from '../components/RiskBadge';
import RecommendationCard from '../components/RecommendationCard';
import CaseTimeline from '../components/CaseTimeline';
import ReferralTable from '../components/ReferralTable';
import { UserPlus, CheckSquare, MessageSquare, ExternalLink, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const CONTROLLED_STATUSES = [
  'NEW', 'UNDER_REVIEW', 'ASSIGNED', 'COUNSELLING_REFERRED',
  'LEGAL_AID_REFERRED', 'MEDICAL_REVIEW', 'POLICE_REVIEW',
  'PROTECTION_REVIEW', 'FOLLOW_UP_REQUIRED', 'RESOLVED', 'CLOSED'
];

export default function CaseDetail() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [statusInput, setStatusInput] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [assignInput, setAssignInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [noteVisibility, setNoteVisibility] = useState('AUTHORIZED_STAFF');

  // Referral Modal states
  const [refType, setRefType] = useState('COUNSELLING');
  const [refDest, setRefDest] = useState('District Legal Services Authority / Counselling Cell');
  const [refNotes, setRefNotes] = useState('');

  const [activeTab, setActiveTab] = useState('overview'); // overview, notes, referrals, audit
  const [actionSuccess, setActionSuccess] = useState('');

  const loadCase = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await module3Api.getCaseDetail(caseId);
      setCaseData(data);
      setStatusInput(data.status);
      setAssignInput(data.assigned_to || '');
    } catch (err) {
      setError(err.message || 'Failed to load case detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
    const handleRoleChange = () => loadCase();
    window.addEventListener('nhaa_role_changed', handleRoleChange);
    return () => window.removeEventListener('nhaa_role_changed', handleRoleChange);
  }, [caseId]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusReason.trim()) {
      alert('Please provide a reason for the status update.');
      return;
    }
    try {
      await module3Api.updateStatus(caseId, statusInput, statusReason);
      setActionSuccess(`Status updated to ${statusInput}`);
      setStatusReason('');
      loadCase();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignInput.trim()) return;
    try {
      await module3Api.assignCase(caseId, assignInput);
      setActionSuccess(`Case assigned to ${assignInput}`);
      loadCase();
    } catch (err) {
      alert(`Error assigning case: ${err.message}`);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    try {
      await module3Api.addNote(caseId, noteInput, noteVisibility);
      setActionSuccess('Note added successfully');
      setNoteInput('');
      loadCase();
    } catch (err) {
      alert(`Error adding note: ${err.message}`);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!refDest.trim()) return;
    try {
      await module3Api.createReferral(caseId, refType, refDest, refNotes);
      setActionSuccess(`Referral created: ${refType}`);
      setRefNotes('');
      loadCase();
    } catch (err) {
      alert(`Error creating referral: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-slate-500 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
          <span>Loading case record {caseId}...</span>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-800 text-sm">
        <h3 className="font-bold text-red-900 mb-1">Case Load Error</h3>
        <p>{error || 'Case not found'}</p>
        <Link to="/cases" className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white rounded text-xs">
          Return to Cases List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link to="/cases" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg font-black text-slate-900">{caseData.case_id}</span>
              <RiskBadge category={caseData.risk_category} svi={caseData.svi} />
              <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono font-bold text-xs">
                {caseData.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              State: {caseData.state} | District: {caseData.district} | Language: {caseData.language}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] bg-amber-50 text-amber-800 px-3 py-1 rounded border border-amber-200 font-semibold">
            DEMO DATA — NOT A REAL CASE
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs font-semibold flex items-center justify-between">
          <span>✓ {actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-950 font-bold">×</button>
        </div>
      )}

      {/* Prominent Human Review Alerts */}
      <HumanReviewAlert
        humanReviewRequired={caseData.human_review_required}
        urgentSafetyIndicator={caseData.urgent_safety_indicator}
      />

      {/* Timeline view */}
      <CaseTimeline status={caseData.status} history={caseData.audit_history} />

      {/* Main Grid: Details vs Officer Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Details & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Module 2 Assessment Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Module 2 SVI Risk Assessment</h3>
              <span className="text-xs text-slate-400 font-mono">Assessment Mode: {caseData.assessment_mode}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Stress Vulnerability Index (SVI)</span>
                <span className="text-2xl font-black text-slate-900">{caseData.svi} / 100</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Risk Category</span>
                <RiskBadge category={caseData.risk_category} />
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Human Review</span>
                <span className="font-semibold text-amber-700">
                  {caseData.human_review_required ? 'Required' : 'Optional'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Urgent Safety</span>
                <span className="font-semibold text-red-700">
                  {caseData.urgent_safety_indicator ? 'Flagged' : 'Normal'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Identified Risk Factors:</span>
              <div className="flex flex-wrap gap-2">
                {caseData.risk_factors.map((rf, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs rounded-md font-medium">
                    • {rf}
                  </span>
                ))}
              </div>
            </div>

            {caseData.narrative_summary && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-1">Interaction Summary (Demo Input):</span>
                <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 italic border border-slate-200">
                  "{caseData.narrative_summary}"
                </div>
              </div>
            )}
          </div>

          {/* Module 3 Support Recommendations */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Module 3 Support Recommendations</h3>
                <p className="text-xs text-slate-500">Transparent decision-support pathways for officer evaluation</p>
              </div>
              <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded font-medium border border-blue-200">
                Rule-Based Engine
              </span>
            </div>

            <div className="space-y-3">
              {caseData.recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} recommendation={rec} />
              ))}
            </div>
          </div>

          {/* Secondary Details Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 flex bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-3 border-b-2 ${activeTab === 'notes' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Case Notes ({caseData.notes.length})
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`px-4 py-3 border-b-2 ${activeTab === 'referrals' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Service Referrals ({caseData.referrals.length})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-3 border-b-2 ${activeTab === 'audit' ? 'border-amber-500 text-slate-900 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Audit History ({caseData.audit_history.length})
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <textarea
                      placeholder="Add authorized officer case note..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      rows="2"
                      className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={noteVisibility}
                        onChange={(e) => setNoteVisibility(e.target.value)}
                        className="text-xs p-1 border border-slate-300 rounded bg-white"
                      >
                        <option value="AUTHORIZED_STAFF">Authorized Staff Only</option>
                        <option value="SUPERVISOR_ONLY">Supervisor Only</option>
                        <option value="PUBLIC_SERVICE">Public Service Log</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded"
                      >
                        Add Case Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2 divide-y divide-slate-100">
                    {caseData.notes.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No case notes added yet.</p>
                    ) : (
                      caseData.notes.map((n) => (
                        <div key={n.id} className="pt-2 text-xs">
                          <div className="flex items-center justify-between text-slate-500 mb-1">
                            <span className="font-mono font-semibold text-slate-700">{n.author_id}</span>
                            <span>{new Date(n.created_at).toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'referrals' && (
                <div className="space-y-4">
                  <ReferralTable referrals={caseData.referrals} />
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Timestamp</th>
                        <th className="p-2">Changed By</th>
                        <th className="p-2">Old Status</th>
                        <th className="p-2">New Status</th>
                        <th className="p-2">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                      {caseData.audit_history.map((h) => (
                        <tr key={h.id}>
                          <td className="p-2 text-slate-500">{new Date(h.timestamp).toLocaleString('en-IN')}</td>
                          <td className="p-2 text-slate-800 font-bold">{h.changed_by}</td>
                          <td className="p-2 text-slate-500">{h.old_status}</td>
                          <td className="p-2 font-bold text-amber-700">{h.new_status}</td>
                          <td className="p-2 text-slate-700 font-sans">{h.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Authorized Officer Actions Panel */}
        <div className="space-y-6">
          {/* Action Panel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-500" /> Authorized Officer Controls
            </h3>

            {/* Status Update Form */}
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Update Controlled Status</label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs font-mono font-semibold focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                {CONTROLLED_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Reason for status change (required)..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-all"
              >
                Update Case Status
              </button>
            </form>

            {/* Case Assignment Form */}
            <form onSubmit={handleAssign} className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-blue-600" /> Assign Officer / Specialist
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Officer ID e.g. OFFICER-001"
                  value={assignInput}
                  onChange={(e) => setAssignInput(e.target.value)}
                  className="flex-1 p-2 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded"
                >
                  Assign
                </button>
              </div>
            </form>

            {/* Create Referral Form */}
            <form onSubmit={handleCreateReferral} className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-purple-600" /> Create Service Referral
              </label>

              <select
                value={refType}
                onChange={(e) => setRefType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="COUNSELLING">Counselling Referral</option>
                <option value="LEGAL_AID">Legal Aid (DLSA)</option>
                <option value="MEDICAL_SUPPORT">Medical Evaluation</option>
                <option value="POLICE_ASSISTANCE">Police Protection Review</option>
                <option value="WITNESS_PROTECTION_REVIEW">Witness Protection Review</option>
                <option value="SOCIAL_SUPPORT">Social Support Pathway</option>
              </select>

              <input
                type="text"
                placeholder="Destination service / agency..."
                value={refDest}
                onChange={(e) => setRefDest(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Referral notes..."
                value={refNotes}
                onChange={(e) => setRefNotes(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded transition-all"
              >
                Create Official Referral
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
