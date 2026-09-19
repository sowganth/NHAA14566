import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import HumanReviewAlert from '../components/HumanReviewAlert';
import RecommendationCard from '../components/RecommendationCard';
import ReferralTable from '../components/ReferralTable';
import CaseTimeline from '../components/CaseTimeline';
import { Shield, ArrowLeft, RefreshCw, UserCheck, MessageSquare, PlusCircle, CheckCircle2, AlertCircle, FileText, Activity } from 'lucide-react';

const STATUS_OPTIONS = [
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
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [assignOfficer, setAssignOfficer] = useState('');
  const [noteText, setNoteText] = useState('');
  const [referralType, setReferralType] = useState('COUNSELLING');
  const [referralDest, setReferralDest] = useState('District Legal Services Authority (DLSA)');
  const [referralNotes, setReferralNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadCase = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCase(caseId);
      setCaseData(data);
      setNewStatus(data.status);
    } catch (err) {
      setError(err.message || 'Failed to load case detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) loadCase();
  }, [caseId]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusReason.trim()) return;
    try {
      await api.updateCaseStatus(caseId, newStatus, statusReason);
      setActionSuccess('Status updated successfully!');
      setStatusReason('');
      loadCase();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignOfficer.trim()) return;
    try {
      await api.assignCase(caseId, assignOfficer);
      setActionSuccess(`Case assigned to ${assignOfficer}!`);
      setAssignOfficer('');
      loadCase();
    } catch (err) {
      alert(`Error assigning case: ${err.message}`);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await api.addCaseNote(caseId, noteText, 'AUTHORIZED_STAFF');
      setActionSuccess('Case note added!');
      setNoteText('');
      loadCase();
    } catch (err) {
      alert(`Error adding note: ${err.message}`);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    try {
      await api.createReferral(caseId, referralType, referralDest, referralNotes);
      setActionSuccess('Referral created!');
      setReferralNotes('');
      loadCase();
    } catch (err) {
      alert(`Error creating referral: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-slate-500 text-sm font-semibold">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
          <span>Loading Case Record {caseId}...</span>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-900 text-sm space-y-4 font-medium">
        <h3 className="font-bold text-rose-950 text-base">Case Record Not Found</h3>
        <p>{error || 'The requested case ID does not exist in the database.'}</p>
        <Link to="/cases" className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Return to Case Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/cases" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Directory
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-800 font-mono">{caseData.case_id}</h1>
            <RiskBadge category={caseData.risk_category} svi={caseData.svi} />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Language: <strong className="text-slate-800">{caseData.language}</strong> | Location: <strong className="text-slate-800">{caseData.district}, {caseData.state}</strong> | Intake Type: <strong className="text-slate-800 uppercase">{caseData.input_type}</strong>
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end space-y-1">
          <span className="text-[11px] text-slate-400 font-mono font-bold">STATUS</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold font-mono text-xs rounded-full border border-amber-200">
            {caseData.status}
          </span>
          {caseData.assigned_to && (
            <span className="text-xs text-slate-600 mt-1 font-mono font-medium">Assigned: {caseData.assigned_to}</span>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between font-bold shadow-sm">
          <span>✓ {actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
        </div>
      )}

      {/* Human Review Alert */}
      <HumanReviewAlert
        humanReviewRequired={caseData.human_review_required}
        urgentSafetyIndicator={caseData.urgent_safety_indicator}
      />

      {/* Lifecycle Timeline */}
      <CaseTimeline status={caseData.status} history={caseData.audit_history} />

      {/* THREE MODULE UNIFIED PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MODULE 1 PANEL */}
        <div className="bg-white p-5.5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">MODULE 1</h3>
              <span className="text-xs font-bold text-slate-800">Interaction & Narrative Analysis</span>
            </div>
          </div>

          <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 space-y-2">
            <span className="text-[11px] text-slate-500 font-semibold block">Intake Narrative Summary:</span>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200/70 font-medium">
              "{caseData.narrative_summary || 'Narrative intake transcript logged.'}"
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Detected Risk Cues:</span>
            <div className="flex flex-wrap gap-1.5">
              {(caseData.risk_factors || []).map((rf, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-stone-100 text-slate-700 text-[11px] rounded-lg font-medium border border-stone-200">
                  • {rf}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MODULE 2 PANEL */}
        <div className="bg-white p-5.5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">MODULE 2</h3>
              <span className="text-xs font-bold text-slate-800">SVI Assessment & Risk Tiers</span>
            </div>
          </div>

          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Stress Vulnerability Index:</span>
              <span className="text-xl font-black font-mono text-amber-800">{caseData.svi} / 100</span>
            </div>
            <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full ${caseData.svi >= 75 ? 'bg-rose-500' : caseData.svi >= 50 ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`}
                style={{ width: `${caseData.svi}%` }}
              ></div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Risk Category:</span>
              <strong className="text-slate-800 font-bold">{caseData.risk_category}</strong>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Human Review Required:</span>
              <strong className={caseData.human_review_required ? 'text-amber-800 font-bold' : 'text-emerald-700 font-bold'}>
                {caseData.human_review_required ? 'YES (Mandatory)' : 'NO'}
              </strong>
            </div>
          </div>
        </div>

        {/* MODULE 3 PANEL */}
        <div className="bg-white p-5.5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">MODULE 3</h3>
              <span className="text-xs font-bold text-slate-800">Support Pathways & Recommendations</span>
            </div>
          </div>

          <div className="space-y-3">
            {(caseData.recommendations || []).map((rec, idx) => (
              <RecommendationCard key={idx} recommendation={rec} />
            ))}
          </div>
        </div>
      </div>

      {/* CASE MANAGEMENT CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 warm-card-hover">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
          Case Management & Officer Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* 1. Update Status */}
          <form onSubmit={handleUpdateStatus} className="bg-stone-50/80 p-4.5 rounded-xl border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-slate-800">1. Update Case Status</h4>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Reason / Justification</label>
              <input
                type="text"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Reason for status change..."
                required
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer">
              Update Status
            </button>
          </form>

          {/* 2. Assign Officer */}
          <form onSubmit={handleAssign} className="bg-stone-50/80 p-4.5 rounded-xl border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-slate-800">2. Assign Case Officer</h4>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Officer Name / ID</label>
              <input
                type="text"
                value={assignOfficer}
                onChange={(e) => setAssignOfficer(e.target.value)}
                placeholder="e.g. OFFICER-TN-042"
                required
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer">
              Assign Officer
            </button>
          </form>

          {/* 3. Add Case Note */}
          <form onSubmit={handleAddNote} className="bg-stone-50/80 p-4.5 rounded-xl border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-slate-800">3. Add Confidential Note</h4>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Note Content</label>
              <textarea
                rows="2"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter confidential case note..."
                required
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer">
              Add Note
            </button>
          </form>
        </div>

        {/* Referral Generation */}
        <form onSubmit={handleCreateReferral} className="bg-stone-50/80 p-4.5 rounded-xl border border-stone-200/80 space-y-3 text-xs">
          <h4 className="font-bold text-slate-800">4. Create Service Referral</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Referral Type</label>
              <select
                value={referralType}
                onChange={(e) => setReferralType(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
              >
                <option value="COUNSELLING">Counselling Referral</option>
                <option value="LEGAL_AID">Legal Aid (DLSA)</option>
                <option value="MEDICAL_SUPPORT">Medical Support</option>
                <option value="POLICE_PROTECTION">Police Liaison / Protection</option>
                <option value="DISTRICT_AUTHORITY">District Authority Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Destination Agency</label>
              <input
                type="text"
                value={referralDest}
                onChange={(e) => setReferralDest(e.target.value)}
                placeholder="e.g. DLSA Chennai Nodal Office"
                required
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 font-medium mb-1">Referral Notes</label>
              <input
                type="text"
                value={referralNotes}
                onChange={(e) => setReferralNotes(e.target.value)}
                placeholder="Additional instructions..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
          <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer">
            Create Official Referral
          </button>
        </form>

        {/* Active Referrals Table */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-700 mb-3">Active Inter-Agency Referrals</h4>
          <ReferralTable referrals={caseData.referrals} />
        </div>
      </div>
    </div>
  );
}
