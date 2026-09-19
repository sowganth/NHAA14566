import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import HumanReviewAlert from '../components/HumanReviewAlert';
import IndicatorCard from '../components/IndicatorCard';
import EmotionChart from '../components/EmotionChart';
import ExplainabilityCard from '../components/ExplainabilityCard';
import RecommendationCard from '../components/RecommendationCard';
import { ArrowLeft, RefreshCw, FileText, Activity, Shield } from 'lucide-react';

export default function AssessmentResult() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getCase(caseId);
        setCaseData(data);
      } catch (err) {
        setError(err.message || 'Error loading assessment report.');
      } finally {
        setLoading(false);
      }
    }
    if (caseId) load();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-slate-500 text-sm font-semibold">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
          <span>Loading Assessment Report...</span>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-900 text-sm space-y-3 font-medium">
        <h3 className="font-bold text-rose-950 text-base">Assessment Report Unavailable</h3>
        <p>{error || 'No assessment report found.'}</p>
        <Link to="/new-assessment" className="inline-block px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm">
          Run New Assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-extrabold text-slate-800 font-mono">{caseData.case_id}</h1>
            <RiskBadge category={caseData.risk_category} svi={caseData.svi} />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Language: <strong className="text-slate-800">{caseData.language}</strong> | Location: <strong className="text-slate-800">{caseData.district}, {caseData.state}</strong>
          </p>
        </div>

        <Link
          to={`/cases/${caseData.case_id}`}
          className="px-4.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
        >
          Open Case Detail & Management
        </Link>
      </div>

      <HumanReviewAlert
        humanReviewRequired={caseData.human_review_required}
        urgentSafetyIndicator={caseData.urgent_safety_indicator}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5.5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <span>Module 1: Intake Narrative</span>
          </h3>
          <p className="text-xs text-slate-700 italic bg-stone-50/80 p-4 rounded-xl border border-stone-200/70 font-medium leading-relaxed">
            "{caseData.narrative_summary}"
          </p>
        </div>

        <div className="bg-white p-5.5 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <span>Module 2: SVI Vulnerability Index</span>
          </h3>
          <div className="bg-stone-50/80 p-4.5 rounded-xl border border-stone-200/70 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">SVI Score:</span>
              <strong className="text-amber-800 font-mono text-lg font-black">{caseData.svi} / 100</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Risk Category:</span>
              <strong className="text-slate-800 font-bold">{caseData.risk_category}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm warm-card-hover space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Shield className="w-4 h-4" />
          </div>
          <span>Module 3: Support Recommendations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(caseData.recommendations || []).map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      </div>
    </div>
  );
}
