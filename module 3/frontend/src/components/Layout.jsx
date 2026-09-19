import React from 'react';
import Navbar from './Navbar';
import { ShieldCheck } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>National Helpline Against Atrocities (NHAA 14566) — Decision Support & Case Management System</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Decision-support prototype. Non-autonomous system subject to authorized human review.
          </p>
        </div>
      </footer>
    </div>
  );
}
