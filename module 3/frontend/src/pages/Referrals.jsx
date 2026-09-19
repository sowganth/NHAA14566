import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { module3Api } from '../services/module3Api';
import ReferralTable from '../components/ReferralTable';
import { FileText, RefreshCw, Info } from 'lucide-react';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReferrals = async () => {
    setLoading(true);
    try {
      const data = await module3Api.getReferrals();
      setReferrals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl font-bold text-slate-900">Service Referral Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official Support Pathways for Legal Aid, Counselling, Medical & Authority Review
          </p>
        </div>
        <button
          onClick={loadReferrals}
          className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md text-xs text-amber-900 flex items-start space-x-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Indian Public Service Referral Notice:</span> Service referral destinations use verified District Legal Services Authority (DLSA), State Nodal Counselling Cells, and District Nodal Authorities. All referrals are subject to human officer verification.
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
            <span>Loading referral records...</span>
          </div>
        ) : (
          <ReferralTable referrals={referrals} />
        )}
      </div>
    </div>
  );
}
