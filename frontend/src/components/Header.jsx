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
    <header className="bg-white border-b border-amber-100 sticky top-0 z-50 shadow-sm transition-all">
      {/* Top Banner */}
      <div className="bg-amber-900 text-amber-100 px-4 py-1.5 flex items-center justify-between text-xs border-b border-amber-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide text-amber-50">National Helpline Against Atrocities (NHAA) 14566</span>
          <span className="hidden md:inline text-amber-400/50">|</span>
          <span className="hidden md:inline text-amber-200/80">AI-Enabled Stress & Trauma Assessment System</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-amber-800/80 text-amber-200 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-amber-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> DEMO MODE
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-3 py-1.5 rounded-xl shadow-md flex items-center justify-center font-extrabold text-sm tracking-wider group-hover:scale-105 transition-transform">
            14566
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-800 leading-snug group-hover:text-amber-700 transition-colors">
              NHAA 14566 Decision Portal
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Module 1 (NLP) → Module 2 (SVI) → Module 3 (Support Pathways)
            </p>
          </div>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center bg-amber-50/80 border border-amber-200/80 rounded-xl px-3 py-1.5 text-xs shadow-sm hover:border-amber-300 transition-all">
            <Globe className="w-3.5 h-3.5 text-amber-700 mr-1.5 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer border-none text-xs"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-white text-slate-800 font-medium">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <RoleSelector />
        </div>
      </div>

      {/* Navigation Links Bar */}
      <div className="bg-stone-50/90 px-4 py-1.5 border-t border-amber-100/70">
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
                    ? 'bg-amber-600 text-white shadow-sm font-bold scale-[1.02]'
                    : 'text-slate-600 hover:bg-amber-100/60 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
