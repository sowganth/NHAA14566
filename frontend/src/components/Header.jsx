import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Lock, Shield, Activity, Users, PlusCircle, FileCheck, FileText, Mic, FileQuestion, Sparkles } from 'lucide-react';
import RoleSelector from './RoleSelector';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Kannada", 
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
];

export default function Header({ selectedLanguage = 'English', onLanguageChange }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/new-assessment', label: 'New Assessment', icon: PlusCircle },
    { path: '/text-analysis', label: 'Text Analysis', icon: FileText },
    { path: '/voice-analysis', label: 'Voice Analysis', icon: Mic },
    { path: '/cases', label: 'Cases', icon: Users },
    { path: '/support-actions', label: 'Support Actions', icon: FileCheck },
    { path: '/referrals', label: 'Referrals', icon: FileQuestion },
    { path: '/audit-log', label: 'Audit Log', icon: Shield },
    { path: '/privacy', label: 'Privacy', icon: Lock },
  ];

  return (
    <header className="bg-slate-950/90 border-b border-violet-500/20 sticky top-0 z-50 shadow-[0_12px_30px_rgba(15,23,42,0.4)] transition-all backdrop-blur-xl">
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-700 text-violet-50 px-4 py-1.5 flex items-center justify-between text-xs border-b border-violet-300/20">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide text-violet-50">National Helpline Against Atrocities (NHAA) 14566</span>
          <span className="hidden md:inline text-violet-200/60">|</span>
          <span className="hidden md:inline text-violet-100/80">AI-Enabled Stress & Trauma Assessment System</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-violet-950/60 text-violet-100 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-violet-300/30 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-200" /> DEMO MODE
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" className="flex min-w-0 items-center space-x-3 group">
          <div className="bg-gradient-to-br from-violet-400 via-fuchsia-500 to-purple-600 text-slate-950 px-3 py-1.5 rounded-xl shadow-lg flex items-center justify-center font-extrabold text-sm tracking-wider group-hover:scale-105 transition-transform">
            14566
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-100 leading-snug group-hover:text-violet-300 transition-colors">
              NHAA 14566 Decision Portal
            </h1>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
              Module 1 (NLP) → Module 2 (SVI) → Module 3 (Support Pathways)
            </p>
          </div>
        </Link>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:space-x-3">
          <div className="flex min-w-0 flex-1 items-center bg-slate-900/80 border border-violet-400/40 rounded-xl px-3 py-1.5 text-xs shadow-sm hover:border-violet-300/80 transition-all sm:flex-none">
            <Globe className="w-3.5 h-3.5 text-violet-300 mr-1.5 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="w-full bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer border-none text-xs sm:w-auto"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-slate-100 font-medium">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <RoleSelector />
        </div>
      </div>

      <div className="bg-slate-900/80 px-4 py-1.5 border-t border-violet-500/20">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-0.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-400 to-fuchsia-500 text-slate-950 shadow-sm font-bold scale-[1.02]'
                    : 'text-slate-300 hover:bg-violet-500/10 hover:text-violet-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
