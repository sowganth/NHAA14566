import React from 'react';
import { ShieldCheck, Lock, Globe } from 'lucide-react';
import { t } from '../utils/translations';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Kannada", 
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
];

export default function Header({ selectedLanguage, onLanguageChange }) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-30">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800 text-xs text-slate-400 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>National Health & Victim Support Assistance Framework</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-slate-300">
            <Lock className="w-3 h-3 mr-1 text-emerald-400" /> {t('confidential_badge', selectedLanguage)}
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-amber-400 font-medium">Hackathon Prototype v1.0</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Titles */}
        <div className="flex items-center space-x-3.5">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-2.5 rounded-lg border border-blue-500/30 shadow-inner flex items-center justify-center text-amber-400">
            <div className="text-center font-bold tracking-tight leading-none">
              <div className="text-xs uppercase text-blue-200 font-semibold">NHAA</div>
              <div className="text-lg text-amber-300">14566</div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {t('app_title', selectedLanguage)}
              </h1>
              <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded border border-blue-700/50">
                Module 1
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center mt-0.5">
              <span>{t('app_subtitle', selectedLanguage)}</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-slate-400">Psychological Distress Decision Support</span>
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          {/* Language Selector Dropdown */}
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 shadow-md">
            <Globe className="w-4 h-4 text-blue-400 mr-2 shrink-0" />
            <span className="text-xs text-slate-400 mr-1.5 hidden sm:inline">Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-slate-950 text-slate-100 text-xs font-bold focus:outline-none cursor-pointer border-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white font-medium">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Indicator Badge */}
          <div className="flex items-center bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-medium">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
            <span className="hidden sm:inline">{t('secure_badge', selectedLanguage)}</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </div>
    </header>
  );
}
