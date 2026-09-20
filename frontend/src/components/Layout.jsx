import React from 'react';
import Header from './Header';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Layout({ children, role, setRole, language, setLanguage, selectedLanguage, onLanguageChange }) {
  const currentLang = selectedLanguage || language || 'English';
  const handleLangChange = onLanguageChange || setLanguage || (() => {});

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans selection:bg-violet-400 selection:text-slate-950">
      <Header selectedLanguage={currentLang} onLanguageChange={handleLangChange} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        <div className="rounded-3xl border border-violet-500/20 bg-slate-900/40 shadow-[0_24px_80px_rgba(76,29,149,0.22)] backdrop-blur-sm p-2 sm:p-3">
          {children}
        </div>
      </main>
      <footer className="bg-slate-950/90 text-slate-300 text-xs py-5 border-t border-violet-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-violet-300" />
            <span className="font-medium text-slate-200">National Helpline Against Atrocities (NHAA 14566) — AI-Enabled Decision Support</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Human Review Required. Confidential Intake System.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
