import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ReferralTable from '../components/ReferralTable';
import { FileQuestion, RefreshCw } from 'lucide-react';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getReferrals();
      setReferrals(data);
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
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Inter-Agency Service Referrals</h1>
            <p className="text-xs text-violet-100/80 font-medium">Track referrals to DLSA legal aid, counselling, medical review, and district nodal officers</p>
          </div>
        </div>

        <button onClick={loadData} className="p-2.5 border border-violet-200/30 rounded-xl text-white hover:bg-white/10 cursor-pointer transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-violet-500/20 shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
        {loading ? (
          <div className="p-8 text-center text-violet-100 text-xs flex items-center justify-center space-x-2 font-medium">
            <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
            <span>Fetching referral records...</span>
          </div>
        ) : (
          <ReferralTable referrals={referrals} />
        )}
      </div>
    </div>
  );
}
