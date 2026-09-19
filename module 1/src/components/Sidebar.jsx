import React from 'react';
import { LayoutDashboard, FileText, Mic, BarChart3, Shield, PlusCircle } from 'lucide-react';
import { t } from '../utils/translations';

export default function Sidebar({ currentPage, setCurrentPage, selectedLanguage = 'English', hasResults }) {
  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard', selectedLanguage), icon: LayoutDashboard },
    { id: 'new-assessment', label: t('nav_new_assessment', selectedLanguage), icon: PlusCircle },
    { id: 'text-analysis', label: t('nav_text_analysis', selectedLanguage), icon: FileText },
    { id: 'voice-analysis', label: t('nav_voice_analysis', selectedLanguage), icon: Mic },
    { id: 'results', label: t('nav_results', selectedLanguage), icon: BarChart3, badge: hasResults ? 'Active' : null },
    { id: 'privacy', label: t('nav_privacy', selectedLanguage), icon: Shield },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 min-h-[calc(100vh-80px)]">
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 px-3">
          Navigation Menu
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Institutional Seal / Info */}
        <div className="mt-8 p-3.5 bg-slate-800/60 rounded-xl border border-slate-800 text-xs text-slate-400">
          <div className="font-semibold text-slate-200 mb-1 flex items-center">
            <Shield className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <span>NHAA Decision Support</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            {t('app_subtitle', selectedLanguage)}
          </p>
        </div>
      </div>
    </aside>
  );
}
